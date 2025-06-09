
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { WidgetConfiguration } from '@/components/widget/WidgetConfiguration';

const WidgetPage = () => {
  return (
    <DashboardLayout>
      <WidgetConfiguration />
    </DashboardLayout>
  );
};

export default WidgetPage;
