import { NextResponse } from 'next/server';
import { getApprovedNewsletters } from '@/lib/supabase';

// GET endpoint to fetch approved newsletters
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '21');
    
    // Parse filter parameters
    const category = searchParams.get('category') || undefined;
    const searchQuery = searchParams.get('search') || undefined;
    
    const { newsletters, totalCount } = await getApprovedNewsletters(
      page,
      pageSize,
      category,
      searchQuery
    );
    
    return NextResponse.json({
      newsletters,
      pagination: {
        page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch newsletters' },
      { status: 500 }
    );
  }
} 