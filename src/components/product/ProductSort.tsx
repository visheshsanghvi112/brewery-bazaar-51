
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface ProductSortProps {
  onSort: (value: string) => void;
  currentSort: string;
}

export default function ProductSort({ onSort, currentSort }: ProductSortProps) {
  return (
    <Select value={currentSort} onValueChange={onSort}>
      <SelectTrigger className="w-[180px] bg-card/50 backdrop-blur-sm">
        <SelectValue placeholder="Sort by..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="newest">Newest First</SelectItem>
        <SelectItem value="price-asc">Price: Low to High</SelectItem>
        <SelectItem value="price-desc">Price: High to Low</SelectItem>
        <SelectItem value="name-asc">Name: A to Z</SelectItem>
        <SelectItem value="name-desc">Name: Z to A</SelectItem>
      </SelectContent>
    </Select>
  );
}
