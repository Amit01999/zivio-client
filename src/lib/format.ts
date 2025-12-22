// Currency formatting for Bangladesh Taka
export function formatPrice(amount: number | string, compact = false): string {
  // If the price is a string, check if it's a numeric string
  if (typeof amount === 'string') {
    const numericValue = parseFloat(amount);
    // If it's a valid number string, format it as currency
    if (!isNaN(numericValue)) {
      amount = numericValue;
    } else {
      // Otherwise, return the text as-is (e.g., "Contact for Price")
      return amount;
    }
  }

  // Format as currency
  if (compact) {
    if (amount >= 10000000) {
      return `৳${(amount / 10000000).toFixed(1)}Cr`;
    }
    if (amount >= 100000) {
      return `৳${(amount / 100000).toFixed(1)}L`;
    }
    if (amount >= 1000) {
      return `৳${(amount / 1000).toFixed(0)}K`;
    }
  }

  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace("BDT", "৳");
}

// Format area in square feet
export function formatArea(sqft: number): string {
  return `${sqft.toLocaleString()} sq ft`;
}

// Format relative time
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)}w ago`;
  
  return then.toLocaleDateString("en-BD", {
    month: "short",
    day: "numeric",
    year: then.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

// Format date for display
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

// Get property type label
export function getPropertyTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    apartment: "Apartment",
    house: "House",
    flat: "Flat",
    land: "Land",
    commercial: "Commercial",
    office: "Office",
    shop: "Shop",
  };
  return labels[type] || type;
}

// Get price type label
export function getPriceTypeLabel(type: string): string {
  return type === "rent" ? "For Rent" : "For Sale";
}

// Format phone number for Bangladesh
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("880")) {
    return `+880 ${cleaned.slice(3, 5)} ${cleaned.slice(5, 9)} ${cleaned.slice(9)}`;
  }
  if (cleaned.startsWith("0")) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  return phone;
}