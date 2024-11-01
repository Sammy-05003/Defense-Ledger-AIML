import { addDays, parseISO, format } from 'date-fns';

const ZONE_RISK_LEVELS = {
  'Z09': 'high',
  'Z10': 'high',
  'Z07': 'medium',
  'Z08': 'medium',
  'Z05': 'medium',
  'Z06': 'medium',
  'Z01': 'low',
  'Z02': 'low',
  'Z03': 'low',
  'Z04': 'low',
};

const getRiskMultiplier = (zoneId) => {
  const riskLevel = ZONE_RISK_LEVELS[zoneId] || 'low';
  switch (riskLevel) {
    case 'high':
      return 2.0; // 100% more buffer for high-risk zones
    case 'medium':
      return 1.5; // 50% more buffer for medium-risk zones
    default:
      return 1.2; // 20% buffer for low-risk zones
  }
};

export const calculateZoneStats = (data, zoneId) => {
  const zoneData = data.filter(item => item.ZoneID === zoneId);
  const riskMultiplier = getRiskMultiplier(zoneId);
  
  // Basic calculations
  const totalOrders = zoneData.length;
  const averageQuantity = totalOrders > 0 
    ? Math.round(zoneData.reduce((acc, curr) => acc + curr.Quantity, 0) / totalOrders)
    : 0;
  
  // Sort by date for latest order
  const sortedByDate = [...zoneData]
    .sort((a, b) => new Date(b.OrderDate).getTime() - new Date(a.OrderDate).getTime());
  
  const lastOrderDate = sortedByDate[0]?.OrderDate 
    ? format(new Date(sortedByDate[0].OrderDate), 'yyyy-MM-dd')
    : 'No orders';
  
  // Enhanced prediction for high-risk zones
  const dailyUsage = averageQuantity / 30; // Monthly average to daily
  const currentStock = averageQuantity * riskMultiplier; // Adjusted based on risk
  const daysUntilDepletion = Math.round(currentStock / (dailyUsage * riskMultiplier));
  
  const predictedDepletion = daysUntilDepletion > 0
    ? format(addDays(new Date(), daysUntilDepletion), 'yyyy-MM-dd')
    : 'Insufficient data';
  
  // Recommended order with risk-based adjustment
  const recommendedOrder = Math.round(averageQuantity * riskMultiplier);
  
  // Calculate weapon type breakdown
  const weaponTypeBreakdown = zoneData.reduce((acc, curr) => {
    acc[curr.WeaponType] = (acc[curr.WeaponType] || 0) + curr.Quantity;
    return acc;
  }, {});

  // Calculate ammo type breakdown
  const ammoTypeBreakdown = zoneData.reduce((acc, curr) => {
    acc[curr.AmmunitionType] = (acc[curr.AmmunitionType] || 0) + curr.Quantity;
    return acc;
  }, {});
  
  return {
    totalOrders,
    averageQuantity,
    lastOrderDate,
    predictedDepletion,
    recommendedOrder,
    riskLevel: ZONE_RISK_LEVELS[zoneId] || 'low',
    weaponTypeBreakdown,
    ammoTypeBreakdown,
  };
};

export const generatePredictionData = (data, zoneId) => {
  const zoneData = data.filter(item => item.ZoneID === zoneId);
  const riskMultiplier = getRiskMultiplier(zoneId);
  const monthlyData = [];
  
  // Group by month and calculate totals
  const monthlyTotals = zoneData.reduce((acc, curr) => {
    const month = curr.OrderDate.substring(0, 7); // YYYY-MM
    acc[month] = (acc[month] || 0) + curr.Quantity;
    return acc;
  }, {});
  
  // Generate prediction data with risk-based adjustments
  Object.entries(monthlyTotals)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([month, quantity]) => {
      const baseIncrease = Math.random() * 0.2; // Base 0-20% increase
      const riskAdjustedIncrease = baseIncrease * riskMultiplier;
      
      monthlyData.push({
        name: month,
        actual: quantity,
        predicted: Math.round(quantity * (1 + riskAdjustedIncrease)),
      });
    });
  
  return monthlyData;
};