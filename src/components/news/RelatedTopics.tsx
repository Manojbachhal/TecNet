
import React from 'react';
import { RelatedTopic } from './types/newsTypes';
import { ChevronRight } from 'lucide-react';

interface RelatedTopicsProps {
  topics: RelatedTopic[];
  onTopicClick: (topicToken: string) => void;
}

export default function RelatedTopics({ topics, onTopicClick }: RelatedTopicsProps) {
  if (!topics || topics.length === 0) {
    return null;
  }

  return (
    <div className="bg-card rounded-lg border p-4 mb-6">
      <h3 className="text-base font-medium mb-3">Related Topics</h3>
      <div className="flex flex-wrap gap-2">
        {topics.map((topic, index) => (
          <button
            key={`${topic.name || topic.title || `topic-${index}`}-${index}`}
            onClick={() => topic.topic_token && onTopicClick(topic.topic_token)}
            className="flex items-center px-3 py-1.5 rounded-full text-sm bg-secondary hover:bg-secondary/80 transition-colors"
            disabled={!topic.topic_token}
          >
            {topic.thumbnail && (
              <img 
                src={topic.thumbnail} 
                alt={topic.name || topic.title || 'Topic'} 
                className="w-4 h-4 rounded-full mr-2"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
            <span>{topic.name || topic.title || 'Unknown Topic'}</span>
            <ChevronRight className="ml-1 h-3 w-3" />
          </button>
        ))}
      </div>
    </div>
  );
}
