import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, SearchInput, PasswordInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchableSelect } from "@/components/ui/combobox";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Plus,
  Bot,
  Settings,
  TestTube,
  Check,
  X,
  Eye,
  EyeOff,
  Loader2,
  Brain,
  Zap,
  Shield,
  BarChart3,
  Globe,
  Clock,
  AlertTriangle,
  Cpu,
  Database,
  Network,
  Key,
  Monitor,
  Activity,
  Download,
  Upload,
  Copy,
  Edit,
  Trash2,
  RefreshCw,
  Play,
  Pause,
  CheckCircle,
  Target,
  ArrowDown,
  ArrowUp,
  Sparkles,
  Search,
  Filter,
  Grid3X3,
  List,
  Layers,
  Star,
  Save,
  Power,
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  Info,
  AlertCircle,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useSetupWizard } from "@/hooks/useSetupWizard";
import { SetupWizard } from "@/components/onboarding/SetupWizard";
import {
  apiClient,
  transformApiProviderToFrontend,
  transformApiModelToFrontend,
  type ApiProvider,
  type ApiModel,
} from "@/services/api";

// Enhanced Provider State Management
type ProviderStatus =
  | "unconfigured" // No API key entered
  | "configuring" // API key entered, not tested
  | "testing" // Connection test in progress
  | "test-failed" // Test failed, need to retry
  | "test-passed" // Test passed, ready to save
  | "saving" // Save operation in progress
  | "configured" // Provider saved, ready to fetch models
  | "fetching-models" // Fetching models from API
  | "ready" // Models fetched and available
  | "error"; // General error state

interface Provider {
  id: string;
  name: string;
  icon: string;
  description: string;
  status: ProviderStatus;
  apiKey?: string;
  baseUrl?: string;
  region?: string;
  lastTested?: string;
  lastSaved?: string;
  testResult?: {
    success: boolean;
    message: string;
    latency?: number;
    timestamp: string;
  };
  pricing?: {
    inputCost: string;
    outputCost: string;
    currency: string;
  };
  features?: string[];
  limits?: {
    rateLimit: string;
    contextWindow: string;
    maxTokens: string;
  };
  latency?: number;
  uptime?: number;
  totalRequests?: number;
  errorRate?: number;
  modelCount?: number;
  savedModels?: string[]; // IDs of models user has saved
}

interface ProviderModel {
  id: string;
  name: string;
  description: string;
  family: string; // e.g., "gpt-4", "claude-3", "llama-3"
  contextWindow: number;
  maxTokens: number;
  inputCost: number;
  outputCost: number;
  capabilities: string[];
  isDeprecated: boolean;
  releaseDate?: string;
  // User preferences
  isSaved: boolean;
  isActive: boolean;
  isDefault: boolean;
}

type ModelViewType = "grid" | "table" | "family";

// Remove mock data - will be loaded from API

// Remove mock API service - will use real API

const ProvidersPage = () => {
  const {
    showWizard,
    handleWizardComplete,
    handleWizardSkip,
    handleStartWizard,
  } = useSetupWizard();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null,
  );
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [isSavingProvider, setIsSavingProvider] = useState(false);
  const [isFetchingModels, setIsFetchingModels] = useState(false);
  const [isLoadingProviders, setIsLoadingProviders] = useState(true);
  const [providerModels, setProviderModels] = useState<ProviderModel[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Model management state
  const [modelViewType, setModelViewType] = useState<ModelViewType>("grid");
  const [modelSearchTerm, setModelSearchTerm] = useState("");
  const [selectedModelFamily, setSelectedModelFamily] = useState<string>("all");
  const [showDeprecated, setShowDeprecated] = useState(false);
  const [selectedModels, setSelectedModels] = useState<Set<string>>(new Set());

  // Form state
  const [formData, setFormData] = useState({
    apiKey: "",
    baseUrl: "",
    region: "us-east",
  });

  const getStatusColor = (status: ProviderStatus) => {
    switch (status) {
      case "ready":
        return "text-green-600";
      case "configured":
        return "text-blue-600";
      case "test-passed":
        return "text-green-600";
      case "testing":
      case "saving":
      case "fetching-models":
        return "text-yellow-600";
      case "test-failed":
      case "error":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusIcon = (status: ProviderStatus) => {
    switch (status) {
      case "ready":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "configured":
        return <Wifi className="h-4 w-4 text-blue-600" />;
      case "test-passed":
        return <Check className="h-4 w-4 text-green-600" />;
      case "testing":
      case "saving":
      case "fetching-models":
        return <Loader2 className="h-4 w-4 text-yellow-600 animate-spin" />;
      case "test-failed":
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case "unconfigured":
        return <WifiOff className="h-4 w-4 text-gray-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusText = (status: ProviderStatus) => {
    switch (status) {
      case "unconfigured":
        return "Not Configured";
      case "configuring":
        return "Configuring";
      case "testing":
        return "Testing Connection";
      case "test-failed":
        return "Test Failed";
      case "test-passed":
        return "Test Passed";
      case "saving":
        return "Saving";
      case "configured":
        return "Configured";
      case "fetching-models":
        return "Fetching Models";
      case "ready":
        return "Ready";
      case "error":
        return "Error";
      default:
        return "Unknown";
    }
  };

  const handleTestConnection = async (providerId: string) => {
    if (!selectedProvider || !formData.apiKey.trim()) return;

    setIsTestingConnection(true);
    setError(null);

    // Find the API provider ID from the slug
    const apiProvider = await findApiProviderBySlug(providerId);
    if (!apiProvider) {
      setError("Provider not found");
      setIsTestingConnection(false);
      return;
    }

    // Update provider status to testing
    setProviders((prev) =>
      prev.map((p) => (p.id === providerId ? { ...p, status: "testing" } : p)),
    );

    try {
      const response = await apiClient.testProviderConnection(apiProvider.id, {
        api_key: formData.apiKey,
        base_url: formData.baseUrl,
        region: formData.region,
      });

      const testResult = response.data;

      setProviders((prev) =>
        prev.map((p) =>
          p.id === providerId
            ? {
                ...p,
                status: testResult.success ? "test-passed" : "test-failed",
                testResult,
                lastTested: new Date().toLocaleString(),
                apiKey: formData.apiKey,
                baseUrl: formData.baseUrl,
                region: formData.region,
              }
            : p,
        ),
      );

      // Update selected provider
      if (selectedProvider.id === providerId) {
        setSelectedProvider((prev) =>
          prev
            ? {
                ...prev,
                status: testResult.success ? "test-passed" : "test-failed",
                testResult,
                lastTested: new Date().toLocaleString(),
                apiKey: formData.apiKey,
                baseUrl: formData.baseUrl,
                region: formData.region,
              }
            : null,
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Connection failed. Please check your network and try again.";
      const testResult = {
        success: false,
        message: errorMessage,
        timestamp: new Date().toISOString(),
      };

      setProviders((prev) =>
        prev.map((p) =>
          p.id === providerId
            ? {
                ...p,
                status: "test-failed",
                testResult,
              }
            : p,
        ),
      );

      setError(errorMessage);
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSaveProvider = async (providerId: string) => {
    if (!selectedProvider || selectedProvider.status !== "test-passed") return;

    setIsSavingProvider(true);
    setError(null);

    // Find the API provider ID from the slug
    const apiProvider = await findApiProviderBySlug(providerId);
    if (!apiProvider) {
      setError("Provider not found");
      setIsSavingProvider(false);
      return;
    }

    // Update provider status to saving
    setProviders((prev) =>
      prev.map((p) => (p.id === providerId ? { ...p, status: "saving" } : p)),
    );

    try {
      const response = await apiClient.saveProvider(apiProvider.id, {
        api_key: formData.apiKey,
        base_url: formData.baseUrl,
        region: formData.region,
      });

      const updatedApiProvider = response.data;
      const updatedProvider =
        transformApiProviderToFrontend(updatedApiProvider);

      setProviders((prev) =>
        prev.map((p) =>
          p.id === providerId
            ? {
                ...updatedProvider,
                status: "configured",
                lastSaved: new Date().toLocaleString(),
              }
            : p,
        ),
      );

      // Update selected provider
      if (selectedProvider.id === providerId) {
        const finalProvider = {
          ...updatedProvider,
          status: "configured" as ProviderStatus,
          lastSaved: new Date().toLocaleString(),
        };
        setSelectedProvider(finalProvider);

        // Automatically fetch models after successful save
        await fetchModels(finalProvider);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to save provider configuration";
      setProviders((prev) =>
        prev.map((p) => (p.id === providerId ? { ...p, status: "error" } : p)),
      );
      setError(errorMessage);
    } finally {
      setIsSavingProvider(false);
    }
  };

  const fetchModels = async (provider: Provider) => {
    if (provider.status !== "configured" && provider.status !== "ready") return;

    setIsFetchingModels(true);
    setError(null);

    // Find the API provider ID from the slug
    const apiProvider = await findApiProviderBySlug(provider.id);
    if (!apiProvider) {
      setError("Provider not found");
      setIsFetchingModels(false);
      return;
    }

    // Update provider status to fetching models
    setProviders((prev) =>
      prev.map((p) =>
        p.id === provider.id ? { ...p, status: "fetching-models" } : p,
      ),
    );

    try {
      const response = await apiClient.getProviderModels(apiProvider.id);
      const models = response.data.map(transformApiModelToFrontend);
      setProviderModels(models);

      setProviders((prev) =>
        prev.map((p) =>
          p.id === provider.id
            ? {
                ...p,
                status: "ready",
                modelCount: models.length,
                savedModels: models.filter((m) => m.isSaved).map((m) => m.id),
              }
            : p,
        ),
      );

      // Update selected provider
      if (selectedProvider?.id === provider.id) {
        setSelectedProvider((prev) =>
          prev
            ? {
                ...prev,
                status: "ready",
                modelCount: models.length,
                savedModels: models.filter((m) => m.isSaved).map((m) => m.id),
              }
            : null,
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch models";
      setProviders((prev) =>
        prev.map((p) => (p.id === provider.id ? { ...p, status: "error" } : p)),
      );
      setError(errorMessage);
    } finally {
      setIsFetchingModels(false);
    }
  };

  // Load providers from API on component mount
  useEffect(() => {
    loadProviders();
  }, []);

  // Initialize form data when provider is selected
  useEffect(() => {
    if (selectedProvider) {
      setFormData({
        apiKey: selectedProvider.apiKey || "",
        baseUrl: selectedProvider.baseUrl || "",
        region: selectedProvider.region || "us-east",
      });

      // If provider is ready, fetch models
      if (selectedProvider.status === "ready" && providerModels.length === 0) {
        fetchModels(selectedProvider);
      }
    }
  }, [selectedProvider]);

  // Helper function to load providers from API
  const loadProviders = async () => {
    setIsLoadingProviders(true);
    setError(null);

    try {
      const response = await apiClient.getProviders();
      const transformedProviders = response.data.map(
        transformApiProviderToFrontend,
      );
      setProviders(transformedProviders);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load providers";
      setError(errorMessage);
      console.error("Failed to load providers:", error);
    } finally {
      setIsLoadingProviders(false);
    }
  };

  // Helper function to find API provider by slug
  const findApiProviderBySlug = async (
    slug: string,
  ): Promise<ApiProvider | null> => {
    try {
      const response = await apiClient.getProviders();
      return response.data.find((p) => p.slug === slug) || null;
    } catch (error) {
      console.error("Failed to find provider:", error);
      return null;
    }
  };

  // Determine which tabs should be visible
  const shouldShowModelsTab =
    selectedProvider &&
    ["configured", "fetching-models", "ready"].includes(
      selectedProvider.status,
    );
  const shouldShowTestTab =
    selectedProvider &&
    ["configured", "ready"].includes(selectedProvider.status);
  const shouldShowAnalyticsTab =
    selectedProvider && selectedProvider.status === "ready";

  // Filter and search models
  const filteredModels = providerModels.filter((model) => {
    const matchesSearch =
      model.name.toLowerCase().includes(modelSearchTerm.toLowerCase()) ||
      model.description.toLowerCase().includes(modelSearchTerm.toLowerCase()) ||
      model.capabilities.some((cap) =>
        cap.toLowerCase().includes(modelSearchTerm.toLowerCase()),
      );

    const matchesFamily =
      selectedModelFamily === "all" || model.family === selectedModelFamily;
    const matchesDeprecated = showDeprecated || !model.isDeprecated;

    return matchesSearch && matchesFamily && matchesDeprecated;
  });

  // Get unique model families for filtering
  const modelFamilies = Array.from(
    new Set(providerModels.map((model) => model.family)),
  );

  const handleModelToggle = async (
    modelId: string,
    field: "isSaved" | "isActive" | "isDefault",
  ) => {
    const model = providerModels.find((m) => m.id === modelId);
    if (!model) return;

    // Find the API model
    const apiProvider = await findApiProviderBySlug(selectedProvider?.id || "");
    if (!apiProvider) return;

    try {
      const response = await apiClient.getProviderModels(apiProvider.id);
      const apiModel = response.data.find((m) => m.model_id === modelId);
      if (!apiModel) return;

      const newValue = !model[field];
      const updateData: Partial<
        Pick<ApiModel, "is_saved" | "is_active" | "is_default">
      > = {};

      if (field === "isSaved") updateData.is_saved = newValue;
      if (field === "isActive") updateData.is_active = newValue;
      if (field === "isDefault") updateData.is_default = newValue;

      await apiClient.updateModel(apiModel.id, updateData);

      // Update local state
      setProviderModels((prev) =>
        prev.map((m) => {
          if (m.id === modelId) {
            const updated = { ...m, [field]: newValue };
            return updated;
          } else if (field === "isDefault" && newValue) {
            // Unset other defaults when setting a new default
            return { ...m, isDefault: false };
          }
          return m;
        }),
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update model";
      setError(errorMessage);
      console.error("Failed to update model:", error);
    }
  };

  const handleBulkAction = async (
    action: "save" | "activate" | "deactivate",
    modelIds: string[],
  ) => {
    const apiProvider = await findApiProviderBySlug(selectedProvider?.id || "");
    if (!apiProvider) return;

    try {
      const response = await apiClient.getProviderModels(apiProvider.id);
      const apiModelIds = response.data
        .filter((m) => modelIds.includes(m.model_id))
        .map((m) => m.id);

      const updateData: Partial<
        Pick<ApiModel, "is_saved" | "is_active" | "is_default">
      > = {};

      switch (action) {
        case "save":
          updateData.is_saved = true;
          break;
        case "activate":
          updateData.is_active = true;
          updateData.is_saved = true; // Auto-save when activating
          break;
        case "deactivate":
          updateData.is_active = false;
          break;
      }

      await apiClient.bulkUpdateModels(apiModelIds, updateData);

      // Update local state
      setProviderModels((prev) =>
        prev.map((model) => {
          if (modelIds.includes(model.id)) {
            switch (action) {
              case "save":
                return { ...model, isSaved: true };
              case "activate":
                return { ...model, isActive: true, isSaved: true };
              case "deactivate":
                return { ...model, isActive: false };
              default:
                return model;
            }
          }
          return model;
        }),
      );

      setSelectedModels(new Set());
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update models";
      setError(errorMessage);
      console.error("Failed to bulk update models:", error);
    }
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
          title="AI Providers"
          description="Configure and manage your AI provider connections"
          actions={
            <Button onClick={handleStartWizard} className="gap-2">
              <Plus className="h-4 w-4" />
              Setup Wizard
            </Button>
          }
        />

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-red-800 font-medium">Error</p>
            </div>
            <p className="text-red-700 mt-1">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Provider List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                Providers
              </CardTitle>
              <CardDescription>Select a provider to configure</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isLoadingProviders ? (
                <div className="p-6 text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                  <p className="text-sm text-muted-foreground">
                    Loading providers...
                  </p>
                </div>
              ) : providers.length === 0 ? (
                <div className="p-6 text-center">
                  <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Network className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium text-lg mb-2">
                    No Providers Found
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    No AI providers are available. Please check your backend
                    configuration.
                  </p>
                  <Button variant="outline" onClick={loadProviders}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry
                  </Button>
                </div>
              ) : (
                <div className="max-h-[600px] overflow-y-auto p-6 space-y-3">
                  {providers.map((provider) => (
                    <div
                      key={provider.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all hover:scale-[1.02] focus:outline-none ${
                        selectedProvider?.id === provider.id
                          ? "border-primary bg-primary/5 shadow-md"
                          : "hover:bg-muted/50"
                      }`}
                      onClick={() => setSelectedProvider(provider)}
                      tabIndex={-1}
                      role="button"
                      aria-label={`Select ${provider.name} provider`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{provider.icon}</span>
                          <div>
                            <div className="font-medium">{provider.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {provider.description}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(provider.status)}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className={getStatusColor(provider.status)}>
                          {getStatusText(provider.status)}
                        </span>
                        {provider.modelCount && (
                          <span className="text-muted-foreground">
                            {provider.modelCount} models
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Provider Configuration */}
          {selectedProvider && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{selectedProvider.icon}</span>
                    <div>
                      <CardTitle>{selectedProvider.name}</CardTitle>
                      <CardDescription>
                        {selectedProvider.description}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={
                        selectedProvider.status === "ready"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {getStatusText(selectedProvider.status)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="config" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
                    <TabsTrigger
                      value="config"
                      className="flex items-center gap-1"
                    >
                      <Settings className="h-3 w-3" />
                      Config
                    </TabsTrigger>
                    {shouldShowModelsTab && (
                      <TabsTrigger
                        value="models"
                        className="flex items-center gap-1"
                      >
                        <Brain className="h-3 w-3" />
                        Models
                        {selectedProvider.modelCount && (
                          <Badge variant="secondary" className="ml-1 text-xs">
                            {selectedProvider.modelCount}
                          </Badge>
                        )}
                      </TabsTrigger>
                    )}
                    {shouldShowTestTab && (
                      <TabsTrigger
                        value="test"
                        className="flex items-center gap-1"
                      >
                        <TestTube className="h-3 w-3" />
                        Testing
                      </TabsTrigger>
                    )}
                    {shouldShowAnalyticsTab && (
                      <TabsTrigger
                        value="analytics"
                        className="flex items-center gap-1"
                      >
                        <BarChart3 className="h-3 w-3" />
                        Analytics
                      </TabsTrigger>
                    )}
                  </TabsList>

                  {/* Configuration Tab */}
                  <TabsContent
                    value="config"
                    className="border rounded-lg p-6 bg-card space-y-6 mt-4"
                  >
                    <div className="space-y-6">
                      {/* Connection Status */}
                      {selectedProvider.testResult && (
                        <div
                          className={`p-4 rounded-lg border ${
                            selectedProvider.testResult.success
                              ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
                              : "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800"
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            {selectedProvider.testResult.success ? (
                              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                            ) : (
                              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                            )}
                            <div className="flex-1">
                              <p
                                className={`text-sm font-medium ${
                                  selectedProvider.testResult.success
                                    ? "text-green-900 dark:text-green-100"
                                    : "text-red-900 dark:text-red-100"
                                }`}
                              >
                                {selectedProvider.testResult.success
                                  ? "Connection Successful"
                                  : "Connection Failed"}
                              </p>
                              <p
                                className={`text-xs mt-1 ${
                                  selectedProvider.testResult.success
                                    ? "text-green-700 dark:text-green-300"
                                    : "text-red-700 dark:text-red-300"
                                }`}
                              >
                                {selectedProvider.testResult.message}
                              </p>
                              {selectedProvider.testResult.latency && (
                                <p className="text-xs text-green-600 mt-1">
                                  Response time:{" "}
                                  {selectedProvider.testResult.latency}ms
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* API Configuration */}
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="apiKey">API Key</Label>
                          <PasswordInput
                            id="apiKey"
                            placeholder="Enter your API key"
                            value={formData.apiKey}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                apiKey: e.target.value,
                              }))
                            }
                          />
                          <p className="text-xs text-muted-foreground">
                            Your API key is encrypted and stored securely
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="baseUrl">Base URL</Label>
                          <Input
                            id="baseUrl"
                            placeholder="https://api.provider.com"
                            value={formData.baseUrl}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                baseUrl: e.target.value,
                              }))
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="region">Region</Label>
                          <SearchableSelect
                            value={formData.region}
                            onValueChange={(value) =>
                              setFormData((prev) => ({
                                ...prev,
                                region: value,
                              }))
                            }
                            options={[
                              {
                                value: "us-east",
                                label: "US East",
                                description: "United States East Coast",
                              },
                              {
                                value: "us-west",
                                label: "US West",
                                description: "United States West Coast",
                              },
                              {
                                value: "eu-west",
                                label: "EU West",
                                description: "Europe West",
                              },
                              {
                                value: "asia-pacific",
                                label: "Asia Pacific",
                                description: "Asia Pacific Region",
                              },
                              {
                                value: "global",
                                label: "Global",
                                description: "Global endpoint",
                              },
                            ]}
                            placeholder="Select region..."
                          />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-3 pt-4">
                          <Button
                            onClick={() =>
                              handleTestConnection(selectedProvider.id)
                            }
                            disabled={
                              isTestingConnection || !formData.apiKey.trim()
                            }
                            variant="outline"
                            className="flex-1"
                          >
                            {isTestingConnection ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Testing Connection...
                              </>
                            ) : (
                              <>
                                <TestTube className="h-4 w-4 mr-2" />
                                Test Connection
                              </>
                            )}
                          </Button>
                          <Button
                            onClick={() =>
                              handleSaveProvider(selectedProvider.id)
                            }
                            disabled={
                              isSavingProvider ||
                              selectedProvider.status !== "test-passed" ||
                              !formData.apiKey.trim()
                            }
                            className="flex-1"
                          >
                            {isSavingProvider ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save className="h-4 w-4 mr-2" />
                                Save Provider
                              </>
                            )}
                          </Button>
                        </div>

                        {/* Help Text */}
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <div className="flex items-start space-x-3">
                            <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium">
                                Configuration Workflow
                              </p>
                              <ol className="text-xs text-muted-foreground mt-1 space-y-1">
                                <li>1. Enter your API key and configuration</li>
                                <li>
                                  2. Test the connection to verify credentials
                                </li>
                                <li>3. Save the provider configuration</li>
                                <li>
                                  4. Models will be automatically fetched and
                                  displayed
                                </li>
                              </ol>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Models Tab - Only visible after provider is configured */}
                  {shouldShowModelsTab && (
                    <TabsContent
                      value="models"
                      className="border rounded-lg p-6 bg-card space-y-6 mt-4"
                    >
                      {selectedProvider.status === "fetching-models" ? (
                        <div className="text-center py-12">
                          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                          <h3 className="font-medium text-lg mb-2">
                            Fetching Models
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Loading available models from{" "}
                            {selectedProvider.name}...
                          </p>
                        </div>
                      ) : providerModels.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Brain className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <h3 className="font-medium text-lg mb-2">
                            No Models Found
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            No models were found for this provider.
                          </p>
                          <Button
                            variant="outline"
                            onClick={() => fetchModels(selectedProvider)}
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Retry Fetch
                          </Button>
                        </div>
                      ) : (
                        <>
                          {/* Models Header with Search and Filters */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-lg flex items-center">
                                  <Brain className="h-5 w-5 mr-2 text-primary" />
                                  Available Models
                                </h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {filteredModels.length} of{" "}
                                  {providerModels.length} models
                                  {selectedModels.size > 0 &&
                                    ` • ${selectedModels.size} selected`}
                                </p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    setModelViewType(
                                      modelViewType === "grid"
                                        ? "table"
                                        : "grid",
                                    )
                                  }
                                >
                                  {modelViewType === "grid" ? (
                                    <List className="h-4 w-4" />
                                  ) : (
                                    <Grid3X3 className="h-4 w-4" />
                                  )}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => fetchModels(selectedProvider)}
                                >
                                  <RefreshCw className="h-4 w-4 mr-2" />
                                  Refresh
                                </Button>
                              </div>
                            </div>

                            {/* Search and Filters */}
                            <div className="flex flex-col sm:flex-row gap-4">
                              <div className="flex-1">
                                <SearchInput
                                  placeholder="Search models by name, description, or capabilities..."
                                  value={modelSearchTerm}
                                  onChange={(e) =>
                                    setModelSearchTerm(e.target.value)
                                  }
                                />
                              </div>
                              <div className="flex items-center space-x-2">
                                <Select
                                  value={selectedModelFamily}
                                  onValueChange={setSelectedModelFamily}
                                >
                                  <SelectTrigger className="w-40">
                                    <SelectValue placeholder="All Families" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="all">
                                      All Families
                                    </SelectItem>
                                    {modelFamilies.map((family) => (
                                      <SelectItem key={family} value={family}>
                                        {family}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id="showDeprecated"
                                    checked={showDeprecated}
                                    onCheckedChange={(checked) =>
                                      setShowDeprecated(checked as boolean)
                                    }
                                  />
                                  <Label
                                    htmlFor="showDeprecated"
                                    className="text-sm"
                                  >
                                    Show deprecated
                                  </Label>
                                </div>
                              </div>
                            </div>

                            {/* Bulk Actions */}
                            {selectedModels.size > 0 && (
                              <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
                                <div className="flex items-center space-x-3">
                                  <CheckCircle className="h-5 w-5 text-primary" />
                                  <div>
                                    <p className="text-sm font-medium">
                                      {selectedModels.size} models selected
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      Apply actions to selected models
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleBulkAction(
                                        "save",
                                        Array.from(selectedModels),
                                      )
                                    }
                                  >
                                    <Save className="h-4 w-4 mr-2" />
                                    Save All
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleBulkAction(
                                        "activate",
                                        Array.from(selectedModels),
                                      )
                                    }
                                  >
                                    <Power className="h-4 w-4 mr-2" />
                                    Activate All
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedModels(new Set())}
                                  >
                                    <X className="h-4 w-4 mr-2" />
                                    Clear
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Models Display */}
                          {modelViewType === "grid" ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                              {filteredModels.map((model) => (
                                <ModelCard
                                  key={model.id}
                                  model={model}
                                  isSelected={selectedModels.has(model.id)}
                                  onToggleSelect={(modelId) => {
                                    const newSelected = new Set(selectedModels);
                                    if (newSelected.has(modelId)) {
                                      newSelected.delete(modelId);
                                    } else {
                                      newSelected.add(modelId);
                                    }
                                    setSelectedModels(newSelected);
                                  }}
                                  onToggle={handleModelToggle}
                                />
                              ))}
                            </div>
                          ) : (
                            <ModelTable
                              models={filteredModels}
                              selectedModels={selectedModels}
                              onToggleSelect={(modelId) => {
                                const newSelected = new Set(selectedModels);
                                if (newSelected.has(modelId)) {
                                  newSelected.delete(modelId);
                                } else {
                                  newSelected.add(modelId);
                                }
                                setSelectedModels(newSelected);
                              }}
                              onToggle={handleModelToggle}
                            />
                          )}

                          {filteredModels.length === 0 && (
                            <div className="text-center py-8">
                              <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground">
                                No models match your current filters
                              </p>
                            </div>
                          )}
                        </>
                      )}
                    </TabsContent>
                  )}

                  {/* Test Tab - Only visible after provider is configured */}
                  {shouldShowTestTab && (
                    <TabsContent
                      value="test"
                      className="border rounded-lg p-6 bg-card space-y-6 mt-4"
                    >
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-medium text-lg flex items-center mb-4">
                            <TestTube className="h-5 w-5 mr-2 text-primary" />
                            Provider Testing
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Test your provider connection and model responses
                          </p>
                        </div>
                        {/* Test content would go here */}
                      </div>
                    </TabsContent>
                  )}

                  {/* Analytics Tab - Only visible when provider is ready */}
                  {shouldShowAnalyticsTab && (
                    <TabsContent
                      value="analytics"
                      className="border rounded-lg p-6 bg-card space-y-6 mt-4"
                    >
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-medium text-lg flex items-center mb-4">
                            <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                            Usage Analytics
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Monitor usage, performance, and costs
                          </p>
                        </div>
                        {/* Analytics content would go here */}
                      </div>
                    </TabsContent>
                  )}
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

// Model Card Component
interface ModelCardProps {
  model: ProviderModel;
  isSelected: boolean;
  onToggleSelect: (modelId: string) => void;
  onToggle: (
    modelId: string,
    field: "isSaved" | "isActive" | "isDefault",
  ) => void;
}

const ModelCard = ({
  model,
  isSelected,
  onToggleSelect,
  onToggle,
}: ModelCardProps) => {
  return (
    <Card
      className={`group hover:shadow-lg transition-all duration-200 ${
        isSelected ? "ring-2 ring-primary" : ""
      } ${model.isDeprecated ? "opacity-60" : ""}`}
    >
      <CardContent className="p-6">
        {/* Header with Selection */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3 flex-1">
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => onToggleSelect(model.id)}
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h5 className="font-semibold text-base">{model.name}</h5>
                {model.isDeprecated && (
                  <Badge variant="outline" className="text-xs">
                    Deprecated
                  </Badge>
                )}
                {model.isDefault && (
                  <Badge variant="default" className="text-xs">
                    <Star className="h-3 w-3 mr-1" />
                    Default
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                {model.family}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {model.description}
              </p>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center space-x-2 mb-1">
              <Database className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                Context
              </span>
            </div>
            <span className="text-sm font-semibold text-blue-900 dark:text-blue-100">
              {(model.contextWindow / 1000).toFixed(0)}K
            </span>
          </div>
          <div className="p-3 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center space-x-2 mb-1">
              <Zap className="h-4 w-4 text-green-600" />
              <span className="text-xs font-medium text-green-700 dark:text-green-300">
                Max Output
              </span>
            </div>
            <span className="text-sm font-semibold text-green-900 dark:text-green-100">
              {(model.maxTokens / 1000).toFixed(1)}K
            </span>
          </div>
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="flex items-center space-x-2 mb-1">
              <ArrowDown className="h-4 w-4 text-orange-600" />
              <span className="text-xs font-medium text-orange-700 dark:text-orange-300">
                Input
              </span>
            </div>
            <span className="text-sm font-semibold text-orange-900 dark:text-orange-100">
              ${model.inputCost}/1K
            </span>
          </div>
          <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-center space-x-2 mb-1">
              <ArrowUp className="h-4 w-4 text-purple-600" />
              <span className="text-xs font-medium text-purple-700 dark:text-purple-300">
                Output
              </span>
            </div>
            <span className="text-sm font-semibold text-purple-900 dark:text-purple-100">
              ${model.outputCost}/1K
            </span>
          </div>
        </div>

        {/* Capabilities */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">
              Capabilities
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {model.capabilities.map((capability) => (
              <Badge
                key={capability}
                variant="secondary"
                className="text-xs px-2 py-1 bg-muted/50 hover:bg-muted transition-colors"
              >
                {capability}
              </Badge>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch
                checked={model.isSaved}
                onCheckedChange={() => onToggle(model.id, "isSaved")}
              />
              <Label className="text-xs">Save</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={model.isActive}
                onCheckedChange={() => onToggle(model.id, "isActive")}
                disabled={!model.isSaved}
              />
              <Label className="text-xs">Active</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={model.isDefault}
                onCheckedChange={() => onToggle(model.id, "isDefault")}
                disabled={!model.isActive}
              />
              <Label className="text-xs">Default</Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Model Table Component
interface ModelTableProps {
  models: ProviderModel[];
  selectedModels: Set<string>;
  onToggleSelect: (modelId: string) => void;
  onToggle: (
    modelId: string,
    field: "isSaved" | "isActive" | "isDefault",
  ) => void;
}

const ModelTable = ({
  models,
  selectedModels,
  onToggleSelect,
  onToggle,
}: ModelTableProps) => {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 font-medium text-sm">
                <Checkbox
                  checked={
                    models.length > 0 &&
                    models.every((m) => selectedModels.has(m.id))
                  }
                  onCheckedChange={(checked) => {
                    if (checked) {
                      models.forEach((m) => selectedModels.add(m.id));
                    } else {
                      models.forEach((m) => selectedModels.delete(m.id));
                    }
                  }}
                />
              </th>
              <th className="text-left p-4 font-medium text-sm">Model</th>
              <th className="text-left p-4 font-medium text-sm">Context</th>
              <th className="text-left p-4 font-medium text-sm">Cost</th>
              <th className="text-left p-4 font-medium text-sm">Controls</th>
            </tr>
          </thead>
          <tbody>
            {models.map((model) => (
              <tr key={model.id} className="border-t hover:bg-muted/25">
                <td className="p-4">
                  <Checkbox
                    checked={selectedModels.has(model.id)}
                    onCheckedChange={() => onToggleSelect(model.id)}
                  />
                </td>
                <td className="p-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{model.name}</span>
                      {model.isDeprecated && (
                        <Badge variant="outline" className="text-xs">
                          Deprecated
                        </Badge>
                      )}
                      {model.isDefault && (
                        <Badge variant="default" className="text-xs">
                          Default
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {model.family}
                    </p>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-sm">
                    {(model.contextWindow / 1000).toFixed(0)}K tokens
                  </span>
                </td>
                <td className="p-4">
                  <div className="text-sm">
                    <div>${model.inputCost}/1K in</div>
                    <div>${model.outputCost}/1K out</div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Switch
                        checked={model.isSaved}
                        onCheckedChange={() => onToggle(model.id, "isSaved")}
                      />
                      <Label className="text-xs">Save</Label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Switch
                        checked={model.isActive}
                        onCheckedChange={() => onToggle(model.id, "isActive")}
                        disabled={!model.isSaved}
                      />
                      <Label className="text-xs">Active</Label>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Switch
                        checked={model.isDefault}
                        onCheckedChange={() => onToggle(model.id, "isDefault")}
                        disabled={!model.isActive}
                      />
                      <Label className="text-xs">Default</Label>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProvidersPage;
