
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, TestTube, Star, Settings, Zap } from 'lucide-react';

interface Model {
  id: string;
  name: string;
  provider: string;
  type: 'chat' | 'completion' | 'embedding';
  status: 'active' | 'inactive';
  isDefault: boolean;
  maxTokens: number;
  costPer1k: number;
  description: string;
}

const mockModels: Model[] = [
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
    type: 'chat',
    status: 'active',
    isDefault: true,
    maxTokens: 128000,
    costPer1k: 0.03,
    description: 'Most capable GPT-4 model with enhanced speed and context length'
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'OpenAI',
    type: 'chat',
    status: 'active',
    isDefault: false,
    maxTokens: 16385,
    costPer1k: 0.002,
    description: 'Fast and cost-effective model for most conversational tasks'
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    type: 'chat',
    status: 'active',
    isDefault: false,
    maxTokens: 200000,
    costPer1k: 0.075,
    description: 'Most powerful Claude model with superior reasoning capabilities'
  },
  {
    id: 'claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    provider: 'Anthropic',
    type: 'chat',
    status: 'inactive',
    isDefault: false,
    maxTokens: 200000,
    costPer1k: 0.015,
    description: 'Balanced model offering speed and intelligence'
  },
  {
    id: 'llama-3-70b',
    name: 'Llama 3 70B',
    provider: 'Groq',
    type: 'chat',
    status: 'active',
    isDefault: false,
    maxTokens: 8192,
    costPer1k: 0.001,
    description: 'High-performance open-source model with excellent reasoning'
  }
];

const ModelsPage = () => {
  const [models, setModels] = useState<Model[]>(mockModels);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [testPrompt, setTestPrompt] = useState('Explain quantum computing in simple terms.');
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [isTestingModel, setIsTestingModel] = useState(false);
  const [filterProvider, setFilterProvider] = useState('all');

  const providers = ['all', ...Array.from(new Set(models.map(m => m.provider)))];
  const filteredModels = filterProvider === 'all' 
    ? models 
    : models.filter(m => m.provider === filterProvider);

  const handleTestModel = async (model: Model) => {
    setIsTestingModel(true);
    setSelectedModel(model);
    
    // Simulate API call
    setTimeout(() => {
      const mockResponses = {
        'gpt-4-turbo': 'Quantum computing is like having a super-powered computer that can solve certain problems much faster than regular computers...',
        'claude-3-opus': 'Quantum computing represents a revolutionary approach to information processing that leverages quantum mechanical phenomena...',
        'llama-3-70b': 'Think of quantum computing as a new type of computer that uses the strange rules of quantum physics to process information...'
      };
      
      setTestResponse(mockResponses[model.id as keyof typeof mockResponses] || 'This is a sample response from the AI model. The model is working correctly and can process your requests.');
      setIsTestingModel(false);
    }, 2500);
  };

  const toggleModelStatus = (modelId: string) => {
    setModels(models.map(model => 
      model.id === modelId 
        ? { ...model, status: model.status === 'active' ? 'inactive' : 'active' as 'active' | 'inactive' }
        : model
    ));
  };

  const setDefaultModel = (modelId: string) => {
    setModels(models.map(model => ({
      ...model,
      isDefault: model.id === modelId
    })));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Model Management</h1>
            <p className="text-muted-foreground">Configure and test AI models from your providers</p>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={filterProvider} onValueChange={setFilterProvider}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {providers.map(provider => (
                  <SelectItem key={provider} value={provider}>
                    {provider === 'all' ? 'All Providers' : provider}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline">Refresh Models</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredModels.map((model) => (
                <Card key={model.id} className="relative">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg flex items-center space-x-2">
                          <span>{model.name}</span>
                          {model.isDefault && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
                        </CardTitle>
                        <CardDescription>{model.provider}</CardDescription>
                      </div>
                      <Badge variant={model.status === 'active' ? 'default' : 'secondary'}>
                        {model.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{model.description}</p>
                    
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span>Max Tokens:</span>
                        <span className="font-mono">{model.maxTokens.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cost per 1K tokens:</span>
                        <span className="font-mono">${model.costPer1k}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={model.status === 'active'}
                          onCheckedChange={() => toggleModelStatus(model.id)}
                        />
                        <span className="text-sm">Active</span>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDefaultModel(model.id)}
                          disabled={model.isDefault}
                        >
                          {model.isDefault ? 'Default' : 'Set Default'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTestModel(model)}
                          disabled={model.status === 'inactive'}
                        >
                          <TestTube className="h-3 w-3 mr-1" />
                          Test
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="xl:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TestTube className="h-5 w-5" />
                  <span>Model Testing</span>
                </CardTitle>
                <CardDescription>
                  Test AI models with custom prompts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedModel && (
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Database className="h-4 w-4" />
                      <span className="font-medium">{selectedModel.name}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Provider: {selectedModel.provider}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="testPrompt">Test Prompt</Label>
                  <Textarea
                    id="testPrompt"
                    value={testPrompt}
                    onChange={(e) => setTestPrompt(e.target.value)}
                    placeholder="Enter your test prompt here..."
                    rows={4}
                  />
                </div>

                <Button 
                  className="w-full"
                  disabled={!selectedModel || isTestingModel}
                  onClick={() => selectedModel && handleTestModel(selectedModel)}
                >
                  {isTestingModel ? 'Testing Model...' : 'Test Model'}
                </Button>

                {testResponse && (
                  <div className="space-y-2">
                    <Label>Response</Label>
                    <div className="p-3 bg-muted rounded-lg max-h-64 overflow-y-auto">
                      <p className="text-sm">{testResponse}</p>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Quick Stats</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Active Models:</span>
                      <span>{models.filter(m => m.status === 'active').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Models:</span>
                      <span>{models.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Providers:</span>
                      <span>{providers.length - 1}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ModelsPage;
