import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, Sparkles, Plus, Filter } from "lucide-react"

export const Schedule = () => {
  const [selectedTherapy, setSelectedTherapy] = useState("")
  const [selectedPatient, setSelectedPatient] = useState("")
  
  const mockTherapies = [
    "Abhyanga", "Shirodhara", "Udvartana", "Panchakarma", 
    "Nasya", "Basti", "Virechana", "Raktamokshana"
  ]
  
  const mockPatients = [
    { id: "1", name: "Priya Sharma", dosha: "Vata" },
    { id: "2", name: "Raj Patel", dosha: "Pitta" },
    { id: "3", name: "Meera Singh", dosha: "Kapha" },
  ]

  const mockSchedule = [
    {
      id: "1",
      time: "9:00 AM",
      patient: "Priya Sharma",
      therapy: "Abhyanga",
      dosha: "Vata",
      status: "scheduled"
    },
    {
      id: "2", 
      time: "10:30 AM",
      patient: "Raj Patel",
      therapy: "Shirodhara",
      dosha: "Pitta",
      status: "completed"
    },
    {
      id: "3",
      time: "2:00 PM", 
      patient: "Meera Singh",
      therapy: "Udvartana",
      dosha: "Kapha",
      status: "scheduled"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-ayur-green-light text-ayur-green border-ayur-green/30'
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getDoshaColor = (dosha: string) => {
    switch (dosha) {
      case 'Vata': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Pitta': return 'bg-red-100 text-red-800 border-red-200'
      case 'Kapha': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const handleGeneratePrecautions = () => {
    // This will call the Supabase Edge Function to generate AI precautions
    console.log("Generating AI precautions for therapy:", selectedTherapy)
  }

  return (
    <div className="flex-1 space-y-8 p-8 bg-gradient-subtle animate-fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-ayur-green mb-2">Therapy Scheduler</h1>
          <p className="text-lg text-muted-foreground">AI-powered therapy scheduling with personalized precautions</p>
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
                    AI-generated precautions included
                  </CardDescription>
                </div>
                <Sparkles className="h-6 w-6 text-white/80 animate-float" />
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="patient" className="text-sm font-semibold text-foreground">Select Patient</Label>
                <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                  <SelectTrigger className="h-12 border-border/40 bg-background/50 focus:bg-background transition-all duration-200">
                    <SelectValue placeholder="Choose patient for therapy" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border/40">
                    {mockPatients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{patient.name}</span>
                          <Badge className={`ml-2 ${getDoshaColor(patient.dosha)} font-medium border`}>
                            {patient.dosha}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="therapy" className="text-sm font-semibold text-foreground">Therapy Type</Label>
                <Select value={selectedTherapy} onValueChange={setSelectedTherapy}>
                  <SelectTrigger className="h-12 border-border/40 bg-background/50 focus:bg-background transition-all duration-200">
                    <SelectValue placeholder="Select Ayurvedic therapy" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border/40">
                    {mockTherapies.map((therapy) => (
                      <SelectItem key={therapy} value={therapy}>
                        {therapy}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-sm font-semibold text-foreground">Date</Label>
                  <Input 
                    type="date" 
                    className="h-12 border-border/40 bg-background/50 focus:bg-background transition-all duration-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time" className="text-sm font-semibold text-foreground">Time</Label>
                  <Input 
                    type="time" 
                    className="h-12 border-border/40 bg-background/50 focus:bg-background transition-all duration-200"
                  />
                </div>
              </div>

              <Button 
                onClick={handleGeneratePrecautions}
                className="w-full h-12 bg-gradient-ayur hover:shadow-ayur text-white font-semibold transition-all duration-300 hover:scale-105"
                disabled={!selectedTherapy || !selectedPatient}
              >
                <Sparkles className="mr-2 h-5 w-5 animate-pulse" />
                Generate AI Precautions & Schedule
              </Button>

              {selectedTherapy && selectedPatient && (
                <div className="p-4 bg-gradient-warm/10 border border-ayur-sand/30 rounded-xl animate-fade-in">
                  <div className="flex items-center space-x-2 text-ayur-earth font-semibold mb-2">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-sm">AI Precaution Preview</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    AI will generate personalized pre and post-therapy precautions based on the patient's Dosha and selected therapy.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Today's Schedule */}
          <Card className="shadow-elegant hover:shadow-ayur transition-all duration-300 border-border/40 bg-gradient-to-br from-card to-background">
            <CardHeader className="border-b border-border/20 bg-gradient-warm text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <Clock className="h-5 w-5" />
                    <span className="font-display">Today's Schedule</span>
                  </CardTitle>
                  <CardDescription className="text-white/80 mt-1">
                    {new Date().toLocaleDateString('en-IN', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </CardDescription>
                </div>
                <Calendar className="h-6 w-6 text-white/80" />
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {mockSchedule.map((appointment, index) => (
                <div key={appointment.id} className="group p-4 border border-border/30 rounded-xl bg-gradient-to-r from-background to-ayur-green-light/5 hover:shadow-warm hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-sm font-bold text-ayur-green bg-ayur-green-light/20 px-4 py-2 rounded-lg border border-ayur-green/20">
                        {appointment.time}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground group-hover:text-ayur-green transition-colors">
                          {appointment.patient}
                        </div>
                        <div className="text-sm text-muted-foreground font-medium">
                          {appointment.therapy} Therapy
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={`${getDoshaColor(appointment.dosha)} font-semibold border`}>
                        {appointment.dosha}
                      </Badge>
                      <Badge className={`${getStatusColor(appointment.status)} font-semibold border`}>
                        {appointment.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
              
              {mockSchedule.length === 0 && (
                <div className="text-center py-12">
                  <Calendar className="mx-auto h-16 w-16 text-muted-foreground/30 mb-4" />
                  <p className="text-lg font-medium text-muted-foreground">No therapies scheduled</p>
                  <p className="text-sm text-muted-foreground">Schedule your first therapy session above</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}