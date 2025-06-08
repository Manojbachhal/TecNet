
import React from 'react';
import NewsItem from './NewsItem';
import { NewsItem as NewsItemType } from './types/newsTypes';
import { Skeleton } from "@/components/ui/skeleton";

interface NewsGridProps {
  newsItems: NewsItemType[];
  loading: boolean;
}

export default function NewsGrid({ newsItems, loading }: NewsGridProps) {
  // Generate placeholders for loading state
  const loadingPlaceholders = Array(8).fill(0).map((_, i) => (
    <div key={`loading-${i}`} className="h-full">
      <div className="rounded-lg overflow-hidden h-full border flex flex-col">
        <Skeleton className="h-40 w-full" />
        <div className="p-4 flex-grow">
          <div className="flex justify-between mb-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-3/4 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="px-4 pb-4 mt-auto">
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    </div>
  ));

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loadingPlaceholders}
      </div>
    );
  }

  if (newsItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 border rounded-lg">
        <h3 className="text-xl font-semibold mb-2">No News Found</h3>
        <p className="text-muted-foreground text-center max-w-md">
          We couldn't find any news articles matching your search criteria. Try adjusting your filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {newsItems.map((item, index) => (
        <NewsItem key={`${item.title}-${index}`} item={item} />
      ))}
    </div>
  );
}
