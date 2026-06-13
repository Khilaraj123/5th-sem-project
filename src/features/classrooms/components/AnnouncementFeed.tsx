import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, Trash2, Megaphone, Loader2 } from "lucide-react";
import { useAuth } from "../../auth/hooks/useAuth";
import type { Announcement } from "../types/classroom.types";

const announcementSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title cannot exceed 100 characters"),
  content: z.string().min(1, "Content is required"),
});

type AnnouncementInput = z.infer<typeof announcementSchema>;

interface AnnouncementFeedProps {
  announcements: Announcement[];
  onPostAnnouncement: (data: {
    title: string;
    content: string;
  }) => Promise<any>;
  onDeleteAnnouncement?: (id: string) => Promise<any>;
}

export const AnnouncementFeed: React.FC<AnnouncementFeedProps> = ({
  announcements,
  onPostAnnouncement,
  onDeleteAnnouncement,
}) => {
  const { user } = useAuth();
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AnnouncementInput>({
    resolver: zodResolver(announcementSchema),
    defaultValues: { title: "", content: "" },
  });

  const onSubmit = async (data: AnnouncementInput) => {
    setServerError(null);
    setSuccess(false);
    try {
      await onPostAnnouncement(data);
      reset();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err: any) {
      setServerError("Failed to share announcement. Please try again.");
    }
  };

  const isInstructor = user?.role === "instructor" || user?.role === "admin";

  const renderAnnouncementCard = (ann: Announcement) => {
    const authorInitials = (ann.authorName || "User")
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    return (
      <div
        key={ann.id}
        className="bg-white 
        dark:bg-zinc-900
         border border-gray-200 
         dark:border-zinc-800 rounded-xl 
         p-5 shadow-sm space-y-3 relative group"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-400 flex items-center justify-center font-bold text-sm">
              {authorInitials}
            </div>
            <div>
              <div className="font-semibold text-gray-900 dark:text-white text-sm">
                {ann.authorName || "Instructor"}
              </div>
              <div className="text-xs text-gray-400 flex items-center gap-2">
                <span className="capitalize">
                  {ann.authorRole || "Instructor"}
                </span>
                <span>•</span>
                <span>{new Date(ann.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {isInstructor && onDeleteAnnouncement && (
            <button
              onClick={() => onDeleteAnnouncement(ann.id)}
              className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg border border-transparent hover:border-gray-200 dark:hover:border-zinc-800 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
              title="Delete announcement"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>

        <div className="space-y-1.5">
          <h4 className="font-bold text-gray-950 dark:text-white text-base">
            {ann.title}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
            {ann.content}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Instructor Share Announcement Box */}
      {isInstructor && (
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Megaphone className="text-violet-600" size={18} />
            <h3 className="font-bold text-gray-900 dark:text-white text-base">
              Share something with your class
            </h3>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <input
                type="text"
                placeholder="Announcement Title"
                className={`w-full px-4 py-2 bg-transparent border rounded-lg outline-none text-sm dark:text-white dark:border-zinc-800 focus:border-violet-600 ${
                  errors.title ? "border-red-500" : "border-gray-200"
                }`}
                {...register("title")}
              />
              {errors.title && (
                <p className="text-xs text-red-500">{errors.title.message}</p>
              )}
            </div>

            {/* Content */}
            <div className="flex flex-col gap-1.5">
              <textarea
                rows={3}
                placeholder="Write announcement content..."
                className={`w-full px-4 py-3 bg-transparent border rounded-lg outline-none text-sm dark:text-white dark:border-zinc-800 focus:border-violet-600 resize-none ${
                  errors.content ? "border-red-500" : "border-gray-200"
                }`}
                {...register("content")}
              />
              {errors.content && (
                <p className="text-xs text-red-500">{errors.content.message}</p>
              )}
            </div>

            {serverError && (
              <p className="text-xs text-red-500 text-center">{serverError}</p>
            )}

            {success && (
              <p className="text-xs text-emerald-500 text-center">
                Announcement posted!
              </p>
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
                    Post
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-sm">
            <Megaphone className="mx-auto text-gray-300 mb-2" size={32} />
            <h4 className="font-semibold text-gray-700 dark:text-zinc-400">
              No announcements yet
            </h4>
            <p className="text-xs text-gray-400 mt-1 px-4">
              When instructors post updates, lessons, or alerts, they will
              appear here.
            </p>
          </div>
        ) : (
          announcements.map(renderAnnouncementCard)
        )}
      </div>
    </div>
  );
};

export default AnnouncementFeed;
