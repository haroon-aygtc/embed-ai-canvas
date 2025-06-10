import React from 'react';
import { cn } from '@/lib/utils';

interface Icon3DProps {
    children: React.ReactNode;
    size?: number;
    className?: string;
    gradientId: string;
    gradientColors: {
        start: string;
        middle?: string;
        end: string;
    };
    shadowColor?: string;
    glowEffect?: boolean;
}

export const Icon3D: React.FC<Icon3DProps> = ({
    children,
    size = 24,
    className,
    gradientId,
    gradientColors,
    shadowColor = 'rgba(0,0,0,0.3)',
    glowEffect = false
}) => {
    return (
        <svg
            className={cn('transition-all duration-200', className)}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={gradientColors.start} />
                    {gradientColors.middle && (
                        <stop offset="50%" stopColor={gradientColors.middle} />
                    )}
                    <stop offset="100%" stopColor={gradientColors.end} />
                </linearGradient>

                <filter id={`shadow-${gradientId}`}>
                    <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor={shadowColor} />
                </filter>

                {glowEffect && (
                    <filter id={`glow-${gradientId}`}>
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                )}
            </defs>

            <g
                fill={`url(#${gradientId})`}
                filter={`url(#shadow-${gradientId}) ${glowEffect ? `url(#glow-${gradientId})` : ''}`}
            >
                {children}
            </g>
        </svg>
    );
};

// Pre-built 3D Icons
export const Settings3DIcon = ({ size = 24, className }: { size?: number; className?: string }) => (
    <Icon3D
        size={size}
        className={className}
        gradientId="settings3d"
        gradientColors={{
            start: "#6366f1",
            middle: "#8b5cf6",
            end: "#a855f7"
        }}
        glowEffect
    >
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1m10-3a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
    </Icon3D>
);

export const Database3DIcon = ({ size = 24, className }: { size?: number; className?: string }) => (
    <Icon3D
        size={size}
        className={className}
        gradientId="database3d"
        gradientColors={{
            start: "#10b981",
            middle: "#059669",
            end: "#047857"
        }}
        glowEffect
    >
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
        <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
    </Icon3D>
);

export const Code3DIcon = ({ size = 24, className }: { size?: number; className?: string }) => (
    <Icon3D
        size={size}
        className={className}
        gradientId="code3d"
        gradientColors={{
            start: "#f59e0b",
            middle: "#d97706",
            end: "#b45309"
        }}
        glowEffect
    >
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
        <path d="m6 9 2 2-2 2m4-4h4" />
    </Icon3D>
);

export const Analytics3DIcon = ({ size = 24, className }: { size?: number; className?: string }) => (
    <Icon3D
        size={size}
        className={className}
        gradientId="analytics3d"
        gradientColors={{
            start: "#ef4444",
            middle: "#dc2626",
            end: "#b91c1c"
        }}
        glowEffect
    >
        <rect x="3" y="11" width="4" height="10" />
        <rect x="10" y="7" width="4" height="14" />
        <rect x="17" y="3" width="4" height="18" />
        <path d="m4 20 7-7 3 3 6-6" />
    </Icon3D>
);

export const Bot3DIcon = ({ size = 24, className }: { size?: number; className?: string }) => (
    <Icon3D
        size={size}
        className={className}
        gradientId="bot3d"
        gradientColors={{
            start: "#06b6d4",
            middle: "#0891b2",
            end: "#0e7490"
        }}
        glowEffect
    >
        <rect x="3" y="8" width="18" height="12" rx="2" />
        <path d="M7 16h.01M17 16h.01" />
        <path d="M12 6V4a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2" />
        <circle cx="9" cy="12" r="1" />
        <circle cx="15" cy="12" r="1" />
    </Icon3D>
);

export const Image3DIcon = ({ size = 24, className }: { size?: number; className?: string }) => (
    <Icon3D
        size={size}
        className={className}
        gradientId="image3d"
        gradientColors={{
            start: "#8b5cf6",
            middle: "#7c3aed",
            end: "#6d28d9"
        }}
        glowEffect
    >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
        <path d="M21 21H3" strokeLinecap="round" />
    </Icon3D>
);

export const Knowledge3DIcon = ({ size = 24, className }: { size?: number; className?: string }) => (
    <Icon3D
        size={size}
        className={className}
        gradientId="knowledge3d"
        gradientColors={{
            start: "#f97316",
            middle: "#ea580c",
            end: "#c2410c"
        }}
        glowEffect
    >
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <path d="M8 7h8M8 11h6M8 15h4" />
        <circle cx="12" cy="12" r="2" opacity="0.3" />
    </Icon3D>
); 