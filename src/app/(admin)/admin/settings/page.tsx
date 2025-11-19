import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Settings as SettingsIcon, Store, Mail, Shield } from 'lucide-react'

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage store settings and configurations
        </p>
      </div>

      {/* Store Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            <CardTitle>Store Settings</CardTitle>
          </div>
          <CardDescription>
            General store information and configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="font-medium mb-2">Store Name</p>
            <p className="text-sm text-muted-foreground">E-Commerce Platform</p>
          </div>
          <div>
            <p className="font-medium mb-2">Store Currency</p>
            <p className="text-sm text-muted-foreground">PKR - Pakistani Rupee</p>
          </div>
          <Button variant="outline">Edit Store Settings</Button>
        </CardContent>
      </Card>

      {/* Email Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            <CardTitle>Email Settings</CardTitle>
          </div>
          <CardDescription>
            Configure email notifications and templates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Order Confirmation Emails</p>
              <p className="text-sm text-muted-foreground">
                Send emails when orders are placed
              </p>
            </div>
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300"
              defaultChecked
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Shipping Notification Emails</p>
              <p className="text-sm text-muted-foreground">
                Notify customers when orders are shipped
              </p>
            </div>
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300"
              defaultChecked
            />
          </div>
          <Button variant="outline">Configure Email Templates</Button>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <CardTitle>Security Settings</CardTitle>
          </div>
          <CardDescription>
            Manage security and access control
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="font-medium mb-2">Admin Access</p>
            <p className="text-sm text-muted-foreground mb-4">
              Manage admin users and permissions
            </p>
            <Button variant="outline">Manage Admins</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
