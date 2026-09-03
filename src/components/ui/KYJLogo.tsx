interface KYJLogoProps {
  size?: number
  className?: string
}

export function KYJLogo({ size = 32, className }: KYJLogoProps) {
  return (
    <img
      src="/kyj-logo.jpg"
      alt="KnowYourJob Logo"
      width={size}
      height={size}
      className={className}
      style={{
        width: size,
        height: size,
        objectFit: 'contain',
        display: 'inline-block',
      }}
    />
  )
}

export default KYJLogo
