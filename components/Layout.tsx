import React from 'react';
import { AppScreen } from '../types';
import { Sprout, History, Camera } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentScreen, onNavigate }) => {
  const NavButton = ({ screen, icon: Icon, label }: { screen: AppScreen; icon: any; label: string }) => {
    const isActive = currentScreen === screen;
    return (
      <button
        onClick={() => onNavigate(screen)}
        className={`flex flex-col items-center justify-center w-full py-3 transition-colors duration-200 ${
          isActive ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
        <span className="text-xs mt-1 font-medium">{label}</span>
      </button>
    );
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 max-w-md mx-auto shadow-2xl overflow-hidden relative border-x border-slate-200">
      {/* Header */}
      <header className="bg-emerald-600 text-white p-4 shadow-md z-10 shrink-0">
        <div className="flex items-center space-x-2">
          <Sprout size={28} />
          <h1 className="text-xl font-bold tracking-tight">Smart Agri Assistant</h1>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-slate-200 shrink-0 z-10 pb-safe">
        <div className="flex justify-around items-center">
          <NavButton screen={AppScreen.UPLOAD} icon={Camera} label="Scan" />
          <NavButton screen={AppScreen.HISTORY} icon={History} label="History" />
        </div>
      </nav>
    </div>
  );
};