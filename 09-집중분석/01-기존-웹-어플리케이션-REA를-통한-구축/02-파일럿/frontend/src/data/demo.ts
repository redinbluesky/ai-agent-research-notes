export interface DemoNotice {
  id: number
  title: string
}

// 정적 가상 데이터 (설계 §5). 실제 업무 데이터·계정 정보 없음.
export const DEMO_NOTICES: DemoNotice[] = [
  { id: 1, title: '[가상] 파일럿 데모 공지 1' },
  { id: 2, title: '[가상] 파일럿 데모 공지 2' },
  { id: 3, title: '[가상] 파일럿 데모 공지 3' },
]
