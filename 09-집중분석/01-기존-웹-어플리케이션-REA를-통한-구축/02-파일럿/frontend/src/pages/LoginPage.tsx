import { useState, type FormEvent } from 'react'
import TextInput from '../components/TextInput.tsx'
import FieldError from '../components/FieldError.tsx'
import DemoNotice from '../components/DemoNotice.tsx'
import { validateLogin, LIMITS } from '../domain/login.ts'

export default function LoginPage() {
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ userId?: string; password?: string }>({})
  const [demoResult, setDemoResult] = useState<string | null>(null)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const next = validateLogin({ userId, password })
    setErrors(next)
    if (Object.keys(next).length === 0) {
      // F4: 유효 입력에서도 실제 인증은 수행하지 않는다. 네트워크 요청 없음.
      setDemoResult('이 파일럿은 인증을 수행하지 않습니다. 로그인 성공·OTP·업무 데이터가 이어지지 않습니다.')
    } else {
      setDemoResult(null)
    }
  }

  return (
    <main>
      <h1>로그인</h1>
      <DemoNotice message="이 화면은 데모입니다. 실제 인증을 수행하지 않습니다." />
      <form onSubmit={handleSubmit} noValidate>
        <TextInput
          id="userId"
          label="아이디"
          type="text"
          value={userId}
          maxLength={LIMITS.userId}
          errorId={errors.userId ? 'userId-error' : undefined}
          onChange={(v) => setUserId(v)}
        />
        {errors.userId && <FieldError id="userId-error" message={errors.userId} />}

        <TextInput
          id="password"
          label="비밀번호"
          type="password"
          value={password}
          maxLength={LIMITS.password}
          errorId={errors.password ? 'password-error' : undefined}
          onChange={(v) => setPassword(v)}
        />
        {errors.password && <FieldError id="password-error" message={errors.password} />}

        <button type="submit">로그인</button>
      </form>
      {demoResult && <DemoNotice message={demoResult} />}
    </main>
  )
}
