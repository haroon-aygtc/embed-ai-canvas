import { useState, useEffect } from "react";
import { aiModelApi } from "@/services/api";
import { AIProvider, AIModel } from "@/types/widget";

export const useAIModels = () => {
  const [providers, setProviders] = useState<AIProvider[]>([]);
  const [models, setModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProviders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await aiModelApi.getProviders();
      setProviders(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch AI providers");
    } finally {
      setLoading(false);
    }
  };

  const fetchModels = async (providerId?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await aiModelApi.getModels(providerId);
      setModels(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch AI models");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
    fetchModels();
  }, []);

  return {
    providers,
    models,
    loading,
    error,
    fetchProviders,
    fetchModels,
  };
};
