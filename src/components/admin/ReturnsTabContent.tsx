
import { useState, useEffect } from "react";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "./StatusBadge";
import { Search, Package, ArrowLeft, Loader2 } from "lucide-react";
import { ReturnRequest, ReturnStatus, OrderStatus } from "@/types";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/integrations/firebase/client";
import { collection, query, getDocs, doc, updateDoc, getDoc, orderBy, where } from "firebase/firestore";
import { sendReturnStatusUpdateEmail } from "@/utils/emailService";

export const ReturnsTabContent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [returnRequests, setReturnRequests] = useState<ReturnRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Fetch return requests from Firestore
  useEffect(() => {
    const fetchReturnRequests = async () => {
      setIsLoading(true);
      try {
        const returnsRef = collection(db, "returnRequests");
        const q = query(returnsRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        const fetchedReturns = querySnapshot.docs.map(doc => {
          const data = doc.data() as ReturnRequest;
          return {
            ...data,
            id: data.id || doc.id,
            firestoreId: doc.id
          } as ReturnRequest;
        });
        
        setReturnRequests(fetchedReturns);
        console.log(`Loaded ${fetchedReturns.length} return requests from Firestore`);
      } catch (error) {
        console.error("Error fetching return requests:", error);
        toast({
          title: "Error",
          description: "Failed to load return requests. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReturnRequests();
  }, []);

  // Filter returns based on search query and status
  const filteredReturns = returnRequests.filter(returnRequest => {
    // Filter by search query
    const matchesSearch = 
      searchQuery === "" ||
      returnRequest.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      returnRequest.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      returnRequest.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      returnRequest.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by status
    const matchesStatus = 
      statusFilter === "all" || 
      returnRequest.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  // Update return status
  const handleUpdateStatus = async (returnId: string, status: ReturnStatus) => {
    const returnRequest = returnRequests.find(r => r.id === returnId);
    if (!returnRequest || !returnRequest.firestoreId) {
      toast({
        title: "Error",
        description: "Return request not found or missing Firestore ID",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const returnRef = doc(db, "returnRequests", returnRequest.firestoreId);
      
      // Update return status
      await updateDoc(returnRef, {
        status,
        updatedAt: new Date().toISOString()
      });
      
      // If return is completed, update the original order status as well
      if (status === "Completed") {
        // Find the order
        const ordersRef = collection(db, "orders");
        const q = query(ordersRef, where("returnRequest", "==", returnId));
        const orderSnapshot = await getDocs(q);
        
        if (!orderSnapshot.empty) {
          const orderDoc = orderSnapshot.docs[0];
          const orderRef = doc(db, "orders", orderDoc.id);
          
          await updateDoc(orderRef, {
            status: "Returned" as OrderStatus,
            updatedAt: new Date().toISOString()
          });
        }
      }
      
      // Send email notification to customer
      const updatedReturn = {
        ...returnRequest,
        status
      };
      
      await sendReturnStatusUpdateEmail(updatedReturn);
      
      // Update state
      const updatedReturns = returnRequests.map(r => 
        r.id === returnId ? { ...r, status } : r
      );
      setReturnRequests(updatedReturns);
      
      toast({
        title: "Return updated",
        description: `Return request ${returnId} status updated to ${status}`,
      });
    } catch (error) {
      console.error("Error updating return status:", error);
      toast({
        title: "Update failed",
        description: "Failed to update return status",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <TabsList className="mb-4">
        <TabsTrigger value="list">Return Requests</TabsTrigger>
        <TabsTrigger value="analytics">Return Analytics</TabsTrigger>
      </TabsList>
      
      <TabsContent value="list" className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Return Requests</CardTitle>
                <CardDescription>
                  Manage customer returns and refunds
                </CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search returns..."
                    className="pl-8 w-full md:w-[200px] lg:w-[300px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="requested">Requested</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="in progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="rounded-md border">
              <div className="overflow-auto max-h-[500px]">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left p-3">Return ID</th>
                      <th className="text-left p-3">Order ID</th>
                      <th className="text-left p-3">Customer</th>
                      <th className="text-left p-3">Date</th>
                      <th className="text-left p-3">Status</th>
                      <th className="text-left p-3">Pickup Date</th>
                      <th className="text-center p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={7} className="text-center py-10">
                          <div className="flex flex-col items-center justify-center space-y-3">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-muted-foreground">Loading returns...</p>
                          </div>
                        </td>
                      </tr>
                    ) : filteredReturns.length > 0 ? (
                      filteredReturns.map((returnRequest) => (
                        <tr key={returnRequest.id} className="border-t hover:bg-muted/30 transition-colors">
                          <td className="p-3">
                            <div className="font-medium">{returnRequest.id}</div>
                          </td>
                          <td className="p-3">{returnRequest.orderId}</td>
                          <td className="p-3">
                            <div>{returnRequest.customerName}</div>
                            <div className="text-xs text-muted-foreground">{returnRequest.customerEmail}</div>
                          </td>
                          <td className="p-3">{new Date(returnRequest.createdAt).toLocaleDateString()}</td>
                          <td className="p-3">
                            <StatusBadge status={returnRequest.status} />
                          </td>
                          <td className="p-3">{new Date(returnRequest.scheduledDate).toLocaleDateString()}</td>
                          <td className="p-3 text-center">
                            <div className="flex justify-center space-x-2">
                              {returnRequest.status === "Requested" && (
                                <>
                                  <Button 
                                    size="sm"
                                    variant="outline"
                                    className="bg-green-500/20 text-green-700 border-green-200 hover:bg-green-500/30 hover:text-green-800"
                                    onClick={() => handleUpdateStatus(returnRequest.id, "Approved")}
                                  >
                                    Approve
                                  </Button>
                                  <Button 
                                    size="sm"
                                    variant="outline"
                                    className="bg-red-500/20 text-red-700 border-red-200 hover:bg-red-500/30 hover:text-red-800"
                                    onClick={() => handleUpdateStatus(returnRequest.id, "Rejected")}
                                  >
                                    Reject
                                  </Button>
                                </>
                              )}
                              
                              {returnRequest.status === "Approved" && (
                                <Button 
                                  size="sm"
                                  variant="outline"
                                  className="bg-blue-500/20 text-blue-700 border-blue-200 hover:bg-blue-500/30 hover:text-blue-800"
                                  onClick={() => handleUpdateStatus(returnRequest.id, "In Progress")}
                                >
                                  Mark Received
                                </Button>
                              )}
                              
                              {returnRequest.status === "In Progress" && (
                                <Button 
                                  size="sm"
                                  variant="outline"
                                  className="bg-green-500/20 text-green-700 border-green-200 hover:bg-green-500/30 hover:text-green-800"
                                  onClick={() => handleUpdateStatus(returnRequest.id, "Completed")}
                                >
                                  Complete Return
                                </Button>
                              )}
                              
                              <Button 
                                size="sm"
                                variant="ghost"
                                className="hover:bg-primary/10"
                              >
                                View
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="text-center py-10">
                          <ArrowLeft className="h-10 w-10 mx-auto text-muted-foreground opacity-30 mb-2" />
                          <p className="text-muted-foreground">No return requests found</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="analytics">
        <Card>
          <CardHeader>
            <CardTitle>Return Analytics</CardTitle>
            <CardDescription>Return trends and statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground py-10">
              Return analytics visualization will be implemented here
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </>
  );
};
