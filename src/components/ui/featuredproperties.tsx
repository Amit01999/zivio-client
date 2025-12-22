import { Link } from 'wouter';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { ListingCard, ListingCardSkeleton } from '@/components/ListingCard';
import type { Listing, PaginatedResponse } from '@/types/schema';

export default function FeaturedProperties() {
  const { data, isLoading, error } = useQuery<PaginatedResponse<Listing>>({
    queryKey: ['/api/listings', { isFeatured: true, limit: 8 }],
    queryFn: async () => {
      const response = await fetch('/api/listings?isFeatured=true&limit=8');
      if (!response.ok) {
        throw new Error('Failed to fetch featured listings');
      }
      return response.json();
    },
  });

  const featuredListings = data?.data || [];

  // Don't render if there's an error or no featured listings when loading is complete
  if (error) {
    console.error('Error loading featured properties:', error);
    return null;
  }

  if (!isLoading && featuredListings.length === 0) {
    return null;
  }

  return (
    <section className="relative py-20 bg-gradient-to-br from-[#F6F2F7] dark:from-gray-800 via-white dark:via-gray-900 to-[#FBF8F9] dark:to-gray-800 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#E8CDD1]/20 dark:bg-[#A88AAD]/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#75577A]/10 dark:bg-[#75577A]/5 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-6 md:px-12 lg:px-16 relative">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-[#75577A] dark:text-[#A88AAD]" />
            <p className="text-[#75577A] dark:text-[#A88AAD] font-semibold text-sm tracking-wide uppercase">
              Premium Selection
            </p>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
            Featured Properties
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Handpicked premium properties with exceptional quality and prime
            locations
          </p>
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <ListingCardSkeleton key={i} />
              ))
            : featuredListings.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
        </div>

        {/* View All Button (Mobile & Tablet) */}
        <div className="mt-12 text-center md:hidden">
          <Link href="/search?isFeatured=true">
            <Button className="bg-[#75577A] hover:bg-[#5A4260] text-white px-8 py-6 rounded-xl shadow-lg">
              View All Featured Properties
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Featured Badge Info */}
        {/* <div className="mt-16 p-6 bg-gradient-to-r from-[#75577A]/5 to-[#E8CDD1]/20 rounded-2xl border border-[#E8CDD1]/50">
          <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#75577A] shrink-0">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-1">Why Featured Properties?</h3>
              <p className="text-sm text-gray-600">
                These properties are verified, premium listings with complete documentation,
                professional photos, and expedited support from our team.
              </p>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
}
