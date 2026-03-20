'use client'

import { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { getNotifications, getUnreadCount, markNotificationAsRead } from '@/app/actions/notifications'
import { formatDistanceToNow } from 'date-fns'
import { useRouter } from 'next/navigation'

export function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const router = useRouter()

  const fetchNotifications = async () => {
    const data = await getNotifications()
    setNotifications(data)
    const count = await getUnreadCount()
    setUnreadCount(count)
  }

  useEffect(() => {
    fetchNotifications()
    // Optional: Realtime subscription for notifications
  }, [])

  const handleNotificationClick = async (notification: any) => {
    await markNotificationAsRead(notification.id)
    fetchNotifications()
    
    if (notification.type === 'new_match') {
      router.push(`/chat/${notification.payload.matchId}`)
    } else if (notification.type === 'new_message') {
      router.push(`/chat/${notification.payload.matchId}`)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]" variant="destructive">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-bold">Notifications</h3>
          {unreadCount > 0 && <span className="text-xs text-muted-foreground">{unreadCount} unread</span>}
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              No notifications yet
            </div>
          ) : (
            notifications.map((n) => (
              <DropdownMenuItem 
                key={n.id} 
                className={`p-4 cursor-pointer border-b last:border-0 ${!n.read ? 'bg-muted/50' : ''}`}
                onClick={() => handleNotificationClick(n)}
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {n.type === 'new_match' ? "It's a Match!" : "New Message"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {n.type === 'new_match' 
                      ? `You matched with ${n.payload.petName}` 
                      : `New message from ${n.payload.senderName}`}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                  </p>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
