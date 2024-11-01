import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { DashboardHeader } from './components/DashboardHeader';
import { ZoneSelector } from './components/ZoneSelector';
import { StatsCard } from './components/StatsCard';
import { PredictionChart } from './components/PredictionChart';
import { calculateZoneStats, generatePredictionData } from './utils/predictions';
import { ThemeProvider } from './context/ThemeContext';
import { AmmoData } from './types';

function App() {
  const [data, setData] = useState<AmmoData[]>([]);
  const [zones, setZones] = useState<string[]>([]);
  const [selectedZone, setSelectedZone] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/DefenseLedger_AmmoDataset.csv');
        if (!response.ok) {
          throw new Error('Failed to load data');
        }
        
        const csvText = await response.text();
        
        Papa.parse(csvText, {
          header: true,
          complete: (results) => {
            const parsedData = results.data as AmmoData[];
            const validData = parsedData.filter(item => 
              item.OrderID && 
              item.ZoneID && 
              item.OrderDate &&
              !isNaN(item.Quantity)
            );
            
            setData(validData);
            const uniqueZones = [...new Set(validData.map(item => item.ZoneID))].sort();
            setZones(uniqueZones);
            if (uniqueZones.length > 0) {
              setSelectedZone(uniqueZones[0]);
            }
            
            setLoading(false);
          },
          error: (error) => {
            setError(`Error parsing CSV: ${error.message}`);
            setLoading(false);
          }
        });
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Error loading data');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-xl font-semibold text-slate-600 dark:text-slate-300">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-xl font-semibold text-red-600 dark:text-red-400">Error: {error}</div>
      </div>
    );
  }

  const zoneStats = calculateZoneStats(data, selectedZone);
  const predictionData = generatePredictionData(data, selectedZone);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-200">
        <DashboardHeader />
        
        <main className="container mx-auto px-4 py-8">
          <ZoneSelector
            zones={zones}
            selectedZone={selectedZone}
            onZoneChange={setSelectedZone}
          />
          
          <StatsCard stats={zoneStats} />
          <PredictionChart data={predictionData} />
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;