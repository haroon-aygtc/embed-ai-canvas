import { useState, useEffect } from 'react';

export const useSetupWizard = () => {
    const [showWizard, setShowWizard] = useState(false);
    const [hasCompletedSetup, setHasCompletedSetup] = useState(false);

    useEffect(() => {
        // Check if user has completed setup before
        const setupCompleted = localStorage.getItem('widget-setup-completed');
        setHasCompletedSetup(!!setupCompleted);
    }, []);

    const handleWizardComplete = (config: any) => {
        localStorage.setItem('widget-setup-completed', 'true');
        setHasCompletedSetup(true);
        setShowWizard(false);
        // You could also save the config to a global state or API here
    };

    const handleWizardSkip = () => {
        setShowWizard(false);
    };

    const handleStartWizard = () => {
        setShowWizard(true);
    };

    return {
        showWizard,
        hasCompletedSetup,
        handleWizardComplete,
        handleWizardSkip,
        handleStartWizard
    };
}; 