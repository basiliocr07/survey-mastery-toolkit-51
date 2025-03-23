
using SurveyApp.Application.Interfaces;
using SurveyApp.Domain.Models;
using SurveyApp.Domain.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SurveyApp.Application.Services
{
    public class SurveyService : ISurveyService
    {
        private readonly ISurveyRepository _surveyRepository;
        private readonly ISurveyResponseRepository _responseRepository;

        public SurveyService(ISurveyRepository surveyRepository, ISurveyResponseRepository responseRepository)
        {
            _surveyRepository = surveyRepository;
            _responseRepository = responseRepository;
        }

        public async Task<IEnumerable<Survey>> GetAllSurveysAsync()
        {
            return await _surveyRepository.GetAllAsync();
        }

        public async Task<Survey?> GetSurveyByIdAsync(int id)
        {
            return await _surveyRepository.GetByIdAsync(id);
        }

        public async Task<bool> CreateSurveyAsync(Survey survey)
        {
            // Set creation date if not already set
            if (survey.CreatedAt == default)
            {
                survey.CreatedAt = DateTime.UtcNow;
            }
            
            return await _surveyRepository.AddAsync(survey);
        }

        public async Task<bool> UpdateSurveyAsync(Survey survey)
        {
            return await _surveyRepository.UpdateAsync(survey);
        }

        public async Task<bool> DeleteSurveyAsync(int id)
        {
            return await _surveyRepository.DeleteAsync(id);
        }

        public async Task<IEnumerable<Survey>> GetSurveysByStatusAsync(string status)
        {
            var surveys = await _surveyRepository.GetAllAsync();
            return status.ToLower() switch
            {
                "active" => surveys.Where(s => s.Status == "active"),
                "draft" => surveys.Where(s => s.Status == "draft"),
                "archived" => surveys.Where(s => s.Status == "archived"),
                _ => surveys
            };
        }

        public async Task<bool> SendSurveyEmailsAsync(int surveyId, List<string> emailAddresses)
        {
            // In a real implementation, this would connect to an email service
            // For now, we just return true to simulate success
            var survey = await _surveyRepository.GetByIdAsync(surveyId);
            if (survey == null || emailAddresses.Count == 0)
                return false;

            // Email sending logic would go here
            return true;
        }

        // Get survey response statistics with accurate completion rate calculation
        public async Task<SurveyStatistics> GetSurveyStatisticsAsync(int surveyId)
        {
            var survey = await _surveyRepository.GetByIdAsync(surveyId);
            if (survey == null)
                return new SurveyStatistics 
                { 
                    SurveyId = surveyId,
                    TotalResponses = 0,
                    CompletionRate = 0,
                    AverageCompletionTime = 0,
                    StartDate = DateTime.UtcNow,
                    EndDate = null
                };

            var responses = await _responseRepository.GetBySurveyIdAsync(surveyId);
            var responsesList = responses.ToList();
            
            // Calculate total responses
            int totalResponses = responsesList.Count;
            
            // Calculate completion rate
            int completionRate = 0;
            if (totalResponses > 0)
            {
                var requiredQuestions = survey.Questions.Count(q => q.Required);
                if (requiredQuestions == 0)
                {
                    completionRate = 100;
                }
                else
                {
                    int totalRequired = totalResponses * requiredQuestions;
                    int totalAnswered = 0;
                    
                    foreach (var response in responsesList)
                    {
                        var answeredRequired = response.Answers.Count(a => 
                            survey.Questions.FirstOrDefault(q => q.Id.ToString() == a.QuestionId)?.Required == true
                            && !string.IsNullOrEmpty(a.Value));
                            
                        totalAnswered += answeredRequired;
                    }
                    
                    completionRate = totalRequired > 0 ? (int)(totalAnswered * 100.0 / totalRequired) : 100;
                }
            }
            
            // Calculate average completion time
            int averageCompletionTime = 0;
            if (totalResponses > 0)
            {
                int totalCompletionTime = responsesList.Sum(r => r.CompletionTime ?? 0);
                averageCompletionTime = totalCompletionTime / totalResponses;
            }

            return new SurveyStatistics
            {
                SurveyId = surveyId,
                TotalResponses = totalResponses,
                CompletionRate = completionRate,
                AverageCompletionTime = averageCompletionTime,
                StartDate = survey.CreatedAt,
                EndDate = null // Ongoing survey
            };
        }
    }

    // Class to hold survey statistics
    public class SurveyStatistics
    {
        public int SurveyId { get; set; }
        public int TotalResponses { get; set; }
        public int CompletionRate { get; set; }
        public int AverageCompletionTime { get; set; } // In seconds
        public System.DateTime StartDate { get; set; }
        public System.DateTime? EndDate { get; set; }
        
        // Add questionStats property to match the React implementation
        public List<QuestionStat> QuestionStats { get; set; } = new List<QuestionStat>();
    }
    
    public class QuestionStat
    {
        public string QuestionId { get; set; } = string.Empty;
        public string QuestionTitle { get; set; } = string.Empty;
        public List<AnswerStat> Responses { get; set; } = new List<AnswerStat>();
    }
    
    public class AnswerStat
    {
        public string Answer { get; set; } = string.Empty;
        public int Count { get; set; }
        public double Percentage { get; set; }
    }
}
