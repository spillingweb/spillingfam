import { Search } from "lucide-react"
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group"

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function SearchInput({ 
  value, 
  onChange, 
  placeholder = "Søk...",
  className = ""
}: SearchInputProps) {
  return (
    <InputGroup className={className}>
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
      <InputGroupInput
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </InputGroup>
  )
}
