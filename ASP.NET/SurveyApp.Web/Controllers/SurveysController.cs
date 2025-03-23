
using Microsoft.AspNetCore.Mvc;
using SurveyApp.Application.Interfaces;
using SurveyApp.Domain.Models;
using SurveyApp.Web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SurveyApp.Web.Controllers
{
    public class SurveysController : Controller
    {
        private readonly ISurveyService _surveyService;
        private readonly ISurveyResponseService _responseService;

        public SurveysController(ISurveyService surveyService, ISurveyResponseService responseService)
        {
            _surveyService = surveyService;
            _responseService = responseService;
        }

        // GET: Surveys
        public async Task<IActionResult> Index()
        {
            var surveys = await GetSurveys();
            ViewBag.FilterActive = "all"; // Default filter
            
            return View(surveys);
        }

        // GET: Surveys/Filter
        [HttpGet]
        public async Task<ActionResult> Filter(string filter)
        {
            var allSurveys = await GetSurveys();
            var filteredSurveys = filter switch
            {
                "active" => allSurveys.Where(s => s.Status == "active").ToList(),
                "draft" => allSurveys.Where(s => s.Status == "draft").ToList(),
                "archived" => allSurveys.Where(s => s.Status == "archived").ToList(),
                _ => allSurveys
            };

            ViewBag.FilterActive = filter ?? "all";
            return View("Index", filteredSurveys);
        }

        // GET: Surveys/Create
        public IActionResult Create()
        {
            return View(new CreateSurveyViewModel
            {
                Id = 0, // New survey
                Questions = new List<SurveyQuestionViewModel>
                {
                    new SurveyQuestionViewModel
                    {
                        Id = Guid.NewGuid().ToString(),
                        Type = "single-choice",
                        Title = "",
                        Required = true,
                        Options = new List<string> { "Option 1", "Option 2", "Option 3" }
                    }
                },
                DeliveryConfig = new DeliveryConfigViewModel
                {
                    Type = "manual",
                    EmailAddresses = new List<string>(),
                    Schedule = new ScheduleSettingsViewModel(),
                    Trigger = new TriggerSettingsViewModel()
                }
            });
        }

        // POST: Surveys/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(CreateSurveyViewModel model)
        {
            if (ModelState.IsValid)
            {
                var survey = new Survey
                {
                    Title = model.Title,
                    Description = model.Description,
                    CreatedAt = DateTime.Now,
                    Status = model.Status,
                    Questions = model.Questions.Select(q => new Question
                    {
                        Text = q.Title,
                        Type = q.Type,
                        Required = q.Required,
                        Description = q.Description,
                        Options = q.Options,
                        Settings = q.Settings != null 
                            ? new QuestionSettings 
                            { 
                                Min = q.Settings.Min, 
                                Max = q.Settings.Max 
                            } 
                            : null
                    }).ToList(),
                    DeliveryConfig = new DeliveryConfiguration
                    {
                        Type = model.DeliveryConfig.Type,
                        EmailAddresses = model.DeliveryConfig.EmailAddresses,
                        Schedule = model.DeliveryConfig.Schedule != null 
                            ? new ScheduleSettings
                            {
                                Frequency = model.DeliveryConfig.Schedule.Frequency,
                                DayOfMonth = model.DeliveryConfig.Schedule.DayOfMonth,
                                Time = model.DeliveryConfig.Schedule.Time
                            }
                            : null,
                        Trigger = model.DeliveryConfig.Trigger != null
                            ? new TriggerSettings
                            {
                                Type = model.DeliveryConfig.Trigger.Type,
                                DelayHours = model.DeliveryConfig.Trigger.DelayHours,
                                SendAutomatically = model.DeliveryConfig.Trigger.SendAutomatically
                            }
                            : null
                    }
                };

                bool success;
                if (model.Id > 0)
                {
                    survey.Id = model.Id;
                    success = await _surveyService.UpdateSurveyAsync(survey);
                    if (success)
                        TempData["SuccessMessage"] = "Survey updated successfully.";
                    else
                        TempData["ErrorMessage"] = "Failed to update survey.";
                }
                else
                {
                    success = await _surveyService.CreateSurveyAsync(survey);
                    if (success)
                        TempData["SuccessMessage"] = "Survey created successfully.";
                    else
                        TempData["ErrorMessage"] = "Failed to create survey.";
                }

                if (success)
                    return RedirectToAction(nameof(Index));
            }

            return View(model);
        }

        // GET: Surveys/Edit/5
        public async Task<IActionResult> Edit(int id)
        {
            var survey = await _surveyService.GetSurveyByIdAsync(id);
            if (survey == null)
            {
                return NotFound();
            }

            var model = new CreateSurveyViewModel
            {
                Id = survey.Id,
                Title = survey.Title,
                Description = survey.Description,
                Status = survey.Status,
                Questions = survey.Questions.Select(q => new SurveyQuestionViewModel
                {
                    Id = q.Id.ToString(),
                    Title = q.Text,
                    Type = q.Type,
                    Required = q.Required,
                    Description = q.Description,
                    Options = q.Options,
                    Settings = q.Settings != null 
                        ? new QuestionSettingsViewModel
                        {
                            Min = q.Settings.Min,
                            Max = q.Settings.Max
                        }
                        : null
                }).ToList(),
                DeliveryConfig = survey.DeliveryConfig != null
                    ? new DeliveryConfigViewModel
                    {
                        Type = survey.DeliveryConfig.Type,
                        EmailAddresses = survey.DeliveryConfig.EmailAddresses,
                        Schedule = survey.DeliveryConfig.Schedule != null
                            ? new ScheduleSettingsViewModel
                            {
                                Frequency = survey.DeliveryConfig.Schedule.Frequency,
                                DayOfMonth = survey.DeliveryConfig.Schedule.DayOfMonth,
                                Time = survey.DeliveryConfig.Schedule.Time
                            }
                            : new ScheduleSettingsViewModel(),
                        Trigger = survey.DeliveryConfig.Trigger != null
                            ? new TriggerSettingsViewModel
                            {
                                Type = survey.DeliveryConfig.Trigger.Type,
                                DelayHours = survey.DeliveryConfig.Trigger.DelayHours,
                                SendAutomatically = survey.DeliveryConfig.Trigger.SendAutomatically
                            }
                            : new TriggerSettingsViewModel()
                    }
                    : new DeliveryConfigViewModel()
            };

            return View("Create", model);
        }

        // GET: Surveys/Preview/5
        public async Task<IActionResult> Preview(int id)
        {
            var survey = await _surveyService.GetSurveyByIdAsync(id);
            if (survey == null)
            {
                return NotFound();
            }

            var model = new SurveyPreviewViewModel
            {
                Id = survey.Id.ToString(),
                Title = survey.Title,
                Description = survey.Description,
                Questions = survey.Questions.Select(q => new QuestionViewModel
                {
                    Id = q.Id.ToString(),
                    Title = q.Text,
                    Type = q.Type,
                    Required = q.Required,
                    Description = q.Description,
                    Options = q.Options,
                    Settings = q.Settings != null 
                        ? new QuestionSettingsViewModel
                        {
                            Min = q.Settings.Min,
                            Max = q.Settings.Max
                        }
                        : null
                }).ToList()
            };

            return View(model);
        }
        
        // GET: Surveys/Results/5
        public async Task<IActionResult> Results(int id)
        {
            var survey = await _surveyService.GetSurveyByIdAsync(id);
            if (survey == null)
            {
                return NotFound();
            }
            
            var responses = await _responseService.GetResponsesBySurveyIdAsync(id);
            
            var model = new SurveyResultsViewModel
            {
                Survey = new SurveyViewModel
                {
                    Id = survey.Id.ToString(),
                    Title = survey.Title,
                    Description = survey.Description,
                    CreatedAt = survey.CreatedAt,
                    Responses = responses.Count(),
                    CompletionRate = CalculateCompletionRate(responses, survey),
                    Status = survey.Status
                },
                Responses = responses.Select(r => new SurveyResponseViewModel
                {
                    Id = r.Id.ToString(),
                    SurveyId = r.SurveyId.ToString(),
                    RespondentName = r.RespondentName,
                    RespondentEmail = r.RespondentEmail,
                    SubmittedAt = r.SubmittedAt,
                    Answers = r.Answers.Select(a => new QuestionResponseViewModel
                    {
                        QuestionId = a.QuestionId,
                        QuestionTitle = a.QuestionTitle,
                        QuestionType = a.QuestionType,
                        Value = a.Value,
                        IsValid = a.IsValid
                    }).ToList()
                }).ToList()
            };

            return View(model);
        }

        // POST: Surveys/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _surveyService.DeleteSurveyAsync(id);
            if (result)
                TempData["SuccessMessage"] = "Survey deleted successfully.";
            else
                TempData["ErrorMessage"] = "Failed to delete survey.";
                
            return RedirectToAction(nameof(Index));
        }

        // Helper method to get surveys
        private async Task<List<SurveyViewModel>> GetSurveys()
        {
            try
            {
                var surveys = await _surveyService.GetAllSurveysAsync();
                var surveyViewModels = new List<SurveyViewModel>();
                
                foreach (var survey in surveys)
                {
                    var responses = await _responseService.GetResponsesBySurveyIdAsync(survey.Id);
                    
                    surveyViewModels.Add(new SurveyViewModel
                    {
                        Id = survey.Id.ToString(),
                        Title = survey.Title,
                        Description = survey.Description,
                        CreatedAt = survey.CreatedAt,
                        Responses = responses.Count(),
                        CompletionRate = CalculateCompletionRate(responses, survey),
                        Status = survey.Status
                    });
                }
                
                return surveyViewModels;
            }
            catch (Exception ex)
            {
                // Log the exception
                Console.WriteLine($"Error getting surveys: {ex.Message}");
                return new List<SurveyViewModel>();
            }
        }
        
        // Helper method to calculate completion rate
        private int CalculateCompletionRate(IEnumerable<SurveyResponse> responses, Survey survey)
        {
            if (!responses.Any())
                return 0;
                
            var requiredQuestions = survey.Questions.Count(q => q.Required);
            if (requiredQuestions == 0)
                return 100;
                
            var totalAnswered = 0;
            var totalRequired = responses.Count() * requiredQuestions;
            
            foreach (var response in responses)
            {
                var answeredRequired = response.Answers.Count(a => 
                    survey.Questions.FirstOrDefault(q => q.Id.ToString() == a.QuestionId)?.Required == true
                    && !string.IsNullOrEmpty(a.Value));
                    
                totalAnswered += answeredRequired;
            }
            
            return totalRequired > 0 ? (int)(totalAnswered * 100.0 / totalRequired) : 100;
        }
    }
    
    // Additional ViewModel to support the Results view
    public class SurveyResultsViewModel
    {
        public SurveyViewModel Survey { get; set; }
        public List<SurveyResponseViewModel> Responses { get; set; }
    }
}
