import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
    TestTube, Play, Pause, RefreshCw, CheckCircle, AlertTriangle, X,
    Monitor, Smartphone, Tablet, Laptop, Globe, Zap, Activity, Clock,
    BarChart3, Download, Eye, Settings, MessageSquare, Users, Target,
    TrendingUp, AlertCircle, Info, ExternalLink, Copy, FileText
} from 'lucide-react';
import { EnterpriseCard, MetricCard } from '@/components/ui/EnterpriseCard';

interface TestResult {
    id: string;
    name: string;
    status: 'running' | 'passed' | 'failed' | 'pending';
    duration: number;
    message: string;
    details?: string;
}

interface PerformanceMetric {
    name: string;
    value: number;
    unit: string;
    status: 'good' | 'warning' | 'error';
    benchmark: number;
}

export const EnhancedTestingSuite = () => {
    const [isRunningTests, setIsRunningTests] = useState(false);
    const [testProgress, setTestProgress] = useState(0);
    const [selectedTestSuite, setSelectedTestSuite] = useState('comprehensive');
    const [testResults, setTestResults] = useState<TestResult[]>([]);
    const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
    const [customTestPrompt, setCustomTestPrompt] = useState('Hello, I need help with my order status. Can you help me?');

    const testSuites = [
        {
            id: 'comprehensive',
            name: 'Comprehensive Test',
            description: 'Full test suite covering all functionality',
            duration: '5-8 minutes',
            tests: 25
        },
        {
            id: 'quick',
            name: 'Quick Test',
            description: 'Essential functionality tests',
            duration: '1-2 minutes',
            tests: 8
        },
        {
            id: 'performance',
            name: 'Performance Test',
            description: 'Load time and responsiveness tests',
            duration: '2-3 minutes',
            tests: 12
        },
        {
            id: 'compatibility',
            name: 'Compatibility Test',
            description: 'Cross-browser and device testing',
            duration: '3-4 minutes',
            tests: 15
        },
        {
            id: 'custom',
            name: 'Custom Test',
            description: 'User-defined test scenarios',
            duration: 'Variable',
            tests: 'Custom'
        }
    ];

    const deviceTests = [
        { id: 'desktop', name: 'Desktop', icon: Monitor, status: 'passed' as const },
        { id: 'tablet', name: 'Tablet', icon: Tablet, status: 'passed' as const },
        { id: 'mobile', name: 'Mobile', icon: Smartphone, status: 'warning' as const },
        { id: 'large', name: 'Large Screen', icon: Laptop, status: 'passed' as const }
    ];

    const browserTests = [
        { id: 'chrome', name: 'Chrome', status: 'passed' as const, version: '119.0' },
        { id: 'firefox', name: 'Firefox', status: 'passed' as const, version: '120.0' },
        { id: 'safari', name: 'Safari', status: 'passed' as const, version: '17.1' },
        { id: 'edge', name: 'Edge', status: 'warning' as const, version: '119.0' }
    ];

    const runTestSuite = async () => {
        setIsRunningTests(true);
        setTestProgress(0);
        setTestResults([]);
        setPerformanceMetrics([]);

        const mockTests: TestResult[] = [
            { id: '1', name: 'Widget Initialization', status: 'pending', duration: 0, message: '' },
            { id: '2', name: 'UI Rendering', status: 'pending', duration: 0, message: '' },
            { id: '3', name: 'API Connection', status: 'pending', duration: 0, message: '' },
            { id: '4', name: 'Message Sending', status: 'pending', duration: 0, message: '' },
            { id: '5', name: 'Response Handling', status: 'pending', duration: 0, message: '' },
            { id: '6', name: 'Error Handling', status: 'pending', duration: 0, message: '' },
            { id: '7', name: 'Performance Check', status: 'pending', duration: 0, message: '' },
            { id: '8', name: 'Accessibility Test', status: 'pending', duration: 0, message: '' }
        ];

        setTestResults(mockTests);

        for (let i = 0; i < mockTests.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 1000));

            const success = Math.random() > 0.15; // 85% success rate
            const duration = Math.floor(Math.random() * 2000) + 500;

            setTestResults(prev => prev.map((test, index) =>
                index === i ? {
                    ...test,
                    status: test.id === '1' ? 'running' : success ? 'passed' : 'failed',
                    duration,
                    message: success
                        ? `✅ Test completed successfully in ${duration}ms`
                        : `❌ Test failed - ${['Timeout error', 'Network error', 'Validation error'][Math.floor(Math.random() * 3)]}`
                } : test
            ));

            if (i === 0) {
                setTimeout(() => {
                    setTestResults(prev => prev.map((test, index) =>
                        index === 0 ? { ...test, status: 'passed' } : test
                    ));
                }, 500);
            }

            setTestProgress(((i + 1) / mockTests.length) * 100);
        }

        // Set performance metrics
        setPerformanceMetrics([
            { name: 'Load Time', value: 1.2, unit: 's', status: 'good', benchmark: 2.0 },
            { name: 'First Paint', value: 0.8, unit: 's', status: 'good', benchmark: 1.0 },
            { name: 'Bundle Size', value: 45, unit: 'KB', status: 'good', benchmark: 100 },
            { name: 'Memory Usage', value: 2.1, unit: 'MB', status: 'warning', benchmark: 5.0 },
            { name: 'API Response', value: 850, unit: 'ms', status: 'good', benchmark: 1000 }
        ]);

        setIsRunningTests(false);
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'passed':
                return <CheckCircle className="h-4 w-4 text-green-600" />;
            case 'failed':
                return <X className="h-4 w-4 text-red-600" />;
            case 'running':
                return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
            default:
                return <Clock className="h-4 w-4 text-gray-400" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'passed':
                return 'text-green-600';
            case 'failed':
                return 'text-red-600';
            case 'warning':
                return 'text-yellow-600';
            default:
                return 'text-gray-600';
        }
    };

    const passedTests = testResults.filter(t => t.status === 'passed').length;
    const failedTests = testResults.filter(t => t.status === 'failed').length;
    const totalTests = testResults.length;

    return (
        <div className="space-y-6">
            {/* Overview Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MetricCard
                    title="Test Success Rate"
                    value={totalTests > 0 ? `${Math.round((passedTests / totalTests) * 100)}%` : '0%'}
                    change={`${passedTests}/${totalTests} passed`}
                    icon={TestTube}
                    trend={failedTests === 0 ? 'up' : 'down'}
                />
                <MetricCard
                    title="Performance Score"
                    value="92/100"
                    change="Excellent"
                    icon={Zap}
                    trend="up"
                />
                <MetricCard
                    title="Load Time"
                    value="1.2s"
                    change="Under target"
                    icon={Clock}
                    trend="up"
                />
                <MetricCard
                    title="Compatibility"
                    value="98%"
                    change="4/4 browsers"
                    icon={Globe}
                    trend="up"
                />
            </div>

            <Tabs defaultValue="run-tests" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="run-tests" className="flex items-center gap-2">
                        <Play className="h-4 w-4" />
                        Run Tests
                    </TabsTrigger>
                    <TabsTrigger value="results" className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Results
                    </TabsTrigger>
                    <TabsTrigger value="performance" className="flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        Performance
                    </TabsTrigger>
                    <TabsTrigger value="compatibility" className="flex items-center gap-2">
                        <Monitor className="h-4 w-4" />
                        Compatibility
                    </TabsTrigger>
                    <TabsTrigger value="reports" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Reports
                    </TabsTrigger>
                </TabsList>

                {/* Run Tests Tab */}
                <TabsContent value="run-tests" className="space-y-6">
                    <EnterpriseCard
                        title="Test Suite Selection"
                        description="Choose the type of tests you want to run"
                        icon={TestTube}
                        variant="elevated"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {testSuites.map((suite) => (
                                <Card
                                    key={suite.id}
                                    className={`cursor-pointer transition-all duration-200 hover:scale-[1.02] ${selectedTestSuite === suite.id
                                            ? 'border-primary bg-primary/5 shadow-md'
                                            : 'border-border hover:border-primary/50'
                                        }`}
                                    onClick={() => setSelectedTestSuite(suite.id)}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-semibold">{suite.name}</h4>
                                            <Badge variant="outline" className="text-xs">
                                                {suite.tests} tests
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-2">{suite.description}</p>
                                        <div className="text-xs text-muted-foreground">
                                            Duration: {suite.duration}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </EnterpriseCard>

                    {selectedTestSuite === 'custom' && (
                        <EnterpriseCard
                            title="Custom Test Configuration"
                            description="Configure your custom test scenarios"
                            icon={Settings}
                            variant="elevated"
                        >
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Test Prompt</Label>
                                    <Textarea
                                        value={customTestPrompt}
                                        onChange={(e) => setCustomTestPrompt(e.target.value)}
                                        placeholder="Enter a custom message to test the AI response..."
                                        rows={3}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Test Environment</Label>
                                        <Select defaultValue="production">
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="development">Development</SelectItem>
                                                <SelectItem value="staging">Staging</SelectItem>
                                                <SelectItem value="production">Production</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Test Iterations</Label>
                                        <Select defaultValue="5">
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1">1 iteration</SelectItem>
                                                <SelectItem value="5">5 iterations</SelectItem>
                                                <SelectItem value="10">10 iterations</SelectItem>
                                                <SelectItem value="25">25 iterations</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </EnterpriseCard>
                    )}

                    <EnterpriseCard
                        title="Test Execution"
                        description="Run your selected test suite and monitor progress"
                        icon={Play}
                        variant="elevated"
                        actions={
                            <Button
                                onClick={runTestSuite}
                                disabled={isRunningTests}
                                size="sm"
                            >
                                {isRunningTests ? (
                                    <>
                                        <Pause className="h-4 w-4 mr-2" />
                                        Stop Tests
                                    </>
                                ) : (
                                    <>
                                        <Play className="h-4 w-4 mr-2" />
                                        Run Tests
                                    </>
                                )}
                            </Button>
                        }
                    >
                        {isRunningTests && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Test Progress</span>
                                        <span>{Math.round(testProgress)}%</span>
                                    </div>
                                    <Progress value={testProgress} className="h-2" />
                                </div>
                            </div>
                        )}

                        {testResults.length > 0 && (
                            <div className="space-y-3">
                                {testResults.map((test) => (
                                    <Card key={test.id} className="transition-all">
                                        <CardContent className="p-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    {getStatusIcon(test.status)}
                                                    <div>
                                                        <div className="font-medium">{test.name}</div>
                                                        {test.message && (
                                                            <div className="text-sm text-muted-foreground">{test.message}</div>
                                                        )}
                                                    </div>
                                                </div>
                                                {test.duration > 0 && (
                                                    <Badge variant="outline" className="text-xs">
                                                        {test.duration}ms
                                                    </Badge>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}

                        {!isRunningTests && testResults.length === 0 && (
                            <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600">
                                <CardContent className="p-8 text-center">
                                    <TestTube className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="font-medium mb-2">Ready to Test</h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Select a test suite and click "Run Tests" to begin testing your widget
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </EnterpriseCard>
                </TabsContent>

                {/* Results Tab */}
                <TabsContent value="results" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <EnterpriseCard
                            title="Test Summary"
                            description="Overall test results and statistics"
                            icon={BarChart3}
                            variant="elevated"
                        >
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Total Tests:</span>
                                    <span className="font-semibold">{totalTests}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Passed:</span>
                                    <span className="font-semibold text-green-600">{passedTests}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Failed:</span>
                                    <span className="font-semibold text-red-600">{failedTests}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Success Rate:</span>
                                    <span className="font-semibold">
                                        {totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0}%
                                    </span>
                                </div>
                            </div>
                        </EnterpriseCard>

                        <EnterpriseCard
                            title="Performance Score"
                            description="Overall performance rating"
                            icon={TrendingUp}
                            variant="elevated"
                        >
                            <div className="text-center">
                                <div className="text-4xl font-bold text-green-600 mb-2">92</div>
                                <div className="text-sm text-muted-foreground mb-4">out of 100</div>
                                <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                    Excellent
                                </Badge>
                            </div>
                        </EnterpriseCard>

                        <EnterpriseCard
                            title="Quick Actions"
                            description="Common testing actions"
                            icon={Target}
                            variant="elevated"
                        >
                            <div className="space-y-2">
                                <Button variant="outline" size="sm" className="w-full">
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Re-run Failed Tests
                                </Button>
                                <Button variant="outline" size="sm" className="w-full">
                                    <Download className="h-4 w-4 mr-2" />
                                    Export Results
                                </Button>
                                <Button variant="outline" size="sm" className="w-full">
                                    <Copy className="h-4 w-4 mr-2" />
                                    Share Report
                                </Button>
                            </div>
                        </EnterpriseCard>
                    </div>

                    {testResults.length > 0 && (
                        <EnterpriseCard
                            title="Detailed Test Results"
                            description="Complete breakdown of all test executions"
                            icon={FileText}
                            variant="elevated"
                        >
                            <div className="space-y-3">
                                {testResults.map((test) => (
                                    <Card key={test.id} className={`border ${test.status === 'passed' ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950' :
                                            test.status === 'failed' ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950' :
                                                'border-border'
                                        }`}>
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    {getStatusIcon(test.status)}
                                                    <div>
                                                        <div className="font-medium">{test.name}</div>
                                                        <div className="text-sm text-muted-foreground">{test.message}</div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <Badge variant="outline" className="text-xs mb-1">
                                                        {test.duration}ms
                                                    </Badge>
                                                    <div className={`text-xs font-medium ${getStatusColor(test.status)}`}>
                                                        {test.status.toUpperCase()}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </EnterpriseCard>
                    )}
                </TabsContent>

                {/* Performance Tab */}
                <TabsContent value="performance" className="space-y-6">
                    <EnterpriseCard
                        title="Performance Metrics"
                        description="Detailed performance analysis and benchmarks"
                        icon={Activity}
                        variant="elevated"
                    >
                        {performanceMetrics.length > 0 ? (
                            <div className="space-y-4">
                                {performanceMetrics.map((metric, index) => (
                                    <Card key={index} className="transition-all">
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="font-medium">{metric.name}</div>
                                                <Badge variant={
                                                    metric.status === 'good' ? 'default' :
                                                        metric.status === 'warning' ? 'secondary' : 'destructive'
                                                } className="text-xs">
                                                    {metric.status}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="text-2xl font-bold">
                                                    {metric.value}{metric.unit}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    Benchmark: {metric.benchmark}{metric.unit}
                                                </div>
                                            </div>
                                            <div className="mt-2">
                                                <div className="w-full bg-muted rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full ${metric.status === 'good' ? 'bg-green-500' :
                                                                metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                                                            }`}
                                                        style={{ width: `${Math.min((metric.value / metric.benchmark) * 100, 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600">
                                <CardContent className="p-8 text-center">
                                    <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="font-medium mb-2">No Performance Data</h3>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Run a performance test to see detailed metrics
                                    </p>
                                    <Button onClick={runTestSuite}>
                                        <Play className="h-4 w-4 mr-2" />
                                        Run Performance Test
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </EnterpriseCard>
                </TabsContent>

                {/* Compatibility Tab */}
                <TabsContent value="compatibility" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <EnterpriseCard
                            title="Device Compatibility"
                            description="Test results across different devices"
                            icon={Monitor}
                            variant="elevated"
                        >
                            <div className="space-y-3">
                                {deviceTests.map((device) => (
                                    <Card key={device.id} className="transition-all">
                                        <CardContent className="p-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <device.icon className="h-5 w-5 text-primary" />
                                                    <span className="font-medium">{device.name}</span>
                                                </div>
                                                <Badge variant={
                                                    device.status === 'passed' ? 'default' :
                                                        device.status === 'warning' ? 'secondary' : 'destructive'
                                                } className="text-xs">
                                                    {device.status}
                                                </Badge>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </EnterpriseCard>

                        <EnterpriseCard
                            title="Browser Compatibility"
                            description="Test results across different browsers"
                            icon={Globe}
                            variant="elevated"
                        >
                            <div className="space-y-3">
                                {browserTests.map((browser) => (
                                    <Card key={browser.id} className="transition-all">
                                        <CardContent className="p-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <Globe className="h-5 w-5 text-primary" />
                                                    <div>
                                                        <div className="font-medium">{browser.name}</div>
                                                        <div className="text-xs text-muted-foreground">v{browser.version}</div>
                                                    </div>
                                                </div>
                                                <Badge variant={
                                                    browser.status === 'passed' ? 'default' :
                                                        browser.status === 'warning' ? 'secondary' : 'destructive'
                                                } className="text-xs">
                                                    {browser.status}
                                                </Badge>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </EnterpriseCard>
                    </div>
                </TabsContent>

                {/* Reports Tab */}
                <TabsContent value="reports" className="space-y-6">
                    <EnterpriseCard
                        title="Test Reports & Export"
                        description="Generate and download comprehensive test reports"
                        icon={FileText}
                        variant="elevated"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Button variant="outline">
                                <Download className="h-4 w-4 mr-2" />
                                Download PDF Report
                            </Button>
                            <Button variant="outline">
                                <Download className="h-4 w-4 mr-2" />
                                Export CSV Data
                            </Button>
                            <Button variant="outline">
                                <Download className="h-4 w-4 mr-2" />
                                Performance Report
                            </Button>
                            <Button variant="outline">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Share Online Report
                            </Button>
                        </div>
                    </EnterpriseCard>
                </TabsContent>
            </Tabs>
        </div>
    );
}; 