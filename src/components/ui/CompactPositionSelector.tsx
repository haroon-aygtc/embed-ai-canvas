import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Monitor, Smartphone, Tablet } from 'lucide-react';

interface CompactPositionSelectorProps {
    value: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    onChange: (position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left') => void;
    className?: string;
}

export const CompactPositionSelector = ({ value, onChange, className }: CompactPositionSelectorProps) => {
    const positions = [
        { id: 'top-left', label: 'Top Left', icon: '↖️' },
        { id: 'top-right', label: 'Top Right', icon: '↗️' },
        { id: 'bottom-left', label: 'Bottom Left', icon: '↙️' },
        { id: 'bottom-right', label: 'Bottom Right', icon: '↘️' }
    ] as const;

    return (
        <div className={`space-y-3 ${className}`}>
            <Label className="text-sm font-medium">Widget Position</Label>

            {/* Compact Grid Selector */}
            <div className="relative">
                <div className="w-32 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 relative">
                    {/* Corner Position Buttons */}
                    {positions.map((position) => {
                        const isSelected = value === position.id;
                        const isTop = position.id.includes('top');
                        const isRight = position.id.includes('right');

                        return (
                            <button
                                key={position.id}
                                className={`absolute w-6 h-6 rounded-full border-2 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isSelected
                                        ? 'bg-blue-500 border-blue-600 shadow-lg scale-110'
                                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-blue-400 shadow-sm'
                                    }`}
                                style={{
                                    [isTop ? 'top' : 'bottom']: '4px',
                                    [isRight ? 'right' : 'left']: '4px',
                                    transform: 'translate(0, 0)'
                                }}
                                onClick={() => onChange(position.id)}
                                title={position.label}
                            >
                                {isSelected && (
                                    <div className="w-3 h-3 bg-white rounded-full mx-auto mt-1.5 flex items-center justify-center">
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                    </div>
                                )}
                            </button>
                        );
                    })}

                    {/* Center Label */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Website</span>
                    </div>
                </div>

                {/* Selected Position Info */}
                <div className="mt-2 flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                        {positions.find(p => p.id === value)?.label}
                    </Badge>
                    <div className="flex items-center space-x-1">
                        <Monitor className="h-3 w-3 text-gray-400" />
                        <Tablet className="h-3 w-3 text-gray-400" />
                        <Smartphone className="h-3 w-3 text-gray-400" />
                    </div>
                </div>
            </div>

            {/* Quick Position Buttons */}
            <div className="grid grid-cols-2 gap-2">
                {positions.map((position) => {
                    const isSelected = value === position.id;
                    return (
                        <Button
                            key={position.id}
                            variant={isSelected ? 'default' : 'outline'}
                            size="sm"
                            className="h-8 text-xs"
                            onClick={() => onChange(position.id)}
                        >
                            <span className="mr-1">{position.icon}</span>
                            {position.label}
                        </Button>
                    );
                })}
            </div>
        </div>
    );
}; 