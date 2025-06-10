import React, { createContext, useContext, useState, useEffect } from 'react';

interface AccessibilitySettings {
    highContrast: boolean;
    fontSize: number;
    reducedMotion: boolean;
    screenReader: boolean;
    keyboardNavigation: boolean;
    focusIndicators: boolean;
    soundEnabled: boolean;
    colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
}

interface AccessibilityContextType {
    settings: AccessibilitySettings;
    updateSettings: (updates: Partial<AccessibilitySettings>) => void;
    announceToScreenReader: (message: string) => void;
}

const defaultSettings: AccessibilitySettings = {
    highContrast: false,
    fontSize: 16,
    reducedMotion: false,
    screenReader: false,
    keyboardNavigation: true,
    focusIndicators: true,
    soundEnabled: false,
    colorBlindMode: 'none'
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const useAccessibility = () => {
    const context = useContext(AccessibilityContext);
    if (!context) {
        throw new Error('useAccessibility must be used within an AccessibilityProvider');
    }
    return context;
};

interface AccessibilityProviderProps {
    children: React.ReactNode;
}

export const AccessibilityProvider = ({ children }: AccessibilityProviderProps) => {
    const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);

    useEffect(() => {
        const saved = localStorage.getItem('accessibility-settings');
        if (saved) {
            try {
                setSettings({ ...defaultSettings, ...JSON.parse(saved) });
            } catch (error) {
                console.error('Failed to load accessibility settings:', error);
            }
        }

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setSettings(prev => ({ ...prev, reducedMotion: true }));
        }

        if (window.matchMedia('(prefers-contrast: high)').matches) {
            setSettings(prev => ({ ...prev, highContrast: true }));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('accessibility-settings', JSON.stringify(settings));
        applyAccessibilitySettings(settings);
    }, [settings]);

    const updateSettings = (updates: Partial<AccessibilitySettings>) => {
        setSettings(prev => ({ ...prev, ...updates }));
    };

    const announceToScreenReader = (message: string) => {
        if (!settings.screenReader) return;

        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;

        document.body.appendChild(announcement);

        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    };

    return (
        <AccessibilityContext.Provider value={{ settings, updateSettings, announceToScreenReader }}>
            {children}
        </AccessibilityContext.Provider>
    );
};

const applyAccessibilitySettings = (settings: AccessibilitySettings) => {
    const root = document.documentElement;

    if (settings.highContrast) {
        root.classList.add('high-contrast');
    } else {
        root.classList.remove('high-contrast');
    }

    root.style.fontSize = `${settings.fontSize}px`;

    if (settings.reducedMotion) {
        root.classList.add('reduce-motion');
    } else {
        root.classList.remove('reduce-motion');
    }

    if (settings.focusIndicators) {
        root.classList.add('enhanced-focus');
    } else {
        root.classList.remove('enhanced-focus');
    }

    if (settings.keyboardNavigation) {
        root.classList.add('keyboard-navigation');
    } else {
        root.classList.remove('keyboard-navigation');
    }

    root.setAttribute('data-colorblind-mode', settings.colorBlindMode);
}; 