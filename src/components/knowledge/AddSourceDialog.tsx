
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText, Globe, Code, Database, Layers, X } from 'lucide-react';

interface AddSourceDialogProps {
    trigger?: React.ReactNode;
    onSourceAdd: (source: any) => void;
}

export const AddSourceDialog = ({ trigger, onSourceAdd }: AddSourceDialogProps) => {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        knowledgeBaseName: '',
        description: '',
        source: '',
        tags: [] as string[],
        tagInput: ''
    });

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'document': return FileText;
            case 'website': return Globe;
            case 'api': return Code;
            case 'database': return Database;
            case 'files': return Layers;
            default: return FileText;
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const newSource = {
            id: `src-${Date.now()}`,
            name: formData.name,
            type: formData.type as 'document' | 'website' | 'api' | 'database' | 'files',
            status: 'processing' as const,
            knowledgeBaseName: formData.knowledgeBaseName,
            size: 'Processing...',
            itemCount: 0,
            accuracy: 0,
            queries: 0,
            lastSync: 'Just now',
            processingProgress: 10,
            tags: formData.tags
        };

        onSourceAdd(newSource);
        setOpen(false);
        
        // Reset form
        setFormData({
            name: '',
            type: '',
            knowledgeBaseName: '',
            description: '',
            source: '',
            tags: [],
            tagInput: ''
        });
    };

    const addTag = () => {
        if (formData.tagInput.trim() && !formData.tags.includes(formData.tagInput.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, prev.tagInput.trim()],
                tagInput: ''
            }));
        }
    };

    const removeTag = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const TypeIcon = formData.type ? getTypeIcon(formData.type) : FileText;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Source
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <TypeIcon className="h-5 w-5" />
                        Add New Source
                    </DialogTitle>
                    <DialogDescription>
                        Add a new content source to your knowledge base
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Source Name</Label>
                            <Input
                                id="name"
                                placeholder="e.g., Product Documentation"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="type">Source Type</Label>
                            <Select 
                                value={formData.type} 
                                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select source type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="document">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4" />
                                            Document
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="website">
                                        <div className="flex items-center gap-2">
                                            <Globe className="h-4 w-4" />
                                            Website
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="api">
                                        <div className="flex items-center gap-2">
                                            <Code className="h-4 w-4" />
                                            API
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="database">
                                        <div className="flex items-center gap-2">
                                            <Database className="h-4 w-4" />
                                            Database
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="files">
                                        <div className="flex items-center gap-2">
                                            <Layers className="h-4 w-4" />
                                            Files
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="knowledgeBase">Knowledge Base</Label>
                        <Input
                            id="knowledgeBase"
                            placeholder="e.g., Product Documentation"
                            value={formData.knowledgeBaseName}
                            onChange={(e) => setFormData(prev => ({ ...prev, knowledgeBaseName: e.target.value }))}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="source">Source Location</Label>
                        <Input
                            id="source"
                            placeholder={
                                formData.type === 'website' ? 'https://example.com' :
                                formData.type === 'api' ? 'https://api.example.com' :
                                formData.type === 'database' ? 'Database connection string' :
                                'File path or URL'
                            }
                            value={formData.source}
                            onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description (Optional)</Label>
                        <Textarea
                            id="description"
                            placeholder="Describe what this source contains..."
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Tags</Label>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Add a tag..."
                                value={formData.tagInput}
                                onChange={(e) => setFormData(prev => ({ ...prev, tagInput: e.target.value }))}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                            />
                            <Button type="button" variant="outline" onClick={addTag}>
                                Add
                            </Button>
                        </div>
                        {formData.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                                {formData.tags.map((tag, index) => (
                                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                        {tag}
                                        <X 
                                            className="h-3 w-3 cursor-pointer" 
                                            onClick={() => removeTag(tag)}
                                        />
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            Add Source
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
