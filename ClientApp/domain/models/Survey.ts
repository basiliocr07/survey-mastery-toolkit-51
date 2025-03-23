
export interface SurveyQuestion {
  id: string;
  type: string;
  text: string;
  required: boolean;
  options?: string[];
  settings?: Record<string, any>;
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  questions: SurveyQuestion[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  answers: {
    questionId: string;
    value: string | string[];
  }[];
  respondentEmail?: string;
  respondentName?: string;
  submittedAt: Date;
}
