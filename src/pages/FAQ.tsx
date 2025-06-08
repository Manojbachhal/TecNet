
import React, { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navbar from '@/components/layout/Navbar';
import { Search } from 'lucide-react';

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const faqCategories = {
    general: [
      {
        question: "What is TacNet?",
        answer: "TacNet is a comprehensive platform for firearms enthusiasts, providing range finding services, ballistics calculations, inventory management, and a trading platform. Our goal is to combine advanced technology with practical tools to enhance your experience."
      },
      {
        question: "Do I need to create an account to use TacNet?",
        answer: "While some basic features are available without an account, most of our core functionality such as Range Finder, Ballistics Calculator, Inventory Management, and Trading require an account for personalized experiences and data storage."
      },
      {
        question: "Is TacNet available internationally?",
        answer: "Yes, TacNet is available worldwide. However, some features like Range Finder may have more comprehensive data in certain regions. We're constantly expanding our database to improve coverage globally."
      },
      {
        question: "What devices can I use TacNet on?",
        answer: "TacNet is accessible on any device with a web browser. Our responsive design ensures optimal experience on desktops, laptops, tablets, and mobile phones."
      }
    ],
    account: [
      {
        question: "How do I create an account?",
        answer: "To create an account, click on the 'Sign Up' button in the navigation bar. You'll need to provide a valid email address and create a password. You may also sign up using your Google or Facebook accounts for convenience."
      },
      {
        question: "How can I reset my password?",
        answer: "If you've forgotten your password, click on the 'Login' button, then select 'Forgot Password'. Enter your email address and follow the instructions sent to your email to reset your password."
      },
      {
        question: "Can I change my username or email?",
        answer: "Yes, you can change your username and update your email address in the Profile Settings page. Go to your profile and select 'Settings' to make these changes."
      },
      {
        question: "How do I delete my account?",
        answer: "To delete your account, go to Profile Settings and scroll to the bottom where you'll find the 'Delete Account' option. Please note that this action is permanent and all your data will be permanently removed from our systems."
      }
    ],
    features: [
      {
        question: "How accurate is the Range Finder?",
        answer: "Our Range Finder uses precise GPS data and a comprehensive database of shooting ranges. While we strive for maximum accuracy, we recommend contacting ranges directly to confirm operating hours and conditions before traveling."
      },
      {
        question: "Can I export my inventory data?",
        answer: "Yes, you can export your inventory data in CSV or JSON formats. This feature is available in the Inventory Management section under the 'Export' option."
      },
      {
        question: "How does the Ballistics Calculator work?",
        answer: "Our Ballistics Calculator uses advanced algorithms and physics models to provide accurate trajectory calculations. You can input variables such as bullet weight, muzzle velocity, environmental conditions, and more to get precise results."
      },
      {
        question: "Is my trading information secure?",
        answer: "Yes, we take security very seriously. All trading information is encrypted and stored securely. We never share your personal information with other users unless you explicitly choose to do so during a transaction."
      }
    ],
    tech: [
      {
        question: "What browsers are supported?",
        answer: "TacNet works on all modern browsers including Chrome, Firefox, Safari, and Edge. For optimal performance, we recommend keeping your browser updated to the latest version."
      },
      {
        question: "Does TacNet have a mobile app?",
        answer: "Currently, TacNet is available as a web application optimized for mobile use. We're working on native mobile apps for iOS and Android which will be available in the future."
      },
      {
        question: "Can I use TacNet offline?",
        answer: "Some features of TacNet require an internet connection. However, we're developing offline capabilities for certain functions like inventory management and ballistics calculations."
      },
      {
        question: "How do you handle data privacy?",
        answer: "We adhere to strict data privacy policies in compliance with GDPR and other regulations. Your data is encrypted, securely stored, and never sold to third parties. You can review our complete Privacy Policy for more details."
      }
    ]
  };

  // Filter FAQs based on search query
  const filterFAQs = (faqs) => {
    if (!searchQuery) return faqs;
    
    return faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-20 pb-10">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Find answers to the most common questions about TacNet and our services.
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input 
              className="pl-10 py-6" 
              placeholder="Search FAQs..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button 
                variant="ghost" 
                className="absolute right-1 top-1/2 transform -translate-y-1/2"
                onClick={() => setSearchQuery('')}
              >
                Clear
              </Button>
            )}
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          <Tabs defaultValue="general">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="tech">Technical</TabsTrigger>
            </TabsList>
            
            {Object.keys(faqCategories).map((category) => (
              <TabsContent key={category} value={category}>
                <Accordion type="single" collapsible className="w-full">
                  {filterFAQs(faqCategories[category]).map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                  {filterFAQs(faqCategories[category]).length === 0 && (
                    <div className="py-8 text-center">
                      <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
                      <Button 
                        variant="link" 
                        onClick={() => setSearchQuery('')}
                        className="mt-2"
                      >
                        Clear search
                      </Button>
                    </div>
                  )}
                </Accordion>
              </TabsContent>
            ))}
          </Tabs>
          
          <div className="mt-12 text-center">
            <p className="text-muted-foreground">
              Still have questions? We're here to help.
            </p>
            <Button 
              className="mt-4"
              onClick={() => window.location.href = '/contact'}
            >
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
