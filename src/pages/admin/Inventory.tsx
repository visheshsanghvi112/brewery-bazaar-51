import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { getInventoryFromFirestore, updateInventoryInFirestore } from "@/lib/firebase/inventoryOperations";
import { useAdmin } from "@/contexts/AdminContext";
import { InventoryEntry } from "@/types";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

export default function AdminInventory() {
  const [inventory, setInventory] = useState<InventoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { products } = useAdmin();
  const { toast } = useToast();

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const data = await getInventoryFromFirestore();
      setInventory(data);
    } catch (e) {
      toast({
        title: "Error listing inventory",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = async (firestoreId: string, newQty: string) => {
    const qty = parseInt(newQty);
    if (isNaN(qty)) return;

    try {
      if (firestoreId) {
        await updateInventoryInFirestore({
          firestoreId,
          quantity: qty
        });
        toast({ title: "Inventory updated" });
      }
    } catch (e) {
      toast({ title: "Failed to update inventory", variant: "destructive" });
    }
  };

  return (
    <div className="py-6">
      <h2 className="text-3xl font-bold mb-6">Inventory Management</h2>

      <div className="rounded-md border mt-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Variant</TableHead>
              <TableHead>In Stock</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">Loading inventory...</TableCell>
              </TableRow>
            ) : inventory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">No inventory entries found.</TableCell>
              </TableRow>
            ) : (
              inventory.map((item) => {
                const associatedProduct = products.find(p => p.id === item.productId);
                return (
                  <TableRow key={item.id || item.firestoreId}>
                    <TableCell className="font-medium">
                      {associatedProduct?.name || `Unknown Product (${item.productId})`}
                    </TableCell>
                    <TableCell>
                      <span className="bg-secondary px-2 py-1 rounded text-xs">
                        {item.variantId}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Input 
                        type="number" 
                        defaultValue={item.quantity} 
                        className="w-24"
                        onBlur={(e) => handleUpdateStock(item.firestoreId!, e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${item.quantity <= (item.lowStockThreshold || 5) ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {item.quantity <= (item.lowStockThreshold || 5) ? 'Low Stock' : 'Healthy'}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
