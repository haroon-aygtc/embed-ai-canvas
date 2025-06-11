
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe, Zap, Database, Settings } from 'lucide-react';
import { ScraperForm } from './ScraperForm';
import { ScraperHistory } from './ScraperHistory';
import { ScraperTemplates } from './ScraperTemplates';
import { ScraperSettings } from './ScraperSettings';

export const ScraperDashboard = () => {
  const [activeTab, setActiveTab] = useState('scraper');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Web Scraper</h1>
          <p className="text-muted-foreground">
            Extract content from websites with our intelligent scraping tools
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Service Online</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="scraper" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Scraper
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            History
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scraper" className="space-y-6">
          <ScraperForm />
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <ScraperHistory />
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <ScraperTemplates />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <ScraperSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};
