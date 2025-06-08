
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, CardImage } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Clock, ArrowUpRight } from "lucide-react";
import { NewsItem as NewsItemType } from './types/newsTypes';
import { formatDateDifference } from '../trading/utils/dateUtils';

interface NewsItemProps {
  item: NewsItemType;
}

export default function NewsItem({ item }: NewsItemProps) {
  const openNewsLink = () => {
    if (item.link) {
      window.open(item.link, '_blank', 'noopener,noreferrer');
    }
  };

  const publishedDate = item.date ? new Date(item.date) : null;
  const formattedDate = publishedDate ? formatDateDifference(publishedDate) : 'Recently';

  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer border-primary/10 hover:border-primary/30" onClick={openNewsLink}>
      {item.thumbnail && (
        <CardImage 
          src={item.thumbnail} 
          alt={item.title} 
          className="h-40 object-cover"
          fallbackSrc="/placeholder.svg"
        />
      )}
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            {item.source?.icon && (
              <img 
                src={item.source.icon} 
                alt={item.source.name || 'Source'} 
                className="w-5 h-5 rounded-full mr-2" 
              />
            )}
            <CardDescription className="text-xs">
              {item.source?.name || 'News Source'}
            </CardDescription>
          </div>
          {item.type && (
            <Badge variant="outline" className="text-xs font-normal">
              {item.type}
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg line-clamp-2 h-12 mt-1">
          {item.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {item.snippet || 'No description available.'}
        </p>
      </CardContent>
      <CardFooter className="pt-0 pb-4 flex justify-between items-center text-xs text-muted-foreground">
        <div className="flex items-center">
          <Clock className="w-3 h-3 mr-1" />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center">
          <span>Read more</span>
          <ArrowUpRight className="w-3 h-3 ml-1" />
        </div>
      </CardFooter>
    </Card>
  );
}
