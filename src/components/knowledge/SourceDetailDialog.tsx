
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
    FileText, Globe, Code, Database, Layers, AlertCircle, CheckCircle,
    Clock, Edit, RefreshCw, Settings, MoreHorizontal, Calendar, User,
    BarChart3, Activity, Zap
} from 'lucide-react';

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

interface SourceDetailDialogProps {
    source: Source | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onEdit: (sourceId: string) => void;
    onSync: (sourceId: string) => void;
    onSettings: (sourceId: string) => void;
    onMoreActions: (sourceId: string) => void;
}

export const SourceDetailDialog = ({ 
    source, 
    open, 
    onOpenChange, 
    onEdit, 
    onSync, 
    onSettings, 
    onMoreActions 
}: SourceDetailDialogProps) => {
    if (!source) return null;

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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'processing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active': return CheckCircle;
            case 'processing': return Clock;
            case 'error': return AlertCircle;
            case 'inactive': return Clock;
            default: return Clock;
        }
    };

    const TypeIcon = getTypeIcon(source.type);
    const StatusIcon = getStatusIcon(source.status);
    const isError = source.status === 'error';
    const isProcessing = source.status === 'processing';

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                            isError ? 'bg-red-100 dark:bg-red-900' : 'bg-primary/10'
                        }`}>
                            {isError ? (
                                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                            ) : (
                                <TypeIcon className="h-5 w-5 text-primary" />
                            )}
                        </div>
                        <div>
                            <div className="font-semibold">{source.name}</div>
                            <div className="text-sm text-muted-foreground font-normal">
                                {source.knowledgeBaseName}
                            </div>
                        </div>
                    </DialogTitle>
                    <DialogDescription>
                        Detailed information about this knowledge source
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Status and Type */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <StatusIcon className="h-4 w-4" />
                            <Badge className={getStatusColor(source.status)}>
                                {source.status}
                            </Badge>
                        </div>
                        <Badge variant="outline" className="capitalize">
                            {source.type}
                        </Badge>
                    </div>

                    {/* Processing Progress */}
                    {isProcessing && source.processingProgress && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Processing Progress</span>
                                <span className="font-medium">{source.processingProgress}%</span>
                            </div>
                            <Progress value={source.processingProgress} className="h-2" />
                        </div>
                    )}

                    {/* Error Message */}
                    {isError && source.errorMessage && (
                        <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                                <div>
                                    <div className="font-medium text-red-800 dark:text-red-200">Error Details</div>
                                    <div className="text-sm text-red-600 dark:text-red-400 mt-1">
                                        {source.errorMessage}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <Separator />

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">Size</div>
                            <div className="font-medium">{source.size}</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">Items</div>
                            <div className="font-medium">{source.itemCount}</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">Accuracy</div>
                            <div className="font-medium">{source.accuracy}%</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">Queries</div>
                            <div className="font-medium">{source.queries}</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">Last Sync</div>
                            <div className="font-medium">{source.lastSync}</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">Status</div>
                            <div className="font-medium capitalize">{source.status}</div>
                        </div>
                    </div>

                    <Separator />

                    {/* Recent Activity (Mock) */}
                    <div className="space-y-3">
                        <h4 className="font-medium flex items-center gap-2">
                            <Activity className="h-4 w-4" />
                            Recent Activity
                        </h4>
                        <div className="space-y-2">
                            <div className="flex items-center gap-3 text-sm">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-muted-foreground">Synced successfully</span>
                                <span className="text-xs text-muted-foreground ml-auto">{source.lastSync}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span className="text-muted-foreground">Processing completed</span>
                                <span className="text-xs text-muted-foreground ml-auto">2 hours ago</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                <span className="text-muted-foreground">Source added</span>
                                <span className="text-xs text-muted-foreground ml-auto">1 day ago</span>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" onClick={() => onEdit(source.id)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => onSync(source.id)}>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            {isProcessing ? 'Pause' : isError ? 'Retry' : 'Sync'}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => onSettings(source.id)}>
                            <Settings className="h-4 w-4 mr-2" />
                            Settings
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => onMoreActions(source.id)}>
                            <MoreHorizontal className="h-4 w-4 mr-2" />
                            More
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
