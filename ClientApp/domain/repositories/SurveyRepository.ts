
import { Survey } from '../models/Survey';

export interface SurveyRepository {
  getAll(): Promise<Survey[]>;
  getById(id: string): Promise<Survey | null>;
  create(survey: Omit<Survey, 'id' | 'createdAt' | 'updatedAt'>): Promise<Survey>;
  update(id: string, survey: Partial<Survey>): Promise<Survey>;
  delete(id: string): Promise<void>;
}
