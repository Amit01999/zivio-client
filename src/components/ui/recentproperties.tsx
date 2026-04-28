import { Link } from 'wouter';
import { ArrowRight, Clock3, Sparkles } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { ListingCard, ListingCardSkeleton } from '@/components/ListingCard';
import type { Listing, PaginatedResponse } from '@/types/schema';
import { API_URL } from '@/lib/api';

export default function RecentProperties() {
  const { data, isLoading } = useQuery<PaginatedResponse<Listing>>({
    queryKey: ['/api/listings', { sortBy: 'newest', limit: 8 }],
    queryFn: async () => {
      const response = await fetch(
        `${API_URL}/api/listings?sortBy=newest&limit=8&status=published`,
      );
      if (!response.ok) throw new Error('Failed to fetch listings');
      return response.json();
    },
  });

  const recentListings = data?.data || [];

  return (
    <section className="pb-12 pt-5 bg-gradient-to-b from-white dark:from-gray-900 to-gray-50 dark:to-gray-800">
      <div className="container mx-auto px-6 md:px-12 lg:px-16">
        {/* Section Header */}
        <div className="mb-12 flex flex-col items-center border-b border-[#E8CDD1]/70 pb-8 text-center dark:border-white/10">
          <div className="max-w-3xl">
            <div className="relative mb-5 inline-flex items-center gap-2 overflow-hidden rounded-full border border-[#E8CDD1] bg-gradient-to-r from-white via-[#FBF6F8] to-[#F2E3F4] px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-[#401F48] shadow-lg shadow-[#401F48]/10 backdrop-blur dark:border-[#654B6B]/30 dark:from-white/10 dark:via-[#401F48]/20 dark:to-[#E8CDD1]/10 dark:text-[#F0D7F4]">
              <span className="absolute inset-y-0 left-0 w-12 bg-white/40 blur-xl dark:bg-white/10" />

              <span className="relative">Freshly Curated</span>
              <span className="relative h-1 w-1 rounded-full bg-[#654B6B]" />
              <span className="relative">New Listings</span>
            </div>
            <h2 className="text-4xl font-bold leading-tight text-gray-950 dark:text-white md:text-5xl">
              Recently Added
              <span className="block text-[#401F48] dark:text-[#CBA7D1]">
                Properties
              </span>
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600 dark:text-gray-400 md:text-lg">
              Fresh opportunities curated for buyers who want the newest homes,
              apartments, and investment listings before they disappear.
            </p>
          </div>

          <div className="mt-8 hidden items-center overflow-hidden rounded-full border border-[#E8CDD1]/80 bg-white/75 p-1.5 shadow-xl shadow-[#401F48]/10 backdrop-blur-md dark:border-white/10 dark:bg-white/5 md:inline-flex">
            <div className="flex items-center gap-3 px-5 py-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#401F48] to-[#654B6B] text-white shadow-md shadow-[#401F48]/20">
                <Clock3 className="h-4 w-4" />
              </span>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-950 dark:text-white">
                  Updated daily
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  New homes, just published
                </p>
              </div>
            </div>

            <div className="h-10 w-px bg-[#E8CDD1] dark:bg-white/10" />

            <Link href="/search?sortBy=newest">
              <Button className="h-11 rounded-full bg-[#401F48] px-5 font-semibold text-white shadow-none hover:bg-[#2D1235] dark:bg-[#654B6B] dark:text-gray-950 dark:hover:bg-[#CBA7D1]">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
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
            <Button className="bg-[#401F48] hover:bg-[#2D1235] text-white px-8 py-6 rounded-xl shadow-lg">
              View All Properties
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
