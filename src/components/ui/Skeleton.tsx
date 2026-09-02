import { clsx } from 'clsx'

interface SkeletonProps {
  className?: string
  width?: string
  height?: string
  rounded?: 'sm' | 'md' | 'lg' | 'full'
}

export function Skeleton({ className, width, height, rounded = 'md' }: SkeletonProps) {
  const roundedMap = {
    sm: 'rounded',
    md: 'rounded-lg',
    lg: 'rounded-2xl',
    full: 'rounded-full',
  }
  return (
    <div
      className={clsx('skeleton', roundedMap[rounded], className)}
      style={{ width, height }}
      aria-hidden="true"
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="glass rounded-2xl p-6 flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <Skeleton width="40px" height="40px" rounded="lg" />
        <div className="flex-1 flex flex-col gap-2">
          <Skeleton height="20px" width="60%" />
          <Skeleton height="14px" width="40%" />
        </div>
      </div>
      <Skeleton height="14px" />
      <Skeleton height="14px" width="80%" />
      <div className="flex gap-2">
        <Skeleton height="26px" width="64px" rounded="full" />
        <Skeleton height="26px" width="64px" rounded="full" />
        <Skeleton height="26px" width="64px" rounded="full" />
      </div>
    </div>
  )
}

export function JobCardSkeleton() {
  return (
    <div className="glass rounded-2xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton width="44px" height="44px" rounded="lg" />
          <div className="flex flex-col gap-1.5">
            <Skeleton height="18px" width="120px" />
            <Skeleton height="13px" width="80px" />
          </div>
        </div>
        <Skeleton width="56px" height="56px" rounded="full" />
      </div>
      <Skeleton height="13px" width="100px" />
      <div className="flex gap-2">
        <Skeleton height="24px" width="60px" rounded="full" />
        <Skeleton height="24px" width="60px" rounded="full" />
      </div>
      <div className="flex gap-2 pt-1">
        <Skeleton height="36px" className="flex-1" rounded="lg" />
        <Skeleton height="36px" className="flex-1" rounded="lg" />
      </div>
    </div>
  )
}

export function MetricSkeleton() {
  return (
    <div className="glass rounded-2xl p-5 flex flex-col gap-3">
      <Skeleton height="12px" width="60%" />
      <Skeleton height="36px" width="80px" />
      <Skeleton height="12px" width="40%" />
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      {/* Greeting */}
      <div className="flex flex-col gap-2">
        <Skeleton height="32px" width="240px" rounded="lg" />
        <Skeleton height="16px" width="180px" />
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <MetricSkeleton key={i} />)}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass rounded-2xl p-6">
          <Skeleton height="20px" width="140px" className="mb-4" />
          <Skeleton height="200px" rounded="lg" />
        </div>
        <div className="glass rounded-2xl p-6">
          <Skeleton height="20px" width="120px" className="mb-4" />
          <Skeleton height="200px" rounded="lg" />
        </div>
      </div>

      {/* Jobs */}
      <div className="flex flex-col gap-4">
        <Skeleton height="24px" width="160px" rounded="lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <JobCardSkeleton key={i} />)}
        </div>
      </div>
    </div>
  )
}
