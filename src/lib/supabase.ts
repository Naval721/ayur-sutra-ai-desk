import { createClient } from '@supabase/supabase-js'
import { mockAuth, mockDb, mockSubscribe, addSampleData } from './mock-supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if we're using the demo/development configuration
const isDevelopment = supabaseUrl?.includes('ayursutra-demo') || supabaseUrl?.includes('your-project')

let supabase: any

if (isDevelopment) {
  // Use mock service for development
  console.log('🔧 Using development mock service')
  addSampleData()
  
  supabase = {
    auth: mockAuth,
    from: () => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: [], error: null }),
      update: () => ({ data: [], error: null }),
      delete: () => ({ error: null })
    })
  }
} else {
  // Use real Supabase for production
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }
  supabase = createClient(supabaseUrl, supabaseAnonKey)
}

// Database Types
export type Patient = {
  id: string
  name: string
  email: string
  phone?: string
  primary_dosha: 'Vata' | 'Pitta' | 'Kapha'
  secondary_dosha?: 'Vata' | 'Pitta' | 'Kapha'
  age?: number
  gender?: 'Male' | 'Female' | 'Other'
  address?: string
  medical_history?: string
  allergies?: string
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
  practitioner_id: string
}

export type Therapy = {
  id: string
  patient_id: string
  name: string
  type: 'Panchakarma' | 'Abhyanga' | 'Shirodhara' | 'Nasya' | 'Basti' | 'Virechana' | 'Raktamokshana' | 'Other'
  scheduled_date: string
  scheduled_time: string
  duration_minutes: number
  precautions?: string[]
  notes?: string
  status: 'scheduled' | 'completed' | 'cancelled' | 'in_progress'
  created_at: string
  updated_at: string
  practitioner_id: string
}

export type Feedback = {
  id: string
  therapy_id: string
  patient_id: string
  rating: number
  comment: string
  was_flagged: boolean
  follow_up_required: boolean
  created_at: string
  updated_at: string
}

export type Profile = {
  id: string
  clinic_name: string
  practitioner_name: string
  phone?: string
  email: string
  address?: string
  specialization?: string
  experience_years?: number
  created_at: string
  updated_at: string
  user_id: string
}

export type User = {
  id: string
  email: string
  role: 'practitioner' | 'admin'
  created_at: string
  updated_at: string
}

// Database Operations
export const db = {
  // Patient operations
  patients: {
    async getAll(practitionerId: string) {
      if (isDevelopment) {
        return await mockDb.patients.getAll(practitionerId)
      }
      
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('practitioner_id', practitionerId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data as Patient[]
    },

    async getById(id: string) {
      if (isDevelopment) {
        return await mockDb.patients.getById(id)
      }
      
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data as Patient
    },

    async create(patient: Omit<Patient, 'id' | 'created_at' | 'updated_at'>) {
      if (isDevelopment) {
        return await mockDb.patients.create(patient)
      }
      
      const { data, error } = await supabase
        .from('patients')
        .insert([patient])
        .select()
        .single()
      
      if (error) throw error
      return data as Patient
    },

    async update(id: string, updates: Partial<Patient>) {
      if (isDevelopment) {
        return await mockDb.patients.update(id, updates)
      }
      
      const { data, error } = await supabase
        .from('patients')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data as Patient
    },

    async delete(id: string) {
      if (isDevelopment) {
        return await mockDb.patients.delete(id)
      }
      
      const { error } = await supabase
        .from('patients')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    }
  },

  // Therapy operations
  therapies: {
    async getAll(practitionerId: string) {
      if (isDevelopment) {
        return await mockDb.therapies.getAll(practitionerId)
      }
      
      const { data, error } = await supabase
        .from('therapies')
        .select(`
          *,
          patients (
            id,
            name,
            email,
            primary_dosha
          )
        `)
        .eq('practitioner_id', practitionerId)
        .order('scheduled_date', { ascending: true })
      
      if (error) throw error
      return data as (Therapy & { patients: Patient })[]
    },

    async getById(id: string) {
      if (isDevelopment) {
        return await mockDb.therapies.getById(id)
      }
      
      const { data, error } = await supabase
        .from('therapies')
        .select(`
          *,
          patients (
            id,
            name,
            email,
            primary_dosha
          )
        `)
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data as Therapy & { patients: Patient }
    },

    async create(therapy: Omit<Therapy, 'id' | 'created_at' | 'updated_at'>) {
      if (isDevelopment) {
        return await mockDb.therapies.create(therapy)
      }
      
      const { data, error } = await supabase
        .from('therapies')
        .insert([therapy])
        .select(`
          *,
          patients (
            id,
            name,
            email,
            primary_dosha
          )
        `)
        .single()
      
      if (error) throw error
      return data as Therapy & { patients: Patient }
    },

    async update(id: string, updates: Partial<Therapy>) {
      if (isDevelopment) {
        return await mockDb.therapies.update(id, updates)
      }
      
      const { data, error } = await supabase
        .from('therapies')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select(`
          *,
          patients (
            id,
            name,
            email,
            primary_dosha
          )
        `)
        .single()
      
      if (error) throw error
      return data as Therapy & { patients: Patient }
    },

    async delete(id: string) {
      if (isDevelopment) {
        return await mockDb.therapies.delete(id)
      }
      
      const { error } = await supabase
        .from('therapies')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },

    async getByDate(date: string, practitionerId: string) {
      if (isDevelopment) {
        return await mockDb.therapies.getByDate(date, practitionerId)
      }
      
      const { data, error } = await supabase
        .from('therapies')
        .select(`
          *,
          patients (
            id,
            name,
            email,
            primary_dosha
          )
        `)
        .eq('scheduled_date', date)
        .eq('practitioner_id', practitionerId)
        .order('scheduled_time', { ascending: true })
      
      if (error) throw error
      return data as (Therapy & { patients: Patient })[]
    }
  },

  // Feedback operations
  feedback: {
    async getAll(practitionerId: string) {
      if (isDevelopment) {
        return await mockDb.feedback.getAll(practitionerId)
      }
      
      const { data, error } = await supabase
        .from('feedback')
        .select(`
          *,
          therapies (
            id,
            name,
            scheduled_date
          ),
          patients (
            id,
            name
          )
        `)
        .eq('therapies.practitioner_id', practitionerId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data as (Feedback & { therapies: Therapy; patients: Patient })[]
    },

    async create(feedback: Omit<Feedback, 'id' | 'created_at' | 'updated_at'>) {
      if (isDevelopment) {
        return await mockDb.feedback.create(feedback)
      }
      
      const { data, error } = await supabase
        .from('feedback')
        .insert([feedback])
        .select()
        .single()
      
      if (error) throw error
      return data as Feedback
    },

    async update(id: string, updates: Partial<Feedback>) {
      if (isDevelopment) {
        return await mockDb.feedback.update(id, updates)
      }
      
      const { data, error } = await supabase
        .from('feedback')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data as Feedback
    }
  },

  // Profile operations
  profiles: {
    async getByUserId(userId: string) {
      if (isDevelopment) {
        return await mockDb.profiles.getByUserId(userId)
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single()
      
      if (error) throw error
      return data as Profile
    },

    async create(profile: Omit<Profile, 'id' | 'created_at' | 'updated_at'>) {
      if (isDevelopment) {
        return await mockDb.profiles.create(profile)
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .insert([profile])
        .select()
        .single()
      
      if (error) throw error
      return data as Profile
    },

    async update(userId: string, updates: Partial<Profile>) {
      if (isDevelopment) {
        return await mockDb.profiles.update(userId, updates)
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('user_id', userId)
        .select()
        .single()
      
      if (error) throw error
      return data as Profile
    }
  }
}

// Authentication helpers
export const auth = {
  async signUp(email: string, password: string, profileData: Partial<Profile>) {
    if (isDevelopment) {
      return await mockAuth.signUp(email, password, profileData)
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) throw error

    if (data.user) {
      // Create profile
      await db.profiles.create({
        user_id: data.user.id,
        email: data.user.email!,
        clinic_name: profileData.clinic_name || '',
        practitioner_name: profileData.practitioner_name || '',
        ...profileData
      })
    }

    return data
  },

  async signIn(email: string, password: string) {
    if (isDevelopment) {
      return await mockAuth.signIn(email, password)
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return data
  },

  async signOut() {
    if (isDevelopment) {
      return await mockAuth.signOut()
    }
    
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getCurrentUser() {
    if (isDevelopment) {
      return await mockAuth.getCurrentUser()
    }
    
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  },

  async getCurrentProfile() {
    if (isDevelopment) {
      return await mockAuth.getCurrentProfile()
    }
    
    const user = await this.getCurrentUser()
    if (!user) return null
    
    return await db.profiles.getByUserId(user.id)
  }
}

// Real-time subscriptions
export const subscribe = {
  patients(practitionerId: string, callback: (payload: any) => void) {
    if (isDevelopment) {
      return mockSubscribe.patients(practitionerId, callback)
    }
    
    return supabase
      .channel('patients')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'patients',
          filter: `practitioner_id=eq.${practitionerId}`
        }, 
        callback
      )
      .subscribe()
  },

  therapies(practitionerId: string, callback: (payload: any) => void) {
    if (isDevelopment) {
      return mockSubscribe.therapies(practitionerId, callback)
    }
    
    return supabase
      .channel('therapies')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'therapies',
          filter: `practitioner_id=eq.${practitionerId}`
        }, 
        callback
      )
      .subscribe()
  }
}