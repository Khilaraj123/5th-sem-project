import React, { useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import apiClient from '../../../lib/axios';
import styles from './AuthComponents.module.css';

interface VerifyEmailBannerProps {
  email: string;
}

export const VerifyEmailBanner: React.FC<VerifyEmailBannerProps> = ({ email }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleResendVerification = async () => {
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      await apiClient.post('/auth/resend-verification', { email });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend verification email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.banner}>
      <AlertTriangle className={styles.bannerIcon} size={20} />
      <div className={styles.bannerContent}>
        <div className={styles.bannerTitle}>Email Verification Required</div>
        <div className={styles.bannerText}>
          Please check your inbox at <strong>{email}</strong> to verify your account. If you didn't receive the email, you can request a new link below.
        </div>
        <div>
          {success ? (
            <span className={styles.resendSuccess}>Verification link sent successfully!</span>
          ) : (
            <button
              type="button"
              className={styles.resendButton}
              onClick={handleResendVerification}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className={styles.spinner} size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  Resending...
                </>
              ) : (
                'Resend verification email'
              )}
            </button>
          )}
        </div>
        {error && <p className={styles.errorMessage}>{error}</p>}
      </div>
    </div>
  );
};

export default VerifyEmailBanner;
