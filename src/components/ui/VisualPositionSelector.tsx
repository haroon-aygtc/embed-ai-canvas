import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Monitor, Smartphone, Tablet } from 'lucide-react';

interface VisualPositionSelectorProps {
    value: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    onChange: (position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left') => void;
    className?: string;
}

export const VisualPositionSelector = ({ value, onChange, className }: VisualPositionSelectorProps) => {
    const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

    const positions = [
        { id: 'top-left', label: 'Top Left', x: '10%', y: '10%' },
        { id: 'top-right', label: 'Top Right', x: '85%', y: '10%' },
        { id: 'bottom-left', label: 'Bottom Left', x: '10%', y: '80%' },
        { id: 'bottom-right', label: 'Bottom Right', x: '85%', y: '80%' }
    ] as const;

    const deviceSizes = {
        desktop: { width: '100%', height: '300px', icon: Monitor },
        tablet: { width: '80%', height: '280px', icon: Tablet },
        mobile: { width: '60%', height: '260px', icon: Smartphone }
    };

    const currentDevice = deviceSizes[previewDevice];

    return (
        <Card className={className}>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg">Widget Position</CardTitle>
                        <CardDescription>Click where you want your chat widget to appear</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                        {Object.entries(deviceSizes).map(([device, config]) => {
                            const Icon = config.icon;
                            return (
                                <Button
                                    key={device}
                                    variant={previewDevice === device ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setPreviewDevice(device as any)}
                                    className="p-2"
                                >
                                    <Icon className="h-4 w-4" />
                                </Button>
                            );
                        })}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {/* Visual Preview */}
                    <div className="flex justify-center">
                        <div
                            className="relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 transition-all duration-300"
                            style={{
                                width: currentDevice.width,
                                height: currentDevice.height,
                                maxWidth: '500px'
                            }}
                        >
                            {/* Mock Website Content */}
                            <div className="absolute inset-4 bg-white dark:bg-gray-800 rounded shadow-sm">
                                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-t"></div>
                                <div className="p-4 space-y-2">
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                                </div>
                            </div>

                            {/* Position Indicators */}
                            {positions.map((position) => {
                                const isSelected = value === position.id;
                                return (
                                    <button
                                        key={position.id}
                                        className={`absolute w-12 h-12 rounded-full border-2 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-0 ${isSelected
                                                ? 'bg-blue-500 border-blue-600 shadow-lg scale-110'
                                                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-blue-400 shadow-md'
                                            }`}
                                        style={{
                                            left: position.x,
                                            top: position.y,
                                            transform: 'translate(-50%, -50%)'
                                        }}
                                        onClick={() => onChange(position.id)}
                                        title={position.label}
                                    >
                                        {isSelected && (
                                            <div className="w-6 h-6 bg-white rounded-full mx-auto flex items-center justify-center">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                            </div>
                                        )}
                                    </button>
                                );
                            })}

                            {/* Widget Preview */}
                            <div
                                className="absolute w-16 h-16 bg-blue-500 rounded-full shadow-lg flex items-center justify-center transition-all duration-300"
                                style={{
                                    left: positions.find(p => p.id === value)?.x,
                                    top: positions.find(p => p.id === value)?.y,
                                    transform: 'translate(-50%, -50%)'
                                }}
                            >
                                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Position Options */}
                    <div className="grid grid-cols-2 gap-3">
                        {positions.map((position) => {
                            const isSelected = value === position.id;
                            return (
                                <Button
                                    key={position.id}
                                    variant={isSelected ? 'default' : 'outline'}
                                    className={`h-auto p-4 flex flex-col items-center space-y-2 ${isSelected ? 'ring-2 ring-blue-500' : ''
                                        }`}
                                    onClick={() => onChange(position.id)}
                                >
                                    <div className={`w-8 h-8 rounded border-2 relative ${isSelected ? 'border-white' : 'border-current'
                                        }`}>
                                        <div
                                            className={`absolute w-2 h-2 rounded-full ${isSelected ? 'bg-white' : 'bg-current'
                                                }`}
                                            style={{
                                                left: position.id.includes('right') ? '75%' : '25%',
                                                top: position.id.includes('bottom') ? '75%' : '25%',
                                                transform: 'translate(-50%, -50%)'
                                            }}
                                        ></div>
                                    </div>
                                    <span className="text-sm font-medium">{position.label}</span>
                                </Button>
                            );
                        })}
                    </div>

                    {/* Current Selection Info */}
                    <div className="flex items-center justify-center space-x-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                        <Badge variant="secondary">Selected</Badge>
                        <span className="text-sm font-medium">
                            {positions.find(p => p.id === value)?.label}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}; 