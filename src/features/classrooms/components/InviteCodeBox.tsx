import React, { useState } from 'react';
import { Copy, Check, Share2 } from 'lucide-react';

interface InviteCodeBoxProps {
  inviteCode: string;
}

export const InviteCodeBox: React.FC<InviteCodeBoxProps> = ({ inviteCode }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-4 flex flex-col gap-2">
      <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1.5 uppercase tracking-wider">
        <Share2 size={14} />
        Class Invite Code
      </div>
      
      <div className="flex items-center gap-2 mt-1">
        <div className="bg-white dark:bg-zinc-950 border border-gray-300 dark:border-zinc-800 rounded-lg px-3 py-2 text-lg font-mono font-bold text-gray-900 dark:text-white flex-1 text-center tracking-widest uppercase select-all">
          {inviteCode}
        </div>
        
        <button
          type="button"
          onClick={handleCopy}
          className={`p-2.5 rounded-lg border transition-all ${
            copied
              ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800'
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 dark:bg-zinc-950 dark:text-gray-400 dark:border-zinc-800 dark:hover:bg-zinc-900'
          }`}
          title={copied ? 'Copied!' : 'Copy to clipboard'}
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
        </button>
      </div>
      <p className="text-xs text-gray-400 mt-1">
        Share this code with students so they can join the classroom.
      </p>
    </div>
  );
};

export default InviteCodeBox;
