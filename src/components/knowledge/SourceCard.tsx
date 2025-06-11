
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    Eye, Edit, RefreshCw, MoreHorizontal, Clock, Zap, Info, Settings,
    FileText, Globe, Code, Database, Layers, AlertCircle
} from 'lucide-react';

interface SourceCardProps {
    source: {
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
    };
    onView: (sourceId: string) => void;
    onEdit: (sourceId: string) => void;
    onSync: (sourceId: string) => void;
    onSettings: (sourceId: string) => void;
    onMoreActions: (sourceId: string) => void;
}

export const SourceCard = ({ source, onView, onEdit, onSync, onSettings, onMoreActions }: SourceCardProps) => {
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

    const TypeIcon = getTypeIcon(source.type);
    const isError = source.status === 'error';

    return (
        <Card className={`hover:shadow-md transition-all duration-200 group ${
            isError ? 'border-red-200 dark:border-red-800' : ''
        }`}>
            <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4 flex-1">
                        <div className={`p-2 rounded-lg ${
                            isError ? 'bg-red-100 dark:bg-red-900' : 'bg-primary/10'
                        }`}>
                            {isError ? (
                                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                            ) : (
                                <TypeIcon className="h-5 w-5 text-primary" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                                <h4 className="font-medium line-clamp-1">{source.name}</h4>
                                <Badge className={getStatusColor(source.status)}>
                                    {source.status}
                                </Badge>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                                <span>{source.knowledgeBaseName}</span>
                                <span>•</span>
                                <span>{source.size}</span>
                                <span>•</span>
                                <span>{source.itemCount} {source.type === 'website' ? 'pages' : 'items'}</span>
                                <span>•</span>
                                <span>
                                    {source.status === 'processing' 
                                        ? `Processing: ${source.processingProgress}%`
                                        : `Last sync: ${source.lastSync}`
                                    }
                                </span>
                            </div>
                            {source.status === 'processing' && source.processingProgress && (
                                <Progress value={source.processingProgress} className="h-1 mt-2" />
                            )}
                            {isError && source.errorMessage && (
                                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                                    {source.errorMessage}
                                </p>
                            )}
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-medium">
                                {isError ? 'Error' : `${source.accuracy}% accuracy`}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                {isError ? `Last sync: ${source.lastSync}` : `${source.queries} queries`}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        title="View Details"
                        onClick={() => onView(source.id)}
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        title="Edit"
                        onClick={() => onEdit(source.id)}
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        title={source.status === 'processing' ? 'Pause Processing' : isError ? 'Retry Sync' : 'Sync Now'}
                        onClick={() => onSync(source.id)}
                    >
                        {source.status === 'processing' ? (
                            <Clock className="h-4 w-4" />
                        ) : isError ? (
                            <RefreshCw className="h-4 w-4" />
                        ) : source.status === 'inactive' ? (
                            <Zap className="h-4 w-4" />
                        ) : (
                            <RefreshCw className="h-4 w-4" />
                        )}
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        title={isError ? 'View Error Details' : 'Settings'}
                        onClick={() => isError ? onMoreActions(source.id) : onSettings(source.id)}
                    >
                        {isError ? <Info className="h-4 w-4" /> : <Settings className="h-4 w-4" />}
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        title="More Options"
                        onClick={() => onMoreActions(source.id)}
                    >
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
