import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

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

// Categories
const CATEGORIES = [
  'Tech', 
  'Design', 
  'Business', 
  'AI', 
  'Marketing', 
  'Finance', 
  'Health', 
  'Science', 
  'Culture', 
  'Other'
];

export function NewsletterSubmissionForm() {
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

  // If submission was successful, show thank you message
  if (isSuccess) {
    return (
      <div className="text-center py-10">
        <h3 className="font-semibold text-2xl mb-4">Thank you for your submission!</h3>
        <p className="mb-6 text-muted-foreground max-w-md mx-auto">
          Your newsletter has been submitted for review. We'll add it to our directory once it's approved.
        </p>
        <Button onClick={() => setIsSuccess(false)}>Submit Another</Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Hidden honeypot field for spam protection */}
        <input
          type="text"
          id="honeypot"
          name="honeypot"
          onChange={(e) => form.setValue('honeypot', e.target.value)}
          style={{ display: 'none' }}
          tabIndex={-1}
          autoComplete="off"
        />
        
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Newsletter Name*</FormLabel>
              <FormControl>
                <Input placeholder="Enter newsletter name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* URL */}
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website URL*</FormLabel>
              <FormControl>
                <Input placeholder="https://your-newsletter.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description*</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Short description of the newsletter (max 300 characters)" 
                  {...field} 
                  className="resize-none h-24"
                  maxLength={300}
                />
              </FormControl>
              <div className="flex justify-end text-xs text-muted-foreground">
                {field.value.length}/300
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Category */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category*</FormLabel>
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
        
        {/* Tags */}
        <FormField
          control={form.control}
          name="tags"
          render={() => (
            <FormItem>
              <FormLabel>Tags*</FormLabel>
              <div className="space-y-2">
                <div className="flex">
                  <Input
                    placeholder="Add tags (press Enter or comma to add)"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyPress}
                    className="flex-grow"
                  />
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={handleAddTag}
                    className="ml-2"
                  >
                    Add
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.length === 0 && (
                    <p className="text-sm text-muted-foreground italic">
                      No tags added yet
                    </p>
                  )}
                  
                  {tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="px-2 py-1">
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
        
        {/* Email (optional) */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email (optional)</FormLabel>
              <FormControl>
                <Input placeholder="Your email address (optional)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Error message */}
        {submissionError && (
          <div className="text-sm font-medium text-destructive">{submissionError}</div>
        )}
        
        {/* Submit button */}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Newsletter"}
        </Button>
      </form>
    </Form>
  );
} 