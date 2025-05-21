import Airtable from 'airtable';

// Initialize Airtable with API key from environment
const airtable = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
});

// Get base with ID from environment
const base = airtable.base(process.env.AIRTABLE_BASE_ID || '');

// Get tables
const newslettersTable = base(process.env.AIRTABLE_NEWSLETTERS_TABLE || 'Newsletters');
const submissionsTable = base(process.env.AIRTABLE_SUBMISSIONS_TABLE || 'Submissions');

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
  tags: string[];
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
    // Initialize filter formula
    let filterFormula = '{Approved} = 1';
    
    // Add category filter if provided
    if (category) {
      filterFormula = `AND(${filterFormula}, {Category} = '${category}')`;
    }
    
    // Add search filter if provided
    if (searchQuery) {
      const searchTerm = searchQuery.replace(/'/g, "\\'");
      const searchFilter = `OR(
        SEARCH('${searchTerm}', LOWER({Title})),
        SEARCH('${searchTerm}', LOWER({Description})),
        SEARCH('${searchTerm}', LOWER(ARRAYJOIN({Tags}, ",")))
      )`;
      filterFormula = `AND(${filterFormula}, ${searchFilter})`;
    }

    // Calculate offsets for pagination
    const offset = (page - 1) * pageSize;
    
    // Get total count first
    const countResult = await newslettersTable.select({
      filterByFormula: filterFormula,
    }).all();
    
    const totalCount = countResult.length;
    
    // Then get paginated results
    const records = await newslettersTable.select({
      filterByFormula: filterFormula,
      sort: [{ field: 'Title', direction: 'asc' }],
      maxRecords: pageSize,
      offset: offset,
    }).all();

    // Map records to Newsletter objects
    const newsletters = records.map((record): Newsletter => ({
      id: record.id,
      title: record.get('Title') as string,
      description: record.get('Description') as string,
      url: record.get('URL') as string,
      category: record.get('Category') as string,
      tags: (record.get('Tags') as string[] || []),
      approved: !!record.get('Approved'),
    }));

    return { newsletters, totalCount };
  } catch (error) {
    console.error('Error fetching newsletters:', error);
    throw new Error('Failed to fetch newsletters');
  }
}

// Function to submit a new newsletter
export async function submitNewsletter(submission: NewsletterSubmission): Promise<string> {
  try {
    const record = await submissionsTable.create({
      Title: submission.title,
      URL: submission.url, 
      Description: submission.description,
      Category: submission.category,
      Tags: submission.tags,
      Email: submission.email || '',
      Approved: false, // New submissions start as unapproved
      SubmittedAt: new Date().toISOString(),
    });

    return record.id;
  } catch (error) {
    console.error('Error submitting newsletter:', error);
    throw new Error('Failed to submit newsletter');
  }
}

export default {
  getApprovedNewsletters,
  submitNewsletter,
}; 