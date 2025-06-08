
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface BasicDetailsProps {
  make: string;
  model: string;
  caliber: string;
  serialNumber: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function BasicDetails({ 
  make, 
  model, 
  caliber, 
  serialNumber, 
  onChange 
}: BasicDetailsProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="make">Make *</Label>
          <Input 
            id="make" 
            name="make" 
            value={make} 
            onChange={onChange} 
            required 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="model">Model *</Label>
          <Input 
            id="model" 
            name="model" 
            value={model} 
            onChange={onChange} 
            required 
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="caliber">Caliber</Label>
          <Input 
            id="caliber" 
            name="caliber" 
            value={caliber} 
            onChange={onChange} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="serialNumber">Serial Number *</Label>
          <Input 
            id="serialNumber" 
            name="serialNumber" 
            value={serialNumber} 
            onChange={onChange} 
            required 
          />
        </div>
      </div>
    </>
  );
}
