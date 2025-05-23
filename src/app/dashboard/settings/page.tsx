
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings as SettingsIcon, Palette, Bell, Shield, KeyRound, UserCircle, Globe } from 'lucide-react';
import { ThemeToggleButton } from '@/components/ThemeToggleButton'; // Re-use if appropriate
import { useTheme } from 'next-themes';
import { Separator } from '@/components/ui/separator';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center">
          <SettingsIcon className="mr-3 h-8 w-8" /> Settings
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left column for navigation or grouped settings */}
        <div className="md:col-span-1 space-y-4">
            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle className="text-lg">Navigation</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col space-y-2">
                    <Button variant="ghost" className="justify-start"><UserCircle className="mr-2 h-5 w-5" /> Account</Button>
                    <Button variant="ghost" className="justify-start"><Shield className="mr-2 h-5 w-5" /> Security</Button>
                    <Button variant="ghost" className="justify-start"><Bell className="mr-2 h-5 w-5" /> Notifications</Button>
                    <Button variant="ghost" className="justify-start text-primary bg-muted"><Palette className="mr-2 h-5 w-5" /> Appearance</Button>
                    <Button variant="ghost" className="justify-start"><Globe className="mr-2 h-5 w-5" /> Language</Button>
                </CardContent>
            </Card>
        </div>

        {/* Right column for main settings content */}
        <div className="md:col-span-2 space-y-8">
          {/* Account Settings (links to profile) */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl flex items-center"><UserCircle className="mr-2 h-6 w-6 text-primary" />Account Settings</CardTitle>
              <CardDescription>Manage your profile information and preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-muted-foreground">Basic account details are managed in your profile.</p>
                <Button variant="outline" asChild>
                    <a href="/dashboard/profile">Go to Profile</a>
                </Button>
            </CardContent>
          </Card>
          
          {/* Security Settings */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl flex items-center"><Shield className="mr-2 h-6 w-6 text-primary" />Security</CardTitle>
              <CardDescription>Update your password, trading PIN, and two-factor authentication.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start sm:w-auto">
                <KeyRound className="mr-2 h-4 w-4" /> Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start sm:w-auto">
                <KeyRound className="mr-2 h-4 w-4" /> Change Trading PIN
              </Button>
              <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                <div>
                  <Label htmlFor="2fa-switch" className="font-medium">Two-Factor Authentication (2FA)</Label>
                  <p className="text-xs text-muted-foreground">Enhance your account security.</p>
                </div>
                <Switch id="2fa-switch" />
              </div>
            </CardContent>
          </Card>

          {/* Appearance Settings */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl flex items-center"><Palette className="mr-2 h-6 w-6 text-primary" />Appearance</CardTitle>
              <CardDescription>Customize the look and feel of the application.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                <Label htmlFor="theme-toggle" className="font-medium">Theme</Label>
                <ThemeToggleButton />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl flex items-center"><Bell className="mr-2 h-6 w-6 text-primary" />Notifications</CardTitle>
              <CardDescription>Choose how you receive updates and alerts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                <div>
                  <Label htmlFor="email-trades" className="font-medium">Email for Trades</Label>
                  <p className="text-xs text-muted-foreground">Receive an email for every trade confirmation.</p>
                </div>
                <Switch id="email-trades" defaultChecked />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                <div>
                  <Label htmlFor="email-deposits" className="font-medium">Email for Deposits/Withdrawals</Label>
                   <p className="text-xs text-muted-foreground">Get notified about fund movements.</p>
                </div>
                <Switch id="email-deposits" defaultChecked />
              </div>
               <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                <div>
                  <Label htmlFor="push-alerts" className="font-medium">Price Alerts (Push)</Label>
                  <p className="text-xs text-muted-foreground">Get push notifications for market price alerts (requires app).</p>
                </div>
                <Switch id="push-alerts" />
              </div>
            </CardContent>
          </Card>

          {/* Language Settings */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl flex items-center"><Globe className="mr-2 h-6 w-6 text-primary" />Language & Region</CardTitle>
              <CardDescription>Set your preferred language and regional settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <FormItem>
                    <Label>Language</Label>
                    <Select defaultValue="en">
                        <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="en">English (United States)</SelectItem>
                            <SelectItem value="es">Español (Spanish)</SelectItem>
                            <SelectItem value="fr">Français (French)</SelectItem>
                            <SelectItem value="de">Deutsch (German)</SelectItem>
                        </SelectContent>
                    </Select>
                </FormItem>
                 <FormItem>
                    <Label>Timezone</Label>
                    <Select defaultValue="utc">
                        <SelectTrigger>
                            <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="utc">UTC (Coordinated Universal Time)</SelectItem>
                            <SelectItem value="est">EST (Eastern Standard Time)</SelectItem>
                            <SelectItem value="pst">PST (Pacific Standard Time)</SelectItem>
                        </SelectContent>
                    </Select>
                </FormItem>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
import { FormItem } from '@/components/ui/form'; // Add missing import
