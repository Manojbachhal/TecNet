
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Navbar from '@/components/layout/Navbar';

export default function Privacy() {
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-20 pb-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="text-muted-foreground mt-2">Last updated: March 15, {currentYear}</p>
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardContent className="pt-6">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="lead">At TacNet, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.</p>
              
              <Separator className="my-6" />
              
              <h2 className="text-xl font-semibold mb-4">1. Information We Collect</h2>
              <p>We collect information from you when you register on our site, place an order, subscribe to a newsletter, respond to a survey, fill out a form, or enter information on our site.</p>
              <p>The personal information we may collect includes:</p>
              <ul className="list-disc pl-5 space-y-2 my-4">
                <li><strong>Personal Identification Information:</strong> Name, email address, phone number, billing address, and shipping address.</li>
                <li><strong>Payment Details:</strong> Credit card information or other payment details (processed securely through our payment processors).</li>
                <li><strong>User Content:</strong> Information you provide when using our services, such as inventory data, trading listings, or ballistics calculations.</li>
                <li><strong>Technical Data:</strong> IP address, browser type, device type, operating system, and other technical details when you visit our site.</li>
                <li><strong>Usage Data:</strong> Information about how you use our website and services, including pages visited, features used, and time spent.</li>
              </ul>
              
              <Separator className="my-6" />
              
              <h2 className="text-xl font-semibold mb-4">2. How We Use Your Information</h2>
              <p>We may use the information we collect from you in the following ways:</p>
              <ul className="list-disc pl-5 space-y-2 my-4">
                <li>To personalize your experience and deliver content and product offerings relevant to your interests.</li>
                <li>To improve our website and services based on the feedback and information we receive from you.</li>
                <li>To process transactions and send notifications about your transactions.</li>
                <li>To administer promotions, surveys, or other site features.</li>
                <li>To send periodic emails regarding your orders, products, services, or other information.</li>
                <li>To provide customer support and respond to your inquiries.</li>
              </ul>
              
              <Separator className="my-6" />
              
              <h2 className="text-xl font-semibold mb-4">3. Information Sharing</h2>
              <p>We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties except in the following cases:</p>
              <ul className="list-disc pl-5 space-y-2 my-4">
                <li>To trusted third parties who assist us in operating our website, conducting our business, or servicing you.</li>
                <li>When we believe disclosure is appropriate to comply with the law, enforce our site policies, or protect ours or others' rights, property, or safety.</li>
                <li>To a buyer or successor in the event of a merger, divestiture, restructuring, reorganization, or acquisition.</li>
              </ul>
              <p>Non-personally identifiable visitor information may be provided to other parties for marketing, advertising, or other uses.</p>
              
              <Separator className="my-6" />
              
              <h2 className="text-xl font-semibold mb-4">4. Data Security</h2>
              <p>We implement a variety of security measures to maintain the safety of your personal information when you place an order, enter, submit, or access your personal information. All sensitive information is transmitted via Secure Socket Layer (SSL) technology and then encrypted into our database to be only accessed by those authorized with special access rights to our systems.</p>
              
              <Separator className="my-6" />
              
              <h2 className="text-xl font-semibold mb-4">5. Cookies and Tracking Technologies</h2>
              <p>We use cookies, web beacons, and similar technologies to enhance your experience on our site. Cookies are small files that a site or its service provider transfers to your computer's hard drive through your web browser that enables the site to recognize your browser and capture and remember certain information.</p>
              <p>We use cookies to understand and save your preferences for future visits, keep track of advertisements, and compile aggregate data about site traffic and site interaction.</p>
              
              <Separator className="my-6" />
              
              <h2 className="text-xl font-semibold mb-4">6. Data Retention</h2>
              <p>We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our policies.</p>
              
              <Separator className="my-6" />
              
              <h2 className="text-xl font-semibold mb-4">7. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-5 space-y-2 my-4">
                <li>Access your personal data</li>
                <li>Request correction of your personal data</li>
                <li>Request deletion of your personal data</li>
                <li>Object to processing of your personal data</li>
                <li>Request restriction of processing your personal data</li>
                <li>Request transfer of your personal data</li>
                <li>Withdraw consent</li>
              </ul>
              
              <Separator className="my-6" />
              
              <h2 className="text-xl font-semibold mb-4">8. Children's Privacy</h2>
              <p>Our service is not intended for use by children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us so that we can take necessary actions.</p>
              
              <Separator className="my-6" />
              
              <h2 className="text-xl font-semibold mb-4">9. Changes to This Privacy Policy</h2>
              <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy.</p>
              <p>You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>
              
              <Separator className="my-6" />
              
              <h2 className="text-xl font-semibold mb-4">10. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us at privacy@tacnet.com.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
