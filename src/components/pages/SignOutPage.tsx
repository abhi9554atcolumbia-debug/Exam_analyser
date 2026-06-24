'use client';

import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';

import { useUserStore } from '@/store/user-store';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import {
  Avatar,
  AvatarFallback,
} from '@/components/ui/avatar';

export default function SignOutPage() {
  const profile = useUserStore((s) => s.profile);
  const [open, setOpen] = useState(false);

  const initials =
    profile?.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';

  const handleLogout = () => {
    toast.success('Logged out successfully');

    // TODO:
    // Add your logout logic here
    // Example:
    // signOut();
    // router.push('/login');
  };

  return (
    <div className="flex justify-center py-12">
      <Card className="w-full max-w-md rounded-3xl border-red-200 bg-gradient-to-br from-red-50 via-white to-red-50 shadow-md">
        <CardContent className="p-8">
          {/* Icon */}
          <div className="text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-red-200 bg-red-100">
              <LogOut className="h-8 w-8 text-red-500" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900">
              Sign Out
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              You are currently signed in as
            </p>
          </div>

          {/* User Card */}
          <div className="mt-6 rounded-2xl border border-red-100 bg-red-50/50 p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-14 w-14">
                <AvatarFallback className="bg-red-500 text-white font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div>
                <p className="font-semibold text-gray-900">
                  {profile?.name || 'User'}
                </p>

                <p className="text-sm text-muted-foreground">
                  {profile?.email || 'user@example.com'}
                </p>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3">
            <p className="text-center text-xs text-red-700">
              You will need to sign in again to access your dashboard.
            </p>
          </div>

          {/* Logout Button */}
          <Button
            className="mt-6 w-full bg-red-600 shadow-lg shadow-red-500/20 hover:bg-red-700"
            onClick={() => setOpen(true)}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="max-w-sm rounded-2xl border-red-200">
          <AlertDialogHeader>
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <LogOut className="h-6 w-6 text-red-500" />
            </div>

            <AlertDialogTitle className="text-center font-bold text-red-600">
              Logout
            </AlertDialogTitle>

            <AlertDialogDescription className="text-center">
              Are you sure you want to logout?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="flex-row gap-2">
            <AlertDialogCancel className="flex-1">
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              className="flex-1 bg-red-600 hover:bg-red-700"
              onClick={handleLogout}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}