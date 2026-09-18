import { describe, it, expect } from 'vitest';
import {
  isGoogleUser,
  getOptimizedPhotoUrl,
  getInitials,
} from '../components/ui/UserAvatar';

describe('UserAvatar & Google Profile Picture Integration', () => {
  describe('isGoogleUser detection', () => {
    it('detects Google user from userDoc.provider', () => {
      const isGoogle = isGoogleUser(null, { provider: 'google.com' } as any, null);
      expect(isGoogle).toBe(true);
    });

    it('detects Google user from user.providerData', () => {
      const user = {
        providerData: [{ providerId: 'google.com' }],
      } as any;
      const isGoogle = isGoogleUser(user, null, null);
      expect(isGoogle).toBe(true);
    });

    it('detects Google user from googleusercontent.com photo URL', () => {
      const isGoogle = isGoogleUser(
        null,
        null,
        'https://lh3.googleusercontent.com/a/ACg8ocJ-example=s96-c'
      );
      expect(isGoogle).toBe(true);
    });

    it('returns false for standard password user without Google photo', () => {
      const isGoogle = isGoogleUser(
        { providerData: [{ providerId: 'password' }] } as any,
        { provider: 'password' } as any,
        null
      );
      expect(isGoogle).toBe(false);
    });
  });

  describe('getOptimizedPhotoUrl', () => {
    it('upgrades Google avatar resolution from s96-c to target px with -c', () => {
      const input = 'https://lh3.googleusercontent.com/a/ACg8ocJ-example=s96-c';
      const output = getOptimizedPhotoUrl(input, 256);
      expect(output).toBe('https://lh3.googleusercontent.com/a/ACg8ocJ-example=s256-c');
    });

    it('upgrades Google avatar resolution for custom sizes (e.g. 384px)', () => {
      const input = 'https://lh3.googleusercontent.com/a/ACg8ocJ-example=s96';
      const output = getOptimizedPhotoUrl(input, 384);
      expect(output).toBe('https://lh3.googleusercontent.com/a/ACg8ocJ-example=s384-c');
    });

    it('appends size query to Google photo without existing size parameter', () => {
      const input = 'https://lh3.googleusercontent.com/a/ACg8ocJ-example';
      const output = getOptimizedPhotoUrl(input, 256);
      expect(output).toBe('https://lh3.googleusercontent.com/a/ACg8ocJ-example=s256-c');
    });

    it('preserves non-Google photo URLs as-is', () => {
      const input = 'https://images.unsplash.com/photo-1234?auto=format';
      const output = getOptimizedPhotoUrl(input, 256);
      expect(output).toBe(input);
    });

    it('returns null for null or undefined input', () => {
      expect(getOptimizedPhotoUrl(null)).toBeNull();
      expect(getOptimizedPhotoUrl(undefined)).toBeNull();
    });
  });

  describe('getInitials', () => {
    it('extracts two letters from multi-word display name', () => {
      expect(getInitials('Gokula Krishnan')).toBe('GK');
      expect(getInitials('John Doe Candidate')).toBe('JC');
    });

    it('extracts first two characters from single word display name', () => {
      expect(getInitials('Alex')).toBe('AL');
    });

    it('falls back to first initial from email address', () => {
      expect(getInitials(null, 'candidate@example.com')).toBe('C');
      expect(getInitials('', 'gokul@domain.org')).toBe('G');
    });

    it('defaults to U when no name or email is available', () => {
      expect(getInitials(null, null)).toBe('U');
      expect(getInitials('', '')).toBe('U');
    });
  });
});
