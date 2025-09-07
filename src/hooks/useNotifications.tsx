import { useEffect, useState } from 'react'
import { supabase, subscribe } from '@/lib/supabase'
import { useAuth } from './useAuth'
import { toast } from 'sonner'

export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  timestamp: Date
  read: boolean
}

export const useNotifications = () => {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!user) return

    // Subscribe to patient changes
    const patientSubscription = subscribe.patients(user.id, (payload) => {
      if (payload.eventType === 'INSERT') {
        const notification: Notification = {
          id: `patient-${payload.new.id}`,
          type: 'success',
          title: 'New Patient Added',
          message: `${payload.new.name} has been added to your practice`,
          timestamp: new Date(),
          read: false
        }
        addNotification(notification)
        toast.success('New patient added!', {
          description: `${payload.new.name} has been added to your practice`
        })
      } else if (payload.eventType === 'UPDATE') {
        const notification: Notification = {
          id: `patient-update-${payload.new.id}`,
          type: 'info',
          title: 'Patient Updated',
          message: `${payload.new.name}'s information has been updated`,
          timestamp: new Date(),
          read: false
        }
        addNotification(notification)
      }
    })

    // Subscribe to therapy changes
    const therapySubscription = subscribe.therapies(user.id, (payload) => {
      if (payload.eventType === 'INSERT') {
        const notification: Notification = {
          id: `therapy-${payload.new.id}`,
          type: 'info',
          title: 'New Therapy Scheduled',
          message: `${payload.new.name} has been scheduled`,
          timestamp: new Date(),
          read: false
        }
        addNotification(notification)
        toast.info('New therapy scheduled!', {
          description: `${payload.new.name} has been scheduled`
        })
      } else if (payload.eventType === 'UPDATE') {
        if (payload.new.status === 'completed') {
          const notification: Notification = {
            id: `therapy-completed-${payload.new.id}`,
            type: 'success',
            title: 'Therapy Completed',
            message: `${payload.new.name} has been completed`,
            timestamp: new Date(),
            read: false
          }
          addNotification(notification)
          toast.success('Therapy completed!', {
            description: `${payload.new.name} has been completed`
          })
        } else if (payload.new.status === 'cancelled') {
          const notification: Notification = {
            id: `therapy-cancelled-${payload.new.id}`,
            type: 'warning',
            title: 'Therapy Cancelled',
            message: `${payload.new.name} has been cancelled`,
            timestamp: new Date(),
            read: false
          }
          addNotification(notification)
          toast.warning('Therapy cancelled', {
            description: `${payload.new.name} has been cancelled`
          })
        }
      }
    })

    return () => {
      patientSubscription.unsubscribe()
      therapySubscription.unsubscribe()
    }
  }, [user])

  const addNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev.slice(0, 49)]) // Keep last 50 notifications
    setUnreadCount(prev => prev + 1)
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
    setUnreadCount(0)
  }

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const clearAllNotifications = () => {
    setNotifications([])
    setUnreadCount(0)
  }

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
    addNotification
  }
}