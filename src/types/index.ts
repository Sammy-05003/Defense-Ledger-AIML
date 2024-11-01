export interface AmmoData {
  OrderID: number;
  ZoneID: string;
  WeaponType: string;
  AmmunitionType: string;
  OrderDate: string;
  Quantity: number;
  DemandFrequency: string;
}

export interface ZoneStats {
  totalOrders: number;
  averageQuantity: number;
  lastOrderDate: string;
  predictedDepletion: string;
  recommendedOrder: number;
  weaponTypeBreakdown: Record<string, number>;
  ammoTypeBreakdown: Record<string, number>;
}

export interface ChartData {
  name: string;
  actual: number;
  predicted: number;
}

export interface Theme {
  isDark: boolean;
  toggle: () => void;
}