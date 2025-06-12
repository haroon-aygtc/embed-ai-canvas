
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Globe, TestTube, Save, RefreshCw, CheckCircle, AlertCircle,
  Settings, Shield, Clock, Zap
} from 'lucide-react';

export const ApiSourcePage = () => {
  const { toast } = useToast();
  const [apiData, setApiData] = useState({
    name: '',
    url: '',
    method: 'GET',
    headers: '',
    body: '',
    responseFormat: 'JSON',
    testEndpoint: '/users/1'
  });
  const [testResults, setTestResults] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleTestConnection = async () => {
    setIsConnecting(true);
    try {
      // Simulate API connection test
      await new Promise(resolve => setTimeout(resolve, 2000));
      setTestResults({
        status: 'success',
        message: 'API connection successful',
        dataFields: ['id', 'name', 'email', 'phone'],
        recordCount: 1
      });
      toast({
        title: "Connection Successful",
        description: "API connection has been established successfully",
      });
    } catch (error) {
      setTestResults({
        status: 'error',
        message: 'Connection failed: Invalid API endpoint'
      });
      toast({
        title: "Connection Failed",
        description: "Failed to connect to API",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSave = () => {
    toast({
      title: "API Source Saved",
      description: "Your API connection has been saved to the knowledge base",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="API Source"
          description="Connect external APIs as knowledge sources"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Connection Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  API Connection
                </CardTitle>
                <CardDescription>
                  Configure your API connection settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Connection Name</Label>
                    <Input
                      id="name"
                      placeholder="My API"
                      value={apiData.name}
                      onChange={(e) => setApiData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="url">API Endpoint URL</Label>
                    <Input
                      id="url"
                      type="url"
                      placeholder="https://api.example.com"
                      value={apiData.url}
                      onChange={(e) => setApiData(prev => ({ ...prev, url: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="method">Method</Label>
                    <Input
                      id="method"
                      placeholder="GET"
                      value={apiData.method}
                      onChange={(e) => setApiData(prev => ({ ...prev, method: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="responseFormat">Response Format</Label>
                    <Input
                      id="responseFormat"
                      placeholder="JSON"
                      value={apiData.responseFormat}
                      onChange={(e) => setApiData(prev => ({ ...prev, responseFormat: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="headers">Headers (JSON)</Label>
                  <Textarea
                    id="headers"
                    placeholder='{"Content-Type": "application/json"}'
                    value={apiData.headers}
                    onChange={(e) => setApiData(prev => ({ ...prev, headers: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="body">Body (JSON)</Label>
                  <Textarea
                    id="body"
                    placeholder='{"key": "value"}'
                    value={apiData.body}
                    onChange={(e) => setApiData(prev => ({ ...prev, body: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="testEndpoint">Test Endpoint</Label>
                  <Input
                    id="testEndpoint"
                    placeholder="/users/1"
                    value={apiData.testEndpoint}
                    onChange={(e) => setApiData(prev => ({ ...prev, testEndpoint: e.target.value }))}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleTestConnection}
                    disabled={isConnecting}
                    variant="outline"
                    className="flex-1"
                  >
                    {isConnecting ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      <>
                        <TestTube className="h-4 w-4 mr-2" />
                        Test Connection
                      </>
                    )}
                  </Button>
                  <Button onClick={handleSave} className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    Save Connection
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Test Results & Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security & Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">API Key Encryption</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Enabled
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Request Timeout</span>
                  <span className="text-sm text-muted-foreground">15s</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Rate Limiting</span>
                  <span className="text-sm text-muted-foreground">100/min</span>
                </div>
              </CardContent>
            </Card>

            {testResults && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {testResults.status === 'success' ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    )}
                    Connection Test
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-3">{testResults.message}</p>
                  {testResults.status === 'success' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Data Fields Found:</span>
                        <span>{testResults.dataFields.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Total Records:</span>
                        <span>{testResults.recordCount.toLocaleString()}</span>
                      </div>
                      <div className="mt-3">
                        <p className="text-xs text-muted-foreground mb-2">Available Fields:</p>
                        <div className="flex flex-wrap gap-1">
                          {testResults.dataFields.map((field) => (
                            <Badge key={field} variant="secondary" className="text-xs">
                              {field}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Quick Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <Zap className="h-4 w-4 mt-0.5 text-yellow-600" />
                  <span>Use environment variables for API keys</span>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 mt-0.5 text-blue-600" />
                  <span>Data is synced every 12 hours</span>
                </div>
                <div className="flex items-start gap-2">
                  <Shield className="h-4 w-4 mt-0.5 text-green-600" />
                  <span>Connections are securely managed</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
