import React from 'react';
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
    TabsListMinimal,
    TabsTriggerMinimal,
    TabsListBordered,
    TabsTriggerBordered,
    TabsListPill,
    TabsTriggerPill
} from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Users, BarChart3, Shield, Database } from 'lucide-react';

/**
 * Professional Tab Styles Examples
 * 
 * This file demonstrates all available tab styles in the application.
 * Choose the style that best fits your use case:
 * 
 * 1. Default (Enhanced) - Modern gradient style with shadows
 * 2. Minimal - Clean underline style for content-heavy interfaces
 * 3. Bordered - Traditional card-like appearance
 * 4. Pill - Rounded modern style for compact interfaces
 */

export const TabsExamples = () => {
    return (
        <div className="space-y-8 p-6">
            <div>
                <h1 className="text-3xl font-bold mb-2">Professional Tab Styles</h1>
                <p className="text-muted-foreground">Choose the perfect tab style for your interface</p>
            </div>

            {/* Default Enhanced Style */}
            <Card>
                <CardHeader>
                    <CardTitle>Default Enhanced Style</CardTitle>
                    <CardDescription>
                        Modern gradient background with shadows and smooth animations. Best for main navigation and primary interfaces.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="grid w-full grid-cols-5">
                            <TabsTrigger value="overview" className="flex items-center gap-2">
                                <BarChart3 className="h-4 w-4" />
                                Overview
                            </TabsTrigger>
                            <TabsTrigger value="users" className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Users
                            </TabsTrigger>
                            <TabsTrigger value="settings" className="flex items-center gap-2">
                                <Settings className="h-4 w-4" />
                                Settings
                            </TabsTrigger>
                            <TabsTrigger value="security" className="flex items-center gap-2">
                                <Shield className="h-4 w-4" />
                                Security
                            </TabsTrigger>
                            <TabsTrigger value="database" className="flex items-center gap-2">
                                <Database className="h-4 w-4" />
                                Database
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="overview" className="mt-4">
                            <div className="p-4 bg-muted/50 rounded-lg">
                                <h3 className="font-semibold mb-2">Overview Content</h3>
                                <p className="text-sm text-muted-foreground">This is the overview tab content with enhanced styling.</p>
                            </div>
                        </TabsContent>
                        <TabsContent value="users" className="mt-4">
                            <div className="p-4 bg-muted/50 rounded-lg">
                                <h3 className="font-semibold mb-2">Users Content</h3>
                                <p className="text-sm text-muted-foreground">Manage your users and permissions here.</p>
                            </div>
                        </TabsContent>
                        {/* Add other tab contents as needed */}
                    </Tabs>
                </CardContent>
            </Card>

            {/* Minimal Style */}
            <Card>
                <CardHeader>
                    <CardTitle>Minimal Underline Style</CardTitle>
                    <CardDescription>
                        Clean underline design perfect for content-heavy interfaces and documentation.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="overview" className="w-full">
                        <TabsListMinimal className="w-full">
                            <TabsTriggerMinimal value="overview" className="flex items-center gap-2">
                                <BarChart3 className="h-4 w-4" />
                                Overview
                            </TabsTriggerMinimal>
                            <TabsTriggerMinimal value="users" className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Users
                            </TabsTriggerMinimal>
                            <TabsTriggerMinimal value="settings" className="flex items-center gap-2">
                                <Settings className="h-4 w-4" />
                                Settings
                            </TabsTriggerMinimal>
                            <TabsTriggerMinimal value="security" className="flex items-center gap-2">
                                <Shield className="h-4 w-4" />
                                Security
                            </TabsTriggerMinimal>
                        </TabsListMinimal>
                        <TabsContent value="overview" className="mt-4">
                            <div className="p-4 bg-muted/50 rounded-lg">
                                <h3 className="font-semibold mb-2">Minimal Overview</h3>
                                <p className="text-sm text-muted-foreground">Clean and minimal design for content focus.</p>
                            </div>
                        </TabsContent>
                        <TabsContent value="users" className="mt-4">
                            <div className="p-4 bg-muted/50 rounded-lg">
                                <h3 className="font-semibold mb-2">Minimal Users</h3>
                                <p className="text-sm text-muted-foreground">User management with minimal distractions.</p>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            {/* Bordered Style */}
            <Card>
                <CardHeader>
                    <CardTitle>Bordered Card Style</CardTitle>
                    <CardDescription>
                        Traditional card-like appearance with borders. Great for settings panels and configuration interfaces.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="overview" className="w-full">
                        <TabsListBordered className="grid w-full grid-cols-4">
                            <TabsTriggerBordered value="overview" className="flex items-center gap-2">
                                <BarChart3 className="h-4 w-4" />
                                Overview
                            </TabsTriggerBordered>
                            <TabsTriggerBordered value="users" className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Users
                            </TabsTriggerBordered>
                            <TabsTriggerBordered value="settings" className="flex items-center gap-2">
                                <Settings className="h-4 w-4" />
                                Settings
                            </TabsTriggerBordered>
                            <TabsTriggerBordered value="security" className="flex items-center gap-2">
                                <Shield className="h-4 w-4" />
                                Security
                            </TabsTriggerBordered>
                        </TabsListBordered>
                        <TabsContent value="overview" className="mt-4">
                            <div className="p-4 bg-muted/50 rounded-lg">
                                <h3 className="font-semibold mb-2">Bordered Overview</h3>
                                <p className="text-sm text-muted-foreground">Traditional bordered design for familiar interfaces.</p>
                            </div>
                        </TabsContent>
                        <TabsContent value="users" className="mt-4">
                            <div className="p-4 bg-muted/50 rounded-lg">
                                <h3 className="font-semibold mb-2">Bordered Users</h3>
                                <p className="text-sm text-muted-foreground">User management with clear visual boundaries.</p>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            {/* Pill Style */}
            <Card>
                <CardHeader>
                    <CardTitle>Pill Style</CardTitle>
                    <CardDescription>
                        Modern rounded design perfect for compact interfaces and mobile-friendly layouts.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="overview" className="w-full">
                        <TabsListPill className="grid w-full grid-cols-4">
                            <TabsTriggerPill value="overview" className="flex items-center gap-2">
                                <BarChart3 className="h-4 w-4" />
                                Overview
                            </TabsTriggerPill>
                            <TabsTriggerPill value="users" className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Users
                            </TabsTriggerPill>
                            <TabsTriggerPill value="settings" className="flex items-center gap-2">
                                <Settings className="h-4 w-4" />
                                Settings
                            </TabsTriggerPill>
                            <TabsTriggerPill value="security" className="flex items-center gap-2">
                                <Shield className="h-4 w-4" />
                                Security
                            </TabsTriggerPill>
                        </TabsListPill>
                        <TabsContent value="overview" className="mt-4">
                            <div className="p-4 bg-muted/50 rounded-lg">
                                <h3 className="font-semibold mb-2">Pill Overview</h3>
                                <p className="text-sm text-muted-foreground">Modern pill design for contemporary interfaces.</p>
                            </div>
                        </TabsContent>
                        <TabsContent value="users" className="mt-4">
                            <div className="p-4 bg-muted/50 rounded-lg">
                                <h3 className="font-semibold mb-2">Pill Users</h3>
                                <p className="text-sm text-muted-foreground">Rounded design that works great on all devices.</p>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            {/* Usage Guidelines */}
            <Card>
                <CardHeader>
                    <CardTitle>Usage Guidelines</CardTitle>
                    <CardDescription>When to use each tab style</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <div>
                                <h4 className="font-semibold text-sm">Default Enhanced</h4>
                                <p className="text-xs text-muted-foreground">Main navigation, dashboards, primary interfaces</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm">Minimal</h4>
                                <p className="text-xs text-muted-foreground">Documentation, content-heavy pages, secondary navigation</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <h4 className="font-semibold text-sm">Bordered</h4>
                                <p className="text-xs text-muted-foreground">Settings panels, configuration interfaces, forms</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm">Pill</h4>
                                <p className="text-xs text-muted-foreground">Mobile interfaces, compact layouts, modern designs</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

// Example usage in your components:

/*
// Default Enhanced Style (current)
<Tabs defaultValue="overview">
  <TabsList className="grid w-full grid-cols-3">
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
    <TabsTrigger value="analytics">Analytics</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">Content here</TabsContent>
</Tabs>

// Minimal Style
<Tabs defaultValue="overview">
  <TabsListMinimal>
    <TabsTriggerMinimal value="overview">Overview</TabsTriggerMinimal>
    <TabsTriggerMinimal value="settings">Settings</TabsTriggerMinimal>
    <TabsTriggerMinimal value="analytics">Analytics</TabsTriggerMinimal>
  </TabsListMinimal>
  <TabsContent value="overview">Content here</TabsContent>
</Tabs>

// Bordered Style
<Tabs defaultValue="overview">
  <TabsListBordered className="grid w-full grid-cols-3">
    <TabsTriggerBordered value="overview">Overview</TabsTriggerBordered>
    <TabsTriggerBordered value="settings">Settings</TabsTriggerBordered>
    <TabsTriggerBordered value="analytics">Analytics</TabsTriggerBordered>
  </TabsListBordered>
  <TabsContent value="overview">Content here</TabsContent>
</Tabs>

// Pill Style
<Tabs defaultValue="overview">
  <TabsListPill className="grid w-full grid-cols-3">
    <TabsTriggerPill value="overview">Overview</TabsTriggerPill>
    <TabsTriggerPill value="settings">Settings</TabsTriggerPill>
    <TabsTriggerPill value="analytics">Analytics</TabsTriggerPill>
  </TabsListPill>
  <TabsContent value="overview">Content here</TabsContent>
</Tabs>
*/ 