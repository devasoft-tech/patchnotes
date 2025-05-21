import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with environment variables
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// Newsletter type definition
export interface Newsletter {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  tags: string[];
  approved: boolean;
}

// Submission type definition
export interface NewsletterSubmission {
  title: string;
  url: string;
  description: string;
  category: string;
  tags: string[] | string;  // Allow tags to be either string[] or string
  email?: string;
}

// Function to fetch approved newsletters with pagination
export async function getApprovedNewsletters(
  page = 1, 
  pageSize = 21, 
  category?: string,
  searchQuery?: string
): Promise<{ newsletters: Newsletter[]; totalCount: number }> {
  try {
    // Calculate pagination range
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    // Start query builder
    let query = supabase
      .from('newsletters')
      .select('*', { count: 'exact' })
      .eq('approved', true)
      .order('title', { ascending: true })
      .range(from, to);
    
    // Add category filter if provided
    if (category) {
      query = query.eq('category', category);
    }
    
    // Add search filter if provided
    if (searchQuery) {
      // Search in title, description, or tags
      query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      // Note: For tags we would need a different approach since it's an array
      // We might use array_to_string(tags, ',') ilike '%search%' in PostgreSQL
    }
    
    // Execute the query
    const { data, error, count } = await query;
    
    if (error) throw error;
    
    // Transform to Newsletter objects
    const newsletters = data.map((item): Newsletter => ({
      id: item.id,
      title: item.title,
      description: item.description,
      url: item.url,
      category: item.category,
      tags: item.tags || [],
      approved: item.approved,
    }));

    return { 
      newsletters, 
      totalCount: count || 0 
    };
  } catch (error) {
    console.error('Error fetching newsletters:', error);
    throw new Error('Failed to fetch newsletters');
  }
}

// Function to submit a new newsletter
export async function submitNewsletter(submission: NewsletterSubmission): Promise<string> {
  try {
    // Ensure tags is an array
    const tags = Array.isArray(submission.tags) 
      ? submission.tags 
      : typeof submission.tags === 'string'
        ? submission.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        : [];
    
    // Insert into submissions table
    const { data, error } = await supabase
      .from('submissions')
      .insert({
        title: submission.title,
        url: submission.url,
        description: submission.description,
        category: submission.category,
        tags: tags,
        email: submission.email || null,
        approved: false,
      })
      .select('id')
      .single();

    if (error) throw error;
    
    return data.id;
  } catch (error) {
    console.error('Error submitting newsletter:', error);
    throw new Error('Failed to submit newsletter');
  }
}

export default {
  getApprovedNewsletters,
  submitNewsletter,
}; 