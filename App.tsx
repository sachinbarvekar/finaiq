
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import MyProfilePage from './pages/MyProfilePage';
import Folders from './pages/Folders';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import { ClientProvider } from './contexts/ClientContext';
import { DocumentProvider } from './contexts/DocumentContext';
import FolderViewPage from './pages/FolderViewPage';
import DocumentViewPage from './pages/DocumentViewPage';
import { ThemeProvider } from './contexts/ThemeContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { ProfileProvider } from './contexts/ProfileContext';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ClientProvider>
        <DocumentProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            
            <Route 
              path="/*"
              element={
                <ProtectedRoute>
                  <ProfileProvider>
                    <MainLayout>
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/clients" element={<Clients />} />
                        <Route path="/profile" element={<MyProfilePage />} />
                        <Route path="/folders" element={<Folders />} />
                        <Route path="/folders/:folderId" element={<FolderViewPage />} />
                        <Route path="/folders/:folderId/documents/:documentId" element={<DocumentViewPage />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </MainLayout>
                  </ProfileProvider>
                </ProtectedRoute>
              } 
            />
          </Routes>
        </DocumentProvider>
      </ClientProvider>
    </ThemeProvider>
  );
};

export default App;