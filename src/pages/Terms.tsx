
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Navbar from '@/components/layout/Navbar';

export default function Terms() {
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto  px-4 pt-20 pb-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
          <p className="text-muted-foreground mt-2">Last updated: March 15, {currentYear}</p>
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardContent className="pt-6">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
              <p>Welcome to TacNet ("Company", "we", "our", "us")! These Terms of Service ("Terms", "Terms of Service") govern your use of our website located at www.tacnet.com (together or individually "Service") operated by TacNet.</p>
              <p>Our Privacy Policy also governs your use of our Service and explains how we collect, safeguard and disclose information that results from your use of our web pages. Your agreement with us includes these Terms and our Privacy Policy ("Agreements"). You acknowledge that you have read and understood Agreements, and agree to be bound by them.</p>
              <p>If you do not agree with (or cannot comply with) Agreements, then you may not use the Service, but please let us know by emailing at support@tacnet.com so we can try to find a solution. These Terms apply to all visitors, users and others who wish to access or use Service.</p>
              
              <Separator className="my-6" />
              
              <h2 className="text-xl font-semibold mb-4">2. Communications</h2>
              <p>By using our Service, you agree to subscribe to newsletters, marketing or promotional materials and other information we may send. However, you may opt out of receiving any, or all, of these communications from us by following the unsubscribe link or by emailing at support@tacnet.com.</p>
              
              <Separator className="my-6" />
              
              <h2 className="text-xl font-semibold mb-4">3. Purchases</h2>
              <p>If you wish to purchase any product or service made available through Service ("Purchase"), you may be asked to supply certain information relevant to your Purchase including but not limited to, your credit or debit card number, the expiration date of your card, your billing address, and your shipping information.</p>
              <p>You represent and warrant that: (i) you have the legal right to use any card(s) or other payment method(s) in connection with any Purchase; and that (ii) the information you supply to us is true, correct and complete.</p>
              <p>We reserve the right to refuse or cancel your order at any time for reasons including but not limited to: product or service availability, errors in the description or price of the product or service, error in your order or other reasons.</p>
              
              <Separator className="my-6" />
              
              <h2 className="text-xl font-semibold mb-4">4. Prohibited Uses</h2>
              <p>You may use Service only for lawful purposes and in accordance with Terms. You agree not to use Service:</p>
              <ul className="list-disc pl-5 space-y-2 my-4">
                <li>In any way that violates any applicable national or international law or regulation.</li>
                <li>For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way by exposing them to inappropriate content or otherwise.</li>
                <li>To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail", "chain letter," "spam," or any other similar solicitation.</li>
                <li>To impersonate or attempt to impersonate Company, a Company employee, another user, or any other person or entity.</li>
                <li>In any way that infringes upon the rights of others, or in any way is illegal, threatening, fraudulent, or harmful, or in connection with any unlawful, illegal, fraudulent, or harmful purpose or activity.</li>
              </ul>
              
              <Separator className="my-6" />
              
              <h2 className="text-xl font-semibold mb-4">5. Content</h2>
              <p>Content found on or through this Service are the property of TacNet or used with permission. You may not distribute, modify, transmit, reuse, download, repost, copy, or use said Content, whether in whole or in part, for commercial purposes or for personal gain, without express advance written permission from us.</p>
              
              <Separator className="my-6" />
              
              <h2 className="text-xl font-semibold mb-4">6. Disclaimer of Warranty</h2>
              <p>These services are provided by the company on an "as is" and "as available" basis. The company makes no representations or warranties of any kind, express or implied, as to the operation of their services, or the information, content or materials included therein. You expressly agree that your use of these services, their content, and any services or items obtained from us is at your sole risk.</p>
              
              <Separator className="my-6" />
              
              <h2 className="text-xl font-semibold mb-4">7. Governing Law</h2>
              <p>These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.</p>
              <p>Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.</p>
              
              <Separator className="my-6" />
              
              <h2 className="text-xl font-semibold mb-4">8. Changes to Terms</h2>
              <p>We reserve the right to modify these terms from time to time at our sole discretion. Therefore, you should review these pages periodically. Your continued use of the Service after the posting of revised Terms means that you accept and agree to the changes.</p>
              
              <Separator className="my-6" />
              
              <h2 className="text-xl font-semibold mb-4">9. Contact Us</h2>
              <p>If you have any questions about these Terms, please contact us at support@tacnet.com.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
