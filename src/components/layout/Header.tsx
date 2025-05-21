"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Menu, Sun, Moon, Laptop } from 'lucide-react';
import { useTheme } from 'next-themes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const { theme, resolvedTheme, setTheme } = useTheme();
  const pathname = usePathname();
  
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { href: '/', label: 'Discover' },
    { href: '/submit', label: 'Submit' },
    { href: '/about', label: 'About' },
  ];

  const isActive = (path: string) => pathname === path;
  
  if (!mounted) {
    return null;
  }
  
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-mono font-semibold text-xl">PatchNotes</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(item.href)
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                {resolvedTheme === 'dark' ? (
                  <Moon className="h-[1.2rem] w-[1.2rem]" />
                ) : (
                  <Sun className="h-[1.2rem] w-[1.2rem]" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme('light')}>
                <Sun className="mr-2 h-4 w-4" />
                <span>Light</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                <Moon className="mr-2 h-4 w-4" />
                <span>Dark</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}>
                <Laptop className="mr-2 h-4 w-4" />
                <span>System</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Link href="/submit" className="hidden md:inline-block">
            <Button variant="default" size="sm">Submit Newsletter</Button>
          </Link>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="container py-4 border-t">
              <nav className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      isActive(item.href)
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <Link 
                  href="/submit" 
                  className="w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button variant="default" className="w-full">
                    Submit Newsletter
                  </Button>
                </Link>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
} 