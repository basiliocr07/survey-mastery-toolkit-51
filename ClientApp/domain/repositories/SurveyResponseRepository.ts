
import { SurveyResponse } from '../models/Survey';

export interface SurveyResponseRepository {
  getBySurveyId(surveyId: string): Promise<SurveyResponse[]>;
  submit(response: Omit<SurveyResponse, 'id' | 'submittedAt'>): Promise<SurveyResponse>;
}
