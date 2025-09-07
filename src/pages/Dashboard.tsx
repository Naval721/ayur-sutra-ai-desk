import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Users, Calendar, TrendingUp, Activity, AlertCircle, Clock, Star, Heart, Plus, Loader2 } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts"
import { usePatients } from "@/hooks/usePatients"
import { useTherapies } from "@/hooks/useTherapies"
import { useFeedback } from "@/hooks/useFeedback"
import { useAuth } from "@/hooks/useAuth"
import { FeedbackForm } from "@/components/FeedbackForm"
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isToday, isThisWeek } from "date-fns"

export const Dashboard = () => {
  const [isFeedbackFormOpen, setIsFeedbackFormOpen] = useState(false)
  const { profile } = useAuth()
  const { patients, isLoading: patientsLoading } = usePatients()
  const { therapies, isLoading: therapiesLoading } = useTherapies()
  const { feedback, isLoading: feedbackLoading } = useFeedback()

  const isLoading = patientsLoading || therapiesLoading || feedbackLoading

  // Calculate statistics
  const activePatients = patients.filter(p => p.status === 'active').length
  const todayTherapies = therapies.filter(t => t.scheduled_date === format(new Date(), 'yyyy-MM-dd'))
  const completedTherapies = therapies.filter(t => t.status === 'completed').length
  const thisWeekTherapies = therapies.filter(t => {
    const therapyDate = new Date(t.scheduled_date)
    return isThisWeek(therapyDate)
  })

  // Calculate average rating
  const averageRating = feedback.length > 0 
    ? feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length 
    : 0

  // Dosha distribution
  const doshaDistribution = patients.reduce((acc, patient) => {
    acc[patient.primary_dosha] = (acc[patient.primary_dosha] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const doshaData = Object.entries(doshaDistribution).map(([dosha, count]) => ({
    name: dosha,
    value: count,
    color: dosha === 'Vata' ? '#3B82F6' : dosha === 'Pitta' ? '#EF4444' : '#10B981'
  }))

  // Weekly therapy data
  const weekDays = eachDayOfInterval({
    start: startOfWeek(new Date()),
    end: endOfWeek(new Date())
  })

  const weeklyData = weekDays.map(day => {
    const dayStr = format(day, 'yyyy-MM-dd')
    const dayTherapies = therapies.filter(t => t.scheduled_date === dayStr)
    return {
      day: format(day, 'EEE'),
      date: format(day, 'MMM dd'),
      scheduled: dayTherapies.filter(t => t.status === 'scheduled').length,
      completed: dayTherapies.filter(t => t.status === 'completed').length,
    }
  })

  // Recent feedback
  const recentFeedback = feedback.slice(0, 3)

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-subtle">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-ayur-green" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-8 p-8 bg-gradient-subtle animate-fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-ayur-green mb-2">
            Welcome back, {profile?.practitioner_name || 'Practitioner'}!
          </h1>
          <p className="text-lg text-muted-foreground">
            Here's what's happening in your practice today
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="shadow-elegant hover:shadow-ayur transition-all duration-300 border-border/40">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Active Patients</p>
                  <p className="text-3xl font-display font-bold text-ayur-green">{activePatients}</p>
                  <p className="text-xs text-muted-foreground">Total: {patients.length}</p>
                </div>
                <Users className="h-8 w-8 text-ayur-green" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-elegant hover:shadow-ayur transition-all duration-300 border-border/40">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Today's Sessions</p>
                  <p className="text-3xl font-display font-bold text-ayur-green">{todayTherapies.length}</p>
                  <p className="text-xs text-muted-foreground">This week: {thisWeekTherapies.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-ayur-green" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-elegant hover:shadow-ayur transition-all duration-300 border-border/40">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Completed Sessions</p>
                  <p className="text-3xl font-display font-bold text-ayur-green">{completedTherapies}</p>
                  <p className="text-xs text-muted-foreground">Total: {therapies.length}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-ayur-green" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-elegant hover:shadow-ayur transition-all duration-300 border-border/40">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Avg. Rating</p>
                  <p className="text-3xl font-display font-bold text-ayur-green">
                    {averageRating > 0 ? averageRating.toFixed(1) : 'N/A'}
                  </p>
                  <p className="text-xs text-muted-foreground">{feedback.length} reviews</p>
                </div>
                <Star className="h-8 w-8 text-ayur-green" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Weekly Schedule Chart */}
          <Card className="shadow-elegant hover:shadow-ayur transition-all duration-300 border-border/40 bg-gradient-to-br from-card to-background">
            <CardHeader className="border-b border-border/20 bg-gradient-ayur text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <Calendar className="h-5 w-5" />
                    <span className="font-display">This Week's Schedule</span>
                  </CardTitle>
                  <CardDescription className="text-white/80 mt-1">
                    Therapy sessions overview
                  </CardDescription>
                </div>
                <Activity className="h-6 w-6 text-white/80" />
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="scheduled" fill="#10B981" name="Scheduled" />
                  <Bar dataKey="completed" fill="#059669" name="Completed" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Dosha Distribution */}
          <Card className="shadow-elegant hover:shadow-ayur transition-all duration-300 border-border/40 bg-gradient-to-br from-card to-background">
            <CardHeader className="border-b border-border/20 bg-gradient-warm text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <Heart className="h-5 w-5" />
                    <span className="font-display">Patient Dosha Distribution</span>
                  </CardTitle>
                  <CardDescription className="text-white/80 mt-1">
                    Primary dosha analysis
                  </CardDescription>
                </div>
                <TrendingUp className="h-6 w-6 text-white/80" />
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {doshaData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={doshaData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {doshaData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px]">
                  <p className="text-muted-foreground">No patient data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Today's Schedule & Recent Feedback */}
        <div className="grid gap-8 lg:grid-cols-2 mt-8">
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
                    {format(new Date(), 'EEEE, MMMM dd, yyyy')}
                  </CardDescription>
                </div>
                <Calendar className="h-6 w-6 text-white/80" />
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {todayTherapies.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground">No sessions scheduled for today</p>
                  </div>
                ) : (
                  todayTherapies.map((therapy, index) => (
                    <div
                      key={therapy.id}
                      className="flex items-center justify-between p-4 border border-border/40 rounded-xl bg-background/50 hover:bg-background/80 transition-all duration-200"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{therapy.name}</h4>
                        <p className="text-sm text-muted-foreground">{therapy.patients?.name}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {therapy.scheduled_time}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {therapy.duration_minutes} min
                          </span>
                        </div>
                      </div>
                      <Badge className={`${
                        therapy.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        therapy.status === 'completed' ? 'bg-green-100 text-green-800' :
                        therapy.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {therapy.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Feedback */}
          <Card className="shadow-elegant hover:shadow-ayur transition-all duration-300 border-border/40 bg-gradient-to-br from-card to-background">
            <CardHeader className="border-b border-border/20 bg-gradient-warm text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <Star className="h-5 w-5" />
                    <span className="font-display">Recent Feedback</span>
                  </CardTitle>
                  <CardDescription className="text-white/80 mt-1">
                    Latest patient reviews
                  </CardDescription>
                </div>
                <Dialog open={isFeedbackFormOpen} onOpenChange={setIsFeedbackFormOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline" className="text-white border-white/20 hover:bg-white/10">
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <FeedbackForm onSuccess={() => setIsFeedbackFormOpen(false)} />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {recentFeedback.length === 0 ? (
                  <div className="text-center py-8">
                    <Star className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground">No feedback yet</p>
                    <p className="text-sm text-muted-foreground">Patient feedback will appear here</p>
                  </div>
                ) : (
                  recentFeedback.map((fb, index) => (
                    <div
                      key={fb.id}
                      className="p-4 border border-border/40 rounded-xl bg-background/50 hover:bg-background/80 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < fb.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(fb.created_at), 'MMM dd')}
                        </span>
                      </div>
                      <p className="text-sm text-foreground mb-2">{fb.comment}</p>
                      <div className="flex items-center space-x-2">
                        {fb.wasFlagged && (
                          <Badge variant="destructive" className="text-xs">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Flagged
                          </Badge>
                        )}
                        {fb.followUpRequired && (
                          <Badge variant="secondary" className="text-xs">
                            Follow-up needed
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}