# AyurSutra - Complete Setup Guide

## 🚀 Quick Start

This is a **fully functional** Ayurvedic Clinic Management System with complete frontend and backend integration.

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Supabase account (free tier available)

## 🛠️ Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd ayurvedic-clinic-management
npm install
```

### 2. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Go to Settings > API to get your project URL and anon key
3. Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

4. Update `.env.local` with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_APP_NAME=AyurSutra
VITE_APP_VERSION=1.0.0
VITE_DEBUG=true
```

### 3. Set up Database

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the entire contents of `database-schema.sql`
4. Click "Run" to create all tables, indexes, and functions

### 4. Configure Authentication

1. In Supabase dashboard, go to Authentication > Settings
2. Enable email authentication
3. Configure your site URL (for development: `http://localhost:8080`)

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## 🎯 Features Implemented

### ✅ Complete Authentication System
- User registration and login
- Secure session management
- Profile management
- Password validation

### ✅ Patient Management
- Add, edit, delete patients
- Dosha classification (Vata, Pitta, Kapha)
- Medical history tracking
- Search and filter functionality

### ✅ Therapy Scheduling
- Schedule therapy sessions
- Calendar integration
- Automatic precaution generation based on dosha
- Status tracking (scheduled, in-progress, completed, cancelled)

### ✅ Feedback System
- Patient feedback collection
- Rating system (1-5 stars)
- Flagged reviews management
- Follow-up tracking

### ✅ Real-time Features
- Live notifications
- Real-time data updates
- Toast notifications
- Loading states

### ✅ Data Validation
- Form validation with Zod
- Error handling
- Input sanitization
- Type safety with TypeScript

### ✅ UI/UX
- Responsive design
- Modern UI with shadcn/ui
- Dark/light theme support
- Accessibility features

## 🗄️ Database Schema

The system includes these main tables:

- **profiles** - Practitioner information
- **patients** - Patient records with dosha classification
- **therapies** - Therapy sessions and scheduling
- **feedback** - Patient reviews and ratings

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Deploy to Netlify

1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify
3. Add environment variables in Netlify dashboard

## 🔐 Security Features

- Row Level Security (RLS) enabled
- User authentication required
- Data isolation by practitioner
- Input validation and sanitization
- Secure API endpoints

## 📱 Mobile Responsive

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- Progressive Web App (PWA) ready

## 🎨 Customization

### Branding
- Update colors in `tailwind.config.ts`
- Modify logo and favicon in `public/` folder
- Change app name in environment variables

### Features
- Add new therapy types in the database schema
- Extend patient fields as needed
- Customize precaution generation logic

## 🐛 Troubleshooting

### Common Issues

1. **Supabase connection error**
   - Check your environment variables
   - Verify Supabase project is active
   - Ensure RLS policies are set up

2. **Build errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check TypeScript errors with `npm run lint`

3. **Authentication issues**
   - Verify email authentication is enabled in Supabase
   - Check site URL configuration

### Getting Help

- Check the console for error messages
- Verify all environment variables are set
- Ensure database schema is properly created

## 📊 Analytics & Monitoring

The system includes:
- Patient statistics
- Therapy completion rates
- Feedback analytics
- Real-time notifications

## 🔄 Real-time Updates

- Patient changes trigger notifications
- Therapy status updates are live
- Feedback appears instantly
- Multi-user support with data isolation

## 🎉 You're Ready!

Your Ayurvedic Clinic Management System is now fully functional with:

- ✅ Complete backend integration
- ✅ Real-time features
- ✅ Production-ready code
- ✅ Security best practices
- ✅ Modern UI/UX
- ✅ Mobile responsive design

Start by creating your practitioner account and adding your first patient!