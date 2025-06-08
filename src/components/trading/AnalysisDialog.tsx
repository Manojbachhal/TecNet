
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Target } from "lucide-react";
import { ListingItem } from './types/tradingTypes';
import { useItemAnalysis } from './hooks/useItemAnalysis';
import AnalysisApiKeyInput from './AnalysisApiKeyInput';
import AnalysisContent from './AnalysisContent';

interface AnalysisDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  item: ListingItem | null;
}

export default function AnalysisDialog({ isOpen, onOpenChange, item }: AnalysisDialogProps) {
  const {
    analysisLoading,
    analysisResult,
    showApiKeyInput,
    userApiKey,
    setUserApiKey,
    setShowApiKeyInput,
    analyzeItem
  } = useItemAnalysis(item);
  
  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Market Analysis: {item.title}
          </DialogTitle>
          <DialogDescription>
            AI-powered market analysis and buyer's guide
          </DialogDescription>
        </DialogHeader>
        
        {showApiKeyInput ? (
          <AnalysisApiKeyInput 
            userApiKey={userApiKey}
            setUserApiKey={setUserApiKey}
            onContinue={() => {
              setShowApiKeyInput(false);
              analyzeItem();
            }}
            apiKeyExists={!!userApiKey}
          />
        ) : (
          <>
            <div className="py-4">
              <AnalysisContent 
                analysisLoading={analysisLoading}
                analysisResult={analysisResult}
                onRegenerateAnalysis={analyzeItem}
              />
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              <Button 
                onClick={analyzeItem} 
                disabled={analysisLoading}
              >
                {analysisResult ? 'Regenerate Analysis' : 'Analyze Item'}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
