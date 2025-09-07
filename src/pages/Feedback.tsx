import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Plus, Star, AlertCircle, MessageSquare, Filter, Search, Loader2, Edit, Trash2 } from "lucide-react"
import { useFeedback } from "@/hooks/useFeedback"
import { FeedbackForm } from "@/components/FeedbackForm"
import { format } from "date-fns"

export const Feedback = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "flagged" | "followup">("all")
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const { feedback, isLoading, updateFeedback, isUpdating } = useFeedback()

  const filteredFeedback = feedback.filter(fb => {
    const matchesSearch = fb.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fb.therapies?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fb.patients?.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterStatus === "all" || 
                         (filterStatus === "flagged" && fb.was_flagged) ||
                         (filterStatus === "followup" && fb.follow_up_required)
    
    return matchesSearch && matchesFilter
  })

  const handleEditFeedback = (fb: any) => {
    setSelectedFeedback(fb)
    setIsFormOpen(true)
  }

  const handleAddFeedback = () => {
    setSelectedFeedback(null)
    setIsFormOpen(true)
  }

  const handleFormSuccess = () => {
    setIsFormOpen(false)
    setSelectedFeedback(null)
  }

  const handleToggleFlag = async (id: string, currentFlag: boolean) => {
    try {
      await updateFeedback({ id, wasFlagged: !currentFlag })
    } catch (error) {
      // Error is handled in the hook
    }
  }

  const handleToggleFollowUp = async (id: string, currentFollowUp: boolean) => {
    try {
      await updateFeedback({ id, followUpRequired: !currentFollowUp })
    } catch (error) {
      // Error is handled in the hook
    }
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600'
    if (rating >= 3) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-subtle">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-ayur-green" />
          <p className="text-muted-foreground">Loading feedback...</p>
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
            <h1 className="text-4xl font-display font-bold text-ayur-green mb-2">Patient Feedback</h1>
            <p className="text-lg text-muted-foreground">Manage patient reviews and feedback</p>
          </div>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-gradient-ayur hover:shadow-ayur text-white font-semibold transition-all duration-300 hover:scale-105"
                onClick={handleAddFeedback}
              >
                <Plus className="mr-2 h-5 w-5" />
                Add Feedback
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <FeedbackForm 
                onSuccess={handleFormSuccess}
                onCancel={() => setIsFormOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card className="shadow-elegant hover:shadow-ayur transition-all duration-300 border-border/40">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Total Reviews</p>
                  <p className="text-3xl font-display font-bold text-ayur-green">{feedback.length}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-ayur-green" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-elegant hover:shadow-ayur transition-all duration-300 border-border/40">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Average Rating</p>
                  <p className="text-3xl font-display font-bold text-ayur-green">
                    {feedback.length > 0 
                      ? (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1)
                      : 'N/A'
                    }
                  </p>
                </div>
                <Star className="h-8 w-8 text-ayur-green" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-elegant hover:shadow-ayur transition-all duration-300 border-border/40">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Flagged Reviews</p>
                  <p className="text-3xl font-display font-bold text-ayur-green">
                    {feedback.filter(f => f.was_flagged).length}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-ayur-green" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-elegant hover:shadow-ayur transition-all duration-300 border-border/40">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Follow-ups Needed</p>
                  <p className="text-3xl font-display font-bold text-ayur-green">
                    {feedback.filter(f => f.follow_up_required).length}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-ayur-green" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feedback List */}
        <Card className="shadow-elegant hover:shadow-ayur transition-all duration-300 border-border/40 bg-gradient-to-br from-card to-background">
          <CardHeader className="border-b border-border/20 bg-gradient-ayur text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white font-display text-xl">Patient Reviews</CardTitle>
                <CardDescription className="text-white/80 mt-1">
                  {filteredFeedback.length} review{filteredFeedback.length !== 1 ? 's' : ''} found
                </CardDescription>
              </div>
              <Filter className="h-5 w-5 text-white/80" />
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {/* Search and Filter */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search feedback by patient, therapy, or comment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border/40 rounded-lg bg-background/50 focus:bg-background focus:outline-none focus:ring-2 focus:ring-ayur-green/20"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-2 border border-border/40 rounded-lg bg-background/50 focus:bg-background focus:outline-none focus:ring-2 focus:ring-ayur-green/20"
              >
                <option value="all">All Reviews</option>
                <option value="flagged">Flagged</option>
                <option value="followup">Follow-up Needed</option>
              </select>
            </div>

            {/* Feedback Items */}
            <div className="space-y-4">
              {filteredFeedback.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="mx-auto h-16 w-16 text-muted-foreground/30 mb-4" />
                  <p className="text-lg font-medium text-muted-foreground">
                    {feedback.length === 0 ? 'No feedback yet' : 'No feedback found'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {feedback.length === 0 
                      ? 'Patient feedback will appear here' 
                      : 'Try adjusting your search criteria'
                    }
                  </p>
                </div>
              ) : (
                filteredFeedback.map((fb, index) => (
                  <div
                    key={fb.id}
                    className="p-6 border border-border/40 rounded-xl bg-background/50 hover:bg-background/80 transition-all duration-200 animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-foreground">{fb.therapies?.name}</h4>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < fb.rating 
                                    ? 'text-yellow-400 fill-current' 
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                            <span className={`ml-2 font-semibold ${getRatingColor(fb.rating)}`}>
                              {fb.rating}/5
                            </span>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground mb-3">
                          <p><strong>Patient:</strong> {fb.patients?.name}</p>
                          <p><strong>Date:</strong> {format(new Date(fb.created_at), 'MMM dd, yyyy')}</p>
                        </div>
                        <p className="text-foreground leading-relaxed">{fb.comment}</p>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditFeedback(fb)}
                          className="h-8 w-8 p-0 hover:bg-ayur-green-light/20"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant={fb.was_flagged ? "destructive" : "outline"}
                          size="sm"
                          onClick={() => handleToggleFlag(fb.id, fb.was_flagged)}
                          disabled={isUpdating}
                          className="text-xs"
                        >
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {fb.was_flagged ? 'Flagged' : 'Flag'}
                        </Button>
                        <Button
                          variant={fb.follow_up_required ? "secondary" : "outline"}
                          size="sm"
                          onClick={() => handleToggleFollowUp(fb.id, fb.follow_up_required)}
                          disabled={isUpdating}
                          className="text-xs"
                        >
                          {fb.follow_up_required ? 'Follow-up Needed' : 'Mark Follow-up'}
                        </Button>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(fb.created_at), 'h:mm a')}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}