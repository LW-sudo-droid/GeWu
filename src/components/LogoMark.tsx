type LogoMarkProps = {
  size?: number
  className?: string
}

export default function LogoMark({ size = 42, className = '' }: LogoMarkProps) {
  return (
    <span
      className={`logo-mark ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <img
        src={`${import.meta.env.BASE_URL}images/logo-reference.png`}
        alt=""
        style={{
          width: size * 1.8,
          height: size * 2.585,
          left: size * -0.4,
          top: size * -0.3,
        }}
      />
    </span>
  )
}
