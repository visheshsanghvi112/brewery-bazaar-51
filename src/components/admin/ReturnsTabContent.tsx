
import { useState, useMemo } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, RefreshCw, FileText, Printer, Mail, DollarSign, BarChart as BarChartIcon } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ReturnRequest, 
  ReturnStatus, 
  OrderStatus, 
  RefundStatus,
  ReturnAnalytics,
  EmailStatus
} from "@/types";
import { generateReturnLabel, downloadReturnLabel } from "@/utils/returnLabels";
import { sendReturnStatusUpdateEmail } from "@/utils/emailService";
import { calculateReturnAnalytics, formatCurrency } from "@/utils/returnAnalytics";
import { bulkUpdateReturnStatus, bulkGenerateReturnLabels, bulkProcessRefunds } from "@/utils/bulkProcessing";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export const ReturnsTabContent = () => {
  const [returnRequests, setReturnRequests] = useLocalStorage<ReturnRequest[]>("returnRequests", []);
  const [orders, setOrders] = useLocalStorage<any[]>("orders", []);
  const [viewingReturn, setViewingReturn] = useState<ReturnRequest | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedReturns, setSelectedReturns] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("list");
  const [newReturnStatus, setNewReturnStatus] = useState<ReturnStatus>("Approved");
  const [processingNotes, setProcessingNotes] = useState<string>("");
  const { toast } = useToast();

  // Calculate analytics data
  const analytics = useMemo(
    () => calculateReturnAnalytics(returnRequests, orders),
    [returnRequests, orders]
  );

  // Filter returns based on search and status
  const filteredReturns = useMemo(() => {
    return returnRequests.filter(request => {
      const matchesSearch = 
        searchTerm === "" || 
        request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || request.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [returnRequests, searchTerm, statusFilter]);

  // Handle update return status
  const handleUpdateReturnStatus = (returnId: string, newStatus: ReturnStatus) => {
    // Update the return request status
    const updatedRequests = returnRequests.map(req => {
      if (req.id === returnId) {
        // Calculate refund amount if completing the return
        let refundAmount = req.refundAmount;
        let refundStatus = req.refundStatus || 'Pending';
        let refundDate = req.refundDate;
        
        if (newStatus === 'Completed') {
          if (!refundAmount) {
            refundAmount = req.items.reduce(
              (sum, item) => sum + (item.price * item.quantity), 
              0
            );
          }
          refundStatus = 'Completed';
          refundDate = new Date().toISOString();
        }

        return { 
          ...req, 
          status: newStatus,
          refundStatus,
          refundAmount,
          refundDate,
          processingNotes: processingNotes || req.processingNotes
        };
      }
      return req;
    });

    setReturnRequests(updatedRequests);
    
    // If the return is complete, also update the order status
    if (newStatus === "Completed") {
      const returnRequest = returnRequests.find(req => req.id === returnId);
      if (returnRequest) {
        const updatedOrders = orders.map(order => {
          if (order.id === returnRequest.orderId) {
            return { ...order, status: "Returned" as OrderStatus };
          }
          return order;
        });
        setOrders(updatedOrders);
      }
    }

    const returnRequest = updatedRequests.find(req => req.id === returnId);
    if (returnRequest) {
      // Send email notification
      sendReturnStatusUpdateEmail(returnRequest)
        .then(result => {
          if (result.success) {
            // Update notification status
            const requestsWithEmailUpdate = updatedRequests.map(req => {
              if (req.id === returnId) {
                return {
                  ...req,
                  lastNotificationStatus: 'Sent' as EmailStatus,
                  lastNotificationDate: new Date().toISOString()
                };
              }
              return req;
            });
            setReturnRequests(requestsWithEmailUpdate);
          } else {
            toast({
              title: "Email notification failed",
              description: "The status update email could not be sent.",
              variant: "destructive",
            });
          }
        })
        .catch(error => {
          console.error("Failed to send email:", error);
          toast({
            title: "Email notification failed",
            description: "The status update email could not be sent.",
            variant: "destructive",
          });
        });
    }

    toast({
      title: "Return status updated",
      description: `Return #${returnId} status has been updated to ${newStatus}`,
    });

    // Reset processing notes
    setProcessingNotes("");
  };

  // Generate and show return label
  const handleGenerateLabel = (returnId: string) => {
    const returnRequest = returnRequests.find(req => req.id === returnId);
    if (returnRequest) {
      // In a real app, this would call an API to generate a real shipping label
      const updatedRequests = returnRequests.map(req => {
        if (req.id === returnId) {
          return {
            ...req,
            labelGenerated: true,
            labelUrl: generateReturnLabel(req)
          };
        }
        return req;
      });
      setReturnRequests(updatedRequests);
      
      toast({
        title: "Return label generated",
        description: "The return shipping label has been generated successfully.",
      });
    }
  };

  // Download return label
  const handleDownloadLabel = (returnRequest: ReturnRequest) => {
    downloadReturnLabel(returnRequest);
  };

  // Handle bulk selection
  const handleSelectReturn = (returnId: string, checked: boolean) => {
    if (checked) {
      setSelectedReturns([...selectedReturns, returnId]);
    } else {
      setSelectedReturns(selectedReturns.filter(id => id !== returnId));
    }
  };

  // Select/deselect all visible returns
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allVisibleIds = filteredReturns.map(req => req.id);
      setSelectedReturns(allVisibleIds);
    } else {
      setSelectedReturns([]);
    }
  };

  // Execute bulk action
  const handleBulkAction = async () => {
    if (!bulkAction || selectedReturns.length === 0) return;
    
    const selectedRequests = returnRequests.filter(req => 
      selectedReturns.includes(req.id)
    );

    let updatedRequests: ReturnRequest[] = [];
    let successMessage = "";

    switch (bulkAction) {
      case "update-status":
        const result = await bulkUpdateReturnStatus(
          selectedRequests, 
          newReturnStatus,
          processingNotes
        );
        
        if (result.success) {
          // Update return requests with the changes
          updatedRequests = returnRequests.map(req => {
            const updated = result.updatedReturns.find(r => r.id === req.id);
            return updated || req;
          });
          
          successMessage = `Updated ${selectedReturns.length} returns to "${newReturnStatus}" status`;
          
          // If any returns are set to completed, update corresponding orders
          if (newReturnStatus === "Completed") {
            const orderIds = selectedRequests.map(req => req.orderId);
            const updatedOrders = orders.map(order => {
              if (orderIds.includes(order.id)) {
                return { ...order, status: "Returned" as OrderStatus };
              }
              return order;
            });
            setOrders(updatedOrders);
          }
          
          // Report on failed emails if any
          if (result.failedEmails.length > 0) {
            toast({
              title: "Some email notifications failed",
              description: `${result.failedEmails.length} email notifications could not be sent.`,
              variant: "destructive",
            });
          }
        }
        break;
        
      case "generate-labels":
        updatedRequests = returnRequests.map(req => {
          if (selectedReturns.includes(req.id)) {
            return {
              ...req,
              labelGenerated: true,
              labelUrl: generateReturnLabel(req)
            };
          }
          return req;
        });
        
        successMessage = `Generated labels for ${selectedReturns.length} returns`;
        break;
        
      case "process-refunds":
        const refundedRequests = bulkProcessRefunds(selectedRequests);
        
        updatedRequests = returnRequests.map(req => {
          const updated = refundedRequests.find(r => r.id === req.id);
          return updated || req;
        });
        
        successMessage = `Processed refunds for ${selectedReturns.length} returns`;
        break;
    }

    setReturnRequests(updatedRequests);
    setSelectedReturns([]);
    setBulkAction("");
    
    toast({
      title: "Bulk action completed",
      description: successMessage,
    });
  };

  // Custom colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <Card className="bg-card/50 backdrop-blur-sm border border-border/50 hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Returns</CardTitle>
            <CardDescription>
              Manage customer return requests and exchanges.
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="list">Returns List</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <TabsContent value="list">
          {viewingReturn ? (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium">Return #{viewingReturn.id}</h3>
                <Button variant="outline" onClick={() => setViewingReturn(null)} size="sm">
                  Back to List
                </Button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium mb-2">Return Details</h4>
                  <div className="border rounded-md p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Order ID:</span>
                      <span className="font-medium">#{viewingReturn.orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Request Date:</span>
                      <span>{new Date(viewingReturn.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pickup Date:</span>
                      <span>{new Date(viewingReturn.scheduledDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <StatusBadge status={viewingReturn.status} />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Reason:</span>
                      <span>{viewingReturn.reason}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Refund Status:</span>
                      <span>{viewingReturn.refundStatus || "Not Started"}</span>
                    </div>
                    {viewingReturn.refundAmount && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Refund Amount:</span>
                        <span>${(viewingReturn.refundAmount / 100).toFixed(2)}</span>
                      </div>
                    )}
                    {viewingReturn.refundDate && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Refund Date:</span>
                        <span>{new Date(viewingReturn.refundDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Label Generated:</span>
                      <span>{viewingReturn.labelGenerated ? "Yes" : "No"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Notification:</span>
                      <span>{viewingReturn.lastNotificationStatus || "None"}</span>
                    </div>
                    {viewingReturn.lastNotificationDate && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Notification Date:</span>
                        <span>{new Date(viewingReturn.lastNotificationDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Customer Information</h4>
                  <div className="border rounded-md p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span>{viewingReturn.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span>{viewingReturn.customerEmail}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Actions</h4>
                    <div className="border rounded-md p-4 space-y-4">
                      <div className="flex flex-col sm:flex-row gap-2">
                        {!viewingReturn.labelGenerated && (
                          <Button 
                            variant="outline" 
                            className="flex items-center gap-2"
                            onClick={() => handleGenerateLabel(viewingReturn.id)}
                          >
                            <FileText className="h-4 w-4" />
                            Generate Label
                          </Button>
                        )}
                        
                        {viewingReturn.labelGenerated && (
                          <Button 
                            variant="outline" 
                            className="flex items-center gap-2"
                            onClick={() => handleDownloadLabel(viewingReturn)}
                          >
                            <Printer className="h-4 w-4" />
                            Download Label
                          </Button>
                        )}
                        
                        <Button 
                          variant="outline" 
                          className="flex items-center gap-2"
                          onClick={async () => {
                            try {
                              await sendReturnStatusUpdateEmail(viewingReturn);
                              
                              // Update notification status
                              const updatedRequests = returnRequests.map(req => {
                                if (req.id === viewingReturn.id) {
                                  return {
                                    ...req,
                                    lastNotificationStatus: 'Sent' as EmailStatus,
                                    lastNotificationDate: new Date().toISOString()
                                  };
                                }
                                return req;
                              });
                              
                              setReturnRequests(updatedRequests);
                              setViewingReturn({
                                ...viewingReturn,
                                lastNotificationStatus: 'Sent' as EmailStatus,
                                lastNotificationDate: new Date().toISOString()
                              });
                              
                              toast({
                                title: "Notification sent",
                                description: "Email notification sent successfully.",
                              });
                            } catch (error) {
                              console.error("Failed to send email:", error);
                              toast({
                                title: "Notification failed",
                                description: "Failed to send email notification.",
                                variant: "destructive",
                              });
                            }
                          }}
                        >
                          <Mail className="h-4 w-4" />
                          Send Notification
                        </Button>
                      </div>
                      
                      {viewingReturn.status !== "Completed" && !viewingReturn.refundDate && (
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button 
                            variant="outline"
                            className="flex items-center gap-2"
                            onClick={() => {
                              // Process refund
                              const refundAmount = viewingReturn.items.reduce(
                                (sum, item) => sum + (item.price * item.quantity), 
                                0
                              );
                              
                              const updatedRequests = returnRequests.map(req => {
                                if (req.id === viewingReturn.id) {
                                  return {
                                    ...req,
                                    refundStatus: 'Completed' as RefundStatus,
                                    refundAmount,
                                    refundDate: new Date().toISOString()
                                  };
                                }
                                return req;
                              });
                              
                              setReturnRequests(updatedRequests);
                              setViewingReturn({
                                ...viewingReturn,
                                refundStatus: 'Completed' as RefundStatus,
                                refundAmount,
                                refundDate: new Date().toISOString()
                              });
                              
                              toast({
                                title: "Refund processed",
                                description: `Refund of $${(refundAmount / 100).toFixed(2)} processed successfully.`,
                              });
                            }}
                          >
                            <DollarSign className="h-4 w-4" />
                            Process Refund
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Return Items</h4>
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left p-3">Product</th>
                        <th className="text-left p-3">Variant</th>
                        <th className="text-left p-3">Quantity</th>
                        <th className="text-left p-3">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewingReturn.items.map((item: any, idx: number) => (
                        <tr key={idx} className="border-t">
                          <td className="p-3">{item.product.name}</td>
                          <td className="p-3">{item.variant.size}, {item.variant.color}</td>
                          <td className="p-3">{item.quantity}</td>
                          <td className="p-3">${(item.price / 100).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h4 className="text-sm font-medium mb-4">Update Return Status</h4>
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Select 
                      value={newReturnStatus} 
                      onValueChange={(value) => setNewReturnStatus(value as ReturnStatus)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Requested">Requested</SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Input 
                      placeholder="Processing notes (optional)" 
                      value={processingNotes}
                      onChange={(e) => setProcessingNotes(e.target.value)}
                    />
                  </div>
                  <Button 
                    onClick={() => handleUpdateReturnStatus(viewingReturn.id, newReturnStatus)}
                  >
                    Update Status
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between gap-2">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search returns..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-full md:w-[200px] lg:w-[300px]"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Requested">Requested</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedReturns.length > 0 && (
                  <div className="flex flex-col sm:flex-row gap-2 items-end sm:items-center">
                    <Select 
                      value={bulkAction} 
                      onValueChange={setBulkAction}
                      disabled={selectedReturns.length === 0}
                    >
                      <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue placeholder="Bulk Actions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="update-status">Update Status</SelectItem>
                        <SelectItem value="generate-labels">Generate Labels</SelectItem>
                        <SelectItem value="process-refunds">Process Refunds</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    {bulkAction === "update-status" && (
                      <Select 
                        value={newReturnStatus} 
                        onValueChange={(value) => setNewReturnStatus(value as ReturnStatus)}
                      >
                        <SelectTrigger className="w-full sm:w-[150px]">
                          <SelectValue placeholder="New Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Requested">Requested</SelectItem>
                          <SelectItem value="Approved">Approved</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="Rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                    
                    <Button 
                      size="sm" 
                      onClick={handleBulkAction}
                      disabled={!bulkAction || selectedReturns.length === 0}
                    >
                      Apply ({selectedReturns.length})
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="rounded-md border">
                <div className="overflow-auto max-h-[500px]">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="p-3 w-8">
                          <Checkbox 
                            checked={filteredReturns.length > 0 && selectedReturns.length === filteredReturns.length}
                            onCheckedChange={handleSelectAll}
                          />
                        </th>
                        <th className="text-left p-3">Return ID</th>
                        <th className="text-left p-3">Order ID</th>
                        <th className="text-left p-3">Customer</th>
                        <th className="text-left p-3">Date</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-left p-3">Refund</th>
                        <th className="text-left p-3">Pickup Date</th>
                        <th className="text-right p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReturns.length > 0 ? (
                        filteredReturns.map((request) => (
                          <tr key={request.id} className="border-t hover:bg-muted/30 transition-colors">
                            <td className="p-3">
                              <Checkbox 
                                checked={selectedReturns.includes(request.id)}
                                onCheckedChange={(checked) => handleSelectReturn(request.id, checked === true)}
                              />
                            </td>
                            <td className="p-3">
                              <div className="font-medium">#{request.id}</div>
                            </td>
                            <td className="p-3">#{request.orderId}</td>
                            <td className="p-3">{request.customerName}</td>
                            <td className="p-3">{new Date(request.createdAt).toLocaleDateString()}</td>
                            <td className="p-3">
                              <StatusBadge status={request.status} />
                            </td>
                            <td className="p-3">
                              {request.refundStatus ? (
                                <span className={
                                  request.refundStatus === 'Completed' 
                                    ? 'text-green-600 dark:text-green-400' 
                                    : 'text-yellow-600 dark:text-yellow-400'
                                }>
                                  {request.refundStatus}
                                </span>
                              ) : (
                                <span className="text-gray-500">Pending</span>
                              )}
                            </td>
                            <td className="p-3">{new Date(request.scheduledDate).toLocaleDateString()}</td>
                            <td className="p-3 text-right">
                              <div className="flex justify-end gap-2">
                                {request.labelGenerated ? (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="hover:bg-primary/10 flex items-center gap-1"
                                    onClick={() => handleDownloadLabel(request)}
                                    title="Download Label"
                                  >
                                    <Printer className="h-4 w-4" />
                                  </Button>
                                ) : (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="hover:bg-primary/10 flex items-center gap-1"
                                    onClick={() => handleGenerateLabel(request.id)}
                                    title="Generate Label"
                                  >
                                    <FileText className="h-4 w-4" />
                                  </Button>
                                )}
                                
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  className="hover:bg-primary/10"
                                  onClick={() => setViewingReturn(request)}
                                >
                                  View
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={9} className="text-center py-10">
                            <RefreshCw className="h-10 w-10 mx-auto text-muted-foreground opacity-30 mb-2" />
                            <p className="text-muted-foreground">No return requests found</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics">
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Total Returns</h4>
                <p className="text-3xl font-bold">{analytics.totalReturns}</p>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Return Rate</h4>
                <p className="text-3xl font-bold">{analytics.returnRate.toFixed(2)}%</p>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Total Refunded</h4>
                <p className="text-3xl font-bold">{formatCurrency(analytics.totalRefunded)}</p>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Avg. Processing Days</h4>
                <p className="text-3xl font-bold">{analytics.averageProcessingTime.toFixed(1)}</p>
              </div>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="border rounded-md p-4">
                <h4 className="text-sm font-medium mb-4">Returns by Status</h4>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics.returnsByStatus}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        nameKey="status"
                      >
                        {analytics.returnsByStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: any) => [`${value} returns`, 'Count']} 
                        labelFormatter={(label: any) => `Status: ${label}`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <h4 className="text-sm font-medium mb-4">Returns by Reason</h4>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={analytics.returnsByReason}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 70, bottom: 5 }}
                    >
                      <XAxis type="number" />
                      <YAxis dataKey="reason" type="category" width={60} />
                      <Tooltip 
                        formatter={(value: any) => [`${value} returns`, 'Count']} 
                      />
                      <Bar dataKey="count" fill="#8884d8" barSize={20} radius={[0, 4, 4, 0]} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="border rounded-md p-4 md:col-span-2">
                <h4 className="text-sm font-medium mb-4">Monthly Return Trends</h4>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={analytics.monthlyReturns}
                      margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                    >
                      <XAxis 
                        dataKey="month" 
                        angle={-45} 
                        textAnchor="end"
                        height={70}
                        tickFormatter={(value) => {
                          const [year, month] = value.split('-');
                          return `${month}/${year.slice(2)}`;
                        }}
                      />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: any) => [`${value} returns`, 'Count']} 
                        labelFormatter={(label: any) => {
                          const [year, month] = label.split('-');
                          const date = new Date(parseInt(year), parseInt(month) - 1, 1);
                          return date.toLocaleString('default', { month: 'long', year: 'numeric' });
                        }}
                      />
                      <Bar dataKey="count" fill="#0088FE" name="Returns" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </CardContent>
    </Card>
  );
};
