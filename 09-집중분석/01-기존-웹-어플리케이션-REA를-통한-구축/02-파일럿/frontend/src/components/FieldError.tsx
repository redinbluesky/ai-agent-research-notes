interface FieldErrorProps {
  id: string
  message: string
}

export default function FieldError({ id, message }: FieldErrorProps) {
  return (
    <p id={id} role="alert" className="field-error">
      {message}
    </p>
  )
}
