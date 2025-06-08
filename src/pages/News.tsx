
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNews } from '@/components/news/hooks/useNews';
import NewsGrid from '@/components/news/NewsGrid';
import NewsFilters from '@/components/news/NewsFilters';
import RelatedTopics from '@/components/news/RelatedTopics';
import Navbar from '@/components/layout/Navbar';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function News() {
  const {
    query,
    setQuery,
    category,
    setCategory,
    newsData,
    newsItems,
    loading,
    error,
    fetchNews
  } = useNews("firearms news");

  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  const categories = [
    { label: 'All Categories', value: null },
    { label: 'Firearms', value: 'CAAqJggKIiBDQkFTRWdvSUwyMHZNRGRqTVhZU0FtVnVHZ0pWVXlnQVAB' }, // This is a sample topic token for Technology
    { label: 'US News', value: 'CAAqIggKIhxDQkFTRHdvSkwyMHZNRGxqTjNjd0VnSmxiaWdBUAE' },
    { label: 'World', value: 'CAAqJggKIiBDQkFTRWdvSUwyMHZNRFp1ZEdvU0FtVnVHZ0pWVXlnQVAB' },
  ];

  const handleSearch = () => {
    setQuery(searchInput);
    setCategory(null);
  };

  const handleRefresh = () => {
    fetchNews();
  };

  const handleTopicClick = (topicToken: string) => {
    setCategory(topicToken);
    setSearchInput("");
    setQuery("");
  };

  return (
    <>
      <Helmet>
        <title>Firearms News | AmmoAlley</title>
      </Helmet>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 pt-20 pb-10">
          <div className="flex justify-between items-center mb-6 mt-6">
            <h1 className="text-3xl font-bold">Firearms News</h1>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-1"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          <NewsFilters
            query={searchInput}
            onQueryChange={setSearchInput}
            onSearch={handleSearch}
            onCategorySelect={setCategory}
            selectedCategory={category}
            categories={categories}
          />

          {newsData?.related_topics && newsData.related_topics.length > 0 && (
            <RelatedTopics 
              topics={newsData.related_topics} 
              onTopicClick={handleTopicClick} 
            />
          )}

          <NewsGrid 
            newsItems={newsItems}
            loading={loading}
          />

          {error && (
            <div className="rounded-lg border border-destructive p-4 my-6 text-destructive">
              <p className="font-medium">Error loading news</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
