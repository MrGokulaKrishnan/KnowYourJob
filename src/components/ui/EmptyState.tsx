import { AlertTriangle, RefreshCw, WifiOff, Lock } from 'lucide-react'
import { GlassButton } from '@/components/glass/GlassButton'

interface ErrorStateProps {
  title?: string
  message?: string
  type?: 'generic' | 'network' | 'permission' | 'notfound'
  onRetry?: () => void
  className?: string
}

export function ErrorState({
  title,
  message,
  type = 'generic',
  onRetry,
  className,
}: ErrorStateProps) {
  const configs = {
    generic: {
      icon: <AlertTriangle size={40} />,
      defaultTitle: "Something went wrong",
      defaultMessage: "We couldn't complete this action. Please try again.",
      iconColor: '#FFAA00',
    },
    network: {
      icon: <WifiOff size={40} />,
      defaultTitle: "Connection issue",
      defaultMessage: "Check your internet connection and try again.",
      iconColor: '#60A5FA',
    },
    permission: {
      icon: <Lock size={40} />,
      defaultTitle: "Access denied",
      defaultMessage: "You don't have permission to view this content.",
      iconColor: '#EF4444',
    },
    notfound: {
      icon: <AlertTriangle size={40} />,
      defaultTitle: "Not found",
      defaultMessage: "This content doesn't exist or has been removed.",
      iconColor: '#777',
    },
  }

  const config = configs[type]

  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 py-16 text-center ${className}`}
    >
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl glass"
        style={{ color: config.iconColor }}
      >
        {config.icon}
      </div>
      <div className="flex flex-col gap-1 max-w-sm">
        <h3 className="text-base font-semibold text-white">{title ?? config.defaultTitle}</h3>
        <p className="text-sm" style={{ color: '#777' }}>{message ?? config.defaultMessage}</p>
      </div>
      {onRetry && (
        <GlassButton
          variant="glass"
          size="sm"
          icon={<RefreshCw size={14} />}
          onClick={onRetry}
        >
          Try Again
        </GlassButton>
      )}
    </div>
  )
}

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  message: string
  action?: {
    label: string
    onClick: () => void
    icon?: React.ReactNode
  }
  className?: string
}

export function EmptyState({ icon, title, message, action, className }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-4 py-16 text-center ${className}`}>
      {icon && (
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl glass" style={{ color: '#FFD000' }}>
          {icon}
        </div>
      )}
      <div className="flex flex-col gap-1 max-w-xs">
        <h3 className="text-base font-semibold text-white">{title}</h3>
        <p className="text-sm" style={{ color: '#777' }}>{message}</p>
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="btn-primary px-6 py-2.5 text-sm rounded-xl flex items-center gap-2"
        >
          {action.icon}
          {action.label}
        </button>
      )}
    </div>
  )
}
