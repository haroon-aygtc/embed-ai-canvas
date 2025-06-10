import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { HelpCircle, Lightbulb, BookOpen, Video, ArrowRight, X, CheckCircle } from 'lucide-react';

interface HelpTooltipProps {
    content: string;
    title?: string;
    children: React.ReactNode;
    side?: 'top' | 'right' | 'bottom' | 'left';
}

export const HelpTooltip = ({ content, title, children, side = 'top' }: HelpTooltipProps) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="inline-flex items-center gap-2">
                        {children}
                        <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help" />
                    </div>
                </TooltipTrigger>
                <TooltipContent side={side} className="max-w-xs">
                    {title && <div className="font-semibold mb-1">{title}</div>}
                    <p className="text-sm">{content}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

interface GuidedTourStep {
    id: string;
    title: string;
    content: string;
    target?: string;
    action?: string;
}

interface GuidedTourProps {
    steps: GuidedTourStep[];
    onComplete: () => void;
    onSkip: () => void;
}

export const GuidedTour = ({ steps, onComplete, onSkip }: GuidedTourProps) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isOpen, setIsOpen] = useState(true);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            setIsOpen(false);
            onComplete();
        }
    };

    const handleSkip = () => {
        setIsOpen(false);
        onSkip();
    };

    if (!isOpen) return null;

    const step = steps[currentStep];

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <Card className="max-w-md w-full shadow-2xl">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                <Lightbulb className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <Badge variant="secondary">
                                Step {currentStep + 1} of {steps.length}
                            </Badge>
                        </div>
                        <Button variant="ghost" size="sm" onClick={handleSkip}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-6">{step.content}</p>

                    <div className="flex items-center justify-between">
                        <Button variant="ghost" onClick={handleSkip}>
                            Skip Tour
                        </Button>
                        <Button onClick={handleNext}>
                            {currentStep < steps.length - 1 ? 'Next' : 'Finish'}
                            <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

interface HelpResource {
    id: string;
    title: string;
    description: string;
    type: 'article' | 'video' | 'tutorial';
    url?: string;
    content?: string;
    duration?: string;
}

const helpResources: HelpResource[] = [
    {
        id: 'getting-started',
        title: 'Getting Started Guide',
        description: 'Learn the basics of setting up your first chat widget',
        type: 'tutorial',
        content: 'This comprehensive guide will walk you through creating your first chat widget...',
        duration: '5 min read'
    },
    {
        id: 'customization',
        title: 'Customization Options',
        description: 'Discover all the ways to customize your widget appearance',
        type: 'article',
        content: 'Your chat widget can be customized in many ways to match your brand...',
        duration: '3 min read'
    },
    {
        id: 'embedding',
        title: 'How to Embed Your Widget',
        description: 'Step-by-step instructions for adding the widget to your website',
        type: 'video',
        url: '#',
        duration: '2 min watch'
    },
    {
        id: 'troubleshooting',
        title: 'Common Issues & Solutions',
        description: 'Quick fixes for the most common problems',
        type: 'article',
        content: 'Here are solutions to the most frequently encountered issues...',
        duration: '4 min read'
    }
];

export const HelpCenter = () => {
    const [selectedResource, setSelectedResource] = useState<HelpResource | null>(null);

    const getIcon = (type: string) => {
        switch (type) {
            case 'video':
                return Video;
            case 'tutorial':
                return BookOpen;
            default:
                return HelpCircle;
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Help
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2">
                        <BookOpen className="h-5 w-5" />
                        <span>Help Center</span>
                    </DialogTitle>
                    <DialogDescription>
                        Find answers, tutorials, and guides to help you get the most out of ChatWidget Pro
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {helpResources.map((resource) => {
                        const Icon = getIcon(resource.type);
                        return (
                            <Card
                                key={resource.id}
                                className="cursor-pointer hover:shadow-md transition-shadow"
                                onClick={() => setSelectedResource(resource)}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-start space-x-3">
                                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold mb-1">{resource.title}</h3>
                                            <p className="text-sm text-muted-foreground mb-2">{resource.description}</p>
                                            <div className="flex items-center space-x-2">
                                                <Badge variant="outline" className="text-xs">
                                                    {resource.type}
                                                </Badge>
                                                {resource.duration && (
                                                    <span className="text-xs text-muted-foreground">{resource.duration}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {selectedResource && (
                    <div className="mt-6 p-4 bg-muted rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold">{selectedResource.title}</h3>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedResource(null)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        {selectedResource.content && (
                            <p className="text-sm text-muted-foreground">{selectedResource.content}</p>
                        )}
                        {selectedResource.url && (
                            <Button className="mt-3" size="sm">
                                Watch Video
                            </Button>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

interface SmartSuggestionProps {
    suggestions: string[];
    onApply: (suggestion: string) => void;
    title?: string;
}

export const SmartSuggestions = ({ suggestions, onApply, title = "Smart Suggestions" }: SmartSuggestionProps) => {
    if (suggestions.length === 0) return null;

    return (
        <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950">
            <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center space-x-2">
                    <Lightbulb className="h-4 w-4 text-blue-600" />
                    <span>{title}</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="space-y-2">
                    {suggestions.map((suggestion, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded border">
                            <span className="text-sm">{suggestion}</span>
                            <Button size="sm" variant="ghost" onClick={() => onApply(suggestion)}>
                                Apply
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

// Hook for managing guided tours
export const useGuidedTour = (tourId: string) => {
    const [hasSeenTour, setHasSeenTour] = useState(false);

    useEffect(() => {
        const seen = localStorage.getItem(`tour-${tourId}`);
        setHasSeenTour(!!seen);
    }, [tourId]);

    const markTourComplete = () => {
        localStorage.setItem(`tour-${tourId}`, 'completed');
        setHasSeenTour(true);
    };

    const resetTour = () => {
        localStorage.removeItem(`tour-${tourId}`);
        setHasSeenTour(false);
    };

    return { hasSeenTour, markTourComplete, resetTour };
}; 