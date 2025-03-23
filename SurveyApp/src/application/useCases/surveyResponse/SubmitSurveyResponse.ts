
import { SurveyResponse, SurveyResponseSubmission } from '../../../domain/models/Survey';
import { SurveyResponseRepository } from '../../../domain/repositories/SurveyResponseRepository';

export class SubmitSurveyResponse {
  constructor(private surveyResponseRepository: SurveyResponseRepository) {}

  async execute(responseData: SurveyResponseSubmission): Promise<SurveyResponse> {
    try {
      // Add current timestamp if not provided
      if (!responseData.submittedAt) {
        responseData.submittedAt = new Date().toISOString();
      }
      
      const result = await this.surveyResponseRepository.submitResponse(responseData);
      return result;
    } catch (error) {
      console.error('Error submitting survey response:', error);
      throw error;
    }
  }
}
