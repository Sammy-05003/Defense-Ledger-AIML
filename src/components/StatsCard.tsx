import React from 'react';
import { ZoneStats } from '../types';
import { Package, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';

interface StatsCardProps {
  stats: ZoneStats;
}

export const StatsCard: React.FC<StatsCardProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md transition-colors duration-200">
        <div className="flex items-center space-x-3 mb-4">
          <Package className="h-6 w-6 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Order Statistics</h3>
        </div>
        <div className="space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Total Orders: <span className="font-medium">{stats.totalOrders}</span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Average Quantity: <span className="font-medium">{stats.averageQuantity.toLocaleString()}</span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Last Order: <span className="font-medium">{stats.lastOrderDate}</span>
          </p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md transition-colors duration-200">
        <div className="flex items-center space-x-3 mb-4">
          <TrendingUp className="h-6 w-6 text-green-500" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Predictions</h3>
        </div>
        <div className="space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Stock Depletion: <span className="font-medium">{stats.predictedDepletion}</span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Recommended Order: <span className="font-medium">{stats.recommendedOrder.toLocaleString()}</span>
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md transition-colors duration-200">
        <div className="flex items-center space-x-3 mb-4">
          <AlertTriangle className="h-6 w-6 text-yellow-500" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Stock Status</h3>
        </div>
        <div className="space-y-3">
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-blue-500"
              style={{ width: `${Math.min(100, (stats.averageQuantity / stats.recommendedOrder) * 100)}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Current Stock Level
          </p>
        </div>
      </div>
    </div>
  );
};