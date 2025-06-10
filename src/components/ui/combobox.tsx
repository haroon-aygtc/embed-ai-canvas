import * as React from "react"
import { Check, ChevronDown, X, Search, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

export interface ComboboxOption {
    value: string
    label: string
    description?: string
    icon?: React.ReactNode
    disabled?: boolean
    group?: string
}

interface ComboboxProps {
    options: ComboboxOption[]
    value?: string | string[]
    onValueChange?: (value: string | string[]) => void
    placeholder?: string
    searchPlaceholder?: string
    emptyText?: string
    multiple?: boolean
    disabled?: boolean
    className?: string
    maxSelected?: number
    allowCustom?: boolean
    onCreateOption?: (value: string) => void
    renderOption?: (option: ComboboxOption) => React.ReactNode
    renderSelected?: (option: ComboboxOption) => React.ReactNode
}

export const Combobox = React.forwardRef<HTMLButtonElement, ComboboxProps>(
    ({
        options,
        value,
        onValueChange,
        placeholder = "Select option...",
        searchPlaceholder = "Search options...",
        emptyText = "No options found.",
        multiple = false,
        disabled = false,
        className,
        maxSelected,
        allowCustom = false,
        onCreateOption,
        renderOption,
        renderSelected,
        ...props
    }, ref) => {
        const [open, setOpen] = React.useState(false)
        const [searchValue, setSearchValue] = React.useState("")

        const selectedValues = React.useMemo(() => {
            if (multiple) {
                return Array.isArray(value) ? value : []
            }
            return value ? [value] : []
        }, [value, multiple])

        const selectedOptions = React.useMemo(() => {
            return options.filter(option => selectedValues.includes(option.value))
        }, [options, selectedValues])

        const filteredOptions = React.useMemo(() => {
            if (!searchValue) return options
            return options.filter(option =>
                option.label.toLowerCase().includes(searchValue.toLowerCase()) ||
                option.description?.toLowerCase().includes(searchValue.toLowerCase())
            )
        }, [options, searchValue])

        const groupedOptions = React.useMemo(() => {
            const groups: Record<string, ComboboxOption[]> = {}
            filteredOptions.forEach(option => {
                const group = option.group || "default"
                if (!groups[group]) groups[group] = []
                groups[group].push(option)
            })
            return groups
        }, [filteredOptions])

        const handleSelect = (optionValue: string) => {
            if (multiple) {
                const newValues = selectedValues.includes(optionValue)
                    ? selectedValues.filter(v => v !== optionValue)
                    : [...selectedValues, optionValue]

                if (maxSelected && newValues.length > maxSelected) return

                onValueChange?.(newValues as string[])
            } else {
                onValueChange?.(optionValue)
                setOpen(false)
            }
            setSearchValue("")
        }

        const handleRemove = (optionValue: string) => {
            if (multiple) {
                const newValues = selectedValues.filter(v => v !== optionValue)
                onValueChange?.(newValues as string[])
            }
        }

        const handleCreateOption = () => {
            if (allowCustom && onCreateOption && searchValue.trim()) {
                onCreateOption(searchValue.trim())
                setSearchValue("")
            }
        }

        const canCreateOption = allowCustom &&
            searchValue.trim() &&
            !options.some(option => option.label.toLowerCase() === searchValue.toLowerCase())

        return (
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        ref={ref}
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        disabled={disabled}
                        className={cn(
                            "h-11 w-full justify-between rounded-lg border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:border-primary/50 shadow-sm",
                            multiple && selectedValues.length > 0 && "h-auto min-h-[44px] py-2",
                            className
                        )}
                        {...props}
                    >
                        <div className="flex flex-1 flex-wrap gap-1">
                            {selectedValues.length === 0 ? (
                                <span className="text-muted-foreground">{placeholder}</span>
                            ) : multiple ? (
                                selectedOptions.map((option) => (
                                    <Badge
                                        key={option.value}
                                        variant="secondary"
                                        className="mr-1 mb-1 hover:bg-secondary/80"
                                    >
                                        {renderSelected ? renderSelected(option) : option.label}
                                        <button
                                            className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    handleRemove(option.value)
                                                }
                                            }}
                                            onMouseDown={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                            }}
                                            onClick={() => handleRemove(option.value)}
                                        >
                                            <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                        </button>
                                    </Badge>
                                ))
                            ) : (
                                <span>{selectedOptions[0]?.label}</span>
                            )}
                        </div>
                        <ChevronDown className="h-4 w-4 shrink-0 opacity-50 transition-transform duration-200 data-[state=open]:rotate-180" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                    <Command>
                        <CommandInput
                            placeholder={searchPlaceholder}
                            value={searchValue}
                            onValueChange={setSearchValue}
                            className="h-11"
                        />
                        <CommandList className="max-h-[300px]">
                            <CommandEmpty className="py-6 text-center text-sm">
                                <div className="space-y-2">
                                    <p>{emptyText}</p>
                                    {canCreateOption && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleCreateOption}
                                            className="h-8 text-xs"
                                        >
                                            <Plus className="h-3 w-3 mr-1" />
                                            Create "{searchValue}"
                                        </Button>
                                    )}
                                </div>
                            </CommandEmpty>

                            {Object.entries(groupedOptions).map(([group, groupOptions]) => (
                                <CommandGroup key={group} heading={group !== "default" ? group : undefined}>
                                    {groupOptions.map((option) => {
                                        const isSelected = selectedValues.includes(option.value)
                                        return (
                                            <CommandItem
                                                key={option.value}
                                                value={option.value}
                                                disabled={option.disabled}
                                                onSelect={() => handleSelect(option.value)}
                                                className="flex items-center gap-2 px-2 py-2.5"
                                            >
                                                <div className="flex h-4 w-4 items-center justify-center">
                                                    {isSelected && <Check className="h-4 w-4 text-primary" />}
                                                </div>

                                                {option.icon && (
                                                    <div className="flex h-4 w-4 items-center justify-center text-muted-foreground">
                                                        {option.icon}
                                                    </div>
                                                )}

                                                <div className="flex-1 space-y-1">
                                                    {renderOption ? renderOption(option) : (
                                                        <>
                                                            <div className="text-sm font-medium">{option.label}</div>
                                                            {option.description && (
                                                                <div className="text-xs text-muted-foreground">{option.description}</div>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </CommandItem>
                                        )
                                    })}
                                </CommandGroup>
                            ))}

                            {canCreateOption && filteredOptions.length > 0 && (
                                <CommandGroup>
                                    <CommandItem onSelect={handleCreateOption} className="flex items-center gap-2 px-2 py-2.5">
                                        <Plus className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">Create "{searchValue}"</span>
                                    </CommandItem>
                                </CommandGroup>
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        )
    }
)

Combobox.displayName = "Combobox"

// Simplified Searchable Select for common use cases
interface SearchableSelectProps {
    options: { value: string; label: string; description?: string }[]
    value?: string
    onValueChange?: (value: string) => void
    placeholder?: string
    className?: string
    disabled?: boolean
}

export const SearchableSelect = React.forwardRef<HTMLButtonElement, SearchableSelectProps>(
    ({ options, value, onValueChange, placeholder = "Select...", className, disabled }, ref) => {
        const comboboxOptions: ComboboxOption[] = options.map(option => ({
            value: option.value,
            label: option.label,
            description: option.description,
        }))

        return (
            <Combobox
                ref={ref}
                options={comboboxOptions}
                value={value}
                onValueChange={onValueChange as (value: string | string[]) => void}
                placeholder={placeholder}
                className={className}
                disabled={disabled}
                multiple={false}
            />
        )
    }
)

SearchableSelect.displayName = "SearchableSelect"

// Multi-Select Component
interface MultiSelectProps {
    options: { value: string; label: string; description?: string }[]
    value?: string[]
    onValueChange?: (value: string[]) => void
    placeholder?: string
    className?: string
    disabled?: boolean
    maxSelected?: number
}

export const MultiSelect = React.forwardRef<HTMLButtonElement, MultiSelectProps>(
    ({ options, value, onValueChange, placeholder = "Select options...", className, disabled, maxSelected }, ref) => {
        const comboboxOptions: ComboboxOption[] = options.map(option => ({
            value: option.value,
            label: option.label,
            description: option.description,
        }))

        return (
            <Combobox
                ref={ref}
                options={comboboxOptions}
                value={value}
                onValueChange={onValueChange as (value: string | string[]) => void}
                placeholder={placeholder}
                className={className}
                disabled={disabled}
                multiple={true}
                maxSelected={maxSelected}
            />
        )
    }
)

MultiSelect.displayName = "MultiSelect" 