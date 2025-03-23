using Microsoft.EntityFrameworkCore;
using SurveyApp.Domain.Models;
using SurveyApp.Domain.Repositories;
using SurveyApp.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SurveyApp.Infrastructure.Repositories
{
    public class SurveyResponseRepository : ISurveyResponseRepository
    {
        private readonly AppDbContext _context;

        public SurveyResponseRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<SurveyResponse>> GetAllAsync()
        {
            return await _context.SurveyResponses
                .Include(r => r.Answers)
                .Include(r => r.Survey)
                .OrderByDescending(r => r.SubmittedAt)
                .ToListAsync();
        }

        public async Task<SurveyResponse?> GetByIdAsync(int id)
        {
            return await _context.SurveyResponses
                .Include(r => r.Answers)
                .Include(r => r.Survey)
                .FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task<IEnumerable<SurveyResponse>> GetBySurveyIdAsync(int surveyId)
        {
            return await _context.SurveyResponses
                .Include(r => r.Answers)
                .Include(r => r.Survey)
                .Where(r => r.SurveyId == surveyId)
                .OrderByDescending(r => r.SubmittedAt)
                .ToListAsync();
        }

        public async Task<bool> AddAsync(SurveyResponse surveyResponse)
        {
            // Capture submission time if not set
            if (surveyResponse.SubmittedAt == default)
            {
                surveyResponse.SubmittedAt = DateTime.UtcNow;
            }
            
            // Set completion time if not provided
            if (surveyResponse.CompletionTime == null)
            {
                surveyResponse.CompletionTime = 0;
            }
            
            _context.SurveyResponses.Add(surveyResponse);
            
            // Update the survey response count
            if (surveyResponse.SurveyId > 0)
            {
                var survey = await _context.Surveys.FindAsync(surveyResponse.SurveyId);
                if (survey != null)
                {
                    survey.ResponseCount += 1;
                    _context.Surveys.Update(survey);
                }
            }
            
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateAsync(SurveyResponse surveyResponse)
        {
            _context.SurveyResponses.Update(surveyResponse);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var surveyResponse = await _context.SurveyResponses.FindAsync(id);
            if (surveyResponse == null)
                return false;
                
            // Update the survey response count
            if (surveyResponse.SurveyId > 0)
            {
                var survey = await _context.Surveys.FindAsync(surveyResponse.SurveyId);
                if (survey != null && survey.ResponseCount > 0)
                {
                    survey.ResponseCount -= 1;
                    _context.Surveys.Update(survey);
                }
            }
            
            _context.SurveyResponses.Remove(surveyResponse);
            return await _context.SaveChangesAsync() > 0;
        }
        
        public async Task<IEnumerable<QuestionResponse>> GetResponsesByQuestionIdAsync(int surveyId, string questionId)
        {
            return await _context.QuestionResponses
                .Include(qr => qr.SurveyResponse)
                .Where(qr => qr.SurveyResponse.SurveyId == surveyId && qr.QuestionId == questionId)
                .ToListAsync();
        }
    }
}
