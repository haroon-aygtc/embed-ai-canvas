import React, { useState, useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Input, SearchInput } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchableSelect } from '@/components/ui/combobox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Brain, Database, Shield, BarChart3, Settings, Plus, X, Upload, Download,
    Cpu, Zap, Target, TrendingUp, Clock, DollarSign, Activity, CheckCircle,
    AlertTriangle, Info, Sparkles, FileText, Play, Pause, RefreshCw, Monitor,
    Gauge, Users, MessageSquare, Eye, Edit, Trash2, Copy, ChevronLeft, ChevronRight,
    Grid3X3, List, Timer, TestTube, BarChart, History, FileDown, Repeat,
    Loader2, TrendingDown, Wifi, WifiOff, Calendar, Filter
} from 'lucide-react';
import { WidgetConfig } from './WidgetConfiguration';
import { EnterpriseCard, MetricCard, FeatureCard } from '@/components/ui/EnterpriseCard';

interface EnhancedAIModelConfigProps {
    config: WidgetConfig;
    onConfigChange: (updates: Partial<WidgetConfig>) => void;
}

export const EnhancedAIModelConfig = ({ config, onConfigChange }: EnhancedAIModelConfigProps) => {
    const [selectedProvider, setSelectedProvider] = useState('openai');
    const [selectedModel, setSelectedModel] = useState('gpt-4');
    const [temperature, setTemperature] = useState([0.7]);
    const [maxTokens, setMaxTokens] = useState([1000]);
    const [isTestingModel, setIsTestingModel] = useState(false);
    const [testResult, setTestResult] = useState<string | null>(null);
    const [systemPrompt, setSystemPrompt] = useState('You are a helpful customer support assistant for ChatWidget Pro. Be friendly, professional, and provide accurate information about our chat widget platform.');

    // New state for enhanced features
    const [testingModel, setTestingModel] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('model');
    const [activeModels, setActiveModels] = useState<Set<string>>(new Set(['gpt-4', 'claude-3-opus', 'llama-3-70b'])); // Default active models

    // Chat testing state
    const [chatMessages, setChatMessages] = useState<any[]>([]);
    const [chatInput, setChatInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const providerScrollRef = useRef<HTMLDivElement>(null);
    const chatScrollRef = useRef<HTMLDivElement>(null);

    const providers = [
        {
            id: 'openai',
            name: 'OpenAI',
            icon: Brain,
            iconColor: 'text-blue-600',
            description: 'Industry-leading AI models with exceptional performance',
            status: 'connected' as const,
            models: [
                {
                    id: 'gpt-4',
                    name: 'GPT-4',
                    description: 'Most capable model for complex reasoning and analysis',
                    cost: '$0.03/1k',
                    recommended: true,
                    contextWindow: '128K',
                    capabilities: ['Reasoning', 'Code', 'Analysis', 'Creative Writing'],
                    performance: { speed: 85, accuracy: 95, cost: 70 }
                },
                {
                    id: 'gpt-4-turbo',
                    name: 'GPT-4 Turbo',
                    description: 'Faster and more cost-effective version',
                    cost: '$0.01/1k',
                    recommended: false,
                    contextWindow: '128K',
                    capabilities: ['Reasoning', 'Code', 'Vision', 'JSON Mode'],
                    performance: { speed: 95, accuracy: 90, cost: 85 }
                },
                {
                    id: 'gpt-3.5-turbo',
                    name: 'GPT-3.5 Turbo',
                    description: 'Fast and efficient for simple conversational tasks',
                    cost: '$0.002/1k',
                    recommended: false,
                    contextWindow: '16K',
                    capabilities: ['Conversation', 'Code', 'Basic Reasoning'],
                    performance: { speed: 98, accuracy: 80, cost: 95 }
                }
            ]
        },
        {
            id: 'anthropic',
            name: 'Anthropic',
            icon: Sparkles,
            iconColor: 'text-purple-600',
            description: 'Constitutional AI with strong safety and reasoning capabilities',
            status: 'connected' as const,
            models: [
                {
                    id: 'claude-3-opus',
                    name: 'Claude 3 Opus',
                    description: 'Most intelligent model for complex reasoning and analysis',
                    cost: '$0.015/1k',
                    recommended: true,
                    contextWindow: '200K',
                    capabilities: ['Advanced Reasoning', 'Analysis', 'Math', 'Research'],
                    performance: { speed: 75, accuracy: 98, cost: 60 }
                },
                {
                    id: 'claude-3-sonnet',
                    name: 'Claude 3 Sonnet',
                    description: 'Balanced performance and cost for most use cases',
                    cost: '$0.003/1k',
                    recommended: false,
                    contextWindow: '200K',
                    capabilities: ['Reasoning', 'Analysis', 'Code', 'Writing'],
                    performance: { speed: 88, accuracy: 92, cost: 80 }
                }
            ]
        },
        {
            id: 'groq',
            name: 'Groq',
            icon: Zap,
            iconColor: 'text-yellow-600',
            description: 'Ultra-fast inference with specialized hardware acceleration',
            status: 'connected' as const,
            models: [
                {
                    id: 'llama-3-70b',
                    name: 'Llama 3 70B',
                    description: 'Large open-source model with excellent performance',
                    cost: '$0.0008/1k',
                    recommended: true,
                    contextWindow: '32K',
                    capabilities: ['Reasoning', 'Code', 'Multilingual', 'Open Source'],
                    performance: { speed: 99, accuracy: 88, cost: 95 }
                }
            ]
        }
    ];

    const knowledgeBases = [
        {
            id: 1,
            name: 'Product Documentation',
            type: 'docs',
            size: '2.3 MB',
            status: 'active' as const,
            lastUpdated: '2 hours ago',
            documents: 45,
            icon: FileText
        },
        {
            id: 2,
            name: 'FAQ Database',
            type: 'faq',
            size: '850 KB',
            status: 'active' as const,
            lastUpdated: '1 day ago',
            documents: 128,
            icon: Info
        },
        {
            id: 3,
            name: 'Support Tickets',
            type: 'tickets',
            size: '5.1 MB',
            status: 'training' as const,
            lastUpdated: '5 minutes ago',
            documents: 1250,
            icon: Activity
        }
    ];

    const currentProvider = providers.find(p => p.id === selectedProvider);
    const currentModel = currentProvider?.models.find(m => m.id === selectedModel);

    const handleTestModel = async () => {
        setIsTestingModel(true);
        setTestResult(null);

        setTimeout(() => {
            setTestResult('✅ Model test successful! Response time: 850ms. The model is working correctly and ready for production use.');
            setIsTestingModel(false);
        }, 2000);
    };

    // Model management functions
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

    const toggleAllModels = (active: boolean) => {
        if (active) {
            const allModelIds = providers.flatMap(p => p.models.map(m => m.id));
            setActiveModels(new Set(allModelIds));
        } else {
            setActiveModels(new Set());
        }
    };

    const startModelTest = (modelId: string) => {
        const model = providers.flatMap(p => p.models).find(m => m.id === modelId);
        if (model) {
            setTestingModel(modelId);
            setActiveTab('testing');
            setChatMessages([
                {
                    id: Date.now(),
                    type: 'ai',
                    content: `Hi! I'm ${model.name}. I'm ready to help you test my capabilities. What would you like to try?`,
                    timestamp: new Date()
                }
            ]);
        }
    };

    // Provider scroll functions
    const scrollProviders = (direction: 'left' | 'right') => {
        if (providerScrollRef.current) {
            const scrollAmount = 300;
            const newScrollLeft = direction === 'left'
                ? providerScrollRef.current.scrollLeft - scrollAmount
                : providerScrollRef.current.scrollLeft + scrollAmount;

            providerScrollRef.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });
        }
    };

    // Chat testing functions
    const sendChatMessage = async () => {
        if (!chatInput.trim()) return;

        const userMessage = {
            id: Date.now(),
            type: 'user',
            content: chatInput,
            timestamp: new Date()
        };

        setChatMessages(prev => [...prev, userMessage]);
        setChatInput('');
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            const responses = [
                "That's an interesting question! Let me help you with that.",
                "I understand what you're asking. Here's my response based on the current model configuration.",
                "Great question! The AI model is working well and can handle various types of queries.",
                "I'm processing your request using the selected AI model. The response time looks good!",
                "Thanks for testing! This demonstrates the model's conversational capabilities.",
                "I can help you with that. The current model shows excellent performance metrics.",
                "That's a thoughtful query. The AI is responding appropriately to your input.",
                "Perfect! This test shows how the model handles different conversation styles."
            ];

            const aiMessage = {
                id: Date.now() + 1,
                type: 'ai',
                content: responses[Math.floor(Math.random() * responses.length)],
                timestamp: new Date(),
                responseTime: Math.floor(Math.random() * 500) + 200,
                tokens: Math.floor(Math.random() * 50) + 20
            };

            setChatMessages(prev => [...prev, aiMessage]);
            setIsTyping(false);

            // Auto scroll to bottom
            setTimeout(() => {
                if (chatScrollRef.current) {
                    chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
                }
            }, 100);
        }, 1500 + Math.random() * 1000);
    };

    const clearChat = () => {
        const model = providers.flatMap(p => p.models).find(m => m.id === testingModel);
        setChatMessages([
            {
                id: 1,
                type: 'ai',
                content: `Hi! I'm ${model?.name || 'AI Assistant'}. I'm ready to help you test my capabilities. What would you like to try?`,
                timestamp: new Date()
            }
        ]);
    };

    const exportChatLog = () => {
        const chatLog = chatMessages.map(msg =>
            `[${msg.timestamp.toLocaleTimeString()}] ${msg.type.toUpperCase()}: ${msg.content}`
        ).join('\n');

        const blob = new Blob([chatLog], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat-test-${new Date().toISOString().split('T')[0]}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const safetyFeatures = [
        {
            id: 'profanity',
            title: 'Profanity Filter',
            description: 'Block inappropriate language and offensive content',
            icon: Shield,
            enabled: true
        },
        {
            id: 'spam',
            title: 'Spam Detection',
            description: 'Detect and prevent spam messages automatically',
            icon: AlertTriangle,
            enabled: true
        },
        {
            id: 'pii',
            title: 'PII Protection',
            description: 'Protect personal identifiable information',
            icon: Eye,
            enabled: true
        },
        {
            id: 'harmful',
            title: 'Harmful Content',
            description: 'Block harmful or dangerous content',
            icon: X,
            enabled: true
        }
    ];

    return (
        <div className="space-y-6">
            {/* Performance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MetricCard
                    title="Active Model"
                    value={currentModel?.name || 'None'}
                    icon={Brain}
                    trend="neutral"
                />
                <MetricCard
                    title="Response Time"
                    value="850ms"
                    change="-12% from last week"
                    icon={Clock}
                    trend="up"
                />
                <MetricCard
                    title="Monthly Cost"
                    value="$127.45"
                    change="+8% from last month"
                    icon={DollarSign}
                    trend="down"
                />
                <MetricCard
                    title="Success Rate"
                    value="99.2%"
                    change="+0.3% from last week"
                    icon={TrendingUp}
                    trend="up"
                />
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="model" className="flex items-center gap-2">
                        <Brain className="h-4 w-4" />
                        Configuration
                    </TabsTrigger>
                    <TabsTrigger value="parameters" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Parameters
                    </TabsTrigger>
                    <TabsTrigger value="testing" className="flex items-center gap-2">
                        <TestTube className="h-4 w-4" />
                        Testing
                        {testingModel && (
                            <Badge variant="secondary" className="ml-1 text-xs">
                                Active
                            </Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="knowledge" className="flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        Knowledge Base
                    </TabsTrigger>
                    <TabsTrigger value="safety" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Safety & Filters
                    </TabsTrigger>
                    <TabsTrigger value="analytics" className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Analytics
                    </TabsTrigger>
                </TabsList>

                {/* Model Selection Tab */}
                <TabsContent value="model" className="space-y-6">
                    <EnterpriseCard
                        title="AI Provider Selection"
                        description="Choose your preferred AI provider for powering the chat widget"
                        icon={Cpu}
                        variant="elevated"
                        actions={
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => scrollProviders('left')}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => scrollProviders('right')}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        }
                    >
                        <div className="relative">
                            <div
                                ref={providerScrollRef}
                                className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2"
                                style={{ scrollSnapType: 'x mandatory' }}
                            >
                                {providers.map((provider) => (
                                    <Card
                                        key={provider.id}
                                        className={`flex-shrink-0 w-80 cursor-pointer transition-all duration-200 hover:scale-[1.02] focus:outline-none ${selectedProvider === provider.id
                                            ? 'border-primary bg-primary/5 shadow-md'
                                            : 'border-border hover:border-primary/50'
                                            }`}
                                        style={{ scrollSnapAlign: 'start' }}
                                        onClick={() => {
                                            setSelectedProvider(provider.id);
                                            setSelectedModel(provider.models[0].id);
                                        }}
                                        tabIndex={-1}
                                        role="button"
                                        aria-label={`Select ${provider.name} provider`}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-center space-x-3 mb-3">
                                                <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                                                    <provider.icon className={`h-6 w-6 ${provider.iconColor}`} />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-lg">{provider.name}</h4>
                                                    <Badge variant="outline" className="text-xs">
                                                        {provider.status}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-3">
                                                {provider.description}
                                            </p>
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-muted-foreground">
                                                    {provider.models.length} models available
                                                </span>
                                                <div className="flex items-center space-x-1">
                                                    <Wifi className="h-3 w-3 text-green-500" />
                                                    <span className="text-green-600 font-medium">Connected</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </EnterpriseCard>

                    <EnterpriseCard
                        title="AI Model Management"
                        description="Manage and configure your AI models with advanced controls"
                        icon={Brain}
                        variant="elevated"
                        actions={
                            <div className="flex items-center space-x-2">
                                <div className="flex items-center space-x-2 text-sm">
                                    <span className="text-muted-foreground">
                                        {activeModels.size} of {providers.flatMap(p => p.models).length} active
                                    </span>
                                    <div className="h-4 w-px bg-border"></div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => toggleAllModels(activeModels.size === 0)}
                                >
                                    {activeModels.size === 0 ? (
                                        <>
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Enable All
                                        </>
                                    ) : (
                                        <>
                                            <X className="h-4 w-4 mr-2" />
                                            Disable All
                                        </>
                                    )}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        const container = document.getElementById('model-scroll-container');
                                        if (container) {
                                            container.scrollLeft -= 300;
                                        }
                                    }}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        const container = document.getElementById('model-scroll-container');
                                        if (container) {
                                            container.scrollLeft += 300;
                                        }
                                    }}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        }
                    >
                        <div className="relative">
                            <div
                                id="model-scroll-container"
                                className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2"
                                style={{ scrollSnapType: 'x mandatory' }}
                            >
                                {providers.flatMap(provider =>
                                    provider.models.map((model) => {
                                        const isActive = activeModels.has(model.id);
                                        const isSelected = selectedModel === model.id;
                                        const isTesting = testingModel === model.id;
                                        return (
                                            <Card
                                                key={model.id}
                                                className={`flex-shrink-0 w-80 cursor-pointer transition-all duration-200 hover:scale-[1.02] focus:outline-none ${isSelected
                                                    ? 'border-primary bg-primary/5 shadow-md ring-2 ring-primary/20'
                                                    : isActive
                                                        ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950 hover:border-primary/50'
                                                        : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900 hover:border-primary/50'
                                                    }`}
                                                style={{ scrollSnapAlign: 'start' }}
                                                onClick={() => setSelectedModel(model.id)}
                                                tabIndex={-1}
                                                role="button"
                                                aria-label={`Select ${model.name} model`}
                                            >
                                                <CardContent className="p-4">
                                                    {/* Model Header */}
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex items-center space-x-3">
                                                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isSelected
                                                                ? 'bg-primary text-primary-foreground'
                                                                : isActive
                                                                    ? 'bg-green-100 dark:bg-green-900'
                                                                    : 'bg-gray-100 dark:bg-gray-800'
                                                                }`}>
                                                                <provider.icon className="h-6 w-6" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="flex items-center space-x-2 mb-1">
                                                                    <h4 className="font-semibold text-base">{model.name}</h4>
                                                                    {model.recommended && (
                                                                        <Badge variant="secondary" className="text-xs">
                                                                            <Target className="h-3 w-3 mr-1" />
                                                                            Recommended
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                                <p className="text-xs text-muted-foreground">{provider.name}</p>
                                                            </div>
                                                        </div>

                                                        {/* Active/Inactive Toggle */}
                                                        <div className="flex flex-col items-end space-y-2">
                                                            <Switch
                                                                checked={isActive}
                                                                onCheckedChange={() => toggleModelActive(model.id)}
                                                                onClick={(e) => e.stopPropagation()}
                                                                className="data-[state=checked]:bg-green-500"
                                                            />
                                                            <span className={`text-xs font-medium ${isActive ? 'text-green-600 dark:text-green-400' : 'text-gray-500'
                                                                }`}>
                                                                {isActive ? 'Active' : 'Inactive'}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Model Description */}
                                                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                                        {model.description}
                                                    </p>

                                                    {/* Model Details */}
                                                    <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
                                                        <div>
                                                            <span className="text-muted-foreground">Cost:</span>
                                                            <div className="font-semibold">{model.cost}</div>
                                                        </div>
                                                        <div>
                                                            <span className="text-muted-foreground">Context:</span>
                                                            <div className="font-semibold">{model.contextWindow}</div>
                                                        </div>
                                                    </div>

                                                    {/* Performance Metrics */}
                                                    <div className="space-y-2 mb-4">
                                                        <div className="flex items-center justify-between text-xs">
                                                            <span className="text-muted-foreground">Speed</span>
                                                            <span className="font-medium">{model.performance.speed}%</span>
                                                        </div>
                                                        <div className="w-full bg-muted rounded-full h-1.5">
                                                            <div
                                                                className="bg-green-500 h-1.5 rounded-full transition-all"
                                                                style={{ width: `${model.performance.speed}%` }}
                                                            />
                                                        </div>

                                                        <div className="flex items-center justify-between text-xs">
                                                            <span className="text-muted-foreground">Accuracy</span>
                                                            <span className="font-medium">{model.performance.accuracy}%</span>
                                                        </div>
                                                        <div className="w-full bg-muted rounded-full h-1.5">
                                                            <div
                                                                className="bg-blue-500 h-1.5 rounded-full transition-all"
                                                                style={{ width: `${model.performance.accuracy}%` }}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Capabilities */}
                                                    <div className="flex flex-wrap gap-1 mb-4">
                                                        {model.capabilities.slice(0, 3).map((capability) => (
                                                            <Badge key={capability} variant="outline" className="text-xs">
                                                                {capability}
                                                            </Badge>
                                                        ))}
                                                        {model.capabilities.length > 3 && (
                                                            <Badge variant="outline" className="text-xs">
                                                                +{model.capabilities.length - 3}
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    {/* Action Buttons */}
                                                    <div className="flex items-center space-x-2 pt-3 border-t">
                                                        <Button
                                                            size="sm"
                                                            variant={isTesting ? "default" : "outline"}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                startModelTest(model.id);
                                                            }}
                                                            className="flex-1"
                                                            disabled={!isActive}
                                                        >
                                                            {isTesting ? (
                                                                <>
                                                                    <Monitor className="h-3 w-3 mr-1" />
                                                                    Testing
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Play className="h-3 w-3 mr-1" />
                                                                    Test
                                                                </>
                                                            )}
                                                        </Button>

                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedModel(model.id);
                                                            }}
                                                            className="px-2"
                                                        >
                                                            <Settings className="h-3 w-3" />
                                                        </Button>
                                                    </div>

                                                    {/* Status Indicators */}
                                                    <div className="flex items-center justify-between mt-3 text-xs">
                                                        <div className="flex items-center space-x-2">
                                                            {isTesting && (
                                                                <>
                                                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                                                    <span className="text-blue-600 font-medium">Testing Active</span>
                                                                </>
                                                            )}
                                                            {isSelected && !isTesting && (
                                                                <>
                                                                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                                                                    <span className="text-primary font-medium">Selected</span>
                                                                </>
                                                            )}
                                                            {!isSelected && !isTesting && isActive && (
                                                                <>
                                                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                                    <span className="text-green-600 font-medium">Ready</span>
                                                                </>
                                                            )}
                                                            {!isActive && (
                                                                <>
                                                                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                                                    <span className="text-gray-500">Disabled</span>
                                                                </>
                                                            )}
                                                        </div>

                                                        <div className="flex items-center space-x-1">
                                                            <DollarSign className="h-3 w-3 text-muted-foreground" />
                                                            <span className="text-muted-foreground">{model.cost}</span>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        );
                                    })
                                )}

                                {/* Add New Model Card */}
                                <Card className="flex-shrink-0 w-80 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary/50 transition-colors cursor-pointer">
                                    <CardContent className="p-4 h-full flex flex-col items-center justify-center text-center">
                                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-3">
                                            <Plus className="h-6 w-6 text-gray-400" />
                                        </div>
                                        <h4 className="font-semibold text-base mb-2">Add Custom Model</h4>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Connect your own AI model or configure additional providers
                                        </p>
                                        <Button variant="outline" size="sm">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Model
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Scroll Indicators */}
                            <div className="flex justify-center mt-4 space-x-2">
                                {Array.from({ length: Math.ceil((providers.flatMap(p => p.models).length + 1) / 4) }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600"
                                    />
                                ))}
                            </div>
                        </div>
                    </EnterpriseCard>

                    {/* Model Performance Overview */}
                    <EnterpriseCard
                        title="Model Performance Overview"
                        description="Real-time statistics and performance metrics for your active models"
                        icon={BarChart3}
                        variant="elevated"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <Card className="p-4">
                                <div className="flex items-center space-x-2 mb-2">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <span className="font-medium text-sm">Active Models</span>
                                </div>
                                <div className="text-2xl font-bold text-green-600">
                                    {activeModels.size}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    of {providers.flatMap(p => p.models).length} total
                                </p>
                            </Card>

                            <Card className="p-4">
                                <div className="flex items-center space-x-2 mb-2">
                                    <Timer className="h-4 w-4 text-blue-600" />
                                    <span className="font-medium text-sm">Avg Response</span>
                                </div>
                                <div className="text-2xl font-bold text-blue-600">
                                    {Math.round(providers.flatMap(p => p.models.filter(m => activeModels.has(m.id))).reduce((acc, m) => acc + (m.performance.speed * 10), 0) / Math.max(activeModels.size, 1))}ms
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    across active models
                                </p>
                            </Card>

                            <Card className="p-4">
                                <div className="flex items-center space-x-2 mb-2">
                                    <DollarSign className="h-4 w-4 text-purple-600" />
                                    <span className="font-medium text-sm">Est. Monthly Cost</span>
                                </div>
                                <div className="text-2xl font-bold text-purple-600">
                                    $127
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    based on usage
                                </p>
                            </Card>

                            <Card className="p-4">
                                <div className="flex items-center space-x-2 mb-2">
                                    <TestTube className="h-4 w-4 text-orange-600" />
                                    <span className="font-medium text-sm">Tests Run</span>
                                </div>
                                <div className="text-2xl font-bold text-orange-600">
                                    {testingModel ? '1' : '0'}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    this session
                                </p>
                            </Card>
                        </div>
                    </EnterpriseCard>
                </TabsContent>

                {/* Parameters Tab */}
                <TabsContent value="parameters" className="space-y-6">
                    <EnterpriseCard
                        title="System Prompt Configuration"
                        description="Define how your AI assistant should behave and respond"
                        icon={MessageSquare}
                        variant="elevated"
                    >
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>System Prompt</Label>
                                <Textarea
                                    value={systemPrompt}
                                    onChange={(e) => setSystemPrompt(e.target.value)}
                                    rows={4}
                                    className="font-mono text-sm"
                                />
                                <p className="text-xs text-muted-foreground">
                                    This prompt defines how the AI should behave and respond to users
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Response Style</Label>
                                    <SearchableSelect
                                        options={[
                                            { value: 'creative', label: '🎨 Creative' },
                                            { value: 'balanced', label: '⚖️ Balanced' },
                                            { value: 'precise', label: '🎯 Precise' },
                                            { value: 'friendly', label: '😊 Friendly' },
                                            { value: 'professional', label: '💼 Professional' }
                                        ]}
                                        value={temperature[0].toString()}
                                        onValueChange={(value) => setTemperature([Number(value)])}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Response Format</Label>
                                    <Select defaultValue="conversational">
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="conversational">💬 Conversational</SelectItem>
                                            <SelectItem value="structured">📋 Structured</SelectItem>
                                            <SelectItem value="bullet-points">• Bullet Points</SelectItem>
                                            <SelectItem value="step-by-step">📝 Step-by-step</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </EnterpriseCard>

                    <EnterpriseCard
                        title="Model Parameters"
                        description="Fine-tune the AI's behavior and response characteristics"
                        icon={Gauge}
                        variant="elevated"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="space-y-3">
                                    <Label>Temperature: {temperature[0]}</Label>
                                    <Slider
                                        value={temperature}
                                        onValueChange={setTemperature}
                                        max={2}
                                        min={0}
                                        step={0.1}
                                        className="w-full"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Controls creativity. Lower = more focused, Higher = more creative
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <Label>Max Tokens: {maxTokens[0]}</Label>
                                    <Slider
                                        value={maxTokens}
                                        onValueChange={setMaxTokens}
                                        max={4000}
                                        min={100}
                                        step={100}
                                        className="w-full"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Maximum response length. Higher = longer responses
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Card className="p-4 bg-muted/50">
                                    <h4 className="font-medium mb-2">Current Configuration</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Model:</span>
                                            <span>{currentModel?.name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Temperature:</span>
                                            <span>{temperature[0]}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Max Tokens:</span>
                                            <span>{maxTokens[0]}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Est. Cost:</span>
                                            <span>{currentModel?.cost}</span>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </EnterpriseCard>
                </TabsContent>

                {/* Simplified Testing Tab */}
                <TabsContent value="testing" className="space-y-6">
                    {!testingModel ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <TestTube className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">No Model Selected for Testing</h3>
                            <p className="text-muted-foreground mb-4">
                                Go to the Configuration tab and click "Test Model" on any AI model to start testing.
                            </p>
                            <Button
                                variant="outline"
                                onClick={() => setActiveTab('model')}
                            >
                                <Brain className="h-4 w-4 mr-2" />
                                Go to Configuration
                            </Button>
                        </div>
                    ) : (
                        <EnterpriseCard
                            title="AI Model Testing"
                            description={`Testing ${providers.flatMap(p => p.models).find(m => m.id === testingModel)?.name || 'AI Model'} - Chat with the model to test its capabilities`}
                            icon={MessageSquare}
                            variant="elevated"
                            actions={
                                <div className="flex items-center space-x-2">
                                    <Badge variant="secondary" className="text-xs">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1"></div>
                                        Testing Active
                                    </Badge>
                                    <Button variant="outline" size="sm" onClick={clearChat}>
                                        <RefreshCw className="h-4 w-4 mr-2" />
                                        Clear
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={exportChatLog}>
                                        <Download className="h-4 w-4 mr-2" />
                                        Export
                                    </Button>
                                </div>
                            }
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Chat Interface */}
                                <div className="lg:col-span-2">
                                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 rounded-xl border">
                                        {/* Chat Header */}
                                        <div className="flex items-center justify-between p-4 border-b bg-white/50 dark:bg-gray-800/50 rounded-t-xl">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                                                    <Brain className="h-5 w-5 text-white" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold">
                                                        {providers.flatMap(p => p.models).find(m => m.id === testingModel)?.name || 'AI Model'}
                                                    </h4>
                                                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                                        <span>Testing Mode</span>
                                                        <span>•</span>
                                                        <span>
                                                            {providers.find(p => p.models.some(m => m.id === testingModel))?.name}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Badge variant="outline" className="text-xs">
                                                Testing Mode
                                            </Badge>
                                        </div>

                                        {/* Chat Messages */}
                                        <div
                                            ref={chatScrollRef}
                                            className="h-80 overflow-y-auto p-4 space-y-4"
                                        >
                                            {chatMessages.map((message) => (
                                                <div
                                                    key={message.id}
                                                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                                >
                                                    <div className={`max-w-xs lg:max-w-md ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                                                        <div
                                                            className={`px-4 py-2 rounded-2xl ${message.type === 'user'
                                                                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                                                                : 'bg-white dark:bg-gray-700 border shadow-sm'
                                                                }`}
                                                        >
                                                            <p className="text-sm">{message.content}</p>
                                                            {message.responseTime && (
                                                                <div className="flex items-center space-x-2 mt-1 text-xs opacity-70">
                                                                    <Timer className="h-3 w-3" />
                                                                    <span>{message.responseTime}ms</span>
                                                                    <span>•</span>
                                                                    <span>{message.tokens} tokens</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-muted-foreground mt-1 px-2">
                                                            {message.timestamp.toLocaleTimeString()}
                                                        </p>
                                                    </div>
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.type === 'user' ? 'order-1 ml-2' : 'order-2 mr-2'}`}>
                                                        {message.type === 'user' ? (
                                                            <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                                                                <Users className="h-4 w-4" />
                                                            </div>
                                                        ) : (
                                                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                                                                <Brain className="h-4 w-4 text-white" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Typing Indicator */}
                                            {isTyping && (
                                                <div className="flex justify-start">
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                                                            <Brain className="h-4 w-4 text-white" />
                                                        </div>
                                                        <div className="bg-white dark:bg-gray-700 border rounded-2xl px-4 py-2">
                                                            <div className="flex space-x-1">
                                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Chat Input */}
                                        <div className="p-4 border-t bg-white/50 dark:bg-gray-800/50 rounded-b-xl">
                                            <div className="flex items-center space-x-2">
                                                <div className="flex-1 relative">
                                                    <Input
                                                        value={chatInput}
                                                        onChange={(e) => setChatInput(e.target.value)}
                                                        placeholder="Type your message to test the AI model..."
                                                        className="pr-12 bg-white dark:bg-gray-700"
                                                        onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                                                    />
                                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
                                                        {chatInput.length}/500
                                                    </div>
                                                </div>
                                                <Button
                                                    onClick={sendChatMessage}
                                                    disabled={!chatInput.trim() || isTyping}
                                                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                                                >
                                                    {isTyping ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <Play className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Chat Metrics Sidebar */}
                                <div className="space-y-4">
                                    <Card className="p-4">
                                        <h4 className="font-semibold mb-3 flex items-center">
                                            <BarChart className="h-4 w-4 mr-2" />
                                            Chat Metrics
                                        </h4>
                                        <div className="space-y-3 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Messages:</span>
                                                <span className="font-medium">{chatMessages.length}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Avg Response:</span>
                                                <span className="font-medium">
                                                    {chatMessages.filter(m => m.responseTime).length > 0
                                                        ? Math.round(chatMessages.filter(m => m.responseTime).reduce((acc, m) => acc + (m.responseTime || 0), 0) / chatMessages.filter(m => m.responseTime).length)
                                                        : 0}ms
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Total Tokens:</span>
                                                <span className="font-medium">
                                                    {chatMessages.reduce((acc, m) => acc + (m.tokens || 0), 0)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Est. Cost:</span>
                                                <span className="font-medium">$0.{Math.floor(Math.random() * 50).toString().padStart(3, '0')}</span>
                                            </div>
                                        </div>
                                    </Card>

                                    <Card className="p-4">
                                        <h4 className="font-semibold mb-3 flex items-center">
                                            <Settings className="h-4 w-4 mr-2" />
                                            Quick Tests
                                        </h4>
                                        <div className="space-y-2">
                                            {[
                                                'What is artificial intelligence?',
                                                'Explain quantum computing',
                                                'Write a creative story',
                                                'Solve a math problem',
                                                'Code a simple function'
                                            ].map((prompt, index) => (
                                                <Button
                                                    key={index}
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full text-left justify-start text-xs"
                                                    onClick={() => setChatInput(prompt)}
                                                >
                                                    {prompt}
                                                </Button>
                                            ))}
                                        </div>
                                    </Card>

                                    <Card className="p-4">
                                        <h4 className="font-semibold mb-3 flex items-center">
                                            <Monitor className="h-4 w-4 mr-2" />
                                            Model Status
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                <span>Model Active</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                <span>Real-time Testing</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                                <span>Performance Tracking</span>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        </EnterpriseCard>
                    )}
                </TabsContent>

                {/* Knowledge Base Tab */}
                <TabsContent value="knowledge" className="space-y-6">
                    <EnterpriseCard
                        title="Knowledge Base Management"
                        description="Upload and manage your custom knowledge sources"
                        icon={Database}
                        variant="elevated"
                        actions={
                            <Button size="sm">
                                <Upload className="h-4 w-4 mr-2" />
                                Upload Files
                            </Button>
                        }
                    >
                        <div className="max-h-[500px] overflow-y-auto">
                            <div className="space-y-4 pr-2">
                                {knowledgeBases.map((kb) => (
                                    <Card key={kb.id} className="transition-all hover:shadow-md">
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                                                        <kb.icon className="h-5 w-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{kb.name}</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {kb.documents} documents • {kb.size} • Updated {kb.lastUpdated}
                                                        </div>
                                                    </div>
                                                    <Badge variant={kb.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                                                        {kb.status}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Button variant="ghost" size="sm">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm">
                                                        <Download className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}

                                <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600">
                                    <CardContent className="p-8 text-center">
                                        <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <h3 className="font-medium mb-2">Upload Knowledge Sources</h3>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Drag and drop files or click to browse. Supports PDF, TXT, CSV, and more.
                                        </p>
                                        <Button variant="outline">
                                            <Upload className="h-4 w-4 mr-2" />
                                            Choose Files
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </EnterpriseCard>
                </TabsContent>

                {/* Safety Tab */}
                <TabsContent value="safety" className="space-y-6">
                    <EnterpriseCard
                        title="Content Safety & Filtering"
                        description="Configure safety filters and content moderation"
                        icon={Shield}
                        variant="elevated"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {safetyFeatures.map((feature) => (
                                <FeatureCard
                                    key={feature.id}
                                    title={feature.title}
                                    description={feature.description}
                                    icon={feature.icon}
                                    enabled={feature.enabled}
                                    onToggle={(enabled) => {
                                        // Handle toggle
                                    }}
                                />
                            ))}
                        </div>

                        <div className="mt-6 space-y-3">
                            <Label>Custom Blocked Words</Label>
                            <Textarea
                                placeholder="Enter words or phrases to block, separated by commas"
                                rows={3}
                            />
                            <p className="text-xs text-muted-foreground">
                                These words will be automatically filtered from conversations
                            </p>
                        </div>
                    </EnterpriseCard>
                </TabsContent>

                {/* Analytics Tab */}
                <TabsContent value="analytics" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <EnterpriseCard
                            title="Usage Statistics"
                            description="Monitor AI performance and conversation quality"
                            icon={BarChart3}
                            variant="elevated"
                        >
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Total Requests</span>
                                    <span className="font-semibold">15,420</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Success Rate</span>
                                    <span className="font-semibold text-green-600">99.2%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Avg Response Time</span>
                                    <span className="font-semibold">850ms</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">User Satisfaction</span>
                                    <span className="font-semibold">4.8/5</span>
                                </div>
                            </div>
                        </EnterpriseCard>

                        <EnterpriseCard
                            title="Cost Analysis"
                            description="Track and optimize your AI usage costs"
                            icon={DollarSign}
                            variant="elevated"
                        >
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">This Month</span>
                                    <span className="font-semibold">$127.45</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Last Month</span>
                                    <span className="font-semibold">$98.32</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Projected</span>
                                    <span className="font-semibold">$156.78</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Cost per Request</span>
                                    <span className="font-semibold">$0.008</span>
                                </div>
                            </div>
                        </EnterpriseCard>
                    </div>

                    <EnterpriseCard
                        title="Export Data"
                        description="Download reports and analytics data"
                        icon={Download}
                        variant="elevated"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                Usage Report
                            </Button>
                            <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                Cost Analysis
                            </Button>
                            <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                Performance Metrics
                            </Button>
                            <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                Conversation Logs
                            </Button>
                        </div>
                    </EnterpriseCard>
                </TabsContent>
            </Tabs>
        </div>
    );
}; 