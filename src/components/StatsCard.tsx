import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  variant?: "default" | "success" | "warning" | "danger"
  className?: string
}

export const StatsCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  variant = "default",
  className 
}: StatsCardProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return "border-ayur-green/30 bg-gradient-to-br from-ayur-green-light/20 to-background shadow-ayur"
      case "warning":
        return "border-ayur-sand/30 bg-gradient-to-br from-ayur-sand-light/20 to-background shadow-warm"
      case "danger":
        return "border-destructive/30 bg-gradient-to-br from-destructive/5 to-background"
      default:
        return "border-border/40 bg-gradient-to-br from-card to-background shadow-elegant hover:shadow-ayur transition-all duration-300"
    }
  }

  const getIconStyles = () => {
    switch (variant) {
      case "success":
        return "text-ayur-green"
      case "warning":
        return "text-ayur-sand"
      case "danger":
        return "text-destructive"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <Card className={cn(
      "animate-scale-in hover:scale-105 transition-all duration-300 cursor-pointer",
      getVariantStyles(),
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-semibold text-foreground/80">{title}</CardTitle>
        <Icon className={cn("h-5 w-5", getIconStyles())} />
      </CardHeader>
      <CardContent>
        <div className={cn(
          "text-3xl font-bold font-display",
          variant === "danger" ? "text-destructive" : "text-foreground"
        )}>
          {value}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1 font-medium">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}