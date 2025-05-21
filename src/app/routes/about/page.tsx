"use client";

import { Layout } from '@/components/layout/Layout';

export default function AboutPage() {
  return (
    <Layout>
      <section className="container py-8 md:py-12 max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="font-bold text-3xl md:text-4xl mb-3">
            About PatchNotes
          </h1>
          <p className="text-muted-foreground text-lg max-w-[700px] mx-auto">
            A curated platform for discovering quality newsletters
          </p>
        </div>
        
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p>
            PatchNotes is a platform designed to help readers find high-quality newsletters across various topics and interests. 
            Our goal is to create a centralized directory where newsletter creators can showcase their work and readers can discover content that matches their interests.
          </p>
          
          <h2>Our Mission</h2>
          <p>
            In an age of information overload, finding quality content can be challenging. 
            We believe that curated newsletters offer a valuable way to receive focused, expert-driven content directly in your inbox. 
            Our mission is to connect readers with the best newsletters and help newsletter creators reach their ideal audience.
          </p>
          
          <h2>How It Works</h2>
          <p>
            Anyone can submit a newsletter to our directory using the submission form. 
            Our team reviews each submission to ensure it meets our quality standards before adding it to the public directory. 
            Users can then browse, search, and filter newsletters by category or topic to find content that interests them.
          </p>
          
          <h2>Contact Us</h2>
          <p>
            Have questions, suggestions, or feedback? We'd love to hear from you! 
            You can reach our team at <a href="mailto:contact@newsletterdiscovery.com">contact@newsletterdiscovery.com</a>.
          </p>
        </div>
      </section>
    </Layout>
  );
} 