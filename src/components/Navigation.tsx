import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar, Users, Home, MessageSquare, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavigationProps {
  currentPage: string
  onNavigate: (page: string) => void
}

export const Navigation = ({ currentPage, onNavigate }: NavigationProps) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare },
  ]

  return (
    <Card className="w-64 h-screen p-4 rounded-none border-r">
      <div className="flex flex-col h-full">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-primary">AyurSutra</h2>
          <p className="text-sm text-muted-foreground">Practitioner Dashboard</p>
        </div>
        
        <nav className="flex-1 space-y-2">
          {navItems.map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant={currentPage === id ? "default" : "ghost"}
              className={cn(
                "w-full justify-start",
                currentPage === id && "bg-primary text-primary-foreground"
              )}
              onClick={() => onNavigate(id)}
            >
              <Icon className="mr-2 h-4 w-4" />
              {label}
            </Button>
          ))}
        </nav>
        
        <Button variant="ghost" className="justify-start mt-auto">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </Card>
  )
}