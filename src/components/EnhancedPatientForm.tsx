import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Badge } from './ui/badge'
import { Alert, AlertDescription } from './ui/alert'
import { Separator } from './ui/separator'
import { Loader2, Brain, AlertCircle, CheckCircle } from 'lucide-react'
import { patientSchema, PatientInput, Patient } from '../lib/validations'
import { usePatients } from '../hooks/usePatients'
import { useDoshaAnalysis, useAIFeatures } from '../hooks/useAI'
import { AIDoshaAnalysis } from './AIDoshaAnalysis'
import { AITreatmentRecommendation } from './AITreatmentRecommendation'
import { AIPatientInsights } from './AIPatientInsights'

interface EnhancedPatientFormProps {
  patient?: Patient
  onSuccess?: () => void
  onCancel?: () => void
}

export function EnhancedPatientForm({ patient, onSuccess, onCancel }: EnhancedPatientFormProps) {
  const { createPatient, updatePatient, isCreating, isUpdating } = usePatients()
  const { isAvailable: aiAvailable } = useAIFeatures()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [aiAnalysis, setAiAnalysis] = useState<any>(null)
  const [showAI, setShowAI] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<PatientInput>({
    resolver: zodResolver(patientSchema),
    defaultValues: patient ? {
      name: patient.name,
      email: patient.email,
      phone: patient.phone || '',
      primaryDosha: patient.primary_dosha,
      secondaryDosha: patient.secondary_dosha || undefined,
      age: patient.age || undefined,
      gender: patient.gender || undefined,
      address: patient.address || '',
      medicalHistory: patient.medical_history || '',
      allergies: patient.allergies || '',
      status: patient.status,
    } : {
      status: 'active'
    }
  })

  const primaryDosha = watch('primaryDosha')
  const secondaryDosha = watch('secondaryDosha')
  const medicalHistory = watch('medicalHistory')
  const allergies = watch('allergies')

  const onSubmit = async (data: PatientInput) => {
    setIsSubmitting(true)
    try {
      if (patient) {
        await updatePatient(patient.id, data)
      } else {
        await createPatient(data)
      }
      onSuccess?.()
    } catch (error) {
      console.error('Error saving patient:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAIAnalysisComplete = (analysis: any) => {
    setAiAnalysis(analysis)
    // Auto-populate form with AI suggestions
    if (analysis.primaryDosha) {
      setValue('primaryDosha', analysis.primaryDosha)
    }
    if (analysis.secondaryDosha) {
      setValue('secondaryDosha', analysis.secondaryDosha)
    }
  }

  const doshaTypes = ['Vata', 'Pitta', 'Kapha']
  const genderTypes = ['Male', 'Female', 'Other']
  const statusTypes = ['active', 'inactive']

  return (
    <div className="space-y-6">
      {/* AI Status Alert */}
      {!aiAvailable && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            AI features are not available. Please configure your Gemini API key to access AI-powered dosha analysis and treatment recommendations.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Information</TabsTrigger>
          <TabsTrigger value="ai" disabled={!aiAvailable}>
            <Brain className="w-4 h-4 mr-2" />
            AI Analysis
          </TabsTrigger>
          <TabsTrigger value="insights" disabled={!aiAvailable}>
            <Brain className="w-4 h-4 mr-2" />
            AI Insights
          </TabsTrigger>
        </TabsList>

        {/* Basic Information Tab */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {patient ? 'Edit Patient' : 'Add New Patient'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      {...register('name')}
                      placeholder="Enter patient name"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      placeholder="Enter email address"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      {...register('phone')}
                      placeholder="Enter phone number"
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      {...register('age', { valueAsNumber: true })}
                      placeholder="Enter age"
                    />
                    {errors.age && (
                      <p className="text-sm text-red-600 mt-1">{errors.age.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={watch('gender')} onValueChange={(value) => setValue('gender', value as any)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        {genderTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.gender && (
                      <p className="text-sm text-red-600 mt-1">{errors.gender.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={watch('status')} onValueChange={(value) => setValue('status', value as any)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.status && (
                      <p className="text-sm text-red-600 mt-1">{errors.status.message}</p>
                    )}
                  </div>
                </div>

                {/* Dosha Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Dosha Classification</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="primaryDosha">Primary Dosha *</Label>
                      <Select value={primaryDosha} onValueChange={(value) => setValue('primaryDosha', value as any)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select primary dosha" />
                        </SelectTrigger>
                        <SelectContent>
                          {doshaTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.primaryDosha && (
                        <p className="text-sm text-red-600 mt-1">{errors.primaryDosha.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="secondaryDosha">Secondary Dosha</Label>
                      <Select value={secondaryDosha} onValueChange={(value) => setValue('secondaryDosha', value as any)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select secondary dosha" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          {doshaTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.secondaryDosha && (
                        <p className="text-sm text-red-600 mt-1">{errors.secondaryDosha.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Medical Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Medical Information</h3>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      {...register('address')}
                      placeholder="Enter patient address"
                      rows={3}
                    />
                    {errors.address && (
                      <p className="text-sm text-red-600 mt-1">{errors.address.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="medicalHistory">Medical History</Label>
                    <Textarea
                      id="medicalHistory"
                      {...register('medicalHistory')}
                      placeholder="Enter medical history"
                      rows={4}
                    />
                    {errors.medicalHistory && (
                      <p className="text-sm text-red-600 mt-1">{errors.medicalHistory.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="allergies">Allergies</Label>
                    <Textarea
                      id="allergies"
                      {...register('allergies')}
                      placeholder="Enter known allergies"
                      rows={3}
                    />
                    {errors.allergies && (
                      <p className="text-sm text-red-600 mt-1">{errors.allergies.message}</p>
                    )}
                  </div>
                </div>

                {/* AI Analysis Results */}
                {aiAnalysis && (
                  <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium">AI Analysis Applied</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Primary Dosha:</span>
                        <Badge variant="outline">{aiAnalysis.primaryDosha}</Badge>
                        <span className="text-sm text-muted-foreground">
                          (Confidence: {aiAnalysis.confidence}%)
                        </span>
                      </div>
                      {aiAnalysis.secondaryDosha && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Secondary Dosha:</span>
                          <Badge variant="outline">{aiAnalysis.secondaryDosha}</Badge>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Form Actions */}
                <div className="flex justify-end space-x-2">
                  {onCancel && (
                    <Button type="button" variant="outline" onClick={onCancel}>
                      Cancel
                    </Button>
                  )}
                  <Button
                    type="submit"
                    disabled={isSubmitting || isCreating || isUpdating}
                  >
                    {(isSubmitting || isCreating || isUpdating) && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {patient ? 'Update Patient' : 'Create Patient'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Analysis Tab */}
        <TabsContent value="ai" className="space-y-6">
          <AIDoshaAnalysis onAnalysisComplete={handleAIAnalysisComplete} />
          {primaryDosha && (
            <AITreatmentRecommendation
              patientData={{
                name: watch('name') || '',
                age: watch('age'),
                dosha: primaryDosha,
                symptoms: [], // Could be extracted from medical history
                medicalHistory: medicalHistory || undefined
              }}
            />
          )}
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <AIPatientInsights
            patientData={{
              name: watch('name') || '',
              age: watch('age'),
              dosha: primaryDosha || '',
              symptoms: [], // Could be extracted from medical history
              medicalHistory: medicalHistory || undefined,
              therapies: [], // Could be populated from existing therapies
              feedback: '' // Could be populated from existing feedback
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}