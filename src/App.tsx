
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import Index from "./pages/Index";
import WidgetPage from "./pages/dashboard/WidgetPage";
import ProvidersPage from "./pages/dashboard/ProvidersPage";
import ModelsPage from "./pages/dashboard/ModelsPage";
import EmbedPage from "./pages/dashboard/EmbedPage";
import AnalyticsPage from "./pages/dashboard/AnalyticsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="chatwidget-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard/widget" element={<WidgetPage />} />
            <Route path="/dashboard/providers" element={<ProvidersPage />} />
            <Route path="/dashboard/models" element={<ModelsPage />} />
            <Route path="/dashboard/embed" element={<EmbedPage />} />
            <Route path="/dashboard/analytics" element={<AnalyticsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
