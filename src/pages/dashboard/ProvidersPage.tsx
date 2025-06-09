
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Bot, Settings, TestTube, Check, X, Eye, EyeOff } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

interface Provider {
  id: string;
  name: string;
  status: 'connected' | 'disconnected' | 'error';
  apiKey?: string;
  baseUrl?: string;
  models?: string[];
  lastTested?: string;
}

const mockProviders: Provider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    status: 'connected',
    apiKey: 'sk-***...***abc',
    models: ['gpt-4', 'gpt-3.5-turbo', 'gpt-4-turbo'],
    lastTested: '2024-01-15 14:30'
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    status: 'connected',
    apiKey: 'sk-ant-***...***xyz',
    models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
    lastTested: '2024-01-15 14:25'
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    status: 'disconnected',
    models: []
  },
  {
    id: 'groq',
    name: 'Groq',
    status: 'error',
    apiKey: 'gsk-***...***def',
    lastTested: '2024-01-15 14:20'
  }
];

const ProvidersPage = () => {
  const [providers, setProviders] = useState<Provider[]>(mockProviders);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [testMessage, setTestMessage] = useState('Hello, can you help me test this connection?');
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleTestConnection = async (providerId: string) => {
    setIsTestingConnection(true);
    // Simulate API call
    setTimeout(() => {
      setTestResult('Connection successful! Provider is responding correctly.');
      setIsTestingConnection(false);
    }, 2000);
  };

  const handleTestMessage = async () => {
    setIsTestingConnection(true);
    // Simulate API call
    setTimeout(() => {
      setTestResult('Test message sent successfully. Response: "Hello! I can help you test this connection. The integration is working perfectly."');
      setIsTestingConnection(false);
    }, 3000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">AI Providers</h1>
            <p className="text-muted-foreground">Manage your AI provider configurations and test connections</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Provider
          </Button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Available Providers</CardTitle>
                <CardDescription>Configure your AI providers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {providers.map((provider) => (
                  <div
                    key={provider.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedProvider?.id === provider.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedProvider(provider)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Bot className="h-5 w-5" />
                        <div>
                          <div className="font-medium">{provider.name}</div>
                          {provider.models && (
                            <div className="text-xs text-muted-foreground">
                              {provider.models.length} models
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(provider.status)}`} />
                        <Badge variant={provider.status === 'connected' ? 'default' : 'secondary'}>
                          {provider.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="xl:col-span-2">
            {selectedProvider ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bot className="h-5 w-5" />
                    <span>{selectedProvider.name} Configuration</span>
                  </CardTitle>
                  <CardDescription>
                    Configure and test your {selectedProvider.name} integration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="config" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="config" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Configuration
                      </TabsTrigger>
                      <TabsTrigger value="test" className="flex items-center gap-2">
                        <TestTube className="h-4 w-4" />
                        Testing
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="config" className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="apiKey">API Key</Label>
                        <div className="flex space-x-2">
                          <Input
                            id="apiKey"
                            type={showApiKey ? 'text' : 'password'}
                            value={selectedProvider.apiKey || ''}
                            placeholder="Enter your API key"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setShowApiKey(!showApiKey)}
                          >
                            {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                      {selectedProvider.name === 'OpenRouter' && (
                        <div className="space-y-2">
                          <Label htmlFor="baseUrl">Base URL</Label>
                          <Input
                            id="baseUrl"
                            value={selectedProvider.baseUrl || 'https://openrouter.ai/api/v1'}
                            placeholder="https://openrouter.ai/api/v1"
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Enable Provider</Label>
                          <p className="text-sm text-muted-foreground">
                            Allow this provider to be used in widgets
                          </p>
                        </div>
                        <Switch defaultChecked={selectedProvider.status === 'connected'} />
                      </div>

                      <div className="flex space-x-2">
                        <Button 
                          onClick={() => handleTestConnection(selectedProvider.id)}
                          disabled={isTestingConnection}
                        >
                          {isTestingConnection ? 'Testing...' : 'Test Connection'}
                        </Button>
                        <Button variant="outline">Save Configuration</Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="test" className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="testMessage">Test Message</Label>
                        <Textarea
                          id="testMessage"
                          value={testMessage}
                          onChange={(e) => setTestMessage(e.target.value)}
                          placeholder="Enter a test message to send to the provider"
                          rows={3}
                        />
                      </div>

                      <Button 
                        onClick={handleTestMessage}
                        disabled={isTestingConnection}
                        className="w-full"
                      >
                        {isTestingConnection ? 'Sending Test Message...' : 'Send Test Message'}
                      </Button>

                      {testResult && (
                        <div className="p-4 bg-muted rounded-lg">
                          <h4 className="font-medium mb-2">Test Result:</h4>
                          <p className="text-sm">{testResult}</p>
                        </div>
                      )}

                      {selectedProvider.lastTested && (
                        <div className="text-xs text-muted-foreground">
                          Last tested: {selectedProvider.lastTested}
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium mb-2">Select a Provider</h3>
                    <p className="text-sm text-muted-foreground">
                      Choose a provider from the list to configure and test
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProvidersPage;
