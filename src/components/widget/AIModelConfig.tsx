
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { WidgetConfig } from './WidgetConfiguration';

interface AIModelConfigProps {
  config: WidgetConfig;
  onConfigChange: (updates: Partial<WidgetConfig>) => void;
}

export const AIModelConfig = ({ config, onConfigChange }: AIModelConfigProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">AI Provider & Model</CardTitle>
          <CardDescription>Configure which AI model powers your chat widget</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>AI Provider</Label>
              <Select defaultValue="openai">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="anthropic">Anthropic</SelectItem>
                  <SelectItem value="groq">Groq</SelectItem>
                  <SelectItem value="gemini">Google Gemini</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Model</Label>
              <Select defaultValue="gpt-4">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4">
                    <div className="flex items-center gap-2">
                      GPT-4
                      <Badge variant="secondary" className="text-xs">Recommended</Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                  <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <div className="text-sm">
              <div className="font-medium mb-1">Selected Model: GPT-4</div>
              <div className="text-muted-foreground text-xs">
                Advanced reasoning • 128k context • $0.03/1k tokens
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">AI Behavior</CardTitle>
          <CardDescription>Configure how the AI responds to users</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>System Prompt</Label>
            <Textarea
              placeholder="You are a helpful customer support assistant. Be friendly, professional, and provide accurate information about our products and services."
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              This prompt defines how the AI should behave and respond to users
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Response Style</Label>
              <Select defaultValue="balanced">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="creative">Creative</SelectItem>
                  <SelectItem value="balanced">Balanced</SelectItem>
                  <SelectItem value="precise">Precise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Max Response Length</Label>
              <Select defaultValue="medium">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short (100 words)</SelectItem>
                  <SelectItem value="medium">Medium (250 words)</SelectItem>
                  <SelectItem value="long">Long (500 words)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
