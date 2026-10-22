import { Link, useLocation, useNavigate } from 'react-router-dom'

const DEMO_MENU = ['공지사항', '자료실', '마이페이지'] as const

export default function AppHeader() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <header className="app-header">
      <Link to="/" className="brand">
        VAATZ 파일럿 <span className="demo-tag">(데모)</span>
      </Link>
      <nav aria-label="주요 메뉴">
        <ul>
          {DEMO_MENU.map((item) => (
            <li key={item}>
              <button
                type="button"
                onClick={() =>
                  navigate('/', {
                    state: { notice: `'${item}' 메뉴는 이 파일럿에서 미구현입니다.` },
                  })
                }
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      {pathname !== '/login' && (
        <button type="button" className="login-entry" onClick={() => navigate('/login')}>
          로그인
        </button>
      )}
    </header>
  )
}
