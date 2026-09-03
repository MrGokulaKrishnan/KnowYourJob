interface KYJLogoProps {
  size?: number
  className?: string
  glow?: boolean
}

export function KYJLogo({ size = 32, className = '', glow = false }: KYJLogoProps) {
  return (
    <img
      src="/kyj-logo.jpg"
      alt="KnowYourJob Logo"
      width={size}
      height={size}
      className={`rounded-xl object-contain inline-block shrink-0 ${glow ? 'shadow-[0_0_20px_rgba(255,208,0,0.35)]' : ''} ${className}`}
      style={{
        width: size,
        height: size,
      }}
    />
  )
}

export default KYJLogo

