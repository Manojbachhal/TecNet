
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ListingItem } from '../types/tradingTypes';
import { requestItemAnalysis, createAnalysisPrompt } from '../utils/openaiService';

export const useItemAnalysis = (item: ListingItem | null) => {
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState('');
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [userApiKey, setUserApiKey] = useState('');
  
  useEffect(() => {
    // Fetch the OpenAI API key from Supabase config
    const fetchApiKey = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-config', {
          body: { key: 'OPENAI_API_KEY' }
        });
        
        if (error) {
          console.error('Error fetching API key:', error);
          return;
        }
        
        if (data && data.value) {
          setApiKey(data.value);
        }
      } catch (err) {
        console.error('Failed to fetch API key:', err);
      }
    };
    
    fetchApiKey();
  }, []);
  
  const analyzeItem = async () => {
    if (!item) return;
    
    setAnalysisLoading(true);
    setAnalysisResult('');
    
    // Determine which API key to use
    const keyToUse = apiKey || userApiKey;
    
    if (!keyToUse) {
      setShowApiKeyInput(true);
      setAnalysisLoading(false);
      return;
    }
    
    try {
      const prompt = createAnalysisPrompt(item);
      
      await requestItemAnalysis({
        prompt,
        apiKey: keyToUse,
        onSuccess: (result) => {
          setAnalysisResult(result);
        },
        onError: () => {
          setShowApiKeyInput(true);
        }
      });
    } catch (error: any) {
      console.error('Analysis error:', error);
      setShowApiKeyInput(true);
    } finally {
      setAnalysisLoading(false);
    }
  };
  
  // Reset result when item changes
  useEffect(() => {
    setAnalysisResult('');
  }, [item]);
  
  return {
    analysisLoading,
    analysisResult,
    showApiKeyInput,
    userApiKey,
    setUserApiKey,
    setShowApiKeyInput,
    analyzeItem
  };
};
