
import { cleanMarkdownFormatting } from './imageUtils';
import { toast } from '@/hooks/use-toast';

interface AnalysisRequestOptions {
  prompt: string;
  apiKey: string;
  onSuccess: (result: string) => void;
  onError: () => void;
}

export const requestItemAnalysis = async ({
  prompt,
  apiKey,
  onSuccess,
  onError,
}: AnalysisRequestOptions): Promise<void> => {
  // Create an abort controller for timeout functionality
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
  
  try {
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
            content: 'You are an expert that provides detailed market analysis and practical advice for buyers looking at various items. Format your response in plain text using sections with clear headers. Do not use markdown formatting like asterisks, hash symbols, or dashes.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7
      }),
      signal: controller.signal
    });
    
    // Clear the timeout since the request completed
    clearTimeout(timeoutId);
    
    // Check if the response is ok before trying to parse JSON
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API returned ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      console.error('OpenAI API error:', data.error);
      toast({
        title: "API Error",
        description: data.error.message || "Error connecting to OpenAI",
        variant: "destructive"
      });
      
      if (data.error.code === 'invalid_api_key') {
        onError();
      }
      
      return;
    }
    
    let analysisText = data.choices?.[0]?.message?.content || "Unable to generate analysis";
    analysisText = cleanMarkdownFormatting(analysisText);
    onSuccess(analysisText);
  } catch (fetchError: any) {
    if (fetchError.name === 'AbortError') {
      console.error('Request timed out');
      toast({
        title: "Request Timeout",
        description: "The analysis request took too long. Please try again.",
        variant: "destructive"
      });
    } else {
      throw fetchError; // rethrow to be caught by the outer try-catch
    }
  }
};

export const createAnalysisPrompt = (item: {
  title: string;
  price: number;
  condition: string;
  location: string;
  description: string;
}): string => {
  return `Analyze this trading item in detail:
    Title: ${item.title}
    Price: $${item.price}
    Condition: ${item.condition}
    Location: ${item.location}
    Description: ${item.description}
    
    Please provide:
    1. A market analysis of this item's price (is it fair, overpriced, or a bargain?)
    2. Common uses and popularity of this item
    3. Known issues or considerations for this type of item
    4. Comparable alternatives that might be available
    5. Suggested questions to ask the seller
    6. What to look for when inspecting this type of item
    
    Important: Format your response in plain text with no markdown formatting. Use simple section headers, avoid asterisks, hash symbols, and other markdown syntax.`;
};
