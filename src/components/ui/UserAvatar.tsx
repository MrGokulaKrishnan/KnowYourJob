import React, { useState } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { AppUser } from '../../types/user';

export interface UserAvatarProps {
  user?: Partial<FirebaseUser> | null;
  userDoc?: Partial<AppUser> | null;
  photoURL?: string | null;
  displayName?: string | null;
  email?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  roundedClassName?: string;
  showGoogleBadge?: boolean;
  border?: boolean;
  className?: string;
  alt?: string;
  onClick?: () => void;
}

/**
 * Checks if a user profile is linked to a Google account.
 */
export function isGoogleUser(
  user?: Partial<FirebaseUser> | null,
  userDoc?: Partial<AppUser> | null,
  photoURL?: string | null
): boolean {
  if (userDoc?.provider === 'google.com') return true;
  if (user?.providerData?.some((p) => p?.providerId === 'google.com')) return true;
  const url = photoURL || user?.photoURL || userDoc?.photoURL;
  if (url && (url.includes('googleusercontent.com') || url.includes('google.com'))) return true;
  return false;
}

/**
 * Optimizes Google photo URLs to retrieve a high-resolution version for crisp display.
 */
export function getOptimizedPhotoUrl(url: string | null | undefined, targetPx = 256): string | null {
  if (!url) return null;
  if (url.includes('googleusercontent.com')) {
    if (/=s\d+(-c)?/i.test(url)) {
      return url.replace(/=s\d+(-c)?/i, `=s${targetPx}-c`);
    }
    return url.includes('?') ? `${url}&sz=${targetPx}` : `${url}=s${targetPx}-c`;
  }
  return url;
}

/**
 * Extracts 1-2 uppercase initials from a name or email.
 */
export function getInitials(name?: string | null, email?: string | null): string {
  if (name && name.trim()) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  }
  if (email && email.trim()) {
    return email.trim().charAt(0).toUpperCase();
  }
  return 'U';
}

/**
 * Google multi-color "G" SVG icon.
 */
export const GoogleIcon: React.FC<{ className?: string; size?: number }> = ({ className, size = 14 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    aria-hidden="true"
  >
    <path
      fill="#EA4335"
      d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
    />
    <path
      fill="#4285F4"
      d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.8z"
    />
    <path
      fill="#FBBC05"
      d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.5s.7 4.8 1.9 7.2l3.7-2.9z"
    />
    <path
      fill="#34A853"
      d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.9C3.7 20.6 7.5 23.5 12 23.5z"
    />
  </svg>
);

const SIZE_MAP = {
  xs: { box: 'w-6 h-6', text: 'text-[10px]', rounded: 'rounded-md', badge: 'w-2.5 h-2.5', badgePx: 9 },
  sm: { box: 'w-8 h-8', text: 'text-xs', rounded: 'rounded-lg', badge: 'w-3 h-3', badgePx: 10 },
  md: { box: 'w-10 h-10', text: 'text-sm', rounded: 'rounded-xl', badge: 'w-3.5 h-3.5', badgePx: 12 },
  lg: { box: 'w-12 h-12', text: 'text-base', rounded: 'rounded-xl', badge: 'w-4 h-4', badgePx: 13 },
  xl: { box: 'w-16 h-16', text: 'text-lg', rounded: 'rounded-2xl', badge: 'w-5 h-5', badgePx: 14 },
  '2xl': { box: 'w-20 h-20', text: 'text-xl', rounded: 'rounded-2xl', badge: 'w-6 h-6', badgePx: 16 },
  '3xl': { box: 'w-24 h-24', text: 'text-2xl', rounded: 'rounded-2xl', badge: 'w-7 h-7', badgePx: 18 },
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  userDoc,
  photoURL: explicitPhotoURL,
  displayName: explicitDisplayName,
  email: explicitEmail,
  size = 'md',
  roundedClassName,
  showGoogleBadge = false,
  border = true,
  className = '',
  alt,
  onClick,
}) => {
  const [imageError, setImageError] = useState(false);

  // 1. Resolve effective photo URL
  const rawPhotoURL =
    explicitPhotoURL ??
    user?.photoURL ??
    userDoc?.photoURL ??
    user?.providerData?.find((p) => p?.photoURL)?.photoURL ??
    null;

  const targetPx = size === '3xl' || size === '2xl' ? 384 : size === 'xl' ? 256 : 128;
  const optimizedPhotoURL = getOptimizedPhotoUrl(rawPhotoURL, targetPx);

  // 2. Resolve display name and email
  const resolvedDisplayName =
    explicitDisplayName ??
    userDoc?.displayName ??
    user?.displayName ??
    null;

  const resolvedEmail =
    explicitEmail ??
    userDoc?.email ??
    user?.email ??
    null;

  const initials = getInitials(resolvedDisplayName, resolvedEmail);
  const isGoogle = isGoogleUser(user, userDoc, rawPhotoURL);

  const sizeConfig = SIZE_MAP[size] || SIZE_MAP.md;
  const roundedClass = roundedClassName || sizeConfig.rounded;

  const showImage = !!optimizedPhotoURL && !imageError;

  return (
    <div
      onClick={onClick}
      className={`relative inline-block select-none shrink-0 ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <div
        className={`overflow-hidden flex items-center justify-center font-bold tracking-wider relative transition-transform ${sizeConfig.box} ${roundedClass} ${
          border
            ? 'border border-white/10 ring-1 ring-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]'
            : ''
        }`}
        style={{
          background: showImage
            ? '#050505'
            : 'linear-gradient(135deg, rgba(255, 228, 92, 0.95) 0%, rgba(245, 158, 11, 0.95) 100%)',
        }}
      >
        {showImage ? (
          <img
            src={optimizedPhotoURL}
            alt={alt || resolvedDisplayName || 'Profile avatar'}
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover ${roundedClass}`}
          />
        ) : (
          <span className={`text-[#000000] font-extrabold ${sizeConfig.text}`}>
            {initials}
          </span>
        )}
      </div>

      {/* Google "G" Badge overlay if requested and is a Google user */}
      {showGoogleBadge && isGoogle && (
        <div
          className={`absolute -bottom-1 -right-1 bg-[#000000] rounded-md border border-white/15 p-0.5 shadow-md flex items-center justify-center`}
          title="Synced with Google Account"
        >
          <GoogleIcon size={sizeConfig.badgePx} />
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
