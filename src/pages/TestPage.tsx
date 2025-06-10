import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpTooltip, HelpCenter, SmartSuggestions } from '@/components/ui/HelpSystem';
import { VisualPositionSelector } from '@/components/ui/VisualPositionSelector';
import { useAccessibility } from '@/components/accessibility/AccessibilityProvider';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Eye, TestTube } from 'lucide-react';

const TestPage = () => {
    const { settings, announceToScreenReader } = useAccessibility();
    const [position, setPosition] = React.useState<'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'>('bottom-right');

    const testSuggestions = [
        "Try using a blue color scheme for better trust",
        "Position the widget in the bottom-right for better visibility",
        "Add a welcome message to engage users"
    ];

    const handleSuggestionApply = (suggestion: string) => {
        announceToScreenReader(`Applied suggestion: ${suggestion}`);
        console.log('Applied suggestion:', suggestion);
    };

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="flex items-center justify-center space-x-2">
                        <TestTube className="h-8 w-8 text-blue-600" />
                        <h1 className="text-4xl font-bold">Component Test Page</h1>
                    </div>
                    <p className="text-muted-foreground text-lg">
                        Testing all the new accessibility and UX components
                    </p>
                    <Badge variant="secondary" className="text-sm">
                        Accessibility Settings: {settings.highContrast ? 'High Contrast' : 'Normal'} |
                        Font Size: {settings.fontSize}px |
                        Motion: {settings.reducedMotion ? 'Reduced' : 'Normal'}
                    </Badge>
                </div>

                {/* Component Tests */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Help System Test */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Sparkles className="h-5 w-5" />
                                <span>Help System Components</span>
                            </CardTitle>
                            <CardDescription>Testing contextual help and tooltips</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <HelpTooltip
                                    content="This is a helpful tooltip that provides contextual information to users."
                                    title="Example Tooltip"
                                >
                                    <Button variant="outline">Hover for Help Tooltip</Button>
                                </HelpTooltip>
                            </div>

                            <div>
                                <HelpCenter />
                            </div>

                            <div>
                                <SmartSuggestions
                                    suggestions={testSuggestions}
                                    onApply={handleSuggestionApply}
                                    title="AI Suggestions"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Visual Position Selector Test */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Eye className="h-5 w-5" />
                                <span>Visual Position Selector</span>
                            </CardTitle>
                            <CardDescription>Interactive widget positioning</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <VisualPositionSelector
                                value={position}
                                onChange={setPosition}
                            />
                            <div className="mt-4 p-3 bg-muted rounded-lg">
                                <p className="text-sm">
                                    <strong>Selected Position:</strong> {position}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Accessibility Features Test */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Accessibility Features Status</CardTitle>
                            <CardDescription>Current accessibility settings and features</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="p-3 bg-muted rounded-lg text-center">
                                    <div className="font-semibold">High Contrast</div>
                                    <div className={`text-sm ${settings.highContrast ? 'text-green-600' : 'text-gray-500'}`}>
                                        {settings.highContrast ? 'Enabled' : 'Disabled'}
                                    </div>
                                </div>

                                <div className="p-3 bg-muted rounded-lg text-center">
                                    <div className="font-semibold">Font Size</div>
                                    <div className="text-sm text-blue-600">
                                        {settings.fontSize}px
                                    </div>
                                </div>

                                <div className="p-3 bg-muted rounded-lg text-center">
                                    <div className="font-semibold">Reduced Motion</div>
                                    <div className={`text-sm ${settings.reducedMotion ? 'text-green-600' : 'text-gray-500'}`}>
                                        {settings.reducedMotion ? 'Enabled' : 'Disabled'}
                                    </div>
                                </div>

                                <div className="p-3 bg-muted rounded-lg text-center">
                                    <div className="font-semibold">Screen Reader</div>
                                    <div className={`text-sm ${settings.screenReader ? 'text-green-600' : 'text-gray-500'}`}>
                                        {settings.screenReader ? 'Enabled' : 'Disabled'}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 flex gap-2">
                                <Button
                                    onClick={() => announceToScreenReader('This is a test announcement for screen readers')}
                                    variant="outline"
                                    size="sm"
                                >
                                    Test Screen Reader Announcement
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Navigation Links */}
                <div className="text-center space-y-4">
                    <h3 className="text-xl font-semibold">Quick Navigation</h3>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button onClick={() => window.location.href = '/'}>
                            Home Page
                        </Button>
                        <Button onClick={() => window.location.href = '/setup'}>
                            Setup Wizard
                        </Button>
                        <Button onClick={() => window.location.href = '/dashboard/widget'}>
                            Widget Configuration
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestPage; 