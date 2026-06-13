export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  courseName: string;
  pdfUrl?: string | null;
  issuedAt: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl?: string;
  earnedAt: string;
}
