
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../../integrations/supabase/client';
import { Survey, SurveyStatistics } from '../../domain/models/Survey';
import { SurveyRepository } from '../../domain/repositories/SurveyRepository';

export class SupabaseSurveyRepository implements SurveyRepository {
  async getAllSurveys(): Promise<Survey[]> {
    try {
      const { data, error } = await supabase
        .from('surveys')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(this.mapFromDatabase);
    } catch (error) {
      console.error('Error fetching surveys:', error);
      throw error;
    }
  }

  async getSurveyById(id: string): Promise<Survey | null> {
    try {
      const { data, error } = await supabase
        .from('surveys')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Record not found
        throw error;
      }

      return this.mapFromDatabase(data);
    } catch (error) {
      console.error(`Error fetching survey ${id}:`, error);
      throw error;
    }
  }

  async createSurvey(surveyData: Omit<Survey, 'id' | 'createdAt'>): Promise<Survey> {
    try {
      const newSurvey = {
        id: uuidv4(),
        ...surveyData,
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('surveys')
        .insert(this.mapToDatabase(newSurvey))
        .select()
        .single();

      if (error) throw error;

      return this.mapFromDatabase(data);
    } catch (error) {
      console.error('Error creating survey:', error);
      throw error;
    }
  }

  async updateSurvey(survey: Survey): Promise<Survey> {
    try {
      const { data, error } = await supabase
        .from('surveys')
        .update(this.mapToDatabase(survey))
        .eq('id', survey.id)
        .select()
        .single();

      if (error) throw error;

      return this.mapFromDatabase(data);
    } catch (error) {
      console.error(`Error updating survey ${survey.id}:`, error);
      throw error;
    }
  }

  async deleteSurvey(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('surveys')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error(`Error deleting survey ${id}:`, error);
      throw error;
    }
  }

  async getSurveyStatistics(surveyId: string): Promise<SurveyStatistics> {
    try {
      // This would typically be a more complex implementation depending on the database schema
      // and how responses are stored. For now, we'll return mock statistics.
      
      const { data: responses, error } = await supabase
        .from('survey_responses')
        .select('*')
        .eq('survey_id', surveyId);

      if (error) throw error;

      // Calculate statistics based on responses
      // This would be more complex in a real implementation
      const totalResponses = responses.length;
      
      return {
        totalResponses,
        completionRate: 0.75, // Mock data
        averageCompletionTime: 120, // 2 minutes (mock data)
        questionStats: [] // Mock data
      };
    } catch (error) {
      console.error(`Error fetching statistics for survey ${surveyId}:`, error);
      throw error;
    }
  }

  async sendSurveyEmails(surveyId: string, emailAddresses: string[]): Promise<boolean> {
    try {
      // This would typically involve calling an email service API
      // For this implementation, we'll just log the attempt and return success
      console.log(`Sending survey ${surveyId} to:`, emailAddresses);
      
      // In a real implementation, you would call an API endpoint or service
      // For example:
      // const { data, error } = await supabase.functions.invoke('send-survey-emails', {
      //   body: { surveyId, emailAddresses }
      // });
      
      return true;
    } catch (error) {
      console.error(`Error sending emails for survey ${surveyId}:`, error);
      throw error;
    }
  }

  // Helper methods to map between domain model and database schema
  private mapFromDatabase(data: any): Survey {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      questions: data.questions,
      createdAt: data.created_at,
      deliveryConfig: data.delivery_config
    };
  }

  private mapToDatabase(survey: any): any {
    return {
      id: survey.id,
      title: survey.title,
      description: survey.description,
      questions: survey.questions,
      created_at: survey.createdAt,
      delivery_config: survey.deliveryConfig
    };
  }
}
