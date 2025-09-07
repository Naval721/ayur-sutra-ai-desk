# Ayurvedic Clinic Management System

A modern, responsive web application for managing an Ayurvedic clinic with patient records, scheduling, and treatment tracking.

## Features

- **Patient Management**: Complete patient profiles with dosha classification and medical history
- **Appointment Scheduling**: Calendar-based scheduling system with therapy-specific precautions
- **Dashboard Analytics**: Real-time insights into patient statistics and clinic performance
- **Responsive Design**: Modern UI built with Tailwind CSS and shadcn/ui components
- **Authentication**: Secure login system with Supabase integration

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Backend**: Supabase (Database, Authentication, Edge Functions)
- **State Management**: React Query for server state
- **Routing**: React Router DOM
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ayurvedic-clinic-management
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory and add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── AppSidebar.tsx  # Main navigation sidebar
│   ├── Navigation.tsx  # Navigation component
│   └── StatsCard.tsx   # Statistics display card
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── pages/              # Page components
│   ├── Dashboard.tsx   # Main dashboard
│   ├── Patients.tsx    # Patient management
│   ├── Schedule.tsx    # Appointment scheduling
│   └── Login.tsx       # Authentication
└── main.tsx           # Application entry point
```

## Deployment

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

### Deployment Options

- **Vercel**: Connect your GitHub repository for automatic deployments
- **Netlify**: Deploy directly from the `dist/` folder
- **AWS S3 + CloudFront**: Upload to S3 and configure CloudFront for global distribution
- **GitHub Pages**: Deploy directly from the repository

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the GitHub repository.