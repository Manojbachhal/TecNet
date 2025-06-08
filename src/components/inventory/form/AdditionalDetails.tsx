
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

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
          <Input 
            id="purchaseDate" 
            name="purchaseDate" 
            type="date" 
            value={purchaseDate} 
            onChange={onChange} 
          />
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
          value={value} 
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
