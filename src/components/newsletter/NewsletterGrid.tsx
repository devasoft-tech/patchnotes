import React from 'react';
import { NewsletterCard } from './NewsletterCard';
import { Newsletter } from '@/lib/airtable';
import { Skeleton } from '@/components/ui/skeleton';

interface NewsletterGridProps {
  newsletters: Newsletter[];
  isLoading?: boolean;
}

export function NewsletterGrid({ newsletters, isLoading = false }: NewsletterGridProps) {
  // If loading, show skeleton cards
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  // If no newsletters found
  if (newsletters.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="font-medium text-xl">No newsletters found</h3>
        <p className="text-muted-foreground mt-2">
          Try changing your search or filter criteria
        </p>
      </div>
    );
  }

  // Display newsletter grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {newsletters.map((newsletter) => (
        <NewsletterCard key={newsletter.id} newsletter={newsletter} />
      ))}
    </div>
  );
}

// Skeleton component for loading state
function SkeletonCard() {
  return (
    <div className="border rounded-lg p-5 space-y-4">
      <div className="flex justify-between items-start">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-5 w-1/5" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
      </div>
      <div className="flex gap-1">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-16" />
      </div>
      <Skeleton className="h-9 w-full" />
    </div>
  );
} 