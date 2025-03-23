
export type QuestionType = 
  | 'multiple-choice' 
  | 'single-choice' 
  | 'text' 
  | 'rating' 
  | 'dropdown' 
  | 'matrix' 
  | 'ranking' 
  | 'nps' 
  | 'date' 
  | 'file-upload';

export interface SurveyQuestion {
  id: string;
  title: string;
  type: QuestionType;
  required: boolean;
  options?: string[];
  description?: string;
  order: number;
}

export interface Survey {
  id: string;
  title: string;
  description?: string;
  questions: SurveyQuestion[];
  createdAt: string;
  updatedAt?: string;
  isPublished: boolean;
  createdBy?: string;
}

export interface SurveyResponse {
  id?: string;
  surveyId: string;
  respondentName?: string;
  respondentEmail?: string;
  respondentPhone?: string;
  respondentCompany?: string;
  submittedAt: string;
  answers: Answer[];
}

export interface Answer {
  questionId: string;
  questionTitle: string;
  value: string | string[];
  isValid: boolean;
}
