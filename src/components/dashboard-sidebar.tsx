'use client';

import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { FileText, Heart, Home, Menu, MessageSquare, Newspaper, Radio, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useState } from 'react';
import { usePlaybackOptional } from '@/components/audio/playback-provider';
import { useSidebar } from '@/components/sidebar-context';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { MOTION } from '@/libs/motion-config';
import { cn } from '@/libs/utils';

type SidebarProps = {
  currentPath?: string;
};

type NavItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
  active?: boolean;
};

type SidebarNavProps = {
  navItems: NavItem[];
  currentPath: string;
  onNavigate?: () => void;
  isCollapsed?: boolean;
};

/**
 * Animated logo toggle button that transitions between decorative lines and X
 * Uses simple rotation and opacity transforms for smooth animation
 */
function AnimatedLogoToggle({
  isOpen,
  onClick,
  ariaLabel,
}: {
  isOpen: boolean;
  onClick: () => void;
  ariaLabel: string;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      aria-expanded={isOpen}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg text-white/80 transition-colors hover:bg-white/5 hover:text-white"
    >
      {/* Hamburger menu lines (visible when closed) */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center gap-1"
        initial={reducedMotion ? undefined : false}
        animate={
          reducedMotion
            ? {
                opacity: isOpen ? 0 : 1,
              }
            : {
                opacity: isOpen ? 0 : 1,
                rotate: isOpen ? 90 : 0,
              }
        }
        transition={
          reducedMotion
            ? { duration: 0 }
            : {
                duration: MOTION.duration.normal,
                ease: MOTION.easing.default,
              }
        }
      >
        <motion.span className="h-0.5 w-5 rounded-full bg-current" />
        <motion.span className="h-0.5 w-5 rounded-full bg-current" />
        <motion.span className="h-0.5 w-5 rounded-full bg-current" />
      </motion.div>

      {/* X icon (visible when open) */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={reducedMotion ? undefined : false}
        animate={
          reducedMotion
            ? {
                opacity: isOpen ? 1 : 0,
              }
            : {
                opacity: isOpen ? 1 : 0,
                rotate: isOpen ? 0 : -90,
              }
        }
        transition={
          reducedMotion
            ? { duration: 0 }
            : {
                duration: MOTION.duration.normal,
                ease: MOTION.easing.default,
              }
        }
      >
        <X className="h-5 w-5" />
      </motion.div>
    </button>
  );
}

function normalizePathname(pathname: string) {
  const trimmed = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  const segments = trimmed.split('/').filter(Boolean);

  if (segments.length === 0) {
    return '/';
  }

  const [first, ...rest] = segments;
  const looksLikeLocale = /^[a-z]{2}(?:-[a-z]{2})?$/i.test(first ?? '');
  if (!looksLikeLocale) {
    return `/${segments.join('/')}`;
  }

  if (rest.length === 0) {
    return '/';
  }

  return `/${rest.join('/')}`;
}

function getNavItemActive(pathname: string, navItemId: string) {
  const normalizedPathname = normalizePathname(pathname);

  if (navItemId === 'home') {
    return normalizedPathname === '/' || normalizedPathname === '/dashboard';
  }

  if (navItemId === 'chat') {
    return normalizedPathname === '/chat';
  }

  if (navItemId === 'digest') {
    return (
      normalizedPathname === '/blog' || normalizedPathname.startsWith('/blog/')
    );
  }

  if (navItemId === 'about') {
    return normalizedPathname === '/about';
  }

  if (navItemId === 'manifesto') {
    return normalizedPathname === '/manifesto';
  }

  return false;
}

function SidebarNav({
  navItems,
  currentPath,
  onNavigate,
  isCollapsed = false,
}: SidebarNavProps) {
  const reducedMotion = useReducedMotion();

  return (
    <nav className="flex-1 space-y-1 p-4">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = item.active ?? getNavItemActive(currentPath, item.id);

        return (
          <Link
            key={item.id}
            href={item.href}
            onClick={onNavigate}
            title={isCollapsed ? item.label : undefined}
            className={cn(
              'flex items-center rounded-lg px-3 py-1.5 text-sm font-medium transition-[background-color,color,transform] duration-200',
              'hover:bg-white/5 active:scale-95',
              isActive
                ? 'bg-white/10 text-white'
                : 'text-white/60 hover:text-white',
              isCollapsed ? 'justify-center' : 'gap-3',
            )}
          >
            <Icon className="h-5 w-5 shrink-0" />
            <motion.span
              className="overflow-hidden whitespace-nowrap"
              initial={reducedMotion ? undefined : false}
              animate={
                reducedMotion
                  ? {
                      width: isCollapsed ? 0 : 'auto',
                      opacity: isCollapsed ? 0 : 1,
                    }
                  : {
                      width: isCollapsed ? 0 : 'auto',
                      opacity: isCollapsed ? 0 : 1,
                    }
              }
              transition={
                reducedMotion
                  ? { duration: 0 }
                  : {
                      duration: MOTION.duration.normal,
                      ease: MOTION.easing.default,
                    }
              }
            >
              {item.label}
            </motion.span>
          </Link>
        );
      })}
    </nav>
  );
}

function PlayerToggleCompact() {
  const playback = usePlaybackOptional();

  if (!playback) {
    return <div className="h-10 w-10" aria-hidden="true" />;
  }

  return (
    <button
      type="button"
      onClick={playback.togglePlayerEnabled}
      className={cn(
        'inline-flex h-10 w-10 items-center justify-center rounded-lg text-white/80 transition-colors hover:bg-white/5 hover:text-white',
        playback.playerEnabled
        && 'bg-gradient-to-r from-blue-500/20 to-purple-500/20',
      )}
      aria-label={
        playback.playerEnabled
          ? 'Turn off radio player'
          : 'Turn on radio player'
      }
      aria-pressed={playback.playerEnabled}
    >
      <Radio
        className={cn('h-5 w-5', playback.playerEnabled && 'text-blue-400')}
      />
    </button>
  );
}

function PlayerToggle({
  className,
  isCollapsed = false,
}: {
  className?: string;
  isCollapsed?: boolean;
}) {
  const playback = usePlaybackOptional();

  if (!playback) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={playback.togglePlayerEnabled}
      title={isCollapsed ? 'Radio' : undefined}
      className={cn(
        'flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-[background-color,color,transform] duration-200',
        'hover:bg-white/5 active:scale-95',
        playback.playerEnabled
          ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white'
          : 'text-white/60 hover:text-white',
        isCollapsed ? 'justify-center' : 'gap-3',
        className,
      )}
      aria-label={
        playback.playerEnabled
          ? 'Turn off radio player'
          : 'Turn on radio player'
      }
      aria-pressed={playback.playerEnabled}
    >
      <Radio
        className={cn(
          'h-5 w-5 shrink-0',
          playback.playerEnabled && 'text-blue-400',
        )}
      />
      {!isCollapsed && (
        <>
          <span className="whitespace-nowrap">Radio</span>
          <span
            className={cn(
              'ml-auto h-2 w-2 shrink-0 rounded-full',
              playback.playerEnabled ? 'bg-green-500' : 'bg-white/20',
            )}
            aria-hidden="true"
          />
        </>
      )}
    </button>
  );
}

export function DashboardSidebar({ currentPath }: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { isDesktopOpen, setIsDesktopOpen } = useSidebar();
  const mobileDialogTitleId = useId();
  const pathname = usePathname();
  const resolvedPathname = currentPath ?? pathname ?? '/dashboard';
  const reducedMotion = useReducedMotion();

  // Mobile menu: Handle body scroll lock and Escape key
  useEffect(() => {
    if (!isMobileOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isMobileOpen]);

  // Desktop sidebar: Handle Escape key to close
  useEffect(() => {
    if (!isDesktopOpen) {
      return undefined;
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDesktopOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isDesktopOpen, setIsDesktopOpen]);

  const navItems: NavItem[] = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      href: '/',
      active: getNavItemActive(resolvedPathname, 'home'),
    },
    {
      id: 'chat',
      label: 'AI Assistant',
      icon: MessageSquare,
      href: '/chat',
      active: getNavItemActive(resolvedPathname, 'chat'),
    },
    {
      id: 'digest',
      label: 'Digest',
      icon: Newspaper,
      href: '/blog',
      active: getNavItemActive(resolvedPathname, 'digest'),
    },
    {
      id: 'about',
      label: 'About',
      icon: FileText,
      href: '/about',
      active: getNavItemActive(resolvedPathname, 'about'),
    },
    {
      id: 'manifesto',
      label: 'Manifesto',
      icon: Heart,
      href: '/manifesto',
      active: getNavItemActive(resolvedPathname, 'manifesto'),
    },
  ];

  const closeMobile = () => setIsMobileOpen(false);

  // Simplified logo without decorative lines (for mobile header)
  const simplifiedLogo = (
    <svg
      width="140"
      height="40"
      viewBox="150 0 400 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_404_378)">
        <path
          d="M214.167 86.1719C209.402 86.1719 205.339 85.7812 201.98 85C198.66 84.2578 195.925 83.2227 193.777 81.8945C191.628 80.6055 190.066 79.1211 189.089 77.4414C188.113 75.7227 187.625 73.9258 187.625 72.0508C187.625 68.0273 189.539 64.1406 193.367 60.3906C195.203 58.5938 197.371 56.9922 199.871 55.5859C202.41 54.1797 205.203 53.1055 208.25 52.3633C209.382 52.3633 210.203 52.832 210.71 53.7695C211.257 54.668 211.531 55.7031 211.531 56.875C211.531 58.0078 211.257 58.9062 210.71 59.5703C210.164 60.1953 208.914 60.918 206.96 61.7383C204.773 62.6758 203.054 63.8086 201.804 65.1367C200.554 66.4258 199.929 67.7148 199.929 69.0039C199.929 70.6445 201.062 72.0898 203.328 73.3398C205.632 74.5508 209.382 75.1562 214.578 75.1562C218.171 75.1562 221.472 74.5898 224.48 73.457C227.527 72.3242 229.968 70.7812 231.804 68.8281C233.64 66.8359 234.558 64.5898 234.558 62.0898C234.558 60.6836 233.972 59.2188 232.8 57.6953C231.628 56.1719 229.773 54.5898 227.234 52.9492C224.968 51.4648 222.976 50.1367 221.257 48.9648C219.578 47.793 218.171 46.7578 217.039 45.8594L212.703 42.4609C209.773 39.8828 207.585 37.4023 206.14 35.0195C204.695 32.6367 203.972 30.1562 203.972 27.5781C203.972 24.0625 205.203 20.6836 207.664 17.4414C210.125 14.1602 213.289 11.2305 217.156 8.65234C221.023 6.11328 225.144 4.12109 229.519 2.67578C233.894 1.19141 237.937 0.449219 241.648 0.449219C245.476 0.449219 248.66 1.34766 251.199 3.14453C253.777 4.94141 255.066 7.85156 255.066 11.875C255.066 17.8516 251.667 23.125 244.871 27.6953C243.347 28.75 241.941 29.2773 240.652 29.2773C239.324 29.2773 238.269 28.8086 237.488 27.8711C236.707 26.8945 236.316 25.7617 236.316 24.4727C236.316 23.3789 236.628 22.2852 237.253 21.1914C237.917 20.0977 238.972 19.1602 240.417 18.3789C241.55 17.793 242.546 17.0117 243.406 16.0352C244.304 15.0195 244.753 14.043 244.753 13.1055C244.753 12.207 244.441 11.6211 243.816 11.3477C243.23 11.0742 242.507 10.9375 241.648 10.9375C239.226 10.9375 236.511 11.3672 233.503 12.2266C230.496 13.0859 227.625 14.2578 224.89 15.7422C222 17.3047 219.695 19.0039 217.976 20.8398C216.296 22.6758 215.457 24.4922 215.457 26.2891C215.457 27.9688 216.14 29.5117 217.507 30.918C218.914 32.3242 220.886 33.9648 223.425 35.8398L237.136 45.9766C240.496 48.4766 243.191 50.9375 245.222 53.3594C247.253 55.7422 248.269 58.3398 248.269 61.1523C248.269 65.293 246.843 69.2773 243.992 73.1055C241.179 76.9336 237.214 80.0781 232.097 82.5391C227.019 84.9609 221.042 86.1719 214.167 86.1719Z"
          fill="white"
        />
        <path
          d="M242.464 114.766C241.057 114.766 239.905 114.473 239.007 113.887C238.069 113.34 237.6 112.266 237.6 110.664C237.6 109.141 238.01 107.52 238.831 105.801C239.651 104.082 240.354 102.578 240.94 101.289C243.675 96.25 246.487 91.0938 249.378 85.8203C252.268 80.5859 254.964 75.4297 257.464 70.3516C260.003 65.2734 262.034 60.4492 263.557 55.8789C263.831 55.2539 264.221 54.3359 264.729 53.125C265.237 51.875 265.862 50.5859 266.604 49.2578C267.346 47.9297 268.167 46.7969 269.065 45.8594C269.964 44.9219 270.921 44.4531 271.936 44.4531C274.905 44.4531 276.389 45.6445 276.389 48.0273C276.389 48.457 276.253 49.3555 275.979 50.7227C275.745 52.0508 275.491 52.9688 275.217 53.4766C277.132 51.7188 279.241 50 281.546 48.3203C283.85 46.6016 286.253 45.1953 288.753 44.1016C291.292 42.9688 293.792 42.4023 296.253 42.4023C298.831 42.4023 301.233 43.0273 303.46 44.2773C305.725 45.4883 306.858 47.3047 306.858 49.7266C306.858 52.0312 305.862 54.6094 303.87 57.4609C301.917 60.2734 299.671 63.0078 297.132 65.6641C295.647 67.2266 294.143 68.75 292.62 70.2344C291.096 71.6797 289.807 72.9297 288.753 73.9844C287.737 75.0391 287.21 75.7422 287.171 76.0938C287.171 77.1484 287.932 77.6758 289.456 77.6758C291.018 77.6758 294.241 75.9961 299.124 72.6367C304.007 69.2383 310.921 64.1797 319.866 57.4609C321.077 56.7578 322.034 56.4062 322.737 56.4062C323.596 56.4062 324.241 56.7383 324.671 57.4023C325.1 58.0273 325.315 58.8086 325.315 59.7461C325.315 60.7617 325.042 61.7969 324.495 62.8516C323.987 63.9062 323.206 64.7852 322.151 65.4883C318.089 68.4961 314.358 71.3477 310.96 74.043C307.639 76.6602 304.553 78.8672 301.702 80.6641C298.772 82.5391 295.921 83.9844 293.147 85C290.374 86.0156 287.405 86.5234 284.241 86.5234C281.272 86.5234 278.967 85.9766 277.327 84.8828C275.725 83.7891 274.925 82.2852 274.925 80.3711V79.9023L274.983 79.4336C275.217 77.7148 276.37 75.625 278.44 73.1641C280.55 70.6641 282.854 68.1641 285.354 65.6641C287.776 63.2422 289.983 60.9375 291.975 58.75C293.967 56.5625 294.964 54.8828 294.964 53.7109C294.964 52.6953 294.124 52.1875 292.444 52.1875C290.139 52.1875 287.717 52.9102 285.178 54.3555C282.678 55.8008 280.276 57.6562 277.971 59.9219C275.589 62.1875 273.479 64.5508 271.643 67.0117C269.807 69.4727 268.284 71.7578 267.073 73.8672L263.089 81.3086C262.19 82.9883 261.409 84.4531 260.745 85.7031C260.12 86.9531 259.69 87.793 259.456 88.2227C259.182 88.7305 258.655 89.8438 257.874 91.5625C257.132 93.2812 256.214 95.3516 255.12 97.7734C254.026 100.156 253.089 102.207 252.307 103.926C251.565 105.684 251.116 106.797 250.96 107.266C250.217 109.258 249.163 110.996 247.796 112.48C246.428 114.004 244.651 114.766 242.464 114.766Z"
          fill="white"
        />
        <path
          d="M330.467 86.4648C327.342 86.4648 324.666 85.7031 322.439 84.1797C320.252 82.6172 318.572 80.5859 317.4 78.0859C316.267 75.5469 315.701 72.832 315.701 69.9414C315.701 67.4023 316.424 64.5703 317.869 61.4453C319.353 58.2812 321.463 55.2539 324.197 52.3633C326.932 49.4727 330.193 47.0898 333.982 45.2148C337.81 43.3008 341.971 42.3438 346.463 42.3438C349.705 42.3438 352.127 43.125 353.728 44.6875C355.33 46.25 356.131 48.418 356.131 51.1914C356.131 52.832 355.701 54.5508 354.842 56.3477C353.982 58.1445 352.498 59.9609 350.389 61.7969C348.279 63.6719 345.447 65.5859 341.892 67.5391C338.377 69.4531 333.963 71.3867 328.65 73.3398C329.08 75.7617 331.033 76.9727 334.51 76.9727C337.205 76.9727 340.115 76.4258 343.24 75.332C346.365 74.1992 349.373 72.9102 352.264 71.4648C355.154 70.0586 357.635 68.7305 359.705 67.4805C361.775 66.2305 363.006 65.5273 363.396 65.3711C363.748 65.1367 364.06 65 364.334 64.9609C364.646 64.9219 364.92 64.9023 365.154 64.9023C366.092 64.9023 366.736 65.2734 367.088 66.0156C367.478 66.7188 367.674 67.3047 367.674 67.7734C367.674 68.125 367.635 68.5547 367.557 69.0625C367.478 69.5312 367.185 70.0781 366.678 70.7031C366.17 71.2109 364.685 72.3242 362.225 74.043C359.764 75.7617 357.127 77.4219 354.314 79.0234C350.877 80.9375 347.049 82.6562 342.83 84.1797C338.611 85.7031 334.49 86.4648 330.467 86.4648ZM327.771 66.6016C330.31 65.2734 332.889 63.7305 335.506 61.9727C338.162 60.1758 340.174 58.8672 341.541 58.0469C343.377 56.875 344.588 55.8398 345.174 54.9414C345.838 53.9648 346.17 53.1445 346.17 52.4805C346.17 51.8945 345.975 51.4258 345.584 51.0742C345.232 50.7227 344.822 50.5078 344.353 50.4297L343.826 50.3711H343.299C341.15 50.3711 339.158 50.9961 337.322 52.2461C335.525 53.457 334.002 54.9805 332.752 56.8164C331.424 58.7305 330.35 60.5273 329.529 62.207C328.748 63.8867 328.162 65.3516 327.771 66.6016Z"
          fill="white"
        />
        <path
          d="M375.345 86.4648C374.017 86.4648 372.435 86.0938 370.599 85.3516C368.763 84.6094 367.142 83.3789 365.735 81.6602C364.368 79.9414 363.685 77.6367 363.685 74.7461C363.685 72.3242 364.232 69.2969 365.325 65.6641C366.419 62.0312 368.138 58.457 370.482 54.9414C372.825 51.3477 375.814 48.3594 379.446 45.9766C383.118 43.5938 387.357 42.4023 392.161 42.4023C393.88 42.4023 395.384 42.6172 396.673 43.0469C397.962 43.4766 399.056 43.9453 399.954 44.4531C400.462 44.7656 400.931 45.0977 401.36 45.4492C401.829 45.7617 402.259 46.1133 402.65 46.5039L404.7 45.5078C405.286 45.2344 405.892 45 406.517 44.8047C407.181 44.5703 407.747 44.4531 408.216 44.4531C409.7 44.4531 410.911 44.8633 411.849 45.6836C412.786 46.5039 413.255 47.4023 413.255 48.3789C413.255 48.6914 413.235 48.9062 413.196 49.0234C412.923 50.1172 412.415 51.6211 411.673 53.5352C410.97 55.4492 410.208 57.5781 409.388 59.9219C408.567 62.1875 407.864 64.375 407.278 66.4844C406.732 68.5938 406.458 70.332 406.458 71.6992C406.458 72.8711 406.653 73.8477 407.044 74.6289C407.435 75.3711 408.099 75.7422 409.036 75.7422C410.169 75.7422 411.692 75.0977 413.607 73.8086C415.521 72.4805 417.493 70.918 419.525 69.1211C420.618 68.1445 421.751 67.1094 422.923 66.0156C424.095 64.8828 425.286 63.6914 426.497 62.4414C427.122 61.9336 427.728 61.6797 428.314 61.6797C429.095 61.6797 429.739 62.0703 430.247 62.8516C430.794 63.5938 431.067 64.4336 431.067 65.3711C431.067 66.4648 430.696 67.3828 429.954 68.125C428.392 69.5703 426.79 71.1133 425.15 72.7539C423.509 74.3945 421.243 76.4062 418.353 78.7891C415.775 80.8984 413.118 82.7148 410.384 84.2383C407.65 85.7227 405.189 86.4648 403.001 86.4648C400.267 86.4648 398.275 85.4102 397.025 83.3008C395.775 81.1523 395.15 78.8672 395.15 76.4453C395.15 74.6875 395.403 73.125 395.911 71.7578C394.31 73.9062 392.415 76.1328 390.228 78.4375C388.04 80.7031 385.677 82.6172 383.138 84.1797C380.599 85.7031 378.001 86.4648 375.345 86.4648ZM380.032 76.1523C381.282 76.1523 382.845 75.3516 384.72 73.75C386.634 72.1484 388.47 70.2734 390.228 68.125C392.181 65.7812 393.724 63.6523 394.857 61.7383C395.989 59.8242 396.556 58.5352 396.556 57.8711C396.556 56.3867 395.696 55.2148 393.978 54.3555C392.259 53.457 390.716 53.0078 389.349 53.0078C386.927 53.0078 384.622 53.7891 382.435 55.3516C380.286 56.9141 378.528 58.9258 377.161 61.3867C375.794 63.8086 375.11 66.3281 375.11 68.9453C375.11 70.4688 375.384 72.0508 375.931 73.6914C376.517 75.332 377.884 76.1523 380.032 76.1523Z"
          fill="white"
        />
        <path
          d="M438.739 86.4648C434.637 86.4648 430.907 85.5469 427.547 83.7109C424.188 81.8359 422.039 78.8867 421.102 74.8633C421.024 74.4727 420.985 74.2188 420.985 74.1016C420.985 73.0469 421.356 72.1484 422.098 71.4062C422.84 70.625 423.66 70.2344 424.559 70.2344C424.989 70.2344 425.457 70.3125 425.965 70.4688C426.512 70.625 426.922 70.9766 427.196 71.5234C428.211 73.3594 429.95 74.8438 432.41 75.9766C434.91 77.0703 437.352 77.6172 439.735 77.6172C442.274 77.6172 444.481 77.1289 446.356 76.1523C448.27 75.1758 449.227 73.5742 449.227 71.3477C449.227 68.6133 448.446 66.1914 446.883 64.082C445.36 61.9727 443.426 60.0781 441.082 58.3984C438.778 56.6797 436.453 55.0977 434.11 53.6523C433.914 53.5352 433.621 53.2031 433.231 52.6562C432.84 52.0703 432.645 51.4844 432.645 50.8984C432.645 50.4297 432.762 50.0586 432.996 49.7852C434.246 48.1055 435.848 46.4648 437.801 44.8633C439.754 43.2617 441.903 42.4609 444.246 42.4609C445.965 42.4609 447.371 42.8906 448.465 43.75C449.598 44.5703 450.164 45.3906 450.164 46.2109C450.164 47.3047 449.657 48.3398 448.641 49.3164C447.625 50.2539 446.571 51.1523 445.477 52.0117C450.125 54.4336 453.817 57.5195 456.551 61.2695C459.285 64.9805 460.653 68.6133 460.653 72.168C460.653 75.1758 459.559 77.7539 457.371 79.9023C455.223 82.0117 452.469 83.6328 449.11 84.7656C445.789 85.8984 442.332 86.4648 438.739 86.4648Z"
          fill="white"
        />
        <path
          d="M477.113 119.746C475.55 119.746 474.281 119.219 473.304 118.164C472.328 117.148 471.839 115.762 471.839 114.004C471.839 112.363 472.035 110.723 472.425 109.082C472.855 107.48 473.597 105.703 474.652 103.75C475.667 101.797 477.015 99.6094 478.695 97.1875C480.414 94.8047 482.562 91.9922 485.14 88.75L496.859 65.0195C491 71.9727 485.687 77.2852 480.921 80.957C476.156 84.6289 471.703 86.4648 467.562 86.4648C466.234 86.4648 465.101 86.1523 464.164 85.5273C463.226 84.9414 462.757 83.9453 462.757 82.5391C462.757 80.5859 463.226 78.3789 464.164 75.918C464.945 74.0039 465.765 72.2266 466.625 70.5859C467.523 68.9062 468.441 67.1484 469.378 65.3125C470.355 63.3594 471.488 60.957 472.777 58.1055C474.066 55.2539 475.492 51.8359 477.054 47.8516C477.835 46.3281 478.851 45.2344 480.101 44.5703C481.351 43.8672 482.562 43.5156 483.734 43.5156C484.945 43.5156 485.96 43.8086 486.781 44.3945C487.64 44.9414 488.07 45.6836 488.07 46.6211C488.07 47.1289 487.992 47.5391 487.835 47.8516L477.113 70.1758C476.566 71.3477 476.292 72.2461 476.292 72.8711C476.292 73.457 476.527 73.75 476.996 73.75C477.425 73.75 477.972 73.5352 478.636 73.1055C479.3 72.6758 479.925 72.1875 480.511 71.6406L504.71 47.8516C506.664 46.2891 508.167 45.332 509.222 44.9805C510.277 44.6289 511.312 44.4531 512.328 44.4531C513.148 44.4531 513.734 44.7656 514.085 45.3906C514.437 45.9766 514.613 46.6016 514.613 47.2656C514.613 47.7734 514.515 48.2812 514.32 48.7891L501.195 76.1523C503.07 74.7461 505.218 73.3789 507.64 72.0508C510.062 70.6836 512.425 69.4531 514.73 68.3594C517.035 67.2656 518.988 66.4062 520.589 65.7812C522.191 65.1172 523.089 64.7852 523.285 64.7852C524.261 64.7852 525.121 65.1562 525.863 65.8984C526.605 66.6406 526.976 67.5781 526.976 68.7109C526.976 69.7266 526.585 70.8008 525.804 71.9336C525.062 73.0664 523.734 74.1602 521.82 75.2148C519.359 76.582 517.015 77.8516 514.789 79.0234C512.601 80.1953 510.765 81.1914 509.281 82.0117L505.121 84.3555C503.246 85.4492 501.507 86.6016 499.906 87.8125C498.343 89.0234 496.761 90.3711 495.16 91.8555C493.441 96.3477 491.82 100.312 490.296 103.75C488.812 107.188 487.894 109.238 487.542 109.902C484.378 116.465 480.902 119.746 477.113 119.746Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_404_378">
          <rect
            width="526.814"
            height="119.746"
            fill="white"
            transform="translate(0.162109)"
          />
        </clipPath>
      </defs>
    </svg>
  );

  return (
    <>
      <div className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-white/10 bg-[#100e12] px-4 md:hidden">
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setIsMobileOpen(true)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white/80 transition-colors hover:bg-white/5 hover:text-white"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="absolute left-1/2 z-10 -translate-x-1/2">
          <Link href="/" aria-label="Home">
            {simplifiedLogo}
          </Link>
        </div>
        <PlayerToggleCompact />
      </div>

      <div
        className={cn(
          'fixed inset-0 z-50 md:hidden',
          isMobileOpen ? 'pointer-events-auto' : 'pointer-events-none',
        )}
        aria-hidden={!isMobileOpen}
      >
        <button
          type="button"
          aria-label="Close menu"
          onClick={closeMobile}
          className={cn(
            'absolute inset-0 bg-black/60 transition-opacity',
            isMobileOpen ? 'opacity-100' : 'opacity-0',
          )}
        />

        <aside
          role="dialog"
          aria-modal="true"
          aria-labelledby={mobileDialogTitleId}
          className={cn(
            'absolute inset-y-0 left-0 w-72 border-r border-white/10 bg-[#100e12] shadow-xl transition-transform',
            isMobileOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <div className="flex h-full w-full flex-col">
            <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
              <button
                type="button"
                aria-label="Close menu"
                onClick={closeMobile}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white/80 transition-colors hover:bg-white/5 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <SidebarNav
              navItems={navItems}
              currentPath={resolvedPathname}
              onNavigate={closeMobile}
            />
            <div className="border-t border-white/10 p-4">
              <PlayerToggle />
            </div>
            {/* {isAuthenticated && <SidebarAccount onNavigate={closeMobile} />} */}
          </div>
        </aside>
      </div>

      {/* Desktop sidebar - collapsible */}
      <motion.aside
        className="fixed top-0 left-0 z-40 hidden h-screen border-r border-white/10 bg-[#100e12] md:flex"
        initial={reducedMotion ? undefined : false}
        animate={
          reducedMotion
            ? { width: isDesktopOpen ? '12rem' : '5rem' }
            : {
                width: isDesktopOpen ? '12rem' : '5rem',
              }
        }
        transition={
          reducedMotion
            ? { duration: 0 }
            : {
                duration: MOTION.duration.normal,
                ease: MOTION.easing.default,
              }
        }
      >
        <div className="flex h-full w-full flex-col">
          <div className="flex h-16 items-center justify-start border-b border-white/10 px-4">
            <AnimatedLogoToggle
              isOpen={isDesktopOpen}
              onClick={() => setIsDesktopOpen(!isDesktopOpen)}
              ariaLabel={isDesktopOpen ? 'Close menu' : 'Open menu'}
            />
            <motion.div
              className="hidden overflow-hidden"
              initial={reducedMotion ? undefined : false}
              animate={
                reducedMotion
                  ? {
                      width: isDesktopOpen ? 'auto' : 0,
                      opacity: isDesktopOpen ? 1 : 0,
                    }
                  : {
                      width: isDesktopOpen ? 'auto' : 0,
                      opacity: isDesktopOpen ? 1 : 0,
                    }
              }
              transition={
                reducedMotion
                  ? { duration: 0 }
                  : {
                      duration: MOTION.duration.normal,
                      ease: MOTION.easing.default,
                    }
              }
            >

            </motion.div>
          </div>
          <SidebarNav
            navItems={navItems}
            currentPath={resolvedPathname}
            isCollapsed={!isDesktopOpen}
          />
          <div className="border-t border-white/10 p-4">
            <PlayerToggle isCollapsed={!isDesktopOpen} />
          </div>
          {/* <SidebarAccount /> */}
        </div>
      </motion.aside>
    </>
  );
}
