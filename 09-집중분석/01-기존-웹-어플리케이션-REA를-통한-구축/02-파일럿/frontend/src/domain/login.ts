export const LIMITS = {
  userId: 10,
  password: 20,
} as const

export interface LoginInput {
  userId: string
  password: string
}

export interface LoginErrors {
  userId?: string
  password?: string
}

// 순수 검증 (설계 §5). 비밀번호는 trim하지 않는다 (spec §6: trim 변형 금지).
export function validateLogin(input: LoginInput): LoginErrors {
  const errors: LoginErrors = {}

  if (input.userId.trim() === '') {
    errors.userId = '아이디를 입력하세요'
  } else if (input.userId.length > LIMITS.userId) {
    errors.userId = `아이디는 ${LIMITS.userId}자 이하여야 합니다`
  }

  if (input.password === '') {
    errors.password = '비밀번호를 입력하세요'
  } else if (input.password.length > LIMITS.password) {
    errors.password = `비밀번호는 ${LIMITS.password}자 이하여야 합니다`
  }

  return errors
}
