import React from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface NewsletterFiltersProps {
  categories: string[];
  selectedCategory: string | null;
  searchQuery: string;
  onCategoryChange: (category: string | null) => void;
  onSearchChange: (search: string) => void;
}

export function NewsletterFilters({
  categories,
  selectedCategory,
  searchQuery,
  onCategoryChange,
  onSearchChange,
}: NewsletterFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Input
          placeholder="Search newsletters..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-4"
        />
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={selectedCategory === null ? "default" : "outline"}
          className="cursor-pointer hover:bg-secondary transition-colors"
          onClick={() => onCategoryChange(null)}
        >
          All
        </Badge>
        {categories.map((category) => (
          <Badge
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            className="cursor-pointer hover:bg-secondary transition-colors"
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </Badge>
        ))}
      </div>

      {/* Reset filters button - only show if filters are active */}
      {(selectedCategory !== null || searchQuery) && (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onCategoryChange(null);
              onSearchChange('');
            }}
          >
            Reset filters
          </Button>
        </div>
      )}
    </div>
  );
} 