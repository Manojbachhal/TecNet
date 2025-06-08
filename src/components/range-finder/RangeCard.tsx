
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Phone, Clock, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

export interface RangeInfo {
  id: string;
  name: string;
  type: string[];
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  rating: number;
  website?: string;
  hours: string;
  features: string[];
  image?: string;
  distance?: number;
}

interface RangeCardProps {
  range: RangeInfo;
  onGetDirections: (address: string) => void;
}

export default function RangeCard({ range, onGetDirections }: RangeCardProps) {
  const fullAddress = `${range.address}, ${range.city}, ${range.state} ${range.zip}`;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="hover-scale"
    >
      <Card className="overflow-hidden h-full flex flex-col">
        <div className="relative h-40 overflow-hidden">
          {range.image ? (
            <img 
              src={range.image} 
              alt={range.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-secondary/20">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
          {range.distance && (
            <Badge className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm">
              {range.distance.toFixed(1)} miles away
            </Badge>
          )}
        </div>
        
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{range.name}</CardTitle>
              <CardDescription className="flex items-center mt-1">
                <MapPin className="h-3 w-3 mr-1" />
                {range.city}, {range.state}
              </CardDescription>
            </div>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={16} 
                  className={i < range.rating ? "fill-yellow-500 text-yellow-500" : "text-gray-300"} 
                />
              ))}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pb-2 flex-grow">
          <div className="flex flex-wrap gap-1 mb-3">
            {range.type.map((type) => (
              <Badge key={type} variant="secondary" className="text-xs">
                {type}
              </Badge>
            ))}
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-start">
              <Phone className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
              <span>{range.phone}</span>
            </div>
            <div className="flex items-start">
              <Clock className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
              <span>{range.hours}</span>
            </div>
          </div>
          
          <div className="mt-3">
            <p className="text-sm font-medium mb-1">Features:</p>
            <div className="flex flex-wrap gap-1">
              {range.features.map((feature, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="pt-2 grid grid-cols-2 gap-2">
          <Button 
            variant="default"
            onClick={() => onGetDirections(fullAddress)}
          >
            Directions
          </Button>
          {range.website ? (
            <Button 
              variant="outline"
              onClick={() => window.open(range.website, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-1" /> Website
            </Button>
          ) : (
            <Button variant="outline" disabled>
              No Website
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
