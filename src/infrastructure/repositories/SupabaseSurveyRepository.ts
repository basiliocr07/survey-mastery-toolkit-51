
import { Survey, SurveyQuestion, SurveyStatistics } from '../../domain/models/Survey';
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
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    if (!data) return null;
    
    return this.mapToSurvey(data);
  }

  async createSurvey(survey: Omit<Survey, 'id' | 'createdAt'>): Promise<Survey> {
    const { data, error } = await supabase
      .from('surveys')
      .insert([{
        title: survey.title,
        description: survey.description,
        questions: survey.questions,
        delivery_config: survey.deliveryConfig,
        status: 'active',
        created_at: new Date().toISOString()
      }])
      .select();

    if (error) throw error;
    
    return this.mapToSurvey(data[0]);
  }

  async updateSurvey(survey: Survey): Promise<boolean> {
    const { error } = await supabase
      .from('surveys')
      .update({
        title: survey.title,
        description: survey.description,
        questions: survey.questions,
        delivery_config: survey.deliveryConfig,
        status: survey.status
      })
      .eq('id', survey.id);

    return !error;
  }

  async deleteSurvey(id: string): Promise<boolean> {
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
    // Get all responses for this survey
    const { data: responses, error: responsesError } = await supabase
      .from('survey_responses')
      .select('*')
      .eq('survey_id', surveyId);

    if (responsesError) throw responsesError;

    // Get survey details
    const survey = await this.getSurveyById(surveyId);
    if (!survey) throw new Error('Survey not found');

    // Calculate basic statistics
    const totalResponses = responses?.length || 0;
    const completionTimes = responses?.map(r => r.completion_time || 0).filter(t => t > 0) || [];
    const averageCompletionTime = completionTimes.length > 0 
      ? completionTimes.reduce((sum, time) => sum + time, 0) / completionTimes.length 
      : 0;

    // Calculate completion rate
    const requiredQuestions = survey.questions.filter(q => q.required).length;
    let completionRate = 0;
    
    if (totalResponses > 0 && requiredQuestions > 0) {
      const totalAnswered = responses.reduce((sum, response) => {
        const answeredCount = Object.keys(response.answers || {}).length;
        return sum + answeredCount;
      }, 0);
      completionRate = (totalAnswered / (totalResponses * requiredQuestions)) * 100;
    } else if (totalResponses > 0) {
      completionRate = 100; // If no required questions, count as 100% complete
    }

    // Calculate question-specific statistics
    const questionStats = survey.questions.map(question => {
      const questionResponses = responses
        .filter(r => r.answers && r.answers[question.id])
        .map(r => r.answers[question.id]);
      
      // Count occurrences of each answer
      const answerCounts: Record<string, number> = {};
      
      questionResponses.forEach(answer => {
        if (Array.isArray(answer)) {
          answer.forEach(a => {
            answerCounts[a] = (answerCounts[a] || 0) + 1;
          });
        } else if (answer) {
          answerCounts[answer] = (answerCounts[answer] || 0) + 1;
        }
      });
      
      // Convert to expected format
      const stats = Object.entries(answerCounts).map(([answer, count]) => ({
        answer,
        count,
        percentage: totalResponses > 0 ? (count / totalResponses) * 100 : 0
      }));
      
      return {
        questionId: question.id,
        questionTitle: question.title,
        responses: stats
      };
    });

    return {
      totalResponses,
      averageCompletionTime,
      completionRate,
      questionStats
    };
  }

  async sendSurveyEmails(surveyId: string, emailAddresses: string[]): Promise<boolean> {
    try {
      const { error } = await supabase.functions.invoke('send-survey-emails', {
        body: { surveyId, emailAddresses }
      });
      
      return !error;
    } catch (error) {
      console.error('Error sending survey emails:', error);
      return false;
    }
  }

  private mapToSurvey(data: any): Survey {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      questions: data.questions || [],
      createdAt: data.created_at,
      deliveryConfig: data.delivery_config
    };
  }
}
