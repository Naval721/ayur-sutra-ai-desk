import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { db, Patient } from '@/lib/supabase'
import { useAuth } from './useAuth'
import { toast } from 'sonner'
import { PatientInput, PatientUpdateInput } from '@/lib/validations'

export const usePatients = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const {
    data: patients = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['patients', user?.id],
    queryFn: () => db.patients.getAll(user!.id),
    enabled: !!user,
  })

  const createPatientMutation = useMutation({
    mutationFn: (data: PatientInput) => db.patients.create({
      ...data,
      practitioner_id: user!.id,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients', user?.id] })
      toast.success('Patient created successfully!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create patient')
    },
  })

  const updatePatientMutation = useMutation({
    mutationFn: ({ id, ...data }: PatientUpdateInput) => db.patients.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients', user?.id] })
      toast.success('Patient updated successfully!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update patient')
    },
  })

  const deletePatientMutation = useMutation({
    mutationFn: (id: string) => db.patients.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients', user?.id] })
      toast.success('Patient deleted successfully!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete patient')
    },
  })

  return {
    patients,
    isLoading,
    error,
    refetch,
    createPatient: createPatientMutation.mutate,
    updatePatient: updatePatientMutation.mutate,
    deletePatient: deletePatientMutation.mutate,
    isCreating: createPatientMutation.isPending,
    isUpdating: updatePatientMutation.isPending,
    isDeleting: deletePatientMutation.isPending,
  }
}

export const usePatient = (id: string) => {
  const { user } = useAuth()

  const {
    data: patient,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['patient', id],
    queryFn: () => db.patients.getById(id),
    enabled: !!id && !!user,
  })

  return {
    patient,
    isLoading,
    error,
    refetch,
  }
}