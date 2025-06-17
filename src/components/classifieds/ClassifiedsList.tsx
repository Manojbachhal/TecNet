import React from 'react';
import { Classified } from './types';
import ClassifiedCard from './ClassifiedCard';
import { Loader2 } from 'lucide-react';

interface ClassifiedsListProps {
  classifieds: Classified[];
  isLoading: boolean;
  searchTerm: string;
  isOwner: (classified: Classified) => boolean;
  onEditClassified: (classified: Classified) => void;
  onDeleteClassified: (id: string) => void;
  onSold: (classified: Classified) => void;
}

const ClassifiedsList = ({ 
  classifieds, 
  isLoading, 
  searchTerm,
  isOwner,
  onEditClassified, 
  onDeleteClassified,
  onSold
}: ClassifiedsListProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  if (classifieds.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-muted/30">
        {searchTerm 
          ? <p>No classifieds match your search. Try different keywords.</p>
          : <p>No classifieds have been posted yet. Be the first to post!</p>
        }
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {classifieds.map((classified) => (
        <ClassifiedCard
          key={classified.id}
          classified={classified}
          isOwner={isOwner(classified)}
          onEdit={() => onEditClassified(classified)}
          onDelete={() => onDeleteClassified(classified.id)}
          onSold={() => onSold(classified)}
        />
      ))}
    </div>
  );
};

export default ClassifiedsList;
