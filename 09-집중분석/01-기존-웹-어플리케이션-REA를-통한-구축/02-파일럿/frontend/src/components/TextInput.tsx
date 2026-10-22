import { LIMITS } from '../domain/login.ts'

interface TextInputProps {
  id: string
  label: string
  type: 'text' | 'password'
  value: string
  maxLength: number
  errorId?: string
  onChange: (value: string) => void
}

export default function TextInput({ id, label, type, value, maxLength, errorId, onChange }: TextInputProps) {
  const limitHint =
    maxLength === LIMITS.userId ? LIMITS.userId : maxLength === LIMITS.password ? LIMITS.password : maxLength
  return (
    <div className="text-input">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        maxLength={maxLength}
        autoComplete="off"
        aria-describedby={errorId}
        aria-invalid={errorId ? true : undefined}
        onChange={(e) => onChange(e.target.value)}
      />
      <span className="input-limit">최대 {limitHint}자</span>
    </div>
  )
}
