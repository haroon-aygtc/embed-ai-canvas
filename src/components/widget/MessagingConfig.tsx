import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input, InputCompact } from '@/components/ui/input';
import { SearchableSelect } from '@/components/ui/combobox';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { MessageSquare, Globe, Zap, Image, Plus, X, Edit, Copy, Clock, Users, Settings } from 'lucide-react';
import { WidgetConfig } from './WidgetConfiguration';

interface MessagingConfigProps {
  config: WidgetConfig;
  onConfigChange: (updates: Partial<WidgetConfig>) => void;
}

export const MessagingConfig = ({ config, onConfigChange }: MessagingConfigProps) => {
  const [quickResponses, setQuickResponses] = useState([
    { id: 1, text: 'How can I help you today?', category: 'General', enabled: true },
    { id: 2, text: 'What are your pricing plans?', category: 'Pricing', enabled: true },
    { id: 3, text: 'I need technical support', category: 'Support', enabled: true },
    { id: 4, text: 'Tell me about your features', category: 'Features', enabled: false },
  ]);

  const [conversationStarters, setConversationStarters] = useState([
    { id: 1, message: 'Welcome! How can we help you today?', trigger: 'first_visit', delay: 3 },
    { id: 2, message: 'Welcome back! Any questions?', trigger: 'return_visit', delay: 5 },
    { id: 3, message: 'Interested in our pricing? I can help!', trigger: 'pricing_page', delay: 10 },
    { id: 4, message: 'Need help? I\'m here to assist!', trigger: 'contact_page', delay: 2 },
  ]);

  const [languages, setLanguages] = useState([
    { code: 'en', name: 'English', enabled: true, primary: true },
    { code: 'es', name: 'Spanish', enabled: true, primary: false },
    { code: 'fr', name: 'French', enabled: false, primary: false },
    { code: 'de', name: 'German', enabled: false, primary: false },
    { code: 'it', name: 'Italian', enabled: false, primary: false },
    { code: 'pt', name: 'Portuguese', enabled: false, primary: false },
  ]);

  const categories = ['General', 'Pricing', 'Support', 'Features', 'Technical', 'Sales'];
  const triggers = [
    { id: 'first_visit', label: 'First Visit', icon: '👋' },
    { id: 'return_visit', label: 'Return Visit', icon: '🔄' },
    { id: 'pricing_page', label: 'Pricing Page', icon: '💰' },
    { id: 'contact_page', label: 'Contact Page', icon: '📞' },
    { id: 'checkout', label: 'Checkout', icon: '🛒' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Messaging & Communication</h3>
        <p className="text-sm text-muted-foreground">Configure rich media, quick responses, and conversation features</p>
      </div>

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="content" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Content
          </TabsTrigger>
          <TabsTrigger value="quick-responses" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Quick Responses
          </TabsTrigger>
          <TabsTrigger value="starters" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Starters
          </TabsTrigger>
          <TabsTrigger value="languages" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Languages
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6 mt-6">
          {/* Dual Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Left Column - Basic Settings Notice */}
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-medium mb-4 text-muted-foreground uppercase tracking-wide text-xs">Content Settings</h4>
                <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <MessageSquare className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        Basic Widget Text Settings
                      </p>
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        Widget title, subtitle, welcome message, and input placeholder are now configured in the <strong>Settings</strong> tab for better organization.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Rich Media Support */}
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-medium mb-4 text-muted-foreground uppercase tracking-wide text-xs">Rich Media Support</h4>
                <p className="text-sm text-muted-foreground mb-4">Enable rich content in conversations</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">File Uploads</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow users to upload files and images
                    </p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">Emoji Support</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable emoji picker in chat
                    </p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">Link Previews</Label>
                    <p className="text-sm text-muted-foreground">
                      Show previews for shared links
                    </p>
                  </div>
                  <Switch defaultChecked={false} />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">Voice Messages</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow voice message recording
                    </p>
                  </div>
                  <Switch defaultChecked={false} />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="quick-responses" className="space-y-6 mt-6">
          {/* Header with Action Button */}
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
            <div>
              <h4 className="text-base font-medium">Quick Response Buttons</h4>
              <p className="text-sm text-muted-foreground">
                Pre-defined responses for common questions
              </p>
            </div>
            <Button variant="default" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Response
            </Button>
          </div>

          {/* Dual Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Left Column - Quick Responses */}
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-medium mb-4 text-muted-foreground uppercase tracking-wide text-xs">Response Management</h4>
              </div>

              <div className="space-y-3">
                {quickResponses.map((response) => (
                  <div key={response.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Switch checked={response.enabled} />
                        <Badge variant="outline" className="text-xs">
                          {response.category}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      <Select defaultValue={response.category}>
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Input
                        placeholder="Quick response text"
                        defaultValue={response.text}
                        className="h-8"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Templates */}
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-medium mb-4 text-muted-foreground uppercase tracking-wide text-xs">Quick Setup Templates</h4>
                <p className="text-sm text-muted-foreground mb-4">Pre-built response sets for different industries</p>
              </div>

              <div className="space-y-4">
                <Button variant="outline" className="w-full h-12 justify-start">
                  <span className="text-lg mr-3">🛒</span>
                  <div className="text-left">
                    <div className="font-medium">E-commerce</div>
                    <div className="text-xs text-muted-foreground">Product, shipping, returns</div>
                  </div>
                </Button>
                <Button variant="outline" className="w-full h-12 justify-start">
                  <span className="text-lg mr-3">💼</span>
                  <div className="text-left">
                    <div className="font-medium">SaaS</div>
                    <div className="text-xs text-muted-foreground">Features, pricing, support</div>
                  </div>
                </Button>
                <Button variant="outline" className="w-full h-12 justify-start">
                  <span className="text-lg mr-3">📚</span>
                  <div className="text-left">
                    <div className="font-medium">Support</div>
                    <div className="text-xs text-muted-foreground">Help, troubleshooting, guides</div>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="starters" className="space-y-6 mt-6">
          {/* Header with Action Button */}
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
            <div>
              <h4 className="text-base font-medium">Conversation Starters</h4>
              <p className="text-sm text-muted-foreground">
                Automated messages to engage visitors
              </p>
            </div>
            <Button variant="default" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Starter
            </Button>
          </div>

          {/* Single Column for Starters */}
          <div className="space-y-4">
            {conversationStarters.map((starter) => (
              <div key={starter.id} className="p-4 border rounded-lg">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
                  <div className="flex items-center space-x-3">
                    <Switch defaultChecked={true} />
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">
                        {triggers.find(t => t.id === starter.trigger)?.icon}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {triggers.find(t => t.id === starter.trigger)?.label}
                      </Badge>
                    </div>
                  </div>

                  <div className="lg:col-span-2">
                    <Input
                      placeholder="Conversation starter message"
                      defaultValue={starter.message}
                      className="h-8"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        placeholder="5"
                        defaultValue={starter.delay}
                        className="w-16 h-8"
                      />
                      <span className="text-sm text-muted-foreground">sec</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="languages" className="space-y-6 mt-6">
          {/* Dual Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Left Column - Language Settings */}
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-medium mb-4 text-muted-foreground uppercase tracking-wide text-xs">Language Support</h4>
                <p className="text-sm text-muted-foreground mb-4">Configure multi-language support for your widget</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">Auto-Detect Language</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically detect visitor's language
                    </p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>

                <div className="space-y-3">
                  {languages.map((lang) => (
                    <div key={lang.code} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Switch checked={lang.enabled} />
                        <div>
                          <span className="font-medium">{lang.name}</span>
                          {lang.primary && (
                            <Badge variant="default" className="ml-2 text-xs">Primary</Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Translation Settings */}
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-medium mb-4 text-muted-foreground uppercase tracking-wide text-xs">Translation Options</h4>
                <p className="text-sm text-muted-foreground mb-4">Configure automatic translation features</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">Real-time Translation</Label>
                    <p className="text-sm text-muted-foreground">
                      Translate messages in real-time
                    </p>
                  </div>
                  <Switch defaultChecked={false} />
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-medium">Translation Service</Label>
                  <Select defaultValue="google">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="google">Google Translate</SelectItem>
                      <SelectItem value="deepl">DeepL</SelectItem>
                      <SelectItem value="azure">Azure Translator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Globe className="h-4 w-4 text-amber-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                        Translation Quality
                      </p>
                      <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                        Automatic translation may not be perfect. Consider having native speakers review important messages.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
