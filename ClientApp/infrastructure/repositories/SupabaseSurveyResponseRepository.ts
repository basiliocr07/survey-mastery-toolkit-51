import { SurveyResponse } from '../../domain/models/Survey';
import { SurveyResponseRepository } from '../../domain/repositories/SurveyResponseRepository';

// This is a placeholder implementation. You would typically use an actual API client here.
export class SupabaseSurveyResponseRepository implements SurveyResponseRepository {
  async getBySurveyId(surveyId: string): Promise<SurveyResponse[]> {
    const response = await fetch(`/api/surveys/${surveyId}/responses`);
    const data = await response.json();
    return data;
  }

  async submit(response: Omit<SurveyResponse, 'id' | 'submittedAt'>): Promise<SurveyResponse> {
    const res = await fetch(`/api/surveys/${response.surveyId}/responses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(response),
    });
    const data = await res.json();
    return data;
  }
}
