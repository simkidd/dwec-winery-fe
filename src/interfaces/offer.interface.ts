export interface IOffer {
  _id: string;
  description: string;
  type: "Price Slash" | "Percentage Off";
  priceSlash: number;
  percentageOff: number;
  isActive: boolean;
}
