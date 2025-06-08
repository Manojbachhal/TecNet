
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { NewsApiResponse, NewsItem } from '../types/newsTypes';
import { useToast } from '@/hooks/use-toast';

export function useNews(initialQuery: string = "firearms") {
  const [query, setQuery] = useState<string>(initialQuery);
  const [category, setCategory] = useState<string | null>(null);
  const [newsData, setNewsData] = useState<NewsApiResponse | null>(null);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  const { toast } = useToast();

  // Memoize fetchNews to prevent recreation on each render
  const fetchNews = useCallback(async (searchQuery?: string, topicToken?: string | null) => {
    setLoading(true);
    setError(null);
    
    try {
      const queryToUse = searchQuery || query;
      const categoryToUse = topicToken !== undefined ? topicToken : category;
      
      console.log(`Fetching news with query: ${queryToUse}, category: ${categoryToUse}`);
      
      const { data, error: supabaseError } = await supabase.functions.invoke('get-news', {
        body: { 
          query: queryToUse,
          category: categoryToUse 
        }
      });
      
      if (supabaseError) {
        throw new Error(supabaseError.message);
      }
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setNewsData(data);
      setLastFetchTime(Date.now());
      
      // Extract news items from the response
      if (data.news_results && Array.isArray(data.news_results)) {
        setNewsItems(data.news_results);
        console.log(`Successfully fetched ${data.news_results.length} news items`);
      } else {
        setNewsItems([]);
        console.log('No news items found in response');
      }
      
    } catch (err) {
      console.error('Error fetching news:', err);
      setError(err.message || 'Failed to fetch news');
      setNewsItems([]); // Clear old items on error
      toast({
        title: "Error fetching news",
        description: err.message || 'Failed to fetch news',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [query, category, toast]);

  // Fetch news when query or category changes
  useEffect(() => {
    fetchNews();
  }, [query, category, fetchNews]);

  return {
    query,
    setQuery,
    category,
    setCategory,
    newsData,
    newsItems,
    loading,
    error,
    fetchNews,
    lastFetchTime
  };
}
