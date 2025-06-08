
import React from 'react';
import { Loader2, Copy, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';

interface AnalysisContentProps {
  analysisLoading: boolean;
  analysisResult: string;
  onRegenerateAnalysis: () => void;
}

export default function AnalysisContent({
  analysisLoading,
  analysisResult,
  onRegenerateAnalysis
}: AnalysisContentProps) {
  const { toast } = useToast();
  
  const copyToClipboard = () => {
    if (analysisResult) {
      navigator.clipboard.writeText(analysisResult);
      toast({
        title: "Copied to clipboard",
        description: "Analysis has been copied to your clipboard.",
      });
    }
  };
  
  if (analysisLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Analyzing market value and details...</p>
      </div>
    );
  }
  
  if (analysisResult) {
    return (
      <div className="space-y-4">
        <div className="bg-muted p-4 rounded-md overflow-y-auto max-h-[400px] whitespace-pre-line text-sm">
          {analysisResult}
        </div>
        <div className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={copyToClipboard}
            className="flex items-center gap-1"
          >
            <Copy className="h-4 w-4 mr-1" />
            Copy Analysis
          </Button>
        </div>
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onRegenerateAnalysis}
          >
            Regenerate Analysis
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="text-center py-8">
      <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
      <p className="text-muted-foreground mb-4">Click Analyze to get price comparison, market insights, and buyer's tips</p>
    </div>
  );
}
