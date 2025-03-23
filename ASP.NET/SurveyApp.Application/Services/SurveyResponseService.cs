
using SurveyApp.Application.Interfaces;
using SurveyApp.Domain.Models;
using SurveyApp.Domain.Repositories;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SurveyApp.Application.Services
{
    public class SurveyResponseService : ISurveyResponseService
    {
        private readonly ISurveyResponseRepository _surveyResponseRepository;
        private readonly ISurveyRepository _surveyRepository;

        public SurveyResponseService(
            ISurveyResponseRepository surveyResponseRepository,
            ISurveyRepository surveyRepository)
        {
            _surveyResponseRepository = surveyResponseRepository;
            _surveyRepository = surveyRepository;
        }

        public async Task<IEnumerable<SurveyResponse>> GetAllResponsesAsync()
        {
            return await _surveyResponseRepository.GetAllAsync();
        }

        public async Task<SurveyResponse?> GetResponseByIdAsync(int id)
        {
            return await _surveyResponseRepository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<SurveyResponse>> GetResponsesBySurveyIdAsync(int surveyId)
        {
            return await _surveyResponseRepository.GetBySurveyIdAsync(surveyId);
        }

        public async Task<bool> SubmitResponseAsync(SurveyResponse surveyResponse)
        {
            // Set submission time if not already set
            if (surveyResponse.SubmittedAt == default)
            {
                surveyResponse.SubmittedAt = DateTime.UtcNow;
            }
            
            // Validate answers against survey questions
            var survey = await _surveyRepository.GetByIdAsync(surveyResponse.SurveyId);
            if (survey != null)
            {
                foreach (var answer in surveyResponse.Answers)
                {
                    var question = survey.Questions.Find(q => q.Id.ToString() == answer.QuestionId);
                    if (question != null)
                    {
                        // Set question title if not provided
                        if (string.IsNullOrEmpty(answer.QuestionTitle))
                        {
                            answer.QuestionTitle = question.Text;
                        }
                        
                        // Validate answer based on question type
                        answer.IsValid = ValidateAnswer(answer.Value, question);
                    }
                }
            }
            
            return await _surveyResponseRepository.AddAsync(surveyResponse);
        }

        public async Task<bool> UpdateResponseAsync(SurveyResponse surveyResponse)
        {
            return await _surveyResponseRepository.UpdateAsync(surveyResponse);
        }

        public async Task<bool> DeleteResponseAsync(int id)
        {
            return await _surveyResponseRepository.DeleteAsync(id);
        }
        
        // Helper method to validate answers based on question type
        private bool ValidateAnswer(string value, Question question)
        {
            if (question.Required && string.IsNullOrEmpty(value))
            {
                return false;
            }
            
            switch (question.Type)
            {
                case "rating":
                    // Check if rating is within valid range
                    if (int.TryParse(value, out int rating))
                    {
                        int min = question.Settings?.Min ?? 1;
                        int max = question.Settings?.Max ?? 5;
                        return rating >= min && rating <= max;
                    }
                    return false;
                
                case "single-choice":
                    // Check if the value is one of the options
                    return !question.Required || question.Options.Contains(value);
                
                case "multiple-choice":
                    // In this case value would be a serialized list of choices
                    // For simplicity we'll just check if it's not empty for required questions
                    return !question.Required || !string.IsNullOrEmpty(value);
                
                default:
                    // For text-based questions, just ensure there's a value if required
                    return !question.Required || !string.IsNullOrEmpty(value);
            }
        }
    }
}
