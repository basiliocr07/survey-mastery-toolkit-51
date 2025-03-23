
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../../integrations/supabase/client';
import { SurveyResponse, SurveyResponseSubmission, QuestionResponse } from '../../domain/models/Survey';
import { SurveyResponseRepository } from '../../domain/repositories/SurveyResponseRepository';

export class SupabaseSurveyResponseRepository implements SurveyResponseRepository {
  async getResponseById(id: string): Promise<SurveyResponse | null> {
    try {
      const { data, error } = await supabase
        .from('survey_responses')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Record not found
        throw error;
      }

      return this.mapFromDatabase(data);
    } catch (error) {
      console.error(`Error fetching response ${id}:`, error);
      throw error;
    }
  }

  async getResponsesBySurveyId(surveyId: string): Promise<SurveyResponse[]> {
    try {
      const { data, error } = await supabase
        .from('survey_responses')
        .select('*')
        .eq('survey_id', surveyId)
        .order('submitted_at', { ascending: false });

      if (error) throw error;

      return data.map(this.mapFromDatabase);
    } catch (error) {
      console.error(`Error fetching responses for survey ${surveyId}:`, error);
      throw error;
    }
  }

  async submitResponse(responseData: SurveyResponseSubmission): Promise<SurveyResponse> {
    try {
      // Convert the answers from record to array of QuestionResponse
      const questionResponses: QuestionResponse[] = Object.entries(responseData.answers).map(
        ([questionId, value]) => {
          // In a real implementation, you would fetch the question title and type
          // from the survey data. For simplicity, we'll use placeholders here.
          return {
            questionId,
            questionTitle: `Question ${questionId}`, // Placeholder
            questionType: typeof value === 'string' ? 'text' : 'multiple-choice', // Simplified type detection
            value,
            isValid: true // Basic validation
          };
        }
      );

      const newResponse: SurveyResponse = {
        id: uuidv4(),
        surveyId: responseData.surveyId,
        respondentName: responseData.respondentName,
        respondentEmail: responseData.respondentEmail,
        respondentPhone: responseData.respondentPhone,
        respondentCompany: responseData.respondentCompany,
        submittedAt: responseData.submittedAt || new Date().toISOString(),
        answers: questionResponses,
        isExistingClient: responseData.isExistingClient,
        existingClientId: responseData.existingClientId
      };

      const { data, error } = await supabase
        .from('survey_responses')
        .insert(this.mapToDatabase(newResponse))
        .select()
        .single();

      if (error) throw error;

      return this.mapFromDatabase(data);
    } catch (error) {
      console.error('Error submitting survey response:', error);
      throw error;
    }
  }

  async deleteResponse(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('survey_responses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error(`Error deleting response ${id}:`, error);
      throw error;
    }
  }

  // Helper methods to map between domain model and database schema
  private mapFromDatabase(data: any): SurveyResponse {
    return {
      id: data.id,
      surveyId: data.survey_id,
      respondentName: data.respondent_name,
      respondentEmail: data.respondent_email,
      respondentPhone: data.respondent_phone,
      respondentCompany: data.respondent_company,
      submittedAt: data.submitted_at,
      answers: data.answers,
      isExistingClient: data.is_existing_client,
      existingClientId: data.existing_client_id,
      completionTime: data.completion_time
    };
  }

  private mapToDatabase(response: SurveyResponse): any {
    return {
      id: response.id,
      survey_id: response.surveyId,
      respondent_name: response.respondentName,
      respondent_email: response.respondentEmail,
      respondent_phone: response.respondentPhone,
      respondent_company: response.respondentCompany,
      submitted_at: response.submittedAt,
      answers: response.answers,
      is_existing_client: response.isExistingClient,
      existing_client_id: response.existingClientId,
      completion_time: response.completionTime
    };
  }
}
