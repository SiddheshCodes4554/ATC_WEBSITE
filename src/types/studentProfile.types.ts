export type StudentYear = '1st Year' | '2nd Year';

export type StudentSection =
  | 'S01'
  | 'S02'
  | 'S03'
  | 'S04'
  | 'S05'
  | 'S06'
  | 'S07';

export interface StudentProfile {
  $id: string;
  $createdAt: string;
  $updatedAt?: string;
  userId: string;
  name: string;
  email: string;
  niatId: string;
  studentId?: string;
  phone: string;
  year: StudentYear | string;
  section: StudentSection | string;
  [key: string]: unknown;
}

export interface CreateStudentProfileInput {
  userId: string;
  name: string;
  email: string;
  niatId: string;
  phone: string;
  year: StudentYear;
  section: StudentSection;
}

export interface StudentSignupInput {
  name: string;
  email: string;
  password: string;
  niatId: string;
  phone: string;
  year: StudentYear;
  section: StudentSection;
}

export type StudentSortOption = 'newest' | 'oldest' | 'name-asc' | 'name-desc';

export interface StudentDirectoryFilters {
  searchQuery?: string;
  year?: StudentYear | 'all';
  section?: StudentSection | 'all';
  sortBy?: StudentSortOption;
  limit?: number;
  offset?: number;
}

export interface StudentDirectoryStats {
  total: number;
  firstYear: number;
  secondYear: number;
  sectionsCount: Record<string, number>;
}
