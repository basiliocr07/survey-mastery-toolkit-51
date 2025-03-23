
import { SurveyResponse, SurveyResponseSubmission } from '../../domain/models/Survey';
import { SurveyResponseRepository } from '../../domain/repositories/SurveyResponseRepository';

export class SupabaseSurveyResponseRepository implements SurveyResponseRepository {
  async getResponsesBySurveyId(surveyId: string): Promise<SurveyResponse[]> {
    try {
      const response = await fetch(`/api/surveyResponses/survey/${surveyId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch survey responses');
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching responses for survey ${surveyId}:`, error);
      throw error;
    }
  }

  async getResponseById(id: string): Promise<SurveyResponse | null> {
    try {
      const response = await fetch(`/api/surveyResponses/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error('Failed to fetch survey response');
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching response with id ${id}:`, error);
      throw error;
    }
  }

  async submitResponse(responseData: SurveyResponseSubmission): Promise<SurveyResponse> {
    try {
      const response = await fetch(`/api/surveyResponses/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(responseData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit survey response');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error submitting survey response:', error);
      throw error;
    }
  }

  async deleteResponse(id: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/surveyResponses/${id}`, {
        method: 'DELETE',
      });

      return response.ok;
    } catch (error) {
      console.error(`Error deleting response with id ${id}:`, error);
      throw error;
    }
  }
}
