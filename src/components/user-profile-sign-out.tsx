'use client';

import { SignOutButton } from '@clerk/nextjs';
import { LogOut } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from './ui/button';

export function UserProfileSignOut() {
  const t = useTranslations('DashboardLayout');

  return (
    <div className="mt-6 flex justify-end">
      <SignOutButton>
        <Button
          variant="outline"
          className="flex items-center gap-2 border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut className="h-4 w-4" />
          <span>{t('sign_out')}</span>
        </Button>
      </SignOutButton>
    </div>
  );
}
