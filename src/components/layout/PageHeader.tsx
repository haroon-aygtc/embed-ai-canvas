import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Sparkles, Eye, Contrast, Volume2, Keyboard, Settings } from 'lucide-react';
import { useAccessibility } from '@/components/accessibility/AccessibilityProvider';

interface PageHeaderProps {
    title: string;
    description?: string;
    onSetupWizard?: () => void;
    actions?: React.ReactNode;
    showSetupWizard?: boolean;
}

const AccessibilityControls = () => {
    const { settings, updateSettings } = useAccessibility();
    const [isOpen, setIsOpen] = useState(false);

    const colorBlindOptions = [
        { value: 'none', label: 'None' },
        { value: 'protanopia', label: 'Protanopia (Red-blind)' },
        { value: 'deuteranopia', label: 'Deuteranopia (Green-blind)' },
        { value: 'tritanopia', label: 'Tritanopia (Blue-blind)' }
    ];

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    aria-label="Open accessibility settings"
                >
                    <Eye className="h-4 w-4" />
                    <span className="hidden sm:inline">Accessibility</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 max-h-[80vh] overflow-y-auto" align="end">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Eye className="h-5 w-5" />
                            <h4 className="font-semibold">Accessibility Settings</h4>
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Customize the interface to meet your accessibility needs
                    </p>

                    <div className="space-y-4">
                        <div className="space-y-3">
                            <h5 className="font-medium flex items-center space-x-2">
                                <Contrast className="h-4 w-4" />
                                <span>Visual</span>
                            </h5>

                            <div className="flex items-center justify-between">
                                <Label htmlFor="high-contrast" className="flex items-center space-x-2 text-sm">
                                    <span>High Contrast</span>
                                    {settings.highContrast && (
                                        <Badge variant="secondary" className="text-xs">Active</Badge>
                                    )}
                                </Label>
                                <Switch
                                    id="high-contrast"
                                    checked={settings.highContrast}
                                    onCheckedChange={(checked) => updateSettings({ highContrast: checked })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="font-size" className="text-sm">
                                    Font Size: {settings.fontSize}px
                                </Label>
                                <Slider
                                    id="font-size"
                                    min={12}
                                    max={24}
                                    step={1}
                                    value={[settings.fontSize]}
                                    onValueChange={(value) => updateSettings({ fontSize: value[0] })}
                                    className="w-full"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <Label htmlFor="reduced-motion" className="text-sm">Reduce Motion</Label>
                                <Switch
                                    id="reduced-motion"
                                    checked={settings.reducedMotion}
                                    onCheckedChange={(checked) => updateSettings({ reducedMotion: checked })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="colorblind-mode" className="text-sm">Color Blind Support</Label>
                                <Select
                                    value={settings.colorBlindMode}
                                    onValueChange={(value: any) => updateSettings({ colorBlindMode: value })}
                                >
                                    <SelectTrigger className="h-8">
                                        <SelectValue placeholder="Select mode" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {colorBlindOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h5 className="font-medium flex items-center space-x-2">
                                <Keyboard className="h-4 w-4" />
                                <span>Navigation</span>
                            </h5>

                            <div className="flex items-center justify-between">
                                <Label htmlFor="keyboard-nav" className="text-sm">Enhanced Keyboard Navigation</Label>
                                <Switch
                                    id="keyboard-nav"
                                    checked={settings.keyboardNavigation}
                                    onCheckedChange={(checked) => updateSettings({ keyboardNavigation: checked })}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <Label htmlFor="focus-indicators" className="text-sm">Enhanced Focus Indicators</Label>
                                <Switch
                                    id="focus-indicators"
                                    checked={settings.focusIndicators}
                                    onCheckedChange={(checked) => updateSettings({ focusIndicators: checked })}
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h5 className="font-medium flex items-center space-x-2">
                                <Volume2 className="h-4 w-4" />
                                <span>Audio</span>
                            </h5>

                            <div className="flex items-center justify-between">
                                <Label htmlFor="screen-reader" className="text-sm">Screen Reader Support</Label>
                                <Switch
                                    id="screen-reader"
                                    checked={settings.screenReader}
                                    onCheckedChange={(checked) => updateSettings({ screenReader: checked })}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <Label htmlFor="sound-enabled" className="text-sm">Sound Feedback</Label>
                                <Switch
                                    id="sound-enabled"
                                    checked={settings.soundEnabled}
                                    onCheckedChange={(checked) => updateSettings({ soundEnabled: checked })}
                                />
                            </div>
                        </div>

                        <div className="pt-3 border-t">
                            <Button
                                variant="outline"
                                onClick={() => updateSettings({
                                    highContrast: false,
                                    fontSize: 16,
                                    reducedMotion: false,
                                    screenReader: false,
                                    keyboardNavigation: true,
                                    focusIndicators: true,
                                    soundEnabled: false,
                                    colorBlindMode: 'none'
                                })}
                                className="w-full h-8 text-sm"
                            >
                                Reset to Defaults
                            </Button>
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export const PageHeader = ({
    title,
    description,
    onSetupWizard,
    actions,
    showSetupWizard = true
}: PageHeaderProps) => {
    return (
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-border">
            <div>
                <h1 className="text-3xl font-bold">{title}</h1>
                {description && (
                    <p className="text-muted-foreground mt-1">
                        {description}
                    </p>
                )}
            </div>
            <div className="flex items-center gap-2">
                <AccessibilityControls />
                {showSetupWizard && onSetupWizard && (
                    <Button
                        variant="outline"
                        onClick={onSetupWizard}
                        className="flex items-center gap-2"
                    >
                        <Sparkles className="h-4 w-4" />
                        <span className="hidden sm:inline">Setup Wizard</span>
                    </Button>
                )}
                {actions}
            </div>
        </div>
    );
}; 