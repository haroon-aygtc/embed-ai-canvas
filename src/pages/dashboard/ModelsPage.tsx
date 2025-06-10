import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SearchInput } from '@/components/ui/input';
import { SearchableSelect } from '@/components/ui/combobox';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import {
    Search,
    Filter,
    Settings,
    Play,
    MessageSquare,
    BarChart3,
    Zap,
    Target,
    DollarSign,
    Clock,
    TrendingUp,
    AlertTriangle,
    CheckCircle,
    Send,
    Download,
    Trash2,
    RotateCcw,
    Activity,
    Users,
    Brain,
    Cpu,
    Database,
    Shield,
    Globe,
    Building,
    Monitor,
    TestTube,
    Cog
} from 'lucide-react';
import { useState, useRef } from 'react';
import { useSetupWizard } from '@/hooks/useSetupWizard';
import { SetupWizard } from '@/components/onboarding/SetupWizard';
import { Input } from '@/components/ui/input';

interface Model {
    id: string;
    name: string;
    provider: string;
    description: string;
    speed: number;
    accuracy: number;
    cost: number;
    capabilities: string[];
    status: 'active' | 'inactive' | 'testing';
    providerInfo: {
        icon: string;
        color: string;
    };
}

interface ChatMessage {
    id: string;
    content: string;
    sender: 'user' | 'assistant';
    timestamp: Date;
    responseTime?: number;
    tokens?: number;
}

const mockModels: Model[] = [
    {
        id: 'gpt-4',
        name: 'GPT-4',
        provider: 'OpenAI',
        description: 'Most capable model for complex reasoning and creative tasks',
        speed: 85,
        accuracy: 95,
        cost: 0.03,
        capabilities: ['Text Generation', 'Code', 'Analysis', 'Creative Writing'],
        status: 'active',
        providerInfo: { icon: '🤖', color: 'bg-green-500' }
    },
    {
        id: 'claude-3-opus',
        name: 'Claude-3 Opus',
        provider: 'Anthropic',
        description: 'Advanced reasoning with strong safety features',
        speed: 80,
        accuracy: 93,
        cost: 0.015,
        capabilities: ['Analysis', 'Research', 'Writing', 'Math'],
        status: 'active',
        providerInfo: { icon: '🧠', color: 'bg-purple-500' }
    },
    {
        id: 'llama-3-70b',
        name: 'Llama-3 70B',
        provider: 'Meta',
        description: 'Open-source model with excellent performance',
        speed: 90,
        accuracy: 88,
        cost: 0.008,
        capabilities: ['Text Generation', 'Conversation', 'Summarization'],
        status: 'active',
        providerInfo: { icon: '🦙', color: 'bg-blue-500' }
    },
    {
        id: 'gemini-pro',
        name: 'Gemini Pro',
        provider: 'Google',
        description: 'Multimodal AI with strong reasoning capabilities',
        speed: 88,
        accuracy: 90,
        cost: 0.012,
        capabilities: ['Multimodal', 'Code', 'Analysis', 'Vision'],
        status: 'inactive',
        providerInfo: { icon: '💎', color: 'bg-yellow-500' }
    },
    {
        id: 'mistral-large',
        name: 'Mistral Large',
        provider: 'Mistral AI',
        description: 'European AI model with strong multilingual support',
        speed: 92,
        accuracy: 87,
        cost: 0.01,
        capabilities: ['Multilingual', 'Code', 'Reasoning'],
        status: 'inactive',
        providerInfo: { icon: '🌟', color: 'bg-orange-500' }
    }
];

const ModelsPage = () => {
    const { showWizard, handleWizardComplete, handleWizardSkip, handleStartWizard } = useSetupWizard();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [providerFilter, setProviderFilter] = useState<string>('all');
    const [selectedModel, setSelectedModel] = useState<Model | null>(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [activeModels, setActiveModels] = useState<Set<string>>(
        new Set(['gpt-4', 'claude-3-opus', 'llama-3-70b'])
    );

    // Chat testing state
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [chatMetrics, setChatMetrics] = useState({
        totalMessages: 0,
        avgResponseTime: 0,
        totalTokens: 0,
        successRate: 100
    });

    // Model configuration state
    const [modelConfig, setModelConfig] = useState({
        temperature: [0.7],
        maxTokens: [2048],
        systemPrompt: 'You are a helpful AI assistant.'
    });

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Get unique providers for filter options
    const uniqueProviders = Array.from(new Set(mockModels.map(model => model.provider)));
    const providerOptions = [
        { value: 'all', label: 'All Providers', description: 'Show models from all providers' },
        ...uniqueProviders.map(provider => ({
            value: provider,
            label: provider,
            description: `Show only ${provider} models`
        }))
    ];

    const filteredModels = mockModels.filter(model => {
        const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            model.provider.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || model.status === statusFilter;
        const matchesProvider = providerFilter === 'all' || model.provider === providerFilter;
        return matchesSearch && matchesStatus && matchesProvider;
    });

    const toggleModelActive = (modelId: string) => {
        setActiveModels(prev => {
            const newSet = new Set(prev);
            if (newSet.has(modelId)) {
                newSet.delete(modelId);
            } else {
                newSet.add(modelId);
            }
            return newSet;
        });
    };

    const toggleAllModels = () => {
        if (activeModels.size === mockModels.length) {
            setActiveModels(new Set());
        } else {
            setActiveModels(new Set(mockModels.map(m => m.id)));
        }
    };

    const sendMessage = async () => {
        if (!currentMessage.trim() || !selectedModel) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            content: currentMessage,
            sender: 'user',
            timestamp: new Date()
        };

        setChatMessages(prev => [...prev, userMessage]);
        setCurrentMessage('');
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            const responseTime = Math.random() * 2000 + 500;
            const tokens = Math.floor(Math.random() * 100) + 20;

            const assistantMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                content: `This is a simulated response from ${selectedModel.name}. In a real implementation, this would be the actual AI model response.`,
                sender: 'assistant',
                timestamp: new Date(),
                responseTime,
                tokens
            };

            setChatMessages(prev => [...prev, assistantMessage]);
            setIsTyping(false);

            // Update metrics
            setChatMetrics(prev => ({
                totalMessages: prev.totalMessages + 1,
                avgResponseTime: (prev.avgResponseTime + responseTime) / 2,
                totalTokens: prev.totalTokens + tokens,
                successRate: 100
            }));
        }, 1500);
    };

    const clearChat = () => {
        setChatMessages([]);
        setChatMetrics({
            totalMessages: 0,
            avgResponseTime: 0,
            totalTokens: 0,
            successRate: 100
        });
    };

    const exportChat = () => {
        const chatData = {
            model: selectedModel?.name,
            messages: chatMessages,
            metrics: chatMetrics,
            timestamp: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat-log-${selectedModel?.name}-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    if (showWizard) {
        return (
            <SetupWizard
                onComplete={handleWizardComplete}
                onSkip={handleWizardSkip}
            />
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <PageHeader
                    title="AI Models"
                    description="Manage and test your AI models"
                    onSetupWizard={handleStartWizard}
                    actions={
                        <Button
                            variant="outline"
                            onClick={toggleAllModels}
                            className="flex items-center space-x-2"
                        >
                            <Zap className="h-4 w-4" />
                            <span>{activeModels.size === mockModels.length ? 'Disable All' : 'Enable All'}</span>
                        </Button>
                    }
                />

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                                    <Brain className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Active Models</p>
                                    <p className="text-2xl font-bold">{activeModels.size}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                                    <Clock className="h-4 w-4 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Avg Response Time</p>
                                    <p className="text-2xl font-bold">1.2s</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                                    <DollarSign className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Monthly Cost</p>
                                    <p className="text-2xl font-bold">$127</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                                    <TrendingUp className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Tests This Month</p>
                                    <p className="text-2xl font-bold">1,247</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Sidebar - Model List */}
                    <div className="lg:col-span-1">
                        <Card className="h-fit">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>Models</span>
                                    <Badge variant="secondary">{filteredModels.length} models</Badge>
                                </CardTitle>
                                <CardDescription>Select a model to view details and test</CardDescription>

                                {/* Search and Filter */}
                                <div className="space-y-3">
                                    <SearchInput
                                        placeholder="Search models..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onClear={() => setSearchTerm('')}
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="flex items-center space-x-2">
                                            <Filter className="h-4 w-4 text-muted-foreground" />
                                            <SearchableSelect
                                                value={statusFilter}
                                                onValueChange={(value) => setStatusFilter(value as any)}
                                                options={[
                                                    { value: 'all', label: 'All Status', description: 'Show all models regardless of status' },
                                                    { value: 'active', label: 'Active', description: 'Show only active models' },
                                                    { value: 'inactive', label: 'Inactive', description: 'Show only inactive models' }
                                                ]}
                                                placeholder="Filter by status..."
                                                className="flex-1"
                                            />
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Building className="h-4 w-4 text-muted-foreground" />
                                            <SearchableSelect
                                                value={providerFilter}
                                                onValueChange={setProviderFilter}
                                                options={providerOptions}
                                                placeholder="Filter by provider..."
                                                className="flex-1"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="p-0">
                                <div className="max-h-[calc(100vh-20rem)] overflow-y-auto scrollbar-hide pr-2">
                                    {filteredModels.length === 0 ? (
                                        <div className="p-6 text-center">
                                            <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                            <p className="text-muted-foreground">No models found</p>
                                            <p className="text-sm text-muted-foreground">Try adjusting your search or filter</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2 p-4">
                                            {filteredModels.map((model) => {
                                                const isActive = activeModels.has(model.id);
                                                const isSelected = selectedModel?.id === model.id;

                                                return (
                                                    <Card
                                                        key={model.id}
                                                        className={`cursor-pointer transition-all hover:shadow-md focus:outline-none ${isSelected ? 'ring-2 ring-primary' : ''
                                                            } ${isActive ? 'bg-green-50 dark:bg-green-950' : 'bg-gray-50 dark:bg-gray-900'
                                                            }`}
                                                        onClick={() => setSelectedModel(model)}
                                                        tabIndex={-1}
                                                        role="button"
                                                        aria-label={`Select ${model.name} model`}
                                                    >
                                                        <CardContent className="p-4">
                                                            <div className="flex items-start justify-between mb-3">
                                                                <div className="flex items-center space-x-3">
                                                                    <div className={`w-10 h-10 ${model.providerInfo.color} rounded-lg flex items-center justify-center text-white text-lg`}>
                                                                        {model.providerInfo.icon}
                                                                    </div>
                                                                    <div>
                                                                        <h3 className="font-semibold">{model.name}</h3>
                                                                        <p className="text-sm text-muted-foreground">{model.provider}</p>
                                                                    </div>
                                                                </div>
                                                                <Switch
                                                                    checked={isActive}
                                                                    onCheckedChange={() => toggleModelActive(model.id)}
                                                                    onClick={(e) => e.stopPropagation()}
                                                                />
                                                            </div>

                                                            <p className="text-sm text-muted-foreground mb-3">{model.description}</p>

                                                            <div className="space-y-2">
                                                                <div className="flex justify-between text-sm">
                                                                    <span>Speed</span>
                                                                    <span>{model.speed}%</span>
                                                                </div>
                                                                <Progress value={model.speed} className="h-1" />

                                                                <div className="flex justify-between text-sm">
                                                                    <span>Accuracy</span>
                                                                    <span>{model.accuracy}%</span>
                                                                </div>
                                                                <Progress value={model.accuracy} className="h-1" />
                                                            </div>

                                                            <div className="flex items-center justify-between mt-3">
                                                                <Badge variant={isActive ? 'default' : 'secondary'}>
                                                                    {isActive ? 'Active' : 'Inactive'}
                                                                </Badge>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    disabled={!isActive}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setSelectedModel(model);
                                                                        setActiveTab('testing');
                                                                    }}
                                                                >
                                                                    <Play className="h-3 w-3 mr-1" />
                                                                    Test
                                                                </Button>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Panel - Model Details */}
                    <div className="lg:col-span-2">
                        {selectedModel ? (
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-12 h-12 ${selectedModel.providerInfo.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                                                {selectedModel.providerInfo.icon}
                                            </div>
                                            <div>
                                                <CardTitle>{selectedModel.name}</CardTitle>
                                                <CardDescription>{selectedModel.provider} • {selectedModel.description}</CardDescription>
                                            </div>
                                        </div>
                                        <Badge variant={activeModels.has(selectedModel.id) ? 'default' : 'secondary'}>
                                            {activeModels.has(selectedModel.id) ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </div>
                                </CardHeader>

                                <CardContent className="p-6">
                                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                        <div className="mb-6">
                                            <TabsList className="grid w-full grid-cols-6 h-12 p-1 bg-muted/50">
                                                <TabsTrigger
                                                    value="overview"
                                                    className="text-xs sm:text-sm px-2 sm:px-3 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                                                >
                                                    <Monitor className="h-3 w-3 mr-1 sm:mr-2" />
                                                    <span className="hidden sm:inline">Overview</span>
                                                    <span className="sm:hidden">Info</span>
                                                </TabsTrigger>
                                                <TabsTrigger
                                                    value="testing"
                                                    className="text-xs sm:text-sm px-2 sm:px-3 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                                                >
                                                    <TestTube className="h-3 w-3 mr-1 sm:mr-2" />
                                                    <span className="hidden sm:inline">Testing</span>
                                                    <span className="sm:hidden">Test</span>
                                                </TabsTrigger>
                                                <TabsTrigger
                                                    value="parameters"
                                                    className="text-xs sm:text-sm px-2 sm:px-3 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                                                >
                                                    <Settings className="h-3 w-3 mr-1 sm:mr-2" />
                                                    <span className="hidden sm:inline">Parameters</span>
                                                    <span className="sm:hidden">Params</span>
                                                </TabsTrigger>
                                                <TabsTrigger
                                                    value="safety"
                                                    className="text-xs sm:text-sm px-2 sm:px-3 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                                                >
                                                    <Shield className="h-3 w-3 mr-1 sm:mr-2" />
                                                    <span className="hidden sm:inline">Safety</span>
                                                    <span className="sm:hidden">Safe</span>
                                                </TabsTrigger>
                                                <TabsTrigger
                                                    value="analytics"
                                                    className="text-xs sm:text-sm px-2 sm:px-3 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                                                >
                                                    <BarChart3 className="h-3 w-3 mr-1 sm:mr-2" />
                                                    <span className="hidden sm:inline">Analytics</span>
                                                    <span className="sm:hidden">Stats</span>
                                                </TabsTrigger>
                                                <TabsTrigger
                                                    value="settings"
                                                    className="text-xs sm:text-sm px-2 sm:px-3 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                                                >
                                                    <Cog className="h-3 w-3 mr-1 sm:mr-2" />
                                                    <span className="hidden sm:inline">Settings</span>
                                                    <span className="sm:hidden">Config</span>
                                                </TabsTrigger>
                                            </TabsList>
                                        </div>

                                        <TabsContent value="overview" className="border rounded-lg p-6 bg-card space-y-8">
                                            {/* Performance Metrics */}
                                            <div>
                                                <h3 className="text-lg font-semibold mb-4 flex items-center">
                                                    <Activity className="h-5 w-5 mr-2 text-primary" />
                                                    Performance Metrics
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                    <div className="space-y-3 p-4 bg-muted/50 rounded-lg border">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm font-medium">Speed</span>
                                                            <span className="text-sm text-muted-foreground">{selectedModel.speed}%</span>
                                                        </div>
                                                        <Progress value={selectedModel.speed} className="h-2" />
                                                    </div>
                                                    <div className="space-y-3 p-4 bg-muted/50 rounded-lg border">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm font-medium">Accuracy</span>
                                                            <span className="text-sm text-muted-foreground">{selectedModel.accuracy}%</span>
                                                        </div>
                                                        <Progress value={selectedModel.accuracy} className="h-2" />
                                                    </div>
                                                    <div className="space-y-3 p-4 bg-muted/50 rounded-lg border">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm font-medium">Cost Efficiency</span>
                                                            <span className="text-sm text-muted-foreground">85%</span>
                                                        </div>
                                                        <Progress value={85} className="h-2" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Capabilities */}
                                            <div className="p-4 bg-muted/50 rounded-lg border">
                                                <h3 className="text-lg font-semibold mb-4 flex items-center">
                                                    <Brain className="h-5 w-5 mr-2 text-primary" />
                                                    Capabilities
                                                </h3>
                                                <div className="flex flex-wrap gap-3">
                                                    {selectedModel.capabilities.map((capability) => (
                                                        <Badge key={capability} variant="outline" className="px-3 py-1">
                                                            {capability}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Usage Statistics */}
                                            <div>
                                                <h3 className="text-lg font-semibold mb-4 flex items-center">
                                                    <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                                                    Usage Statistics
                                                </h3>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                    <div className="text-center p-4 bg-muted/50 rounded-lg border hover:shadow-sm transition-shadow">
                                                        <p className="text-2xl font-bold text-primary">1,247</p>
                                                        <p className="text-sm text-muted-foreground mt-1">Total Requests</p>
                                                    </div>
                                                    <div className="text-center p-4 bg-muted/50 rounded-lg border hover:shadow-sm transition-shadow">
                                                        <p className="text-2xl font-bold text-green-600">99.2%</p>
                                                        <p className="text-sm text-muted-foreground mt-1">Success Rate</p>
                                                    </div>
                                                    <div className="text-center p-4 bg-muted/50 rounded-lg border hover:shadow-sm transition-shadow">
                                                        <p className="text-2xl font-bold text-blue-600">1.2s</p>
                                                        <p className="text-sm text-muted-foreground mt-1">Avg Response</p>
                                                    </div>
                                                    <div className="text-center p-4 bg-muted/50 rounded-lg border hover:shadow-sm transition-shadow">
                                                        <p className="text-2xl font-bold text-orange-600">${selectedModel.cost}</p>
                                                        <p className="text-sm text-muted-foreground mt-1">Cost per 1K tokens</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="testing" className="border rounded-lg p-6 bg-card space-y-6">
                                            {/* Chat Interface */}
                                            <div className="border rounded-lg overflow-hidden">
                                                {/* Chat Header */}
                                                <div className="bg-muted p-4 border-b">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-3">
                                                            <div className={`w-8 h-8 ${selectedModel.providerInfo.color} rounded-lg flex items-center justify-center text-white`}>
                                                                {selectedModel.providerInfo.icon}
                                                            </div>
                                                            <div>
                                                                <h4 className="font-semibold">Testing {selectedModel.name}</h4>
                                                                <p className="text-sm text-muted-foreground">
                                                                    {activeModels.has(selectedModel.id) ? 'Ready to chat' : 'Model inactive'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <Button size="sm" variant="outline" onClick={exportChat}>
                                                                <Download className="h-4 w-4 mr-1" />
                                                                Export
                                                            </Button>
                                                            <Button size="sm" variant="outline" onClick={clearChat}>
                                                                <Trash2 className="h-4 w-4 mr-1" />
                                                                Clear
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Chat Messages */}
                                                <div className="h-96 overflow-y-auto p-4 space-y-4">
                                                    {chatMessages.length === 0 ? (
                                                        <div className="text-center text-muted-foreground py-8">
                                                            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                                            <p>Start a conversation to test the model</p>
                                                        </div>
                                                    ) : (
                                                        chatMessages.map((message) => (
                                                            <div
                                                                key={message.id}
                                                                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                                            >
                                                                <div
                                                                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.sender === 'user'
                                                                        ? 'bg-primary text-primary-foreground'
                                                                        : 'bg-muted'
                                                                        }`}
                                                                >
                                                                    <p className="text-sm">{message.content}</p>
                                                                    {message.responseTime && (
                                                                        <p className="text-xs opacity-70 mt-1">
                                                                            {message.responseTime.toFixed(0)}ms • {message.tokens} tokens
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))
                                                    )}
                                                    {isTyping && (
                                                        <div className="flex justify-start">
                                                            <div className="bg-muted px-4 py-2 rounded-lg">
                                                                <div className="flex space-x-1">
                                                                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                                                                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div ref={messagesEndRef} />
                                                </div>

                                                {/* Chat Input */}
                                                <div className="border-t p-4">
                                                    <div className="flex space-x-2">
                                                        <Input
                                                            placeholder="Type your message..."
                                                            value={currentMessage}
                                                            onChange={(e) => setCurrentMessage(e.target.value)}
                                                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                                            disabled={!activeModels.has(selectedModel.id)}
                                                        />
                                                        <Button
                                                            onClick={sendMessage}
                                                            disabled={!currentMessage.trim() || !activeModels.has(selectedModel.id)}
                                                        >
                                                            <Send className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Chat Metrics */}
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div className="text-center p-3 bg-muted rounded-lg">
                                                    <p className="text-lg font-bold">{chatMetrics.totalMessages}</p>
                                                    <p className="text-sm text-muted-foreground">Messages</p>
                                                </div>
                                                <div className="text-center p-3 bg-muted rounded-lg">
                                                    <p className="text-lg font-bold">{chatMetrics.avgResponseTime.toFixed(0)}ms</p>
                                                    <p className="text-sm text-muted-foreground">Avg Response</p>
                                                </div>
                                                <div className="text-center p-3 bg-muted rounded-lg">
                                                    <p className="text-lg font-bold">{chatMetrics.totalTokens}</p>
                                                    <p className="text-sm text-muted-foreground">Total Tokens</p>
                                                </div>
                                                <div className="text-center p-3 bg-muted rounded-lg">
                                                    <p className="text-lg font-bold">{chatMetrics.successRate}%</p>
                                                    <p className="text-sm text-muted-foreground">Success Rate</p>
                                                </div>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="parameters" className="border rounded-lg p-6 bg-card space-y-6">
                                            <div className="space-y-6">
                                                <div>
                                                    <label className="text-sm font-medium mb-2 block">Temperature</label>
                                                    <div className="space-y-2">
                                                        <Slider
                                                            value={modelConfig.temperature}
                                                            onValueChange={(value) => setModelConfig(prev => ({ ...prev, temperature: value }))}
                                                            max={2}
                                                            min={0}
                                                            step={0.1}
                                                            className="w-full"
                                                        />
                                                        <div className="flex justify-between text-sm text-muted-foreground">
                                                            <span>0 (Focused)</span>
                                                            <span>Current: {modelConfig.temperature[0]}</span>
                                                            <span>2 (Creative)</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="text-sm font-medium mb-2 block">Max Tokens</label>
                                                    <div className="space-y-2">
                                                        <Slider
                                                            value={modelConfig.maxTokens}
                                                            onValueChange={(value) => setModelConfig(prev => ({ ...prev, maxTokens: value }))}
                                                            max={4096}
                                                            min={1}
                                                            step={1}
                                                            className="w-full"
                                                        />
                                                        <div className="flex justify-between text-sm text-muted-foreground">
                                                            <span>1</span>
                                                            <span>Current: {modelConfig.maxTokens[0]}</span>
                                                            <span>4096</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="text-sm font-medium mb-2 block">System Prompt</label>
                                                    <Textarea
                                                        value={modelConfig.systemPrompt}
                                                        onChange={(e) => setModelConfig(prev => ({ ...prev, systemPrompt: e.target.value }))}
                                                        placeholder="Enter system prompt..."
                                                        rows={4}
                                                    />
                                                </div>

                                                <Button className="w-full">
                                                    <Settings className="h-4 w-4 mr-2" />
                                                    Save Configuration
                                                </Button>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="safety" className="border rounded-lg p-6 bg-card space-y-6">
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle className="text-lg">Content Filtering</CardTitle>
                                                    <CardDescription>Configure safety filters and content moderation for this model</CardDescription>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div className="flex items-center justify-between">
                                                            <div className="space-y-0.5">
                                                                <label className="text-base font-medium">Profanity Filter</label>
                                                                <p className="text-sm text-muted-foreground">
                                                                    Block inappropriate language
                                                                </p>
                                                            </div>
                                                            <Switch defaultChecked={true} />
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <div className="space-y-0.5">
                                                                <label className="text-base font-medium">Spam Detection</label>
                                                                <p className="text-sm text-muted-foreground">
                                                                    Detect and prevent spam messages
                                                                </p>
                                                            </div>
                                                            <Switch defaultChecked={true} />
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <div className="space-y-0.5">
                                                                <label className="text-base font-medium">PII Protection</label>
                                                                <p className="text-sm text-muted-foreground">
                                                                    Protect personal information
                                                                </p>
                                                            </div>
                                                            <Switch defaultChecked={true} />
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <div className="space-y-0.5">
                                                                <label className="text-base font-medium">Harmful Content</label>
                                                                <p className="text-sm text-muted-foreground">
                                                                    Block harmful or dangerous content
                                                                </p>
                                                            </div>
                                                            <Switch defaultChecked={true} />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-3">
                                                        <label className="text-sm font-medium">Custom Blocked Words</label>
                                                        <Textarea
                                                            placeholder="Enter words or phrases to block, separated by commas"
                                                            rows={3}
                                                        />
                                                        <p className="text-xs text-muted-foreground">
                                                            These words will be automatically filtered from conversations
                                                        </p>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <Card>
                                                <CardHeader>
                                                    <CardTitle className="text-lg">Escalation Rules</CardTitle>
                                                    <CardDescription>Define when to escalate to human agents</CardDescription>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    <div className="space-y-3">
                                                        <div className="p-4 border rounded-lg">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <span className="font-medium">Complex Technical Issues</span>
                                                                <Switch defaultChecked={true} />
                                                            </div>
                                                            <p className="text-sm text-muted-foreground">
                                                                Escalate when AI confidence is below 70%
                                                            </p>
                                                        </div>

                                                        <div className="p-4 border rounded-lg">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <span className="font-medium">Billing & Payment Issues</span>
                                                                <Switch defaultChecked={true} />
                                                            </div>
                                                            <p className="text-sm text-muted-foreground">
                                                                Always escalate financial inquiries
                                                            </p>
                                                        </div>

                                                        <div className="p-4 border rounded-lg">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <span className="font-medium">Frustrated Customers</span>
                                                                <Switch defaultChecked={true} />
                                                            </div>
                                                            <p className="text-sm text-muted-foreground">
                                                                Detect negative sentiment and escalate
                                                            </p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </TabsContent>

                                        <TabsContent value="analytics" className="border rounded-lg p-6 bg-card space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle className="text-lg">Usage Trends</CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="space-y-4">
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-sm">This Week</span>
                                                                <span className="font-semibold">342 requests</span>
                                                            </div>
                                                            <Progress value={75} />
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-sm">Last Week</span>
                                                                <span className="font-semibold">298 requests</span>
                                                            </div>
                                                            <Progress value={65} />
                                                        </div>
                                                    </CardContent>
                                                </Card>

                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle className="text-lg">Cost Analysis</CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="space-y-4">
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-sm">This Month</span>
                                                                <span className="font-semibold">$42.50</span>
                                                            </div>
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-sm">Last Month</span>
                                                                <span className="font-semibold">$38.20</span>
                                                            </div>
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-sm">Projected</span>
                                                                <span className="font-semibold">$55.00</span>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </div>

                                            <Card>
                                                <CardHeader>
                                                    <CardTitle className="text-lg">Performance Metrics</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <div className="text-center p-4 bg-muted rounded-lg">
                                                            <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                                                            <p className="text-2xl font-bold">99.2%</p>
                                                            <p className="text-sm text-muted-foreground">Success Rate</p>
                                                        </div>
                                                        <div className="text-center p-4 bg-muted rounded-lg">
                                                            <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                                                            <p className="text-2xl font-bold">1.2s</p>
                                                            <p className="text-sm text-muted-foreground">Avg Response Time</p>
                                                        </div>
                                                        <div className="text-center p-4 bg-muted rounded-lg">
                                                            <Target className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                                                            <p className="text-2xl font-bold">4.8/5</p>
                                                            <p className="text-sm text-muted-foreground">Quality Score</p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <Card>
                                                <CardHeader>
                                                    <CardTitle className="text-lg">Performance Tracking</CardTitle>
                                                    <CardDescription>Monitor AI performance and conversation quality</CardDescription>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <div className="flex items-center justify-between">
                                                            <div className="space-y-0.5">
                                                                <label className="text-base font-medium">Response Time Tracking</label>
                                                                <p className="text-sm text-muted-foreground">
                                                                    Monitor AI response speed
                                                                </p>
                                                            </div>
                                                            <Switch defaultChecked={true} />
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <div className="space-y-0.5">
                                                                <label className="text-base font-medium">Satisfaction Scoring</label>
                                                                <p className="text-sm text-muted-foreground">
                                                                    Track user satisfaction ratings
                                                                </p>
                                                            </div>
                                                            <Switch defaultChecked={true} />
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <div className="space-y-0.5">
                                                                <label className="text-base font-medium">Conversation Analytics</label>
                                                                <p className="text-sm text-muted-foreground">
                                                                    Analyze conversation patterns
                                                                </p>
                                                            </div>
                                                            <Switch defaultChecked={true} />
                                                        </div>

                                                        <div className="flex items-center justify-between">
                                                            <div className="space-y-0.5">
                                                                <label className="text-base font-medium">Cost Tracking</label>
                                                                <p className="text-sm text-muted-foreground">
                                                                    Monitor API usage and costs
                                                                </p>
                                                            </div>
                                                            <Switch defaultChecked={true} />
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            <Card>
                                                <CardHeader>
                                                    <CardTitle className="text-lg">Data Export</CardTitle>
                                                    <CardDescription>Export conversation data and analytics</CardDescription>
                                                </CardHeader>
                                                <CardContent className="space-y-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <Button variant="outline" className="justify-start">
                                                            <Download className="h-4 w-4 mr-2" />
                                                            Export Conversations
                                                        </Button>
                                                        <Button variant="outline" className="justify-start">
                                                            <Download className="h-4 w-4 mr-2" />
                                                            Export Analytics
                                                        </Button>
                                                        <Button variant="outline" className="justify-start">
                                                            <Download className="h-4 w-4 mr-2" />
                                                            Export User Feedback
                                                        </Button>
                                                        <Button variant="outline" className="justify-start">
                                                            <Download className="h-4 w-4 mr-2" />
                                                            Export Performance Data
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </TabsContent>

                                        <TabsContent value="settings" className="border rounded-lg p-6 bg-card space-y-6">
                                            <div className="space-y-6">
                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle className="text-lg">Model Configuration</CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="space-y-4">
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <p className="font-medium">Auto-scaling</p>
                                                                <p className="text-sm text-muted-foreground">Automatically scale based on demand</p>
                                                            </div>
                                                            <Switch />
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <p className="font-medium">Monitoring</p>
                                                                <p className="text-sm text-muted-foreground">Enable performance monitoring</p>
                                                            </div>
                                                            <Switch defaultChecked />
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <p className="font-medium">Rate Limiting</p>
                                                                <p className="text-sm text-muted-foreground">Limit requests per minute</p>
                                                            </div>
                                                            <Switch defaultChecked />
                                                        </div>
                                                    </CardContent>
                                                </Card>

                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle className="text-lg text-red-600">Danger Zone</CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="space-y-4">
                                                        <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                                                            <div>
                                                                <p className="font-medium">Reset Model Configuration</p>
                                                                <p className="text-sm text-muted-foreground">Reset all settings to default values</p>
                                                            </div>
                                                            <Button variant="outline" size="sm">
                                                                <RotateCcw className="h-4 w-4 mr-2" />
                                                                Reset
                                                            </Button>
                                                        </div>
                                                        <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                                                            <div>
                                                                <p className="font-medium">Deactivate Model</p>
                                                                <p className="text-sm text-muted-foreground">Temporarily disable this model</p>
                                                            </div>
                                                            <Button variant="destructive" size="sm">
                                                                <AlertTriangle className="h-4 w-4 mr-2" />
                                                                Deactivate
                                                            </Button>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </TabsContent>
                                    </Tabs>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card>
                                <CardContent className="p-12 text-center">
                                    <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold mb-2">Select a Model</h3>
                                    <p className="text-muted-foreground">Choose a model from the list to view details and start testing</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ModelsPage;