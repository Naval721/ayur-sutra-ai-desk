/**
 * Mock Supabase Service for Development
 * This provides a working backend for immediate testing
 */

import { Patient, Therapy, Feedback, Profile } from './supabase'

// Mock data storage
let mockData = {
  profiles: [] as Profile[],
  patients: [] as Patient[],
  therapies: [] as (Therapy & { patients: Patient })[],
  feedback: [] as (Feedback & { therapies: Therapy; patients: Patient })[],
  currentUser: null as any,
  isAuthenticated: false
}

// Mock authentication
export const mockAuth = {
  async signUp(email: string, password: string, profileData: Partial<Profile>) {
    const user = {
      id: `user_${Date.now()}`,
      email,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    const profile: Profile = {
      id: `profile_${Date.now()}`,
      user_id: user.id,
      email,
      clinic_name: profileData.clinic_name || 'My Clinic',
      practitioner_name: profileData.practitioner_name || 'Dr. Practitioner',
      phone: profileData.phone || '',
      address: profileData.address || '',
      specialization: profileData.specialization || '',
      experience_years: profileData.experience_years || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    mockData.currentUser = user
    mockData.isAuthenticated = true
    mockData.profiles.push(profile)
    
    return { data: { user }, error: null }
  },

  async signIn(email: string, password: string) {
    const profile = mockData.profiles.find(p => p.email === email)
    if (!profile) {
      throw new Error('Invalid credentials')
    }
    
    const user = {
      id: profile.user_id,
      email: profile.email,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    mockData.currentUser = user
    mockData.isAuthenticated = true
    
    return { data: { user }, error: null }
  },

  async signOut() {
    mockData.currentUser = null
    mockData.isAuthenticated = false
    return { error: null }
  },

  async getCurrentUser() {
    return mockData.currentUser
  },

  async getCurrentProfile() {
    if (!mockData.currentUser) return null
    return mockData.profiles.find(p => p.user_id === mockData.currentUser.id) || null
  }
}

// Mock database operations
export const mockDb = {
  patients: {
    async getAll(practitionerId: string) {
      return mockData.patients.filter(p => p.practitioner_id === practitionerId)
    },

    async getById(id: string) {
      return mockData.patients.find(p => p.id === id)
    },

    async create(patient: Omit<Patient, 'id' | 'created_at' | 'updated_at'>) {
      const newPatient: Patient = {
        ...patient,
        id: `patient_${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      mockData.patients.push(newPatient)
      return newPatient
    },

    async update(id: string, updates: Partial<Patient>) {
      const index = mockData.patients.findIndex(p => p.id === id)
      if (index === -1) throw new Error('Patient not found')
      
      mockData.patients[index] = {
        ...mockData.patients[index],
        ...updates,
        updated_at: new Date().toISOString()
      }
      return mockData.patients[index]
    },

    async delete(id: string) {
      const index = mockData.patients.findIndex(p => p.id === id)
      if (index === -1) throw new Error('Patient not found')
      mockData.patients.splice(index, 1)
    }
  },

  therapies: {
    async getAll(practitionerId: string) {
      return mockData.therapies.filter(t => t.practitioner_id === practitionerId)
    },

    async getById(id: string) {
      return mockData.therapies.find(t => t.id === id)
    },

    async create(therapy: Omit<Therapy, 'id' | 'created_at' | 'updated_at'>) {
      const patient = mockData.patients.find(p => p.id === therapy.patient_id)
      if (!patient) throw new Error('Patient not found')
      
      const newTherapy: Therapy & { patients: Patient } = {
        ...therapy,
        id: `therapy_${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        patients: patient
      }
      mockData.therapies.push(newTherapy)
      return newTherapy
    },

    async update(id: string, updates: Partial<Therapy>) {
      const index = mockData.therapies.findIndex(t => t.id === id)
      if (index === -1) throw new Error('Therapy not found')
      
      mockData.therapies[index] = {
        ...mockData.therapies[index],
        ...updates,
        updated_at: new Date().toISOString()
      }
      return mockData.therapies[index]
    },

    async delete(id: string) {
      const index = mockData.therapies.findIndex(t => t.id === id)
      if (index === -1) throw new Error('Therapy not found')
      mockData.therapies.splice(index, 1)
    },

    async getByDate(date: string, practitionerId: string) {
      return mockData.therapies.filter(t => 
        t.scheduled_date === date && t.practitioner_id === practitionerId
      )
    }
  },

  feedback: {
    async getAll(practitionerId: string) {
      return mockData.feedback.filter(f => 
        mockData.therapies.some(t => t.id === f.therapy_id && t.practitioner_id === practitionerId)
      )
    },

    async create(feedback: Omit<Feedback, 'id' | 'created_at' | 'updated_at'>) {
      const newFeedback: Feedback = {
        ...feedback,
        id: `feedback_${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      mockData.feedback.push(newFeedback)
      return newFeedback
    },

    async update(id: string, updates: Partial<Feedback>) {
      const index = mockData.feedback.findIndex(f => f.id === id)
      if (index === -1) throw new Error('Feedback not found')
      
      mockData.feedback[index] = {
        ...mockData.feedback[index],
        ...updates,
        updated_at: new Date().toISOString()
      }
      return mockData.feedback[index]
    }
  },

  profiles: {
    async getByUserId(userId: string) {
      return mockData.profiles.find(p => p.user_id === userId)
    },

    async create(profile: Omit<Profile, 'id' | 'created_at' | 'updated_at'>) {
      const newProfile: Profile = {
        ...profile,
        id: `profile_${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      mockData.profiles.push(newProfile)
      return newProfile
    },

    async update(userId: string, updates: Partial<Profile>) {
      const index = mockData.profiles.findIndex(p => p.user_id === userId)
      if (index === -1) throw new Error('Profile not found')
      
      mockData.profiles[index] = {
        ...mockData.profiles[index],
        ...updates,
        updated_at: new Date().toISOString()
      }
      return mockData.profiles[index]
    }
  }
}

// Mock real-time subscriptions
export const mockSubscribe = {
  patients(practitionerId: string, callback: (payload: any) => void) {
    // Simulate real-time updates
    return {
      unsubscribe: () => {}
    }
  },

  therapies(practitionerId: string, callback: (payload: any) => void) {
    // Simulate real-time updates
    return {
      unsubscribe: () => {}
    }
  }
}

// Add some sample data for demonstration
export const addSampleData = () => {
  if (mockData.patients.length === 0) {
    // Add sample patients
    mockData.patients.push({
      id: 'patient_1',
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+1 555-0123',
      primary_dosha: 'Vata',
      secondary_dosha: 'Pitta',
      age: 35,
      gender: 'Male',
      address: '123 Wellness St, Health City',
      medical_history: 'Hypertension, occasional migraines',
      allergies: 'None known',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      practitioner_id: 'demo_practitioner'
    })

    mockData.patients.push({
      id: 'patient_2',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+1 555-0456',
      primary_dosha: 'Pitta',
      secondary_dosha: 'Kapha',
      age: 28,
      gender: 'Female',
      address: '456 Balance Ave, Harmony City',
      medical_history: 'Digestive issues, stress-related symptoms',
      allergies: 'Dairy',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      practitioner_id: 'demo_practitioner'
    })

    // Add sample therapies
    mockData.therapies.push({
      id: 'therapy_1',
      patient_id: 'patient_1',
      name: 'Abhyanga Massage',
      type: 'Abhyanga',
      scheduled_date: new Date().toISOString().split('T')[0],
      scheduled_time: '10:00',
      duration_minutes: 60,
      precautions: ['Avoid cold water for 2 hours after', 'Rest for 30 minutes after therapy'],
      notes: 'Focus on Vata-pacifying techniques',
      status: 'scheduled',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      practitioner_id: 'demo_practitioner',
      patients: mockData.patients[0]
    })

    // Add sample feedback
    mockData.feedback.push({
      id: 'feedback_1',
      therapy_id: 'therapy_1',
      patient_id: 'patient_1',
      rating: 5,
      comment: 'Excellent therapy session. Felt very relaxed and rejuvenated.',
      was_flagged: false,
      follow_up_required: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      therapies: mockData.therapies[0],
      patients: mockData.patients[0]
    })
  }
}

// Initialize sample data
addSampleData()