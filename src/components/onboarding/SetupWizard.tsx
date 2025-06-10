import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, ArrowRight, ArrowLeft, Sparkles, Palette, MessageSquare, Code, Rocket } from 'lucide-react';
import { WidgetConfig } from '@/components/widget/WidgetConfiguration';

interface SetupWizardProps {
    onComplete: (config: WidgetConfig) => void;
    onSkip: () => void;
}

interface WizardStep {
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType<any>;
    component: React.ComponentType<any>;
}

const steps: WizardStep[] = [
    {
        id: 'welcome',
        title: 'Welcome to ChatWidget Pro',
        description: 'Let\'s set up your AI chat widget in just a few simple steps',
        icon: Sparkles,
        component: WelcomeStep
    },
    {
        id: 'purpose',
        title: 'What\'s your goal?',
        description: 'Tell us how you plan to use your chat widget',
        icon: MessageSquare,
        component: PurposeStep
    },
    {
        id: 'appearance',
        title: 'Choose your style',
        description: 'Pick colors and design that match your brand',
        icon: Palette,
        component: AppearanceStep
    },
    {
        id: 'preview',
        title: 'Preview & customize',
        description: 'See how your widget looks and make final adjustments',
        icon: Code,
        component: PreviewStep
    },
    {
        id: 'complete',
        title: 'You\'re all set!',
        description: 'Your widget is ready to go live',
        icon: Rocket,
        component: CompleteStep
    }
];

export const SetupWizard = ({ onComplete, onSkip }: SetupWizardProps) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [config, setConfig] = useState<Partial<WidgetConfig>>({});
    const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

    const progress = ((currentStep + 1) / steps.length) * 100;

    const handleNext = () => {
        setCompletedSteps(prev => new Set([...prev, currentStep]));
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleStepClick = (stepIndex: number) => {
        if (stepIndex <= currentStep || completedSteps.has(stepIndex)) {
            setCurrentStep(stepIndex);
        }
    };

    const updateConfig = (updates: Partial<WidgetConfig>) => {
        setConfig(prev => ({ ...prev, ...updates }));
    };

    const CurrentStepComponent = steps[currentStep].component;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="container mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                            <Sparkles className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Setup Wizard</h1>
                            <p className="text-muted-foreground">Get your chat widget ready in minutes</p>
                        </div>
                    </div>
                    <Button variant="ghost" onClick={onSkip}>
                        Skip Setup
                    </Button>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium">Step {currentStep + 1} of {steps.length}</span>
                        <span className="text-sm text-muted-foreground">{Math.round(progress)}% complete</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>

                {/* Step Navigation */}
                <div className="flex items-center justify-center mb-8 overflow-x-auto">
                    <div className="flex items-center space-x-4">
                        {steps.map((step, index) => {
                            const isActive = index === currentStep;
                            const isCompleted = completedSteps.has(index);
                            const isAccessible = index <= currentStep || completedSteps.has(index);

                            return (
                                <div key={step.id} className="flex items-center">
                                    <button
                                        onClick={() => handleStepClick(index)}
                                        disabled={!isAccessible}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${isActive
                                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-2 border-blue-300'
                                            : isCompleted
                                                ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800'
                                                : isAccessible
                                                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                                    : 'bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                            }`}
                                    >
                                        {isCompleted ? (
                                            <CheckCircle className="h-5 w-5" />
                                        ) : (
                                            <step.icon className="h-5 w-5" />
                                        )}
                                        <span className="hidden sm:inline font-medium">{step.title}</span>
                                    </button>
                                    {index < steps.length - 1 && (
                                        <ArrowRight className="h-4 w-4 text-gray-400 mx-2" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Step Content */}
                <div className="max-w-4xl mx-auto">
                    <Card className="shadow-lg">
                        <CardHeader className="text-center">
                            <div className="flex justify-center mb-4">
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${currentStep === steps.length - 1
                                    ? 'bg-green-100 dark:bg-green-900'
                                    : 'bg-blue-100 dark:bg-blue-900'
                                    }`}>
                                    {React.createElement(steps[currentStep].icon, {
                                        className: `h-8 w-8 ${currentStep === steps.length - 1
                                            ? 'text-green-600 dark:text-green-400'
                                            : 'text-blue-600 dark:text-blue-400'
                                            }`
                                    })}
                                </div>
                            </div>
                            <CardTitle className="text-2xl">{steps[currentStep].title}</CardTitle>
                            <CardDescription className="text-lg">{steps[currentStep].description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <CurrentStepComponent
                                config={config}
                                onConfigChange={updateConfig}
                                onNext={handleNext}
                                onComplete={() => onComplete(config as WidgetConfig)}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Navigation Buttons */}
                {currentStep < steps.length - 1 && (
                    <div className="flex justify-between mt-8 max-w-4xl mx-auto">
                        <Button
                            variant="outline"
                            onClick={handlePrevious}
                            disabled={currentStep === 0}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Previous
                        </Button>
                        <Button onClick={handleNext}>
                            Next Step
                            <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

// Step Components
function WelcomeStep({ onNext }: { onNext: () => void }) {
    return (
        <div className="text-center space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <MessageSquare className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Easy Setup</h3>
                    <p className="text-sm text-muted-foreground">No technical knowledge required</p>
                </div>
                <div className="p-6 bg-green-50 dark:bg-green-950 rounded-lg">
                    <Palette className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Custom Design</h3>
                    <p className="text-sm text-muted-foreground">Match your brand perfectly</p>
                </div>
                <div className="p-6 bg-purple-50 dark:bg-purple-950 rounded-lg">
                    <Rocket className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Go Live Fast</h3>
                    <p className="text-sm text-muted-foreground">Deploy in just one click</p>
                </div>
            </div>
            <Button onClick={onNext} size="lg" className="mt-8">
                Let's Get Started
                <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
        </div>
    );
}

function PurposeStep({ config, onConfigChange, onNext }: any) {
    const purposes = [
        {
            id: 'support',
            title: 'Customer Support',
            description: 'Help customers with questions and issues',
            icon: '🎧',
            template: {
                welcomeMessage: 'Hi! How can we help you today?',
                title: 'Support Assistant',
                primaryColor: '#3b82f6'
            }
        },
        {
            id: 'sales',
            title: 'Sales & Lead Generation',
            description: 'Capture leads and drive conversions',
            icon: '💼',
            template: {
                welcomeMessage: 'Ready to see how we can help your business grow?',
                title: 'Sales Assistant',
                primaryColor: '#10b981'
            }
        },
        {
            id: 'general',
            title: 'General Information',
            description: 'Provide information about your business',
            icon: '💬',
            template: {
                welcomeMessage: 'Hello! What would you like to know?',
                title: 'AI Assistant',
                primaryColor: '#8b5cf6'
            }
        }
    ];

    const handlePurposeSelect = (purpose: any) => {
        onConfigChange(purpose.template);
        setTimeout(onNext, 500);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {purposes.map((purpose) => (
                    <Card
                        key={purpose.id}
                        className="cursor-pointer hover:shadow-md transition-all hover:scale-105 focus:outline-none"
                        onClick={() => handlePurposeSelect(purpose)}
                        tabIndex={-1}
                        role="button"
                        aria-label={`Select ${purpose.title} purpose`}
                    >
                        <CardContent className="p-6 text-center">
                            <div className="text-4xl mb-4">{purpose.icon}</div>
                            <h3 className="font-semibold mb-2">{purpose.title}</h3>
                            <p className="text-sm text-muted-foreground">{purpose.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

function AppearanceStep({ config, onConfigChange, onNext }: any) {
    const colorOptions = [
        { name: 'Professional Blue', value: '#3b82f6', bg: 'bg-blue-500' },
        { name: 'Success Green', value: '#10b981', bg: 'bg-green-500' },
        { name: 'Creative Purple', value: '#8b5cf6', bg: 'bg-purple-500' },
        { name: 'Energetic Orange', value: '#f59e0b', bg: 'bg-orange-500' },
        { name: 'Bold Red', value: '#ef4444', bg: 'bg-red-500' },
        { name: 'Elegant Pink', value: '#ec4899', bg: 'bg-pink-500' }
    ];

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-lg font-semibold mb-4">Choose your brand color</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {colorOptions.map((color) => (
                        <Card
                            key={color.value}
                            className={`cursor-pointer transition-all hover:scale-105 focus:outline-none ${config.primaryColor === color.value ? 'ring-0 ring-blue-0' : ''
                                }`}
                            onClick={() => onConfigChange({ primaryColor: color.value })}
                            tabIndex={-1}
                            role="button"
                            aria-label={`Select ${color.name} color`}
                        >
                            <CardContent className="p-4 text-center">
                                <div className={`w-12 h-12 ${color.bg} rounded-full mx-auto mb-3`}></div>
                                <p className="font-medium">{color.name}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <div className="flex justify-center">
                <Button onClick={onNext} size="lg">
                    Continue to Preview
                    <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
            </div>
        </div>
    );
}

function PreviewStep({ config, onNext }: any) {
    return (
        <div className="space-y-6">
            {/* Website Mockup with Widget */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border">
                <div className="text-center mb-4">
                    <h3 className="font-semibold text-lg mb-2">Preview on Your Website</h3>
                    <p className="text-sm text-muted-foreground">This is how your widget will appear to visitors</p>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Website Mockup */}
                    <div className="bg-white dark:bg-gray-950 rounded-lg shadow-lg border">
                        {/* Fake Browser Header */}
                        <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b flex items-center space-x-2">
                            <div className="flex space-x-1">
                                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                            </div>
                            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded px-3 py-1 text-xs text-gray-600 dark:text-gray-400">
                                https://yourwebsite.com
                            </div>
                        </div>

                        {/* Website Content */}
                        <div className="p-6 min-h-[300px] relative">
                            <div className="space-y-4">
                                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/5"></div>
                                </div>
                                <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                                </div>
                            </div>

                            {/* Widget Button */}
                            <div className="absolute bottom-4 right-4">
                                <div
                                    className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center cursor-pointer"
                                    style={{ backgroundColor: config.primaryColor || '#3b82f6' }}
                                >
                                    <MessageSquare className="h-5 w-5 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chat Widget Preview */}
                    <div className="flex flex-col">
                        <h4 className="font-semibold mb-3 text-center">Chat Widget</h4>
                        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl border overflow-hidden flex-1">
                            {/* Chat Header */}
                            <div
                                className="px-4 py-3 text-white flex items-center justify-between"
                                style={{ backgroundColor: config.primaryColor || '#3b82f6' }}
                            >
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                        <MessageSquare className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-sm">{config.title || 'AI Assistant'}</h4>
                                        <p className="text-xs opacity-90">Online now</p>
                                    </div>
                                </div>
                                <button className="text-white/80 hover:text-white">
                                    <span className="text-lg">×</span>
                                </button>
                            </div>

                            {/* Chat Messages */}
                            <div className="p-4 space-y-3 h-64 overflow-y-auto">
                                {/* Bot Message */}
                                <div className="flex items-start space-x-2">
                                    <div
                                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                                        style={{ backgroundColor: config.primaryColor || '#3b82f6' }}
                                    >
                                        <MessageSquare className="h-3 w-3 text-white" />
                                    </div>
                                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 max-w-xs">
                                        <p className="text-sm">{config.welcomeMessage || 'Hello! How can I help you today?'}</p>
                                    </div>
                                </div>

                                {/* User Message */}
                                <div className="flex justify-end">
                                    <div
                                        className="rounded-lg px-3 py-2 max-w-xs text-white"
                                        style={{ backgroundColor: config.primaryColor || '#3b82f6' }}
                                    >
                                        <p className="text-sm">I need help with my order</p>
                                    </div>
                                </div>

                                {/* Bot Response */}
                                <div className="flex items-start space-x-2">
                                    <div
                                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                                        style={{ backgroundColor: config.primaryColor || '#3b82f6' }}
                                    >
                                        <MessageSquare className="h-3 w-3 text-white" />
                                    </div>
                                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 max-w-xs">
                                        <p className="text-sm">I'd be happy to help you with your order! Could you please provide your order number?</p>
                                    </div>
                                </div>
                            </div>

                            {/* Chat Input */}
                            <div className="border-t p-3">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        placeholder="Type your message..."
                                        className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-00 focus:ring-blue-0"
                                        disabled
                                    />
                                    <button
                                        className="p-2 rounded-lg text-white"
                                        style={{ backgroundColor: config.primaryColor || '#3b82f6' }}
                                        disabled
                                    >
                                        <ArrowRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Configuration Summary */}
            <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4">
                <h4 className="font-semibold mb-3 flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    <span>Configuration Summary</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Widget Title:</span>
                        <span className="font-medium">{config.title || 'AI Assistant'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Primary Color:</span>
                        <div className="flex items-center space-x-2">
                            <div
                                className="w-4 h-4 rounded border"
                                style={{ backgroundColor: config.primaryColor || '#3b82f6' }}
                            ></div>
                            <span className="font-medium">{config.primaryColor || '#3b82f6'}</span>
                        </div>
                    </div>
                    <div className="flex justify-between md:col-span-2">
                        <span className="text-muted-foreground">Welcome Message:</span>
                        <span className="font-medium text-right max-w-xs">{config.welcomeMessage || 'Hello! How can I help you today?'}</span>
                    </div>
                </div>
            </div>

            <div className="flex justify-center">
                <Button onClick={onNext} size="lg">
                    Perfect! Let's Go Live
                    <Rocket className="h-4 w-4 ml-2" />
                </Button>
            </div>
        </div>
    );
}

function CompleteStep({ onComplete }: any) {
    return (
        <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>

            <div>
                <h3 className="text-xl font-semibold mb-2">Congratulations!</h3>
                <p className="text-muted-foreground">
                    Your chat widget is ready to go. You can always customize it further later.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={onComplete} size="lg">
                    <Rocket className="h-4 w-4 mr-2" />
                    Go to Dashboard
                </Button>
                <Button variant="outline" size="lg">
                    <Code className="h-4 w-4 mr-2" />
                    Get Embed Code
                </Button>
            </div>
        </div>
    );
} 