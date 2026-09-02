import { KYJLogo } from './KYJLogo'

export function PageLoader() {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center gap-6"
      style={{ background: '#050505' }}
    >
      {/* Glow orb */}
      <div
        className="absolute w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{ background: 'radial-gradient(circle, #FFD000, transparent)' }}
        aria-hidden="true"
      />

      {/* Logo */}
      <div className="relative flex flex-col items-center gap-4">
        <div className="orb-float-slow">
          <KYJLogo size={56} />
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="font-black text-lg text-white">KnowYourJob</span>
          <span className="text-sm" style={{ color: '#555' }}>Loading...</span>
        </div>
      </div>

      {/* Progress line */}
      <div className="w-48 h-0.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div
          className="h-full rounded-full"
          style={{
            background: 'linear-gradient(90deg, #FFE45C, #FFD000)',
            animation: 'shimmer 1.5s infinite',
            backgroundSize: '200% 100%',
          }}
        />
      </div>
    </div>
  )
}
