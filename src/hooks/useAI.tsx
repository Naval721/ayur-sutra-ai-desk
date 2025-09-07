import { useState, useCallback } from 'react'
import { geminiAI, aiUtils, DoshaAnalysis, TreatmentRecommendation, SymptomAnalysis, PatientInsight } from '../lib/gemini'
import { useToast } from './use-toast'

// AI Hook for general AI operations
export function useAI() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const executeAI = useCallback(async <T>(
    operation: () => Promise<T>,
    successMessage?: string
  ): Promise<T | null> => {
    if (!aiUtils.isAvailable()) {
      const errorMsg = 'AI features are not available. Please configure your Gemini API key.'
      setError(errorMsg)
      toast({
        title: "AI Unavailable",
        description: errorMsg,
        variant: "destructive"
      })
      return null
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await operation()
      
      if (successMessage) {
        toast({
          title: "AI Analysis Complete",
          description: successMessage
        })
      }

      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'AI operation failed'
      setError(errorMessage)
      toast({
        title: "AI Error",
        description: errorMessage,
        variant: "destructive"
      })
      return null
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  return {
    isLoading,
    error,
    executeAI,
    isAvailable: aiUtils.isAvailable(),
    status: aiUtils.getStatus()
  }
}

// Hook for dosha analysis
export function useDoshaAnalysis() {
  const { isLoading, error, executeAI } = useAI()
  const [analysis, setAnalysis] = useState<DoshaAnalysis | null>(null)

  const analyzeDosha = useCallback(async (
    symptoms: string[],
    patientInfo: {
      age?: number
      gender?: string
      medicalHistory?: string
      lifestyle?: string
    }
  ) => {
    const result = await executeAI(
      () => geminiAI.analyzeDosha(symptoms, patientInfo),
      "Dosha analysis completed successfully"
    )
    
    if (result) {
      setAnalysis(result)
    }
    
    return result
  }, [executeAI])

  const clearAnalysis = useCallback(() => {
    setAnalysis(null)
  }, [])

  return {
    analysis,
    analyzeDosha,
    clearAnalysis,
    isLoading,
    error
  }
}

// Hook for treatment recommendations
export function useTreatmentRecommendation() {
  const { isLoading, error, executeAI } = useAI()
  const [recommendation, setRecommendation] = useState<TreatmentRecommendation | null>(null)

  const generateRecommendation = useCallback(async (
    dosha: string,
    symptoms: string[],
    therapyType?: string
  ) => {
    const result = await executeAI(
      () => geminiAI.generateTreatmentRecommendation(dosha, symptoms, therapyType),
      "Treatment recommendations generated"
    )
    
    if (result) {
      setRecommendation(result)
    }
    
    return result
  }, [executeAI])

  const clearRecommendation = useCallback(() => {
    setRecommendation(null)
  }, [])

  return {
    recommendation,
    generateRecommendation,
    clearRecommendation,
    isLoading,
    error
  }
}

// Hook for symptom analysis
export function useSymptomAnalysis() {
  const { isLoading, error, executeAI } = useAI()
  const [analysis, setAnalysis] = useState<SymptomAnalysis | null>(null)

  const analyzeSymptoms = useCallback(async (symptoms: string[]) => {
    const result = await executeAI(
      () => geminiAI.analyzeSymptoms(symptoms),
      "Symptom analysis completed"
    )
    
    if (result) {
      setAnalysis(result)
    }
    
    return result
  }, [executeAI])

  const clearAnalysis = useCallback(() => {
    setAnalysis(null)
  }, [])

  return {
    analysis,
    analyzeSymptoms,
    clearAnalysis,
    isLoading,
    error
  }
}

// Hook for patient insights
export function usePatientInsights() {
  const { isLoading, error, executeAI } = useAI()
  const [insights, setInsights] = useState<PatientInsight | null>(null)

  const generateInsights = useCallback(async (patientData: {
    name: string
    age?: number
    dosha: string
    symptoms: string[]
    medicalHistory?: string
    therapies: string[]
    feedback?: string
  }) => {
    const result = await executeAI(
      () => geminiAI.generatePatientInsights(patientData),
      "Patient insights generated"
    )
    
    if (result) {
      setInsights(result)
    }
    
    return result
  }, [executeAI])

  const clearInsights = useCallback(() => {
    setInsights(null)
  }, [])

  return {
    insights,
    generateInsights,
    clearInsights,
    isLoading,
    error
  }
}

// Hook for therapy precautions
export function useTherapyPrecautions() {
  const { isLoading, error, executeAI } = useAI()
  const [precautions, setPrecautions] = useState<string[]>([])

  const generatePrecautions = useCallback(async (
    therapyType: string,
    dosha: string,
    patientAge?: number,
    medicalHistory?: string
  ) => {
    const result = await executeAI(
      () => geminiAI.generateTherapyPrecautions(therapyType, dosha, patientAge, medicalHistory),
      "Therapy precautions generated"
    )
    
    if (result) {
      setPrecautions(result)
    }
    
    return result
  }, [executeAI])

  const clearPrecautions = useCallback(() => {
    setPrecautions([])
  }, [])

  return {
    precautions,
    generatePrecautions,
    clearPrecautions,
    isLoading,
    error
  }
}

// Hook for general AI advice
export function useGeneralAdvice() {
  const { isLoading, error, executeAI } = useAI()
  const [advice, setAdvice] = useState<string>('')

  const generateAdvice = useCallback(async (topic: string, context?: string) => {
    const result = await executeAI(
      () => geminiAI.generateGeneralAdvice(topic, context),
      "AI advice generated"
    )
    
    if (result) {
      setAdvice(result)
    }
    
    return result
  }, [executeAI])

  const clearAdvice = useCallback(() => {
    setAdvice('')
  }, [])

  return {
    advice,
    generateAdvice,
    clearAdvice,
    isLoading,
    error
  }
}

// Combined hook for all AI features
export function useAIFeatures() {
  const doshaAnalysis = useDoshaAnalysis()
  const treatmentRecommendation = useTreatmentRecommendation()
  const symptomAnalysis = useSymptomAnalysis()
  const patientInsights = usePatientInsights()
  const therapyPrecautions = useTherapyPrecautions()
  const generalAdvice = useGeneralAdvice()

  const { isAvailable, status } = useAI()

  const clearAll = useCallback(() => {
    doshaAnalysis.clearAnalysis()
    treatmentRecommendation.clearRecommendation()
    symptomAnalysis.clearAnalysis()
    patientInsights.clearInsights()
    therapyPrecautions.clearPrecautions()
    generalAdvice.clearAdvice()
  }, [
    doshaAnalysis,
    treatmentRecommendation,
    symptomAnalysis,
    patientInsights,
    therapyPrecautions,
    generalAdvice
  ])

  const isLoading = 
    doshaAnalysis.isLoading ||
    treatmentRecommendation.isLoading ||
    symptomAnalysis.isLoading ||
    patientInsights.isLoading ||
    therapyPrecautions.isLoading ||
    generalAdvice.isLoading

  return {
    // Individual features
    doshaAnalysis,
    treatmentRecommendation,
    symptomAnalysis,
    patientInsights,
    therapyPrecautions,
    generalAdvice,
    
    // Combined state
    isLoading,
    isAvailable,
    status,
    clearAll
  }
}