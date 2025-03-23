
import { Survey, SurveyStatistics } from '../../domain/models/Survey';
import { SurveyRepository } from '../../domain/repositories/SurveyRepository';
import { supabase } from '../../integrations/supabase/client';

export class SupabaseSurveyRepository implements SurveyRepository {
  async getAllSurveys(): Promise<Survey[]> {
    const { data, error } = await supabase
      .from('surveys')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return (data || []).map(this.mapToSurvey);
  }

  async getSurveyById(id: string): Promise<Survey | null> {
    const { data, error } = await supabase
      .from('surveys')
      .select('*, questions(*)')
      .eq('id', id)
      .single();

    if (error) return null;
    if (!data) return null;
    
    return this.mapToSurveyWithQuestions(data);
  }

  async createSurvey(survey: Omit<Survey, 'id' | 'createdAt'>): Promise<Survey> {
    // First create the survey
    const { data: surveyData, error: surveyError } = await supabase
      .from('surveys')
      .insert([{
        title: survey.title,
        description: survey.description
      }])
      .select()
      .single();

    if (surveyError) throw surveyError;
    
    // Then create questions if any
    if (survey.questions && survey.questions.length > 0) {
      const questionsToInsert = survey.questions.map((question, index) => ({
        survey_id: surveyData.id,
        title: question.title,
        description: question.description,
        type: question.type,
        required: question.required,
        options: question.options,
        order: index
      }));

      const { error: questionsError } = await supabase
        .from('questions')
        .insert(questionsToInsert);

      if (questionsError) throw questionsError;
    }

    // Fetch the complete survey with questions
    return this.getSurveyById(surveyData.id) as Promise<Survey>;
  }

  async updateSurvey(survey: Survey): Promise<boolean> {
    const { error: surveyError } = await supabase
      .from('surveys')
      .update({
        title: survey.title,
        description: survey.description
      })
      .eq('id', survey.id);

    if (surveyError) throw surveyError;
    
    // Handle questions update: we'll use a simple approach of deleting and recreating
    const { error: deleteError } = await supabase
      .from('questions')
      .delete()
      .eq('survey_id', survey.id);
    
    if (deleteError) throw deleteError;

    if (survey.questions && survey.questions.length > 0) {
      const questionsToInsert = survey.questions.map((question, index) => ({
        survey_id: survey.id,
        title: question.title,
        description: question.description,
        type: question.type,
        required: question.required,
        options: question.options,
        order: index
      }));

      const { error: questionsError } = await supabase
        .from('questions')
        .insert(questionsToInsert);

      if (questionsError) throw questionsError;
    }

    return true;
  }

  async deleteSurvey(id: string): Promise<boolean> {
    // Delete questions first (cascade would work too if set up in DB)
    await supabase
      .from('questions')
      .delete()
      .eq('survey_id', id);
    
    // Delete the survey
    const { error } = await supabase
      .from('surveys')
      .delete()
      .eq('id', id);

    return !error;
  }

  async getSurveysByStatus(status: string): Promise<Survey[]> {
    const { data, error } = await supabase
      .from('surveys')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return (data || []).map(this.mapToSurvey);
  }

  async getSurveyStatistics(surveyId: string): Promise<SurveyStatistics> {
    // This would need to be implemented based on actual data structure
    // Here's a mock implementation
    return {
      totalResponses: 0,
      averageCompletionTime: 0,
      completionRate: 0,
      questionStats: []
    };
  }

  async sendSurveyEmails(surveyId: string, emailAddresses: string[]): Promise<boolean> {
    // This would call a serverless function to send emails
    // Mock implementation
    console.log(`Would send survey ${surveyId} to ${emailAddresses.join(', ')}`);
    return true;
  }

  private mapToSurvey(data: any): Survey {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      createdAt: data.created_at,
      questions: [] // Questions would be loaded separately
    };
  }

  private mapToSurveyWithQuestions(data: any): Survey {
    const survey = this.mapToSurvey(data);
    
    if (data.questions) {
      survey.questions = data.questions.map((q: any) => ({
        id: q.id,
        title: q.title,
        description: q.description,
        type: q.type,
        required: q.required,
        options: q.options,
      }));
    }
    
    return survey;
  }
}
