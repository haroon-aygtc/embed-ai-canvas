import React, { useState, useCallback } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import {
    Database, CheckCircle, Plus, ExternalLink, Info,
    FileText, Globe, MessageSquare, Settings, Check
} from 'lucide-react';
import { WidgetConfig } from './WidgetConfiguration';

interface KnowledgeBaseConfigProps {
    config: WidgetConfig;
    onConfigChange: (updates: Partial<WidgetConfig>) => void;
}

interface KnowledgeBase {
    id: string;
    name: string;
    description: string;
    type: 'document' | 'website' | 'faq' | 'mixed';
    sources: number;
    lastUpdated: string;
    status: 'ready' | 'training' | 'error';
}

export const KnowledgeBaseConfig = ({ config, onConfigChange }: KnowledgeBaseConfigProps) => {
    const [activeTab, setActiveTab] = useState('select');

    // Available knowledge bases (would come from API in real app)
    const availableKnowledgeBases: KnowledgeBase[] = [
        {
            id: 'kb-1',
            name: 'Product Documentation',
            description: 'Complete product guides, tutorials, and technical documentation',
            type: 'document',
            sources: 12,
            lastUpdated: '2 hours ago',
            status: 'ready'
        },
        {
            id: 'kb-2',
            name: 'Customer Support FAQ',
            description: 'Frequently asked questions and common support issues',
            type: 'faq',
            sources: 45,
            lastUpdated: '1 day ago',
            status: 'ready'
        },
        {
            id: 'kb-3',
            name: 'Company Website',
            description: 'Public website content including pages, blogs, and announcements',
            type: 'website',
            sources: 78,
            lastUpdated: '3 hours ago',
            status: 'ready'
        },
        {
            id: 'kb-4',
            name: 'API Documentation',
            description: 'Developer guides and API reference materials',
            type: 'document',
            sources: 23,
            lastUpdated: '1 hour ago',
            status: 'training'
        },
        {
            id: 'kb-5',
            name: 'Sales Materials',
            description: 'Product brochures, pricing guides, and sales resources',
            type: 'mixed',
            sources: 34,
            lastUpdated: '5 days ago',
            status: 'ready'
        },
        {
            id: 'kb-6',
            name: 'Legal Documents',
            description: 'Terms of service, privacy policy, and legal documentation',
            type: 'document',
            sources: 8,
            lastUpdated: '1 week ago',
            status: 'ready'
        }
    ];

    // Get current selected knowledge bases from config
    const selectedKnowledgeBases = config.knowledgeBase?.selectedKnowledgeBases || [];

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'document': return FileText;
            case 'website': return Globe;
            case 'faq': return MessageSquare;
            case 'mixed': return Database;
            default: return Database;
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'document': return 'Documents';
            case 'website': return 'Website';
            case 'faq': return 'FAQ';
            case 'mixed': return 'Mixed Content';
            default: return 'Unknown';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ready': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'training': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'ready': return 'Ready';
            case 'training': return 'Training';
            case 'error': return 'Error';
            default: return 'Unknown';
        }
    };

    // Update selected knowledge bases in config
    const updateSelectedKnowledgeBases = useCallback((newSelectedIds: string[]) => {
        onConfigChange({
            knowledgeBase: {
                ...config.knowledgeBase,
                selectedKnowledgeBases: newSelectedIds
            }
        });
    }, [config.knowledgeBase, onConfigChange]);

    // Toggle knowledge base selection
    const toggleKnowledgeBase = useCallback((kbId: string) => {
        const currentSelected = selectedKnowledgeBases;
        const isSelected = currentSelected.includes(kbId);

        // Only allow selection of ready knowledge bases
        const kb = availableKnowledgeBases.find(kb => kb.id === kbId);
        if (!isSelected && kb?.status !== 'ready') {
            return;
        }

        const newSelected = isSelected
            ? currentSelected.filter(id => id !== kbId)
            : [...currentSelected, kbId];

        updateSelectedKnowledgeBases(newSelected);
    }, [selectedKnowledgeBases, availableKnowledgeBases, updateSelectedKnowledgeBases]);

    // Select all ready knowledge bases
    const selectAll = useCallback(() => {
        const readyKbIds = availableKnowledgeBases
            .filter(kb => kb.status === 'ready')
            .map(kb => kb.id);
        updateSelectedKnowledgeBases(readyKbIds);
    }, [availableKnowledgeBases, updateSelectedKnowledgeBases]);

    // Deselect all knowledge bases
    const deselectAll = useCallback(() => {
        updateSelectedKnowledgeBases([]);
    }, [updateSelectedKnowledgeBases]);

    // Update knowledge base settings
    const updateKnowledgeBaseSettings = useCallback((updates: any) => {
        onConfigChange({
            knowledgeBase: {
                ...config.knowledgeBase,
                settings: {
                    ...config.knowledgeBase?.settings,
                    ...updates
                }
            }
        });
    }, [config.knowledgeBase, onConfigChange]);

    // Calculate stats
    const selectedCount = selectedKnowledgeBases.length;
    const readyKnowledgeBases = availableKnowledgeBases.filter(kb => kb.status === 'ready');
    const totalSources = availableKnowledgeBases
        .filter(kb => selectedKnowledgeBases.includes(kb.id))
        .reduce((sum, kb) => sum + kb.sources, 0);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h3 className="text-lg font-semibold mb-2">Knowledge Base Configuration</h3>
                <p className="text-sm text-muted-foreground">
                    Configure which knowledge bases your widget can access and how it responds to visitor questions.
                </p>
            </div>

            {/* Sub-tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="select" className="flex items-center space-x-2">
                        <Database className="h-4 w-4" />
                        <span>Select Knowledge Base</span>
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="flex items-center space-x-2">
                        <Settings className="h-4 w-4" />
                        <span>Response Settings</span>
                    </TabsTrigger>
                </TabsList>

                {/* Select Knowledge Base Tab */}
                <TabsContent value="select" className="space-y-6 mt-6">
                    {/* Action Buttons - Moved to top for immediate visibility */}
                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                        <div>
                            <h4 className="text-base font-medium">Available Knowledge Bases</h4>
                            <p className="text-sm text-muted-foreground">
                                Select which knowledge bases your widget can use to answer questions
                            </p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" onClick={selectAll}>
                                Select All
                            </Button>
                            <Button variant="outline" size="sm" onClick={deselectAll}>
                                Clear All
                            </Button>

                            <Button variant="default" size="sm">
                                <Settings className="h-4 w-4 mr-2" />
                                Manage Knowledge Bases
                            </Button>

                            <Button variant="outline" size="sm">
                                <Plus className="h-4 w-4 mr-2" />
                                Create New
                            </Button>
                        </div>
                    </div>

                    {/* Knowledge Base Placeholder Notice */}
                    <div className="p-6 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
                        <div className="flex items-start space-x-3">
                            <Database className="h-6 w-6 text-amber-600 mt-0.5" />
                            <div>
                                <h4 className="text-base font-medium text-amber-900 dark:text-amber-100 mb-2">
                                    Knowledge Base Integration Coming Soon
                                </h4>
                                <p className="text-sm text-amber-800 dark:text-amber-200 mb-4">
                                    The knowledge base feature is currently under development. Once available, you'll be able to:
                                </p>
                                <ul className="text-sm text-amber-800 dark:text-amber-200 space-y-1 mb-4">
                                    <li>• Upload documents and create knowledge bases</li>
                                    <li>• Connect your website content and FAQs</li>
                                    <li>• Train your AI on custom data sources</li>
                                    <li>• Configure intelligent response settings</li>
                                </ul>
                                <div className="flex items-center space-x-2">
                                    <Button variant="outline" size="sm" disabled>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Create Knowledge Base
                                    </Button>
                                    <Button variant="outline" size="sm" disabled>
                                        <ExternalLink className="h-4 w-4 mr-2" />
                                        Learn More
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>



                    {/* Help Section */}
                    <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <div className="flex items-start space-x-2">
                            <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                    Knowledge Base Selection
                                </p>
                                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                                    Select multiple knowledge bases to give your widget access to more comprehensive information.
                                    Only knowledge bases with "Ready" status can be selected. Training knowledge bases will be available once processing is complete.
                                </p>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* Response Settings Tab */}
                <TabsContent value="settings" className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* Left Column - Response Behavior */}
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-base font-medium mb-4 text-muted-foreground uppercase tracking-wide text-xs">Response Behavior</h4>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Configure how your widget uses knowledge bases to respond to visitor questions
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                                    <div className="space-y-1">
                                        <Label className="text-base font-medium">Smart Responses</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Use AI to provide intelligent answers from selected knowledge bases
                                        </p>
                                    </div>
                                    <Switch
                                        checked={config.knowledgeBase?.settings?.contextAwareness ?? true}
                                        onCheckedChange={(checked) => updateKnowledgeBaseSettings({ contextAwareness: checked })}
                                    />
                                </div>

                                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                                    <div className="space-y-1">
                                        <Label className="text-base font-medium">Fallback to Human</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Offer human support when AI can't find relevant information
                                        </p>
                                    </div>
                                    <Switch
                                        checked={config.knowledgeBase?.settings?.realTimeUpdates ?? false}
                                        onCheckedChange={(checked) => updateKnowledgeBaseSettings({ realTimeUpdates: checked })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Quality Settings */}
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-base font-medium mb-4 text-muted-foreground uppercase tracking-wide text-xs">Quality Settings</h4>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Fine-tune response quality and accuracy
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                                    <div className="space-y-1">
                                        <Label className="text-base font-medium">Show Sources</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Display source references with AI responses for transparency
                                        </p>
                                    </div>
                                    <Switch
                                        checked={config.knowledgeBase?.settings?.autoLearning ?? true}
                                        onCheckedChange={(checked) => updateKnowledgeBaseSettings({ autoLearning: checked })}
                                    />
                                </div>

                                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                                    <div className="space-y-1">
                                        <Label className="text-base font-medium">Confidence Threshold</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Only show answers when the AI is confident about the response
                                        </p>
                                    </div>
                                    <Switch
                                        checked={config.knowledgeBase?.settings?.confidenceThreshold ?? true}
                                        onCheckedChange={(checked) => updateKnowledgeBaseSettings({ confidenceThreshold: checked })}
                                    />
                                </div>
                            </div>

                            {/* Help Section for Settings */}
                            <div className="p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
                                <div className="flex items-start space-x-2">
                                    <Info className="h-4 w-4 text-amber-600 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                                            Response Quality
                                        </p>
                                        <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                                            These settings help ensure your widget provides accurate and helpful responses.
                                            Enable fallback options to maintain good user experience when the AI can't find relevant information.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}; 