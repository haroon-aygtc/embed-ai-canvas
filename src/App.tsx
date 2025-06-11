import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from './pages/Index';
import WidgetPage from './pages/dashboard/WidgetPage';
import KnowledgePage from './pages/dashboard/KnowledgePage';
import ProvidersPage from './pages/dashboard/ProvidersPage';
import ModelsPage from './pages/dashboard/ModelsPage';
import EmbedPage from './pages/dashboard/EmbedPage';
import AnalyticsPage from './pages/dashboard/AnalyticsPage';
import MediaPage from './pages/dashboard/MediaPage';
import TestingPage from './pages/dashboard/TestingPage';
import TestPage from './pages/TestPage';
import NotFound from './pages/NotFound';
import { ScraperPage } from './pages/dashboard/ScraperPage';
import { AccessibilityProvider } from './components/accessibility/AccessibilityProvider';
import { DatabaseSourcePage } from './pages/dashboard/DatabaseSourcePage';
import { ApiSourcePage } from './pages/dashboard/ApiSourcePage';
import { FilesSourcePage } from './pages/dashboard/FilesSourcePage';

function App() {
  return (
    <AccessibilityProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard/widget" element={<WidgetPage />} />
          <Route path="/dashboard/knowledge" element={<KnowledgePage />} />
          <Route path="/dashboard/scraper" element={<ScraperPage />} />
          <Route path="/dashboard/providers" element={<ProvidersPage />} />
          <Route path="/dashboard/models" element={<ModelsPage />} />
          <Route path="/dashboard/embed" element={<EmbedPage />} />
          <Route path="/dashboard/analytics" element={<AnalyticsPage />} />
          <Route path="/dashboard/media" element={<MediaPage />} />
          <Route path="/dashboard/testing" element={<TestingPage />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/dashboard/knowledge/database" element={<DatabaseSourcePage />} />
          <Route path="/dashboard/knowledge/api" element={<ApiSourcePage />} />
          <Route path="/dashboard/knowledge/files" element={<FilesSourcePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AccessibilityProvider>
  );
}

export default App;
