
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import ClientProfilePage from './pages/ClientProfilePage';
import Folders from './pages/Folders';
import Workflows from './pages/Workflows';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import { ClientProvider } from './contexts/ClientContext';
import { DocumentProvider } from './contexts/DocumentContext';
import FolderViewPage from './pages/FolderViewPage';

const App: React.FC = () => {
  return (
    <ClientProvider>
      <DocumentProvider>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/clients/:clientId" element={<ClientProfilePage />} />
            <Route path="/folders" element={<Folders />} />
            <Route path="/folders/:folderId" element={<FolderViewPage />} />
            <Route path="/workflows" element={<Workflows />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MainLayout>
      </DocumentProvider>
    </ClientProvider>
  );
};

export default App;
