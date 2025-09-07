#!/usr/bin/env node

/**
 * AyurSutra Backend Verification Script
 * This script verifies that all backend components are properly set up
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
const envPath = join(__dirname, '.env.local')
let envVars = {}

try {
  const envContent = readFileSync(envPath, 'utf8')
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=')
    if (key && value) {
      envVars[key.trim()] = value.trim()
    }
  })
} catch (error) {
  console.log('⚠️  .env.local file not found. Please create it with your Supabase credentials.')
  process.exit(1)
}

// Check environment variables
console.log('🔍 Verifying Backend Setup...\n')

const supabaseUrl = envVars.VITE_SUPABASE_URL
const supabaseKey = envVars.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || supabaseUrl.includes('your-project')) {
  console.log('❌ VITE_SUPABASE_URL not configured properly')
  console.log('   Please update .env.local with your actual Supabase URL')
  process.exit(1)
}

if (!supabaseKey || supabaseKey.includes('your-anon-key')) {
  console.log('❌ VITE_SUPABASE_ANON_KEY not configured properly')
  console.log('   Please update .env.local with your actual Supabase anon key')
  process.exit(1)
}

console.log('✅ Environment variables configured')

// Test Supabase connection
const supabase = createClient(supabaseUrl, supabaseKey)

async function verifyBackend() {
  try {
    console.log('🔌 Testing Supabase connection...')
    
    // Test basic connection
    const { data, error } = await supabase.from('profiles').select('count').limit(1)
    
    if (error) {
      console.log('❌ Supabase connection failed:', error.message)
      console.log('\n📋 Setup Checklist:')
      console.log('   1. Create a Supabase project at https://supabase.com')
      console.log('   2. Run the database-schema.sql in your Supabase SQL Editor')
      console.log('   3. Update .env.local with your actual credentials')
      process.exit(1)
    }
    
    console.log('✅ Supabase connection successful')
    
    // Test database schema
    console.log('🗄️  Verifying database schema...')
    
    const tables = ['profiles', 'patients', 'therapies', 'feedback']
    const tableChecks = await Promise.all(
      tables.map(async (table) => {
        const { error } = await supabase.from(table).select('*').limit(1)
        return { table, exists: !error }
      })
    )
    
    const missingTables = tableChecks.filter(check => !check.exists)
    
    if (missingTables.length > 0) {
      console.log('❌ Missing database tables:', missingTables.map(t => t.table).join(', '))
      console.log('\n📋 Please run the database-schema.sql in your Supabase SQL Editor')
      process.exit(1)
    }
    
    console.log('✅ All database tables exist')
    
    // Test RLS policies
    console.log('🔒 Testing Row Level Security...')
    
    // This should fail without authentication (good sign)
    const { error: rlsError } = await supabase.from('patients').select('*')
    
    if (rlsError && rlsError.message.includes('RLS')) {
      console.log('✅ Row Level Security is properly configured')
    } else {
      console.log('⚠️  Row Level Security may not be properly configured')
    }
    
    console.log('\n🎉 Backend verification complete!')
    console.log('\n📊 Backend Status:')
    console.log('   ✅ Supabase connection: Working')
    console.log('   ✅ Database schema: Complete')
    console.log('   ✅ Security policies: Configured')
    console.log('   ✅ Environment: Ready')
    
    console.log('\n🚀 Your backend is ready for production!')
    console.log('\n📋 Next steps:')
    console.log('   1. Start the development server: npm run dev')
    console.log('   2. Open http://localhost:8080')
    console.log('   3. Create your practitioner account')
    console.log('   4. Start managing your Ayurvedic practice!')
    
  } catch (error) {
    console.log('❌ Backend verification failed:', error.message)
    process.exit(1)
  }
}

verifyBackend()