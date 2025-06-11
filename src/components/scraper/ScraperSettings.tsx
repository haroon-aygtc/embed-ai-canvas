
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Settings, Save, RefreshCw, Shield, Zap, Clock } from 'lucide-react';

export const ScraperSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    defaultDelay: '1',
    maxConcurrent: '3',
    timeout: '30',
    userAgent: 'ChatWidget Pro Scraper 1.0',
    respectRobots: true,
    followRedirects: true,
    extractImages: false,
    extractCode: true,
    autoSave: true,
    notifications: true
  });

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your scraper settings have been updated successfully",
    });
  };

  const handleReset = () => {
    setSettings({
      defaultDelay: '1',
      maxConcurrent: '3',
      timeout: '30',
      userAgent: 'ChatWidget Pro Scraper 1.0',
      respectRobots: true,
      followRedirects: true,
      extractImages: false,
      extractCode: true,
      autoSave: true,
      notifications: true
    });
    toast({
      title: "Settings Reset",
      description: "All settings have been restored to default values",
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Performance Settings
            </CardTitle>
            <CardDescription>
              Configure scraping performance and resource usage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="defaultDelay">Default Delay (seconds)</Label>
              <Input
                id="defaultDelay"
                type="number"
                min="0"
                max="10"
                step="0.5"
                value={settings.defaultDelay}
                onChange={(e) => setSettings(prev => ({ ...prev, defaultDelay: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxConcurrent">Max Concurrent Requests</Label>
              <Select
                value={settings.maxConcurrent}
                onValueChange={(value) => setSettings(prev => ({ ...prev, maxConcurrent: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 (Slow)</SelectItem>
                  <SelectItem value="3">3 (Balanced)</SelectItem>
                  <SelectItem value="5">5 (Fast)</SelectItem>
                  <SelectItem value="10">10 (Very Fast)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeout">Request Timeout (seconds)</Label>
              <Input
                id="timeout"
                type="number"
                min="5"
                max="120"
                value={settings.timeout}
                onChange={(e) => setSettings(prev => ({ ...prev, timeout: e.target.value }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security & Compliance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security & Compliance
            </CardTitle>
            <CardDescription>
              Configure security and compliance settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userAgent">User Agent</Label>
              <Input
                id="userAgent"
                value={settings.userAgent}
                onChange={(e) => setSettings(prev => ({ ...prev, userAgent: e.target.value }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Respect robots.txt</Label>
                <div className="text-sm text-muted-foreground">
                  Follow website crawling guidelines
                </div>
              </div>
              <Switch
                checked={settings.respectRobots}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, respectRobots: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Follow Redirects</Label>
                <div className="text-sm text-muted-foreground">
                  Automatically follow HTTP redirects
                </div>
              </div>
              <Switch
                checked={settings.followRedirects}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, followRedirects: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Content Extraction */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Content Extraction
            </CardTitle>
            <CardDescription>
              Configure what content to extract by default
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Extract Images</Label>
                <div className="text-sm text-muted-foreground">
                  Download and save image files
                </div>
              </div>
              <Switch
                checked={settings.extractImages}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, extractImages: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Extract Code Blocks</Label>
                <div className="text-sm text-muted-foreground">
                  Preserve code formatting and syntax
                </div>
              </div>
              <Switch
                checked={settings.extractCode}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, extractCode: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-save Results</Label>
                <div className="text-sm text-muted-foreground">
                  Automatically save to knowledge base
                </div>
              </div>
              <Switch
                checked={settings.autoSave}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoSave: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configure scraping notifications and alerts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Notifications</Label>
                <div className="text-sm text-muted-foreground">
                  Get notified when scraping completes
                </div>
              </div>
              <Switch
                checked={settings.notifications}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, notifications: checked }))}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={handleReset}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset to Defaults
        </Button>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
};
