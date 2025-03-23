
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Survey } from '@/domain/models/Survey';
import { SupabaseSurveyRepository } from '@/infrastructure/repositories/SupabaseSurveyRepository';

const surveyRepository = new SupabaseSurveyRepository();

export function useSurvey() {
  const queryClient = useQueryClient();

  const { data: surveys, isLoading: isLoadingSurveys } = useQuery({
    queryKey: ['surveys'],
    queryFn: surveyRepository.getAllSurveys.bind(surveyRepository),
  });

  const { mutateAsync: createSurvey, isPending: isCreating } = useMutation({
    mutationFn: (survey: Omit<Survey, 'id' | 'createdAt'>) => 
      surveyRepository.createSurvey(survey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
    },
  });

  const { mutateAsync: updateSurvey, isPending: isUpdating } = useMutation({
    mutationFn: (survey: Survey) => surveyRepository.updateSurvey(survey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
    },
  });

  const { mutateAsync: deleteSurvey, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => surveyRepository.deleteSurvey(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
    },
  });

  return {
    surveys,
    isLoadingSurveys,
    createSurvey,
    isCreating,
    updateSurvey,
    isUpdating,
    deleteSurvey,
    isDeleting,
  };
}
