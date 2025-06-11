
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SourcesList } from '@/components/knowledge/SourcesList';
import { Brain, Database, Plus, TrendingUp, Users, Globe, FileText } from 'lucide-react';

const KnowledgePage = () => {
  const [activeTab, setActiveTab] = useState('sources');

  // Mock knowledge base statistics
  const stats = {
    totalSources: 18,
    activeSources: 14,
    totalQueries: 2547,
    accuracy: 94
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Knowledge Base</h1>
            <p className="text-muted-foreground">
              Manage your AI's knowledge sources and content databases
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>AI Ready</span>
            </div>
          </div>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Database className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Sources</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-2xl font-bold">{stats.totalSources}</p>
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <Globe className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Sources</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-2xl font-bold">{stats.activeSources}</p>
                    <Badge variant="outline" className="text-xs">+2</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Queries</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-2xl font-bold">{stats.totalQueries}</p>
                    <Badge variant="outline" className="text-xs">+247</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Brain className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Accuracy</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-2xl font-bold">{stats.accuracy}%</p>
                    <Badge variant="outline" className="text-xs text-green-600">+2%</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="sources" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Sources Management
            </TabsTrigger>
            <TabsTrigger value="knowledge-bases" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Knowledge Bases
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sources" className="space-y-6">
            <SourcesList />
          </TabsContent>

          <TabsContent value="knowledge-bases" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Knowledge Bases</CardTitle>
                <CardDescription>
                  Organize your sources into logical knowledge bases
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Knowledge Base Management</h3>
                  <p className="text-muted-foreground mb-4">
                    This feature allows you to group related sources into knowledge bases
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Knowledge Base
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Knowledge Analytics</CardTitle>
                <CardDescription>
                  Track performance and usage of your knowledge sources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Analytics Dashboard</h3>
                  <p className="text-muted-foreground mb-4">
                    View detailed analytics about your knowledge base performance
                  </p>
                  <Button>
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default KnowledgePage;
