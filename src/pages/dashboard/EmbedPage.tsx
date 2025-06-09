
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Check, Code, Monitor, TestTube, Eye, Settings } from 'lucide-react';
import { WidgetConfig } from '@/components/widget/WidgetConfiguration';
import { EmbedCodeGenerator } from '@/components/embed/EmbedCodeGenerator';

const defaultConfig: WidgetConfig = {
  theme: 'light',
  primaryColor: '#3b82f6',
  position: 'bottom-right',
  size: 'medium',
  welcomeMessage: 'Hello! How can I help you today?',
  placeholder: 'Type your message...',
  title: 'AI Assistant',
  subtitle: 'Powered by ChatWidget Pro',
  enabled: true,
  showBranding: true,
};

const testEnvironments = [
  { id: 'simple', name: 'Simple Landing Page', description: 'Basic HTML page with minimal styling' },
  { id: 'ecommerce', name: 'E-commerce Site', description: 'Complex layout with shopping cart and products' },
  { id: 'blog', name: 'Blog Website', description: 'Content-heavy site with sidebar and articles' },
  { id: 'dashboard', name: 'Admin Dashboard', description: 'Data-heavy interface with charts and tables' },
  { id: 'mobile', name: 'Mobile View', description: 'Responsive mobile layout testing' }
];

const EmbedPage = () => {
  const [config] = useState<WidgetConfig>(defaultConfig);
  const [copied, setCopied] = useState(false);
  const [selectedEnvironment, setSelectedEnvironment] = useState('simple');
  const [isTestingWidget, setIsTestingWidget] = useState(false);
  const [testResults, setTestResults] = useState<{environment: string, success: boolean, message: string}[]>([]);

  const generateEmbedCode = () => {
    const configJson = JSON.stringify(config, null, 2);
    return `<!-- ChatWidget Pro Embed Code -->
<script>
  window.ChatWidgetConfig = ${configJson};
  (function() {
    var script = document.createElement('script');
    script.src = 'https://widget.chatwidgetpro.com/embed.js';
    script.async = true;
    script.onload = function() {
      console.log('ChatWidget Pro loaded successfully');
    };
    script.onerror = function() {
      console.error('Failed to load ChatWidget Pro');
    };
    document.head.appendChild(script);
  })();
</script>`;
  };

  const generateReactCode = () => {
    return `import React, { useEffect } from 'react';

const ChatWidget = () => {
  useEffect(() => {
    // Set widget configuration
    window.ChatWidgetConfig = ${JSON.stringify(config, null, 6)};
    
    // Load widget script
    const script = document.createElement('script');
    script.src = 'https://widget.chatwidgetpro.com/embed.js';
    script.async = true;
    document.head.appendChild(script);
    
    return () => {
      // Cleanup on unmount
      const existingScript = document.querySelector('script[src*="chatwidgetpro"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return null; // Widget renders itself
};

export default ChatWidget;`;
  };

  const generateVueCode = () => {
    return `<template>
  <!-- Widget will render automatically -->
</template>

<script>
export default {
  name: 'ChatWidget',
  mounted() {
    // Set widget configuration
    window.ChatWidgetConfig = ${JSON.stringify(config, null, 6)};
    
    // Load widget script
    const script = document.createElement('script');
    script.src = 'https://widget.chatwidgetpro.com/embed.js';
    script.async = true;
    document.head.appendChild(script);
  },
  beforeDestroy() {
    // Cleanup
    const existingScript = document.querySelector('script[src*="chatwidgetpro"]');
    if (existingScript) {
      existingScript.remove();
    }
  }
}
</script>`;
  };

  const embedCode = generateEmbedCode();

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const runWidgetTest = async () => {
    setIsTestingWidget(true);
    
    // Simulate testing across different environments
    const results = [];
    for (const env of testEnvironments) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const success = Math.random() > 0.1; // 90% success rate
      results.push({
        environment: env.name,
        success,
        message: success 
          ? `Widget loaded successfully in ${env.name} environment`
          : `Widget failed to load in ${env.name} - CSS conflict detected`
      });
    }
    
    setTestResults(results);
    setIsTestingWidget(false);
  };

  const getEnvironmentPreview = (envId: string) => {
    const previews = {
      simple: 'Clean white background with centered content',
      ecommerce: 'Header with navigation, product grid, and footer',
      blog: 'Article layout with sidebar and comment section',
      dashboard: 'Dark theme with charts, tables, and metrics',
      mobile: 'Mobile-first responsive design'
    };
    return previews[envId as keyof typeof previews] || 'Standard layout';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Embed Code & Testing</h1>
          <p className="text-muted-foreground">Generate embed code and test your widget across different environments</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <Tabs defaultValue="html" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="html">HTML</TabsTrigger>
                <TabsTrigger value="react">React</TabsTrigger>
                <TabsTrigger value="vue">Vue</TabsTrigger>
                <TabsTrigger value="test">Testing</TabsTrigger>
              </TabsList>

              <TabsContent value="html" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Code className="h-5 w-5" />
                      <span>HTML Embed Code</span>
                    </CardTitle>
                    <CardDescription>
                      Copy this code and paste it before the closing &lt;/body&gt; tag
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative">
                      <Textarea
                        value={embedCode}
                        readOnly
                        className="font-mono text-sm min-h-[300px] resize-none"
                      />
                      <Button
                        onClick={() => copyToClipboard(embedCode)}
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2"
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copied ? 'Copied!' : 'Copy'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="react" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Code className="h-5 w-5" />
                      <span>React Component</span>
                    </CardTitle>
                    <CardDescription>
                      Use this React component in your application
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <Textarea
                        value={generateReactCode()}
                        readOnly
                        className="font-mono text-sm min-h-[300px] resize-none"
                      />
                      <Button
                        onClick={() => copyToClipboard(generateReactCode())}
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2"
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copied ? 'Copied!' : 'Copy'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="vue" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Code className="h-5 w-5" />
                      <span>Vue Component</span>
                    </CardTitle>
                    <CardDescription>
                      Use this Vue component in your application
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <Textarea
                        value={generateVueCode()}
                        readOnly
                        className="font-mono text-sm min-h-[300px] resize-none"
                      />
                      <Button
                        onClick={() => copyToClipboard(generateVueCode())}
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2"
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copied ? 'Copied!' : 'Copy'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="test" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TestTube className="h-5 w-5" />
                      <span>Widget Testing</span>
                    </CardTitle>
                    <CardDescription>
                      Test your widget across different website environments
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Test Environment</label>
                      <Select value={selectedEnvironment} onValueChange={setSelectedEnvironment}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {testEnvironments.map(env => (
                            <SelectItem key={env.id} value={env.id}>
                              {env.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        {getEnvironmentPreview(selectedEnvironment)}
                      </p>
                    </div>

                    <Button 
                      onClick={runWidgetTest}
                      disabled={isTestingWidget}
                      className="w-full"
                    >
                      {isTestingWidget ? 'Running Tests...' : 'Run Widget Tests'}
                    </Button>

                    {testResults.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium">Test Results:</h4>
                        {testResults.map((result, index) => (
                          <div key={index} className="flex items-center justify-between p-2 border rounded">
                            <span className="text-sm">{result.environment}</span>
                            <Badge variant={result.success ? 'default' : 'destructive'}>
                              {result.success ? 'Pass' : 'Fail'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="xl:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Monitor className="h-5 w-5" />
                  <span>Live Preview</span>
                </CardTitle>
                <CardDescription>
                  See how your widget will appear
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4 bg-muted/20 min-h-[200px] relative">
                  <div className="absolute bottom-4 right-4">
                    <div className="bg-primary text-primary-foreground p-3 rounded-lg shadow-lg max-w-xs">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{config.title}</span>
                        <button className="text-xs opacity-70">×</button>
                      </div>
                      <p className="text-xs mb-2">{config.subtitle}</p>
                      <div className="bg-background text-foreground p-2 rounded text-xs">
                        {config.welcomeMessage}
                      </div>
                      <div className="mt-2 flex">
                        <input 
                          placeholder={config.placeholder}
                          className="flex-1 text-xs p-1 rounded border bg-background"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-center text-muted-foreground mt-8">
                    <Eye className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">Widget Preview</p>
                    <p className="text-xs">Position: {config.position}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Integration Guide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="space-y-1">
                  <h4 className="font-medium">Step 1: Copy Code</h4>
                  <p className="text-muted-foreground">Select your preferred integration method and copy the code</p>
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium">Step 2: Add to Website</h4>
                  <p className="text-muted-foreground">Paste the code into your website before the closing &lt;/body&gt; tag</p>
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium">Step 3: Test</h4>
                  <p className="text-muted-foreground">Use our testing tools to verify the widget works correctly</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EmbedPage;
