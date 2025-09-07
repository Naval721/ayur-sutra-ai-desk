// Placeholder for Supabase configuration
// Connect Supabase first using the green button in top right

export const supabase = {
  // Will be configured after Supabase connection
  auth: {},
  from: () => ({
    select: () => Promise.resolve({ data: [], error: null }),
    insert: () => Promise.resolve({ data: null, error: null }),
    update: () => Promise.resolve({ data: null, error: null }),
    delete: () => Promise.resolve({ data: null, error: null }),
  })
}

export type Patient = {
  id: string
  name: string
  email: string
  phone?: string
  primary_dosha: 'Vata' | 'Pitta' | 'Kapha'
  created_at: string
  practitioner_id: string
}

export type Therapy = {
  id: string
  patient_id: string
  name: string
  scheduled_date: string
  scheduled_time: string
  precautions?: string[]
  status: 'scheduled' | 'completed' | 'cancelled'
  created_at: string
}

export type Feedback = {
  id: string
  therapy_id: string
  patient_id: string
  rating: number
  comment: string
  was_flagged: boolean
  created_at: string
}

export type Profile = {
  id: string
  clinic_name: string
  phone?: string
  email: string
  created_at: string
}