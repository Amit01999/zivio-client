import HeroParallax from '@/components/HeroParallax';
import CategoryNav from '@/components/CategoryNav';
import { FeaturedListings } from '@/components/FeaturedListings';
import FeaturedProperties from '@/components/ui/featuredproperties';
import { PropertyTypeSection } from '@/components/PropertyTypeSection';
import { PopularCities } from '@/components/PopularCities';
import { useQuery } from '@tanstack/react-query';

import type { Listing, PaginatedResponse } from '@/types/schema';
import RecentProperties from '@/components/ui/recentproperties';
import Testimonial from '@/components/Testimonial';
import CTAHome from '@/components/CTAHome';
import WhyWithUs from '@/components/WhyWithUs';

export default function Home() {
  return (
    <div className="relative min-h-screen">
      {/* Hero Section with Parallax */}
      <HeroParallax />
      <div className="relative bg-gray-50 dark:bg-gray-900 z-20">
        <div className="relative z-30">
          <RecentProperties />
          <PropertyTypeSection />
          <PopularCities />
          <FeaturedProperties />
          <CTAHome />
          <CategoryNav />
          <WhyWithUs />
          <Testimonial />
        </div>
      </div>
    </div>
  );
}
