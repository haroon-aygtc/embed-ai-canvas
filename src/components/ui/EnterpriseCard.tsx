import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface EnterpriseCardProps {
    title: string;
    description?: string;
    icon?: LucideIcon;
    iconColor?: string;
    status?: 'active' | 'inactive' | 'warning' | 'error';
    actions?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'elevated' | 'outlined' | 'minimal';
    size?: 'sm' | 'md' | 'lg';
}

const statusColors = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
};

const variants = {
    default: 'border-0 shadow-none',
    elevated: 'border shadow-lg hover:shadow-xl transition-shadow duration-300',
    outlined: 'border-0 shadow-none',
    minimal: 'border-0 shadow-none bg-transparent'
};

const sizes = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
};

export const EnterpriseCard = ({
    title,
    description,
    icon: Icon,
    iconColor = 'text-primary',
    status,
    actions,
    children,
    className,
    variant = 'default',
    size = 'md'
}: EnterpriseCardProps) => {
    return (
        <Card className={cn(variants[variant], className)}>
            <CardHeader className={cn(sizes[size], 'pb-4')}>
                <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                        {Icon && (
                            <div className={cn(
                                'w-10 h-10 rounded-lg flex items-center justify-center',
                                'bg-primary/10 dark:bg-primary/20'
                            )}>
                                <Icon className={cn('h-5 w-5', iconColor)} />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                                <CardTitle className="text-lg font-semibold">{title}</CardTitle>
                                {status && (
                                    <Badge variant="outline" className={cn('text-xs', statusColors[status])}>
                                        {status}
                                    </Badge>
                                )}
                            </div>
                            {description && (
                                <CardDescription className="mt-1 text-sm">
                                    {description}
                                </CardDescription>
                            )}
                        </div>
                    </div>
                    {actions && (
                        <div className="flex items-center space-x-2">
                            {actions}
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className={cn(sizes[size], 'pt-0')}>
                {children}
            </CardContent>
        </Card>
    );
};

// Specialized card variants for common use cases
export const MetricCard = ({
    title,
    value,
    change,
    icon: Icon,
    trend = 'neutral',
    className
}: {
    title: string;
    value: string | number;
    change?: string;
    icon?: LucideIcon;
    trend?: 'up' | 'down' | 'neutral';
    className?: string;
}) => {
    const trendColors = {
        up: 'text-green-600 dark:text-green-400',
        down: 'text-red-600 dark:text-red-400',
        neutral: 'text-gray-600 dark:text-gray-400'
    };

    return (
        <Card className={cn('border shadow-sm hover:shadow-md transition-shadow', className)}>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <p className="text-2xl font-bold">{value}</p>
                        {change && (
                            <p className={cn('text-xs', trendColors[trend])}>
                                {change}
                            </p>
                        )}
                    </div>
                    {Icon && (
                        <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                            <Icon className="h-6 w-6 text-primary" />
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export const FeatureCard = ({
    title,
    description,
    icon: Icon,
    enabled = false,
    onToggle,
    className
}: {
    title: string;
    description: string;
    icon?: LucideIcon;
    enabled?: boolean;
    onToggle?: (enabled: boolean) => void;
    className?: string;
}) => {
    return (
        <Card className={cn(
            'border transition-all duration-200 cursor-pointer hover:shadow-md',
            enabled ? 'border-primary bg-primary/5' : 'border-border',
            className
        )}>
            <CardContent className="p-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                        {Icon && (
                            <div className={cn(
                                'w-8 h-8 rounded-lg flex items-center justify-center',
                                enabled ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                            )}>
                                <Icon className="h-4 w-4" />
                            </div>
                        )}
                        <div>
                            <h4 className="font-medium">{title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{description}</p>
                        </div>
                    </div>
                    {onToggle && (
                        <Button
                            variant={enabled ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => onToggle(!enabled)}
                        >
                            {enabled ? 'Enabled' : 'Enable'}
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}; 