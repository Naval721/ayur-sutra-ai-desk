import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatsCard } from "@/components/StatsCard"
import { CalendarDays, Users, AlertCircle, TrendingUp, Sparkles, Clock, Activity } from "lucide-react"

export const Dashboard = () => {
  return (
    <div className="flex-1 space-y-8 p-8 bg-gradient-subtle animate-fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-ayur-green mb-2">Practice Overview</h1>
          <p className="text-lg text-muted-foreground">Your AyurSutra practice insights and today's activities</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatsCard
            title="Active Patients"
            value="24"
            description="+2 from last month"
            icon={Users}
            variant="success"
          />
          
          <StatsCard
            title="Today's Therapies"
            value="8"
            description="6 completed, 2 pending"
            icon={CalendarDays}
            variant="default"
          />
          
          <StatsCard
            title="Pending Alerts"
            value="2"
            description="Requires attention"
            icon={AlertCircle}
            variant="danger"
          />
          
          <StatsCard
            title="Patient Satisfaction"
            value="4.8"
            description="Average rating this month"
            icon={TrendingUp}
            variant="success"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Today's Schedule */}
          <Card className="shadow-elegant hover:shadow-ayur transition-all duration-300 border-border/40 bg-gradient-to-br from-card to-background">
            <CardHeader className="border-b border-border/20 bg-gradient-ayur text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <Clock className="h-5 w-5" />
                    <span className="font-display">Today's Schedule</span>
                  </CardTitle>
                  <CardDescription className="text-white/80 mt-1">
                    {new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </CardDescription>
                </div>
                <Sparkles className="h-6 w-6 text-white/80 animate-float" />
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {[
                { time: "9:00 AM", patient: "Priya Sharma", therapy: "Abhyanga", dosha: "Vata", status: "upcoming" },
                { time: "10:30 AM", patient: "Raj Patel", therapy: "Shirodhara", dosha: "Pitta", status: "completed" },
                { time: "2:00 PM", patient: "Meera Singh", therapy: "Udvartana", dosha: "Kapha", status: "upcoming" },
              ].map((appointment, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-border/30 rounded-xl bg-gradient-to-r from-background to-ayur-green-light/10 hover:shadow-warm transition-all duration-200">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm font-semibold text-ayur-green bg-ayur-green-light/20 px-3 py-1 rounded-lg">
                      {appointment.time}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{appointment.patient}</div>
                      <div className="text-sm text-muted-foreground font-medium">{appointment.therapy}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge 
                      variant="secondary" 
                      className={`
                        ${appointment.dosha === 'Vata' ? 'bg-blue-100 text-blue-800 border-blue-200' : ''}
                        ${appointment.dosha === 'Pitta' ? 'bg-red-100 text-red-800 border-red-200' : ''}
                        ${appointment.dosha === 'Kapha' ? 'bg-green-100 text-green-800 border-green-200' : ''}
                        font-semibold border
                      `}
                    >
                      {appointment.dosha}
                    </Badge>
                    <div className={`w-2 h-2 rounded-full ${appointment.status === 'completed' ? 'bg-ayur-green' : 'bg-ayur-sand animate-pulse'}`} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Health Alerts */}
          <Card className="shadow-elegant hover:shadow-ayur transition-all duration-300 border-border/40 bg-gradient-to-br from-card to-background">
            <CardHeader className="border-b border-border/20 bg-gradient-warm text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <Activity className="h-5 w-5" />
                    <span className="font-display">Health Alerts</span>
                  </CardTitle>
                  <CardDescription className="text-white/80 mt-1">
                    Patient monitoring and alerts
                  </CardDescription>
                </div>
                <AlertCircle className="h-6 w-6 text-white/80 animate-pulse" />
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 border-l-4 border-l-destructive bg-gradient-to-r from-destructive/5 to-background rounded-r-xl shadow-sm">
                  <AlertCircle className="h-5 w-5 text-destructive mt-0.5 animate-pulse" />
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-destructive mb-1">High Risk Alert</div>
                    <div className="text-sm text-foreground/80 leading-relaxed mb-2">
                      Patient reported severe discomfort after Panchakarma session. Requires immediate attention.
                    </div>
                    <div className="text-xs text-muted-foreground font-medium">2 hours ago • Requires immediate attention</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 p-4 border-l-4 border-l-ayur-sand bg-gradient-to-r from-ayur-sand-light/20 to-background rounded-r-xl shadow-sm">
                  <AlertCircle className="h-5 w-5 text-ayur-sand mt-0.5" />
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-ayur-sand mb-1">Moderate Risk Alert</div>
                    <div className="text-sm text-foreground/80 leading-relaxed mb-2">
                      Unusual symptoms pattern detected in post-therapy feedback
                    </div>
                    <div className="text-xs text-muted-foreground font-medium">1 day ago • Follow-up recommended</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 p-4 border-l-4 border-l-ayur-green bg-gradient-to-r from-ayur-green-light/20 to-background rounded-r-xl shadow-sm">
                  <TrendingUp className="h-5 w-5 text-ayur-green mt-0.5" />
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-ayur-green mb-1">Positive Trend</div>
                    <div className="text-sm text-foreground/80 leading-relaxed mb-2">
                      Patient satisfaction scores increased by 15% this week
                    </div>
                    <div className="text-xs text-muted-foreground font-medium">3 days ago • Great progress!</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}