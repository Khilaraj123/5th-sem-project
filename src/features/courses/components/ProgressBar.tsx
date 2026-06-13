import React from 'react';

interface ProgressBarProps {
  progressPercent: number;
  showText?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progressPercent,
  showText = false,
}) => {
  const percent = Math.min(100, Math.max(0, progressPercent));

  return (
    <div className="w-full">
      {showText && (
        <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-1.5">
          <span>Progress</span>
          <span>{percent}% Complete</span>
        </div>
      )}
      
      <div className="w-full bg-gray-200 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
        <div
          className="bg-violet-600 dark:bg-violet-500 h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
