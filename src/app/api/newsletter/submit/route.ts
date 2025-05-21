import { NextResponse } from 'next/server';
import { submitNewsletter, NewsletterSubmission } from '@/lib/supabase';

// Rate limiting configuration
const RATE_LIMIT = 10; // submissions per hour
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const ipSubmissions = new Map<string, { count: number; timestamp: number }>();

interface RateLimitResult {
  limited: boolean;
  remainingTime: number;
}

// Helper function to check rate limit by IP
function isRateLimited(ip: string): RateLimitResult {
  const now = Date.now();
  const record = ipSubmissions.get(ip);
  
  // If no record or window expired, create new record
  if (!record || now - record.timestamp > RATE_WINDOW) {
    ipSubmissions.set(ip, { count: 1, timestamp: now });
    return { limited: false, remainingTime: 0 };
  }
  
  // If within window but under limit, increment
  if (record.count < RATE_LIMIT) {
    record.count += 1;
    return { limited: false, remainingTime: 0 };
  }
  
  // Calculate remaining time in minutes
  const remainingTime = Math.ceil((RATE_WINDOW - (now - record.timestamp)) / (60 * 1000));
  
  // Rate limited
  return { 
    limited: true,
    remainingTime
  };
}

// Clean up old rate limit records periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of ipSubmissions.entries()) {
    if (now - record.timestamp > RATE_WINDOW) {
      ipSubmissions.delete(ip);
    }
  }
}, RATE_WINDOW);

// POST endpoint to submit a new newsletter
export async function POST(request: Request) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') ||
               'unknown';
    
    // Check rate limit
    const rateLimitCheck = isRateLimited(ip);
    if (rateLimitCheck.limited) {
      return NextResponse.json(
        { 
          error: `Rate limit exceeded. Please try again in ${rateLimitCheck.remainingTime} minutes.`,
          retryAfter: rateLimitCheck.remainingTime
        },
        { 
          status: 429,
          headers: {
            'Retry-After': String(rateLimitCheck.remainingTime * 60)
          }
        }
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