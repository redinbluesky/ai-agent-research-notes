import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import LoginPage from '../pages/LoginPage.tsx'
import TextInput from './TextInput.tsx'

function renderLogin() {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <LoginPage />
    </MemoryRouter>,
  )
}

// 설계 §4 접근성 규약: label 연결 · aria-describedby · 인라인 오류(role=alert) · 텍스트 이름.
describe('로그인 화면 접근성·이름 (AC-A2 요소 계약)', () => {
  it('모든 입력은 text label과 연결되고 text 이름을 가진 버튼이 존재한다', () => {
    renderLogin()
    expect(screen.getByLabelText('아이디')).toBeInTheDocument()
    expect(screen.getByLabelText('비밀번호')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '로그인' })).toBeInTheDocument()
    // 이미지 버튼 아님: img 버튼 없음 (O-003 결함 개선)
    expect(document.querySelectorAll('img[role="button"], button img')).toHaveLength(0)
  })

  it('빈 입력으로 로그인하면 오류가 인라인으로 표시되고 입력과 연결된다', async () => {
    const user = userEvent.setup()
    renderLogin()
    await user.click(screen.getByRole('button', { name: '로그인' }))

    const alerts = screen.getAllByRole('alert')
    expect(alerts).toHaveLength(2)
    expect(alerts[0]).toHaveTextContent('아이디를 입력하세요')
    const userIdInput = screen.getByLabelText('아이디')
    expect(userIdInput).toHaveAttribute('aria-invalid', 'true')
    expect(userIdInput).toHaveAttribute('aria-describedby', 'userId-error')
  })

  it('유효 입력 로그인 시 데모 안내(role=status)가 표시되고 alert은 없다', async () => {
    const user = userEvent.setup()
    renderLogin()
    await user.type(screen.getByLabelText('아이디'), 'demo1234')
    await user.type(screen.getByLabelText('비밀번호'), 'demo-pass')
    await user.click(screen.getByRole('button', { name: '로그인' }))

    const statuses = screen.getAllByRole('status')
    expect(statuses.at(-1)).toHaveTextContent('인증')
    expect(screen.queryAllByRole('alert')).toHaveLength(0)
  })

  it('아이디 10자 경계는 통과하고 데모 안내가 표시된다', async () => {
    const user = userEvent.setup()
    renderLogin()
    await user.type(screen.getByLabelText('아이디'), 'a'.repeat(10))
    await user.type(screen.getByLabelText('비밀번호'), 'x'.repeat(20))
    await user.click(screen.getByRole('button', { name: '로그인' }))
    const statuses = screen.getAllByRole('status')
    expect(statuses.at(-1)).toHaveTextContent('인증')
  })
})

describe('TextInput (역할·속성)', () => {
  it('maxLength·type·describedby 속성이 반영된다', () => {
    render(
      <TextInput id="userId" label="아이디" type="text" value="" maxLength={10} onChange={() => {}} />,
    )
    const input = screen.getByLabelText('아이디')
    expect(input).toHaveAttribute('type', 'text')
    expect(input).toHaveAttribute('maxlength', '10')
    expect(input).toHaveAttribute('autocomplete', 'off')
  })
})
