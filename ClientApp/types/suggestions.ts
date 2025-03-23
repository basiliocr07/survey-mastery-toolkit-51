
export interface Suggestion {
  id: string;
  title: string;
  content: string;
  customerName: string;
  customerEmail: string;
  createdAt: string;
  status: 'new' | 'reviewed' | 'implemented' | 'rejected';
  category?: string;
  isAnonymous: boolean;
  response?: string;
  responseDate?: string;
  completionPercentage: number;
}

export interface CategoryCount {
  category: string;
  count: number;
}

export interface MonthlyReport {
  month: string;
  year: number;
  totalSuggestions: number;
  implementedSuggestions: number;
  topCategories: CategoryCount[];
  suggestions: Suggestion[];
}
