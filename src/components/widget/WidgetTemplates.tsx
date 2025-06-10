
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { WidgetConfig } from './WidgetConfiguration';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  preview: string;
  config: WidgetConfig;
  popular?: boolean;
}

interface WidgetTemplatesProps {
  onSelectTemplate: (config: WidgetConfig) => void;
  currentConfig: WidgetConfig;
}

const templates: Template[] = [
  {
    id: 'modern-support',
    name: 'Modern Support',
    description: 'Clean, minimalist design perfect for SaaS platforms',
    category: 'Support',
    preview: 'modern',
    popular: true,
    config: {
      theme: 'light',
      primaryColor: '#3b82f6',
      position: 'bottom-right',
      size: 'medium',
      welcomeMessage: 'Hi! How can we help you today?',
      placeholder: 'Type your question...',
      title: 'Support Assistant',
      subtitle: 'We\'re here to help',
      enabled: true,
      showBranding: false,
    }
  },
  {
    id: 'sales-assistant',
    name: 'Sales Assistant',
    description: 'Engaging design to capture leads and drive conversions',
    category: 'Sales',
    preview: 'sales',
    config: {
      theme: 'light',
      primaryColor: '#10b981',
      position: 'bottom-right',
      size: 'large',
      welcomeMessage: 'Ready to see how we can help your business grow?',
      placeholder: 'Tell us about your needs...',
      title: 'Sales Assistant',
      subtitle: 'Let\'s discuss your requirements',
      enabled: true,
      showBranding: false,
    }
  },
  {
    id: 'dark-tech',
    name: 'Dark Tech',
    description: 'Sleek dark theme ideal for developer tools and tech products',
    category: 'Developer',
    preview: 'dark',
    popular: true,
    config: {
      theme: 'dark',
      primaryColor: '#8b5cf6',
      position: 'bottom-left',
      size: 'medium',
      welcomeMessage: 'Need help with integration or have technical questions?',
      placeholder: 'Describe your issue...',
      title: 'Developer Support',
      subtitle: 'Technical assistance available 24/7',
      enabled: true,
      showBranding: false,
    }
  },
  {
    id: 'friendly-ecommerce',
    name: 'Friendly E-commerce',
    description: 'Warm, approachable design for online stores',
    category: 'E-commerce',
    preview: 'ecommerce',
    config: {
      theme: 'light',
      primaryColor: '#f59e0b',
      position: 'bottom-right',
      size: 'medium',
      welcomeMessage: 'Looking for something specific? I\'m here to help!',
      placeholder: 'What are you looking for?',
      title: 'Shopping Assistant',
      subtitle: 'Find what you need faster',
      enabled: true,
      showBranding: false,
    }
  }
];

export const WidgetTemplates = ({ onSelectTemplate, currentConfig }: WidgetTemplatesProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Quick Start Templates</h3>
        <p className="text-muted-foreground text-sm">
          Choose from pre-designed templates or start with a blank configuration
        </p>
      </div>

      {/* Grid Layout for All Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {templates.map(template => (
          <Card
            key={template.id}
            className="relative cursor-pointer hover:shadow-md transition-all hover:scale-105 group"
            onClick={() => onSelectTemplate(template.config)}
          >
            <CardContent className="p-4">
              {/* Template Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h5 className="font-semibold text-sm">{template.name}</h5>
                  {template.popular && (
                    <Badge variant="secondary" className="text-xs">Popular</Badge>
                  )}
                </div>
                <div
                  className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                  style={{ borderColor: template.config.primaryColor }}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: template.config.primaryColor }}
                  />
                </div>
              </div>

              {/* Category Badge */}
              <div className="mb-3">
                <Badge variant="outline" className="text-xs">
                  {template.category}
                </Badge>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3 min-h-[3rem]">
                {template.description}
              </p>

              {/* Template Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Theme:</span>
                  <span className="font-medium">{template.config.theme === 'dark' ? 'Dark' : 'Light'}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Size:</span>
                  <span className="font-medium capitalize">{template.config.size}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Position:</span>
                  <span className="font-medium">{template.config.position.replace('-', ' ')}</span>
                </div>
              </div>

              {/* Apply Button */}
              <Button
                size="sm"
                className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                variant="outline"
              >
                <Check className="h-3 w-3 mr-1" />
                Apply Template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium mb-1">Need something custom?</h4>
            <p className="text-sm text-muted-foreground">Start with a blank template and customize everything</p>
          </div>
          <Button
            variant="outline"
            onClick={() => onSelectTemplate({
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
            })}
          >
            Start Blank
          </Button>
        </div>
      </div>
    </div>
  );
};
