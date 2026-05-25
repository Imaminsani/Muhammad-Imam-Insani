export type ThemeStyle = 'minimalist' | 'nature' | 'luxury' | 'vibrant' | 'corporate';

export interface BusinessService {
  id: string;
  title: string;
  description: string;
  price?: string;
  iconName: string; // lucide icon name
}

export interface BusinessProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  imageUrl?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  comment: string;
  rating: number; // 1-5
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  instagram?: string;
  whatsappDirect?: string; // e.g. "https://wa.me/628123456789"
}

export interface OperatingHour {
  day: string;
  hours: string; // e.g., "09:00 - 18:00" or "Tutup"
}

export interface OwnerReport {
  id: string;
  date: string;
  title: string;
  status: 'aman' | 'perbaikan' | 'info';
  description: string;
}

export interface BusinessProfile {
  businessName: string;
  category: string;
  slogan: string;
  aboutUs: string;
  story: string;
  theme: ThemeStyle;
  services: BusinessService[];
  products: BusinessProduct[];
  testimonials: Testimonial[];
  faq: FAQItem[];
  team: TeamMember[];
  contactInfo: ContactInfo;
  operatingHours: OperatingHour[];
  reports?: OwnerReport[];
  profileImageUrl?: string;
  isPublished?: boolean;
}

export interface ThemeColors {
  primary: string;     // Tailwind classes e.g. "bg-amber-600 border-amber-600"
  textPrimary: string; // Tailwind text class
  textSecondary: string;
  bgLight: string;
  bgDark: string;
  cardBg: string;
  accent: string;
  fontSans: string;
  fontDisplay: string;
}
