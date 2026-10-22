interface DemoNoticeProps {
  message: string
}

export default function DemoNotice({ message }: DemoNoticeProps) {
  return (
    <p role="status" className="demo-notice">
      {message}
    </p>
  )
}
