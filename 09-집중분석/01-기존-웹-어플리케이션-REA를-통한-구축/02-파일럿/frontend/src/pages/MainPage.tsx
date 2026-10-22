import { useLocation } from 'react-router-dom'
import { DEMO_NOTICES } from '../data/demo.ts'
import DemoNotice from '../components/DemoNotice.tsx'

export default function MainPage() {
  const { state } = useLocation() as { state?: { notice?: string } }

  return (
    <main>
      <h1>대메뉴</h1>
      {state?.notice && <DemoNotice message={state.notice} />}
      <section aria-label="공지 목록">
        <h2>공지</h2>
        <ul>
          {DEMO_NOTICES.map((notice) => (
            <li key={notice.id}>{notice.title}</li>
          ))}
        </ul>
      </section>
    </main>
  )
}
