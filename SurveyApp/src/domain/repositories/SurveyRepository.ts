
import { Survey, SurveyStatistics } from '../models/Survey';

export interface SurveyRepository {
  getAllSurveys(): Promise<Survey[]>;
  getSurveyById(id: string): Promise<Survey | null>;
  createSurvey(surveyData: Omit<Survey, 'id' | 'createdAt'>): Promise<Survey>;
  updateSurvey(survey: Survey): Promise<Survey>;
  deleteSurvey(id: string): Promise<boolean>;
  getSurveyStatistics(surveyId: string): Promise<SurveyStatistics>;
  sendSurveyEmails(surveyId: string, emailAddresses: string[]): Promise<boolean>;
}
