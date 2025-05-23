
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserCircle, Edit3, KeyRound, Image as ImageIcon, ShieldCheck } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return <div className="p-4">Loading user data...</div>;
  }

  const getInitials = (name?: string) => {
    if (!name) return 'FP';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
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
                <AvatarImage src={`https://placehold.co/100x100.png?text=${getInitials(user.username)}`} alt={user.username || 'User'} data-ai-hint="user avatar" />
                <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm">
                <ImageIcon className="mr-2 h-4 w-4" /> Change Profile Picture
              </Button>
            </div>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" defaultValue={user.firstName || ''} readOnly className="mt-1 bg-muted/50" />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" defaultValue={user.lastName || ''} readOnly className="mt-1 bg-muted/50" />
              </div>
              <div>
                <Label htmlFor="username">Username</Label>
                <Input id="username" defaultValue={user.username} readOnly className="mt-1 bg-muted/50" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={user.email} readOnly className="mt-1 bg-muted/50" />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" defaultValue={user.phoneNumber || ''} readOnly className="mt-1 bg-muted/50" />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input id="country" defaultValue={user.country || ''} readOnly className="mt-1 bg-muted/50" />
              </div>
              <div>
                <Label htmlFor="accountType">Account Type</Label>
                <Input id="accountType" defaultValue={user.accountType || 'N/A'} readOnly className="mt-1 bg-muted/50" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="default">
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
            <Button variant="outline" className="w-full justify-start">
              <KeyRound className="mr-2 h-4 w-4" /> Change Password
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <KeyRound className="mr-2 h-4 w-4" /> Change Trading PIN
            </Button>
             <Button variant="outline" className="w-full justify-start">
               <ShieldCheck className="mr-2 h-4 w-4" /> Enable Two-Factor Auth
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
