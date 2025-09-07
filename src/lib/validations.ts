import { z } from 'zod'

// Auth validation schemas
export const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const signUpSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  clinicName: z.string().min(2, 'Clinic name must be at least 2 characters'),
  practitionerName: z.string().min(2, 'Practitioner name must be at least 2 characters'),
  phone: z.string().optional(),
  address: z.string().optional(),
  specialization: z.string().optional(),
  experienceYears: z.number().min(0).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Patient validation schemas
export const patientSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  primaryDosha: z.enum(['Vata', 'Pitta', 'Kapha'], {
    required_error: 'Please select a primary dosha',
  }),
  secondaryDosha: z.enum(['Vata', 'Pitta', 'Kapha']).optional(),
  age: z.number().min(1).max(120).optional(),
  gender: z.enum(['Male', 'Female', 'Other']).optional(),
  address: z.string().optional(),
  medicalHistory: z.string().optional(),
  allergies: z.string().optional(),
  status: z.enum(['active', 'inactive']).default('active'),
})

export const patientUpdateSchema = patientSchema.partial().extend({
  id: z.string().uuid(),
})

// Therapy validation schemas
export const therapySchema = z.object({
  patientId: z.string().uuid('Please select a patient'),
  name: z.string().min(2, 'Therapy name must be at least 2 characters'),
  type: z.enum(['Panchakarma', 'Abhyanga', 'Shirodhara', 'Nasya', 'Basti', 'Virechana', 'Raktamokshana', 'Other'], {
    required_error: 'Please select a therapy type',
  }),
  scheduledDate: z.string().min(1, 'Please select a date'),
  scheduledTime: z.string().min(1, 'Please select a time'),
  durationMinutes: z.number().min(15).max(480).default(60),
  precautions: z.array(z.string()).optional(),
  notes: z.string().optional(),
  status: z.enum(['scheduled', 'completed', 'cancelled', 'in_progress']).default('scheduled'),
})

export const therapyUpdateSchema = therapySchema.partial().extend({
  id: z.string().uuid(),
})

// Feedback validation schemas
export const feedbackSchema = z.object({
  therapyId: z.string().uuid(),
  patientId: z.string().uuid(),
  rating: z.number().min(1).max(5, 'Rating must be between 1 and 5'),
  comment: z.string().min(10, 'Comment must be at least 10 characters'),
  wasFlagged: z.boolean().default(false),
  followUpRequired: z.boolean().default(false),
})

export const feedbackUpdateSchema = feedbackSchema.partial().extend({
  id: z.string().uuid(),
})

// Profile validation schemas
export const profileSchema = z.object({
  clinicName: z.string().min(2, 'Clinic name must be at least 2 characters'),
  practitionerName: z.string().min(2, 'Practitioner name must be at least 2 characters'),
  phone: z.string().optional(),
  email: z.string().email('Please enter a valid email address'),
  address: z.string().optional(),
  specialization: z.string().optional(),
  experienceYears: z.number().min(0).optional(),
})

export const profileUpdateSchema = profileSchema.partial()

// Search and filter schemas
export const patientSearchSchema = z.object({
  search: z.string().optional(),
  dosha: z.enum(['Vata', 'Pitta', 'Kapha']).optional(),
  status: z.enum(['active', 'inactive']).optional(),
})

export const therapyFilterSchema = z.object({
  date: z.string().optional(),
  status: z.enum(['scheduled', 'completed', 'cancelled', 'in_progress']).optional(),
  type: z.enum(['Panchakarma', 'Abhyanga', 'Shirodhara', 'Nasya', 'Basti', 'Virechana', 'Raktamokshana', 'Other']).optional(),
})

// Type exports
export type SignInInput = z.infer<typeof signInSchema>
export type SignUpInput = z.infer<typeof signUpSchema>
export type PatientInput = z.infer<typeof patientSchema>
export type PatientUpdateInput = z.infer<typeof patientUpdateSchema>
export type TherapyInput = z.infer<typeof therapySchema>
export type TherapyUpdateInput = z.infer<typeof therapyUpdateSchema>
export type FeedbackInput = z.infer<typeof feedbackSchema>
export type FeedbackUpdateInput = z.infer<typeof feedbackUpdateSchema>
export type ProfileInput = z.infer<typeof profileSchema>
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>
export type PatientSearchInput = z.infer<typeof patientSearchSchema>
export type TherapyFilterInput = z.infer<typeof therapyFilterSchema>