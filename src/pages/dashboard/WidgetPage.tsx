import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { WidgetConfiguration } from '@/components/widget/WidgetConfiguration';
import { SetupWizard } from '@/components/onboarding/SetupWizard';
import { useSetupWizard } from '@/hooks/useSetupWizard';

const WidgetPage = () => {
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
      <WidgetConfiguration onSetupWizard={handleStartWizard} />
    </DashboardLayout>
  );
};

export default WidgetPage;
