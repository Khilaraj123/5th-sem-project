export interface Question {
  id: string;
  authorId: string;
  authorName?: string;
  title: string;
  body: string;
  tags: string[];
  upvoteCount: number;
  downvoteCount: number;
  answerCount: number;
  isAnswered: boolean;
  scopeType: string;
  scopeId?: string | null;
  createdAt: string;
}

export interface Answer {
  id: string;
  questionId: string;
  authorId: string;
  authorName?: string;
  body: string;
  upvoteCount: number;
  isAccepted: boolean;
  createdAt: string;
}

export interface CreateQuestionInput {
  userId: string;
  title: string;
  content: string;
  scopeId?: string | null;
  scope?: string;
  tags?: string[];
  attachmentIds?: string[];
}

export interface UpdateQuestionInput {
  title: string;
  body: string;
  tags?: string; // Comma separated string from backend UpdateQuestionDto
}

export interface CreateAnswerInput {
  questionId: string;
  userId: string;
  content: string;
}

export interface UpdateAnswerInput {
  content: string;
}
