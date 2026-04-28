import { Link } from 'wouter';
import {
  Building2,
  Home,
  Building,
  MapPin,
  Store,
  Briefcase,
  Sparkles,
} from 'lucide-react';

import heroImage from '../../assets/h11.png';

export function PropertyTypeSection() {
  return (
    <section
      className="relative overflow-hidden bg-fixed bg-center bg-cover bg-no-repeat py-16 md:py-24"
      style={{
        backgroundImage: `url(${heroImage})`,
      }}
      data-testid="section-property-types"
    >
      {/* <div className="absolute inset-0 bg-[#F5F0EA]/82" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#F5F0EA]/92 via-[#E8CDD1]/68 to-[#401F48]/54" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.42),transparent_36%),linear-gradient(to_bottom,rgba(245,240,234,0.35),rgba(245,240,234,0.12))]" /> */}

      <div className="container mx-auto px-8 md:px-12 lg:px-16 relative z-10">
        {/* Header */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center justify-center gap-2 rounded-full border border-[#401F48]/20 bg-[#F5F0EA]/82 px-5 py-2.5 shadow-[0_14px_34px_rgba(101,75,107,0.14)] backdrop-blur-md animate-slide-down">
            <Sparkles className="h-4 w-4 fill-[#E8CDD1] text-[#401F48]" />
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#401F48]">
              Explore Properties
            </span>
          </div>

          <h2 className="font-heading text-3xl font-bold text-[#401F48] drop-shadow-[0_8px_24px_rgba(255,255,255,0.45)] md:text-4xl lg:text-5xl animate-slide-up">
            Browse by Property Type
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-7 text-[#401F48]/74 drop-shadow-[0_1px_10px_rgba(255,255,255,0.42)] md:text-lg animate-fade-in">
            Find the perfect property that suits your needs and lifestyle
          </p>
        </div>

        {/* Unique Compact Layout - Creative Asymmetric Design */}
        <div className="max-w-6xl mx-auto">
          {/* Row 1: Apartments (large) + Houses (medium stacked) */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            {/* Apartments - Large Featured */}
            <Link
              href="/search?propertyType=apartment"
              data-testid="link-type-apartment"
              className="group relative overflow-hidden rounded-2xl border border-[#E8CDD1]/70 bg-[#F5F0EA]/88 p-6 shadow-[0_20px_50px_rgba(64,31,72,0.16)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-[#401F48]/38 hover:bg-white/92 hover:shadow-[0_26px_64px_rgba(64,31,72,0.22)] md:w-1/2 animate-scale-in"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#401F48]/38 to-transparent" />
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 rounded-2xl border border-[#E8CDD1] bg-[#401F48]/10 p-3 shadow-inner shadow-white/60 backdrop-blur-sm transition-all duration-500 group-hover:scale-110">
                  <Building2
                    className="w-10 h-10 text-[#401F48]"
                    strokeWidth={1.5}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-heading text-xl md:text-2xl font-bold text-[#401F48] mb-1">
                    Apartments
                  </h3>
                  <p className="text-xs md:text-sm text-[#401F48]/72">
                    Modern living spaces
                  </p>
                </div>
                <svg
                  className="w-5 h-5 text-[#401F48]/50 group-hover:translate-x-1 group-hover:text-[#401F48] transition-all"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>

            {/* Houses & Commercial - Stacked */}
            <div className="md:w-1/2 flex flex-col gap-4">
              <Link
                href="/search?propertyType=house"
                data-testid="link-type-house"
                className="group relative overflow-hidden rounded-2xl border border-[#E8CDD1]/70 bg-[#F5F0EA]/86 p-5 shadow-[0_16px_40px_rgba(64,31,72,0.14)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-[#401F48]/38 hover:bg-white/92 hover:shadow-[0_22px_54px_rgba(64,31,72,0.20)] animate-scale-in"
                style={{ animationDelay: '100ms' }}
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#401F48]/30 to-transparent" />
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl border border-[#E8CDD1] bg-[#401F48]/10 backdrop-blur-sm group-hover:scale-110 transition-all duration-500 flex-shrink-0">
                    <Home
                      className="w-8 h-8 text-[#401F48]"
                      strokeWidth={1.5}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading text-lg font-bold text-[#401F48] mb-0.5">
                      Houses
                    </h3>
                    <p className="text-xs text-[#401F48]/70">
                      Family homes & estates
                    </p>
                  </div>
                  <svg
                    className="w-4 h-4 text-[#401F48]/50 group-hover:translate-x-1 group-hover:text-[#401F48] transition-all"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>

              <Link
                href="/search?propertyType=commercial"
                data-testid="link-type-commercial"
                className="group relative overflow-hidden rounded-2xl border border-[#E8CDD1]/70 bg-[#F5F0EA]/86 p-5 shadow-[0_16px_40px_rgba(64,31,72,0.14)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-[#401F48]/38 hover:bg-white/92 hover:shadow-[0_22px_54px_rgba(64,31,72,0.20)] animate-scale-in"
                style={{ animationDelay: '200ms' }}
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#401F48]/30 to-transparent" />
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl border border-[#E8CDD1] bg-[#401F48]/10 backdrop-blur-sm group-hover:scale-110 transition-all duration-500 flex-shrink-0">
                    <Briefcase
                      className="w-8 h-8 text-[#401F48]"
                      strokeWidth={1.5}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading text-lg font-bold text-[#401F48] mb-0.5">
                      Commercial
                    </h3>
                    <p className="text-xs text-[#401F48]/70">
                      Office & business spaces
                    </p>
                  </div>
                  <svg
                    className="w-4 h-4 text-[#401F48]/50 group-hover:translate-x-1 group-hover:text-[#401F48] transition-all"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>
            </div>
          </div>

          {/* Row 2: Three equal cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Link
              href="/search?propertyType=flat"
              data-testid="link-type-flat"
              className="group relative overflow-hidden rounded-2xl border border-[#E8CDD1]/70 bg-[#F5F0EA]/86 p-5 shadow-[0_16px_40px_rgba(64,31,72,0.14)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-[#401F48]/38 hover:bg-white/92 hover:shadow-[0_22px_54px_rgba(64,31,72,0.20)] animate-scale-in"
              style={{ animationDelay: '300ms' }}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#401F48]/30 to-transparent" />
              <div className="text-center space-y-3">
                <div className="inline-flex p-3 rounded-2xl border border-[#E8CDD1] bg-[#401F48]/10 backdrop-blur-sm group-hover:scale-110 transition-all duration-500">
                  <Building
                    className="w-8 h-8 text-[#401F48]"
                    strokeWidth={1.5}
                  />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-[#401F48] mb-1">
                    Flats
                  </h3>
                  <p className="text-xs text-[#401F48]/70">Affordable living</p>
                </div>
              </div>
            </Link>

            <Link
              href="/search?propertyType=land"
              data-testid="link-type-land"
              className="group relative overflow-hidden rounded-2xl border border-[#E8CDD1]/70 bg-[#F5F0EA]/86 p-5 shadow-[0_16px_40px_rgba(64,31,72,0.14)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-[#401F48]/38 hover:bg-white/92 hover:shadow-[0_22px_54px_rgba(64,31,72,0.20)] animate-scale-in"
              style={{ animationDelay: '400ms' }}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#401F48]/30 to-transparent" />
              <div className="text-center space-y-3">
                <div className="inline-flex p-3 rounded-2xl border border-[#E8CDD1] bg-[#401F48]/10 backdrop-blur-sm group-hover:scale-110 transition-all duration-500">
                  <MapPin
                    className="w-8 h-8 text-[#401F48]"
                    strokeWidth={1.5}
                  />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-[#401F48] mb-1">
                    Land
                  </h3>
                  <p className="text-xs text-[#401F48]/70">Build your dream</p>
                </div>
              </div>
            </Link>

            <Link
              href="/search?propertyType=shop"
              data-testid="link-type-shop"
              className="group relative col-span-2 overflow-hidden rounded-2xl border border-[#E8CDD1]/70 bg-[#F5F0EA]/86 p-5 shadow-[0_16px_40px_rgba(64,31,72,0.14)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-[#401F48]/38 hover:bg-white/92 hover:shadow-[0_22px_54px_rgba(64,31,72,0.20)] md:col-span-1 animate-scale-in"
              style={{ animationDelay: '500ms' }}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#401F48]/30 to-transparent" />
              <div className="text-center space-y-3">
                <div className="inline-flex p-3 rounded-2xl border border-[#E8CDD1] bg-[#401F48]/10 backdrop-blur-sm group-hover:scale-110 transition-all duration-500">
                  <Store className="w-8 h-8 text-[#401F48]" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-[#401F48] mb-1">
                    Shops
                  </h3>
                  <p className="text-xs text-[#401F48]/70">Retail spaces</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Bottom decorative text */}
        <div
          className="mt-12 text-center animate-fade-in"
          style={{ animationDelay: '600ms' }}
        >
          <div className="inline-flex items-center gap-3 rounded-full border border-[#E8CDD1]/70 bg-[#F5F0EA]/80 px-6 py-3 text-sm font-medium text-[#401F48]/72 shadow-[0_14px_36px_rgba(64,31,72,0.14)] backdrop-blur-md">
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#401F48]/50 to-[#401F48]/20" />
            <span>Click any category to explore listings</span>
            <div className="w-12 h-px bg-gradient-to-l from-transparent via-[#401F48]/50 to-[#401F48]/20" />
          </div>
        </div>
      </div>
    </section>
  );
}
