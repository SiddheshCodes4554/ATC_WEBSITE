export type ComponentRequestStatus = 'pending' | 'approved' | 'rejected' | 'collected';

export interface ComponentRequest {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  userId: string;
  studentName: string;
  studentEmail: string;
  componentName: string;
  requestedQuantity: number;
  reason: string;
  status: ComponentRequestStatus;
  adminNotes?: string;
  category?: string;
  [key: string]: any;
}

export interface CreateComponentRequestInput {
  userId: string;
  studentName: string;
  studentEmail: string;
  componentName: string;
  requestedQuantity: number;
  reason: string;
  category?: string;
}

export interface ComponentRequestFilterOptions {
  status?: ComponentRequestStatus | 'all';
  searchQuery?: string;
  limit?: number;
  offset?: number;
}

export interface ComponentRequestStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  collected: number;
}
