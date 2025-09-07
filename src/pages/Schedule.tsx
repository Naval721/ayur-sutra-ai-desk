import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, Sparkles } from "lucide-react"

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
      case 'completed': return 'bg-green-100 text-green-800'
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleGeneratePrecautions = () => {
    // This will call the Supabase Edge Function to generate AI precautions
    console.log("Generating AI precautions for therapy:", selectedTherapy)
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Therapy Schedule</h1>
        <p className="text-muted-foreground">Manage therapy sessions and generate AI-powered precautions</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Schedule New Therapy</CardTitle>
            <CardDescription>
              Book a therapy session and get AI-generated precautions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="patient">Patient</Label>
              <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                <SelectTrigger>
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {mockPatients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name} ({patient.dosha})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="therapy">Therapy Type</Label>
              <Select value={selectedTherapy} onValueChange={setSelectedTherapy}>
                <SelectTrigger>
                  <SelectValue placeholder="Select therapy" />
                </SelectTrigger>
                <SelectContent>
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
                <Label htmlFor="date">Date</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input type="time" />
              </div>
            </div>

            <Button 
              onClick={handleGeneratePrecautions}
              className="w-full bg-primary hover:bg-primary/90"
              disabled={!selectedTherapy || !selectedPatient}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Generate AI Precautions & Schedule
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>
              {new Date().toLocaleDateString('en-IN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockSchedule.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-sm font-medium">
                    <Clock className="h-4 w-4" />
                    {appointment.time}
                  </div>
                  <div>
                    <div className="font-medium">{appointment.patient}</div>
                    <div className="text-sm text-muted-foreground">{appointment.therapy}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">{appointment.dosha}</Badge>
                  <Badge className={getStatusColor(appointment.status)}>
                    {appointment.status}
                  </Badge>
                </div>
              </div>
            ))}
            
            {mockSchedule.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>No therapies scheduled for today</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}