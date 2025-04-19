
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Users } from "lucide-react";

interface CustomersTabContentProps {
  customers: any[];
}

export const CustomersTabContent = ({ customers }: CustomersTabContentProps) => {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border border-border/50 hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Customers</CardTitle>
            <CardDescription>
              View and manage your customer accounts.
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search customers..."
                className="pl-8 w-full md:w-[200px] lg:w-[300px]"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <div className="overflow-auto max-h-[500px]">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Email</th>
                  <th className="text-left p-3">Joined</th>
                  <th className="text-left p-3">Orders</th>
                  <th className="text-left p-3">Spent</th>
                  <th className="text-right p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.length > 0 ? (
                  customers.map((customer) => (
                    <tr key={customer.id} className="border-t hover:bg-muted/30 transition-colors">
                      <td className="p-3">
                        <div className="font-medium">{customer.name}</div>
                      </td>
                      <td className="p-3">{customer.email}</td>
                      <td className="p-3">{new Date(customer.joinedDate).toLocaleDateString()}</td>
                      <td className="p-3">{customer.orders}</td>
                      <td className="p-3">₹{(customer.spent / 100).toFixed(2)}</td>
                      <td className="p-3 text-right">
                        <Button size="sm" variant="ghost" className="hover:bg-primary/10">
                          View
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-10">
                      <Users className="h-10 w-10 mx-auto text-muted-foreground opacity-30 mb-2" />
                      <p className="text-muted-foreground">No customers found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
