"use client";

import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { NewsletterGrid } from '@/components/newsletter/NewsletterGrid';
import { NewsletterFilters } from '@/components/newsletter/NewsletterFilters';
import { Newsletter } from '@/lib/airtable';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';

export default function HomePage() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { theme } = useTheme();
  
  // Filtering and pagination state
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Fetch newsletters with current filters
  const fetchNewsletters = async (refresh = false) => {
    try {
      if (refresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);
      
      // Build query params
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: '21',
      });
      
      if (selectedCategory) {
        params.append('category', selectedCategory);
      }
      
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      
      // Fetch from API
      const response = await fetch(`/api/newsletter?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch newsletters');
      }
      
      const data = await response.json();
      
      // Update state with fetched data
      setNewsletters(data.newsletters);
      setTotalPages(data.pagination.totalPages);
      
      // Extract unique categories if first load
      if (categories.length === 0) {
        const uniqueCategories = Array.from(
          new Set(data.newsletters.map((n: Newsletter) => n.category))
        ) as string[];
        setCategories(uniqueCategories);
      }
    } catch (err) {
      setError('Failed to load newsletters. Please try again later.');
      console.error('Error fetching newsletters:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };
  
  // Fetch newsletters on initial load and when filters change
  useEffect(() => {
    fetchNewsletters();
  }, [page, selectedCategory, searchQuery]);
  
  // Handle category change
  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    setPage(1); // Reset to first page when filter changes
  };
  
  // Handle search change (with debounce)
  const handleSearchChange = (search: string) => {
    setSearchQuery(search);
    setPage(1); // Reset to first page when search changes
  };
  
  // Handle pagination
  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <Layout>
      <section className="container py-8 md:py-12">
        {/* Hero section */}
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-mono font-bold text-3xl md:text-5xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-emerald-500">
            Discover the Best Tech Newsletters
          </h1>
          <p className="text-muted-foreground text-lg max-w-[700px] mx-auto mb-6">
            Find curated newsletters for developers, software engineers, and tech professionals. Stay updated with top programming insights and industry news.
          </p>
          <div className="flex flex-col gap-4 md:flex-row justify-center items-center max-w-[700px] mx-auto text-sm text-muted-foreground">
            <span>✓ Hand-picked developer newsletters</span>
            <span>✓ Software engineering updates</span>
            <span>✓ Tech email digests</span>
          </div>
        </motion.div>
        
        {/* Category Overview Section */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-center">
            Top Newsletter Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[900px] mx-auto">
            <div className="p-4 rounded-lg border bg-card">
              <h3 className="font-semibold mb-2">Software Engineering</h3>
              <p className="text-sm text-muted-foreground">Latest programming trends, best practices, and coding insights.</p>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <h3 className="font-semibold mb-2">Tech Industry News</h3>
              <p className="text-sm text-muted-foreground">Stay informed about the latest developments in technology.</p>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <h3 className="font-semibold mb-2">Developer Tools</h3>
              <p className="text-sm text-muted-foreground">Discover new tools and resources for developers.</p>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <div className="mb-8">
          <h2 className="sr-only">Newsletter Filters</h2>
          <NewsletterFilters
            categories={categories}
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
            onCategoryChange={handleCategoryChange}
            onSearchChange={handleSearchChange}
          />
        </div>
        
        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div 
              className="rounded-md bg-destructive/20 p-4 text-destructive mb-6"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="flex items-center">
                <span>{error}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => fetchNewsletters(true)}
                  className="ml-auto"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span className="sr-only">Retry</span>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Loading state */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading newsletters...</p>
          </div>
        ) : (
          <>
            {/* Newsletters grid */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedCategory}-${searchQuery}-${page}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <NewsletterGrid 
                  newsletters={newsletters} 
                  isLoading={isLoading} 
                />
              </motion.div>
            </AnimatePresence>
            
            {/* Pagination controls */}
            {!isLoading && newsletters.length > 0 && (
              <motion.div 
                className="flex justify-between items-center mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Button 
                  variant="outline" 
                  onClick={handlePrevPage} 
                  disabled={page <= 1}
                  className="flex items-center gap-2"
                >
                  Previous
                </Button>
                <span className="text-sm font-medium">
                  Page {page} of {totalPages}
                </span>
                <Button 
                  variant="outline" 
                  onClick={handleNextPage} 
                  disabled={page >= totalPages}
                  className="flex items-center gap-2"
                >
                  Next
                </Button>
              </motion.div>
            )}
            
            {/* Empty state */}
            {!isLoading && newsletters.length === 0 && (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-muted-foreground text-lg mb-4">
                  No newsletters found matching your criteria.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedCategory(null);
                    setSearchQuery('');
                    setPage(1);
                  }}
                >
                  Clear Filters
                </Button>
              </motion.div>
            )}
          </>
        )}
      </section>
    </Layout>
  );
} 