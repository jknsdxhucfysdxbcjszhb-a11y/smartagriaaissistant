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
  recommended_water_liters: string;
  recommended_fertilizer: string;
  recommended_pesticide: string;
  organic_solution: string;
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
  UPLOAD = 'UPLOAD',
  DETAILS = 'DETAILS',
  DASHBOARD = 'DASHBOARD',
  HISTORY = 'HISTORY',
}