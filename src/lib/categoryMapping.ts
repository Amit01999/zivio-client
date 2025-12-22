/**
 * Category Mapping Utility (Frontend)
 *
 * Provides category derivation and mapping for the UI
 */

import { ListingType, PropertyType } from "@/types/schema";

export type ListingCategory =
  | 'Land For Sale'
  | 'Apartments For Sale'
  | 'Apartment Rentals'
  | 'Commercial Property Rentals'
  | 'Property Rentals'
  | 'Houses For Sale'
  | 'Commercial Properties For Sale'
  | 'Room Rentals'
  | 'House Rentals'
  | 'Land Rentals'
  | 'Other Properties';

interface CategoryInput {
  listingType: ListingType;
  propertyType: PropertyType;
  propertySubType?: string;
}

export function deriveCategory(listing: CategoryInput): ListingCategory {
  const { listingType, propertyType, propertySubType } = listing;

  if (listingType === 'sale') {
    if (propertyType === 'land') return 'Land For Sale';
    if (propertyType === 'apartment') return 'Apartments For Sale';
    if (propertyType === 'house') return 'Houses For Sale';
    if (['commercial', 'office', 'shop'].includes(propertyType)) {
      return 'Commercial Properties For Sale';
    }
  }

  if (listingType === 'rent') {
    if (propertyType === 'land') return 'Land Rentals';
    if (propertyType === 'house') return 'House Rentals';
    if (propertyType === 'apartment') {
      if (propertySubType?.toLowerCase().includes('room')) return 'Room Rentals';
      return 'Apartment Rentals';
    }
    if (propertyType === 'flat') return 'Property Rentals';
    if (['commercial', 'office', 'shop'].includes(propertyType)) {
      return 'Commercial Property Rentals';
    }
  }

  return 'Other Properties';
}

export function getCategoryFilters(category: ListingCategory): Partial<CategoryInput> {
  const mapping: Record<ListingCategory, Partial<CategoryInput>> = {
    'Land For Sale': { listingType: 'sale', propertyType: 'land' },
    'Apartments For Sale': { listingType: 'sale', propertyType: 'apartment' },
    'Apartment Rentals': { listingType: 'rent', propertyType: 'apartment' },
    'Commercial Property Rentals': { listingType: 'rent', propertyType: 'commercial' },
    'Property Rentals': { listingType: 'rent', propertyType: 'flat' },
    'Houses For Sale': { listingType: 'sale', propertyType: 'house' },
    'Commercial Properties For Sale': { listingType: 'sale', propertyType: 'commercial' },
    'Room Rentals': { listingType: 'rent', propertyType: 'apartment', propertySubType: 'Room' },
    'House Rentals': { listingType: 'rent', propertyType: 'house' },
    'Land Rentals': { listingType: 'rent', propertyType: 'land' },
    'Other Properties': {},
  };

  return mapping[category] || {};
}

export function getAllCategories(): ListingCategory[] {
  return [
    'Land For Sale',
    'Apartments For Sale',
    'Apartment Rentals',
    'Commercial Property Rentals',
    'Property Rentals',
    'Houses For Sale',
    'Commercial Properties For Sale',
    'Room Rentals',
    'House Rentals',
    'Land Rentals',
  ];
}

export function formatCategoryLabel(category: ListingCategory): string {
  return category;
}
