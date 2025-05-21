import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { title, url } = await request.json();

    if (!title || !url) {
      return NextResponse.json(
        { error: 'Title and URL are required' },
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });

    // Call the database function to check for duplicates
    const { data, error } = await supabase
      .rpc('check_newsletter_exists', {
        p_title: title,
        p_url: url
      });

    if (error) {
      console.error('Error checking for duplicates:', error);
      return NextResponse.json(
        { error: 'Failed to check for duplicates' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in check-duplicate route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 