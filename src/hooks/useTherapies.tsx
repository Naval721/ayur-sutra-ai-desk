import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { db, Therapy } from '@/lib/supabase'
import { useAuth } from './useAuth'
import { toast } from 'sonner'
import { TherapyInput, TherapyUpdateInput } from '@/lib/validations'

export const useTherapies = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const {
    data: therapies = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['therapies', user?.id],
    queryFn: () => db.therapies.getAll(user!.id),
    enabled: !!user,
  })

  const createTherapyMutation = useMutation({
    mutationFn: (data: TherapyInput) => db.therapies.create({
      ...data,
      practitioner_id: user!.id,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['therapies', user?.id] })
      toast.success('Therapy scheduled successfully!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to schedule therapy')
    },
  })

  const updateTherapyMutation = useMutation({
    mutationFn: ({ id, ...data }: TherapyUpdateInput) => db.therapies.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['therapies', user?.id] })
      toast.success('Therapy updated successfully!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update therapy')
    },
  })

  const deleteTherapyMutation = useMutation({
    mutationFn: (id: string) => db.therapies.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['therapies', user?.id] })
      toast.success('Therapy cancelled successfully!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to cancel therapy')
    },
  })

  return {
    therapies,
    isLoading,
    error,
    refetch,
    createTherapy: createTherapyMutation.mutate,
    updateTherapy: updateTherapyMutation.mutate,
    deleteTherapy: deleteTherapyMutation.mutate,
    isCreating: createTherapyMutation.isPending,
    isUpdating: updateTherapyMutation.isPending,
    isDeleting: deleteTherapyMutation.isPending,
  }
}

export const useTherapy = (id: string) => {
  const { user } = useAuth()

  const {
    data: therapy,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['therapy', id],
    queryFn: () => db.therapies.getById(id),
    enabled: !!id && !!user,
  })

  return {
    therapy,
    isLoading,
    error,
    refetch,
  }
}

export const useTherapiesByDate = (date: string) => {
  const { user } = useAuth()

  const {
    data: therapies = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['therapies', user?.id, date],
    queryFn: () => db.therapies.getByDate(date, user!.id),
    enabled: !!date && !!user,
  })

  return {
    therapies,
    isLoading,
    error,
    refetch,
  }
}