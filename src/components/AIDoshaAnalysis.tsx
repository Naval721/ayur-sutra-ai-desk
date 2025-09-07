import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { AlertCircle, Brain, CheckCircle, Loader2 } from 'lucide-react'
import { useDoshaAnalysis } from '../hooks/useAI'
import { Alert, AlertDescription } from './ui/alert'

interface AIDoshaAnalysisProps {
  onAnalysisComplete?: (analysis: any) => void
  className?: string
}

export function AIDoshaAnalysis({ onAnalysisComplete, className }: AIDoshaAnalysisProps) {
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [currentSymptom, setCurrentSymptom] = useState('')
  const [patientInfo, setPatientInfo] = useState({
    age: '',
    gender: '',
    medicalHistory: '',
    lifestyle: ''
  })

  const { analysis, analyzeDosha, clearAnalysis, isLoading, error } = useDoshaAnalysis()

  const addSymptom = () => {
    if (currentSymptom.trim() && !symptoms.includes(currentSymptom.trim())) {
      setSymptoms([...symptoms, currentSymptom.trim()])
      setCurrentSymptom('')
    }
  }

  const removeSymptom = (symptom: string) => {
    setSymptoms(symptoms.filter(s => s !== symptom))
  }

  const handleAnalyze = async () => {
    if (symptoms.length === 0) return

    const result = await analyzeDosha(symptoms, {
      age: patientInfo.age ? parseInt(patientInfo.age) : undefined,
      gender: patientInfo.gender || undefined,
      medicalHistory: patientInfo.medicalHistory || undefined,
      lifestyle: patientInfo.lifestyle || undefined
    })

    if (result && onAnalysisComplete) {
      onAnalysisComplete(result)
    }
  }

  const getDoshaColor = (dosha: string) => {
    switch (dosha) {
      case 'Vata': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Pitta': return 'bg-red-100 text-red-800 border-red-200'
      case 'Kapha': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600'
    if (confidence >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI-Powered Dosha Analysis
          </CardTitle>
          <CardDescription>
            Get AI-powered insights into your patient's dosha constitution based on symptoms and characteristics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Patient Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="age">Age (optional)</Label>
              <Input
                id="age"
                type="number"
                value={patientInfo.age}
                onChange={(e) => setPatientInfo({ ...patientInfo, age: e.target.value })}
                placeholder="Enter age"
              />
            </div>
            <div>
              <Label htmlFor="gender">Gender (optional)</Label>
              <Select value={patientInfo.gender} onValueChange={(value) => setPatientInfo({ ...patientInfo, gender: value })}>
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
          </div>

          <div>
            <Label htmlFor="medicalHistory">Medical History (optional)</Label>
            <Textarea
              id="medicalHistory"
              value={patientInfo.medicalHistory}
              onChange={(e) => setPatientInfo({ ...patientInfo, medicalHistory: e.target.value })}
              placeholder="Enter relevant medical history"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="lifestyle">Lifestyle (optional)</Label>
            <Textarea
              id="lifestyle"
              value={patientInfo.lifestyle}
              onChange={(e) => setPatientInfo({ ...patientInfo, lifestyle: e.target.value })}
              placeholder="Enter lifestyle information (diet, exercise, sleep patterns, etc.)"
              rows={3}
            />
          </div>

          {/* Symptoms Input */}
          <div>
            <Label htmlFor="symptoms">Symptoms</Label>
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

          {/* Analysis Button */}
          <Button
            onClick={handleAnalyze}
            disabled={symptoms.length === 0 || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                Analyze Dosha
              </>
            )}
          </Button>

          {/* Analysis Results */}
          {analysis && (
            <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Analysis Results</h3>
                <Button variant="outline" size="sm" onClick={clearAnalysis}>
                  Clear
                </Button>
              </div>

              {/* Primary Dosha */}
              <div>
                <Label className="text-sm font-medium">Primary Dosha</Label>
                <div className="mt-1">
                  <Badge className={`${getDoshaColor(analysis.primaryDosha)} text-lg px-3 py-1`}>
                    {analysis.primaryDosha}
                  </Badge>
                  {analysis.secondaryDosha && (
                    <>
                      <span className="mx-2 text-muted-foreground">+</span>
                      <Badge variant="outline" className="text-lg px-3 py-1">
                        {analysis.secondaryDosha}
                      </Badge>
                    </>
                  )}
                </div>
              </div>

              {/* Confidence Level */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Confidence Level</Label>
                  <span className={`text-sm font-medium ${getConfidenceColor(analysis.confidence)}`}>
                    {analysis.confidence}%
                  </span>
                </div>
                <Progress value={analysis.confidence} className="h-2" />
              </div>

              {/* Reasoning */}
              <div>
                <Label className="text-sm font-medium">Reasoning</Label>
                <p className="mt-1 text-sm text-muted-foreground">{analysis.reasoning}</p>
              </div>

              {/* Characteristics */}
              <div>
                <Label className="text-sm font-medium">Observed Characteristics</Label>
                <div className="mt-1 flex flex-wrap gap-1">
                  {analysis.characteristics.map((char, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {char}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Imbalances */}
              <div>
                <Label className="text-sm font-medium">Identified Imbalances</Label>
                <div className="mt-1 flex flex-wrap gap-1">
                  {analysis.imbalances.map((imbalance, index) => (
                    <Badge key={index} variant="destructive" className="text-xs">
                      {imbalance}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}