
import { useState } from "react";
import { Label } from "@/components/ui/label";
import Autocomplete from "react-google-autocomplete";
import { Address } from "@/types";
import { Logger } from "@/lib/errorTracker";

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
  const [googleError, setGoogleError] = useState(false);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  /**
   * Helper function to extract Google Place formatting into our Address type
   */
  const handlePlaceSelect = (place: any) => {
    try {
      const addressComponents = place.address_components;
      if (!addressComponents) return;

      let street = "";
      let city = "";
      let state = "";
      let zipCode = "";
      let country = "";

      for (const component of addressComponents) {
        const type = component.types[0];
        if (type === "street_number") street += component.long_name + " ";
        if (type === "route") street += component.long_name;
        if (type === "locality") city = component.long_name;
        if (type === "administrative_area_level_1") state = component.long_name;
        if (type === "postal_code") zipCode = component.long_name;
        if (type === "country") country = component.long_name;
      }

      onChange({
        street: street.trim(),
        city,
        state,
        zipCode,
        country
      });

      if (place.formatted_address) {
        onInputChange(place.formatted_address);
      }
    } catch (error) {
      Logger.error("Failed to parse Google Places Address payload", { error: String(error) });
    }
  };

  if (!apiKey || googleError) {
    // Graceful production fallback if no Key is available
    return (
      <div className="relative">
        <Label htmlFor="address-search">{label}</Label>
        <input
          id="address-search"
          type="text"
          value={value}
          onChange={(e) => onInputChange(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Enter manual address"
          autoComplete="off"
        />
        {!apiKey && <p className="text-xs text-muted-foreground mt-1 text-orange-500">Notice: Maps API not configured. Manual entry active.</p>}
      </div>
    );
  }

  return (
    <div className="relative">
      <Label htmlFor="address-search">{label}</Label>
      <Autocomplete
        apiKey={apiKey}
        onPlaceSelected={handlePlaceSelect}
        onChange={(e: any) => onInputChange(e.target.value)}
        defaultValue={value}
        options={{
          types: ["address"],
          componentRestrictions: { country: "in" } // Defaults to India, configurable
        }}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        placeholder="Search for your address..."
      />
    </div>
  );
}
