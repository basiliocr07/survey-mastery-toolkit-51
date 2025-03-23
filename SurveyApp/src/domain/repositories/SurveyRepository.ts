
import { Survey, SurveyResponse } from '../models/Survey';

export interface SurveyRepository {
  getSurveyById(id: string): Promise<Survey | null>;
  getAllSurveys(): Promise<Survey[]>;
  createSurvey(survey: Survey): Promise<Survey>;
  updateSurvey(survey: Survey): Promise<Survey>;
  deleteSurvey(id: string): Promise<void>;
  getSurveyResponses(surveyId: string): Promise<SurveyResponse[]>;
  submitSurveyResponse(response: SurveyResponse): Promise<SurveyResponse>;
}
