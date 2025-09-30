import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

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

interface User {
  id: string;
  email: string;
  role: 'researcher' | 'policymaker' | 'conservationist' | 'admin';
}

interface AppRoutesProps {
  user: User | null;
  onLogin: (user: User) => void;
  onLogout: () => void;
  language: 'en' | 'ml';
}

export function AppRoutes({ user, onLogin, onLogout, language }: AppRoutesProps) {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing language={language} />} />
        <Route path="/login" element={<Login onLogin={onLogin} language={language} />} />
        
        <Route path="/researcher-dashboard" element={
          user && user.role === 'researcher' ? 
          <ResearcherDashboard user={user} onLogout={onLogout} language={language} /> : 
          <Navigate to="/login" replace />
        } />
        
        <Route path="/policymaker-dashboard" element={
          user && user.role === 'policymaker' ? 
          <PolicymakerDashboard user={user} onLogout={onLogout} language={language} /> : 
          <Navigate to="/login" replace />
        } />
        
        <Route path="/conservationist-dashboard" element={
          user && user.role === 'conservationist' ? 
          <ConservationistDashboard user={user} onLogout={onLogout} language={language} /> : 
          <Navigate to="/login" replace />
        } />
        
        <Route path="/admin-dashboard" element={
          user && user.role === 'admin' ? 
          <AdminDashboard user={user} onLogout={onLogout} language={language} /> : 
          <Navigate to="/login" replace />
        } />
        
        <Route path="/data-explorer" element={
          user ? <DataExplorer user={user} onLogout={onLogout} language={language} /> : <Navigate to="/login" replace />
        } />
        
        <Route path="/analytics" element={
          user ? <UnifiedAnalytics user={user} onLogout={onLogout} language={language} /> : <Navigate to="/login" replace />
        } />
        
        <Route path="/reports" element={
          user ? <Reports user={user} onLogout={onLogout} language={language} /> : <Navigate to="/login" replace />
        } />
        
        <Route path="/otolith-viewer" element={
          user ? <OtolithViewer user={user} onLogout={onLogout} language={language} /> : <Navigate to="/login" replace />
        } />
        
        <Route path="/edna-lab" element={
          user ? <EdnaLab user={user} onLogout={onLogout} language={language} /> : <Navigate to="/login" replace />
        } />
        
        <Route path="/settings" element={
          user ? <Settings user={user} onLogout={onLogout} language={language} /> : <Navigate to="/login" replace />
        } />
        
        <Route path="/profile" element={
          user ? <Profile user={user} onLogout={onLogout} language={language} /> : <Navigate to="/login" replace />
        } />
        
        <Route path="/ai-query" element={
          user ? <AIQuery user={user} onLogout={onLogout} language={language} /> : <Navigate to="/login" replace />
        } />
        
        <Route path="/explore-features" element={
          user ? <ExploreFeatures user={user} onLogout={onLogout} language={language} /> : <Navigate to="/login" replace />
        } />
        
        <Route path="/environmental-fish-prediction" element={
          user ? <EnvironmentalFishPrediction user={user} onLogout={onLogout} language={language} /> : <Navigate to="/login" replace />
        } />
        
        <Route path="/fish-image-identification" element={
          user ? <FishImageIdentification user={user} onLogout={onLogout} language={language} /> : <Navigate to="/login" replace />
        } />
        
        <Route path="/otolith-image-comparison" element={
          user ? <OtolithImageComparison user={user} onLogout={onLogout} language={language} /> : <Navigate to="/login" replace />
        } />
        
        <Route path="/policy-tools" element={
          user && user.role === 'policymaker' ? 
          <PolicyTools user={user} onLogout={onLogout} language={language} /> : 
          <Navigate to="/login" replace />
        } />
        
        <Route path="/conservation-tools" element={
          user && user.role === 'conservationist' ? 
          <ConservationTools user={user} onLogout={onLogout} language={language} /> : 
          <Navigate to="/login" replace />
        } />
        
        <Route path="/marine-crime-detection" element={
          user && user.role !== 'researcher' ? 
          <MarineCrimeDetection user={user} onLogout={onLogout} language={language} /> : 
          <Navigate to="/login" replace />
        } />
        
        <Route path="/digital-twin" element={
          user ? <DigitalTwin user={user} onLogout={onLogout} language={language} /> : <Navigate to="/login" replace />
        } />
        
        <Route path="/dynamic-analytics" element={
          user ? <DynamicAnalytics user={user} onLogout={onLogout} language={language} /> : <Navigate to="/login" replace />
        } />
        
        <Route path="/marine-map" element={
          user ? <MarineMap user={user} onLogout={onLogout} language={language} /> : <Navigate to="/login" replace />
        } />
        
        <Route path="/data-upload" element={
          user ? <DataUpload user={user} onLogout={onLogout} language={language} /> : <Navigate to="/login" replace />
        } />

        <Route path="/marine-ai" element={
          user ? <MarineAI user={user} onLogout={onLogout} language={language} /> : <Navigate to="/login" replace />
        } />

        <Route path="/ml-predictions" element={
          user ? <MLPredictions user={user} onLogout={onLogout} language={language} /> : <Navigate to="/login" replace />
        } />

        <Route path="/report-generator" element={
          user ? <ReportGenerator user={user} onLogout={onLogout} language={language} /> : <Navigate to="/login" replace />
        } />

        {/* Redirect unknown routes to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
