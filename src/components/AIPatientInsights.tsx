import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Badge } from './ui/badge'
import { AlertCircle, Brain, Loader2, TrendingUp, AlertTriangle, CheckCircle, Lightbulb } from 'lucide-react'
import { usePatientInsights } from '../hooks/useAI'
import { Alert, AlertDescription } from './ui/alert'
import { Separator } from './ui/separator'

interface AIPatientInsightsProps {
  patientData?: {
    name: string
    age?: number
    dosha: string
    symptoms: string[]
    medicalHistory?: string
    therapies: string[]
    feedback?: string
  }
  onInsightsComplete?: (insights: any) => void
  className?: string
}

export function AIPatientInsights({ patientData, onInsightsComplete, className }: AIPatientInsightsProps) {
  const [formData, setFormData] = useState({
    name: patientData?.name || '',
    age: patientData?.age?.toString() || '',
    dosha: patientData?.dosha || '',
    symptoms: patientData?.symptoms || [],
    medicalHistory: patientData?.medicalHistory || '',
    therapies: patientData?.therapies || [],
    feedback: patientData?.feedback || ''
  })
  const [currentSymptom, setCurrentSymptom] = useState('')
  const [currentTherapy, setCurrentTherapy] = useState('')

  const { insights, generateInsights, clearInsights, isLoading, error } = usePatientInsights()

  const addSymptom = () => {
    if (currentSymptom.trim() && !formData.symptoms.includes(currentSymptom.trim())) {
      setFormData({
        ...formData,
        symptoms: [...formData.symptoms, currentSymptom.trim()]
      })
      setCurrentSymptom('')
    }
  }

  const removeSymptom = (symptom: string) => {
    setFormData({
      ...formData,
      symptoms: formData.symptoms.filter(s => s !== symptom)
    })
  }

  const addTherapy = () => {
    if (currentTherapy.trim() && !formData.therapies.includes(currentTherapy.trim())) {
      setFormData({
        ...formData,
        therapies: [...formData.therapies, currentTherapy.trim()]
      })
      setCurrentTherapy('')
    }
  }

  const removeTherapy = (therapy: string) => {
    setFormData({
      ...formData,
      therapies: formData.therapies.filter(t => t !== therapy)
    })
  }

  const handleGenerateInsights = async () => {
    if (!formData.name || !formData.dosha) return

    const result = await generateInsights({
      name: formData.name,
      age: formData.age ? parseInt(formData.age) : undefined,
      dosha: formData.dosha,
      symptoms: formData.symptoms,
      medicalHistory: formData.medicalHistory || undefined,
      therapies: formData.therapies,
      feedback: formData.feedback || undefined
    })

    if (result && onInsightsComplete) {
      onInsightsComplete(result)
    }
  }

  const doshaTypes = ['Vata', 'Pitta', 'Kapha']

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Patient Insights
          </CardTitle>
          <CardDescription>
            Get comprehensive AI-powered insights and recommendations for your patient
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Patient Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter patient name"
              />
            </div>
            <div>
              <Label htmlFor="age">Age (optional)</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                placeholder="Enter age"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="dosha">Primary Dosha *</Label>
            <Select value={formData.dosha} onValueChange={(value) => setFormData({ ...formData, dosha: value })}>
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

          {/* Symptoms */}
          <div>
            <Label htmlFor="symptoms">Current Symptoms</Label>
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
            
            {formData.symptoms.length > 0 && (
              <div className="mt-3">
                <div className="flex flex-wrap gap-2">
                  {formData.symptoms.map((symptom, index) => (
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

          {/* Previous Therapies */}
          <div>
            <Label htmlFor="therapies">Previous Therapies</Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="therapies"
                value={currentTherapy}
                onChange={(e) => setCurrentTherapy(e.target.value)}
                placeholder="Enter a therapy"
                onKeyPress={(e) => e.key === 'Enter' && addTherapy()}
              />
              <Button onClick={addTherapy} disabled={!currentTherapy.trim()}>
                Add
              </Button>
            </div>
            
            {formData.therapies.length > 0 && (
              <div className="mt-3">
                <div className="flex flex-wrap gap-2">
                  {formData.therapies.map((therapy, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => removeTherapy(therapy)}
                    >
                      {therapy} ×
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Medical History */}
          <div>
            <Label htmlFor="medicalHistory">Medical History</Label>
            <Textarea
              id="medicalHistory"
              value={formData.medicalHistory}
              onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
              placeholder="Enter relevant medical history"
              rows={3}
            />
          </div>

          {/* Recent Feedback */}
          <div>
            <Label htmlFor="feedback">Recent Patient Feedback</Label>
            <Textarea
              id="feedback"
              value={formData.feedback}
              onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
              placeholder="Enter any recent feedback from the patient"
              rows={3}
            />
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
            onClick={handleGenerateInsights}
            disabled={!formData.name || !formData.dosha || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Insights...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                Generate Patient Insights
              </>
            )}
          </Button>

          {/* Insights Results */}
          {insights && (
            <div className="space-y-6 p-4 border rounded-lg bg-muted/50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">AI Patient Insights</h3>
                <Button variant="outline" size="sm" onClick={clearInsights}>
                  Clear
                </Button>
              </div>

              {/* Summary */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-primary" />
                  <span className="font-medium">Patient Summary</span>
                </div>
                <p className="text-sm text-muted-foreground pl-6">{insights.summary}</p>
              </div>

              <Separator />

              {/* Key Findings */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Key Findings</span>
                </div>
                <div className="pl-6">
                  <ul className="space-y-2">
                    {insights.keyFindings.map((finding, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        {finding}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommendations */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Recommendations</span>
                </div>
                <div className="pl-6">
                  <ul className="space-y-2">
                    {insights.recommendations.map((recommendation, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-green-600 mt-1">✓</span>
                        {recommendation}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Risk Factors */}
              {insights.riskFactors.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <span className="font-medium">Risk Factors</span>
                  </div>
                  <div className="pl-6">
                    <ul className="space-y-2">
                      {insights.riskFactors.map((risk, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-amber-600 mt-1">⚠</span>
                          {risk}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Positive Aspects */}
              {insights.positiveAspects.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Positive Aspects</span>
                  </div>
                  <div className="pl-6">
                    <ul className="space-y-2">
                      {insights.positiveAspects.map((aspect, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-green-600 mt-1">+</span>
                          {aspect}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}