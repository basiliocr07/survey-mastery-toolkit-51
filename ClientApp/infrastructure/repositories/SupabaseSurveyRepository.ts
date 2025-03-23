
import { Survey, SurveyStatistics } from '../../domain/models/Survey';
import { SurveyRepository } from '../../domain/repositories/SurveyRepository';

export class SupabaseSurveyRepository implements SurveyRepository {
  async getAllSurveys(): Promise<Survey[]> {
    try {
      // In the real implementation, we would use the Supabase client to fetch data
      // For now, we'll call the ASP.NET API
      const response = await fetch('/api/surveys');
      if (!response.ok) {
        throw new Error('Failed to fetch surveys');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching all surveys:', error);
      throw error;
    }
  }

  async getSurveyById(id: string): Promise<Survey | null> {
    try {
      const response = await fetch(`/api/surveys/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error('Failed to fetch survey');
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching survey with id ${id}:`, error);
      throw error;
    }
  }

  async createSurvey(surveyData: Omit<Survey, 'id' | 'createdAt'>): Promise<Survey> {
    try {
      const response = await fetch('/api/surveys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(surveyData),
      });

      if (!response.ok) {
        throw new Error('Failed to create survey');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating survey:', error);
      throw error;
    }
  }

  async updateSurvey(survey: Survey): Promise<Survey> {
    try {
      const response = await fetch(`/api/surveys/${survey.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(survey),
      });

      if (!response.ok) {
        throw new Error('Failed to update survey');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error updating survey with id ${survey.id}:`, error);
      throw error;
    }
  }

  async deleteSurvey(id: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/surveys/${id}`, {
        method: 'DELETE',
      });

      return response.ok;
    } catch (error) {
      console.error(`Error deleting survey with id ${id}:`, error);
      throw error;
    }
  }

  async getSurveyStatistics(surveyId: string): Promise<SurveyStatistics> {
    try {
      const response = await fetch(`/api/surveys/${surveyId}/statistics`);
      if (!response.ok) {
        throw new Error('Failed to fetch survey statistics');
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching statistics for survey with id ${surveyId}:`, error);
      throw error;
    }
  }

  async sendSurveyEmails(surveyId: string, emailAddresses: string[]): Promise<boolean> {
    try {
      const response = await fetch(`/api/surveys/${surveyId}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailAddresses }),
      });

      return response.ok;
    } catch (error) {
      console.error(`Error sending emails for survey with id ${surveyId}:`, error);
      throw error;
    }
  }
}
