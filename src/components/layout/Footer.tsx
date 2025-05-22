import React from 'react';
import Link from 'next/link';
import { Github, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex flex-col items-center gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            {/* Built by{" "}
            <a
              href="https://twitter.com/yourusername"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4 hover:text-primary"
            >
              your-name
            </a>
            .  */}
            Made for devs who hate noise.
          </p>
        </div>
        <div className="flex flex-1 items-center justify-end gap-4">
          <nav className="flex items-center gap-4">
            <Link
              href="/about"
              className="text-sm font-medium text-muted-foreground hover:text-primary"
            >
              About
            </Link>
            <Link
              href="/submit"
              className="text-sm font-medium text-muted-foreground hover:text-primary"
            >
              Submit
            </Link>
            {/* <a
              href="https://twitter.com/patchnotes"
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-primary"
            >
              <Twitter className="h-4 w-4" />
              <span className="sr-only">Twitter</span>
            </a>
            <a
              href="https://github.com/yourusername/patchnotes"
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-primary"
            >
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </a> */}
          </nav>
        </div>
      </div>
    </footer>
  );
} 