import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Alert, AlertDescription } from './ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { 
  Brain, 
  Users, 
  Calendar, 
  MessageSquare, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Lightbulb,
  Activity
} from 'lucide-react'
import { useAIFeatures } from '../hooks/useAI'
import { AIDoshaAnalysis } from './AIDoshaAnalysis'
import { AITreatmentRecommendation } from './AITreatmentRecommendation'
import { AIPatientInsights } from './AIPatientInsights'

export function AIDashboard() {
  const { isAvailable, status, isLoading } = useAIFeatures()
  const [activeTab, setActiveTab] = useState('overview')

  if (!isAvailable) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Features
            </CardTitle>
            <CardDescription>
              AI-powered features for enhanced Ayurvedic practice management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                AI features are not available. Please configure your Gemini API key in the environment variables to access AI-powered features.
              </AlertDescription>
            </Alert>
            <div className="mt-4 p-4 border rounded-lg bg-muted/50">
              <h3 className="font-medium mb-2">Setup Instructions:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                <li>Get your API key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google AI Studio</a></li>
                <li>Add <code>VITE_GEMINI_API_KEY=your-api-key</code> to your .env.local file</li>
                <li>Restart the development server</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* AI Status Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI-Powered Ayurvedic Assistant
          </CardTitle>
          <CardDescription>
            Leverage AI to enhance your Ayurvedic practice with intelligent analysis and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">AI Status: Active</span>
            </div>
            <Badge variant="outline">{status.model}</Badge>
            {isLoading && (
              <Badge variant="secondary">
                <Activity className="h-3 w-3 mr-1 animate-spin" />
                Processing
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* AI Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Dosha Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              AI-powered dosha diagnosis based on symptoms and characteristics
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Treatment Planning
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Personalized treatment recommendations and therapy planning
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Patient Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Comprehensive patient analysis and progress tracking
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Smart Precautions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              AI-generated therapy precautions based on patient profile
            </p>
          </CardContent>
        </Card>
      </div>

      {/* AI Tools */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analysis">Dosha Analysis</TabsTrigger>
          <TabsTrigger value="treatment">Treatment Planning</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Quick Start
                </CardTitle>
                <CardDescription>
                  Get started with AI-powered features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">1. Dosha Analysis</h4>
                  <p className="text-sm text-muted-foreground">
                    Analyze patient symptoms to determine their dosha constitution
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">2. Treatment Recommendations</h4>
                  <p className="text-sm text-muted-foreground">
                    Get personalized therapy recommendations based on dosha and symptoms
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">3. Patient Insights</h4>
                  <p className="text-sm text-muted-foreground">
                    Generate comprehensive insights for better patient care
                  </p>
                </div>
                <Button 
                  onClick={() => setActiveTab('analysis')}
                  className="w-full"
                >
                  Start Dosha Analysis
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Capabilities
                </CardTitle>
                <CardDescription>
                  What our AI can help you with
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Dosha Diagnosis</p>
                      <p className="text-xs text-muted-foreground">
                        Analyze symptoms to determine Vata, Pitta, or Kapha constitution
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Treatment Planning</p>
                      <p className="text-xs text-muted-foreground">
                        Generate personalized therapy recommendations
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Precaution Generation</p>
                      <p className="text-xs text-muted-foreground">
                        Create specific precautions for each therapy
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Patient Insights</p>
                      <p className="text-xs text-muted-foreground">
                        Comprehensive analysis of patient progress and recommendations
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <AIDoshaAnalysis />
        </TabsContent>

        <TabsContent value="treatment" className="space-y-6">
          <AITreatmentRecommendation />
        </TabsContent>
      </Tabs>
    </div>
  )
}