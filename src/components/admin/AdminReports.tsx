import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, AlertCircle, Clock } from "lucide-react";

interface ListingReportData {
  listingId?: string;
  reasons?: string[];
  description?: string;
}

interface Report {
  id: string;
  created_at: string;
  reporter_id: string;
  report_type: string;
  details: string | null;
  status: 'pending' | 'resolved' | 'rejected';
  reporter_email?: string;
  formatted_details?: string; // Added the formatted_details property
}

const AdminReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const formatReportDetails = (report: Report): string => {
    // If it's not a listing report or details is null, return the original details
    if (report.report_type !== 'listing' || !report.details) {
      return report.details || '';
    }

    try {
      // Try to parse the JSON
      const parsedDetails: ListingReportData = JSON.parse(report.details);
      
      // Format the report details in a readable way
      let formattedDetails = '';
      
      // Add listing ID if available
      if (parsedDetails.listingId) {
        formattedDetails += `Listing ID: ${parsedDetails.listingId}\n`;
      }
      
      // Add reasons if available
      if (parsedDetails.reasons && parsedDetails.reasons.length > 0) {
        formattedDetails += `Reasons: ${parsedDetails.reasons.join(', ')}\n`;
      }
      
      // Add description if available
      if (parsedDetails.description) {
        formattedDetails += `Additional details: ${parsedDetails.description}`;
      }
      
      return formattedDetails || 'No details provided';
    } catch (error) {
      // If parsing fails, return the original details
      console.error('Error parsing report details:', error);
      return report.details;
    }
  };
  
  const fetchReports = async () => {
    setLoading(true);
    try {
      // First get all the reports
      let query = supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Apply status filter if not 'all'
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      
      const { data: reportData, error: reportError } = await query;
      
      if (reportError) throw reportError;
      
      // If we have reports, fetch the associated profiles
      const formattedData: Report[] = [];
      
      if (reportData && reportData.length > 0) {
        // Get all unique reporter IDs
        const reporterIds = [...new Set(reportData.map(report => report.reporter_id))];
        
        // Fetch all profiles for these reporters in a single query
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, email')
          .in('id', reporterIds);
          
        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          // Continue with reports even if profile fetch fails
        }
        
        // Create a map of user IDs to emails for quick lookup
        const profileMap = new Map();
        profilesData?.forEach(profile => {
          profileMap.set(profile.id, profile.email);
        });
        
        // Format the data
        reportData.forEach(report => {
          const formattedReport: Report = {
            ...report,
            // Make sure status is one of the allowed values
            status: (report.status === 'pending' || 
                    report.status === 'resolved' || 
                    report.status === 'rejected') ? 
                    report.status as 'pending' | 'resolved' | 'rejected' : 
                    'pending',
          reporter_email: profileMap.get(report.reporter_id) || report.reporter_id
        };
        
        // Add formatted details
        formattedReport.formatted_details = formatReportDetails(formattedReport);
        
        formattedData.push(formattedReport);
      });
    }
    
    setReports(formattedData);
  } catch (error) {
    console.error('Error fetching reports:', error);
    toast({
      title: "Error",
      description: "Failed to load reports. Please try again.",
      variant: "destructive"
    });
  } finally {
    setLoading(false);
  }
};
  
  useEffect(() => {
    fetchReports();
  }, [statusFilter]);
  
  const updateReportStatus = async (reportId: string, status: 'pending' | 'resolved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('reports')
        .update({ status })
        .eq('id', reportId);
      
      if (error) throw error;
      
      // Update the local state to reflect the change
      setReports(reports.map(report => 
        report.id === reportId ? { ...report, status } : report
      ));
      
      toast({
        title: "Status Updated",
        description: `Report status changed to ${status}`,
      });
    } catch (error) {
      console.error('Error updating report status:', error);
      toast({
        title: "Error",
        description: "Failed to update report status. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300"><CheckCircle className="h-3 w-3 mr-1" /> Resolved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300"><AlertCircle className="h-3 w-3 mr-1" /> Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading reports...</span>
      </div>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>User Reports</CardTitle>
            <CardDescription>
              View and manage reports submitted by users
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reports</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => fetchReports()}>Refresh</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {reports.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No reports found.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Reporter</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="whitespace-nowrap">
                    {formatDate(report.created_at)}
                  </TableCell>
                  <TableCell className="max-w-[150px] truncate">
                    {report.reporter_email || report.reporter_id}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {report.report_type === 'listing' ? 'Listing Report' : 
                       report.report_type === 'general' ? 'General Report' : 
                       report.report_type}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[300px]">
                    <div className="max-h-[100px] overflow-y-auto whitespace-pre-line">
                      {report.formatted_details || report.details}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(report.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {report.status !== 'resolved' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 border-green-200 hover:bg-green-50"
                          onClick={() => updateReportStatus(report.id, 'resolved')}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Resolve
                        </Button>
                      )}
                      {report.status !== 'rejected' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => updateReportStatus(report.id, 'rejected')}
                        >
                          <AlertCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      )}
                      {report.status !== 'pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                          onClick={() => updateReportStatus(report.id, 'pending')}
                        >
                          <Clock className="h-4 w-4 mr-1" />
                          Pending
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminReports;
