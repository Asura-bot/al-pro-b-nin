
import React from 'react';
import { 
  Wrench, 
  Zap, 
  Car, 
  Hammer, 
  HardHat, 
  PaintBucket, 
  Flame,
  LayoutGrid,
  Search,
  Briefcase,
  // Fix: Renaming User icon to UserIcon to avoid naming collision with User type (line 14/17)
  User as UserIcon,
  ShieldCheck
} from 'lucide-react';
import { ServiceCategory, User, UserRole, JobStatus } from './types';

export const CATEGORIES = [
  { id: ServiceCategory.PLUMBING, name: 'Plomberie', icon: <Wrench size={24} />, color: 'bg-blue-100 text-blue-600' },
  { id: ServiceCategory.ELECTRICITY, name: 'Électricité', icon: <Zap size={24} />, color: 'bg-yellow-100 text-yellow-600' },
  { id: ServiceCategory.MECHANIC, name: 'Mécanique', icon: <Car size={24} />, color: 'bg-red-100 text-red-600' },
  { id: ServiceCategory.CARPENTRY, name: 'Menuiserie', icon: <Hammer size={24} />, color: 'bg-orange-100 text-orange-600' },
  { id: ServiceCategory.MASONRY, name: 'Maçonnerie', icon: <HardHat size={24} />, color: 'bg-stone-100 text-stone-600' },
  { id: ServiceCategory.PAINTING, name: 'Peinture', icon: <PaintBucket size={24} />, color: 'bg-pink-100 text-pink-600' },
  { id: ServiceCategory.WELDING, name: 'Soudure', icon: <Flame size={24} />, color: 'bg-purple-100 text-purple-600' },
];

export const MOCK_PROVIDERS: User[] = [
  {
    id: 'p1',
    name: 'Jean Kouassi',
    role: UserRole.PROVIDER,
    phone: '+229 97 00 00 01',
    avatar: 'https://picsum.photos/seed/jean/200',
    isVerified: true,
    rating: 4.8,
    completedJobs: 124,
    points: 850,
    specialty: ServiceCategory.PLUMBING,
    location: { lat: 6.366, lng: 2.418, city: 'Cotonou', neighborhood: 'Fidjrossè' }
  },
  {
    id: 'p2',
    name: 'Samuel Dossou',
    role: UserRole.PROVIDER,
    phone: '+229 96 00 00 02',
    avatar: 'https://picsum.photos/seed/sam/200',
    isVerified: true,
    rating: 4.5,
    completedJobs: 45,
    points: 420,
    specialty: ServiceCategory.ELECTRICITY,
    location: { lat: 6.375, lng: 2.450, city: 'Cotonou', neighborhood: 'Akpakpa' }
  },
  {
    id: 'p3',
    name: 'Michel Agbo',
    role: UserRole.PROVIDER,
    phone: '+229 61 00 00 03',
    avatar: 'https://picsum.photos/seed/michel/200',
    isVerified: false,
    rating: 4.2,
    completedJobs: 12,
    points: 150,
    specialty: ServiceCategory.MECHANIC,
    location: { lat: 6.446, lng: 2.348, city: 'Abomey-Calavi', neighborhood: 'Bidossessi' }
  }
];

export const NAV_ITEMS = [
  { id: 'home', label: 'Accueil', icon: <LayoutGrid size={24} /> },
  { id: 'search', label: 'Explorer', icon: <Search size={24} /> },
  { id: 'jobs', label: 'Missions', icon: <Briefcase size={24} /> },
  // Fix: Using renamed UserIcon here to avoid conflict with the User type
  { id: 'profile', label: 'Profil', icon: <UserIcon size={24} /> },
  { id: 'admin', label: 'Admin', icon: <ShieldCheck size={24} /> },
];
