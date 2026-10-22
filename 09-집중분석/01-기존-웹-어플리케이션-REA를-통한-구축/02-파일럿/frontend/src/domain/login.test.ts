import { describe, expect, it } from 'vitest'
import { validateLogin } from './login.ts'

describe('validateLogin (설계 §4 검증 규칙 · spec §6 경계 사례)', () => {
  it('빈 입력은 항목별 오류', () => {
    expect(validateLogin({ userId: '', password: '' })).toEqual({
      userId: '아이디를 입력하세요',
      password: '비밀번호를 입력하세요',
    })
  })

  it('아이디가 공백뿐이면 오류 (공백만 입력)', () => {
    expect(validateLogin({ userId: '   ', password: 'demo1234' })).toEqual({
      userId: '아이디를 입력하세요',
    })
  })

  it('비밀번호가 빈 문자열이면 오류 (trim하지 않고 빈 값만 오류)', () => {
    // 공백 비밀번호는 '빈 값'이 아니므로 길이 규칙만 통과해야 한다.
    expect(validateLogin({ userId: 'demo1234', password: '    ' })).toEqual({})
  })

  it('아이디 10자 통과 / 11자 오류 (경계)', () => {
    expect(validateLogin({ userId: 'a'.repeat(10), password: 'x' })).toEqual({})
    expect(validateLogin({ userId: 'a'.repeat(11), password: 'x' })).toEqual({
      userId: '아이디는 10자 이하여야 합니다',
    })
  })

  it('비밀번호 20자 통과 / 21자 오류 (경계)', () => {
    expect(validateLogin({ userId: 'demo1234', password: 'x'.repeat(20) })).toEqual({})
    expect(validateLogin({ userId: 'demo1234', password: 'x'.repeat(21) })).toEqual({
      password: '비밀번호는 20자 이하여야 합니다',
    })
  })

  it('유효 입력은 오류 없음 (데모 결과는 화면 책임 — 검증 함수는 인증 판단을 하지 않는다)', () => {
    expect(validateLogin({ userId: 'demo1234', password: 'demo-pass' })).toEqual({})
  })
})
