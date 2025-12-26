import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, Mail, MessageSquare, Calendar } from 'lucide-react';

export default function SettingsNotifications() {
  return (
    <DashboardLayout title="Notifications" description="Manage your notification preferences">
      <div className="max-w-2xl">
        <div className="rounded-xl border border-border bg-card p-6 shadow-card space-y-6">
          {/* Email Notifications */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-foreground font-medium">
              <Mail className="h-5 w-5" />
              Email Notifications
            </div>
            
            <div className="space-y-4 pl-7">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="booking-confirm">Booking Confirmations</Label>
                  <p className="text-sm text-muted-foreground">Get notified when your booking is confirmed</p>
                </div>
                <Switch id="booking-confirm" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="booking-reminder">Booking Reminders</Label>
                  <p className="text-sm text-muted-foreground">Receive reminders before your rental starts</p>
                </div>
                <Switch id="booking-reminder" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="promotions">Promotional Offers</Label>
                  <p className="text-sm text-muted-foreground">Get updates on deals and special offers</p>
                </div>
                <Switch id="promotions" />
              </div>
            </div>
          </div>

          <div className="border-t border-border" />

          {/* SMS Notifications */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-foreground font-medium">
              <MessageSquare className="h-5 w-5" />
              SMS Notifications
            </div>
            
            <div className="space-y-4 pl-7">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sms-booking">Booking Updates</Label>
                  <p className="text-sm text-muted-foreground">Receive SMS for important booking updates</p>
                </div>
                <Switch id="sms-booking" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sms-reminder">Pickup Reminders</Label>
                  <p className="text-sm text-muted-foreground">Get SMS reminder before pickup time</p>
                </div>
                <Switch id="sms-reminder" defaultChecked />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
