export type QuestionType = "open_ended" | "multiple_choice";

export interface QuestionOption {
  label: string;
  value: string;
}

export interface PrescreenQuestion {
  id: string;
  jobId: string;
  questionText: string;
  questionType: QuestionType;
  options: QuestionOption[] | null;
  sortOrder: number;
  createdAt: string;
}
