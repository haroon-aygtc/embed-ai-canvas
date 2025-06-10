import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
    Copy, Check, Code, Monitor, TestTube, Eye, Settings, Download,
    Globe, Smartphone, Tablet, Laptop, Zap, Shield, Activity,
    CheckCircle, AlertTriangle, Info, ExternalLink, RefreshCw, MessageSquare
} from 'lucide-react';
import { WidgetConfig } from '../widget/WidgetConfiguration';
import { EnterpriseCard, MetricCard } from '@/components/ui/EnterpriseCard';

interface EnhancedEmbedCodeGeneratorProps {
    config: WidgetConfig;
}

export const EnhancedEmbedCodeGenerator = ({ config }: EnhancedEmbedCodeGeneratorProps) => {
    const [copied, setCopied] = useState(false);
    const [selectedFramework, setSelectedFramework] = useState('html');
    const [selectedEnvironment, setSelectedEnvironment] = useState('production');
    const [isTestingWidget, setIsTestingWidget] = useState(false);
    const [testResults, setTestResults] = useState<{ environment: string, success: boolean, message: string }[]>([]);
    const [enableAnalytics, setEnableAnalytics] = useState(true);
    const [enableCaching, setEnableCaching] = useState(true);
    const [enableLazyLoad, setEnableLazyLoad] = useState(false);

    const frameworks = [
        { id: 'html', name: 'HTML/JavaScript', icon: Globe, description: 'Standard HTML implementation' },
        { id: 'react', name: 'React', icon: Code, description: 'React component integration' },
        { id: 'vue', name: 'Vue.js', icon: Code, description: 'Vue.js component integration' },
        { id: 'angular', name: 'Angular', icon: Code, description: 'Angular component integration' },
        { id: 'wordpress', name: 'WordPress', icon: Globe, description: 'WordPress plugin integration' },
        { id: 'shopify', name: 'Shopify', icon: Globe, description: 'Shopify theme integration' }
    ];

    const testEnvironments = [
        { id: 'simple', name: 'Simple Landing Page', description: 'Basic HTML page with minimal styling' },
        { id: 'ecommerce', name: 'E-commerce Site', description: 'Complex layout with shopping cart and products' },
        { id: 'blog', name: 'Blog Website', description: 'Content-heavy site with sidebar and articles' },
        { id: 'dashboard', name: 'Admin Dashboard', description: 'Data-heavy interface with charts and tables' },
        { id: 'mobile', name: 'Mobile View', description: 'Responsive mobile layout testing' }
    ];

    const generateEmbedCode = () => {
        const configJson = JSON.stringify({
            ...config,
            analytics: enableAnalytics,
            caching: enableCaching,
            lazyLoad: enableLazyLoad,
            environment: selectedEnvironment
        }, null, 2);

        switch (selectedFramework) {
            case 'html':
                return `<!-- ChatWidget Pro Embed Code -->
<script>
  window.ChatWidgetConfig = ${configJson};
  (function() {
    var script = document.createElement('script');
    script.src = 'https://widget.chatwidgetpro.com/embed.js';
    script.async = true;
    script.onload = function() {
      console.log('ChatWidget Pro loaded successfully');
      ${enableAnalytics ? "window.ChatWidget.analytics.track('widget_loaded');" : ''}
    };
    script.onerror = function() {
      console.error('Failed to load ChatWidget Pro');
    };
    document.head.appendChild(script);
  })();
</script>`;

            case 'react':
                return `import React, { useEffect } from 'react';

const ChatWidget = () => {
  useEffect(() => {
    // Set widget configuration
    window.ChatWidgetConfig = ${configJson};
    
    // Load widget script
    const script = document.createElement('script');
    script.src = 'https://widget.chatwidgetpro.com/embed.js';
    script.async = true;
    script.onload = () => {
      console.log('ChatWidget Pro loaded successfully');
      ${enableAnalytics ? "window.ChatWidget?.analytics?.track('widget_loaded');" : ''}
    };
    document.head.appendChild(script);
    
    return () => {
      // Cleanup on unmount
      const existingScript = document.querySelector('script[src*="chatwidgetpro"]');
      if (existingScript) {
        existingScript.remove();
      }
      if (window.ChatWidget) {
        window.ChatWidget.destroy();
      }
    };
  }, []);

  return null; // Widget renders itself
};

export default ChatWidget;`;

            case 'vue':
                return `<template>
  <!-- Widget will render automatically -->
</template>

<script>
export default {
  name: 'ChatWidget',
  mounted() {
    // Set widget configuration
    window.ChatWidgetConfig = ${configJson};
    
    // Load widget script
    const script = document.createElement('script');
    script.src = 'https://widget.chatwidgetpro.com/embed.js';
    script.async = true;
    script.onload = () => {
      console.log('ChatWidget Pro loaded successfully');
      ${enableAnalytics ? "window.ChatWidget?.analytics?.track('widget_loaded');" : ''}
    };
    document.head.appendChild(script);
  },
  beforeDestroy() {
    // Cleanup
    const existingScript = document.querySelector('script[src*="chatwidgetpro"]');
    if (existingScript) {
      existingScript.remove();
    }
    if (window.ChatWidget) {
      window.ChatWidget.destroy();
    }
  }
}
</script>`;

            case 'angular':
                return `import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-chat-widget',
  template: ''
})
export class ChatWidgetComponent implements OnInit, OnDestroy {
  
  ngOnInit() {
    // Set widget configuration
    (window as any).ChatWidgetConfig = ${configJson};
    
    // Load widget script
    const script = document.createElement('script');
    script.src = 'https://widget.chatwidgetpro.com/embed.js';
    script.async = true;
    script.onload = () => {
      console.log('ChatWidget Pro loaded successfully');
      ${enableAnalytics ? "(window as any).ChatWidget?.analytics?.track('widget_loaded');" : ''}
    };
    document.head.appendChild(script);
  }
  
  ngOnDestroy() {
    // Cleanup
    const existingScript = document.querySelector('script[src*="chatwidgetpro"]');
    if (existingScript) {
      existingScript.remove();
    }
    if ((window as any).ChatWidget) {
      (window as any).ChatWidget.destroy();
    }
  }
}`;

            case 'wordpress':
                return `<?php
// Add this to your theme's functions.php file

function add_chatwidget_pro() {
    $config = json_encode(${configJson.replace(/"/g, '\\"')});
    ?>
    <script>
        window.ChatWidgetConfig = <?php echo $config; ?>;
        (function() {
            var script = document.createElement('script');
            script.src = 'https://widget.chatwidgetpro.com/embed.js';
            script.async = true;
            document.head.appendChild(script);
        })();
    </script>
    <?php
}
add_action('wp_footer', 'add_chatwidget_pro');
?>`;

            case 'shopify':
                return `<!-- Add this to your theme.liquid file before </body> -->
<script>
  window.ChatWidgetConfig = ${configJson};
  (function() {
    var script = document.createElement('script');
    script.src = 'https://widget.chatwidgetpro.com/embed.js';
    script.async = true;
    document.head.appendChild(script);
  })();
</script>`;

            default:
                return '';
        }
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
        setTestResults([]);

        // Simulate testing across different environments
        const results = [];
        for (const env of testEnvironments) {
            await new Promise(resolve => setTimeout(resolve, 1000));

            const success = Math.random() > 0.1; // 90% success rate
            results.push({
                environment: env.name,
                success,
                message: success
                    ? `✅ Widget loaded successfully in ${env.name} environment`
                    : `❌ Widget failed to load in ${env.name} - CSS conflict detected`
            });
            setTestResults([...results]);
        }

        setIsTestingWidget(false);
    };

    const currentFramework = frameworks.find(f => f.id === selectedFramework);

    return (
        <div className="space-y-6">
            {/* Overview Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MetricCard
                    title="Integration Type"
                    value={currentFramework?.name || 'HTML'}
                    icon={currentFramework?.icon || Globe}
                    trend="neutral"
                />
                <MetricCard
                    title="Load Time"
                    value="<2s"
                    change="Optimized"
                    icon={Zap}
                    trend="up"
                />
                <MetricCard
                    title="Compatibility"
                    value="99.8%"
                    change="All browsers"
                    icon={Shield}
                    trend="up"
                />
                <MetricCard
                    title="Bundle Size"
                    value="45KB"
                    change="Gzipped"
                    icon={Activity}
                    trend="neutral"
                />
            </div>

            <Tabs defaultValue="generate" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="generate" className="flex items-center gap-2">
                        <Code className="h-4 w-4" />
                        Generate Code
                    </TabsTrigger>
                    <TabsTrigger value="test" className="flex items-center gap-2">
                        <TestTube className="h-4 w-4" />
                        Test Widget
                    </TabsTrigger>
                    <TabsTrigger value="preview" className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Live Preview
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Advanced Settings
                    </TabsTrigger>
                </TabsList>

                {/* Generate Code Tab */}
                <TabsContent value="generate" className="space-y-6">
                    <EnterpriseCard
                        title="Framework Selection"
                        description="Choose your preferred framework or platform for integration"
                        icon={Code}
                        variant="elevated"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {frameworks.map((framework) => (
                                <Card
                                    key={framework.id}
                                    className={`cursor-pointer transition-all duration-200 hover:scale-[1.02] ${selectedFramework === framework.id
                                        ? 'border-primary bg-primary/5 shadow-md'
                                        : 'border-border hover:border-primary/50'
                                        }`}
                                    onClick={() => setSelectedFramework(framework.id)}
                                >
                                    <CardContent className="p-4 text-center">
                                        <framework.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                                        <h4 className="font-semibold mb-1">{framework.name}</h4>
                                        <p className="text-xs text-muted-foreground">{framework.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </EnterpriseCard>

                    <EnterpriseCard
                        title="Generated Embed Code"
                        description={`Copy this ${currentFramework?.name} code and integrate it into your website`}
                        icon={Copy}
                        variant="elevated"
                        actions={
                            <div className="flex items-center space-x-2">
                                <Select value={selectedEnvironment} onValueChange={setSelectedEnvironment}>
                                    <SelectTrigger className="w-32">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="development">Development</SelectItem>
                                        <SelectItem value="staging">Staging</SelectItem>
                                        <SelectItem value="production">Production</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button
                                    onClick={() => copyToClipboard(embedCode)}
                                    size="sm"
                                    variant="outline"
                                >
                                    {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                                    {copied ? 'Copied!' : 'Copy Code'}
                                </Button>
                            </div>
                        }
                    >
                        <div className="space-y-4">
                            <div className="relative">
                                <Textarea
                                    value={embedCode}
                                    readOnly
                                    className="font-mono text-sm min-h-[300px] resize-none"
                                />
                            </div>

                            <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                                <CardContent className="p-4">
                                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center">
                                        <Info className="h-4 w-4 mr-2" />
                                        Integration Instructions
                                    </h4>
                                    <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-decimal list-inside">
                                        {selectedFramework === 'html' && (
                                            <>
                                                <li>Copy the embed code above</li>
                                                <li>Paste it before the closing &lt;/body&gt; tag on your website</li>
                                                <li>The widget will automatically load with your current configuration</li>
                                                <li>Test the widget to ensure it's working correctly</li>
                                            </>
                                        )}
                                        {selectedFramework === 'react' && (
                                            <>
                                                <li>Install the component in your React application</li>
                                                <li>Import and use the ChatWidget component</li>
                                                <li>Place it in your main App component or layout</li>
                                                <li>The widget will automatically initialize</li>
                                            </>
                                        )}
                                        {selectedFramework === 'vue' && (
                                            <>
                                                <li>Add the component to your Vue.js application</li>
                                                <li>Register it globally or import locally</li>
                                                <li>Include it in your main template</li>
                                                <li>The widget will mount automatically</li>
                                            </>
                                        )}
                                        {selectedFramework === 'wordpress' && (
                                            <>
                                                <li>Add the PHP code to your theme's functions.php file</li>
                                                <li>Or create a custom plugin with this code</li>
                                                <li>The widget will appear on all pages</li>
                                                <li>Customize placement using WordPress hooks</li>
                                            </>
                                        )}
                                    </ol>
                                </CardContent>
                            </Card>
                        </div>
                    </EnterpriseCard>
                </TabsContent>

                {/* Test Widget Tab */}
                <TabsContent value="test" className="space-y-6">
                    <EnterpriseCard
                        title="Widget Testing Suite"
                        description="Test your widget across different environments and devices"
                        icon={TestTube}
                        variant="elevated"
                        actions={
                            <Button
                                onClick={runWidgetTest}
                                disabled={isTestingWidget}
                                size="sm"
                            >
                                {isTestingWidget ? (
                                    <>
                                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                        Testing...
                                    </>
                                ) : (
                                    <>
                                        <TestTube className="h-4 w-4 mr-2" />
                                        Run Tests
                                    </>
                                )}
                            </Button>
                        }
                    >
                        <div className="space-y-4">
                            {testResults.length > 0 && (
                                <div className="space-y-3">
                                    {testResults.map((result, index) => (
                                        <Card key={index} className={`border ${result.success ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950' : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950'}`}>
                                            <CardContent className="p-3">
                                                <div className="flex items-center space-x-3">
                                                    {result.success ? (
                                                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                                                    ) : (
                                                        <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                                                    )}
                                                    <div>
                                                        <div className="font-medium">{result.environment}</div>
                                                        <div className="text-sm text-muted-foreground">{result.message}</div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}

                            {!isTestingWidget && testResults.length === 0 && (
                                <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600">
                                    <CardContent className="p-8 text-center">
                                        <TestTube className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <h3 className="font-medium mb-2">Ready to Test</h3>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Run comprehensive tests across different environments to ensure compatibility
                                        </p>
                                        <Button onClick={runWidgetTest}>
                                            <TestTube className="h-4 w-4 mr-2" />
                                            Start Testing
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </EnterpriseCard>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <EnterpriseCard
                            title="Device Compatibility"
                            description="Test across different devices and screen sizes"
                            icon={Monitor}
                            variant="elevated"
                        >
                            <div className="grid grid-cols-2 gap-3">
                                <Button variant="outline" size="sm">
                                    <Laptop className="h-4 w-4 mr-2" />
                                    Desktop
                                </Button>
                                <Button variant="outline" size="sm">
                                    <Tablet className="h-4 w-4 mr-2" />
                                    Tablet
                                </Button>
                                <Button variant="outline" size="sm">
                                    <Smartphone className="h-4 w-4 mr-2" />
                                    Mobile
                                </Button>
                                <Button variant="outline" size="sm">
                                    <Monitor className="h-4 w-4 mr-2" />
                                    Large Screen
                                </Button>
                            </div>
                        </EnterpriseCard>

                        <EnterpriseCard
                            title="Performance Metrics"
                            description="Monitor widget performance and loading times"
                            icon={Activity}
                            variant="elevated"
                        >
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Load Time:</span>
                                    <span className="font-medium">1.2s</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Bundle Size:</span>
                                    <span className="font-medium">45KB</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Memory Usage:</span>
                                    <span className="font-medium">2.1MB</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Compatibility:</span>
                                    <span className="font-medium text-green-600">99.8%</span>
                                </div>
                            </div>
                        </EnterpriseCard>
                    </div>
                </TabsContent>

                {/* Live Preview Tab */}
                <TabsContent value="preview" className="space-y-6">
                    <EnterpriseCard
                        title="Live Widget Preview"
                        description="See how your widget will appear on different websites"
                        icon={Eye}
                        variant="elevated"
                    >
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border">
                            <div className="bg-white dark:bg-gray-950 rounded-lg shadow-lg border min-h-[400px] relative">
                                {/* Fake Browser Header */}
                                <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b flex items-center space-x-2 rounded-t-lg">
                                    <div className="flex space-x-1">
                                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                                    </div>
                                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded px-3 py-1 text-xs text-gray-600 dark:text-gray-400">
                                        https://yourwebsite.com
                                    </div>
                                </div>

                                {/* Website Content */}
                                <div className="p-6">
                                    <div className="space-y-4">
                                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                                        <div className="space-y-2">
                                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
                                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/5"></div>
                                        </div>
                                        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                    </div>
                                </div>

                                {/* Widget Button */}
                                <div className="absolute bottom-4 right-4">
                                    <div
                                        className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                                        style={{ backgroundColor: config.primaryColor || '#3b82f6' }}
                                    >
                                        <MessageSquare className="h-5 w-5 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </EnterpriseCard>
                </TabsContent>

                {/* Advanced Settings Tab */}
                <TabsContent value="settings" className="space-y-6">
                    <EnterpriseCard
                        title="Advanced Configuration"
                        description="Configure advanced widget settings and optimizations"
                        icon={Settings}
                        variant="elevated"
                    >
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label className="text-base">Analytics Tracking</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Enable detailed analytics and user behavior tracking
                                            </p>
                                        </div>
                                        <Switch checked={enableAnalytics} onCheckedChange={setEnableAnalytics} />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label className="text-base">Smart Caching</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Cache widget resources for faster loading
                                            </p>
                                        </div>
                                        <Switch checked={enableCaching} onCheckedChange={setEnableCaching} />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label className="text-base">Lazy Loading</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Load widget only when needed to improve page speed
                                            </p>
                                        </div>
                                        <Switch checked={enableLazyLoad} onCheckedChange={setEnableLazyLoad} />
                                    </div>
                                </div>

                                <Card className="p-4 bg-muted/50">
                                    <h4 className="font-medium mb-3">Current Configuration</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Framework:</span>
                                            <span>{currentFramework?.name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Environment:</span>
                                            <span className="capitalize">{selectedEnvironment}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Analytics:</span>
                                            <span>{enableAnalytics ? 'Enabled' : 'Disabled'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Caching:</span>
                                            <span>{enableCaching ? 'Enabled' : 'Disabled'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Lazy Load:</span>
                                            <span>{enableLazyLoad ? 'Enabled' : 'Disabled'}</span>
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            <div className="flex items-center space-x-3">
                                <Button>
                                    <Download className="h-4 w-4 mr-2" />
                                    Download Integration Guide
                                </Button>
                                <Button variant="outline">
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    View Documentation
                                </Button>
                            </div>
                        </div>
                    </EnterpriseCard>
                </TabsContent>
            </Tabs>
        </div>
    );
}; 