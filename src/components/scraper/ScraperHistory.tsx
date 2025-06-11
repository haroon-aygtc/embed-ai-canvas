
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Globe, Calendar, FileText, Eye, Download, MoreHorizontal,
  CheckCircle, AlertCircle, Clock
} from 'lucide-react';

export const ScraperHistory = () => {
  const scrapingHistory = [
    {
      id: '1',
      url: 'https://docs.example.com',
      status: 'completed',
      pagesScraped: 45,
      startTime: '2024-01-15 10:30',
      duration: '2m 34s',
      size: '2.4 MB'
    },
    {
      id: '2',
      url: 'https://blog.example.com',
      status: 'completed',
      pagesScraped: 23,
      startTime: '2024-01-14 15:20',
      duration: '1m 12s',
      size: '1.8 MB'
    },
    {
      id: '3',
      url: 'https://help.example.com',
      status: 'running',
      pagesScraped: 12,
      startTime: '2024-01-15 11:45',
      duration: '45s',
      size: '0.9 MB'
    },
    {
      id: '4',
      url: 'https://api.example.com',
      status: 'error',
      pagesScraped: 0,
      startTime: '2024-01-13 09:15',
      duration: '5s',
      size: '0 MB'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'running': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge variant="outline" className="bg-green-100 text-green-800">Completed</Badge>;
      case 'running': return <Badge variant="default">Running</Badge>;
      case 'error': return <Badge variant="destructive">Error</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Scraping History
          </CardTitle>
          <CardDescription>
            View and manage your website scraping sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Website</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Pages</TableHead>
                <TableHead>Started</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scrapingHistory.map((session) => (
                <TableRow key={session.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate max-w-xs">{session.url}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(session.status)}
                      {getStatusBadge(session.status)}
                    </div>
                  </TableCell>
                  <TableCell>{session.pagesScraped}</TableCell>
                  <TableCell>{session.startTime}</TableCell>
                  <TableCell>{session.duration}</TableCell>
                  <TableCell>{session.size}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
