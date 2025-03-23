
export interface Suggestion {
  id: string;
  content: string;
  title?: string;
  customerName: string;
  customerEmail: string;
  isAnonymous: boolean;
  status: string;
  category?: string;
  createdAt: string;
  updatedAt?: string;
  response?: string;
  responseDate?: string;
}

export interface Customer {
  id: string;
  brandName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  createdAt: string;
  acquiredServices: string[];
}

export interface MonthlyReport {
  month: string;
  year: number;
  totalSuggestions: number;
  implementedSuggestions: number;
  topCategories: { category: string; count: number }[];
  suggestions: Suggestion[];
}
