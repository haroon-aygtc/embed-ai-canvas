
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Globe, Play, Settings, AlertCircle, CheckCircle } from 'lucide-react';

export const ScraperForm = () => {
  const [url, setUrl] = useState('');
  const [depth, setDepth] = useState('2');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'running' | 'completed' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('running');
    setProgress(0);

    // Simulate scraping progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLoading(false);
          setStatus('completed');
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Website Scraper
          </CardTitle>
          <CardDescription>
            Extract content from websites to build your knowledge base
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">Website URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="depth">Crawl Depth</Label>
                <Select value={depth} onValueChange={setDepth}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 level</SelectItem>
                    <SelectItem value="2">2 levels</SelectItem>
                    <SelectItem value="3">3 levels</SelectItem>
                    <SelectItem value="4">4 levels</SelectItem>
                    <SelectItem value="5">5 levels</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <div className="flex items-center space-x-2">
                  {status === 'idle' && <Badge variant="outline">Ready</Badge>}
                  {status === 'running' && <Badge variant="default">Running</Badge>}
                  {status === 'completed' && <Badge variant="outline" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>}
                  {status === 'error' && <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Error</Badge>}
                </div>
              </div>
            </div>

            {status === 'running' && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Scraping progress</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>
            )}

            <div className="flex space-x-2">
              <Button type="submit" disabled={isLoading || !url}>
                <Play className="h-4 w-4 mr-2" />
                {isLoading ? 'Scraping...' : 'Start Scraping'}
              </Button>
              <Button type="button" variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Advanced Settings
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
