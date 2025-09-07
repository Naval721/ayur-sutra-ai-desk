import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { patientSchema, PatientInput, Patient } from "@/lib/validations"
import { usePatients } from "@/hooks/usePatients"
import { Loader2 } from "lucide-react"

interface PatientFormProps {
  patient?: Patient
  onSuccess?: () => void
  onCancel?: () => void
}

export const PatientForm = ({ patient, onSuccess, onCancel }: PatientFormProps) => {
  const { createPatient, updatePatient, isCreating, isUpdating } = usePatients()
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const onSubmit = async (data: PatientInput) => {
    try {
      setIsSubmitting(true)
      
      if (patient) {
        await updatePatient({ id: patient.id, ...data })
      } else {
        await createPatient(data)
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
          {patient ? 'Edit Patient' : 'Add New Patient'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="Enter patient's full name"
                {...register('name')}
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter patient's email"
                {...register('email')}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="Enter patient's phone number"
                {...register('phone')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="Enter patient's age"
                {...register('age', { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select onValueChange={(value) => setValue('gender', value as any)} defaultValue={patient?.gender}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="primaryDosha">Primary Dosha *</Label>
              <Select onValueChange={(value) => setValue('primaryDosha', value as any)} defaultValue={patient?.primary_dosha}>
                <SelectTrigger className={errors.primaryDosha ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Select primary dosha" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Vata">Vata</SelectItem>
                  <SelectItem value="Pitta">Pitta</SelectItem>
                  <SelectItem value="Kapha">Kapha</SelectItem>
                </SelectContent>
              </Select>
              {errors.primaryDosha && (
                <p className="text-sm text-destructive">{errors.primaryDosha.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondaryDosha">Secondary Dosha</Label>
              <Select onValueChange={(value) => setValue('secondaryDosha', value as any)} defaultValue={patient?.secondary_dosha}>
                <SelectTrigger>
                  <SelectValue placeholder="Select secondary dosha" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Vata">Vata</SelectItem>
                  <SelectItem value="Pitta">Pitta</SelectItem>
                  <SelectItem value="Kapha">Kapha</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select onValueChange={(value) => setValue('status', value as any)} defaultValue={patient?.status || 'active'}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              placeholder="Enter patient's address"
              {...register('address')}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="medicalHistory">Medical History</Label>
            <Textarea
              id="medicalHistory"
              placeholder="Enter patient's medical history"
              {...register('medicalHistory')}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="allergies">Allergies</Label>
            <Textarea
              id="allergies"
              placeholder="Enter any known allergies"
              {...register('allergies')}
              rows={3}
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
                  {patient ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                patient ? 'Update Patient' : 'Create Patient'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}