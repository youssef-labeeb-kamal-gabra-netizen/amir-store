/**
 * Inventory & Stock Threshold Monitoring Automation
 */

export interface StockAlert {
  productId: string;
  productName: string;
  currentStock: number;
  alertLevel: "LOW" | "OUT_OF_STOCK" | "OPTIMAL";
  reorderRecommended: boolean;
}

export function evaluateStockThreshold(
  productId: string,
  productName: string,
  currentStock: number,
  minThreshold: number = 5
): StockAlert {
  if (currentStock <= 0) {
    return {
      productId,
      productName,
      currentStock,
      alertLevel: "OUT_OF_STOCK",
      reorderRecommended: true,
    };
  }

  if (currentStock <= minThreshold) {
    return {
      productId,
      productName,
      currentStock,
      alertLevel: "LOW",
      reorderRecommended: true,
    };
  }

  return {
    productId,
    productName,
    currentStock,
    alertLevel: "OPTIMAL",
    reorderRecommended: false,
  };
}
