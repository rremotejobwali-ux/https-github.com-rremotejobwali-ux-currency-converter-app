export interface Currency {
  code: string;
  name: string;
  flag: string;
}

export interface HistoricalRate {
  date: string;
  rate: number;
}

export interface ConversionResult {
  conversionRate: number;
  convertedAmount: number;
  currencyCode: string;
  lastUpdated: string;
  historicalRates: HistoricalRate[];
}
