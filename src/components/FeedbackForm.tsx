import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { feedbackSchema, FeedbackInput, Feedback } from "@/lib/validations"
import { useFeedback } from "@/hooks/useFeedback"
import { useTherapies } from "@/hooks/useTherapies"
import { Loader2, Star } from "lucide-react"

interface FeedbackFormProps {
  therapyId?: string
  patientId?: string
  onSuccess?: () => void
  onCancel?: () => void
}

export const FeedbackForm = ({ therapyId, patientId, onSuccess, onCancel }: FeedbackFormProps) => {
  const { createFeedback, isCreating } = useFeedback()
  const { therapies } = useTherapies()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rating, setRating] = useState(0)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<FeedbackInput>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      therapyId: therapyId || '',
      patientId: patientId || '',
      rating: 5,
      comment: '',
      wasFlagged: false,
      followUpRequired: false,
    }
  })

  const selectedTherapyId = watch('therapyId')
  const selectedTherapy = therapies.find(t => t.id === selectedTherapyId)

  const onSubmit = async (data: FeedbackInput) => {
    try {
      setIsSubmitting(true)
      await createFeedback(data)
      onSuccess?.()
    } catch (error) {
      // Error is handled in the hook
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRatingChange = (newRating: number) => {
    setRating(newRating)
    setValue('rating', newRating)
  }

  const isLoading = isCreating || isSubmitting

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-display text-ayur-green">
          Patient Feedback
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="therapyId">Therapy Session *</Label>
            <Select onValueChange={(value) => setValue('therapyId', value)} defaultValue={therapyId}>
              <SelectTrigger className={errors.therapyId ? 'border-destructive' : ''}>
                <SelectValue placeholder="Select a therapy session" />
              </SelectTrigger>
              <SelectContent>
                {therapies
                  .filter(therapy => therapy.status === 'completed')
                  .map((therapy) => (
                    <SelectItem key={therapy.id} value={therapy.id}>
                      {therapy.name} - {therapy.patients?.name} ({new Date(therapy.scheduled_date).toLocaleDateString()})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {errors.therapyId && (
              <p className="text-sm text-destructive">{errors.therapyId.message}</p>
            )}
          </div>

          {selectedTherapy && (
            <div className="p-4 bg-gradient-warm/10 border border-ayur-sand/30 rounded-xl">
              <h4 className="font-semibold text-foreground mb-2">Session Details</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p><strong>Patient:</strong> {selectedTherapy.patients?.name}</p>
                <p><strong>Date:</strong> {new Date(selectedTherapy.scheduled_date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {selectedTherapy.scheduled_time}</p>
                <p><strong>Duration:</strong> {selectedTherapy.duration_minutes} minutes</p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Overall Rating *</Label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    } hover:text-yellow-400 transition-colors`}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Very Good'}
              {rating === 5 && 'Excellent'}
            </p>
            {errors.rating && (
              <p className="text-sm text-destructive">{errors.rating.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Comments *</Label>
            <Textarea
              id="comment"
              placeholder="Please share your experience with this therapy session..."
              {...register('comment')}
              className={errors.comment ? 'border-destructive' : ''}
              rows={5}
            />
            {errors.comment && (
              <p className="text-sm text-destructive">{errors.comment.message}</p>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="wasFlagged"
                onCheckedChange={(checked) => setValue('wasFlagged', checked as boolean)}
              />
              <Label htmlFor="wasFlagged" className="text-sm">
                This feedback requires immediate attention
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="followUpRequired"
                onCheckedChange={(checked) => setValue('followUpRequired', checked as boolean)}
              />
              <Label htmlFor="followUpRequired" className="text-sm">
                Follow-up session recommended
              </Label>
            </div>
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
                  Submitting...
                </>
              ) : (
                'Submit Feedback'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}