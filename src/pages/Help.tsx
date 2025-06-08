
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navbar from '@/components/layout/Navbar';
import { Search, Book, FileText, MessageSquare, HeadphonesIcon, ShieldCheck } from 'lucide-react';

export default function Help() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-20 pb-10">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight">Help Center</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Find answers to common questions, learn about our features, or get in touch with our support team.</p>
        </div>

        <div className="max-w-3xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input 
              className="pl-10 py-6" 
              placeholder="Search for help articles, topics, or questions..." 
            />
            <Button className="absolute right-1 top-1/2 transform -translate-y-1/2">
              Search
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center gap-4">
              <Book className="h-8 w-8 text-primary" />
              <div>
                <CardTitle>Guides & Tutorials</CardTitle>
                <CardDescription>Step-by-step instructions for using TacNet</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li><a href="#" className="text-primary hover:underline">Getting Started with Range Finder</a></li>
                <li><a href="#" className="text-primary hover:underline">Ballistics Calculator Guide</a></li>
                <li><a href="#" className="text-primary hover:underline">Managing Your Inventory</a></li>
                <li><a href="#" className="text-primary hover:underline">Trading Platform Tutorial</a></li>
                <li><a href="#" className="text-primary hover:underline">View all guides →</a></li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center gap-4">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <CardTitle>Documentation</CardTitle>
                <CardDescription>Detailed documentation for all features</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li><a href="#" className="text-primary hover:underline">API Reference</a></li>
                <li><a href="#" className="text-primary hover:underline">Data Export & Import</a></li>
                <li><a href="#" className="text-primary hover:underline">Account Settings</a></li>
                <li><a href="#" className="text-primary hover:underline">Security Features</a></li>
                <li><a href="#" className="text-primary hover:underline">View all docs →</a></li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center gap-4">
              <MessageSquare className="h-8 w-8 text-primary" />
              <div>
                <CardTitle>Community</CardTitle>
                <CardDescription>Join discussions with other members</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li><a href="#" className="text-primary hover:underline">Forum Discussions</a></li>
                <li><a href="#" className="text-primary hover:underline">Feature Requests</a></li>
                <li><a href="#" className="text-primary hover:underline">Show & Tell</a></li>
                <li><a href="#" className="text-primary hover:underline">Tips & Tricks</a></li>
                <li><a href="#" className="text-primary hover:underline">Visit community →</a></li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center gap-4">
              <HeadphonesIcon className="h-8 w-8 text-primary" />
              <div>
                <CardTitle>Contact Support</CardTitle>
                <CardDescription>Get help from our support team</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Our support team is available Monday through Friday, 9am-5pm PST.</p>
              <Button variant="outline" className="w-full" onClick={() => window.location.href = '/contact'}>
                Contact Support
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center gap-4">
              <ShieldCheck className="h-8 w-8 text-primary" />
              <div>
                <CardTitle>FAQ</CardTitle>
                <CardDescription>Frequently asked questions</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Find answers to common questions about our services, account management, and more.</p>
              <Button variant="outline" className="w-full" onClick={() => window.location.href = '/faq'}>
                View FAQs
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
