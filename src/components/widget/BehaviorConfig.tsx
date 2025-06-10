import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input, InputCompact } from "@/components/ui/input";
import { SearchableSelect } from "@/components/ui/combobox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Clock,
  Users,
  Target,
  MessageCircle,
  Settings,
  Plus,
  X,
  Calendar,
  Loader2,
} from "lucide-react";
import { WidgetConfig } from "./WidgetConfiguration";
import { useWidgetBehavior } from "@/hooks/useWidgetBehavior";
import { useWidget } from "@/hooks/useWidget";
import { AUTO_OPEN_TRIGGERS, DAYS_OF_WEEK } from "@/lib/constants/widget-constants";

interface BehaviorConfigProps {
  config: WidgetConfig;
  onConfigChange: (updates: Partial<WidgetConfig>) => void;
}

export const BehaviorConfig = ({
  config,
  onConfigChange,
}: BehaviorConfigProps) => {
  const { currentWidget } = useWidget();
  const widgetId = currentWidget?.id;

  // Use real API data instead of hardcoded arrays
  const {
    behaviorConfig,
    operatingHours,
    isLoading,
    error,
    loadBehaviorSettings,
    updateBehaviorSettings,
    loadOperatingHours,
    updateOperatingHours,
  } = useWidgetBehavior();

  // Load data when widget ID is available
  useEffect(() => {
    if (widgetId) {
      loadBehaviorSettings(widgetId);
      loadOperatingHours(widgetId);
    }
  }, [widgetId, loadBehaviorSettings, loadOperatingHours]);

  // Import trigger options from constants
  const triggerOptions = AUTO_OPEN_TRIGGERS;

  const handleBehaviorUpdate = async (updates: any) => {
    if (!widgetId) return;

    const updatedConfig = {
      ...behaviorConfig,
      ...updates,
    };

    await updateBehaviorSettings(widgetId, updatedConfig);
  };

  const handleOperatingHoursUpdate = async (dayIndex: number, updates: any) => {
    if (!widgetId || !operatingHours) return;

    const updatedHours = [...operatingHours];
    updatedHours[dayIndex] = { ...updatedHours[dayIndex], ...updates };

    await updateOperatingHours(widgetId, updatedHours);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Widget Behavior Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure advanced behavior, triggers, and operating hours
        </p>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Basic
          </TabsTrigger>
          <TabsTrigger value="triggers" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Triggers
          </TabsTrigger>
          <TabsTrigger value="hours" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Hours
          </TabsTrigger>
          <TabsTrigger value="targeting" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Targeting
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6 mt-6">
          {/* Dual Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Basic Settings */}
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-medium mb-4 text-muted-foreground uppercase tracking-wide text-xs">
                  Core Behavior
                </h4>
                <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg mb-4">
                  <div className="flex items-start space-x-2">
                    <Settings className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        Basic Widget Settings
                      </p>
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        Widget enabled/disabled and branding settings are now
                        configured in the <strong>Settings</strong> tab for
                        better organization.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">
                      Sound Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Play sound when new messages arrive
                    </p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">
                      Typing Indicators
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Show when the AI is typing a response
                    </p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
              </div>
            </div>

            {/* Right Column - Advanced Settings */}
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-medium mb-4 text-muted-foreground uppercase tracking-wide text-xs">
                  Advanced Options
                </h4>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">
                      Message Persistence
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Remember conversation when user returns
                    </p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">
                      Auto-Minimize
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Minimize widget after period of inactivity
                    </p>
                  </div>
                  <Switch defaultChecked={false} />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="triggers" className="space-y-6 mt-6">
          {/* Dual Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Auto-Open Triggers */}
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-medium mb-4 text-muted-foreground uppercase tracking-wide text-xs">
                  Auto-Open Triggers
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Configure when the widget should automatically open
                </p>
              </div>

              <div className="space-y-4">
                {triggerOptions.map((trigger) => (
                  <div
                    key={trigger.id}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">{trigger.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h5 className="font-medium">{trigger.label}</h5>
                          <Switch defaultChecked={trigger.id === "immediate_trigger"} />
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {trigger.description}
                        </p>
                        {trigger.id === "time_delay_trigger" && (
                          <div className="mt-2 flex items-center space-x-2">
                            <Input
                              type="number"
                              placeholder="30"
                              className="w-20 h-8"
                              defaultValue="30"
                            />
                            <span className="text-sm text-muted-foreground">
                              seconds
                            </span>
                          </div>
                        )}
                        {trigger.id === "scroll_trigger" && (
                          <div className="mt-2 flex items-center space-x-2">
                            <Input
                              type="number"
                              placeholder="50"
                              className="w-20 h-8"
                              defaultValue="50"
                            />
                            <span className="text-sm text-muted-foreground">
                              % scrolled
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Proactive Messaging */}
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-medium mb-4 text-muted-foreground uppercase tracking-wide text-xs">
                  Proactive Messaging
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Send automated messages to engage visitors
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">
                      Enable Proactive Messages
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Send helpful messages based on user behavior
                    </p>
                  </div>
                  <Switch defaultChecked={false} />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    Message Templates
                  </Label>
                  <div className="space-y-2">
                    <div className="p-3 bg-background rounded-lg border">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">
                          👋 Need help finding something?
                        </span>
                        <Badge variant="outline">30s delay</Badge>
                      </div>
                    </div>
                    <div className="p-3 bg-background rounded-lg border">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">
                          💡 Have questions about our pricing?
                        </span>
                        <Badge variant="outline">Pricing page</Badge>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Proactive Message
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="hours" className="space-y-6 mt-6">
          {/* Dual Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Operating Hours */}
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-medium mb-4 text-muted-foreground uppercase tracking-wide text-xs">
                  Operating Hours
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Set when your chat widget is available
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">
                      Enable Operating Hours
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Show different behavior outside business hours
                    </p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>

                <div className="space-y-3">
                  {operatingHours.map((schedule, index) => (
                    <div
                      key={schedule.day}
                      className="flex items-center space-x-4 p-3 border rounded-lg"
                    >
                      <Switch
                        checked={schedule.enabled}
                        onCheckedChange={(enabled) => {
                          handleOperatingHoursUpdate(index, { enabled });
                        }}
                      />
                      <div className="flex-1 grid grid-cols-3 gap-2 items-center">
                        <span className="text-sm font-medium">
                          {schedule.day}
                        </span>
                        <Input
                          type="time"
                          value={schedule.start}
                          onChange={(e) => {
                            handleOperatingHoursUpdate(index, { start: e.target.value });
                          }}
                          className="h-8"
                          disabled={!schedule.enabled}
                        />
                        <Input
                          type="time"
                          value={schedule.end}
                          onChange={(e) => {
                            handleOperatingHoursUpdate(index, { end: e.target.value });
                          }}
                          className="h-8"
                          disabled={!schedule.enabled}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Timezone & Offline Settings */}
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-medium mb-4 text-muted-foreground uppercase tracking-wide text-xs">
                  Timezone & Offline
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Configure timezone and offline behavior
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-base font-medium">Timezone</Label>
                  <Select defaultValue="utc">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc">🌍 UTC (GMT+0)</SelectItem>
                      <SelectItem value="est">
                        🇺🇸 Eastern Time (GMT-5)
                      </SelectItem>
                      <SelectItem value="pst">
                        🇺🇸 Pacific Time (GMT-8)
                      </SelectItem>
                      <SelectItem value="gmt">🇬🇧 London (GMT+0)</SelectItem>
                      <SelectItem value="cet">
                        🇪🇺 Central Europe (GMT+1)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-medium">
                    Offline Message
                  </Label>
                  <Input
                    placeholder="We're currently offline. Leave a message!"
                    defaultValue="We're currently offline. Leave a message!"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">
                      Collect Offline Messages
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Allow visitors to leave messages when offline
                    </p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="targeting" className="space-y-6 mt-6">
          {/* Dual Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Visitor Targeting */}
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-medium mb-4 text-muted-foreground uppercase tracking-wide text-xs">
                  Visitor Targeting
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Show widget to specific visitor segments
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">
                      New Visitors Only
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Show widget only to first-time visitors
                    </p>
                  </div>
                  <Switch defaultChecked={false} />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">
                      Returning Visitors
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Show different behavior for returning visitors
                    </p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-medium">
                    Geographic Targeting
                  </Label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">🌍 All Countries</SelectItem>
                      <SelectItem value="us">🇺🇸 United States</SelectItem>
                      <SelectItem value="eu">🇪🇺 European Union</SelectItem>
                      <SelectItem value="custom">
                        ⚙️ Custom Countries
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Right Column - Page Targeting */}
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-medium mb-4 text-muted-foreground uppercase tracking-wide text-xs">
                  Page Targeting
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Control which pages show the widget
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-base font-medium">Page Rules</Label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">📄 All Pages</SelectItem>
                      <SelectItem value="specific">
                        🎯 Specific Pages
                      </SelectItem>
                      <SelectItem value="exclude">🚫 Exclude Pages</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-medium">URL Patterns</Label>
                  <div className="space-y-2">
                    <Input placeholder="/pricing*" />
                    <Input placeholder="/contact" />
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add URL Pattern
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
