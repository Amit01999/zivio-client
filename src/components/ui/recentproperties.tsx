import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { ListingCard, ListingCardSkeleton } from '@/components/ListingCard';
import type { Listing, PaginatedResponse } from '@/types/schema';

export default function RecentProperties() {
  const { data, isLoading } = useQuery<PaginatedResponse<Listing>>({
    queryKey: ['/api/listings', { sortBy: 'newest', limit: 8 }],
    queryFn: async () => {
      const response = await fetch('/api/listings?sortBy=newest&limit=8&status=published');
      if (!response.ok) throw new Error('Failed to fetch listings');
      return response.json();
    },
  });

  const recentListings = data?.data || [];

  return (
    <section className="py-12 bg-gradient-to-b from-white dark:from-gray-900 to-gray-50 dark:to-gray-800">
      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-[#75577A] dark:text-[#A88AAD] font-semibold text-sm mb-3 tracking-wide uppercase">
            New Listings
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
            Recently Added
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
            Discover our newest property listings with the latest opportunities
          </p>
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <ListingCardSkeleton key={i} />
              ))
            : recentListings.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
        </div>

        {/* View All Button (Mobile) */}
        <div className="mt-12 text-center md:hidden">
          <Link href="/search?sortBy=newest">
            <Button className="bg-[#75577A] hover:bg-[#5A4260] text-white px-8 py-6 rounded-xl shadow-lg">
              View All Properties
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
