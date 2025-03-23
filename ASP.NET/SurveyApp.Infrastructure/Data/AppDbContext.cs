
using Microsoft.EntityFrameworkCore;
using SurveyApp.Domain.Models;
using System.Text.Json;

namespace SurveyApp.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Survey> Surveys { get; set; }
        public DbSet<SurveyResponse> SurveyResponses { get; set; }
        public DbSet<QuestionResponse> QuestionResponses { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Survey>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Description).HasMaxLength(1000);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(e => e.Status).HasMaxLength(20).HasDefaultValue("active");
                entity.Property(e => e.ResponseCount).HasDefaultValue(0);
                entity.Property(e => e.CompletionRate).HasDefaultValue(0);
                
                // Configure Questions as a JSON column
                entity.Property(e => e.Questions)
                      .HasConversion(
                          v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
                          v => JsonSerializer.Deserialize<List<Question>>(v, (JsonSerializerOptions)null) ?? new List<Question>());
                
                // Configure DeliveryConfig as a JSON column          
                entity.Property(e => e.DeliveryConfig)
                      .HasConversion(
                          v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
                          v => JsonSerializer.Deserialize<DeliveryConfiguration>(v, (JsonSerializerOptions)null));
            });

            modelBuilder.Entity<SurveyResponse>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.RespondentName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.RespondentEmail).IsRequired().HasMaxLength(100);
                entity.Property(e => e.RespondentPhone).HasMaxLength(20);
                entity.Property(e => e.RespondentCompany).HasMaxLength(100);
                entity.Property(e => e.SubmittedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.Property(e => e.IsExistingClient).HasDefaultValue(false);
                entity.Property(e => e.ExistingClientId).HasMaxLength(50);
                entity.Property(e => e.CompletionTime);

                entity.HasOne(e => e.Survey)
                      .WithMany()
                      .HasForeignKey(e => e.SurveyId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<QuestionResponse>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.QuestionId).IsRequired();
                entity.Property(e => e.QuestionTitle).IsRequired().HasMaxLength(255);
                entity.Property(e => e.QuestionType).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Value).IsRequired();
                entity.Property(e => e.IsValid).HasDefaultValue(true);

                entity.HasOne(e => e.SurveyResponse)
                      .WithMany(s => s.Answers)
                      .HasForeignKey(e => e.SurveyResponseId)
                      .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
