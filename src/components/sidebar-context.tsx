'use client';

import {
  createContext,
  use,
  useCallback,
  useMemo,
  useState,
} from 'react';

type SidebarContextValue = {
  isDesktopOpen: boolean;
  setIsDesktopOpen: (open: boolean) => void;
  toggleDesktopSidebar: () => void;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isDesktopOpen, setIsDesktopOpen] = useState(false);

  const toggleDesktopSidebar = useCallback(() => {
    setIsDesktopOpen(prev => !prev);
  }, []);

  const value = useMemo(
    () => ({
      isDesktopOpen,
      setIsDesktopOpen,
      toggleDesktopSidebar,
    }),
    [isDesktopOpen, toggleDesktopSidebar],
  );

  return (
    <SidebarContext value={value}>{children}</SidebarContext>
  );
}

export function useSidebar() {
  const context = use(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}

export function useSidebarOptional() {
  return use(SidebarContext);
}
