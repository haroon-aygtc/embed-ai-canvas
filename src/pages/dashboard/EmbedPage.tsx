import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { EnhancedEmbedCodeGenerator } from '@/components/embed/EnhancedEmbedCodeGenerator';
import { WidgetConfig } from '@/components/widget/WidgetConfiguration';
import { useSetupWizard } from '@/hooks/useSetupWizard';
import { SetupWizard } from '@/components/onboarding/SetupWizard';

const EmbedPage = () => {
  const { showWizard, handleWizardComplete, handleWizardSkip, handleStartWizard } = useSetupWizard();

  const [config] = useState<WidgetConfig>({
    theme: 'light',
    primaryColor: '#3b82f6',
    position: 'bottom-right',
    size: 'medium',
    welcomeMessage: 'Hello! How can I help you today?',
    placeholder: 'Type your message...',
    title: 'AI Assistant',
    subtitle: 'Powered by ChatWidget Pro',
    enabled: true,
    showBranding: true,
  });

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
          title="Embed Code & Integration"
          description="Generate, test, and deploy your widget with enterprise-grade tools"
          onSetupWizard={handleStartWizard}
        />

        <EnhancedEmbedCodeGenerator config={config} />
      </div>
    </DashboardLayout>
  );
};

export default EmbedPage;
