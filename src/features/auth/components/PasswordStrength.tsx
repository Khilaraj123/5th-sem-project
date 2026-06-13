import React from 'react';
import styles from './AuthComponents.module.css';

interface PasswordStrengthProps {
  password?: string;
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password = '' }) => {
  if (!password) return null;

  // Calculate score based on rules
  const getStrengthScore = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const score = getStrengthScore(password);

  const getStrengthData = (s: number) => {
    if (s <= 1) {
      return {
        label: 'Weak',
        colorClass: styles.strengthWeak,
        textClass: styles.textWeak,
        bars: 1,
      };
    }
    if (s <= 3) {
      return {
        label: 'Medium',
        colorClass: styles.strengthMedium,
        textClass: styles.textMedium,
        bars: 2,
      };
    }
    return {
      label: 'Strong',
      colorClass: styles.strengthStrong,
      textClass: styles.textStrong,
      bars: 3,
    };
  };

  const { label, colorClass, textClass, bars } = getStrengthData(score);

  return (
    <div className={styles.strengthMeter}>
      <div className={styles.strengthBars}>
        <div className={`${styles.strengthBar} ${bars >= 1 ? colorClass : ''}`} />
        <div className={`${styles.strengthBar} ${bars >= 2 ? colorClass : ''}`} />
        <div className={`${styles.strengthBar} ${bars >= 3 ? colorClass : ''}`} />
      </div>
      <div className={`${styles.strengthLabel} ${textClass}`}>
        Password Strength: {label}
      </div>
    </div>
  );
};

export default PasswordStrength;
