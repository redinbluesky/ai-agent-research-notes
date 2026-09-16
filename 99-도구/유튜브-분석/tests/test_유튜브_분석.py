import sys
import unittest
from pathlib import Path

TOOL_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(TOOL_DIR))

from 유튜브_분석 import 분석_입력자료_생성, 영상_ID_추출, VTT_자막_정리


class 유튜브분석도구테스트(unittest.TestCase):
    def test_여러_유튜브_URL에서_영상_ID를_추출한다(self):
        cases = {
            "https://youtu.be/bQE0d3xET50?si=abc": "bQE0d3xET50",
            "https://www.youtube.com/watch?v=bQE0d3xET50&feature=share": "bQE0d3xET50",
            "https://www.youtube.com/shorts/bQE0d3xET50": "bQE0d3xET50",
            "bQE0d3xET50": "bQE0d3xET50",
        }
        for source, expected in cases.items():
            with self.subTest(source=source):
                self.assertEqual(영상_ID_추출(source), expected)

    def test_잘못된_URL은_오류를_낸다(self):
        with self.assertRaises(ValueError):
            영상_ID_추출("https://example.com/not-youtube")

    def test_VTT에서_태그와_반복_자막을_제거한다(self):
        vtt = """WEBVTT

00:00:00.000 --> 00:00:02.000
<c>안녕하세요</c>

00:00:02.000 --> 00:00:04.000
안녕하세요

00:00:04.000 --> 00:00:06.000
WebMCP를 소개합니다.
"""
        self.assertEqual(VTT_자막_정리(vtt), "안녕하세요\nWebMCP를 소개합니다.")

    def test_VTT에서_겹치는_자동자막을_하나의_문장으로_병합한다(self):
        vtt = """WEBVTT

00:00:00.000 --> 00:00:02.000
여러분 이번 영상에서는 웹 MCP에

00:00:02.000 --> 00:00:04.000
여러분 이번 영상에서는 웹 MCP에 대해서 말씀드립니다

00:00:04.000 --> 00:00:06.000
MCP에 대해서 말씀드립니다
"""
        self.assertEqual(VTT_자막_정리(vtt), "여러분 이번 영상에서는 웹 MCP에 대해서 말씀드립니다")

    def test_메타데이터와_자막으로_분석_입력_Markdown을_생성한다(self):
        metadata = {
            "id": "bQE0d3xET50",
            "title": "WebMCP 소개",
            "channel": "개발동생",
            "upload_date": "20260915",
            "duration": 735,
            "webpage_url": "https://www.youtube.com/watch?v=bQE0d3xET50",
            "chapters": [{"start_time": 0, "title": "인트로"}],
        }
        result = 분석_입력자료_생성(metadata, "첫 번째 문장")
        self.assertIn("# 영상 분석 입력 자료", result)
        self.assertIn("- 제목: WebMCP 소개", result)
        self.assertIn("- 게시일: 2026-09-15", result)
        self.assertIn("- 00:00 — 인트로", result)
        self.assertIn("첫 번째 문장", result)


if __name__ == "__main__":
    unittest.main()
