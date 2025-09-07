import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Badge } from './ui/badge'
import { AlertCircle, Brain, Loader2, Clock, Shield, Heart, Utensils, Activity } from 'lucide-react'
import { useTreatmentRecommendation } from '../hooks/useAI'
import { Alert, AlertDescription } from './ui/alert'
import { Separator } from './ui/separator'

interface AITreatmentRecommendationProps {
  onRecommendationComplete?: (recommendation: any) => void
  className?: string
}

export function AITreatmentRecommendation({ onRecommendationComplete, className }: AITreatmentRecommendationProps) {
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [currentSymptom, setCurrentSymptom] = useState('')
  const [dosha, setDosha] = useState('')
  const [therapyType, setTherapyType] = useState('')

  const { recommendation, generateRecommendation, clearRecommendation, isLoading, error } = useTreatmentRecommendation()

  const addSymptom = () => {
    if (currentSymptom.trim() && !symptoms.includes(currentSymptom.trim())) {
      setSymptoms([...symptoms, currentSymptom.trim()])
      setCurrentSymptom('')
    }
  }

  const removeSymptom = (symptom: string) => {
    setSymptoms(symptoms.filter(s => s !== symptom))
  }

  const handleGenerateRecommendation = async () => {
    if (symptoms.length === 0 || !dosha) return

    const result = await generateRecommendation(dosha, symptoms, therapyType || undefined)

    if (result && onRecommendationComplete) {
      onRecommendationComplete(result)
    }
  }

  const therapyTypes = [
    'Panchakarma',
    'Abhyanga',
    'Shirodhara',
    'Nasya',
    'Basti',
    'Virechana',
    'Raktamokshana',
    'Other'
  ]

  const doshaTypes = ['Vata', 'Pitta', 'Kapha']

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Treatment Recommendations
          </CardTitle>
          <CardDescription>
            Get personalized treatment recommendations based on dosha and symptoms
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Dosha Selection */}
          <div>
            <Label htmlFor="dosha">Primary Dosha *</Label>
            <Select value={dosha} onValueChange={setDosha}>
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
          </div>

          {/* Therapy Type Selection */}
          <div>
            <Label htmlFor="therapyType">Preferred Therapy Type (optional)</Label>
            <Select value={therapyType} onValueChange={setTherapyType}>
              <SelectTrigger>
                <SelectValue placeholder="Select therapy type" />
              </SelectTrigger>
              <SelectContent>
                {therapyTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Symptoms Input */}
          <div>
            <Label htmlFor="symptoms">Symptoms *</Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="symptoms"
                value={currentSymptom}
                onChange={(e) => setCurrentSymptom(e.target.value)}
                placeholder="Enter a symptom"
                onKeyPress={(e) => e.key === 'Enter' && addSymptom()}
              />
              <Button onClick={addSymptom} disabled={!currentSymptom.trim()}>
                Add
              </Button>
            </div>
            
            {/* Symptoms List */}
            {symptoms.length > 0 && (
              <div className="mt-3">
                <div className="flex flex-wrap gap-2">
                  {symptoms.map((symptom, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => removeSymptom(symptom)}
                    >
                      {symptom} ×
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Generate Button */}
          <Button
            onClick={handleGenerateRecommendation}
            disabled={symptoms.length === 0 || !dosha || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Recommendations...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                Generate Treatment Plan
              </>
            )}
          </Button>

          {/* Recommendation Results */}
          {recommendation && (
            <div className="space-y-6 p-4 border rounded-lg bg-muted/50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Treatment Recommendations</h3>
                <Button variant="outline" size="sm" onClick={clearRecommendation}>
                  Clear
                </Button>
              </div>

              {/* Therapy Overview */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-primary" />
                  <span className="font-medium">Recommended Therapy</span>
                </div>
                <div className="pl-6">
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    {recommendation.therapyType}
                  </Badge>
                </div>
              </div>

              {/* Duration and Frequency */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="font-medium">Duration</span>
                  </div>
                  <p className="text-sm text-muted-foreground pl-6">{recommendation.duration}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" />
                    <span className="font-medium">Frequency</span>
                  </div>
                  <p className="text-sm text-muted-foreground pl-6">{recommendation.frequency}</p>
                </div>
              </div>

              <Separator />

              {/* Benefits */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Expected Benefits</span>
                </div>
                <div className="pl-6">
                  <ul className="space-y-1">
                    {recommendation.benefits.map((benefit, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-green-600 mt-1">•</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Precautions */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-amber-600" />
                  <span className="font-medium">Important Precautions</span>
                </div>
                <div className="pl-6">
                  <ul className="space-y-1">
                    {recommendation.precautions.map((precaution, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-amber-600 mt-1">⚠</span>
                        {precaution}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Contraindications */}
              {recommendation.contraindications.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <span className="font-medium">Contraindications</span>
                  </div>
                  <div className="pl-6">
                    <ul className="space-y-1">
                      {recommendation.contraindications.map((contraindication, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-red-600 mt-1">✗</span>
                          {contraindication}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Dietary Recommendations */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Utensils className="h-4 w-4 text-primary" />
                  <span className="font-medium">Dietary Recommendations</span>
                </div>
                <div className="pl-6">
                  <ul className="space-y-1">
                    {recommendation.dietaryRecommendations.map((diet, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        {diet}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Lifestyle Advice */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  <span className="font-medium">Lifestyle Advice</span>
                </div>
                <div className="pl-6">
                  <ul className="space-y-1">
                    {recommendation.lifestyleAdvice.map((advice, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        {advice}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}