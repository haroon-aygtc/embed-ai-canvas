import React, { useState, useEffect } from 'react';
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
    AlertCircle, Info, Sparkles, RefreshCw, SortAsc, SortDesc,
    Calendar, Activity
} from 'lucide-react';
import { useSetupWizard } from '@/hooks/useSetupWizard';
import { SetupWizard } from '@/components/onboarding/SetupWizard';
import { useKnowledgeBases, KnowledgeBase } from '@/hooks/useKnowledgeBases';

const KnowledgePage = () => {
    const { showWizard, handleWizardComplete, handleWizardSkip, handleStartWizard } = useSetupWizard();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');

    const {
        knowledgeBases,
        isLoading,
        error,
        loadKnowledgeBases,
        createKnowledgeBase,
        clearError
    } = useKnowledgeBases();

    // Load knowledge bases on mount
    useEffect(() => {
        loadKnowledgeBases();
    }, [loadKnowledgeBases]);

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
            <Button size="sm" onClick={() => {
                // TODO: Open create knowledge base modal
                console.log('Create knowledge base');
            }}>
                <Plus className="h-4 w-4 mr-2" />
                New Knowledge Base
            </Button>
        </div>
    );

    // Filter and search functionality
    const filteredKnowledgeBases = knowledgeBases.filter(kb => {
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

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="space-y-6">
                    <PageHeader
                        title="Knowledge Base Management"
                        description="Create, manage, and optimize your AI knowledge sources for enhanced chat responses"
                        onSetupWizard={handleStartWizard}
                        actions={headerActions}
                    />
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                            <p className="text-muted-foreground">Loading knowledge bases...</p>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <div className="space-y-6">
                    <PageHeader
                        title="Knowledge Base Management"
                        description="Create, manage, and optimize your AI knowledge sources for enhanced chat responses"
                        onSetupWizard={handleStartWizard}
                        actions={headerActions}
                    />
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
                            <p className="text-destructive">{error}</p>
                            <Button
                                variant="outline"
                                className="mt-4"
                                onClick={() => {
                                    clearError();
                                    loadKnowledgeBases();
                                }}
                            >
                                Try Again
                            </Button>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

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
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                                    <Database className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total Knowledge Bases</p>
                                    <p className="text-2xl font-bold">{knowledgeBases.length}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Active</p>
                                    <p className="text-2xl font-bold">{knowledgeBases.filter(kb => kb.status === 'active').length}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                                    <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total Sources</p>
                                    <p className="text-2xl font-bold">{knowledgeBases.reduce((sum, kb) => sum + kb.sources, 0)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                                    <Layers className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total Documents</p>
                                    <p className="text-2xl font-bold">{knowledgeBases.reduce((sum, kb) => sum + kb.documents, 0)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Knowledge Bases Grid */}
                {knowledgeBases.length === 0 ? (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <Database className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No Knowledge Bases Found</h3>
                            <p className="text-muted-foreground mb-6">
                                Get started by creating your first knowledge base to enhance your AI chat responses.
                            </p>
                            <Button onClick={() => {
                                // TODO: Open create knowledge base modal
                                console.log('Create knowledge base');
                            }}>
                                <Plus className="h-4 w-4 mr-2" />
                                Create Knowledge Base
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredKnowledgeBases.map((kb) => {
                            const TypeIcon = getTypeIcon(kb.type);
                            return (
                                <Card key={kb.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                                    <TypeIcon className="h-5 w-5 text-primary" />
                                                </div>
                                                <div className="flex-1">
                                                    <CardTitle className="text-lg">{kb.name}</CardTitle>
                                                    <div className="flex items-center space-x-2 mt-1">
                                                        <Badge className={getStatusColor(kb.status)}>
                                                            {kb.status}
                                                        </Badge>
                                                        <span className="text-xs text-muted-foreground">{kb.version}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                {kb.isStarred && (
                                                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                                )}
                                                <Button variant="ghost" size="sm">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-4">
                                        <CardDescription className="text-sm">
                                            {kb.description}
                                        </CardDescription>

                                        {kb.status === 'processing' && kb.processingProgress && (
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span>Processing...</span>
                                                    <span>{kb.processingProgress}%</span>
                                                </div>
                                                <Progress value={kb.processingProgress} className="h-2" />
                                            </div>
                                        )}

                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div className="flex items-center space-x-2">
                                                <FileText className="h-4 w-4 text-muted-foreground" />
                                                <span>{kb.documents} docs</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                                <span>{kb.accuracy}% accuracy</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Activity className="h-4 w-4 text-muted-foreground" />
                                                <span>{kb.usage} queries</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Users className="h-4 w-4 text-muted-foreground" />
                                                <span>{kb.collaborators} users</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-1">
                                            {kb.tags.slice(0, 3).map((tag, index) => (
                                                <Badge key={index} variant="outline" className="text-xs">
                                                    {tag}
                                                </Badge>
                                            ))}
                                            {kb.tags.length > 3 && (
                                                <Badge variant="outline" className="text-xs">
                                                    +{kb.tags.length - 3}
                                                </Badge>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                                            <div className="flex items-center space-x-1">
                                                <Calendar className="h-3 w-3" />
                                                <span>Updated {kb.lastUpdated.toLocaleDateString()}</span>
                                            </div>
                                            <span>{kb.size}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default KnowledgePage; 