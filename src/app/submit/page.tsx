"use client";

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, CheckCircle2, Info, Link2, Tag, Mail, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Form validation schema
const formSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  url: z.string().url('Must be a valid URL').min(1, 'URL is required'),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(300, 'Description cannot exceed 300 characters'),
  category: z.string().min(1, 'Please select a category'),
  tags: z.string().min(1, 'At least one tag is required'),
  email: z.string().email('Invalid email format').optional().or(z.literal('')),
  honeypot: z.string().optional() // honeypot field for spam protection
});

// Categories updated for tech focus
const CATEGORIES = [
  'Development',
  'DevOps',
  'AI/ML',
  'Cloud',
  'Security',
  'Frontend',
  'Backend',
  'Mobile',
  'Data',
  'Other Tech'
];

export default function SubmitPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      url: '',
      description: '',
      category: '',
      tags: '',
      email: '',
      honeypot: '', // initialize honeypot field
    },
  });

  // Handle adding a tag
  const handleAddTag = () => {
    if (tagInput.trim()) {
      const newTag = tagInput.trim();
      
      // Check if tag already exists
      if (!tags.includes(newTag)) {
        const updatedTags = [...tags, newTag];
        setTags(updatedTags);
        form.setValue('tags', updatedTags.join(','));
      }
      
      setTagInput('');
    }
  };

  // Handle removing a tag
  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    setTags(updatedTags);
    form.setValue('tags', updatedTags.join(','));
  };

  // Handle tag input key press
  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      setSubmissionError(null);
      
      // Add tags to the form values
      values.tags = tags.join(',');
      
      const response = await fetch('/api/newsletter/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit newsletter');
      }
      
      setIsSuccess(true);
      form.reset();
      setTags([]);
    } catch (error) {
      setSubmissionError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container max-w-6xl px-4 py-12">
        {/* Enhanced Header Section */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-mono text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-emerald-500">
            Submit Your Newsletter
          </h1>
          <p className="text-muted-foreground text-lg max-w-[700px] mx-auto mb-6">
            Share your valuable tech insights with our community of developers and tech enthusiasts.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Badge variant="secondary" className="px-4 py-2">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Quick Review Process
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Tag className="w-4 h-4 mr-2" />
              Targeted Categories
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Link2 className="w-4 h-4 mr-2" />
              Direct Links
            </Badge>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form Section */}
          <div className="lg:col-span-2">
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-green-100 bg-green-50/50 dark:bg-green-900/10">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                      <CardTitle className="font-mono">Submission Successful!</CardTitle>
                    </div>
                    <CardDescription className="text-base">
                      Thank you for submitting your newsletter. We'll review it shortly.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-6 text-muted-foreground">
                      Your newsletter has been submitted for review. We'll add it to our directory once it's approved.
                      This process typically takes 1-2 business days.
                    </p>
                    <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                      <Button onClick={() => setIsSuccess(false)}>Submit Another</Button>
                      <Button variant="outline" asChild>
                        <a href="/">Explore Newsletters</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="font-mono flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Newsletter Details
                    </CardTitle>
                    <CardDescription>
                      Fill in the details below to submit your tech newsletter for our directory.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Hidden honeypot field */}
                        <input
                          type="text"
                          id="honeypot"
                          name="honeypot"
                          onChange={(e) => form.setValue('honeypot', e.target.value)}
                          style={{ display: 'none' }}
                          tabIndex={-1}
                          autoComplete="off"
                        />
                        
                        {/* Title with tooltip */}
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                Newsletter Name*
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Info className="w-4 h-4 text-muted-foreground" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Choose a clear, descriptive name for your newsletter</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input placeholder="Enter newsletter name" {...field} />
                                  <FileText className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground/50" />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {/* URL with icon */}
                        <FormField
                          control={form.control}
                          name="url"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                Website URL*
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Info className="w-4 h-4 text-muted-foreground" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>The main URL where users can subscribe to your newsletter</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input placeholder="https://your-newsletter.com" {...field} />
                                  <Link2 className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground/50" />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {/* Enhanced description field */}
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                Description*
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Info className="w-4 h-4 text-muted-foreground" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Briefly describe what makes your newsletter unique</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Short description of the newsletter (max 300 characters)" 
                                  {...field} 
                                  className="resize-none h-24 min-h-[96px]"
                                  maxLength={300}
                                />
                              </FormControl>
                              <div className="flex justify-end text-xs text-muted-foreground">
                                <span className={field.value.length > 250 ? "text-yellow-500" : ""}>
                                  {field.value.length}
                                </span>/300
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {/* Category with icon */}
                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                Category*
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Info className="w-4 h-4 text-muted-foreground" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Select the most relevant category for your newsletter</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {CATEGORIES.map(category => (
                                    <SelectItem key={category} value={category}>
                                      {category}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {/* Enhanced tags section */}
                        <FormField
                          control={form.control}
                          name="tags"
                          render={() => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                Tags*
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Info className="w-4 h-4 text-muted-foreground" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Add relevant tags to help users find your newsletter</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </FormLabel>
                              <div className="space-y-2">
                                <div className="flex">
                                  <div className="relative flex-grow">
                                    <Input
                                      placeholder="Add tags (press Enter or comma to add)"
                                      value={tagInput}
                                      onChange={(e) => setTagInput(e.target.value)}
                                      onKeyDown={handleTagKeyPress}
                                    />
                                    <Tag className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground/50" />
                                  </div>
                                  <Button 
                                    type="button" 
                                    variant="secondary" 
                                    onClick={handleAddTag}
                                    className="ml-2"
                                  >
                                    Add
                                  </Button>
                                </div>
                                
                                <div className="flex flex-wrap gap-2 mt-2 min-h-[40px] p-2 border rounded-md bg-muted/30">
                                  {tags.length === 0 && (
                                    <p className="text-sm text-muted-foreground italic">
                                      No tags added yet
                                    </p>
                                  )}
                                  
                                  {tags.map(tag => (
                                    <Badge key={tag} variant="secondary" className="px-2 py-1 animate-in fade-in">
                                      {tag}
                                      <button
                                        type="button"
                                        className="ml-1 text-xs font-medium hover:text-destructive focus:outline-none"
                                        onClick={() => handleRemoveTag(tag)}
                                      >
                                        ×
                                      </button>
                                    </Badge>
                                  ))}
                                </div>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />
                        
                        {/* Email field with icon */}
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center gap-2">
                                Email (optional)
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Info className="w-4 h-4 text-muted-foreground" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>We'll notify you when your newsletter is approved</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input placeholder="Your email address (optional)" {...field} />
                                  <Mail className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground/50" />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {/* Error message */}
                        <AnimatePresence>
                          {submissionError && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="rounded-md bg-destructive/20 p-4 text-destructive"
                            >
                              {submissionError}
                            </motion.div>
                          )}
                        </AnimatePresence>
                        
                        {/* Submit button */}
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Submitting...
                            </>
                          ) : "Submit Newsletter"}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Guidelines Section */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="font-mono text-lg flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Submission Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                    <p className="text-sm">Focus on technical content and insights relevant to developers</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                    <p className="text-sm">Ensure regular publishing schedule</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                    <p className="text-sm">Provide value through unique perspectives or curated content</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                    <p className="text-sm">Maintain professional quality and formatting</p>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-semibold mb-2">Review Process</h4>
                    <p className="text-sm text-muted-foreground">
                      We review all submissions within 1-2 business days to ensure quality and relevance for our developer community.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 