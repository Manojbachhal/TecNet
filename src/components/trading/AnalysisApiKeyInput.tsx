
import React from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';

interface AnalysisApiKeyInputProps {
  userApiKey: string;
  setUserApiKey: (key: string) => void;
  onContinue: () => void;
  apiKeyExists: boolean;
}

export default function AnalysisApiKeyInput({
  userApiKey,
  setUserApiKey,
  onContinue,
  apiKeyExists
}: AnalysisApiKeyInputProps) {
  const { toast } = useToast();
  
  const handleContinue = () => {
    if (userApiKey.trim().startsWith('sk-')) {
      onContinue();
    } else {
      toast({
        title: "Invalid API Key",
        description: "Please enter a valid OpenAI API key starting with 'sk-'",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          {apiKeyExists ? 
            "There was an issue with the system API key. Please enter your OpenAI API key to use this feature." :
            "Please enter your OpenAI API key to use this feature. Your key is only used for this request and is not stored."}
        </p>
        <input
          type="password"
          className="w-full px-3 py-2 border rounded-md"
          placeholder="sk-..."
          value={userApiKey}
          onChange={(e) => setUserApiKey(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Don't have an API key? <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Get one here</a>
        </p>
      </div>
      <Button onClick={handleContinue} className="w-full">
        Continue with API Key
      </Button>
    </div>
  );
}
