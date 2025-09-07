import { useState } from "react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Dashboard } from "@/pages/Dashboard"
import { Patients } from "@/pages/Patients"
import { Schedule } from "@/pages/Schedule"
import { Login } from "@/pages/Login"
import { Button } from "@/components/ui/button"
import { Bell, LogOut, User } from "lucide-react"

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
        return (
          <div className="flex-1 p-8 bg-gradient-subtle animate-fade-in">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl font-display font-bold text-ayur-green mb-4">Feedback Inbox</h1>
              <p className="text-muted-foreground text-lg">AI-analyzed patient feedback coming soon...</p>
            </div>
          </div>
        )
      default:
        return <Dashboard />
    }
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-subtle">
        <AppSidebar currentPage={currentPage} onNavigate={setCurrentPage} />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b border-border/40 bg-background/80 backdrop-blur-sm flex items-center justify-between px-6 shadow-elegant">
            <div className="flex items-center space-x-4">
              <SidebarTrigger className="hover:bg-ayur-green-light/50 hover:text-ayur-green transition-colors" />
              <div className="animate-fade-in">
                <h1 className="font-display font-semibold text-ayur-green">
                  Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}
                </h1>
                <p className="text-sm text-muted-foreground">Welcome back to your practice</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" className="relative hover:bg-ayur-green-light/50">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full animate-pulse" />
              </Button>
              <Button variant="ghost" size="sm" className="hover:bg-ayur-green-light/50">
                <User className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="hover:bg-ayur-green-light/50">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            {renderPage()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
