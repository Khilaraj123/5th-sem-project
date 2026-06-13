import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, Loader2 } from 'lucide-react';

const answerSchema = z.object({
  content: z.string().min(1, 'Answer body cannot be empty'),
});

type AnswerFormInput = z.infer<typeof answerSchema>;

interface AnswerFormProps {
  onPostAnswer: (content: string) => Promise<any>;
}

export const AnswerForm: React.FC<AnswerFormProps> = ({ onPostAnswer }) => {
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AnswerFormInput>({
    resolver: zodResolver(answerSchema),
    defaultValues: { content: '' },
  });

  const onSubmit = async (data: AnswerFormInput) => {
    setServerError(null);
    setSuccess(false);
    try {
      await onPostAnswer(data.content);
      reset();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err: any) {
      setServerError('Failed to submit answer. Please try again.');
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm">
      <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-3">Your Answer</h3>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <textarea
            rows={4}
            placeholder="Support your answer with code examples or detailed explanations..."
            className={`w-full px-4 py-3 bg-transparent border rounded-lg outline-none text-sm dark:text-white dark:border-zinc-800 focus:border-violet-600 resize-none ${
              errors.content ? 'border-red-500' : 'border-gray-200'
            }`}
            {...register('content')}
          />
          {errors.content && (
            <p className="text-xs text-red-500">{errors.content.message}</p>
          )}
        </div>

        {serverError && (
          <p className="text-xs text-red-500 text-center">{serverError}</p>
        )}

        {success && (
          <p className="text-xs text-emerald-500 text-center">Answer submitted!</p>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold rounded-lg transition-all disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Posting...
              </>
            ) : (
              <>
                <Send size={16} />
                Post Answer
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AnswerForm;
