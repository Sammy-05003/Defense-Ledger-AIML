import { AmmoData, ChartData } from '../types';
import { addDays, parseISO, format } from 'date-fns';

export const calculateZoneStats = (data: AmmoData[], zoneId: string) => {
  const zoneData = data.filter(item => item.ZoneID === zoneId);
  
  // Basic calculations
  const totalOrders = zoneData.length;
  const averageQuantity = totalOrders > 0 
    ? Math.round(zoneData.reduce((acc, curr) => acc + curr.Quantity, 0) / totalOrders)
    : 0;
  
  // Sort by date for latest order
  const sortedByDate = [...zoneData]
    .filter(item => item.OrderDate) // Filter out items without dates
    .sort((a, b) => {
      try {
        const dateA = parseISO(a.OrderDate);
        const dateB = parseISO(b.OrderDate);
        return dateB.getTime() - dateA.getTime();
      } catch {
        return 0;
      }
    });
  
  const lastOrderDate = sortedByDate[0]?.OrderDate 
    ? format(parseISO(sortedByDate[0].OrderDate), 'yyyy-MM-dd')
    : 'No orders';
  
  // Simple linear regression for prediction
  const dailyUsage = averageQuantity / 30; // Assumed monthly average
  const currentStock = averageQuantity * 2; // Assumed current stock
  const daysUntilDepletion = Math.round(currentStock / dailyUsage) || 0;
  
  const predictedDepletion = daysUntilDepletion > 0
    ? format(addDays(new Date(), daysUntilDepletion), 'yyyy-MM-dd')
    : 'Insufficient data';
  
  // Recommended order calculation
  const recommendedOrder = Math.round(averageQuantity * 1.2); // 20% buffer
  
  return {
    totalOrders,
    averageQuantity,
    lastOrderDate,
    predictedDepletion,
    recommendedOrder,
  };
};

export const generatePredictionData = (data: AmmoData[], zoneId: string): ChartData[] => {
  const zoneData = data.filter(item => item.ZoneID === zoneId && item.OrderDate);
  const monthlyData: ChartData[] = [];
  
  // Group by month and calculate totals
  const monthlyTotals = zoneData.reduce((acc, curr) => {
    try {
      const date = parseISO(curr.OrderDate);
      const month = format(date, 'yyyy-MM');
      acc[month] = (acc[month] || 0) + curr.Quantity;
      return acc;
    } catch {
      return acc;
    }
  }, {} as Record<string, number>);
  
  // Generate prediction data
  Object.entries(monthlyTotals)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([month, quantity]) => {
      monthlyData.push({
        name: month,
        actual: quantity,
        predicted: Math.round(quantity * (1 + Math.random() * 0.2)), // Simple prediction
      });
    });
  
  return monthlyData;
};