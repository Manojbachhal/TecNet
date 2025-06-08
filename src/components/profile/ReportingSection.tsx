
import React, { useState } from "react";
import { AlertTriangle, SendIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const ReportingSection = () => {
  const { session } = useAuth();
  const [reportDetails, setReportDetails] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleReportSubmit = async () => {
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "You must be signed in to submit a report.",
        variant: "destructive"
      });
      return;
    }

    if (!reportDetails.trim()) {
      toast({
        title: "Report Details Missing",
        description: "Please provide details for your report.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create a structured report object
      const reportData = {
        type: "general",
        content: reportDetails.trim()
      };

      const { error } = await supabase
        .from('reports')
        .insert({
          reporter_id: session.user.id,
          report_type: "general",
          details: reportDetails.trim(), // Store as plain text for general reports
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Report Submitted",
        description: "Your report has been submitted. We'll review it shortly.",
      });

      // Reset state after successful submission
      setReportDetails('');
    } catch (error) {
      console.error('Error submitting report:', error);
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Report an Issue</CardTitle>
          <CardDescription>
            Submit a report about anything that concerns you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Always prioritize your safety</AlertTitle>
            <AlertDescription>
              If you believe you're in danger or witnessing illegal activity, please contact local law enforcement immediately.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-4 mt-4">
            <Textarea 
              placeholder="Describe the issue you'd like to report..."
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
              className="min-h-[150px]"
            />
            
            <Button 
              onClick={handleReportSubmit} 
              disabled={isSubmitting || !reportDetails.trim()}
              className="w-full"
            >
              {isSubmitting ? "Submitting..." : "Submit Report"}
              {!isSubmitting && <SendIcon className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Safety Guidelines</CardTitle>
          <CardDescription>
            Follow these best practices for safe transactions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">Meet in safe, public locations</h3>
            <p className="text-sm text-muted-foreground">
              Police station parking lots, shopping centers, or other public areas with security cameras are ideal for meeting to complete transactions.
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">Verify identities</h3>
            <p className="text-sm text-muted-foreground">
              Always ask to see a valid ID and carry permit when conducting firearm transactions.
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">Inspect thoroughly</h3>
            <p className="text-sm text-muted-foreground">
              Take time to inspect any firearm or accessory you're purchasing to verify its condition and authenticity.
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">Be cautious with payments</h3>
            <p className="text-sm text-muted-foreground">
              Avoid wire transfers, cryptocurrency, or other non-reversible payment methods when dealing with unknown parties.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportingSection;
