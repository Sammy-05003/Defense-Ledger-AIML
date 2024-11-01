import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ChartData } from '../types';
import { useTheme } from '../context/ThemeContext';

interface PredictionChartProps {
  data: ChartData[];
}

export const PredictionChart: React.FC<PredictionChartProps> = ({ data }) => {
  const { isDark } = useTheme();

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md transition-colors duration-200">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Demand Prediction</h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={isDark ? '#374151' : '#e5e7eb'}
            />
            <XAxis 
              dataKey="name" 
              stroke={isDark ? '#9ca3af' : '#4b5563'}
            />
            <YAxis 
              stroke={isDark ? '#9ca3af' : '#4b5563'}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: isDark ? '#1f2937' : '#ffffff',
                borderColor: isDark ? '#374151' : '#e5e7eb',
                color: isDark ? '#ffffff' : '#000000',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#60a5fa"
              strokeWidth={2}
              dot={{ fill: '#60a5fa' }}
              name="Actual Demand"
            />
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#34d399"
              strokeWidth={2}
              dot={{ fill: '#34d399' }}
              name="Predicted Demand"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};