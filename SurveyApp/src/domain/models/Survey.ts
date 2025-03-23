
export interface Survey {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
  createdAt: string;
  updatedAt?: string;
}

export interface Question {
  id: string;
  surveyId: string;
  title: string;
  type: string;
  required: boolean;
  options?: string[];
  order: number;
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
