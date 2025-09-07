import { NavLink, useLocation } from "react-router-dom"
import { Calendar, Users, Home, MessageSquare, Settings, Leaf, Brain } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar"

const navItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Patients", url: "/patients", icon: Users },
  { title: "Schedule", url: "/schedule", icon: Calendar },
  { title: "Feedback", url: "/feedback", icon: MessageSquare },
  { title: "AI Assistant", url: "/ai", icon: Brain },
  { title: "Settings", url: "/settings", icon: Settings },
]

interface AppSidebarProps {
  currentPage: string
  onNavigate: (page: string) => void
}

export function AppSidebar({ currentPage, onNavigate }: AppSidebarProps) {
  const { state } = useSidebar()
  const collapsed = state === "collapsed"

  const handleNavClick = (url: string) => {
    const page = url === "/" ? "dashboard" : url.slice(1)
    onNavigate(page)
  }

  const getNavCls = (itemId: string) => {
    const isActive = currentPage === itemId || (currentPage === "dashboard" && itemId === "dashboard")
    return isActive 
      ? "bg-gradient-ayur text-white shadow-ayur" 
      : "hover:bg-ayur-green-light/50 text-foreground hover:text-ayur-green transition-all duration-200"
  }

  return (
    <Sidebar className="border-r border-border/40 bg-gradient-subtle">
      <SidebarHeader className="p-6 border-b border-border/40">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-ayur rounded-xl shadow-ayur animate-float">
            <Leaf className="h-6 w-6 text-white" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-display font-bold text-ayur-green">AyurSutra</h2>
              <p className="text-xs text-muted-foreground font-medium">Practitioner Dashboard</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-ayur-green/70 uppercase tracking-wider px-2 py-4">
            {!collapsed ? "Main Navigation" : "Nav"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navItems.map((item) => {
                const itemId = item.url === "/" ? "dashboard" : item.url.slice(1)
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild
                      className={`${getNavCls(itemId)} rounded-xl h-12 font-medium`}
                    >
                      <button onClick={() => handleNavClick(item.url)} className="w-full">
                        <item.icon className={`h-5 w-5 ${collapsed ? "mx-auto" : "mr-3"}`} />
                        {!collapsed && <span className="animate-fade-in">{item.title}</span>}
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}