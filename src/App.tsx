import React, { useState, useEffect } from 'react';
import { Landing } from './components/Landing';
import { Login } from './components/Login';
import { ResearcherDashboard } from './components/ResearcherDashboard';
import { PolicymakerDashboard } from './components/PolicymakerDashboard';
import { ConservationistDashboard } from './components/ConservationistDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { DataExplorer } from './components/DataExplorer';
import { UnifiedAnalytics } from './components/UnifiedAnalytics';
import { Reports } from './components/Reports';
import { OtolithViewer } from './components/OtolithViewer';
import { EdnaLab } from './components/EdnaLab';
import { Settings } from './components/Settings';
import { Profile } from './components/Profile';
import { AIQuery } from './components/AIQuery';
import { ExploreFeatures } from './components/ExploreFeatures';
import { EnvironmentalFishPrediction } from './components/EnvironmentalFishPrediction';
import { FishImageIdentification } from './components/FishImageIdentification';
import { OtolithImageComparison } from './components/OtolithImageComparison';
import { PolicyTools } from './components/PolicyTools';
import { ConservationTools } from './components/ConservationTools';
import { MarineCrimeDetection } from './components/MarineCrimeDetection';
import { MarineAI } from './components/MarineAI';
import { MLPredictions } from './components/MLPredictions';
import { ReportGenerator } from './components/ReportGenerator';
import { DigitalTwin } from './components/DigitalTwin';
import { DynamicAnalytics } from './components/DynamicAnalytics';

import { MarineMap } from './components/MarineMap';
import { DataUpload } from './components/DataUpload';
import { Toaster } from "./components/ui/sonner";

type Page = 'landing' | 'login' | 'researcher-dashboard' | 'policymaker-dashboard' | 'conservationist-dashboard' | 'admin-dashboard' | 'data-explorer' | 'otolith-viewer' | 'edna-lab' | 'analytics' | 'reports' | 'ai-query' | 'explore-features' | 'environmental-fish-prediction' | 'fish-image-identification' | 'otolith-image-comparison' | 'policy-tools' | 'conservation-tools' | 'marine-crime-detection' | 'marine-ai' | 'ml-predictions' | 'report-generator' | 'settings' | 'profile' | 'digital-twin' | 'dynamic-analytics' | 'marine-map' | 'data-upload';
type Language = 'en' | 'ml';

interface User {
  id: string;
  email: string;
  role: 'researcher' | 'policymaker' | 'conservationist' | 'admin';
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [language, setLanguage] = useState<Language>('en');
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('cmlre-user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        // Navigate to appropriate dashboard based on role
        setCurrentPage(`${parsedUser.role}-dashboard` as Page);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('cmlre-user');
      }
    }
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('cmlre-user', JSON.stringify(userData));
    // Navigate to role-specific dashboard
    setCurrentPage(`${userData.role}-dashboard` as Page);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('cmlre-user');
    setCurrentPage('landing');
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ml' : 'en');
  };

  // Render appropriate component based on current page
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'landing':
        return (
          <Landing 
            onNavigate={handleNavigate} 
            language={language}
          />
        );
      
      case 'login':
        return (
          <Login 
            onLogin={handleLogin}
            onNavigate={handleNavigate}
            language={language}
          />
        );
      
      case 'researcher-dashboard':
        if (!user || user.role !== 'researcher') {
          setCurrentPage('login');
          return null;
        }
        return (
          <ResearcherDashboard
            user={user}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            language={language}
          />
        );
      
      case 'policymaker-dashboard':
        if (!user || user.role !== 'policymaker') {
          setCurrentPage('login');
          return null;
        }
        return (
          <PolicymakerDashboard
            user={user}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            language={language}
          />
        );
      
      case 'conservationist-dashboard':
        if (!user || user.role !== 'conservationist') {
          setCurrentPage('login');
          return null;
        }
        return (
          <ConservationistDashboard
            user={user}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            language={language}
          />
        );

      case 'admin-dashboard':
        if (!user || user.role !== 'admin') {
          setCurrentPage('login');
          return null;
        }
        return (
          <AdminDashboard
            user={user}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            language={language}
          />
        );

      case 'data-explorer':
        if (!user) {
          setCurrentPage('login');
          return null;
        }
        return (
          <DataExplorer
            user={user}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            language={language}
          />
        );

      case 'analytics':
        if (!user) {
          setCurrentPage('login');
          return null;
        }
        return (
          <UnifiedAnalytics
            user={user}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            language={language}
          />
        );

      case 'reports':
        if (!user) {
          setCurrentPage('login');
          return null;
        }
        return (
          <Reports
            user={user}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            language={language}
          />
        );

      case 'otolith-viewer':
        if (!user) {
          setCurrentPage('login');
          return null;
        }
        return (
          <OtolithViewer
            user={user}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            language={language}
          />
        );

      case 'edna-lab':
        if (!user) {
          setCurrentPage('login');
          return null;
        }
        return (
          <EdnaLab
            user={user}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            language={language}
          />
        );

      case 'settings':
        if (!user) {
          setCurrentPage('login');
          return null;
        }
        return (
          <Settings
            user={user}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            language={language}
          />
        );

      case 'profile':
        if (!user) {
          setCurrentPage('login');
          return null;
        }
        return (
          <Profile
            user={user}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            language={language}
          />
        );

      case 'ai-query':
        if (!user) {
          setCurrentPage('login');
          return null;
        }
        return (
          <AIQuery
            user={user}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            language={language}
          />
        );

      case 'explore-features':
        if (!user) {
          setCurrentPage('login');
          return null;
        }
        return (
          <ExploreFeatures
            user={user}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            language={language}
          />
        );

      case 'environmental-fish-prediction':
        if (!user) {
          setCurrentPage('login');
          return null;
        }
        return (
          <EnvironmentalFishPrediction
            user={user}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            language={language}
          />
        );

      case 'fish-image-identification':
        if (!user) {
          setCurrentPage('login');
          return null;
        }
        return (
          <FishImageIdentification
            user={user}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            language={language}
          />
        );

      case 'otolith-image-comparison':
        if (!user) {
          setCurrentPage('login');
          return null;
        }
        return (
          <OtolithImageComparison
            user={user}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            language={language}
          />
        );

      case 'policy-tools':
        if (!user || user.role !== 'policymaker') {
          setCurrentPage('login');
          return null;
        }
        return (
          <PolicyTools
            user={user}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            language={language}
          />
        );

      case 'conservation-tools':
        if (!user || user.role !== 'conservationist') {
          setCurrentPage('login');
          return null;
        }
        return (
          <ConservationTools
            user={user}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            language={language}
          />
        );

      case 'marine-crime-detection':
        if (!user || user.role === 'researcher') {
          setCurrentPage('login');
          return null;
        }
        return (
          <MarineCrimeDetection
            user={user}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            language={language}
          />
        );

      case 'digital-twin':
        if (!user) {
          setCurrentPage('login');
          return null;
        }
        return (
          <DigitalTwin
            user={user}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            language={language}
          />
        );

      case 'dynamic-analytics':
        if (!user) {
          setCurrentPage('login');
          return null;
        }
        return (
          <DynamicAnalytics
            user={user}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            language={language}
          />
        );



      case 'marine-map':
        if (!user) {
          setCurrentPage('login');
          return null;
        }
        return (
          <MarineMap
            user={user}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            language={language}
          />
        );

      case 'data-upload':
        if (!user) {
          setCurrentPage('login');
          return null;
        }
        return (
          <DataUpload
            user={user}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            language={language}
          />
        );

      case 'marine-ai':
        if (!user) {
          setCurrentPage('login');
          return null;
        }
        return (
          <MarineAI
            user={user}
            onNavigate={handleNavigate}
            currentPage={currentPage}
          />
        );

      case 'ml-predictions':
        if (!user) {
          setCurrentPage('login');
          return null;
        }
        return (
          <MLPredictions
            user={user}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            language={language}
          />
        );

      case 'report-generator':
        if (!user) {
          setCurrentPage('login');
          return null;
        }
        return (
          <ReportGenerator
            user={user}
          />
        );

      default:
        return (
          <Landing 
            onNavigate={handleNavigate} 
            language={language}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderCurrentPage()}
      
      {/* Marine AI Chatbot - Available throughout the site */}
      <MarineAI 
        user={user} 
        onNavigate={handleNavigate} 
        currentPage={currentPage} 
      />
      
      <Toaster position="top-right" />
    </div>
  );
}