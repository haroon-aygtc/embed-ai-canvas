import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    Input,
    InputWithIcon,
    SearchInput,
    PasswordInput,
    InputCompact,
    InputLarge
} from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectTriggerCompact
} from '@/components/ui/select';
import {
    Combobox,
    SearchableSelect,
    MultiSelect,
    ComboboxOption
} from '@/components/ui/combobox';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    DollarSign,
    Globe,
    Building,
    Users,
    Briefcase,
    Star,
    Flag,
    Zap,
    Shield,
    Heart
} from 'lucide-react';

/**
 * Professional Input & Select Components Examples
 * 
 * This file demonstrates all enhanced input and select components:
 * 
 * INPUTS:
 * - Enhanced Input with professional styling
 * - InputWithIcon for icon support
 * - SearchInput with clear functionality
 * - PasswordInput with toggle visibility
 * - InputCompact for smaller spaces
 * - InputLarge for prominent forms
 * 
 * SELECTS:
 * - Enhanced Select with better animations
 * - SelectTriggerCompact for smaller spaces
 * - Combobox (Select2-style) with search
 * - SearchableSelect (simplified)
 * - MultiSelect for multiple selections
 */

export const InputSelectExamples = () => {
    const [searchValue, setSearchValue] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedProvider, setSelectedProvider] = useState('');

    // Sample data for examples
    const countries = [
        { value: 'us', label: 'United States', description: 'North America' },
        { value: 'uk', label: 'United Kingdom', description: 'Europe' },
        { value: 'ca', label: 'Canada', description: 'North America' },
        { value: 'au', label: 'Australia', description: 'Oceania' },
        { value: 'de', label: 'Germany', description: 'Europe' },
        { value: 'fr', label: 'France', description: 'Europe' },
        { value: 'jp', label: 'Japan', description: 'Asia' },
        { value: 'br', label: 'Brazil', description: 'South America' },
        { value: 'in', label: 'India', description: 'Asia' },
        { value: 'mx', label: 'Mexico', description: 'North America' },
    ];

    const tags = [
        { value: 'react', label: 'React', description: 'JavaScript library' },
        { value: 'typescript', label: 'TypeScript', description: 'Typed JavaScript' },
        { value: 'nextjs', label: 'Next.js', description: 'React framework' },
        { value: 'tailwind', label: 'Tailwind CSS', description: 'Utility-first CSS' },
        { value: 'nodejs', label: 'Node.js', description: 'JavaScript runtime' },
        { value: 'python', label: 'Python', description: 'Programming language' },
        { value: 'docker', label: 'Docker', description: 'Containerization' },
        { value: 'aws', label: 'AWS', description: 'Cloud platform' },
    ];

    const aiProviders: ComboboxOption[] = [
        {
            value: 'openai',
            label: 'OpenAI',
            description: 'GPT-4, GPT-3.5 Turbo',
            icon: <Zap className="h-4 w-4" />,
            group: 'Popular'
        },
        {
            value: 'anthropic',
            label: 'Anthropic',
            description: 'Claude-3 Opus, Sonnet, Haiku',
            icon: <Shield className="h-4 w-4" />,
            group: 'Popular'
        },
        {
            value: 'google',
            label: 'Google',
            description: 'Gemini Pro, PaLM',
            icon: <Star className="h-4 w-4" />,
            group: 'Enterprise'
        },
        {
            value: 'meta',
            label: 'Meta',
            description: 'Llama-3 70B, 8B',
            icon: <Heart className="h-4 w-4" />,
            group: 'Open Source'
        },
        {
            value: 'cohere',
            label: 'Cohere',
            description: 'Command, Embed models',
            icon: <Building className="h-4 w-4" />,
            group: 'Enterprise'
        },
    ];

    return (
        <div className="space-y-8 p-6 max-w-6xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold mb-2">Enhanced Input & Select Components</h1>
                <p className="text-muted-foreground">Professional, user-friendly form components with advanced features</p>
            </div>

            {/* Enhanced Inputs */}
            <Card>
                <CardHeader>
                    <CardTitle>Enhanced Input Components</CardTitle>
                    <CardDescription>
                        Professional input fields with improved styling, animations, and user experience
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Standard Enhanced Input */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name (Enhanced)</Label>
                            <Input
                                id="name"
                                placeholder="Enter your full name"
                                className="w-full"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                className="w-full"
                            />
                        </div>
                    </div>

                    {/* Input with Icons */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Input with Left Icon</Label>
                            <InputWithIcon
                                icon={<User className="h-4 w-4" />}
                                placeholder="Username"
                                iconPosition="left"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Input with Right Icon</Label>
                            <InputWithIcon
                                icon={<Mail className="h-4 w-4" />}
                                placeholder="Email address"
                                iconPosition="right"
                            />
                        </div>
                    </div>

                    {/* Search Input */}
                    <div className="space-y-2">
                        <Label>Search Input with Clear</Label>
                        <SearchInput
                            placeholder="Search anything..."
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            onClear={() => setSearchValue('')}
                        />
                    </div>

                    {/* Password Input */}
                    <div className="space-y-2">
                        <Label>Password Input with Toggle</Label>
                        <PasswordInput
                            placeholder="Enter your password"
                        />
                    </div>

                    {/* Size Variants */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Compact Input (for tables/forms)</Label>
                            <InputCompact placeholder="Compact input" />
                        </div>
                        <div className="space-y-2">
                            <Label>Large Input (for hero sections)</Label>
                            <InputLarge placeholder="Large prominent input" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Enhanced Selects */}
            <Card>
                <CardHeader>
                    <CardTitle>Enhanced Select Components</CardTitle>
                    <CardDescription>
                        Improved select dropdowns with better animations and professional styling
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Standard Enhanced Select */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Enhanced Select</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose an option" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="option1">Option 1</SelectItem>
                                    <SelectItem value="option2">Option 2</SelectItem>
                                    <SelectItem value="option3">Option 3</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Compact Select</Label>
                            <Select>
                                <SelectTriggerCompact>
                                    <SelectValue placeholder="Compact select" />
                                </SelectTriggerCompact>
                                <SelectContent>
                                    <SelectItem value="small1">Small Option 1</SelectItem>
                                    <SelectItem value="small2">Small Option 2</SelectItem>
                                    <SelectItem value="small3">Small Option 3</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Searchable Select2-Style Components */}
            <Card>
                <CardHeader>
                    <CardTitle>Searchable Select2-Style Components</CardTitle>
                    <CardDescription>
                        Advanced searchable dropdowns with filtering, grouping, and multi-selection
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Simple Searchable Select */}
                    <div className="space-y-2">
                        <Label>Searchable Country Select</Label>
                        <SearchableSelect
                            options={countries}
                            value={selectedCountry}
                            onValueChange={setSelectedCountry}
                            placeholder="Search and select a country..."
                        />
                    </div>

                    {/* Multi-Select */}
                    <div className="space-y-2">
                        <Label>Multi-Select Tags</Label>
                        <MultiSelect
                            options={tags}
                            value={selectedTags}
                            onValueChange={setSelectedTags}
                            placeholder="Select multiple technologies..."
                            maxSelected={5}
                        />
                    </div>

                    {/* Advanced Combobox with Groups and Icons */}
                    <div className="space-y-2">
                        <Label>Advanced AI Provider Selection</Label>
                        <Combobox
                            options={aiProviders}
                            value={selectedProvider}
                            onValueChange={(value) => setSelectedProvider(value as string)}
                            placeholder="Choose AI provider..."
                            searchPlaceholder="Search providers..."
                            emptyText="No providers found"
                            renderOption={(option) => (
                                <div className="flex items-center space-x-2">
                                    {option.icon}
                                    <div>
                                        <div className="font-medium">{option.label}</div>
                                        <div className="text-xs text-muted-foreground">{option.description}</div>
                                    </div>
                                </div>
                            )}
                        />
                    </div>

                    {/* Custom Creation Example */}
                    <div className="space-y-2">
                        <Label>Combobox with Custom Creation</Label>
                        <Combobox
                            options={[
                                { value: 'preset1', label: 'Preset Option 1', description: 'Pre-defined option' },
                                { value: 'preset2', label: 'Preset Option 2', description: 'Another preset' },
                            ]}
                            placeholder="Type to search or create new..."
                            allowCustom={true}
                            onCreateOption={(value) => {
                                console.log('Creating new option:', value);
                                // Handle custom option creation
                            }}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Real-World Form Example */}
            <Card>
                <CardHeader>
                    <CardTitle>Real-World Form Example</CardTitle>
                    <CardDescription>
                        Complete form using all enhanced components together
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="company">Company Name</Label>
                                <InputWithIcon
                                    id="company"
                                    icon={<Building className="h-4 w-4" />}
                                    placeholder="Your company"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="industry">Industry</Label>
                                <SearchableSelect
                                    options={[
                                        { value: 'tech', label: 'Technology', description: 'Software & IT' },
                                        { value: 'finance', label: 'Finance', description: 'Banking & Investment' },
                                        { value: 'healthcare', label: 'Healthcare', description: 'Medical & Pharma' },
                                        { value: 'education', label: 'Education', description: 'Schools & Training' },
                                        { value: 'retail', label: 'Retail', description: 'Commerce & Sales' },
                                    ]}
                                    placeholder="Select industry..."
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <InputWithIcon
                                    id="phone"
                                    icon={<Phone className="h-4 w-4" />}
                                    placeholder="+1 (555) 123-4567"
                                    type="tel"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <InputWithIcon
                                    id="location"
                                    icon={<MapPin className="h-4 w-4" />}
                                    placeholder="City, Country"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Team Size</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select team size" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1-10">1-10 employees</SelectItem>
                                    <SelectItem value="11-50">11-50 employees</SelectItem>
                                    <SelectItem value="51-200">51-200 employees</SelectItem>
                                    <SelectItem value="201-1000">201-1000 employees</SelectItem>
                                    <SelectItem value="1000+">1000+ employees</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Technologies Used</Label>
                            <MultiSelect
                                options={tags}
                                placeholder="Select technologies your team uses..."
                                maxSelected={10}
                            />
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Usage Guidelines */}
            <Card>
                <CardHeader>
                    <CardTitle>Usage Guidelines</CardTitle>
                    <CardDescription>When to use each component type</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h4 className="font-semibold">Input Components</h4>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <strong>Input:</strong> Standard text input with enhanced styling
                                </div>
                                <div>
                                    <strong>InputWithIcon:</strong> When you need visual context or actions
                                </div>
                                <div>
                                    <strong>SearchInput:</strong> For search functionality with clear option
                                </div>
                                <div>
                                    <strong>PasswordInput:</strong> Secure password entry with visibility toggle
                                </div>
                                <div>
                                    <strong>InputCompact:</strong> Tables, inline forms, space-constrained areas
                                </div>
                                <div>
                                    <strong>InputLarge:</strong> Hero sections, prominent forms, landing pages
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-semibold">Select Components</h4>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <strong>Select:</strong> Standard dropdown with enhanced animations
                                </div>
                                <div>
                                    <strong>SearchableSelect:</strong> Large option lists that need filtering
                                </div>
                                <div>
                                    <strong>MultiSelect:</strong> When users need to select multiple options
                                </div>
                                <div>
                                    <strong>Combobox:</strong> Advanced use cases with groups, icons, custom creation
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

// Example usage in your components:

/*
// Basic Enhanced Input
<Input placeholder="Enter text..." />

// Input with Icon
<InputWithIcon 
  icon={<User className="h-4 w-4" />} 
  placeholder="Username" 
/>

// Search Input
<SearchInput 
  value={search} 
  onChange={(e) => setSearch(e.target.value)}
  onClear={() => setSearch('')}
  placeholder="Search..."
/>

// Searchable Select
<SearchableSelect
  options={[
    { value: 'option1', label: 'Option 1', description: 'Description' },
    { value: 'option2', label: 'Option 2', description: 'Description' }
  ]}
  value={selected}
  onValueChange={setSelected}
  placeholder="Select option..."
/>

// Multi-Select
<MultiSelect
  options={options}
  value={selectedItems}
  onValueChange={setSelectedItems}
  placeholder="Select multiple..."
  maxSelected={5}
/>

// Advanced Combobox
<Combobox
  options={complexOptions}
  value={value}
  onValueChange={setValue}
  placeholder="Advanced selection..."
  allowCustom={true}
  onCreateOption={handleCreate}
/>
*/ 