import { Field, FieldDescription, FieldError, FieldLabel } from "../Field";
import { AutoComplete } from "../Autocomplete";
import { Input } from "../Input";
import { useState, useEffect, useRef } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import type { TableSearchParams } from "@/hooks/useTableState";
import type { ApiResponse } from "@/types/custom-types";

export interface FormAutoCompleteProps<
  T = unknown,
  TParams = TableSearchParams,
> {
  label?: string;
  name: string;
  selectedValue: string;
  onSelectedValueChange?: (value: string, item?: T) => void;
  displayValue?: string; // Optional display text for selected item
  onSearchChange?: (search: string) => void; // Expose search for external use

  // Mode 1: Static items
  items?: { value: string; label: string }[];
  isLoading?: boolean;

  // Mode 2: Simple async fetch (clean API pattern - recommended)
  fetchFn?: (params: TParams & { search?: string }) => Promise<ApiResponse<T>>;
  fetchParams?: TParams;
  mapItem?: (item: T) => { value: string; label: string };

  // Behavior options
  onAfterSelect?: () => void; // Callback after selection (e.g., focus next input)

  emptyMessage?: string;
  placeholder?: string;
  error?: string;
  description?: string;
  readOnly?: boolean;
  className?: string;
  autofocus?: boolean;
  onBlur?: () => void;
  debounceMs?: number;
  ref?: React.RefObject<HTMLInputElement | null>;
}

const FormAutoComplete = <T, TParams = TableSearchParams>({
  label,
  name,
  selectedValue,
  onSelectedValueChange,
  displayValue,
  onSearchChange,
  items,
  fetchFn,
  fetchParams = { page: 1, pageSize: 20 } as TParams,
  mapItem,
  onAfterSelect,
  isLoading: externalIsLoading,
  emptyMessage,
  placeholder = "Buscar...",
  error,
  description,
  readOnly,
  className,
  autofocus,
  onBlur,
  debounceMs = 300,
  ref,
}: FormAutoCompleteProps<T, TParams>) => {
  const [internalItems, setInternalItems] = useState<
    (T & { value: string; label: string })[]
  >([]);
  const [internalIsLoading, setInternalIsLoading] = useState(false);
  const [internalSearch, setInternalSearch] = useState("");
  const skipNextFetchRef = useRef(false);
  const debouncedSearch = useDebounce(internalSearch, debounceMs);

  // Handle search changes
  const handleSearchChange = (search: string) => {
    setInternalSearch(search);
    onSearchChange?.(search);
  };

  // Fetch items when using async mode
  useEffect(() => {
    // Priority: fetchFn > fetchItems > static items
    if (fetchFn && mapItem) {
      // Don't fetch if search term is empty or whitespace only
      if (!debouncedSearch || debouncedSearch.trim() === "") {
        setInternalItems([]);
        setInternalIsLoading(false);
        return;
      }

      // Skip this fetch if flag is set (user just selected an item)
      if (skipNextFetchRef.current) {
        skipNextFetchRef.current = false;
        return;
      }

      const loadItems = async () => {
        setInternalIsLoading(true);
        try {
          const response = await fetchFn({
            ...fetchParams,
            search: debouncedSearch,
          });
          const mappedItems = response.data.map((item) => ({
            ...item,
            ...mapItem(item),
          }));
          setInternalItems(mappedItems);
        } catch (error) {
          console.error("Error fetching autocomplete items:", error);
          setInternalItems([]);
        } finally {
          setInternalIsLoading(false);
        }
      };
      loadItems();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // Use fetched items if in async mode, otherwise use provided items
  const displayItems = fetchFn ? internalItems : items || [];
  const isLoading = fetchFn ? internalIsLoading : externalIsLoading;

  // When readOnly, render as text input showing the display value
  if (readOnly) {
    return (
      <Field>
        {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
        <Input
          id={name}
          name={name}
          value={displayValue || ""}
          readOnly
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        />
        {description && <FieldDescription>{description}</FieldDescription>}
        {error && <FieldError>{error}</FieldError>}
      </Field>
    );
  }

  const handleSelect = () => {
    // Set flag to skip the next fetch that will be triggered when search updates to displayValue
    skipNextFetchRef.current = true;
  };

  const handleValueChange = (value: string) => {
    const item = displayItems.find((i) => i.value === value);
    onSelectedValueChange?.(value, item as T | undefined);
  };

  return (
    <Field>
      {label && <FieldLabel htmlFor={name}>{label}</FieldLabel>}
      <AutoComplete
        name={name}
        id={name}
        value={selectedValue}
        onValueChange={handleValueChange}
        onSearchChange={handleSearchChange}
        onSelect={handleSelect}
        onBlur={onBlur}
        displayValue={displayValue}
        items={displayItems}
        onAfterSelect={onAfterSelect}
        isLoading={isLoading}
        emptyMessage={emptyMessage}
        placeholder={placeholder}
        className={className}
        autofocus={autofocus}
        ref={ref}
      />

      {description && <FieldDescription>{description}</FieldDescription>}
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
};

export default FormAutoComplete;
