
export enum UserRole {
  CLIENT = 'CLIENT',
  PROVIDER = 'PROVIDER',
  ADMIN = 'ADMIN'
}

export enum JobStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  PAID_ESCROW = 'PAID_ESCROW',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  DISPUTED = 'DISPUTED'
}

export enum ServiceCategory {
  PLUMBING = 'Plomberie',
  ELECTRICITY = 'Électricité',
  MECHANIC = 'Mécanique',
  CARPENTRY = 'Menuiserie',
  MASONRY = 'Maçonnerie',
  PAINTING = 'Peinture',
  WELDING = 'Soudure'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  phone: string;
  avatar: string;
  isVerified?: boolean;
  rating?: number;
  completedJobs?: number;
  location?: {
    lat: number;
    lng: number;
    city: string;
    neighborhood: string;
  };
  specialty?: ServiceCategory;
  points?: number;
}

export interface Job {
  id: string;
  clientId: string;
  providerId: string;
  category: ServiceCategory;
  description: string;
  amount: number;
  status: JobStatus;
  createdAt: number;
  location: string;
}

export interface Transaction {
  id: string;
  jobId: string;
  amount: number;
  type: 'MTN_MOMO' | 'MOOV_MONEY';
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  fee: number;
}
