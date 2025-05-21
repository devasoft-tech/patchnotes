import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Globe, Users, BookOpen } from 'lucide-react';

export const metadata = {
  title: 'About',
  description: 'About PatchNotes - Your source for quality tech newsletters',
};

export default function AboutPage() {
  return (
    <div className="content-container">
      <div className="page-header">
        <h1 className="page-title font-mono">About PatchNotes</h1>
        <p className="page-description">
          Your source for quality tech newsletters
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <section className="mb-12">
          <Card className="border-0 shadow-none">
            <CardContent className="p-0 prose prose-slate dark:prose-invert max-w-none">
              <p className="text-lg">
                PatchNotes is a specialized platform designed for developers and tech professionals who want to stay updated with the latest in technology. 
                Our goal is to curate the best tech newsletters that deliver high signal, low noise content directly to your inbox.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4 font-mono">Our Mission</h2>
              <p>
                In the rapidly evolving tech landscape, staying informed without getting overwhelmed is crucial. 
                We believe that carefully selected newsletters are the best way to receive focused, expert-driven insights. 
                Our mission is to help developers and tech professionals discover newsletters that provide genuine value and keep their knowledge base patched and up to date.
              </p>
              
              <h2 className="text-2xl font-bold mt-8 mb-4 font-mono">How It Works</h2>
              <p>
                Newsletter creators can submit their tech-focused newsletters through our submission form. 
                Our team carefully reviews each submission to ensure it meets our quality standards and provides valuable insights to our tech-savvy audience. 
                Users can then discover newsletters that match their specific interests within software development, DevOps, AI, and other tech domains.
              </p>
            </CardContent>
          </Card>
        </section>
        
        <section className="grid gap-6 md:grid-cols-2 mb-12">
          <Card className="p-6">
            <div className="flex items-start mb-4">
              <Users className="h-6 w-6 mr-3 text-primary" />
              <h3 className="text-xl font-semibold font-mono">For Developers</h3>
            </div>
            <p className="text-muted-foreground">
              Find high-signal tech newsletters curated for developers. Our platform
              helps you discover content that keeps you updated with the latest
              developments, best practices, and industry insights.
            </p>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-start mb-4">
              <BookOpen className="h-6 w-6 mr-3 text-primary" />
              <h3 className="text-xl font-semibold font-mono">For Publishers</h3>
            </div>
            <p className="text-muted-foreground">
              Share your tech newsletter with an engaged audience of developers and tech professionals.
              Connect with readers who value high-quality, technical content.
            </p>
          </Card>
        </section>
        
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 font-mono">Contact Us</h2>
          <Card className="p-6">
            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-6">
              <div className="flex items-start">
                <Mail className="h-5 w-5 mr-2 text-primary" />
                <p>
                  <span className="font-medium block">Email</span>
                  <a href="mailto:hello@patchnotes.dev" className="text-muted-foreground hover:text-primary transition-colors">
                    hello@patchnotes.dev
                  </a>
                </p>
              </div>
              
              <div className="flex items-start">
                <Globe className="h-5 w-5 mr-2 text-primary" />
                <p>
                  <span className="font-medium block">Website</span>
                  <a href="https://patchnotes.dev" className="text-muted-foreground hover:text-primary transition-colors">
                    patchnotes.dev
                  </a>
                </p>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
} 