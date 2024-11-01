import React from 'react';
import { Shield } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export const DashboardHeader: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-6 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8 text-blue-400" />
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Defense Ledger
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <p className="text-sm text-slate-300">Ammunition Supply Prediction System</p>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};