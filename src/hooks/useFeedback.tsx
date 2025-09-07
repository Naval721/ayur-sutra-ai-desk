import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { db } from '@/lib/supabase'
import { useAuth } from './useAuth'
import { toast } from 'sonner'
import { FeedbackInput, FeedbackUpdateInput } from '@/lib/validations'

export const useFeedback = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const {
    data: feedback = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['feedback', user?.id],
    queryFn: () => db.feedback.getAll(user!.id),
    enabled: !!user,
  })

  const createFeedbackMutation = useMutation({
    mutationFn: (data: FeedbackInput) => db.feedback.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback', user?.id] })
      queryClient.invalidateQueries({ queryKey: ['therapies', user?.id] })
      toast.success('Feedback submitted successfully!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to submit feedback')
    },
  })

  const updateFeedbackMutation = useMutation({
    mutationFn: ({ id, ...data }: FeedbackUpdateInput) => db.feedback.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback', user?.id] })
      toast.success('Feedback updated successfully!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update feedback')
    },
  })

  return {
    feedback,
    isLoading,
    error,
    refetch,
    createFeedback: createFeedbackMutation.mutate,
    updateFeedback: updateFeedbackMutation.mutate,
    isCreating: createFeedbackMutation.isPending,
    isUpdating: updateFeedbackMutation.isPending,
  }
}