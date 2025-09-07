import { useState } from "react"
import { Navigate } from "react-router-dom"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Dashboard } from "@/pages/Dashboard"
import { Patients } from "@/pages/Patients"
import { Schedule } from "@/pages/Schedule"
import { Feedback } from "@/pages/Feedback"
import { useAuth } from "@/hooks/useAuth"
import { useNotifications } from "@/hooks/useNotifications"
import { Button } from "@/components/ui/button"
import { Bell, LogOut, User, Loader2 } from "lucide-react"
import { NotificationsPanel } from "@/components/NotificationsPanel"

const Index = () => {
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const { user, profile, loading, signOut } = useAuth()
  const { unreadCount } = useNotifications()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-orange-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'patients':
        return <Patients />
      case 'schedule':
        return <Schedule />
      case 'feedback':
        return <Feedback />
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
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative hover:bg-ayur-green-light/50"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full animate-pulse" />
                )}
              </Button>
              <Button variant="ghost" size="sm" className="hover:bg-ayur-green-light/50">
                <User className="h-4 w-4" />
                <span className="ml-2 text-sm">{profile?.practitioner_name || 'Practitioner'}</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="hover:bg-ayur-green-light/50"
                onClick={() => signOut()}
              >
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
      
      {/* Notifications Panel */}
      <NotificationsPanel 
        isOpen={isNotificationsOpen} 
        onClose={() => setIsNotificationsOpen(false)} 
      />
    </SidebarProvider>
  );
};

export default Index;
