
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FirearmItem } from './InventoryItem';
import { useToast } from '@/hooks/use-toast';
import { Brain, Loader2, Copy } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AnalysisDialogProps {
  isOpen: boolean;
  onClose: () => void;
  item: FirearmItem | null;
}

export default function AnalysisDialog({ isOpen, onClose, item }: AnalysisDialogProps) {
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [apiKeyError, setApiKeyError] = useState<boolean>(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Fetch the OpenAI API key from Supabase config
    const fetchApiKey = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-config', {
          body: { key: 'OPENAI_API_KEY' }
        });
        
        if (error) {
          console.error('Error fetching API key:', error);
          setApiKeyError(true);
          return;
        }
        
        if (data && data.value) {
          setApiKey(data.value);
          setApiKeyError(false);
        } else {
          setApiKeyError(true);
        }
      } catch (err) {
        console.error('Failed to fetch API key:', err);
        setApiKeyError(true);
      }
    };
    
    fetchApiKey();
  }, []);

  // Function to clean the markdown formatting and normalize text
  const cleanMarkdownFormatting = (text: string): string => {
    return text
      .replace(/#{1,6}\s/g, '') // Remove headings (#, ##, etc.)
      .replace(/\*\*/g, '') // Remove bold formatting
      .replace(/\*/g, '') // Remove italics/bullet points
      .replace(/- /g, '• ') // Replace markdown lists with bullets
      .replace(/\n{3,}/g, '\n\n') // Replace multiple line breaks with double line breaks
      .replace(/\t/g, '  ') // Replace tabs with spaces
      .replace(/`/g, '') // Remove code backticks
      .replace(/_/g, '') // Remove underscores
      .replace(/\[(.*?)\]\((.*?)\)/g, '$1') // Replace markdown links with just the text
      .split('\n')
      .map(line => line.trim())
      .join('\n');
  };

  const analyzeFirearm = async () => {
    if (!item) return;
    if (!apiKey) {
      toast({
        title: "API Key Missing",
        description: "OpenAI API key is not configured. Please contact your administrator.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    setAnalysis('');
    
    try {
      // Format the prompt with the item details
      const prompt = `Analyze this firearm in detail:
      Make: ${item.make}
      Model: ${item.model}
      Caliber: ${item.caliber}
      Condition: ${item.condition}
      Purchase Date: ${item.purchaseDate}
      Value: $${item.value}
      Notes: ${item.notes || 'None'}
      
      Please provide a thorough tactical analysis including:
      1. A brief overview and history of this make and model
      2. Technical specifications and performance characteristics
      3. Tactical applications and usage scenarios
      4. Comparable models in the same class
      5. Recommended accessories and modifications
      6. Current market value assessment including collector value if applicable
      7. Maintenance recommendations specific to this model
      8. Known reliability issues or advantages
      9. Any special considerations for this particular firearm
      
      IMPORTANT FORMATTING INSTRUCTIONS:
      - Format your response in pure plain text only
      - Do not use any markdown whatsoever
      - No asterisks, hashes, underscores, or any special formatting
      - Use simple section headers with line breaks
      - Use bullet points with • symbol only where needed
      - Break sections with blank lines
      - Keep paragraphs short and readable`;
      
      // Call OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { 
              role: 'system', 
              content: 'You are a tactical firearms expert that provides detailed analysis. Format your response in plain text only without any markdown formatting. Use simple section headers with blank lines between sections. Avoid any special characters like asterisks, hash symbols, or formatting marks. Use bullet points with the • symbol only where appropriate.' 
            },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7
        })
      });
      
      const data = await response.json();
      
      if (data.error) {
        toast({
          title: "API Error",
          description: data.error.message || "Error connecting to OpenAI",
          variant: "destructive"
        });
        return;
      }
      
      let analysisText = data.choices?.[0]?.message?.content || "Unable to generate analysis";
      
      // Clean up any remaining markdown formatting
      analysisText = cleanMarkdownFormatting(analysisText);
      
      setAnalysis(analysisText);
      
      toast({
        title: "Analysis Complete",
        description: "AI tactical analysis has been generated successfully.",
      });
      
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "There was an error connecting to the AI service. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const copyToClipboard = () => {
    if (analysis) {
      navigator.clipboard.writeText(analysis);
      toast({
        title: "Copied to clipboard",
        description: "Analysis has been copied to your clipboard.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            {item ? `Tactical Analysis: ${item.make} ${item.model}` : 'Tactical Analysis'}
          </DialogTitle>
          <DialogDescription>
            Get an in-depth tactical and technical analysis powered by AI
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Generating tactical analysis...</p>
            </div>
          ) : analysis ? (
            <div className="space-y-4">
              <div 
                className="bg-muted p-4 rounded-md overflow-y-auto max-h-[400px] whitespace-pre-line text-sm leading-relaxed"
              >
                {analysis}
              </div>
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={copyToClipboard}
                  className="flex items-center gap-1"
                >
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>
              </div>
            </div>
          ) : apiKeyError ? (
            <div className="text-center py-8">
              <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">OpenAI API key is not configured. Please contact your administrator.</p>
            </div>
          ) : (
            <div className="text-center py-8">
              <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">Get a comprehensive tactical analysis for this item including specs, history, and practical applications</p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button 
            onClick={analyzeFirearm} 
            disabled={loading || apiKeyError}
            className="gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {analysis ? 'Regenerate Analysis' : 'Analyze'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
