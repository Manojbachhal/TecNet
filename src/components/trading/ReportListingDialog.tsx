import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { ListingItem } from './types/tradingTypes';
import { Shield, AlertCircle } from "lucide-react";

interface ReportListingDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (reportData: ReportData) => void;
  item: ListingItem | null;
}

export interface ReportData {
  listingId: string;
  reasons: string[];
  description?: string;
}

const VIOLATION_OPTIONS = [
  { id: "illegal", label: "Illegal item or activity" },
  { id: "prohibited", label: "Prohibited item" },
  { id: "fraud", label: "Fraudulent listing" },
  { id: "inappropriate", label: "Inappropriate content" },
  { id: "other", label: "Other" }
];

export default function ReportListingDialog({ isOpen, onOpenChange, onSubmit, item }: ReportListingDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<{
    reasons: string[];
    description: string;
  }>({
    defaultValues: {
      reasons: [],
      description: '',
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    if (!item) return;
    
    setIsSubmitting(true);
    
    onSubmit({
      listingId: item.id,
      reasons: data.reasons,
      description: data.description
    });
    
    setIsSubmitting(false);
    onOpenChange(false);
    form.reset();
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5 text-destructive" />
            Report Listing
          </DialogTitle>
          <DialogDescription>
            {item ? (
              <>Report listing: <span className="font-medium">{item.title}</span></>
            ) : (
              'Report this listing for violating terms or laws'
            )}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-4 border rounded-md p-3">
              <p className="text-sm font-medium">Reason for reporting:</p>
              
              {VIOLATION_OPTIONS.map((option) => (
                <FormField
                  key={option.id}
                  control={form.control}
                  name="reasons"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(option.id)}
                          onCheckedChange={(checked) => {
                            const updatedValue = checked
                              ? [...field.value, option.id]
                              : field.value?.filter((value) => value !== option.id);
                            field.onChange(updatedValue);
                          }}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal cursor-pointer">
                        {option.label}
                      </FormLabel>
                    </FormItem>
                  )}
                />
              ))}
            </div>
            
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional details (optional)</FormLabel>
                    <FormControl>
                      <textarea
                        className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                        placeholder="Please provide any additional information that might help our review."
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter className="sm:justify-between">
              <div className="flex items-center text-xs text-muted-foreground">
                <AlertCircle className="h-3 w-3 mr-1" />
                Reports are confidential
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={isSubmitting || form.getValues().reasons.length === 0}
                >
                  Submit Report
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
