import React from 'react';
import styles from './AuthComponents.module.css';

export const OAuthButtons: React.FC = () => {
  const handleSocialLogin = (provider: string) => {
    // Navigate to local dotnet backend authentication endpoint
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    window.location.href = `${API_URL}/auth/external-login?provider=${provider}&redirectUrl=${encodeURIComponent(window.location.origin)}`;
  };

  return (
    <div className={styles.oauthGrid}>
      {/* Google Login */}
      <button
        type="button"
        className={styles.oauthButton}
        onClick={() => handleSocialLogin('Google')}
        title="Sign in with Google"
      >
        <svg className={styles.oauthIcon} viewBox="0 0 24 24" width="100%" height="100%">
          <path
            fill="#EA4335"
            d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.326 0-6.033-2.707-6.033-6.033s2.707-6.033 6.033-6.033c1.494 0 2.861.547 3.917 1.454l3.197-3.197C19.167 1.867 15.91 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.208 0 11.113-4.507 11.113-11.24 0-.668-.073-1.32-.191-1.955H12.24z"
          />
        </svg>
      </button>

      {/* GitHub Login */}
      <button
        type="button"
        className={styles.oauthButton}
        onClick={() => handleSocialLogin('GitHub')}
        title="Sign in with GitHub"
      >
        <svg className={styles.oauthIcon} viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
        </svg>
      </button>

      {/* Microsoft Login */}
      <button
        type="button"
        className={styles.oauthButton}
        onClick={() => handleSocialLogin('Microsoft')}
        title="Sign in with Microsoft"
      >
        <svg className={styles.oauthIcon} viewBox="0 0 23 23" width="100%" height="100%">
          <rect x="0" y="0" width="11" height="11" fill="#f25022" />
          <rect x="12" y="0" width="11" height="11" fill="#7fba00" />
          <rect x="0" y="12" width="11" height="11" fill="#00a4ef" />
          <rect x="12" y="12" width="11" height="11" fill="#ffb900" />
        </svg>
      </button>
    </div>
  );
};

export default OAuthButtons;
