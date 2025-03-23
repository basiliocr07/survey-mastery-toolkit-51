
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
  description?: string;
  type: QuestionType;
  required: boolean;
  options?: string[];
  settings?: {
    min?: number;
    max?: number;
  };
}

export interface SurveyData {
  id: string;
  title: string;
  description?: string;
  questions: SurveyQuestion[];
  createdAt: string;
  updatedAt?: string;
  status?: 'draft' | 'published' | 'closed';
  settings?: {
    allowAnonymous?: boolean;
    requireLogin?: boolean;
    showProgressBar?: boolean;
  };
  deliveryConfig?: {
    emailDistribution?: boolean;
    redirectUrl?: string;
    completionMessage?: string;
  };
}
