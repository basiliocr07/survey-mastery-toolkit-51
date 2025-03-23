
import { QuestionType } from '@/types/surveyTypes';

export interface QuestionResponse {
  questionId: string;
  questionTitle: string;
  questionType: string;
  value: string;
  isValid: boolean;
}

export interface SurveyResponse {
  id?: string;
  surveyId: string | number;
  respondentName: string;
  respondentEmail: string;
  respondentPhone?: string;
  respondentCompany?: string;
  submittedAt: Date | string;
  answers: QuestionResponse[];
  isExistingClient?: boolean;
  existingClientId?: string;
  completionTime?: number;
}

export interface SurveyResponseSubmission {
  surveyId: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  answers: Record<string, string>;
}

export interface SurveyQuestion {
  id: string;
  title: string;
  text: string;
  type: string;
  required: boolean;
  options: string[];
  settings?: {
    min?: number;
    max?: number;
  };
}

export interface DeliveryConfig {
  emailList?: string[];
  redirectUrl?: string;
  thankYouMessage?: string;
  allowAnonymous?: boolean;
}

export interface Survey {
  id: string;
  title: string;
  description?: string;
  questions: SurveyQuestion[];
  createdAt: string;
  updatedAt?: string;
  status?: 'draft' | 'published' | 'closed';
  deliveryConfig?: DeliveryConfig;
}

export interface SurveyStatistics {
  totalResponses: number;
  averageCompletionTime: number;
  completionRate: number;
  questionStats: QuestionStats[];
}

export interface QuestionStats {
  questionId: string;
  questionText: string;
  responseCount: number;
  averageRating?: number;
  optionCounts?: Record<string, number>;
}
