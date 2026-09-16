"""YouTube URL에서 분석용 메타데이터·챕터·자막 자료를 만든다."""

from __future__ import annotations

import argparse
import html
import json
import re
import subprocess
from datetime import datetime
from pathlib import Path
from typing import Any
from urllib.parse import parse_qs, urlparse


영상_ID_패턴 = re.compile(r"^[A-Za-z0-9_-]{11}$")


def 영상_ID_추출(URL_또는_ID: str) -> str:
    """표준 URL, 단축 URL, Shorts URL 또는 11자 영상 ID에서 ID를 반환한다."""
    source = URL_또는_ID.strip()
    if 영상_ID_패턴.fullmatch(source):
        return source

    parsed = urlparse(source)
    host = parsed.netloc.lower().removeprefix("www.")
    video_id = ""
    if host == "youtu.be":
        video_id = parsed.path.strip("/").split("/")[0]
    elif host in {"youtube.com", "m.youtube.com", "music.youtube.com"}:
        if parsed.path == "/watch":
            video_id = parse_qs(parsed.query).get("v", [""])[0]
        elif parsed.path.startswith("/shorts/") or parsed.path.startswith("/embed/"):
            video_id = parsed.path.strip("/").split("/")[1]

    if not 영상_ID_패턴.fullmatch(video_id):
        raise ValueError("유효한 YouTube URL 또는 11자 영상 ID를 입력하세요.")
    return video_id


def VTT_자막_정리(VTT_텍스트: str) -> str:
    """VTT 큐에서 시간·태그를 제거하고 자동 자막의 겹침을 병합한다."""
    content = re.sub(r"^WEBVTT[^\n]*(?:\n[^\n]*)*?\n\n", "", VTT_텍스트, count=1)
    captions: list[str] = []

    for block in re.split(r"\n\s*\n", content):
        lines = []
        for line in block.splitlines():
            stripped = line.strip()
            if not stripped or "-->" in stripped or re.fullmatch(r"\d+", stripped):
                continue
            if stripped.startswith(("Kind:", "Language:")):
                continue
            lines.append(stripped)
        caption = html.unescape(re.sub(r"<[^>]+>", "", " ".join(lines))).strip()
        if not caption:
            continue
        if not captions:
            captions.append(caption)
            continue

        previous = captions[-1]
        if caption == previous or caption in previous:
            continue
        if previous in caption:
            captions[-1] = caption
            continue

        previous_words = previous.split()
        caption_words = caption.split()
        overlap = 0
        for count in range(min(len(previous_words), len(caption_words)), 0, -1):
            if previous_words[-count:] == caption_words[:count]:
                overlap = count
                break
        if overlap:
            captions[-1] = " ".join(previous_words + caption_words[overlap:])
        else:
            captions.append(caption)

    return "\n".join(captions)


def _날짜_표시(원본: str | None) -> str:
    if not 원본:
        return "확인되지 않음"
    try:
        return datetime.strptime(원본, "%Y%m%d").strftime("%Y-%m-%d")
    except ValueError:
        return 원본


def _시간_표시(초: float | int | None) -> str:
    seconds = int(초 or 0)
    minutes, seconds = divmod(seconds, 60)
    hours, minutes = divmod(minutes, 60)
    return f"{hours:02d}:{minutes:02d}:{seconds:02d}" if hours else f"{minutes:02d}:{seconds:02d}"


def 분석_입력자료_생성(메타데이터: dict[str, Any], 자막: str) -> str:
    """에이전트가 분석에 바로 사용할 수 있는 Markdown 입력 자료를 만든다."""
    title = 메타데이터.get("title") or 메타데이터.get("fulltitle") or "제목 확인 필요"
    channel = 메타데이터.get("channel") or 메타데이터.get("uploader") or "채널 확인 필요"
    url = 메타데이터.get("webpage_url") or 메타데이터.get("original_url") or ""
    chapters = 메타데이터.get("chapters") or []
    chapter_lines = [
        f"- {_시간_표시(chapter.get('start_time'))} — {chapter.get('title', '제목 없음')}"
        for chapter in chapters
    ]
    chapter_text = "\n".join(chapter_lines) if chapter_lines else "- 제공되지 않음"
    transcript = 자막 if 자막 else "자막을 추출하지 못했습니다. 영상 페이지에서 자막 제공 여부를 확인하세요."

    return f"""# 영상 분석 입력 자료

## 영상 정보
- 제목: {title}
- 채널: {channel}
- 게시일: {_날짜_표시(메타데이터.get('upload_date'))}
- 길이: {_시간_표시(메타데이터.get('duration'))}
- URL: {url}

## 챕터
{chapter_text}

## 정리된 자막
{transcript}
"""


def _명령_실행(command: list[str], working_directory: Path) -> subprocess.CompletedProcess[str]:
    return subprocess.run(command, cwd=working_directory, text=True, capture_output=True, check=False, encoding="utf-8")


def 분석자료_추출(URL_또는_ID: str, 결과_루트: Path) -> Path:
    """yt-dlp로 메타데이터·자동 자막을 받고 분석용 파일 묶음을 생성한다."""
    video_id = 영상_ID_추출(URL_또는_ID)
    result_dir = 결과_루트 / video_id
    result_dir.mkdir(parents=True, exist_ok=True)
    video_url = f"https://www.youtube.com/watch?v={video_id}"

    metadata_run = _명령_실행(["yt-dlp", "--skip-download", "--dump-single-json", video_url], result_dir)
    if metadata_run.returncode != 0:
        raise RuntimeError(f"메타데이터 추출 실패:\n{metadata_run.stderr.strip()}")
    metadata = json.loads(metadata_run.stdout)
    (result_dir / "메타데이터.json").write_text(json.dumps(metadata, ensure_ascii=False, indent=2), encoding="utf-8")

    subtitle_run = _명령_실행(
        [
            "yt-dlp", "--skip-download", "--write-auto-subs", "--sub-langs", "ko,en",
            "--sub-format", "vtt", "-o", "자막-원본.%(ext)s", video_url,
        ],
        result_dir,
    )
    subtitle_files = sorted(result_dir.glob("자막-원본.*.vtt"), key=lambda path: (".ko." not in path.name, path.name))
    transcript = ""
    if subtitle_files:
        original = subtitle_files[0]
        standardized = result_dir / f"자막-원본.{original.suffixes[-2].lstrip('.')}.vtt"
        if original != standardized:
            original.replace(standardized)
            original = standardized
        transcript = VTT_자막_정리(original.read_text(encoding="utf-8"))
        (result_dir / "자막-정리본.md").write_text(f"# 정리된 자막\n\n{transcript}\n", encoding="utf-8")
    else:
        (result_dir / "자막-추출-오류.txt").write_text(
            subtitle_run.stderr.strip() or "자동 자막을 찾지 못했습니다.", encoding="utf-8"
        )

    chapters = metadata.get("chapters") or []
    chapter_text = "\n".join(
        f"- {_시간_표시(chapter.get('start_time'))} — {chapter.get('title', '제목 없음')}" for chapter in chapters
    ) or "- 제공되지 않음"
    (result_dir / "챕터.md").write_text(f"# 챕터\n\n{chapter_text}\n", encoding="utf-8")
    (result_dir / "분석-입력자료.md").write_text(분석_입력자료_생성(metadata, transcript), encoding="utf-8")
    return result_dir


def main() -> int:
    parser = argparse.ArgumentParser(description="YouTube 영상 분석용 메타데이터·챕터·자막 자료를 생성합니다.")
    parser.add_argument("url", help="YouTube URL 또는 11자 영상 ID")
    parser.add_argument("--결과-폴더", default="결과", help="분석 산출물 루트 폴더 (기본값: 결과)")
    args = parser.parse_args()
    try:
        result_dir = 분석자료_추출(args.url, Path(args.결과_폴더))
    except (ValueError, RuntimeError, json.JSONDecodeError) as error:
        print(f"오류: {error}")
        return 1
    print(f"분석 입력 자료 생성 완료: {result_dir / '분석-입력자료.md'}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
