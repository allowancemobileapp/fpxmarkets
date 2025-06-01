
'use client';

// This is a conceptual new file for the content of the profile page.
// The actual profile page is /src/app/dashboard/profile/page.tsx
// This component would be imported by that page.

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserCircle, Edit3, KeyRound, Image as ImageIcon, ShieldCheck } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function DashboardProfilePageContent() {
  const { user: appUser } = useAuth(); // Using appUser from AuthContext

  if (!appUser) {
    return <div className="p-4">Loading user data or user not found...</div>;
  }

  const getInitials = (name?: string | null) => {
    if (!name) return 'FP'; // Default fallback
    const nameParts = name.split(' ');
    if (nameParts.length === 1 && nameParts[0].length > 1) return nameParts[0].substring(0,2).toUpperCase();
    return nameParts.map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center">
          <UserCircle className="mr-3 h-8 w-8" /> Your Profile
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information Card */}
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Account Information</CardTitle>
            <CardDescription>View and manage your personal details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage 
                  src={`https://placehold.co/100x100.png?text=${getInitials(appUser.username)}`} 
                  alt={appUser.username || 'User'} 
                  data-ai-hint="user avatar" 
                />
                <AvatarFallback>{getInitials(appUser.username)}</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" disabled> {/* Disabled for now */}
                <ImageIcon className="mr-2 h-4 w-4" /> Change Profile Picture
              </Button>
            </div>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" value={appUser.first_name || ''} readOnly className="mt-1 bg-muted/50" />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" value={appUser.last_name || ''} readOnly className="mt-1 bg-muted/50" />
              </div>
              <div>
                <Label htmlFor="username">Username</Label>
                <Input id="username" value={appUser.username || ''} readOnly className="mt-1 bg-muted/50" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={appUser.email} readOnly className="mt-1 bg-muted/50" />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" value={appUser.phone_number || ''} readOnly className="mt-1 bg-muted/50" />
              </div>
              <div>
                <Label htmlFor="country_code">Country Code</Label>
                <Input id="country_code" value={appUser.country_code || ''} readOnly className="mt-1 bg-muted/50" />
              </div>
              <div>
                <Label htmlFor="accountType">Account Type</Label>
                <Input id="accountType" value={appUser.account_type || 'N/A'} readOnly className="mt-1 bg-muted/50" />
              </div>
               <div>
                <Label htmlFor="profileCompletedAt">Profile Completed</Label>
                <Input id="profileCompletedAt" value={appUser.profile_completed_at ? new Date(appUser.profile_completed_at).toLocaleDateString() : 'No'} readOnly className="mt-1 bg-muted/50" />
              </div>
               <div>
                <Label htmlFor="pinSetupCompletedAt">PIN Setup</Label>
                <Input id="pinSetupCompletedAt" value={appUser.pin_setup_completed_at ? 'Completed' : 'Pending'} readOnly className="mt-1 bg-muted/50" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="default" disabled> {/* Disabled for now */}
              <Edit3 className="mr-2 h-4 w-4" /> Edit Profile 
            </Button>
          </CardFooter>
        </Card>

        {/* Security Settings Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Security Settings</CardTitle>
            <CardDescription>Manage your account security.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start" disabled> {/* Disabled for now */}
              <KeyRound className="mr-2 h-4 w-4" /> Change Password
            </Button>
            <Button variant="outline" className="w-full justify-start" disabled> {/* Disabled for now */}
              <KeyRound className="mr-2 h-4 w-4" /> Change Trading PIN
            </Button>
             <Button variant="outline" className="w-full justify-start" disabled> {/* Disabled for now */}
               <ShieldCheck className="mr-2 h-4 w-4" /> Enable Two-Factor Auth
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
