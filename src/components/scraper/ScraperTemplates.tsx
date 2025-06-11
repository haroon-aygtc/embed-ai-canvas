
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  FileText, ShoppingCart, Newspaper, Code, Database, Globe,
  Star, Play, Settings
} from 'lucide-react';

export const ScraperTemplates = () => {
  const templates = [
    {
      id: '1',
      name: 'E-commerce Product Pages',
      description: 'Extract product information, prices, and descriptions from online stores',
      icon: ShoppingCart,
      category: 'E-commerce',
      popularity: 5,
      features: ['Product titles', 'Prices', 'Descriptions', 'Images', 'Reviews']
    },
    {
      id: '2',
      name: 'News Articles',
      description: 'Scrape news articles with headlines, content, and metadata',
      icon: Newspaper,
      category: 'Media',
      popularity: 4,
      features: ['Headlines', 'Article content', 'Publication date', 'Author', 'Tags']
    },
    {
      id: '3',
      name: 'Documentation Sites',
      description: 'Extract technical documentation and API references',
      icon: FileText,
      category: 'Technical',
      popularity: 5,
      features: ['Code blocks', 'Examples', 'API endpoints', 'Navigation', 'Search']
    },
    {
      id: '4',
      name: 'Code Repositories',
      description: 'Scrape code files, README files, and repository information',
      icon: Code,
      category: 'Development',
      popularity: 4,
      features: ['Source code', 'README files', 'Commit history', 'Issues', 'Wiki']
    },
    {
      id: '5',
      name: 'Business Directories',
      description: 'Extract business listings, contact information, and reviews',
      icon: Database,
      category: 'Business',
      popularity: 3,
      features: ['Business names', 'Addresses', 'Phone numbers', 'Reviews', 'Categories']
    },
    {
      id: '6',
      name: 'General Web Pages',
      description: 'Universal template for scraping any type of web content',
      icon: Globe,
      category: 'General',
      popularity: 5,
      features: ['All text content', 'Links', 'Images', 'Metadata', 'Structure']
    }
  ];

  const renderStars = (count: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-3 w-3 ${
          index < count ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => {
          const IconComponent = template.icon;
          return (
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <Badge variant="outline" className="mt-1">
                        {template.category}
                      </Badge>
                    </div>
                  </div>
                </div>
                <CardDescription className="mt-2">
                  {template.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">Popularity:</span>
                    <div className="flex space-x-1">
                      {renderStars(template.popularity)}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium mb-2">Features:</div>
                    <div className="flex flex-wrap gap-1">
                      {template.features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button size="sm" className="flex-1">
                      <Play className="h-3 w-3 mr-1" />
                      Use Template
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
