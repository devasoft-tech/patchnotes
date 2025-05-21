import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Newsletter } from '@/lib/airtable';

interface NewsletterCardProps {
  newsletter: Newsletter;
}

export function NewsletterCard({ newsletter }: NewsletterCardProps) {
  return (
    <Card className="h-full flex flex-col transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg tracking-tight line-clamp-2">{newsletter.title}</h3>
          <Badge variant="outline" className="ml-2 whitespace-nowrap">
            {newsletter.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {newsletter.description}
        </p>
        <div className="flex flex-wrap gap-1 mt-auto">
          {newsletter.tags.slice(0, 5).map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs px-2 py-0">
              {tag}
            </Badge>
          ))}
          {newsletter.tags.length > 5 && (
            <Badge variant="secondary" className="text-xs px-2 py-0">
              +{newsletter.tags.length - 5} more
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={() => window.open(newsletter.url, '_blank')}
          variant="default"
        >
          Subscribe
        </Button>
      </CardFooter>
    </Card>
  );
} 