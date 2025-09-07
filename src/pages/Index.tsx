import { useState } from "react"
import { Navigation } from "@/components/Navigation"
import { Dashboard } from "@/pages/Dashboard"
import { Patients } from "@/pages/Patients"
import { Schedule } from "@/pages/Schedule"
import { Login } from "@/pages/Login"

const Index = () => {
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'patients':
        return <Patients />
      case 'schedule':
        return <Schedule />
      case 'feedback':
        return <div className="flex-1 p-6"><h1 className="text-3xl font-bold">Feedback Inbox</h1><p className="text-muted-foreground">AI-analyzed patient feedback coming soon...</p></div>
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      {renderPage()}
    </div>
  );
};

export default Index;
