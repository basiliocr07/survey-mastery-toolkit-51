
export interface Requirement {
  id: string;
  title: string;
  content: string;
  customerName: string;
  customerEmail: string;
  isAnonymous: boolean;
  status: string;
  priority?: string;
  category?: string;
  projectArea?: string;
  acceptanceCriteria?: string;
  targetDate?: string;
  completionPercentage?: number;
  createdAt: string;
  updatedAt?: string;
  response?: string;
  responseDate?: string;
}
