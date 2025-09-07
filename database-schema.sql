-- Ayurvedic Clinic Management System Database Schema
-- Run this in your Supabase SQL editor

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create custom types
CREATE TYPE dosha_type AS ENUM ('Vata', 'Pitta', 'Kapha');
CREATE TYPE gender_type AS ENUM ('Male', 'Female', 'Other');
CREATE TYPE therapy_type AS ENUM ('Panchakarma', 'Abhyanga', 'Shirodhara', 'Nasya', 'Basti', 'Virechana', 'Raktamokshana', 'Other');
CREATE TYPE therapy_status AS ENUM ('scheduled', 'completed', 'cancelled', 'in_progress');
CREATE TYPE patient_status AS ENUM ('active', 'inactive');
CREATE TYPE user_role AS ENUM ('practitioner', 'admin');

-- Create profiles table
CREATE TABLE profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  clinic_name TEXT NOT NULL,
  practitioner_name TEXT NOT NULL,
  phone TEXT,
  email TEXT NOT NULL,
  address TEXT,
  specialization TEXT,
  experience_years INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create patients table
CREATE TABLE patients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  primary_dosha dosha_type NOT NULL,
  secondary_dosha dosha_type,
  age INTEGER,
  gender gender_type,
  address TEXT,
  medical_history TEXT,
  allergies TEXT,
  status patient_status DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  practitioner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create therapies table
CREATE TABLE therapies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type therapy_type NOT NULL,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  precautions TEXT[],
  notes TEXT,
  status therapy_status DEFAULT 'scheduled',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  practitioner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create feedback table
CREATE TABLE feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  therapy_id UUID REFERENCES therapies(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  was_flagged BOOLEAN DEFAULT FALSE,
  follow_up_required BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_patients_practitioner_id ON patients(practitioner_id);
CREATE INDEX idx_patients_email ON patients(email);
CREATE INDEX idx_therapies_practitioner_id ON therapies(practitioner_id);
CREATE INDEX idx_therapies_patient_id ON therapies(patient_id);
CREATE INDEX idx_therapies_scheduled_date ON therapies(scheduled_date);
CREATE INDEX idx_feedback_therapy_id ON feedback(therapy_id);
CREATE INDEX idx_feedback_patient_id ON feedback(patient_id);
CREATE INDEX idx_profiles_user_id ON profiles(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE therapies ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Patients policies
CREATE POLICY "Practitioners can view their own patients" ON patients
  FOR SELECT USING (auth.uid() = practitioner_id);

CREATE POLICY "Practitioners can insert their own patients" ON patients
  FOR INSERT WITH CHECK (auth.uid() = practitioner_id);

CREATE POLICY "Practitioners can update their own patients" ON patients
  FOR UPDATE USING (auth.uid() = practitioner_id);

CREATE POLICY "Practitioners can delete their own patients" ON patients
  FOR DELETE USING (auth.uid() = practitioner_id);

-- Therapies policies
CREATE POLICY "Practitioners can view their own therapies" ON therapies
  FOR SELECT USING (auth.uid() = practitioner_id);

CREATE POLICY "Practitioners can insert their own therapies" ON therapies
  FOR INSERT WITH CHECK (auth.uid() = practitioner_id);

CREATE POLICY "Practitioners can update their own therapies" ON therapies
  FOR UPDATE USING (auth.uid() = practitioner_id);

CREATE POLICY "Practitioners can delete their own therapies" ON therapies
  FOR DELETE USING (auth.uid() = practitioner_id);

-- Feedback policies
CREATE POLICY "Practitioners can view feedback for their therapies" ON feedback
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM therapies 
      WHERE therapies.id = feedback.therapy_id 
      AND therapies.practitioner_id = auth.uid()
    )
  );

CREATE POLICY "Practitioners can insert feedback for their therapies" ON feedback
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM therapies 
      WHERE therapies.id = feedback.therapy_id 
      AND therapies.practitioner_id = auth.uid()
    )
  );

CREATE POLICY "Practitioners can update feedback for their therapies" ON feedback
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM therapies 
      WHERE therapies.id = feedback.therapy_id 
      AND therapies.practitioner_id = auth.uid()
    )
  );

-- Create functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_therapies_updated_at BEFORE UPDATE ON therapies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_feedback_updated_at BEFORE UPDATE ON feedback
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (optional - remove in production)
INSERT INTO profiles (user_id, clinic_name, practitioner_name, email, phone, address, specialization, experience_years)
VALUES 
  ('00000000-0000-0000-0000-000000000000', 'AyurSutra Clinic', 'Dr. Sample Practitioner', 'practitioner@ayursutra.com', '+91 98765 43210', '123 Ayurveda Street, Wellness City', 'Panchakarma Specialist', 10);

-- Create a function to generate therapy precautions
CREATE OR REPLACE FUNCTION generate_therapy_precautions(
  therapy_type therapy_type,
  patient_dosha dosha_type
)
RETURNS TEXT[] AS $$
DECLARE
  precautions TEXT[];
BEGIN
  precautions := ARRAY[]::TEXT[];
  
  -- General precautions for all therapies
  precautions := precautions || 'Avoid heavy meals 2 hours before therapy';
  precautions := precautions || 'Inform practitioner of any allergies';
  precautions := precautions || 'Wear comfortable, loose clothing';
  
  -- Therapy-specific precautions
  CASE therapy_type
    WHEN 'Panchakarma' THEN
      precautions := precautions || 'Follow prescribed diet for 7 days before';
      precautions := precautions || 'Avoid strenuous activities for 3 days after';
      precautions := precautions || 'Drink plenty of warm water';
    WHEN 'Abhyanga' THEN
      precautions := precautions || 'Avoid cold water for 2 hours after';
      precautions := precautions || 'Rest for 30 minutes after therapy';
    WHEN 'Shirodhara' THEN
      precautions := precautions || 'Keep head covered for 2 hours after';
      precautions := precautions || 'Avoid reading or screen time for 4 hours';
    WHEN 'Nasya' THEN
      precautions := precautions || 'Avoid lying down for 30 minutes after';
      precautions := precautions || 'Keep head elevated while sleeping';
    WHEN 'Basti' THEN
      precautions := precautions || 'Follow liquid diet for 24 hours after';
      precautions := precautions || 'Avoid travel for 2 days';
    WHEN 'Virechana' THEN
      precautions := precautions || 'Follow prescribed diet for 3 days after';
      precautions := precautions || 'Avoid cold foods and drinks';
    WHEN 'Raktamokshana' THEN
      precautions := precautions || 'Keep wound clean and dry';
      precautions := precautions || 'Avoid heavy lifting for 2 days';
  END CASE;
  
  -- Dosha-specific precautions
  CASE patient_dosha
    WHEN 'Vata' THEN
      precautions := precautions || 'Keep warm and avoid cold drafts';
      precautions := precautions || 'Follow Vata-pacifying diet';
    WHEN 'Pitta' THEN
      precautions := precautions || 'Avoid spicy and hot foods';
      precautions := precautions || 'Stay in cool environment';
    WHEN 'Kapha' THEN
      precautions := precautions || 'Engage in light exercise';
      precautions := precautions || 'Avoid heavy and oily foods';
  END CASE;
  
  RETURN precautions;
END;
$$ LANGUAGE plpgsql;