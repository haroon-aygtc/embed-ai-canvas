
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Save, RotateCcw } from 'lucide-react';

export const ScraperSettings = () => {
  const [settings, setSettings] = useState({
    respectRobots: true,
    followRedirects: true,
    extractImages: false,
    extractLinks: true,
    crawlDelay: '1000',
    userAgent: 'ChatWidget Scraper 1.0',
    excludePatterns: '',
    includePatterns: '',
    maxPages: '100',
    timeout: '30'
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    console.log('Saving settings:', settings);
    // TODO: Implement settings save
  };

  const handleReset = () => {
    setSettings({
      respectRobots: true,
      followRedirects: true,
      extractImages: false,
      extractLinks: true,
      crawlDelay: '1000',
      userAgent: 'ChatWidget Scraper 1.0',
      excludePatterns: '',
      includePatterns: '',
      maxPages: '100',
      timeout: '30'
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Scraper Settings
          </CardTitle>
          <CardDescription>
            Configure scraping behavior and limits
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Behavior Settings */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Scraping Behavior</h4>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <Label>Respect robots.txt</Label>
                <p className="text-sm text-muted-foreground">Follow website crawling rules</p>
              </div>
              <Switch
                checked={settings.respectRobots}
                onCheckedChange={(checked) => updateSetting('respectRobots', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <Label>Follow redirects</Label>
                <p className="text-sm text-muted-foreground">Automatically follow HTTP redirects</p>
              </div>
              <Switch
                checked={settings.followRedirects}
                onCheckedChange={(checked) => updateSetting('followRedirects', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <Label>Extract images</Label>
                <p className="text-sm text-muted-foreground">Download and include images</p>
              </div>
              <Switch
                checked={settings.extractImages}
                onCheckedChange={(checked) => updateSetting('extractImages', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <Label>Extract links</Label>
                <p className="text-sm text-muted-foreground">Include outbound and internal links</p>
              </div>
              <Switch
                checked={settings.extractLinks}
                onCheckedChange={(checked) => updateSetting('extractLinks', checked)}
              />
            </div>
          </div>

          {/* Performance Settings */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Performance Settings</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="crawlDelay">Crawl delay (ms)</Label>
                <Input
                  id="crawlDelay"
                  type="number"
                  value={settings.crawlDelay}
                  onChange={(e) => updateSetting('crawlDelay', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxPages">Max pages</Label>
                <Input
                  id="maxPages"
                  type="number"
                  value={settings.maxPages}
                  onChange={(e) => updateSetting('maxPages', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeout">Timeout (seconds)</Label>
                <Input
                  id="timeout"
                  type="number"
                  value={settings.timeout}
                  onChange={(e) => updateSetting('timeout', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="userAgent">User Agent</Label>
                <Input
                  id="userAgent"
                  value={settings.userAgent}
                  onChange={(e) => updateSetting('userAgent', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Pattern Settings */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">URL Patterns</h4>
            
            <div className="space-y-2">
              <Label htmlFor="includePatterns">Include patterns (one per line)</Label>
              <Textarea
                id="includePatterns"
                placeholder="/docs/*&#10;/help/*&#10;/api/*"
                value={settings.includePatterns}
                onChange={(e) => updateSetting('includePatterns', e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excludePatterns">Exclude patterns (one per line)</Label>
              <Textarea
                id="excludePatterns"
                placeholder="/admin/*&#10;/private/*&#10;*.pdf"
                value={settings.excludePatterns}
                onChange={(e) => updateSetting('excludePatterns', e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-4">
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Defaults
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
