import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
    Database, FileText, BarChart3, Settings, Plus, Eye, Edit, Trash2,
    CheckCircle, Target, BookOpen, Search, Filter, Grid3X3, List,
    MoreHorizontal, Download, Upload, Copy, Share, Archive, Star,
    TrendingUp, TrendingDown, Clock, Users, Zap, Brain, Globe,
    Layers, Code, Image, Video, Music, FileCode, Link, Cpu,
    AlertCircle, Info, Sparkles, RefreshCw, SortAsc, SortDesc
} from 'lucide-react';
import { useSetupWizard } from '@/hooks/useSetupWizard';
import { SetupWizard } from '@/components/onboarding/SetupWizard';

// Enhanced interfaces for knowledge base management
interface KnowledgeBase {
    id: string;
    name: string;
    description: string;
    type: 'documents' | 'website' | 'api' | 'database' | 'files';
    status: 'active' | 'inactive' | 'processing' | 'error';
    sources: number;
    documents: number;
    accuracy: number;
    usage: number;
    lastUpdated: Date;
    version: string;
    tags: string[];
    isStarred: boolean;
    processingProgress?: number;
    size: string;
    owner: string;
    collaborators: number;
}

import { SourcesList } from '@/components/knowledge/SourcesList';

const KnowledgePage = () => {
    const { showWizard, handleWizardComplete, handleWizardSkip, handleStartWizard } = useSetupWizard();

    // State management for enhanced features
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');

    // Mock data for knowledge bases
    const mockKnowledgeBases: KnowledgeBase[] = [
        {
            id: '1',
            name: 'Product Documentation',
            description: 'Comprehensive product guides, tutorials, and technical documentation',
            type: 'documents',
            status: 'active',
            sources: 24,
            documents: 156,
            accuracy: 94,
            usage: 1250,
            lastUpdated: new Date('2024-01-15'),
            version: 'v2.1.0',
            tags: ['documentation', 'guides', 'technical'],
            isStarred: true,
            size: '2.4 GB',
            owner: 'Sarah Chen',
            collaborators: 5
        },
        {
            id: '2',
            name: 'Customer Support FAQ',
            description: 'Frequently asked questions and support articles for customer service',
            type: 'documents',
            status: 'active',
            sources: 18,
            documents: 89,
            accuracy: 91,
            usage: 890,
            lastUpdated: new Date('2024-01-12'),
            version: 'v1.8.2',
            tags: ['support', 'faq', 'customer'],
            isStarred: false,
            size: '1.2 GB',
            owner: 'Mike Johnson',
            collaborators: 3
        },
        {
            id: '3',
            name: 'Company Website',
            description: 'Website content including pages, blogs, and marketing materials',
            type: 'website',
            status: 'processing',
            sources: 1,
            documents: 234,
            accuracy: 88,
            usage: 567,
            lastUpdated: new Date('2024-01-14'),
            version: 'v1.0.0',
            tags: ['website', 'marketing', 'content'],
            isStarred: false,
            processingProgress: 67,
            size: '890 MB',
            owner: 'Emily Watson',
            collaborators: 2
        },
        {
            id: '4',
            name: 'API Documentation',
            description: 'REST API endpoints, schemas, and integration examples',
            type: 'api',
            status: 'active',
            sources: 12,
            documents: 45,
            accuracy: 96,
            usage: 445,
            lastUpdated: new Date('2024-01-10'),
            version: 'v3.2.1',
            tags: ['api', 'integration', 'development'],
            isStarred: true,
            size: '156 MB',
            owner: 'David Kim',
            collaborators: 8
        },
        {
            id: '5',
            name: 'Training Materials',
            description: 'Employee training videos, presentations, and onboarding content',
            type: 'files',
            status: 'inactive',
            sources: 8,
            documents: 67,
            accuracy: 85,
            usage: 234,
            lastUpdated: new Date('2024-01-08'),
            version: 'v1.5.0',
            tags: ['training', 'onboarding', 'hr'],
            isStarred: false,
            size: '3.1 GB',
            owner: 'Lisa Park',
            collaborators: 4
        }
    ];

    if (showWizard) {
        return (
            <SetupWizard
                onComplete={handleWizardComplete}
                onSkip={handleWizardSkip}
            />
        );
    }

    // Header actions
    const headerActions = (
        <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Import
            </Button>
            <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
            </Button>
            <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Knowledge Base
            </Button>
        </div>
    );

    // Filter and search functionality
    const filteredKnowledgeBases = mockKnowledgeBases.filter(kb => {
        const matchesSearch = kb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            kb.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            kb.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesFilter = selectedFilter === 'all' ||
            (selectedFilter === 'active' && kb.status === 'active') ||
            (selectedFilter === 'processing' && kb.status === 'processing') ||
            (selectedFilter === 'starred' && kb.isStarred) ||
            (selectedFilter === kb.type);

        return matchesSearch && matchesFilter;
    });

    // Get type icon
    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'documents': return FileText;
            case 'website': return Globe;
            case 'api': return Code;
            case 'database': return Database;
            case 'files': return Layers;
            default: return FileText;
        }
    };

    // Get status color
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'processing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
            case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <PageHeader
                    title="Knowledge Base Management"
                    description="Create, manage, and optimize your AI knowledge sources for enhanced chat responses"
                    onSetupWizard={handleStartWizard}
                    actions={headerActions}
                />

                {/* Search and Filter Bar */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row gap-4 items-center">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search knowledge bases, tags, or content..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                                    <SelectTrigger className="w-40">
                                        <Filter className="h-4 w-4 mr-2" />
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="processing">Processing</SelectItem>
                                        <SelectItem value="starred">Starred</SelectItem>
                                        <SelectItem value="documents">Documents</SelectItem>
                                        <SelectItem value="website">Website</SelectItem>
                                        <SelectItem value="api">API</SelectItem>
                                        <SelectItem value="database">Database</SelectItem>
                                        <SelectItem value="files">Files</SelectItem>
                                    </SelectContent>
                                </Select>

                                <div className="flex items-center space-x-2 border rounded-lg p-1">
                                    <Button
                                        variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                        size="sm"
                                        onClick={() => setViewMode('grid')}
                                    >
                                        <Grid3X3 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant={viewMode === 'list' ? 'default' : 'ghost'}
                                        size="sm"
                                        onClick={() => setViewMode('list')}
                                    >
                                        <List className="h-4 w-4" />
                                    </Button>
                                </div>

                                <Button variant="outline" size="sm">
                                    <RefreshCw className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Statistics Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Database className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total Bases</p>
                                    <div className="flex items-center space-x-2">
                                        <p className="text-2xl font-bold">{mockKnowledgeBases.length}</p>
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
                                        <p className="text-2xl font-bold">{mockKnowledgeBases.filter(kb => kb.status === 'active').length}</p>
                                        <Badge variant="outline" className="text-xs">+2</Badge>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <FileText className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total Sources</p>
                                    <div className="flex items-center space-x-2">
                                        <p className="text-2xl font-bold">{mockKnowledgeBases.reduce((sum, kb) => sum + kb.sources, 0)}</p>
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
                                    <BookOpen className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Documents</p>
                                    <div className="flex items-center space-x-2">
                                        <p className="text-2xl font-bold">{mockKnowledgeBases.reduce((sum, kb) => sum + kb.documents, 0)}</p>
                                        <Badge variant="outline" className="text-xs">+45</Badge>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Target className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Avg Accuracy</p>
                                    <div className="flex items-center space-x-2">
                                        <p className="text-2xl font-bold">
                                            {Math.round(mockKnowledgeBases.reduce((sum, kb) => sum + kb.accuracy, 0) / mockKnowledgeBases.length)}%
                                        </p>
                                        <TrendingUp className="h-4 w-4 text-green-600" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Tabs */}
                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="overview" className="flex items-center gap-2">
                            <Database className="h-4 w-4" />
                            Overview
                        </TabsTrigger>
                        <TabsTrigger value="sources" className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Sources
                        </TabsTrigger>
                        <TabsTrigger value="analytics" className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4" />
                            Analytics
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="flex items-center gap-2">
                            <Settings className="h-4 w-4" />
                            Settings
                        </TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        {/* Knowledge Base Cards */}
                        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                            {filteredKnowledgeBases.map((kb) => {
                                const TypeIcon = getTypeIcon(kb.type);
                                return (
                                    <Card
                                        key={kb.id}
                                        className="hover:shadow-md transition-all duration-200 cursor-pointer group"
                                    >
                                        <CardHeader className="pb-3">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center space-x-3 flex-1">
                                                    <div className="p-2 bg-primary/10 rounded-lg">
                                                        <TypeIcon className="h-5 w-5 text-primary" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center space-x-2">
                                                            <CardTitle className="text-lg line-clamp-1">
                                                                {kb.name}
                                                            </CardTitle>
                                                            {kb.isStarred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                                                        </div>
                                                        <div className="flex items-center space-x-2 mt-1">
                                                            <Badge className={getStatusColor(kb.status)}>
                                                                {kb.status}
                                                            </Badge>
                                                            <Badge variant="outline" className="text-xs">{kb.version}</Badge>
                                                            <Badge variant="outline" className="text-xs capitalize">{kb.type}</Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="space-y-4">
                                            <CardDescription className="line-clamp-2">
                                                {kb.description}
                                            </CardDescription>

                                            {/* Processing Progress */}
                                            {kb.status === 'processing' && kb.processingProgress && (
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-muted-foreground">Processing...</span>
                                                        <span className="font-medium">{kb.processingProgress}%</span>
                                                    </div>
                                                    <Progress value={kb.processingProgress} className="h-2" />
                                                </div>
                                            )}

                                            {/* Metrics Grid */}
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Sources:</span>
                                                    <span className="font-medium">{kb.sources}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Documents:</span>
                                                    <span className="font-medium">{kb.documents}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Accuracy:</span>
                                                    <span className="font-medium">{kb.accuracy}%</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Usage:</span>
                                                    <span className="font-medium">{kb.usage}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Size:</span>
                                                    <span className="font-medium">{kb.size}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Team:</span>
                                                    <span className="font-medium">{kb.collaborators + 1}</span>
                                                </div>
                                            </div>

                                            {/* Tags */}
                                            <div className="flex flex-wrap gap-1">
                                                {kb.tags.map((tag, index) => (
                                                    <Badge key={index} variant="secondary" className="text-xs">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center justify-between pt-2 border-t">
                                                <div className="text-xs text-muted-foreground">
                                                    Updated {kb.lastUpdated.toLocaleDateString()}
                                                </div>
                                                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                    <Button variant="ghost" size="sm" title="View Details">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" title="Edit">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" title="Share">
                                                        <Share className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" title="Settings">
                                                        <Settings className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>

                        {/* Empty State */}
                        {filteredKnowledgeBases.length === 0 && (
                            <Card className="border-dashed border-2">
                                <CardContent className="text-center py-12">
                                    <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-medium mb-2">No knowledge bases found</h3>
                                    <p className="text-muted-foreground mb-4">
                                        {searchQuery || selectedFilter !== 'all'
                                            ? 'Try adjusting your search or filters'
                                            : 'Create your first knowledge base to get started'
                                        }
                                    </p>
                                    <Button>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Create Knowledge Base
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    {/* Sources Tab - Updated */}
                    <TabsContent value="sources" className="space-y-6">
                        <SourcesList />
                    </TabsContent>

                    {/* Analytics Tab */}
                    <TabsContent value="analytics" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Card>
                                <CardContent className="p-4">
                                    <div className="text-center">
                                        <div className="flex items-center justify-center space-x-2 mb-2">
                                            <Users className="h-5 w-5 text-primary" />
                                            <p className="text-2xl font-bold">12,450</p>
                                        </div>
                                        <p className="text-sm text-muted-foreground">Total Queries</p>
                                        <div className="flex items-center justify-center space-x-1 mt-1">
                                            <TrendingUp className="h-3 w-3 text-green-600" />
                                            <span className="text-xs text-green-600">+12%</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-4">
                                    <div className="text-center">
                                        <div className="flex items-center justify-center space-x-2 mb-2">
                                            <Target className="h-5 w-5 text-primary" />
                                            <p className="text-2xl font-bold">94.2%</p>
                                        </div>
                                        <p className="text-sm text-muted-foreground">Success Rate</p>
                                        <div className="flex items-center justify-center space-x-1 mt-1">
                                            <TrendingUp className="h-3 w-3 text-green-600" />
                                            <span className="text-xs text-green-600">+2.1%</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-4">
                                    <div className="text-center">
                                        <div className="flex items-center justify-center space-x-2 mb-2">
                                            <Zap className="h-5 w-5 text-primary" />
                                            <p className="text-2xl font-bold">1.2s</p>
                                        </div>
                                        <p className="text-sm text-muted-foreground">Avg Response Time</p>
                                        <div className="flex items-center justify-center space-x-1 mt-1">
                                            <TrendingDown className="h-3 w-3 text-green-600" />
                                            <span className="text-xs text-green-600">-0.3s</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-4">
                                    <div className="text-center">
                                        <div className="flex items-center justify-center space-x-2 mb-2">
                                            <Brain className="h-5 w-5 text-primary" />
                                            <p className="text-2xl font-bold">2,340</p>
                                        </div>
                                        <p className="text-sm text-muted-foreground">Active Users</p>
                                        <div className="flex items-center justify-center space-x-1 mt-1">
                                            <TrendingUp className="h-3 w-3 text-green-600" />
                                            <span className="text-xs text-green-600">+8%</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Analytics Charts Placeholder */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Usage Trends</CardTitle>
                                    <CardDescription>Knowledge base usage over time</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
                                        <div className="text-center">
                                            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                                            <p className="text-muted-foreground">Chart visualization would go here</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Accuracy Metrics</CardTitle>
                                    <CardDescription>Response accuracy by knowledge base</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
                                        <div className="text-center">
                                            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                                            <p className="text-muted-foreground">Chart visualization would go here</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Settings Tab */}
                    <TabsContent value="settings" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Processing Settings</CardTitle>
                                    <CardDescription>Configure how content is processed and indexed</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="auto-processing">Auto-process new content</Label>
                                        <Switch id="auto-processing" defaultChecked />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="smart-chunking">Smart content chunking</Label>
                                        <Switch id="smart-chunking" defaultChecked />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Chunk size (tokens)</Label>
                                        <Select defaultValue="1000">
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="500">500 tokens</SelectItem>
                                                <SelectItem value="1000">1000 tokens</SelectItem>
                                                <SelectItem value="2000">2000 tokens</SelectItem>
                                                <SelectItem value="4000">4000 tokens</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Access Control</CardTitle>
                                    <CardDescription>Manage permissions and sharing settings</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="public-access">Allow public access</Label>
                                        <Switch id="public-access" />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="team-collaboration">Team collaboration</Label>
                                        <Switch id="team-collaboration" defaultChecked />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Default permission level</Label>
                                        <Select defaultValue="read">
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="read">Read only</SelectItem>
                                                <SelectItem value="write">Read & Write</SelectItem>
                                                <SelectItem value="admin">Admin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Backup & Sync</CardTitle>
                                    <CardDescription>Configure backup and synchronization options</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="auto-backup">Automatic backups</Label>
                                        <Switch id="auto-backup" defaultChecked />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Backup frequency</Label>
                                        <Select defaultValue="daily">
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="hourly">Hourly</SelectItem>
                                                <SelectItem value="daily">Daily</SelectItem>
                                                <SelectItem value="weekly">Weekly</SelectItem>
                                                <SelectItem value="monthly">Monthly</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button variant="outline" className="w-full">
                                        <Download className="h-4 w-4 mr-2" />
                                        Export All Data
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>AI Enhancement</CardTitle>
                                    <CardDescription>AI-powered features and optimizations</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="ai-suggestions">AI content suggestions</Label>
                                        <Switch id="ai-suggestions" defaultChecked />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="auto-tagging">Automatic tagging</Label>
                                        <Switch id="auto-tagging" defaultChecked />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="quality-scoring">Quality scoring</Label>
                                        <Switch id="quality-scoring" defaultChecked />
                                    </div>
                                    <Button variant="outline" className="w-full">
                                        <Sparkles className="h-4 w-4 mr-2" />
                                        Optimize All Knowledge Bases
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
};

export default KnowledgePage;
