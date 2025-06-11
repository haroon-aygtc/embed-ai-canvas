
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import {
  Globe, Play, Download, Eye, Settings, AlertCircle, CheckCircle,
  Clock, FileText, Image, Code, Database, Loader2
} from 'lucide-react';

export const ScraperForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    url: '',
    contentType: 'all',
    maxPages: '10',
    delay: '1',
    followLinks: true,
    extractImages: false,
    extractCode: false
  });
  const [isScrapingj, setIsScraping] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scrapedData, setScrapedData] = useState(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsScraping(true);
    setProgress(0);
    setScrapedData(null);

    try {
      // Simulate scraping progress
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsScraping(false);
            setScrapedData({
              url: formData.url,
              pages: Math.floor(Math.random() * 50) + 1,
              content: 'Sample scraped content...',
              timestamp: new Date().toISOString()
            });
            toast({
              title: "Scraping Complete",
              description: "Successfully extracted content from the website",
            });
            return 100;
          }
          return prev + 10;
        });
      }, 500);
    } catch (error) {
      setIsScraping(false);
      toast({
        title: "Scraping Failed",
        description: "Failed to extract content from the website",
        variant: "destructive",
      });
    }
  };

  const contentTypes = [
    { value: 'all', label: 'All Content', icon: Globe },
    { value: 'text', label: 'Text Only', icon: FileText },
    { value: 'images', label: 'Images', icon: Image },
    { value: 'code', label: 'Code Blocks', icon: Code },
    { value: 'data', label: 'Structured Data', icon: Database }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Scraper Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Website Scraper
          </CardTitle>
          <CardDescription>
            Extract content from any website with advanced options
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="url">Website URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com"
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contentType">Content Type</Label>
              <Select
                value={formData.contentType}
                onValueChange={(value) => setFormData(prev => ({ ...prev, contentType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent>
                  {contentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <type.icon className="h-4 w-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxPages">Max Pages</Label>
                <Input
                  id="maxPages"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.maxPages}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxPages: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="delay">Delay (seconds)</Label>
                <Input
                  id="delay"
                  type="number"
                  min="0"
                  max="10"
                  step="0.5"
                  value={formData.delay}
                  onChange={(e) => setFormData(prev => ({ ...prev, delay: e.target.value }))}
                />
              </div>
            </div>

            {isScrapingj && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Scraping Progress</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>
            )}

            <Button
              type="submit"
              disabled={isScrapingj}
              className="w-full"
            >
              {isScrapingj ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Scraping...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start Scraping
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Results Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Scraped Results
          </CardTitle>
          <CardDescription>
            View and download extracted content
          </CardDescription>
        </CardHeader>
        <CardContent>
          {scrapedData ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Completed
                </Badge>
                <div className="text-sm text-muted-foreground">
                  {scrapedData.pages} pages scraped
                </div>
              </div>

              <div className="space-y-2">
                <Label>Extracted Content Preview</Label>
                <Textarea
                  value={scrapedData.content}
                  readOnly
                  rows={8}
                  className="font-mono text-xs"
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Database className="h-4 w-4 mr-2" />
                  Save to KB
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Start scraping to see results here</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
