
export interface CropDetails {
  cropType: string;
  soilType: string;
  plantAge: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface AnalysisResult {
  disease: string;
  confidence: string;
  severity: 'low' | 'medium' | 'high';
  symptoms: string[];
  recommended_water_liters: string;
  recommended_fertilizer: string;
  recommended_pesticide: string;
  recommended_pesticide_market_value: string;
  /** Includes product name, estimated market price, and brief benefit/application */
  organic_solution: string;
  /** Includes product name, estimated market price, and brief benefit/application */
  inorganic_solution: string;
  treatment_instructions: string;
  overuse_warning: string;
}

export interface HistoryItem extends AnalysisResult {
  id: string;
  timestamp: number;
  imageUrl: string; // Base64 thumbnail or reference
  cropDetails: CropDetails;
}

export enum AppScreen {
  LOGIN = 'LOGIN',
  UPLOAD = 'UPLOAD',
  DETAILS = 'DETAILS',
  DASHBOARD = 'DASHBOARD',
  HISTORY = 'HISTORY',
}
