import { z } from "zod";

// User roles enum
export const userRoles = ["buyer", "seller", "broker", "admin"] as const;
export type UserRole = typeof userRoles[number];

// Property types enum
export const propertyTypes = ["apartment", "house", "flat", "land", "commercial", "office", "shop"] as const;
export type PropertyType = typeof propertyTypes[number];

// Listing types enum (renamed from priceTypes)
export const listingTypes = ["sale", "rent"] as const;
export type ListingType = typeof listingTypes[number];

// Completion status enum
export const completionStatuses = ["ready", "under_construction"] as const;
export type CompletionStatus = typeof completionStatuses[number];

// Furnishing status enum
export const furnishingStatuses = ["furnished", "semi_furnished", "unfurnished"] as const;
export type FurnishingStatus = typeof furnishingStatuses[number];

// Seller types enum
export const sellerTypes = ["owner", "agent"] as const;
export type SellerType = typeof sellerTypes[number];

// Listing status enum
export const listingStatuses = ["draft", "pending", "published", "sold", "rented", "rejected"] as const;
export type ListingStatus = typeof listingStatuses[number];

// Payment status enum
export const paymentStatuses = ["pending", "completed", "failed", "refunded"] as const;
export type PaymentStatus = typeof paymentStatuses[number];

// Bangladesh cities
export const bangladeshCities = [
  "Dhaka", "Chattogram", "Sylhet", "Rajshahi", "Khulna",
  "Barishal", "Rangpur", "Mymensingh", "Comilla", "Gazipur",
  "Narayanganj", "Cox's Bazar"
] as const;
export type BangladeshCity = typeof bangladeshCities[number];

// Dhaka areas
export const dhakaAreas = [
  "Gulshan", "Banani", "Dhanmondi", "Uttara", "Bashundhara",
  "Mirpur", "Mohammadpur", "Tejgaon", "Motijheel", "Badda",
  "Baridhara", "Niketan", "Lalmatia", "Shantinagar", "Wari"
] as const;

// Common amenities
export const amenitiesList = [
  "Parking", "Elevator", "Generator", "Security", "Gym",
  "Swimming Pool", "Rooftop", "Garden", "Balcony", "AC",
  "Furnished", "Semi-furnished", "Gas", "Water Supply", "Internet"
] as const;

// ==================== TYPE DEFINITIONS ====================

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  passwordHash: string;
  role: UserRole;
  verified: boolean;
  profilePhotoUrl?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export type SafeUser = Omit<User, "passwordHash">;

export interface InsertUser {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role?: UserRole;
  verified?: boolean;
  profilePhotoUrl?: string;
}

export interface Broker {
  id: string;
  userId: string;
  agencyName?: string | null;
  licenseNo?: string | null;
  nid?: string | null;
  address?: string | null;
  description?: string | null;
  socialLinks?: { facebook?: string; linkedin?: string; website?: string } | null;
  verified: boolean;
  rating?: number | null;
  reviewCount?: number | null;
  commissionRate?: number | null;
  totalListings?: number | null;
  totalDeals?: number | null;
  createdAt?: Date | null;
}

export interface InsertBroker {
  userId: string;
  agencyName?: string;
  licenseNo?: string;
  nid?: string;
  address?: string;
  description?: string;
  socialLinks?: { facebook?: string; linkedin?: string; website?: string };
  verified?: boolean;
  commissionRate?: number;
}

export interface Listing {
  id: string;
  title: string;
  slug: string;
  description?: string | null;

  // Pricing
  price: number | string; // Supports both numeric and text values (e.g., "Contact for Price")
  pricePerSqft?: number | null;
  listingType: ListingType;
  negotiable?: boolean | null;

  // Property Info
  propertyType: PropertyType;
  propertySubType?: string | null;

  // Property Details
  bedrooms?: number | null;
  bathrooms?: number | null;
  areaSqFt?: number | null;
  completionStatus?: CompletionStatus | null;
  furnishingStatus?: FurnishingStatus | null;
  unitType?: string | null;

  // Building Details
  floor?: number | null;
  totalFloors?: number | null;
  parkingCount?: number | null;
  facing?: string | null;
  balconies?: number | null;
  servantRoom?: boolean | null;
  servantBathroom?: boolean | null;

  // Security & Amenities
  security24x7?: boolean | null;
  cctv?: boolean | null;
  generatorBackup?: boolean | null;
  fireSafety?: boolean | null;
  liftAvailable?: boolean | null;
  amenities?: string[] | null;

  // Location
  address: string;
  city: string;
  district?: string | null;
  area?: string | null;
  coordinates?: { lat: number; lng: number } | null;

  // Media
  images?: string[] | null;
  floorPlanUrl?: string | null;
  videoUrl?: string | null;

  // Seller Info
  sellerName?: string | null;
  sellerType?: SellerType | null;

  // Contact & Communication
  contactPhone?: string | null;
  isPhoneHidden?: boolean | null;
  whatsappEnabled?: boolean | null;
  chatEnabled?: boolean | null;

  // Platform
  postedBy: string;
  brokerId?: string | null;
  isFeatured: boolean;
  isVerified: boolean;
  status: ListingStatus;
  views?: number | null;
  favorites?: number | null;
  reportCount?: number | null;

  createdAt?: Date | null;
  updatedAt?: Date | null;

  // Derived field (not stored in DB)
  category?: string;
}

export interface InsertListing {
  // Core
  title: string;
  listingType: ListingType;
  propertyType: PropertyType;
  propertySubType?: string;
  description?: string;

  // Pricing
  price: number | string; // Supports both numeric and text values (e.g., "Contact for Price")
  pricePerSqft?: number;
  negotiable?: boolean;

  // Property Details
  areaSqFt?: number;
  bedrooms?: number;
  bathrooms?: number;
  completionStatus?: CompletionStatus;
  furnishingStatus?: FurnishingStatus;
  unitType?: string;

  // Building Details
  floor?: number;
  totalFloors?: number;
  parkingCount?: number;
  facing?: string;
  balconies?: number;
  servantRoom?: boolean;
  servantBathroom?: boolean;

  // Security & Amenities
  security24x7?: boolean;
  cctv?: boolean;
  generatorBackup?: boolean;
  fireSafety?: boolean;
  liftAvailable?: boolean;
  amenities?: string[];

  // Location
  address: string;
  city: string;
  district?: string;
  area?: string;
  coordinates?: { lat: number; lng: number };

  // Media
  images?: string[];
  floorPlanUrl?: string;
  videoUrl?: string;

  // Seller Info
  sellerName?: string;
  sellerType?: SellerType;

  // Contact & Communication
  contactPhone?: string;
  isPhoneHidden?: boolean;
  whatsappEnabled?: boolean;
  chatEnabled?: boolean;

  // Platform (set by backend)
  postedBy: string;
  brokerId?: string;
  isFeatured?: boolean;
  isVerified?: boolean;
  status?: ListingStatus;
}

export interface Favorite {
  id: string;
  userId: string;
  listingId: string;
  createdAt?: Date | null;
}

export interface InsertFavorite {
  userId: string;
  listingId: string;
}

export interface SavedSearch {
  id: string;
  userId: string;
  name: string;
  filters?: SearchFilters | null;
  emailAlerts?: boolean | null;
  createdAt?: Date | null;
}

export interface InsertSavedSearch {
  userId: string;
  name: string;
  filters?: SearchFilters;
  emailAlerts?: boolean;
}

export interface Message {
  id: string;
  fromUserId: string;
  toUserId: string;
  listingId?: string | null;
  text: string;
  attachments?: string[] | null;
  read: boolean;
  createdAt?: Date | null;
}

export interface InsertMessage {
  fromUserId: string;
  toUserId: string;
  listingId?: string;
  text: string;
  attachments?: string[];
}

export interface Conversation {
  id: string;
  participantIds: string[];
  listingId?: string | null;
  lastMessageAt?: Date | null;
  createdAt?: Date | null;
}

export interface Review {
  id: string;
  reviewerId: string;
  brokerId?: string | null;
  listingId?: string | null;
  rating: number;
  comment?: string | null;
  createdAt?: Date | null;
}

export interface InsertReview {
  reviewerId: string;
  brokerId?: string;
  listingId?: string;
  rating: number;
  comment?: string;
}

export interface Transaction {
  id: string;
  userId: string;
  listingId?: string | null;
  amount: number;
  currency: string;
  gateway?: string | null;
  type: "featured" | "promotion" | "commission";
  status: PaymentStatus;
  paymentDetails?: any | null;
  createdAt?: Date | null;
}

export interface InsertTransaction {
  userId: string;
  listingId?: string;
  amount: number;
  currency?: string;
  gateway?: string;
  type: "featured" | "promotion" | "commission";
  status?: PaymentStatus;
  paymentDetails?: any;
}

export interface ViewingRequest {
  id: string;
  listingId: string;
  userId: string;
  preferredDate: Date;
  preferredTime?: string | null;
  message?: string | null;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  createdAt?: Date | null;
}

export interface InsertViewingRequest {
  listingId: string;
  userId: string;
  preferredDate: Date;
  preferredTime?: string;
  message?: string;
}

// ==================== PROPERTY INQUIRIES ====================
export const inquiryTypes = ["viewing", "buy", "meeting"] as const;
export type InquiryType = typeof inquiryTypes[number];

export const inquiryStatuses = ["new", "contacted", "closed"] as const;
export type InquiryStatus = typeof inquiryStatuses[number];

export interface PropertyInquiry {
  id: string;
  requestType: InquiryType;
  propertyId: string;
  buyerId: string;
  message?: string | null;
  status: InquiryStatus;
  metadata?: {
    preferredDate?: Date;
    preferredTime?: string;
    contactPhone?: string;
  } | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export interface InsertPropertyInquiry {
  requestType: InquiryType;
  propertyId: string;
  buyerId: string;
  message?: string;
  status?: InquiryStatus;
  metadata?: {
    preferredDate?: Date;
    preferredTime?: string;
    contactPhone?: string;
  };
}

// ==================== COMPARISON CART ====================
export interface ComparisonCart {
  id: string;
  userId: string;
  listingIds: string[];
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export interface InsertComparisonCart {
  userId: string;
  listingIds: string[];
}

// ==================== SEARCH FILTERS ====================
export interface SearchFilters {
  q?: string;
  city?: string;
  area?: string;
  listingType?: ListingType;
  propertyType?: PropertyType;
  category?: string; // Derived category filter
  completionStatus?: CompletionStatus;
  furnishingStatus?: FurnishingStatus;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  minArea?: number;
  maxArea?: number;
  amenities?: string[];
  isFeatured?: boolean;
  isVerified?: boolean;
  sortBy?: "price_asc" | "price_desc" | "newest" | "oldest" | "popular";
  page?: number;
  limit?: number;
  lat?: number;
  lng?: number;
  radius?: number;
}

// ==================== API RESPONSE TYPES ====================
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ListingWithBroker extends Listing {
  broker?: Broker & { user?: SafeUser };
  user?: SafeUser;
}

export interface ConversationWithDetails extends Conversation {
  participants: SafeUser[];
  listing?: Listing;
  lastMessage?: Message;
  unreadCount: number;
}

export interface MessageWithSender extends Message {
  sender: SafeUser;
}

export interface ReviewWithUser extends Review {
  reviewer: SafeUser;
}

export interface PropertyInquiryWithDetails extends PropertyInquiry {
  property?: Listing;
  buyer?: SafeUser;
}

export interface ComparisonCartWithListings extends ComparisonCart {
  listings: Listing[];
}

// ==================== AUTH TYPES ====================
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends InsertUser {
  confirmPassword?: string;
}

// ==================== VALIDATION SCHEMAS ====================
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  role: z.enum(userRoles).default("buyer"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const listingFormSchema = z.object({
  // Core
  title: z.string().min(1, "Title is required"),
  listingType: z.enum(listingTypes),
  propertyType: z.enum(propertyTypes),
  propertySubType: z.string().optional(),
  description: z.string().optional(),

  // Pricing
  price: z.union([
    z.number().min(1, "Price must be greater than 0"),
    z.string().min(1, "Price is required")
  ]),
  pricePerSqft: z.number().optional(),
  negotiable: z.boolean().optional(),

  // Property Details
  areaSqFt: z.number().min(1, "Area is required"),
  bedrooms: z.number().min(0).optional(),
  bathrooms: z.number().min(0).optional(),
  completionStatus: z.enum(completionStatuses).optional(),
  furnishingStatus: z.enum(furnishingStatuses).optional(),
  unitType: z.string().optional(),

  // Building Details
  floor: z.number().optional(),
  totalFloors: z.number().optional(),
  parkingCount: z.number().optional(),
  facing: z.string().optional(),
  balconies: z.number().optional(),
  servantRoom: z.boolean().optional(),
  servantBathroom: z.boolean().optional(),

  // Security/Amenities (Boolean)
  security24x7: z.boolean().optional(),
  cctv: z.boolean().optional(),
  generatorBackup: z.boolean().optional(),
  fireSafety: z.boolean().optional(),
  liftAvailable: z.boolean().optional(),

  // Location
  address: z.string().min(5, "Address is required"),
  city: z.string().min(1, "City is required"),
  district: z.string().optional(),
  area: z.string().optional(),
  coordinates: z.object({ lat: z.number(), lng: z.number() }).optional(),

  // Media
  images: z.array(z.string()).min(1, "At least one image is required"),
  floorPlanUrl: z.string().optional(),
  videoUrl: z.string().optional(),

  // Amenities
  amenities: z.array(z.string()).optional(),

  // Seller Info
  sellerName: z.string().optional(),
  sellerType: z.enum(sellerTypes).optional(),

  // Contact/Communication
  contactPhone: z.string().optional(),
  isPhoneHidden: z.boolean().optional(),
  whatsappEnabled: z.boolean().optional(),
  chatEnabled: z.boolean().optional(),
});

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(10, "Valid phone number required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
