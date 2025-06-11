
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search, Download, Eye, MoreHorizontal, Calendar, Globe,
  CheckCircle, AlertCircle, Clock, Filter
} from 'lucide-react';

export const ScraperHistory = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock scraping history data
  const scrapingHistory = [
    {
      id: '1',
      url: 'https://example.com',
      status: 'completed',
      pages: 25,
      contentType: 'All Content',
      timestamp: '2024-06-11 14:30',
      size: '2.4 MB'
    },
    {
      id: '2',
      url: 'https://docs.example.com',
      status: 'completed',
      pages: 156,
      contentType: 'Text Only',
      timestamp: '2024-06-11 12:15',
      size: '1.8 MB'
    },
    {
      id: '3',
      url: 'https://blog.example.com',
      status: 'failed',
      pages: 0,
      contentType: 'All Content',
      timestamp: '2024-06-11 10:45',
      size: '0 MB'
    },
    {
      id: '4',
      url: 'https://api.example.com',
      status: 'processing',
      pages: 12,
      contentType: 'Structured Data',
      timestamp: '2024-06-11 15:20',
      size: '890 KB'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'failed': return AlertCircle;
      case 'processing': return Clock;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredHistory = scrapingHistory.filter(item =>
    item.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search scraping history..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* History List */}
      <Card>
        <CardHeader>
          <CardTitle>Scraping History</CardTitle>
          <CardDescription>
            View and manage your previous scraping sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredHistory.map((item) => {
              const StatusIcon = getStatusIcon(item.status);
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Globe className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{item.url}</div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{item.pages} pages</span>
                        <span>•</span>
                        <span>{item.contentType}</span>
                        <span>•</span>
                        <span>{item.size}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {item.timestamp}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Badge className={getStatusColor(item.status)}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {item.status}
                    </Badge>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
