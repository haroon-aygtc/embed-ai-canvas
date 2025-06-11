
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Code, Play, Save, Plus, X, CheckCircle, AlertCircle,
  Key, Clock, Zap, Shield
} from 'lucide-react';

export const ApiSourcePage = () => {
  const { toast } = useToast();
  const [apiConfig, setApiConfig] = useState({
    name: '',
    baseUrl: '',
    method: 'GET',
    authType: 'none',
    apiKey: '',
    bearerToken: '',
    username: '',
    password: '',
    headers: [{ key: '', value: '' }],
    queryParams: [{ key: '', value: '' }],
    requestBody: '',
    responseFormat: 'json'
  });
  const [testResults, setTestResults] = useState(null);
  const [isTesting, setIsTesting] = useState(false);

  const authTypes = [
    { value: 'none', label: 'No Authentication' },
    { value: 'apikey', label: 'API Key' },
    { value: 'bearer', label: 'Bearer Token' },
    { value: 'basic', label: 'Basic Auth' }
  ];

  const httpMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

  const addHeader = () => {
    setApiConfig(prev => ({
      ...prev,
      headers: [...prev.headers, { key: '', value: '' }]
    }));
  };

  const removeHeader = (index: number) => {
    setApiConfig(prev => ({
      ...prev,
      headers: prev.headers.filter((_, i) => i !== index)
    }));
  };

  const updateHeader = (index: number, field: 'key' | 'value', value: string) => {
    setApiConfig(prev => ({
      ...prev,
      headers: prev.headers.map((header, i) => 
        i === index ? { ...header, [field]: value } : header
      )
    }));
  };

  const addQueryParam = () => {
    setApiConfig(prev => ({
      ...prev,
      queryParams: [...prev.queryParams, { key: '', value: '' }]
    }));
  };

  const removeQueryParam = (index: number) => {
    setApiConfig(prev => ({
      ...prev,
      queryParams: prev.queryParams.filter((_, i) => i !== index)
    }));
  };

  const updateQueryParam = (index: number, field: 'key' | 'value', value: string) => {
    setApiConfig(prev => ({
      ...prev,
      queryParams: prev.queryParams.map((param, i) => 
        i === index ? { ...param, [field]: value } : param
      )
    }));
  };

  const handleTestApi = async () => {
    setIsTesting(true);
    try {
      // Simulate API test
      await new Promise(resolve => setTimeout(resolve, 1500));
      setTestResults({
        status: 'success',
        statusCode: 200,
        responseTime: 245,
        dataPreview: {
          users: [
            { id: 1, name: 'John Doe', email: 'john@example.com' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
          ]
        },
        recordCount: 150
      });
      toast({
        title: "API Test Successful",
        description: "API endpoint responded successfully",
      });
    } catch (error) {
      setTestResults({
        status: 'error',
        statusCode: 401,
        message: 'Unauthorized: Invalid API key'
      });
      toast({
        title: "API Test Failed",
        description: "Failed to connect to API endpoint",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    toast({
      title: "API Source Saved",
      description: "Your API configuration has been saved to the knowledge base",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="API Source"
          description="Connect external APIs as knowledge sources"
          icon={Code}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* API Configuration */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  API Configuration
                </CardTitle>
                <CardDescription>
                  Configure your API endpoint and authentication
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">API Source Name</Label>
                    <Input
                      id="name"
                      placeholder="My API"
                      value={apiConfig.name}
                      onChange={(e) => setApiConfig(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="method">HTTP Method</Label>
                    <Select value={apiConfig.method} onValueChange={(value) => setApiConfig(prev => ({ ...prev, method: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {httpMethods.map((method) => (
                          <SelectItem key={method} value={method}>
                            {method}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="baseUrl">Base URL</Label>
                  <Input
                    id="baseUrl"
                    placeholder="https://api.example.com/v1/data"
                    value={apiConfig.baseUrl}
                    onChange={(e) => setApiConfig(prev => ({ ...prev, baseUrl: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="authType">Authentication</Label>
                  <Select value={apiConfig.authType} onValueChange={(value) => setApiConfig(prev => ({ ...prev, authType: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {authTypes.map((auth) => (
                        <SelectItem key={auth.value} value={auth.value}>
                          {auth.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {apiConfig.authType === 'apikey' && (
                  <div className="space-y-2">
                    <Label htmlFor="apiKey">API Key</Label>
                    <Input
                      id="apiKey"
                      type="password"
                      placeholder="your-api-key"
                      value={apiConfig.apiKey}
                      onChange={(e) => setApiConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                    />
                  </div>
                )}

                {apiConfig.authType === 'bearer' && (
                  <div className="space-y-2">
                    <Label htmlFor="bearerToken">Bearer Token</Label>
                    <Input
                      id="bearerToken"
                      type="password"
                      placeholder="your-bearer-token"
                      value={apiConfig.bearerToken}
                      onChange={(e) => setApiConfig(prev => ({ ...prev, bearerToken: e.target.value }))}
                    />
                  </div>
                )}

                {apiConfig.authType === 'basic' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        placeholder="username"
                        value={apiConfig.username}
                        onChange={(e) => setApiConfig(prev => ({ ...prev, username: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="password"
                        value={apiConfig.password}
                        onChange={(e) => setApiConfig(prev => ({ ...prev, password: e.target.value }))}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Headers</Label>
                    <Button variant="outline" size="sm" onClick={addHeader}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Header
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {apiConfig.headers.map((header, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="Header Key"
                          value={header.key}
                          onChange={(e) => updateHeader(index, 'key', e.target.value)}
                        />
                        <Input
                          placeholder="Header Value"
                          value={header.value}
                          onChange={(e) => updateHeader(index, 'value', e.target.value)}
                        />
                        <Button variant="outline" size="sm" onClick={() => removeHeader(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Query Parameters</Label>
                    <Button variant="outline" size="sm" onClick={addQueryParam}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Param
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {apiConfig.queryParams.map((param, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="Parameter Key"
                          value={param.key}
                          onChange={(e) => updateQueryParam(index, 'key', e.target.value)}
                        />
                        <Input
                          placeholder="Parameter Value"
                          value={param.value}
                          onChange={(e) => updateQueryParam(index, 'value', e.target.value)}
                        />
                        <Button variant="outline" size="sm" onClick={() => removeQueryParam(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {(apiConfig.method === 'POST' || apiConfig.method === 'PUT' || apiConfig.method === 'PATCH') && (
                  <div className="space-y-2">
                    <Label htmlFor="requestBody">Request Body (JSON)</Label>
                    <Textarea
                      id="requestBody"
                      placeholder='{"key": "value"}'
                      value={apiConfig.requestBody}
                      onChange={(e) => setApiConfig(prev => ({ ...prev, requestBody: e.target.value }))}
                      rows={4}
                    />
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleTestApi}
                    disabled={isTesting}
                    variant="outline"
                    className="flex-1"
                  >
                    {isTesting ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Test API
                      </>
                    )}
                  </Button>
                  <Button onClick={handleSave} className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    Save Configuration
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Test Results & Info */}
          <div className="space-y-6">
            {testResults && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {testResults.status === 'success' ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    )}
                    API Test Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Status Code:</span>
                      <Badge variant={testResults.status === 'success' ? 'default' : 'destructive'}>
                        {testResults.statusCode}
                      </Badge>
                    </div>
                    {testResults.status === 'success' && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span>Response Time:</span>
                          <span>{testResults.responseTime}ms</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Records Found:</span>
                          <span>{testResults.recordCount}</span>
                        </div>
                        <div className="mt-3">
                          <p className="text-xs text-muted-foreground mb-2">Data Preview:</p>
                          <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-32">
                            {JSON.stringify(testResults.dataPreview, null, 2)}
                          </pre>
                        </div>
                      </>
                    )}
                    {testResults.status === 'error' && (
                      <p className="text-sm text-red-600">{testResults.message}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security & Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <Key className="h-4 w-4 mt-0.5 text-yellow-600" />
                  <span>API keys are encrypted and stored securely</span>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 mt-0.5 text-blue-600" />
                  <span>Data is fetched and cached for 1 hour</span>
                </div>
                <div className="flex items-start gap-2">
                  <Zap className="h-4 w-4 mt-0.5 text-green-600" />
                  <span>Supports pagination and rate limiting</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
