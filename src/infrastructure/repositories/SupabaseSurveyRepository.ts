import { supabase } from '@/integrations/supabase/client';
import { Survey, SurveyStatistics } from '../../domain/models/Survey';
import { SurveyRepository } from '../../domain/repositories/SurveyRepository';
import { Json } from '@/integrations/supabase/types';

export class SupabaseSurveyRepository implements SurveyRepository {
  async getAllSurveys(): Promise<Survey[]> {
    const { data, error } = await supabase.from('surveys').select('*');
    
    if (error) {
      console.error('Error fetching surveys:', error);
      throw error;
    }
    
    return data.map(this.mapToSurvey) || [];
  }
  
  async getSurveyById(id: string): Promise<Survey | null> {
    const { data, error } = await supabase
      .from('surveys')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) {
      console.error(`Error fetching survey with id ${id}:`, error);
      throw error;
    }
    
    return data ? this.mapToSurvey(data) : null;
  }
  
  async createSurvey(survey: Omit<Survey, 'id' | 'createdAt'>): Promise<Survey> {
    const { data, error } = await supabase
      .from('surveys')
      .insert({
        title: survey.title,
        description: survey.description,
        questions: survey.questions as unknown as Json,
        delivery_config: survey.deliveryConfig as unknown as Json
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating survey:', error);
      throw error;
    }
    
    return this.mapToSurvey(data);
  }
  
  async updateSurvey(survey: Survey): Promise<boolean> {
    const { error } = await supabase
      .from('surveys')
      .update({
        title: survey.title,
        description: survey.description,
        questions: survey.questions as unknown as Json,
        delivery_config: survey.deliveryConfig as unknown as Json
      })
      .eq('id', survey.id);
    
    if (error) {
      console.error(`Error updating survey with id ${survey.id}:`, error);
      throw error;
    }
    
    return true;
  }
  
  async deleteSurvey(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('surveys')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting survey with id ${id}:`, error);
      throw error;
    }
    
    return true;
  }

  private mapToSurvey(item: any): Survey {
    let deliveryConfig: any = undefined;
    
    if (item.delivery_config) {
      const deliveryConfigData = item.delivery_config as any;
      
      deliveryConfig = {
        type: deliveryConfigData.type ? String(deliveryConfigData.type) : 'manual',
        emailAddresses: Array.isArray(deliveryConfigData.emailAddresses) 
          ? deliveryConfigData.emailAddresses 
          : [],
      } as Survey['deliveryConfig'];

      if (deliveryConfigData.schedule) {
        deliveryConfig.schedule = {
          frequency: deliveryConfigData.schedule.frequency || 'daily',
          dayOfMonth: Number(deliveryConfigData.schedule.dayOfMonth || 1),
          dayOfWeek: Number(deliveryConfigData.schedule.dayOfWeek || 1),
          time: String(deliveryConfigData.schedule.time || '12:00'),
        };
      }
      
      if (deliveryConfigData.trigger) {
        deliveryConfig.trigger = {
          type: deliveryConfigData.trigger.type || 'ticket-closed',
          delayHours: Number(deliveryConfigData.trigger.delayHours || 24),
          sendAutomatically: Boolean(deliveryConfigData.trigger.sendAutomatically || false),
        };
      }
    }

    return {
      id: String(item.id),
      title: String(item.title),
      description: item.description ? String(item.description) : undefined,
      questions: Array.isArray(item.questions) ? item.questions : [],
      createdAt: String(item.created_at),
      deliveryConfig: deliveryConfig
    };
  }
  
  async getSurveysByStatus(status: string): Promise<Survey[]> {
    const { data, error } = await supabase
      .from('surveys')
      .select('*');
    
    if (error) {
      console.error('Error fetching surveys by status:', error);
      throw error;
    }
    
    return (data || []).map(this.mapToSurvey);
  }
  
  async getSurveyStatistics(surveyId: string): Promise<SurveyStatistics> {
    const { data: responses, error: responsesError } = await supabase
      .from('survey_responses')
      .select('*')
      .eq('survey_id', surveyId);
    
    if (responsesError) {
      console.error(`Error fetching responses for survey ${surveyId}:`, responsesError);
      throw responsesError;
    }
    
    const { data: survey, error: surveyError } = await supabase
      .from('surveys')
      .select('*')
      .eq('id', surveyId)
      .maybeSingle();
    
    if (surveyError) {
      console.error(`Error fetching survey ${surveyId}:`, surveyError);
      throw surveyError;
    }
    
    if (!survey) {
      throw new Error(`Survey with id ${surveyId} not found`);
    }
    
    const totalResponses = responses.length;
    let completionRate = 0;
    let averageCompletionTime = 0;
    
    if (totalResponses > 0) {
      const totalCompletionTime = responses.reduce((sum, response) => {
        const completionTime = response.completion_time !== undefined ? 
          (response.completion_time as number) : 0;
        return sum + completionTime;
      }, 0);
      
      averageCompletionTime = totalCompletionTime / totalResponses;
      completionRate = 100;
    }
    
    return {
      totalResponses,
      averageCompletionTime,
      completionRate,
      questionStats: []
    };
  }
  
  async sendSurveyEmails(surveyId: string, emailAddresses: string[]): Promise<boolean> {
    console.log(`Sending survey ${surveyId} to:`, emailAddresses);
    return true;
  }
}
