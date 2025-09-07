import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { therapySchema, TherapyInput, Therapy } from "@/lib/validations"
import { useTherapies } from "@/hooks/useTherapies"
import { usePatients } from "@/hooks/usePatients"
import { Loader2, Sparkles } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface TherapyFormProps {
  therapy?: Therapy & { patients: any }
  onSuccess?: () => void
  onCancel?: () => void
}

export const TherapyForm = ({ therapy, onSuccess, onCancel }: TherapyFormProps) => {
  const { createTherapy, updateTherapy, isCreating, isUpdating } = useTherapies()
  const { patients } = usePatients()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [generatedPrecautions, setGeneratedPrecautions] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<TherapyInput>({
    resolver: zodResolver(therapySchema),
    defaultValues: therapy ? {
      patientId: therapy.patient_id,
      name: therapy.name,
      type: therapy.type,
      scheduledDate: therapy.scheduled_date,
      scheduledTime: therapy.scheduled_time,
      durationMinutes: therapy.duration_minutes,
      precautions: therapy.precautions || [],
      notes: therapy.notes || '',
      status: therapy.status,
    } : {
      durationMinutes: 60,
      status: 'scheduled'
    }
  })

  const selectedPatientId = watch('patientId')
  const selectedType = watch('type')
  const selectedPatient = patients.find(p => p.id === selectedPatientId)

  const generatePrecautions = async () => {
    if (!selectedType || !selectedPatient) return

    try {
      const { data, error } = await supabase.rpc('generate_therapy_precautions', {
        therapy_type: selectedType,
        patient_dosha: selectedPatient.primary_dosha
      })

      if (error) throw error
      
      setGeneratedPrecautions(data || [])
      setValue('precautions', data || [])
    } catch (error) {
      console.error('Error generating precautions:', error)
      // Fallback precautions
      const fallbackPrecautions = [
        'Avoid heavy meals 2 hours before therapy',
        'Inform practitioner of any allergies',
        'Wear comfortable, loose clothing',
        'Follow prescribed diet recommendations',
        'Rest adequately after therapy'
      ]
      setGeneratedPrecautions(fallbackPrecautions)
      setValue('precautions', fallbackPrecautions)
    }
  }

  useEffect(() => {
    if (selectedType && selectedPatient && !therapy) {
      generatePrecautions()
    }
  }, [selectedType, selectedPatient])

  const onSubmit = async (data: TherapyInput) => {
    try {
      setIsSubmitting(true)
      
      if (therapy) {
        await updateTherapy({ id: therapy.id, ...data })
      } else {
        await createTherapy(data)
      }
      
      onSuccess?.()
    } catch (error) {
      // Error is handled in the hook
    } finally {
      setIsSubmitting(false)
    }
  }

  const isLoading = isCreating || isUpdating || isSubmitting

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-display text-ayur-green">
          {therapy ? 'Edit Therapy Session' : 'Schedule New Therapy'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patientId">Patient *</Label>
              <Select onValueChange={(value) => setValue('patientId', value)} defaultValue={therapy?.patient_id}>
                <SelectTrigger className={errors.patientId ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select a patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name} ({patient.primary_dosha})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.patientId && (
                <p className="text-sm text-destructive">{errors.patientId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Therapy Type *</Label>
              <Select onValueChange={(value) => setValue('type', value as any)} defaultValue={therapy?.type}>
                <SelectTrigger className={errors.type ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select therapy type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Panchakarma">Panchakarma</SelectItem>
                  <SelectItem value="Abhyanga">Abhyanga</SelectItem>
                  <SelectItem value="Shirodhara">Shirodhara</SelectItem>
                  <SelectItem value="Nasya">Nasya</SelectItem>
                  <SelectItem value="Basti">Basti</SelectItem>
                  <SelectItem value="Virechana">Virechana</SelectItem>
                  <SelectItem value="Raktamokshana">Raktamokshana</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-destructive">{errors.type.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Therapy Name *</Label>
              <Input
                id="name"
                placeholder="Enter therapy name"
                {...register('name')}
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduledDate">Date *</Label>
              <Input
                id="scheduledDate"
                type="date"
                {...register('scheduledDate')}
                className={errors.scheduledDate ? 'border-destructive' : ''}
              />
              {errors.scheduledDate && (
                <p className="text-sm text-destructive">{errors.scheduledDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduledTime">Time *</Label>
              <Input
                id="scheduledTime"
                type="time"
                {...register('scheduledTime')}
                className={errors.scheduledTime ? 'border-destructive' : ''}
              />
              {errors.scheduledTime && (
                <p className="text-sm text-destructive">{errors.scheduledTime.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="durationMinutes">Duration (minutes)</Label>
              <Input
                id="durationMinutes"
                type="number"
                min="15"
                max="480"
                {...register('durationMinutes', { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select onValueChange={(value) => setValue('status', value as any)} defaultValue={therapy?.status || 'scheduled'}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedPatient && selectedType && (
            <div className="space-y-4 p-4 bg-gradient-warm/10 border border-ayur-sand/30 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-ayur-earth font-semibold">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-sm">Generated Precautions</span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={generatePrecautions}
                  className="text-xs"
                >
                  Regenerate
                </Button>
              </div>
              <div className="space-y-2">
                {generatedPrecautions.map((precaution, index) => (
                  <Badge key={index} variant="secondary" className="mr-2 mb-2">
                    {precaution}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Personalized precautions based on {selectedPatient.name}'s {selectedPatient.primary_dosha} dosha and {selectedType} therapy.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Enter any additional notes"
              {...register('notes')}
              rows={4}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isLoading} className="bg-ayur-green hover:bg-ayur-green/90">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {therapy ? 'Updating...' : 'Scheduling...'}
                </>
              ) : (
                therapy ? 'Update Therapy' : 'Schedule Therapy'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}