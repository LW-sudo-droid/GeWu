import { useId } from 'react'

type LogoMarkProps = {
  size?: number
  className?: string
}

export default function LogoMark({ size = 42, className = '' }: LogoMarkProps) {
  const uid = useId().replace(/:/g, '')
  const nucleusGradient = `${uid}-nucleus`
  const nucleusGlow = `${uid}-glow`

  return (
    <span
      className={`logo-mark ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg className="logo-vector" viewBox="0 0 334 316" focusable="false">
        <defs>
          <radialGradient id={nucleusGradient} cx="46%" cy="42%" r="58%">
            <stop offset="0" stopColor="#8fffff" />
            <stop offset="0.18" stopColor="#2cc8d2" />
            <stop offset="0.48" stopColor="#08728b" />
            <stop offset="1" stopColor="#061729" />
          </radialGradient>
          <filter id={nucleusGlow} x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <rect width="334" height="316" fill="#0e273e" />
        <circle cx="165" cy="159" r="129" fill="none" stroke="#1b7189" strokeWidth="2.2" />

        <ellipse cx="165" cy="159" rx="133" ry="65" fill="none" stroke="#36c9d0" strokeWidth="2.4" transform="rotate(-24 165 159)" />
        <ellipse cx="165" cy="159" rx="133" ry="65" fill="none" stroke="#c83b68" strokeWidth="2.4" transform="rotate(24 165 159)" />

        <path d="M73 145 A103 103 0 0 1 132 61" fill="none" stroke="#36bde8" strokeWidth="5" strokeLinecap="round" />
        <path d="M177 56 A103 103 0 0 1 263 147" fill="none" stroke="#438ee8" strokeWidth="5" strokeLinecap="round" />
        <path d="M76 181 A103 103 0 0 0 136 257" fill="none" stroke="#6573c9" strokeWidth="5" strokeLinecap="round" />
        <path d="M155 265 A103 103 0 0 0 255 204" fill="none" stroke="#b35498" strokeWidth="5" strokeLinecap="round" />

        <g stroke="rgba(234,248,255,.5)" strokeWidth="1.4" strokeLinejoin="round">
          <polygon points="165,93 165,162 106,127" fill="#35b9df" />
          <polygon points="165,93 224,127 165,162" fill="#3988e7" />
          <polygon points="224,127 224,196 165,162" fill="#5570c6" />
          <polygon points="224,196 165,230 165,162" fill="#a94e96" />
          <polygon points="165,230 106,196 165,162" fill="#5a7fce" />
          <polygon points="106,196 106,127 165,162" fill="#31c4d4" />
        </g>

        <circle cx="165" cy="162" r="28" fill="#061527" stroke="#06101e" strokeWidth="5" />
        <circle cx="165" cy="162" r="13" fill={`url(#${nucleusGradient})`} filter={`url(#${nucleusGlow})`} />

        <g fill="#67efec" filter={`url(#${nucleusGlow})`}>
          <circle cx="149" cy="28" r="8" />
          <circle cx="282" cy="90" r="8" />
          <circle cx="287" cy="229" r="8" />
          <circle cx="165" cy="296" r="8" />
          <circle cx="47" cy="229" r="8" />
          <circle cx="53" cy="96" r="8" />
        </g>
      </svg>
    </span>
  )
}
