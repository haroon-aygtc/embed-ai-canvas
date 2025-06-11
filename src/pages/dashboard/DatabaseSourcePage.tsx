
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
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import {
  Database, TestTube, Save, RefreshCw, CheckCircle, AlertCircle,
  Settings, Shield, Clock, Zap
} from 'lucide-react';

export const DatabaseSourcePage = () => {
  const { toast } = useToast();
  const [connectionData, setConnectionData] = useState({
    name: '',
    type: '',
    host: '',
    port: '',
    database: '',
    username: '',
    password: '',
    ssl: false,
    testQuery: 'SELECT 1'
  });
  const [testResults, setTestResults] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const databaseTypes = [
    { value: 'postgresql', label: 'PostgreSQL', port: '5432' },
    { value: 'mysql', label: 'MySQL', port: '3306' },
    { value: 'mongodb', label: 'MongoDB', port: '27017' },
    { value: 'sqlserver', label: 'SQL Server', port: '1433' },
    { value: 'oracle', label: 'Oracle', port: '1521' },
    { value: 'sqlite', label: 'SQLite', port: '' }
  ];

  const handleTypeChange = (type: string) => {
    const dbType = databaseTypes.find(db => db.value === type);
    setConnectionData(prev => ({
      ...prev,
      type,
      port: dbType?.port || ''
    }));
  };

  const handleTestConnection = async () => {
    setIsConnecting(true);
    try {
      // Simulate connection test
      await new Promise(resolve => setTimeout(resolve, 2000));
      setTestResults({
        status: 'success',
        message: 'Connection successful',
        tables: ['users', 'products', 'orders', 'categories'],
        recordCount: 15420
      });
      toast({
        title: "Connection Successful",
        description: "Database connection has been established successfully",
      });
    } catch (error) {
      setTestResults({
        status: 'error',
        message: 'Connection failed: Invalid credentials'
      });
      toast({
        title: "Connection Failed",
        description: "Failed to connect to database",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSave = () => {
    toast({
      title: "Database Source Saved",
      description: "Your database connection has been saved to the knowledge base",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Database Source"
          description="Connect your database as a knowledge source"
          icon={Database}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Connection Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Database Connection
                </CardTitle>
                <CardDescription>
                  Configure your database connection settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Connection Name</Label>
                    <Input
                      id="name"
                      placeholder="My Database"
                      value={connectionData.name}
                      onChange={(e) => setConnectionData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Database Type</Label>
                    <Select value={connectionData.type} onValueChange={handleTypeChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select database type" />
                      </SelectTrigger>
                      <SelectContent>
                        {databaseTypes.map((db) => (
                          <SelectItem key={db.value} value={db.value}>
                            {db.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="host">Host</Label>
                    <Input
                      id="host"
                      placeholder="localhost or your-db-host.com"
                      value={connectionData.host}
                      onChange={(e) => setConnectionData(prev => ({ ...prev, host: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="port">Port</Label>
                    <Input
                      id="port"
                      placeholder="5432"
                      value={connectionData.port}
                      onChange={(e) => setConnectionData(prev => ({ ...prev, port: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="database">Database Name</Label>
                  <Input
                    id="database"
                    placeholder="my_database"
                    value={connectionData.database}
                    onChange={(e) => setConnectionData(prev => ({ ...prev, database: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      placeholder="username"
                      value={connectionData.username}
                      onChange={(e) => setConnectionData(prev => ({ ...prev, username: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="password"
                      value={connectionData.password}
                      onChange={(e) => setConnectionData(prev => ({ ...prev, password: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="testQuery">Test Query</Label>
                  <Textarea
                    id="testQuery"
                    placeholder="SELECT * FROM users LIMIT 10"
                    value={connectionData.testQuery}
                    onChange={(e) => setConnectionData(prev => ({ ...prev, testQuery: e.target.value }))}
                    rows={3}
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
                  <span className="text-sm">SSL Connection</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Enabled
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Query Timeout</span>
                  <span className="text-sm text-muted-foreground">30s</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Connection Pool</span>
                  <span className="text-sm text-muted-foreground">5 max</span>
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
                        <span>Tables Found:</span>
                        <span>{testResults.tables.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Total Records:</span>
                        <span>{testResults.recordCount.toLocaleString()}</span>
                      </div>
                      <div className="mt-3">
                        <p className="text-xs text-muted-foreground mb-2">Available Tables:</p>
                        <div className="flex flex-wrap gap-1">
                          {testResults.tables.map((table) => (
                            <Badge key={table} variant="secondary" className="text-xs">
                              {table}
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
                  <span>Use read-only credentials for security</span>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 mt-0.5 text-blue-600" />
                  <span>Data is synced every 24 hours</span>
                </div>
                <div className="flex items-start gap-2">
                  <Shield className="h-4 w-4 mt-0.5 text-green-600" />
                  <span>Connections are encrypted and secure</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
