
import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ScraperDashboard } from '@/components/scraper/ScraperDashboard';

export const ScraperPage = () => {
  return (
    <DashboardLayout>
      <ScraperDashboard />
    </DashboardLayout>
  );
};
