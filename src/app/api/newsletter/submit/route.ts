import { NextResponse } from 'next/server';
import { submitNewsletter, NewsletterSubmission } from '@/lib/supabase';

// Simple rate limiting with in-memory storage (for demo purposes)
// In production, use Redis or a proper rate limiting solution
const RATE_LIMIT = 5; // submissions per 10 minutes
const RATE_WINDOW = 10 * 60 * 1000; // 10 minutes in milliseconds
const ipSubmissions = new Map<string, { count: number; timestamp: number }>();

// Helper function to check rate limit by IP
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = ipSubmissions.get(ip);
  
  // If no record or window expired, create new record
  if (!record || now - record.timestamp > RATE_WINDOW) {
    ipSubmissions.set(ip, { count: 1, timestamp: now });
    return false;
  }
  
  // If within window but under limit, increment
  if (record.count < RATE_LIMIT) {
    record.count += 1;
    return false;
  }
  
  // Rate limited
  return true;
}

// POST endpoint to submit a new newsletter
export async function POST(request: Request) {
  try {
    // Get client IP for rate limiting
    // In production, you would use proper headers like X-Forwarded-For
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    
    // Check rate limit
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many submissions. Please try again later.' },
        { status: 429 }
      );
    }
    
    // Parse request body
    const body = await request.json();
    
    // Extract honeypot field
    const { honeypot, ...submission } = body;
    
    // Check honeypot (simple anti-spam)
    if (honeypot) {
      // Quietly accept but don't process (honeypot triggered)
      return NextResponse.json({ success: true });
    }
    
    // Validate required fields
    const requiredFields = ['title', 'url', 'description', 'category', 'tags'];
    for (const field of requiredFields) {
      if (!submission[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Validate URL
    try {
      new URL(submission.url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }
    
    // Validate description length
    if (submission.description.length > 300) {
      return NextResponse.json(
        { error: 'Description exceeds maximum length of 300 characters' },
        { status: 400 }
      );
    }
    
    // Submit to Supabase
    const id = await submitNewsletter(submission as NewsletterSubmission);
    
    return NextResponse.json({ 
      success: true,
      id,
      message: 'Newsletter submitted successfully. It will be reviewed before being listed.',
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to submit newsletter' },
      { status: 500 }
    );
  }
} 