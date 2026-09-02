export const getAuthErrorMessage = (error: unknown): string => {
  if (!error || typeof error !== 'object') {
    return 'An unexpected error occurred. Please try again.';
  }

  const err = error as { code?: string; message?: string };
  const code = err.code || '';

  switch (code) {
    // Email / Password
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Incorrect email or password. Please verify and try again.';
    case 'auth/email-already-in-use':
      return 'An account already exists with this email address.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long with letters and numbers.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support for assistance.';

    // Google / Social
    case 'auth/popup-closed-by-user':
      return 'Google sign-in was cancelled.';
    case 'auth/popup-blocked':
      return 'Sign-in popup was blocked by your browser. Please allow popups for this site.';
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with this email using another sign-in method. Please sign in with that method.';
    case 'auth/cancelled-popup-request':
      return 'Sign-in process was replaced by a new request.';

    // Passwordless Email Link
    case 'auth/invalid-action-code':
      return 'The sign-in link is invalid or has already been used. Please request a new one.';
    case 'auth/expired-action-code':
      return 'The sign-in link has expired. Please request a new sign-in link.';
    case 'auth/invalid-email-link':
      return 'The link provided is not a valid sign-in link.';

    // General & Security
    case 'auth/too-many-requests':
      return 'Too many attempts. For security reasons, please wait a few moments and try again.';
    case 'auth/network-request-failed':
      return 'Network connection issue. Please check your internet connection and try again.';
    case 'auth/requires-recent-login':
      return 'For your security, please re-authenticate before performing this sensitive action.';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is currently not enabled. Please contact support.';
    case 'auth/missing-email':
      return 'Please provide a valid email address.';

    default:
      if (err.message) {
        return err.message.replace(/^Firebase:\s*/, '');
      }
      return 'Authentication failed. Please try again.';
  }
};
