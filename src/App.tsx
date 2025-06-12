import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useRoutes } from "react-router-dom";
import routes from "tempo-routes";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AccessibilityProvider } from "@/components/accessibility/AccessibilityProvider";
import { SetupWizard } from "@/components/onboarding/SetupWizard";
import Index from "./pages/Index";
import WidgetPage from "./pages/dashboard/WidgetPage";
import KnowledgePage from "./pages/dashboard/KnowledgePage";
import ProvidersPage from "./pages/dashboard/ProvidersPage";
import ModelsPage from "./pages/dashboard/ModelsPage";
import EmbedPage from "./pages/dashboard/EmbedPage";
import AnalyticsPage from "./pages/dashboard/AnalyticsPage";
import MediaPage from "./pages/dashboard/MediaPage";
import TestPage from "./pages/TestPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Component to handle Tempo routes inside Router context
const TempoRoutes = () => {
  if (import.meta.env.VITE_TEMPO) {
    return useRoutes(routes);
  }
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="chatwidget-theme">
      <AccessibilityProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <TempoRoutes />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/test" element={<TestPage />} />
              <Route
                path="/setup"
                element={
                  <SetupWizard
                    onComplete={(config) => {
                      console.log("Setup completed with config:", config);
                      window.location.href = "/dashboard/widget";
                    }}
                    onSkip={() => {
                      window.location.href = "/dashboard/widget";
                    }}
                  />
                }
              />
              <Route path="/dashboard/widget" element={<WidgetPage />} />
              <Route path="/dashboard/knowledge" element={<KnowledgePage />} />
              <Route path="/dashboard/providers" element={<ProvidersPage />} />
              <Route path="/dashboard/models" element={<ModelsPage />} />
              <Route path="/dashboard/embed" element={<EmbedPage />} />
              <Route path="/dashboard/analytics" element={<AnalyticsPage />} />
              <Route path="/dashboard/media" element={<MediaPage />} />
              {import.meta.env.VITE_TEMPO && <Route path="/tempobook/*" />}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AccessibilityProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
