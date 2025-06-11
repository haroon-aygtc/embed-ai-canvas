
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
    Search, Download, RefreshCw, Plus, Settings, CheckCircle, AlertCircle,
    FileText, Globe, Code, Database, Layers, TrendingUp
} from 'lucide-react';
import { SourceCard } from './SourceCard';

interface Source {
    id: string;
    name: string;
    type: 'document' | 'website' | 'api' | 'database' | 'files';
    status: 'active' | 'processing' | 'error' | 'inactive';
    knowledgeBaseName: string;
    size: string;
    itemCount: number;
    accuracy: number;
    queries: number;
    lastSync: string;
    processingProgress?: number;
    errorMessage?: string;
}

export const SourcesList = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');

    // Mock data for sources
    const mockSources: Source[] = [
        {
            id: 'src-1',
            name: 'Product Manual v2.1.pdf',
            type: 'document',
            status: 'active',
            knowledgeBaseName: 'Product Documentation',
            size: '2.4 MB',
            itemCount: 156,
            accuracy: 94,
            queries: 1250,
            lastSync: '2 hours ago'
        },
        {
            id: 'src-2',
            name: 'Company Website',
            type: 'website',
            status: 'processing',
            knowledgeBaseName: 'Company Website',
            size: '890 MB',
            itemCount: 234,
            accuracy: 88,
            queries: 567,
            lastSync: '1 day ago',
            processingProgress: 67
        },
        {
            id: 'src-3',
            name: 'REST API Documentation',
            type: 'api',
            status: 'active',
            knowledgeBaseName: 'API Documentation',
            size: '156 MB',
            itemCount: 45,
            accuracy: 96,
            queries: 445,
            lastSync: '1 hour ago'
        },
        {
            id: 'src-4',
            name: 'Legacy Database',
            type: 'database',
            status: 'error',
            knowledgeBaseName: 'Training Materials',
            size: 'N/A',
            itemCount: 0,
            accuracy: 0,
            queries: 0,
            lastSync: '3 days ago',
            errorMessage: 'Authentication error - credentials invalid'
        },
        {
            id: 'src-5',
            name: 'Training Videos Collection',
            type: 'files',
            status: 'inactive',
            knowledgeBaseName: 'Training Materials',
            size: '3.1 GB',
            itemCount: 67,
            accuracy: 85,
            queries: 234,
            lastSync: '1 week ago'
        },
        {
            id: 'src-6',
            name: 'Customer FAQ Database',
            type: 'document',
            status: 'active',
            knowledgeBaseName: 'Customer Support FAQ',
            size: '1.2 GB',
            itemCount: 89,
            accuracy: 91,
            queries: 890,
            lastSync: '4 hours ago'
        }
    ];

    // Filter sources based on search and filter
    const filteredSources = mockSources.filter(source => {
        const matchesSearch = source.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            source.knowledgeBaseName.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilter = selectedFilter === 'all' ||
            (selectedFilter === 'active' && source.status === 'active') ||
            (selectedFilter === 'processing' && source.status === 'processing') ||
            (selectedFilter === 'error' && source.status === 'error') ||
            (selectedFilter === source.type);

        return matchesSearch && matchesFilter;
    });

    // Calculate statistics
    const stats = {
        total: mockSources.length,
        active: mockSources.filter(s => s.status === 'active').length,
        processing: mockSources.filter(s => s.status === 'processing').length,
        errors: mockSources.filter(s => s.status === 'error').length
    };

    // Handler functions
    const handleViewSource = (sourceId: string) => {
        console.log('View source:', sourceId);
        // Implement view source details
    };

    const handleEditSource = (sourceId: string) => {
        console.log('Edit source:', sourceId);
        // Implement edit source
    };

    const handleSyncSource = (sourceId: string) => {
        console.log('Sync source:', sourceId);
        // Implement sync source
    };

    const handleSourceSettings = (sourceId: string) => {
        console.log('Source settings:', sourceId);
        // Implement source settings
    };

    const handleMoreActions = (sourceId: string) => {
        console.log('More actions for source:', sourceId);
        // Implement more actions menu
    };

    const handleSyncAll = () => {
        console.log('Sync all sources');
        // Implement sync all sources
    };

    const handleExport = () => {
        console.log('Export sources data');
        // Implement export functionality
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-2">Knowledge Sources</h3>
                            <p className="text-sm text-muted-foreground">
                                Manage and monitor all content sources across your knowledge bases
                            </p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search sources..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 w-64"
                                />
                            </div>
                            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                                <SelectTrigger className="w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="processing">Processing</SelectItem>
                                    <SelectItem value="error">Errors</SelectItem>
                                    <SelectItem value="document">Documents</SelectItem>
                                    <SelectItem value="website">Websites</SelectItem>
                                    <SelectItem value="api">APIs</SelectItem>
                                    <SelectItem value="database">Databases</SelectItem>
                                    <SelectItem value="files">Files</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="outline" size="sm" onClick={handleExport}>
                                <Download className="h-4 w-4 mr-2" />
                                Export
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleSyncAll}>
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Sync All
                            </Button>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Source
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Sources</p>
                                <div className="flex items-center space-x-2">
                                    <p className="text-2xl font-bold">{stats.total}</p>
                                    <TrendingUp className="h-4 w-4 text-green-600" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <CheckCircle className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Active</p>
                                <div className="flex items-center space-x-2">
                                    <p className="text-2xl font-bold">{stats.active}</p>
                                    <Badge variant="outline" className="text-xs">+3</Badge>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <RefreshCw className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Processing</p>
                                <div className="flex items-center space-x-2">
                                    <p className="text-2xl font-bold">{stats.processing}</p>
                                    <Badge variant="outline" className="text-xs">67%</Badge>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <AlertCircle className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Errors</p>
                                <div className="flex items-center space-x-2">
                                    <p className="text-2xl font-bold">{stats.errors}</p>
                                    <Badge variant="destructive" className="text-xs">Fix</Badge>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Sources List */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>All Sources ({filteredSources.length})</CardTitle>
                            <CardDescription>
                                Monitor and manage individual content sources
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {filteredSources.map((source) => (
                            <SourceCard
                                key={source.id}
                                source={source}
                                onView={handleViewSource}
                                onEdit={handleEditSource}
                                onSync={handleSyncSource}
                                onSettings={handleSourceSettings}
                                onMoreActions={handleMoreActions}
                            />
                        ))}

                        {filteredSources.length === 0 && (
                            <div className="text-center py-12">
                                <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-medium mb-2">No sources found</h3>
                                <p className="text-muted-foreground mb-4">
                                    {searchQuery || selectedFilter !== 'all'
                                        ? 'Try adjusting your search or filters'
                                        : 'No sources have been created yet'
                                    }
                                </p>
                                <Button>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add New Source
                                </Button>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
