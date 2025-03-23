
import { SurveyResponse, SurveyResponseSubmission } from '../models/Survey';

export interface SurveyResponseRepository {
  getResponseById(id: string): Promise<SurveyResponse | null>;
  getResponsesBySurveyId(surveyId: string): Promise<SurveyResponse[]>;
  submitResponse(responseData: SurveyResponseSubmission): Promise<SurveyResponse>;
  deleteResponse(id: string): Promise<boolean>;
}
