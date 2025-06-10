import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { EnhancedTestingSuite } from '@/components/testing/EnhancedTestingSuite';
import { useSetupWizard } from '@/hooks/useSetupWizard';
import { SetupWizard } from '@/components/onboarding/SetupWizard';

const TestingPage = () => {
    const { showWizard, handleWizardComplete, handleWizardSkip, handleStartWizard } = useSetupWizard();

    if (showWizard) {
        return (
            <SetupWizard
                onComplete={handleWizardComplete}
                onSkip={handleWizardSkip}
            />
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <PageHeader
                    title="Widget Testing Suite"
                    description="Comprehensive testing tools for performance, compatibility, and functionality validation"
                    onSetupWizard={handleStartWizard}
                />

                <EnhancedTestingSuite />
            </div>
        </DashboardLayout>
    );
};

export default TestingPage; 