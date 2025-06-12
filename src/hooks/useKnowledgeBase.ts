import { useState, useEffect } from "react";
import { knowledgeBaseApi } from "@/services/api";
import { KnowledgeBase } from "@/types/widget";

export const useKnowledgeBase = () => {
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchKnowledgeBases = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await knowledgeBaseApi.list();
      setKnowledgeBases(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch knowledge bases");
    } finally {
      setLoading(false);
    }
  };

  const createKnowledgeBase = async (data: Partial<KnowledgeBase>) => {
    setLoading(true);
    setError(null);
    try {
      const newKB = await knowledgeBaseApi.create(data);
      setKnowledgeBases((prev) => [...prev, newKB]);
      return newKB;
    } catch (err: any) {
      setError(err.message || "Failed to create knowledge base");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateKnowledgeBase = async (
    id: string,
    data: Partial<KnowledgeBase>,
  ) => {
    setLoading(true);
    setError(null);
    try {
      const updatedKB = await knowledgeBaseApi.update(id, data);
      setKnowledgeBases((prev) =>
        prev.map((kb) => (kb.id === id ? updatedKB : kb)),
      );
      return updatedKB;
    } catch (err: any) {
      setError(err.message || "Failed to update knowledge base");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteKnowledgeBase = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await knowledgeBaseApi.delete(id);
      setKnowledgeBases((prev) => prev.filter((kb) => kb.id !== id));
    } catch (err: any) {
      setError(err.message || "Failed to delete knowledge base");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKnowledgeBases();
  }, []);

  return {
    knowledgeBases,
    loading,
    error,
    fetchKnowledgeBases,
    createKnowledgeBase,
    updateKnowledgeBase,
    deleteKnowledgeBase,
  };
};
