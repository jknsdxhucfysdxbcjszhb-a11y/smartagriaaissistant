
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { ScreenUpload } from './components/ScreenUpload';
import { ScreenDetails } from './components/ScreenDetails';
import { ScreenDashboard } from './components/ScreenDashboard';
import { ScreenHistory } from './components/ScreenHistory';
import { ScreenLogin } from './components/ScreenLogin';
import { AppScreen, AnalysisResult, CropDetails, HistoryItem } from './types';
import { analyzePlantImage } from './services/geminiService';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('agri_authenticated') === 'true';
  });
  
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.UPLOAD);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('agri_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  const saveToHistory = (result: AnalysisResult, image: string, details: CropDetails) => {
    const newItem: HistoryItem = {
      ...result,
      id: Date.now().toString(),
      timestamp: Date.now(),
      imageUrl: image,
      cropDetails: details
    };
    const newHistory = [newItem, ...history];
    setHistory(newHistory);
    localStorage.setItem('agri_history', JSON.stringify(newHistory));
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('agri_authenticated', 'true');
    setCurrentScreen(AppScreen.UPLOAD);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('agri_authenticated');
    setCurrentScreen(AppScreen.LOGIN);
    setImageBase64(null);
    setAnalysisResult(null);
  };

  const handleImageSelected = (base64: string) => {
    setImageBase64(base64);
    setCurrentScreen(AppScreen.DETAILS);
  };

  const handleDetailsSubmit = async (details: CropDetails) => {
    if (!imageBase64) return;
    
    setIsLoading(true);
    try {
      const result = await analyzePlantImage(imageBase64, details);
      setAnalysisResult(result);
      saveToHistory(result, imageBase64, details);
      setCurrentScreen(AppScreen.DASHBOARD);
    } catch (error) {
      alert("Analysis failed. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHistorySelect = (item: HistoryItem) => {
    setAnalysisResult(item);
    setCurrentScreen(AppScreen.DASHBOARD);
  };

  const handleNewScan = () => {
    setImageBase64(null);
    setAnalysisResult(null);
    setCurrentScreen(AppScreen.UPLOAD);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case AppScreen.UPLOAD:
        return <ScreenUpload onImageSelected={handleImageSelected} />;
      case AppScreen.DETAILS:
        return (
          <ScreenDetails 
            onSubmit={handleDetailsSubmit} 
            onBack={() => setCurrentScreen(AppScreen.UPLOAD)}
            isLoading={isLoading}
            imageBase64={imageBase64}
          />
        );
      case AppScreen.DASHBOARD:
        return <ScreenDashboard result={analysisResult} onNewScan={handleNewScan} />;
      case AppScreen.HISTORY:
        return <ScreenHistory history={history} onSelect={handleHistorySelect} />;
      default:
        return <ScreenUpload onImageSelected={handleImageSelected} />;
    }
  };

  if (!isAuthenticated) {
    return (
      <div key="login-view" className="h-full animate-fade-in">
        <ScreenLogin onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <Layout 
      currentScreen={currentScreen} 
      onNavigate={setCurrentScreen}
      onLogout={handleLogout}
    >
      <div key={currentScreen} className="h-full w-full animate-fade-in">
        {renderScreen()}
      </div>
    </Layout>
  );
};

export default App;
