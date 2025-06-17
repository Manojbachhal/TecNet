import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface AdditionalDetailsProps {
  condition: string;
  purchaseDate: string;
  value: number;
  notes: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onValueChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function AdditionalDetails({
  condition,
  purchaseDate,
  value,
  notes,
  onChange,
  onSelectChange,
  onValueChange
}: AdditionalDetailsProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="condition">Condition</Label>
          <Select 
            name="condition" 
            value={condition} 
            onValueChange={(value) => onSelectChange('condition', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Excellent">Excellent</SelectItem>
              <SelectItem value="Good">Good</SelectItem>
              <SelectItem value="Fair">Fair</SelectItem>
              <SelectItem value="Poor">Poor</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="purchaseDate">Purchase Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {purchaseDate ? format(new Date(purchaseDate), "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={purchaseDate ? new Date(purchaseDate) : undefined}
                onSelect={(date) => {
                  if (date) {
                    const event = {
                      target: {
                        name: 'purchaseDate',
                        value: date.toISOString().split('T')[0]
                      }
                    } as React.ChangeEvent<HTMLInputElement>;
                    onChange(event);
                  }
                }}
                disabled={(date) => date > new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="value">Value ($)</Label>
        <Input 
          id="value" 
          name="value" 
          type="number" 
          min="0" 
          step="0.01" 
          value={value === 0 ? '' : value} 
          onChange={onValueChange} 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea 
          id="notes" 
          name="notes" 
          value={notes || ''} 
          onChange={onChange} 
          rows={3} 
        />
      </div>
    </>
  );
}
