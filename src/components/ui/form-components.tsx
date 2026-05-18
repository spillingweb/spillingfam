import { useFieldContext } from '@/store/form-context'
import { cn } from '@/lib/utils'
import { Field, FieldLabel, FieldDescription, FieldError } from './field'
import { InputGroup, InputGroupInput, InputGroupAddon } from './input-group'
import { Input } from './input'
import { Textarea } from './textarea'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './select'
import { Checkbox } from './checkbox'
import { RadioGroup, RadioGroupItem } from './radio-group'
import { Popover, PopoverContent, PopoverTrigger, PopoverAnchor } from './popover'
import { Calendar } from './calendar'
import { Button } from './button'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerTrigger } from './drawer'
import { useState, useRef, useEffect, useCallback } from 'react'
import { CalendarIcon } from 'lucide-react'
import { useTypedDate } from 'react-typed-date'
import { useMediaQuery } from 'usehooks-ts'

// Helper to format errors
const getErrorMessage = (field: any): string | undefined => {
  if (!field.state.meta.isValid) {
    return field.state.meta.errors
      .map((e: any) => (typeof e === 'string' ? e : e.message ?? 'Error'))
      .join(', ')
  }
  return undefined
}

// FormInput Component
interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  description?: string
  addon?: React.ReactNode
  addonPosition?: 'start' | 'end'
}

export const FormInput = ({ 
  label, 
  description, 
  className, 
  addon,
  addonPosition = 'start',
  ...props 
}: FormInputProps) => {
  const field = useFieldContext<string>()
  const error = getErrorMessage(field)

  return (
    <Field>
      {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
      {addon ? (
        <InputGroup>
          {addon && addonPosition === 'start' && (
            <InputGroupAddon align="inline-start">{addon}</InputGroupAddon>
          )}
          <InputGroupInput
            id={field.name}
            name={field.name}
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
            aria-invalid={!!error}
            className={className}
            {...props}
          />
          {addon && addonPosition === 'end' && (
            <InputGroupAddon align="inline-end">{addon}</InputGroupAddon>
          )}
        </InputGroup>
      ) : (
        <Input
          id={field.name}
          name={field.name}
          value={field.state.value}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
          aria-invalid={!!error}
          className={className}
          {...props}
        />
      )}
      {description && <FieldDescription>{description}</FieldDescription>}
      {error && <FieldError>{error}</FieldError>}
    </Field>
  )
}

// FormTextArea Component
interface FormTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  description?: string
}

export const FormTextArea = ({ label, description, className, ...props }: FormTextAreaProps) => {
  const field = useFieldContext<string>()
  const error = getErrorMessage(field)

  return (
    <Field>
      {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
      <Textarea
        id={field.name}
        name={field.name}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        aria-invalid={!!error}
        className={className}
        {...props}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      {error && <FieldError>{error}</FieldError>}
    </Field>
  )
}

// FormSelect Component (Radix UI Select)
interface FormSelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface FormSelectProps {
  label?: string
  description?: string
  placeholder?: string
  options: FormSelectOption[]
  className?: string
}

export const FormSelect = ({ label, description, placeholder = 'Select an option...', options, className }: FormSelectProps) => {
  const field = useFieldContext<string>()
  const error = getErrorMessage(field)

  return (
    <Field>
      {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
      <Select
        value={field.state.value}
        onValueChange={(value) => field.handleChange(value)}
        name={field.name}
      >
        <SelectTrigger
          id={field.name}
          onBlur={field.handleBlur}
          aria-invalid={!!error}
          className={className}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {description && <FieldDescription>{description}</FieldDescription>}
      {error && <FieldError>{error}</FieldError>}
    </Field>
  )
}

// FormFileInput Component
interface FormFileInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: string
  description?: string
  onFileChange?: (files: FileList | null) => void
}

export const FormFileInput = ({ label, description, className, onFileChange, ...props }: FormFileInputProps) => {
  const field = useFieldContext<FileList | null>()
  const error = getErrorMessage(field)

  return (
    <Field>
      {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
      <Input
        id={field.name}
        name={field.name}
        type="file"
        onChange={(e) => {
          const files = e.target.files
          field.handleChange(files)
          onFileChange?.(files)
        }}
        onBlur={field.handleBlur}
        aria-invalid={!!error}
        className={className}
        {...props}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      {error && <FieldError>{error}</FieldError>}
    </Field>
  )
}

// FormCheckbox Component
interface FormCheckboxProps extends Omit<React.ComponentPropsWithoutRef<typeof Checkbox>, 'checked' | 'onCheckedChange'> {
  label?: string
  description?: string
}

export const FormCheckbox = ({ label, description, className, ...props }: FormCheckboxProps) => {
  const field = useFieldContext<boolean>()
  const error = getErrorMessage(field)

  return (
    <Field className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-center gap-2">
        <Checkbox
          id={field.name}
          name={field.name}
          checked={field.state.value}
          onCheckedChange={(checked) => field.handleChange(checked === true)}
          onBlur={field.handleBlur}
          aria-invalid={!!error}
          {...props}
        />
        {label && (
          <FieldLabel
            htmlFor={field.name}
            className={props.disabled ? 'opacity-100!' : undefined}
          >
            {label}
          </FieldLabel>
        )}
      </div>
      {description && <FieldDescription>{description}</FieldDescription>}
      {error && <FieldError>{error}</FieldError>}
    </Field>
  )
}

// FormRadioGroup Component
interface FormRadioOption {
  value: string
  label: string
}

interface FormRadioGroupProps extends Omit<React.ComponentPropsWithoutRef<typeof RadioGroup>, 'value' | 'onValueChange'> {
  label?: string
  description?: string
  options: FormRadioOption[]
  orientation?: 'horizontal' | 'vertical'
}

export const FormRadioGroup = ({ label, description, options, orientation = 'vertical', className, ...props }: FormRadioGroupProps) => {
  const field = useFieldContext<string>()
  const error = getErrorMessage(field)

  return (
    <Field orientation={orientation}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <RadioGroup
        value={field.state.value}
        onValueChange={(value) => field.handleChange(value)}
        onBlur={field.handleBlur}
        className={className}
        {...props}
      >
        {options.map((option) => (
          <div className="flex items-center gap-3" key={option.value}>
            <RadioGroupItem
              value={option.value}
              id={`${field.name}-${option.value}`}
              aria-invalid={!!error}
            />
            <FieldLabel
              htmlFor={`${field.name}-${option.value}`}
              className="font-normal"
            >
              {option.label}
            </FieldLabel>
          </div>
        ))}
      </RadioGroup>
      {description && <FieldDescription>{description}</FieldDescription>}
      {error && <FieldError>{error}</FieldError>}
    </Field>
  )
}

// FormAutocomplete Component
interface FormAutocompleteOption {
  value: string
  label: string
  disabled?: boolean
}

interface FormAutocompleteProps {
  label?: string
  description?: string
  placeholder?: string
  options: FormAutocompleteOption[]
  className?: string
  emptyMessage?: string
}

export const FormAutocomplete = ({ 
  label, 
  description, 
  placeholder = 'Search...', 
  options, 
  className,
  emptyMessage = 'No results found.' 
}: FormAutocompleteProps) => {
  const field = useFieldContext<string>()
  const error = getErrorMessage(field)
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Filter options based on search
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(search.toLowerCase())
  )

  // Get display value
  const selectedOption = options.find(opt => opt.value === field.state.value)
  const displayValue = selectedOption?.label || ''

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleSelect = (value: string) => {
    field.handleChange(value)
    setIsOpen(false)
    setSearch('')
    inputRef.current?.blur()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    if (!isOpen) setIsOpen(true)
  }

  return (
    <Field className={className}>
      {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
      <div ref={containerRef} className="relative">
        <Input
          ref={inputRef}
          id={field.name}
          name={field.name}
          type="text"
          value={isOpen ? search : displayValue}
          onChange={handleInputChange}
          onFocus={() => {
            setIsOpen(true)
            setSearch('')
          }}
          onBlur={field.handleBlur}
          placeholder={placeholder}
          aria-invalid={!!error}
          autoComplete="off"
          className={cn('pr-10', className)}
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          tabIndex={-1}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn('transition-transform', isOpen && 'rotate-180')}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-muted-foreground text-center">
                {emptyMessage}
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  disabled={option.disabled}
                  className={cn(
                    'w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer',
                    option.value === field.state.value && 'bg-accent text-accent-foreground font-medium',
                    option.disabled && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  {option.label}
                </button>
              ))
            )}
          </div>
        )}
      </div>
      {description && <FieldDescription>{description}</FieldDescription>}
      {error && <FieldError>{error}</FieldError>}
    </Field>
  )
}

// FormCalendarSelect Component
interface FormCalendarSelectProps {
  label?: string
  description?: string
  placeholder?: string
  className?: string
  disabled?: boolean
  disabledBefore?: Date
  disabledAfter?: Date
}

export const FormCalendarSelect = ({ 
  label, 
  description, 
  placeholder = 'Velg dato', 
  className,
  disabled = false,
  disabledBefore,
  disabledAfter,
}: FormCalendarSelectProps) => {
  const field = useFieldContext<string>()
  const error = getErrorMessage(field)
  const [isOpen, setIsOpen] = useState(false)
  const isMobile = useMediaQuery('(max-width: 768px)')
  
  // Extract stable references
  const currentValue = field.state.value
  const handleChange = field.handleChange
  
  // Use local state for the date to prevent feedback loops with useTypedDate
  const [localDate, setLocalDate] = useState<Date | undefined>(() => 
    currentValue ? new Date(currentValue) : undefined
  )
  
  // Track if we're updating from user input vs field sync
  const isUserInputRef = useRef(false)

  // Sync local date with field value only when field changes externally
  useEffect(() => {
    // Skip if this change came from user input
    if (isUserInputRef.current) {
      isUserInputRef.current = false
      return
    }
    
    const newDate = currentValue ? new Date(currentValue) : undefined
    setLocalDate(newDate)
  }, [currentValue])

  // Handle date changes from user typing
  const handleDateChange = useCallback((date: Date | undefined) => {
    // Mark this as user input
    isUserInputRef.current = true
    
    // Update local state immediately for responsive UI
    setLocalDate(date)
    
    // Update field value
    if (!date) {
      handleChange('')
      return
    }
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return
    }
    
    // Store as date-only string (YYYY-MM-DD)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const newValue = `${year}-${month}-${day}`
    
    handleChange(newValue)
  }, [handleChange])

  // Use typed date hook for editable input with Norwegian format
  const { inputProps } = useTypedDate({
    value: localDate,
    onChange: handleDateChange,
    format: 'DD.MM.YYYY',
  })

  const handleSelect = (date: Date | undefined) => {
    // Mark this as user input
    isUserInputRef.current = true
    
    // Update local state
    setLocalDate(date)
    
    if (!date) {
      handleChange('')
      setIsOpen(false)
      return
    }
    
    // Store as date-only string (YYYY-MM-DD)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const newValue = `${year}-${month}-${day}`
    
    handleChange(newValue)
    setIsOpen(false)
  }

  // Build disabled dates array
  const disabledDates = []
  if (disabledBefore) {
    disabledDates.push({ before: disabledBefore })
  }
  if (disabledAfter) {
    disabledDates.push({ after: disabledAfter })
  }

  // Calendar content (shared between desktop and mobile)
  const calendarContent = (
    <Calendar
      mode="single"
      selected={localDate}
      onSelect={handleSelect}
      disabled={disabledDates.length > 0 ? disabledDates : undefined}
      showOutsideDays={true}
      captionLayout="dropdown"
      defaultMonth={localDate}
      startMonth={disabledBefore}
      endMonth={disabledAfter}
      className={isMobile ? 'mx-auto [--cell-size:clamp(0px,calc(100vw/7.5),52px)]' : ''}
    />
  )

  // Mobile: Use Drawer
  if (isMobile) {
    return (
      <Field className={className}>
        {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerTrigger asChild disabled={disabled}>
            <button
              id={field.name}
              type="button"
              aria-invalid={!!error}
              className={cn(
                'flex items-center justify-between gap-1 rounded-none border bg-transparent px-0 py-2 text-sm whitespace-nowrap outline-none h-10 font-normal transition-[color,border-color] w-full',
                'border-transparent border-b-input',
                'focus-visible:border-b-ring',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'aria-invalid:border-b-destructive',
                !localDate && 'text-muted-foreground',
              )}
              onBlur={field.handleBlur}
              disabled={disabled}
            >
              {inputProps.value || placeholder}
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </button>
          </DrawerTrigger>
          <DrawerContent className="p-0 w-auto overflow-hidden">
            <DrawerHeader className="sr-only">
              <DrawerTitle>{placeholder}</DrawerTitle>
              <DrawerDescription>Velg en dato fra kalenderen</DrawerDescription>
            </DrawerHeader>
            {calendarContent}
          </DrawerContent>
        </Drawer>
        {description && <FieldDescription>{description}</FieldDescription>}
        {error && <FieldError>{error}</FieldError>}
      </Field>
    )
  }

  // Desktop: Use Popover with InputGroup
  return (
    <Field className={className}>
      {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
      <Popover open={disabled ? false : isOpen} onOpenChange={setIsOpen} modal={false}>
        <PopoverAnchor asChild>
          <InputGroup
            className={cn(
              'flex cursor-pointer select-none focus:outline-none',
              !localDate && 'text-muted-foreground',
            )}
          >
            <InputGroupInput
              id={field.name}
              {...inputProps}
              onBlur={field.handleBlur}
              disabled={disabled}
              aria-invalid={!!error}
              placeholder={placeholder}
            />
            <InputGroupAddon align="inline-end">
              <PopoverTrigger asChild disabled={disabled}>
                <Button
                  type="button"
                  variant="ghost"
                  className="hover:bg-transparent! opacity-50 hover:opacity-100 p-0! mr-1"
                  disabled={disabled}
                >
                  <CalendarIcon className="text-muted-foreground h-4 w-4" />
                </Button>
              </PopoverTrigger>
            </InputGroupAddon>
          </InputGroup>
        </PopoverAnchor>
        <PopoverContent
          className="p-0 w-full min-w-(--radix-select-trigger-width,8rem)"
          align="end"
        >
          {calendarContent}
        </PopoverContent>
      </Popover>
      {description && <FieldDescription>{description}</FieldDescription>}
      {error && <FieldError>{error}</FieldError>}
    </Field>
  )
}
