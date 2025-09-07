import { GoogleGenerativeAI, GenerativeModel, GenerationConfig } from '@google/generative-ai'

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '')

// Configuration for consistent responses
const generationConfig: GenerationConfig = {
  temperature: 0.7,
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 1024,
}

// Get the Gemini model
const model: GenerativeModel = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  generationConfig
})

// Types for AI responses
export interface DoshaAnalysis {
  primaryDosha: 'Vata' | 'Pitta' | 'Kapha'
  secondaryDosha?: 'Vata' | 'Pitta' | 'Kapha'
  confidence: number
  reasoning: string
  characteristics: string[]
  imbalances: string[]
}

export interface TreatmentRecommendation {
  therapyType: string
  duration: string
  frequency: string
  precautions: string[]
  benefits: string[]
  contraindications: string[]
  dietaryRecommendations: string[]
  lifestyleAdvice: string[]
}

export interface SymptomAnalysis {
  possibleConditions: string[]
  severity: 'mild' | 'moderate' | 'severe'
  urgency: 'low' | 'medium' | 'high'
  recommendations: string[]
  followUpActions: string[]
}

export interface PatientInsight {
  summary: string
  keyFindings: string[]
  recommendations: string[]
  riskFactors: string[]
  positiveAspects: string[]
}

// AI Service Class
export class GeminiAIService {
  private static instance: GeminiAIService
  private model: GenerativeModel

  constructor() {
    this.model = model
  }

  static getInstance(): GeminiAIService {
    if (!GeminiAIService.instance) {
      GeminiAIService.instance = new GeminiAIService()
    }
    return GeminiAIService.instance
  }

  private async generateContent(prompt: string): Promise<string> {
    try {
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      return response.text()
    } catch (error) {
      console.error('Gemini AI Error:', error)
      throw new Error('Failed to generate AI response')
    }
  }

  // Analyze patient symptoms and suggest dosha diagnosis
  async analyzeDosha(symptoms: string[], patientInfo: {
    age?: number
    gender?: string
    medicalHistory?: string
    lifestyle?: string
  }): Promise<DoshaAnalysis> {
    const prompt = `
You are an expert Ayurvedic practitioner. Analyze the following patient information and provide a dosha diagnosis.

Patient Information:
- Age: ${patientInfo.age || 'Not specified'}
- Gender: ${patientInfo.gender || 'Not specified'}
- Medical History: ${patientInfo.medicalHistory || 'None provided'}
- Lifestyle: ${patientInfo.lifestyle || 'Not specified'}

Symptoms: ${symptoms.join(', ')}

Please provide a detailed analysis in the following JSON format:
{
  "primaryDosha": "Vata" | "Pitta" | "Kapha",
  "secondaryDosha": "Vata" | "Pitta" | "Kapha" | null,
  "confidence": number (0-100),
  "reasoning": "Detailed explanation of the diagnosis",
  "characteristics": ["List of dosha characteristics observed"],
  "imbalances": ["List of specific imbalances identified"]
}

Focus on:
1. Traditional Ayurvedic principles
2. Symptom patterns and their dosha associations
3. Constitutional analysis
4. Current imbalances
5. Provide practical, actionable insights

Respond only with valid JSON, no additional text.
`

    try {
      const response = await this.generateContent(prompt)
      const analysis = JSON.parse(response) as DoshaAnalysis
      return analysis
    } catch (error) {
      console.error('Dosha analysis error:', error)
      // Return fallback analysis
      return {
        primaryDosha: 'Vata',
        confidence: 50,
        reasoning: 'Unable to analyze symptoms at this time',
        characteristics: ['Analysis unavailable'],
        imbalances: ['Please consult with practitioner']
      }
    }
  }

  // Generate treatment recommendations based on dosha and symptoms
  async generateTreatmentRecommendation(
    dosha: string,
    symptoms: string[],
    therapyType?: string
  ): Promise<TreatmentRecommendation> {
    const prompt = `
You are an expert Ayurvedic practitioner. Generate comprehensive treatment recommendations.

Patient Profile:
- Primary Dosha: ${dosha}
- Symptoms: ${symptoms.join(', ')}
- Requested Therapy: ${therapyType || 'General recommendation'}

Provide detailed treatment recommendations in this JSON format:
{
  "therapyType": "Specific therapy recommended",
  "duration": "Recommended duration",
  "frequency": "How often to perform",
  "precautions": ["List of important precautions"],
  "benefits": ["Expected benefits"],
  "contraindications": ["When not to use this treatment"],
  "dietaryRecommendations": ["Dietary advice"],
  "lifestyleAdvice": ["Lifestyle modifications"]
}

Focus on:
1. Traditional Ayurvedic treatments
2. Safety considerations
3. Practical implementation
4. Holistic approach including diet and lifestyle
5. Specific to the patient's dosha and symptoms

Respond only with valid JSON, no additional text.
`

    try {
      const response = await this.generateContent(prompt)
      const recommendation = JSON.parse(response) as TreatmentRecommendation
      return recommendation
    } catch (error) {
      console.error('Treatment recommendation error:', error)
      return {
        therapyType: 'Consultation recommended',
        duration: 'To be determined',
        frequency: 'As advised',
        precautions: ['Please consult with practitioner'],
        benefits: ['Professional assessment needed'],
        contraindications: ['Assessment required'],
        dietaryRecommendations: ['Consult practitioner for dietary advice'],
        lifestyleAdvice: ['Professional guidance recommended']
      }
    }
  }

  // Analyze symptoms for potential conditions
  async analyzeSymptoms(symptoms: string[]): Promise<SymptomAnalysis> {
    const prompt = `
You are an expert Ayurvedic practitioner. Analyze these symptoms for potential conditions and urgency.

Symptoms: ${symptoms.join(', ')}

Provide analysis in this JSON format:
{
  "possibleConditions": ["List of possible Ayurvedic conditions"],
  "severity": "mild" | "moderate" | "severe",
  "urgency": "low" | "medium" | "high",
  "recommendations": ["Immediate recommendations"],
  "followUpActions": ["Next steps to take"]
}

Consider:
1. Traditional Ayurvedic diagnosis
2. Symptom severity and patterns
3. Urgency of medical attention needed
4. Practical next steps
5. When to seek immediate care

Respond only with valid JSON, no additional text.
`

    try {
      const response = await this.generateContent(prompt)
      const analysis = JSON.parse(response) as SymptomAnalysis
      return analysis
    } catch (error) {
      console.error('Symptom analysis error:', error)
      return {
        possibleConditions: ['Consultation recommended'],
        severity: 'moderate',
        urgency: 'medium',
        recommendations: ['Please consult with a qualified practitioner'],
        followUpActions: ['Schedule appointment for proper assessment']
      }
    }
  }

  // Generate patient insights and recommendations
  async generatePatientInsights(patientData: {
    name: string
    age?: number
    dosha: string
    symptoms: string[]
    medicalHistory?: string
    therapies: string[]
    feedback?: string
  }): Promise<PatientInsight> {
    const prompt = `
You are an expert Ayurvedic practitioner reviewing a patient's case. Generate comprehensive insights.

Patient Data:
- Name: ${patientData.name}
- Age: ${patientData.age || 'Not specified'}
- Dosha: ${patientData.dosha}
- Current Symptoms: ${patientData.symptoms.join(', ')}
- Medical History: ${patientData.medicalHistory || 'None provided'}
- Previous Therapies: ${patientData.therapies.join(', ')}
- Recent Feedback: ${patientData.feedback || 'None provided'}

Provide insights in this JSON format:
{
  "summary": "Brief overview of patient's condition and progress",
  "keyFindings": ["Important observations about the patient"],
  "recommendations": ["Specific recommendations for treatment"],
  "riskFactors": ["Potential risks or concerns"],
  "positiveAspects": ["Positive developments or strengths"]
}

Focus on:
1. Holistic patient assessment
2. Progress tracking
3. Treatment optimization
4. Risk management
5. Positive reinforcement
6. Practical next steps

Respond only with valid JSON, no additional text.
`

    try {
      const response = await this.generateContent(prompt)
      const insights = JSON.parse(response) as PatientInsight
      return insights
    } catch (error) {
      console.error('Patient insights error:', error)
      return {
        summary: 'Analysis unavailable at this time',
        keyFindings: ['Please consult with practitioner'],
        recommendations: ['Professional assessment recommended'],
        riskFactors: ['Assessment needed'],
        positiveAspects: ['Consultation will provide insights']
      }
    }
  }

  // Generate therapy precautions based on dosha and therapy type
  async generateTherapyPrecautions(
    therapyType: string,
    dosha: string,
    patientAge?: number,
    medicalHistory?: string
  ): Promise<string[]> {
    const prompt = `
You are an expert Ayurvedic practitioner. Generate specific precautions for a therapy session.

Therapy: ${therapyType}
Patient Dosha: ${dosha}
Age: ${patientAge || 'Not specified'}
Medical History: ${medicalHistory || 'None provided'}

Generate a list of 5-8 specific precautions in this format:
["Precaution 1", "Precaution 2", "Precaution 3", ...]

Focus on:
1. Safety considerations specific to the therapy
2. Dosha-specific precautions
3. Age-related considerations
4. Medical history considerations
5. Practical implementation advice

Respond only with a JSON array of strings, no additional text.
`

    try {
      const response = await this.generateContent(prompt)
      const precautions = JSON.parse(response) as string[]
      return precautions
    } catch (error) {
      console.error('Precautions generation error:', error)
      return [
        'Consult with practitioner before therapy',
        'Inform about any allergies or sensitivities',
        'Follow practitioner instructions carefully',
        'Report any discomfort immediately',
        'Avoid heavy meals before therapy'
      ]
    }
  }

  // Generate general Ayurvedic advice
  async generateGeneralAdvice(topic: string, context?: string): Promise<string> {
    const prompt = `
You are an expert Ayurvedic practitioner. Provide helpful advice on the following topic.

Topic: ${topic}
Context: ${context || 'General inquiry'}

Provide practical, evidence-based Ayurvedic advice in 2-3 paragraphs. Focus on:
1. Traditional Ayurvedic principles
2. Practical applications
3. Safety considerations
4. Holistic approach

Keep the response concise but informative.
`

    try {
      const response = await this.generateContent(prompt)
      return response
    } catch (error) {
      console.error('General advice error:', error)
      return 'I apologize, but I cannot provide advice at this time. Please consult with a qualified Ayurvedic practitioner for personalized guidance.'
    }
  }
}

// Export singleton instance
export const geminiAI = GeminiAIService.getInstance()

// Utility functions
export const aiUtils = {
  // Check if AI is available
  isAvailable(): boolean {
    return !!import.meta.env.VITE_GEMINI_API_KEY
  },

  // Get AI status
  getStatus(): { available: boolean; model: string } {
    return {
      available: this.isAvailable(),
      model: 'gemini-1.5-flash'
    }
  },

  // Format symptoms for AI analysis
  formatSymptoms(symptoms: string[]): string {
    return symptoms.filter(s => s.trim()).join(', ')
  },

  // Validate AI response
  validateResponse(response: any): boolean {
    return response && typeof response === 'object' && !response.error
  }
}