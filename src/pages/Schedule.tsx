import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Plus, Calendar, Clock, User, Sparkles, Edit, Trash2, Loader2, CheckCircle, XCircle } from "lucide-react"
import { useTherapies } from "@/hooks/useTherapies"
import { TherapyForm } from "@/components/TherapyForm"
import { Therapy } from "@/lib/supabase"
import { format, isToday, isTomorrow, isYesterday } from "date-fns"

export const Schedule = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedTherapy, setSelectedTherapy] = useState<(Therapy & { patients: any }) | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const { therapies, isLoading, deleteTherapy, isDeleting } = useTherapies()

  const todayTherapies = therapies.filter(therapy => 
    therapy.scheduled_date === selectedDate
  )

  const handleEditTherapy = (therapy: Therapy & { patients: any }) => {
    setSelectedTherapy(therapy)
    setIsFormOpen(true)
  }

  const handleAddTherapy = () => {
    setSelectedTherapy(null)
    setIsFormOpen(true)
  }

  const handleFormSuccess = () => {
    setIsFormOpen(false)
    setSelectedTherapy(null)
  }

  const handleDeleteTherapy = async (id: string) => {
    try {
      await deleteTherapy(id)
    } catch (error) {
      // Error is handled in the hook
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'in_progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'cancelled': return <XCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getDateLabel = (date: string) => {
    if (isToday(new Date(date))) return 'Today'
    if (isTomorrow(new Date(date))) return 'Tomorrow'
    if (isYesterday(new Date(date))) return 'Yesterday'
    return format(new Date(date), 'EEEE, MMM dd')
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-subtle">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-ayur-green" />
          <p className="text-muted-foreground">Loading schedule...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-8 p-8 bg-gradient-subtle animate-fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-ayur-green mb-2">Therapy Scheduler</h1>
          <p className="text-lg text-muted-foreground">Intelligent therapy scheduling with personalized precautions</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Scheduling Form */}
          <Card className="shadow-elegant hover:shadow-ayur transition-all duration-300 border-border/40 bg-gradient-to-br from-card to-background">
            <CardHeader className="border-b border-border/20 bg-gradient-ayur text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <Plus className="h-5 w-5" />
                    <span className="font-display">Schedule New Therapy</span>
                  </CardTitle>
                  <CardDescription className="text-white/80 mt-1">
                    Personalized precautions included
                  </CardDescription>
                </div>
                <Sparkles className="h-6 w-6 text-white/80 animate-float" />
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <Calendar className="h-16 w-16 text-ayur-green mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Ready to Schedule?</h3>
                <p className="text-muted-foreground mb-6">
                  Create a new therapy session with personalized precautions based on patient's dosha.
                </p>
                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      className="bg-gradient-ayur hover:shadow-ayur text-white font-semibold transition-all duration-300 hover:scale-105"
                      onClick={handleAddTherapy}
                    >
                      <Plus className="mr-2 h-5 w-5" />
                      Schedule New Therapy
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <TherapyForm 
                      therapy={selectedTherapy || undefined}
                      onSuccess={handleFormSuccess}
                      onCancel={() => setIsFormOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {/* Today's Schedule */}
          <Card className="shadow-elegant hover:shadow-ayur transition-all duration-300 border-border/40 bg-gradient-to-br from-card to-background">
            <CardHeader className="border-b border-border/20 bg-gradient-warm text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <Calendar className="h-5 w-5" />
                    <span className="font-display">{getDateLabel(selectedDate)}</span>
                  </CardTitle>
                  <CardDescription className="text-white/80 mt-1">
                    {todayTherapies.length} therapy session{todayTherapies.length !== 1 ? 's' : ''} scheduled
                  </CardDescription>
                </div>
                <div className="text-right">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="bg-white/10 border border-white/20 rounded px-3 py-1 text-white text-sm"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {todayTherapies.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground">No therapies scheduled for this date</p>
                    <p className="text-sm text-muted-foreground">Schedule a new therapy to get started</p>
                  </div>
                ) : (
                  todayTherapies.map((therapy, index) => (
                    <div
                      key={therapy.id}
                      className="p-4 border border-border/40 rounded-xl bg-background/50 hover:bg-background/80 transition-all duration-200 animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold text-foreground">{therapy.name}</h4>
                            <Badge className={`${getStatusColor(therapy.status)} font-medium border text-xs`}>
                              {getStatusIcon(therapy.status)}
                              <span className="ml-1 capitalize">{therapy.status.replace('_', ' ')}</span>
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <User className="h-3 w-3" />
                              <span>{therapy.patients?.name}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{therapy.scheduled_time}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span>{therapy.duration_minutes} min</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditTherapy(therapy)}
                            className="h-8 w-8 p-0 hover:bg-ayur-green-light/20"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                                disabled={isDeleting}
                              >
                                {isDeleting ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <Trash2 className="h-3 w-3" />
                                )}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Cancel Therapy Session?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will cancel the therapy session for {therapy.patients?.name}. 
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Keep Scheduled</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteTherapy(therapy.id)}
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  Cancel Session
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                      
                      {therapy.precautions && therapy.precautions.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-border/20">
                          <p className="text-xs font-medium text-muted-foreground mb-2">Precautions:</p>
                          <div className="flex flex-wrap gap-1">
                            {therapy.precautions.slice(0, 3).map((precaution, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {precaution}
                              </Badge>
                            ))}
                            {therapy.precautions.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{therapy.precautions.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Therapies */}
        {therapies.length > 0 && (
          <Card className="shadow-elegant hover:shadow-ayur transition-all duration-300 border-border/40 bg-gradient-to-br from-card to-background">
            <CardHeader className="border-b border-border/20 bg-gradient-ayur text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <Calendar className="h-5 w-5" />
                    <span className="font-display">Upcoming Therapies</span>
                  </CardTitle>
                  <CardDescription className="text-white/80 mt-1">
                    Next 7 days schedule overview
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {therapies
                  .filter(therapy => new Date(therapy.scheduled_date) > new Date())
                  .slice(0, 6)
                  .map((therapy, index) => (
                    <div
                      key={therapy.id}
                      className="p-4 border border-border/40 rounded-xl bg-background/50 hover:bg-background/80 transition-all duration-200 animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={`${getStatusColor(therapy.status)} font-medium border text-xs`}>
                          {getStatusIcon(therapy.status)}
                          <span className="ml-1 capitalize">{therapy.status.replace('_', ' ')}</span>
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(therapy.scheduled_date), 'MMM dd')}
                        </span>
                      </div>
                      <h4 className="font-semibold text-foreground mb-1">{therapy.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{therapy.patients?.name}</p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{therapy.scheduled_time}</span>
                        <span>•</span>
                        <span>{therapy.duration_minutes} min</span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}