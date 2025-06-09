
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { EmbedCodeGenerator } from '@/components/embed/EmbedCodeGenerator';
import { WidgetConfig } from '@/components/widget/WidgetConfiguration';

const defaultConfig: WidgetConfig = {
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
};

const EmbedPage = () => {
  const [config] = useState<WidgetConfig>(defaultConfig);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Embed Code</h1>
          <p className="text-muted-foreground">Generate and test your widget embed code</p>
        </div>

        <EmbedCodeGenerator config={config} />
      </div>
    </DashboardLayout>
  );
};

export default EmbedPage;
