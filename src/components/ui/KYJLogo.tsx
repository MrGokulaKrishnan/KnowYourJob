interface KYJLogoProps {
  size?: number
  className?: string
}

export function KYJLogo({ size = 32, className }: KYJLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="8" fill="#050505" />
      <path
        d="M8 10L16 6L24 10V22L16 26L8 22V10Z"
        fill="url(#kyj-grad)"
        opacity="0.9"
      />
      <path
        d="M13 14L16 12L19 14V18L16 20L13 18V14Z"
        fill="#050505"
      />
      <defs>
        <linearGradient id="kyj-grad" x1="8" y1="6" x2="24" y2="26" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFE45C" />
          <stop offset="50%" stopColor="#FFD000" />
          <stop offset="100%" stopColor="#FF9D00" />
        </linearGradient>
      </defs>
    </svg>
  )
}
