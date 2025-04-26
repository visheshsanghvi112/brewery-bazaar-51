
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDebounce } from "@/hooks/use-debounce";
import { Address } from "@/types";

interface AddressResult {
  display_name: string;
  address: {
    road?: string;
    house_number?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
}

interface AddressAutocompleteProps {
  label: string;
  value: string;
  onChange: (address: Partial<Address>) => void;
  onInputChange: (value: string) => void;
}

export function AddressAutocomplete({
  label,
  value,
  onChange,
  onInputChange,
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<AddressResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const debouncedSearch = useDebounce(value, 500);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (debouncedSearch.length < 3) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            debouncedSearch
          )}&format=jsonv2&addressdetails=1&limit=5`,
          {
            headers: {
              "Accept-Language": "en",
            },
          }
        );
        const data = await response.json();
        setSuggestions(data);
        setIsOpen(data.length > 0);
      } catch (error) {
        console.error("Failed to fetch address suggestions:", error);
        setSuggestions([]);
      }
    };

    fetchAddresses();
  }, [debouncedSearch]);

  const handleSuggestionClick = (suggestion: AddressResult) => {
    const addr = suggestion.address;
    const formattedAddress: Partial<Address> = {
      street: [addr.house_number, addr.road].filter(Boolean).join(" "),
      city: addr.city || "",
      state: addr.state || "",
      zipCode: addr.postcode || "",
      country: addr.country || "",
    };

    onChange(formattedAddress);
    onInputChange(suggestion.display_name);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <Label htmlFor="address-search">{label}</Label>
      <Input
        id="address-search"
        type="text"
        value={value}
        onChange={(e) => {
          onInputChange(e.target.value);
          setIsOpen(true);
        }}
        autoComplete="off"
      />

      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg">
          <ScrollArea className="h-[200px]">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="w-full px-4 py-2 text-left text-sm hover:bg-muted/50 focus:bg-muted/50 focus:outline-none"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion.display_name}
              </button>
            ))}
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
