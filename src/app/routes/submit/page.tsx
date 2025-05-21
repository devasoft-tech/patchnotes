"use client";

import { Layout } from '@/components/layout/Layout';
import { NewsletterSubmissionForm } from '@/components/forms/NewsletterSubmissionForm';

export default function SubmitPage() {
  return (
    <Layout>
      <section className="container py-8 md:py-12 max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="font-bold text-3xl md:text-4xl mb-3">
            Submit Your Newsletter
          </h1>
          <p className="text-muted-foreground text-lg">
            Add your newsletter to our directory for others to discover.
          </p>
        </div>
        
        <div className="border rounded-lg p-6 bg-card">
          <NewsletterSubmissionForm />
        </div>
      </section>
    </Layout>
  );
} 