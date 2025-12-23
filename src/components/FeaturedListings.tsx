import { useQuery } from '@tanstack/react-query';
import { ChevronRight, Sparkles } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ListingCard, ListingCardSkeleton } from './ListingCard';
import type { Listing, PaginatedResponse } from '@/types/schema';
import { API_URL } from '@/lib/api';

interface FeaturedListingsProps {
  title?: string;
  limit?: number;
  city?: string;
  showViewAll?: boolean;
}

export function FeaturedListings({
  title = 'Featured Properties',
  limit = 4,
  city,
  showViewAll = true,
}: FeaturedListingsProps) {
  const queryParams = new URLSearchParams({
    isFeatured: 'true',
    limit: limit.toString(),
    status: 'published',
  });
  if (city) queryParams.set('city', city);

  const { data, isLoading, error } = useQuery<PaginatedResponse<Listing>>({
    queryKey: ['/api/listings', { featured: true, limit, city }],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/listings?${queryParams.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch listings');
      return response.json();
    },
  });

  if (error) {
    return null;
  }

  return (
    <section
      className="py-12 md:py-16 bg-background"
      data-testid="section-featured"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <Sparkles className="h-5 w-5 text-accent" />
            </div>
            <h2 className="font-heading text-2xl font-bold md:text-3xl">
              {title}
            </h2>
          </div>
          {showViewAll && (
            <Link href="/search?isFeatured=true">
              <Button
                variant="ghost"
                className="gap-1"
                data-testid="link-view-all-featured"
              >
                View All
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {isLoading
            ? Array.from({ length: limit }).map((_, i) => (
                <ListingCardSkeleton key={i} />
              ))
            : data?.data.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
        </div>

        {!isLoading && (!data?.data || data.data.length === 0) && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">
              No featured properties available at the moment.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
