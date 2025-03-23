
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function Index() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 container max-w-6xl py-10">
        <section className="py-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
            Create Professional Surveys with Ease
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Survey Mastery Toolkit helps you gather actionable insights from customers, employees, and stakeholders.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link to="/create">Create New Survey</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/surveys">View My Surveys</Link>
            </Button>
          </div>
        </section>
        
        <section className="py-12">
          <h2 className="text-3xl font-bold text-center mb-12">Our Core Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Easy Survey Creation</CardTitle>
                <CardDescription>Build surveys in minutes with our intuitive editor</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Create various question types including multiple choice, rating scales, and open-ended responses.</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="ghost">
                  <Link to="/create">Get Started</Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Advanced Analytics</CardTitle>
                <CardDescription>Turn responses into actionable insights</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Visualize survey data with interactive charts and graphs to identify trends and patterns.</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="ghost">
                  <Link to="/results">View Example</Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Multi-Channel Distribution</CardTitle>
                <CardDescription>Reach respondents wherever they are</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Distribute surveys via email, social media, QR codes, or embed them directly on your website.</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="ghost">
                  <Link to="/surveys">Learn More</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
