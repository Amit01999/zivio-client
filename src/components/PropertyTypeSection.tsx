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
      className="relative overflow-hidden bg-fixed bg-center bg-cover bg-no-repeat py-20 md:py-32"
      style={{ backgroundImage: `url(${heroImage})` }}
      data-testid="section-property-types"
    >
      {/* Subtle edge vignette — image shows through fully */}
      <div className="absolute inset-0 bg-black/22" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/35" />

      {/* Decorative corner frames */}
      <div className="absolute top-8 left-8 w-20 h-20 border-l-2 border-t-2 border-[#C9A96E]/35 pointer-events-none" />
      <div className="absolute top-8 right-8 w-20 h-20 border-r-2 border-t-2 border-[#C9A96E]/35 pointer-events-none" />
      <div className="absolute bottom-8 left-8 w-20 h-20 border-l-2 border-b-2 border-[#C9A96E]/35 pointer-events-none" />
      <div className="absolute bottom-8 right-8 w-20 h-20 border-r-2 border-b-2 border-[#C9A96E]/35 pointer-events-none" />

      <div className="container mx-auto px-8 md:px-12 lg:px-16 relative z-10">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="mb-7 flex items-center justify-center gap-4 animate-slide-down">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#C9A96E]/70" />
            <div className="flex items-center gap-2.5">
              <Sparkles className="h-3 w-3 fill-[#C9A96E] text-[#C9A96E]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#C9A96E]">
                Curated Collection
              </span>
              <Sparkles className="h-3 w-3 fill-[#C9A96E] text-[#C9A96E]" />
            </div>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#C9A96E]/70" />
          </div>

          <h2 className="font-heading text-3xl font-bold text-white tracking-widest md:text-4xl lg:text-5xl xl:text-6xl animate-slide-up">
            Browse by Property Type
          </h2>

          <div className="mx-auto mt-6 flex items-center justify-center gap-4">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#C9A96E]/40" />
            <p className="text-xs font-light uppercase tracking-[0.18em] text-white/60 md:text-sm animate-fade-in">
              Find the perfect property that suits your lifestyle
            </p>
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#C9A96E]/40" />
          </div>
        </div>

        {/* Cards Grid */}
        <div className="max-w-6xl mx-auto">
          {/* Row 1: Apartments (large) + Houses & Commercial (stacked) */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            {/* Apartments — Large Featured */}
            <Link
              href="/search?propertyType=apartment"
              data-testid="link-type-apartment"
              className="group relative overflow-hidden border border-[#C9A96E]/22 bg-white shadow-[0_8px_40px_rgba(180,140,80,0.12),0_2px_10px_rgba(64,31,72,0.06)] transition-all duration-500 hover:border-[#C9A96E]/60 hover:shadow-[0_0_50px_rgba(201,169,110,0.18),0_16px_48px_rgba(180,140,80,0.14)] md:w-1/2 animate-scale-in p-8"
            >
              {/* Top gold hairline */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C9A96E]/70 to-transparent" />
              {/* Left accent bar grows on hover */}
              <div className="absolute left-0 top-0 w-[2px] h-0 bg-gradient-to-b from-[#C9A96E] to-[#C9A96E]/25 transition-all duration-500 group-hover:h-full" />
              {/* Corner brackets */}
              <div className="absolute top-3.5 right-3.5 w-5 h-5 border-t border-r border-[#C9A96E]/30 group-hover:border-[#C9A96E]/75 transition-colors duration-400" />
              <div className="absolute bottom-3.5 left-3.5 w-5 h-5 border-b border-l border-[#C9A96E]/30 group-hover:border-[#C9A96E]/75 transition-colors duration-400" />
              {/* Watermark number */}
              <div className="absolute -right-3 -top-5 text-[8rem] font-black leading-none select-none pointer-events-none text-[#C9A96E]/10">
                01
              </div>

              <div className="relative flex items-center gap-6">
                {/* Icon box with corner ticks */}
                <div className="flex-shrink-0 relative">
                  <div className="relative w-16 h-16 border border-[#C9A96E]/35 bg-[#FBF7F0] flex items-center justify-center group-hover:border-[#C9A96E]/75 group-hover:shadow-[0_0_22px_rgba(201,169,110,0.20)] transition-all duration-500">
                    <Building2
                      className="w-8 h-8 text-[#C9A96E]"
                      strokeWidth={1.2}
                    />
                    <div className="absolute -top-px -left-px w-2.5 h-2.5 border-t border-l border-[#C9A96E]/60" />
                    <div className="absolute -bottom-px -right-px w-2.5 h-2.5 border-b border-r border-[#C9A96E]/60" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[9px] uppercase tracking-[0.35em] text-[#C9A96E] mb-1.5 font-semibold">
                    Category 01
                  </p>
                  <h3 className="font-heading text-2xl md:text-3xl font-bold text-[#1C0F24] tracking-wide leading-tight">
                    Apartments
                  </h3>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[#1C0F24]/42 mt-1.5 font-light">
                    Modern living spaces
                  </p>
                </div>

                <div className="flex-shrink-0 w-9 h-9 border border-[#C9A96E]/32 rounded-full flex items-center justify-center group-hover:border-[#C9A96E]/70 group-hover:bg-[#C9A96E]/10 group-hover:shadow-[0_0_14px_rgba(201,169,110,0.22)] transition-all duration-400">
                  <svg
                    className="w-3.5 h-3.5 text-[#C9A96E]/60 group-hover:text-[#C9A96E] group-hover:translate-x-0.5 transition-all duration-300"
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
              </div>
            </Link>

            {/* Houses & Commercial — Stacked */}
            <div className="md:w-1/2 flex flex-col gap-4">
              <Link
                href="/search?propertyType=house"
                data-testid="link-type-house"
                className="group relative overflow-hidden border border-[#C9A96E]/22 bg-white p-6 shadow-[0_8px_30px_rgba(180,140,80,0.10),0_2px_8px_rgba(64,31,72,0.05)] transition-all duration-500 hover:border-[#C9A96E]/60 hover:shadow-[0_0_36px_rgba(201,169,110,0.16),0_12px_36px_rgba(180,140,80,0.12)] animate-scale-in"
                style={{ animationDelay: '100ms' }}
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C9A96E]/60 to-transparent" />
                <div className="absolute left-0 top-0 w-[2px] h-0 bg-gradient-to-b from-[#C9A96E] to-[#C9A96E]/25 transition-all duration-500 group-hover:h-full" />
                <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-[#C9A96E]/30 group-hover:border-[#C9A96E]/68 transition-colors duration-400" />
                <div className="absolute -right-2 -top-4 text-[5rem] font-black leading-none select-none pointer-events-none text-[#C9A96E]/10">
                  02
                </div>

                <div className="relative flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 border border-[#C9A96E]/32 bg-[#FBF7F0] flex items-center justify-center group-hover:border-[#C9A96E]/68 group-hover:shadow-[0_0_16px_rgba(201,169,110,0.18)] transition-all duration-500">
                    <Home
                      className="w-6 h-6 text-[#C9A96E]"
                      strokeWidth={1.2}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-[8px] uppercase tracking-[0.32em] text-[#C9A96E] mb-1 font-semibold">
                      Category 02
                    </p>
                    <h3 className="font-heading text-lg font-bold text-[#1C0F24] tracking-wide">
                      Houses
                    </h3>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#1C0F24]/40 mt-0.5 font-light">
                      Family homes & estates
                    </p>
                  </div>
                  <div className="flex-shrink-0 w-7 h-7 border border-[#C9A96E]/28 rounded-full flex items-center justify-center group-hover:border-[#C9A96E]/65 group-hover:bg-[#C9A96E]/10 transition-all duration-400">
                    <svg
                      className="w-3 h-3 text-[#C9A96E]/55 group-hover:text-[#C9A96E] group-hover:translate-x-0.5 transition-all"
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
                </div>
              </Link>

              <Link
                href="/search?propertyType=commercial"
                data-testid="link-type-commercial"
                className="group relative overflow-hidden border border-[#C9A96E]/22 bg-white p-6 shadow-[0_8px_30px_rgba(180,140,80,0.10),0_2px_8px_rgba(64,31,72,0.05)] transition-all duration-500 hover:border-[#C9A96E]/60 hover:shadow-[0_0_36px_rgba(201,169,110,0.16),0_12px_36px_rgba(180,140,80,0.12)] animate-scale-in"
                style={{ animationDelay: '200ms' }}
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C9A96E]/60 to-transparent" />
                <div className="absolute left-0 top-0 w-[2px] h-0 bg-gradient-to-b from-[#C9A96E] to-[#C9A96E]/25 transition-all duration-500 group-hover:h-full" />
                <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-[#C9A96E]/30 group-hover:border-[#C9A96E]/68 transition-colors duration-400" />
                <div className="absolute -right-2 -top-4 text-[5rem] font-black leading-none select-none pointer-events-none text-[#C9A96E]/10">
                  03
                </div>

                <div className="relative flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 border border-[#C9A96E]/32 bg-[#FBF7F0] flex items-center justify-center group-hover:border-[#C9A96E]/68 group-hover:shadow-[0_0_16px_rgba(201,169,110,0.18)] transition-all duration-500">
                    <Briefcase
                      className="w-6 h-6 text-[#C9A96E]"
                      strokeWidth={1.2}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-[8px] uppercase tracking-[0.32em] text-[#C9A96E] mb-1 font-semibold">
                      Category 03
                    </p>
                    <h3 className="font-heading text-lg font-bold text-[#1C0F24] tracking-wide">
                      Commercial
                    </h3>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#1C0F24]/40 mt-0.5 font-light">
                      Office & business spaces
                    </p>
                  </div>
                  <div className="flex-shrink-0 w-7 h-7 border border-[#C9A96E]/28 rounded-full flex items-center justify-center group-hover:border-[#C9A96E]/65 group-hover:bg-[#C9A96E]/10 transition-all duration-400">
                    <svg
                      className="w-3 h-3 text-[#C9A96E]/55 group-hover:text-[#C9A96E] group-hover:translate-x-0.5 transition-all"
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
                </div>
              </Link>
            </div>
          </div>

          {/* Row 2: Three equal cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Link
              href="/search?propertyType=flat"
              data-testid="link-type-flat"
              className="group relative overflow-hidden border border-[#C9A96E]/22 bg-white p-6 shadow-[0_8px_30px_rgba(180,140,80,0.10),0_2px_8px_rgba(64,31,72,0.05)] transition-all duration-500 hover:border-[#C9A96E]/60 hover:shadow-[0_0_36px_rgba(201,169,110,0.16),0_12px_36px_rgba(180,140,80,0.12)] animate-scale-in"
              style={{ animationDelay: '300ms' }}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C9A96E]/60 to-transparent" />
              <div className="absolute top-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#C9A96E] to-[#C9A96E]/25 transition-all duration-500 group-hover:w-full" />
              <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-[#C9A96E]/30 group-hover:border-[#C9A96E]/68 transition-colors duration-400" />
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-[#C9A96E]/30 group-hover:border-[#C9A96E]/68 transition-colors duration-400" />
              <div className="absolute -right-1 -top-3 text-[4rem] font-black leading-none select-none pointer-events-none text-[#C9A96E]/10">
                04
              </div>

              <div className="relative text-center space-y-4">
                <div className="inline-flex w-14 h-14 border border-[#C9A96E]/32 bg-[#FBF7F0] items-center justify-center group-hover:border-[#C9A96E]/68 group-hover:shadow-[0_0_20px_rgba(201,169,110,0.20)] transition-all duration-500">
                  <Building
                    className="w-7 h-7 text-[#C9A96E]"
                    strokeWidth={1.2}
                  />
                </div>
                <div>
                  <p className="text-[8px] uppercase tracking-[0.32em] text-[#C9A96E] mb-1.5 font-semibold">
                    Category 04
                  </p>
                  <h3 className="font-heading text-base font-bold text-[#1C0F24] tracking-wide">
                    Flats
                  </h3>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#1C0F24]/40 mt-1 font-light">
                    Affordable living
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/search?propertyType=land"
              data-testid="link-type-land"
              className="group relative overflow-hidden border border-[#C9A96E]/22 bg-white p-6 shadow-[0_8px_30px_rgba(180,140,80,0.10),0_2px_8px_rgba(64,31,72,0.05)] transition-all duration-500 hover:border-[#C9A96E]/60 hover:shadow-[0_0_36px_rgba(201,169,110,0.16),0_12px_36px_rgba(180,140,80,0.12)] animate-scale-in"
              style={{ animationDelay: '400ms' }}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C9A96E]/60 to-transparent" />
              <div className="absolute top-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#C9A96E] to-[#C9A96E]/25 transition-all duration-500 group-hover:w-full" />
              <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-[#C9A96E]/30 group-hover:border-[#C9A96E]/68 transition-colors duration-400" />
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-[#C9A96E]/30 group-hover:border-[#C9A96E]/68 transition-colors duration-400" />
              <div className="absolute -right-1 -top-3 text-[4rem] font-black leading-none select-none pointer-events-none text-[#C9A96E]/10">
                05
              </div>

              <div className="relative text-center space-y-4">
                <div className="inline-flex w-14 h-14 border border-[#C9A96E]/32 bg-[#FBF7F0] items-center justify-center group-hover:border-[#C9A96E]/68 group-hover:shadow-[0_0_20px_rgba(201,169,110,0.20)] transition-all duration-500">
                  <MapPin
                    className="w-7 h-7 text-[#C9A96E]"
                    strokeWidth={1.2}
                  />
                </div>
                <div>
                  <p className="text-[8px] uppercase tracking-[0.32em] text-[#C9A96E] mb-1.5 font-semibold">
                    Category 05
                  </p>
                  <h3 className="font-heading text-base font-bold text-[#1C0F24] tracking-wide">
                    Land
                  </h3>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#1C0F24]/40 mt-1 font-light">
                    Build your dream
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/search?propertyType=shop"
              data-testid="link-type-shop"
              className="group relative col-span-2 overflow-hidden border border-[#C9A96E]/22 bg-white p-6 shadow-[0_8px_30px_rgba(180,140,80,0.10),0_2px_8px_rgba(64,31,72,0.05)] transition-all duration-500 hover:border-[#C9A96E]/60 hover:shadow-[0_0_36px_rgba(201,169,110,0.16),0_12px_36px_rgba(180,140,80,0.12)] md:col-span-1 animate-scale-in"
              style={{ animationDelay: '500ms' }}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C9A96E]/60 to-transparent" />
              <div className="absolute top-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#C9A96E] to-[#C9A96E]/25 transition-all duration-500 group-hover:w-full" />
              <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-[#C9A96E]/30 group-hover:border-[#C9A96E]/68 transition-colors duration-400" />
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-[#C9A96E]/30 group-hover:border-[#C9A96E]/68 transition-colors duration-400" />
              <div className="absolute -right-1 -top-3 text-[4rem] font-black leading-none select-none pointer-events-none text-[#C9A96E]/10">
                06
              </div>

              <div className="relative text-center space-y-4">
                <div className="inline-flex w-14 h-14 border border-[#C9A96E]/32 bg-[#FBF7F0] items-center justify-center group-hover:border-[#C9A96E]/68 group-hover:shadow-[0_0_20px_rgba(201,169,110,0.20)] transition-all duration-500">
                  <Store className="w-7 h-7 text-[#C9A96E]" strokeWidth={1.2} />
                </div>
                <div>
                  <p className="text-[8px] uppercase tracking-[0.32em] text-[#C9A96E] mb-1.5 font-semibold">
                    Category 06
                  </p>
                  <h3 className="font-heading text-base font-bold text-[#1C0F24] tracking-wide">
                    Shops
                  </h3>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#1C0F24]/40 mt-1 font-light">
                    Retail spaces
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Bottom decorative text */}
        <div
          className="mt-14 text-center animate-fade-in"
          style={{ animationDelay: '600ms' }}
        >
          <div className="inline-flex items-center gap-5">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#C9A96E]/55" />
            <span className="text-[10px] uppercase tracking-[0.32em] text-white/45 font-light">
              Click any category to explore listings
            </span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#C9A96E]/55" />
          </div>
        </div>
      </div>
    </section>
  );
}
