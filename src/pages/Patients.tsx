import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Plus, Search, Phone, Mail, Filter, Users as UsersIcon, TrendingUp, Edit, Trash2, Eye, Loader2 } from "lucide-react"
import { usePatients } from "@/hooks/usePatients"
import { PatientForm } from "@/components/PatientForm"
import { Patient } from "@/lib/supabase"
import { format } from "date-fns"

export const Patients = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const { patients, isLoading, deletePatient, isDeleting } = usePatients()

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.primary_dosha.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient)
    setIsFormOpen(true)
  }

  const handleAddPatient = () => {
    setSelectedPatient(null)
    setIsFormOpen(true)
  }

  const handleFormSuccess = () => {
    setIsFormOpen(false)
    setSelectedPatient(null)
  }

  const handleDeletePatient = async (id: string) => {
    try {
      await deletePatient(id)
    } catch (error) {
      // Error is handled in the hook
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-ayur-green-light text-ayur-green border-ayur-green/30'
      case 'inactive': return 'bg-gray-100 text-gray-600 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-subtle">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-ayur-green" />
          <p className="text-muted-foreground">Loading patients...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-8 p-8 bg-gradient-subtle animate-fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-display font-bold text-ayur-green mb-2">Patient Management</h1>
            <p className="text-lg text-muted-foreground">Comprehensive patient records and health tracking</p>
          </div>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-gradient-ayur hover:shadow-ayur text-white font-semibold transition-all duration-300 hover:scale-105"
                onClick={handleAddPatient}
              >
                <Plus className="mr-2 h-5 w-5" />
                Add New Patient
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <PatientForm 
                patient={selectedPatient || undefined}
                onSuccess={handleFormSuccess}
                onCancel={() => setIsFormOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="shadow-elegant hover:shadow-ayur transition-all duration-300 border-border/40">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Total Patients</p>
                  <p className="text-3xl font-display font-bold text-ayur-green">{patients.length}</p>
                </div>
                <UsersIcon className="h-8 w-8 text-ayur-green" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-elegant hover:shadow-ayur transition-all duration-300 border-border/40">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Active Patients</p>
                  <p className="text-3xl font-display font-bold text-ayur-green">
                    {patients.filter(p => p.status === 'active').length}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-ayur-green" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-elegant hover:shadow-ayur transition-all duration-300 border-border/40">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">New This Month</p>
                  <p className="text-3xl font-display font-bold text-ayur-green">
                    {patients.filter(p => {
                      const createdDate = new Date(p.created_at)
                      const now = new Date()
                      return createdDate.getMonth() === now.getMonth() && 
                             createdDate.getFullYear() === now.getFullYear()
                    }).length}
                  </p>
                </div>
                <div className="h-8 w-8 bg-gradient-ayur rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">★</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Patient Directory */}
        <Card className="shadow-elegant hover:shadow-ayur transition-all duration-300 border-border/40 bg-gradient-to-br from-card to-background">
          <CardHeader className="border-b border-border/20 bg-gradient-ayur text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white font-display text-xl">Patient Directory</CardTitle>
                <CardDescription className="text-white/80 mt-1">
                  Comprehensive patient health records
                </CardDescription>
              </div>
              <Filter className="h-5 w-5 text-white/80" />
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search patients by name, email, or dosha..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 border-border/40 bg-background/50 focus:bg-background transition-all duration-200"
                />
              </div>
              <Button variant="outline" className="h-12 px-6 border-ayur-green/30 hover:bg-ayur-green-light/20 hover:border-ayur-green">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>

            <div className="rounded-xl border border-border/40 overflow-hidden bg-background/50">
              <Table>
                <TableHeader>
                  <TableRow className="bg-ayur-green-light/10 hover:bg-ayur-green-light/20 border-border/20">
                    <TableHead className="font-semibold text-ayur-green">Patient Information</TableHead>
                    <TableHead className="font-semibold text-ayur-green">Contact Details</TableHead>
                    <TableHead className="font-semibold text-ayur-green">Health Profile</TableHead>
                    <TableHead className="font-semibold text-ayur-green">Created</TableHead>
                    <TableHead className="font-semibold text-ayur-green">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.map((patient, index) => (
                    <TableRow 
                      key={patient.id} 
                      className="hover:bg-ayur-green-light/5 transition-all duration-200 border-border/20"
                    >
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full bg-gradient-ayur flex items-center justify-center text-white font-semibold animate-scale-in`} style={{ animationDelay: `${index * 100}ms` }}>
                            {patient.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">{patient.name}</div>
                            <Badge className={`${getStatusColor(patient.status)} text-xs font-medium border`}>
                              {patient.status}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Mail className="mr-2 h-3 w-3 text-ayur-green" />
                            {patient.email}
                          </div>
                          {patient.phone && (
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Phone className="mr-2 h-3 w-3 text-ayur-green" />
                              {patient.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge className={`${getDoshaColor(patient.primary_dosha)} font-semibold border`}>
                            {patient.primary_dosha} Dosha
                          </Badge>
                          {patient.secondary_dosha && (
                            <Badge variant="outline" className="text-xs">
                              {patient.secondary_dosha}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium text-foreground">
                          {format(new Date(patient.created_at), 'MMM dd, yyyy')}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="hover:bg-ayur-green-light/20 hover:border-ayur-green hover:text-ayur-green transition-all duration-200"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="hover:bg-ayur-sand-light/20 hover:border-ayur-sand hover:text-ayur-sand transition-all duration-200"
                            onClick={() => handleEditPatient(patient)}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="hover:bg-destructive/10 hover:border-destructive hover:text-destructive transition-all duration-200"
                                disabled={isDeleting}
                              >
                                {isDeleting ? (
                                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                ) : (
                                  <Trash2 className="h-3 w-3 mr-1" />
                                )}
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the patient record
                                  and remove all associated data.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeletePatient(patient.id)}
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  Delete Patient
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredPatients.length === 0 && (
              <div className="text-center py-12">
                <UsersIcon className="mx-auto h-16 w-16 text-muted-foreground/30 mb-4" />
                <p className="text-lg font-medium text-muted-foreground">
                  {patients.length === 0 ? 'No patients yet' : 'No patients found'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {patients.length === 0 
                    ? 'Add your first patient to get started' 
                    : 'Try adjusting your search criteria'
                  }
                </p>
                {patients.length === 0 && (
                  <Button 
                    className="mt-4 bg-gradient-ayur hover:shadow-ayur text-white"
                    onClick={handleAddPatient}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add First Patient
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}