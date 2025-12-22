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
// import heroImage from '@assets/generated_images/dhaka_skyline_hero_image.png';
import heroImage from '../../assets/pt.jpg';

export function PropertyTypeSection() {
  return (
    <section
      className="relative py-16 md:py-24 bg-fixed bg-center bg-cover bg-no-repeat overflow-hidden"
      style={{
        backgroundImage: `url(${heroImage})`,
      }}
      data-testid="section-property-types"
    >
      {/* Blurred backdrop for the background image */}
      <div className="absolute inset-0 backdrop-blur-sm" />

      {/* Pink color overlay for readability and aesthetics */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#EBCFD2]/80 via-[#EBCFD2]/70 to-primary/60"
        style={{ mixBlendMode: 'multiply' }}
      />

      {/* Additional subtle overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/20" />

      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        />
      </div>

      <div className="container mx-auto px-8 md:px-12 lg:px-16 relative z-10">
        {/* Header */}
        <div className="mb-16 text-center space-y-4">
          <div className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white/90 backdrop-blur-sm border-2 border-primary/30 shadow-lg mb-4 animate-slide-down">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-semibold text-primary">
              Explore Properties
            </span>
          </div>

          <h2 className="font-heading text-3xl font-bold md:text-4xl lg:text-5xl mb-3 text-foreground drop-shadow-lg animate-slide-up">
            Browse by Property Type
          </h2>

          <p className="text-lg font-medium text-foreground/80 max-w-2xl mx-auto drop-shadow-md animate-fade-in">
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
              className="group md:w-1/2 relative overflow-hidden rounded-xl backdrop-blur-md bg-gradient-to-br from-primary/40 to-primary-dark/30 border border-primary/30 hover:border-primary/60 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl p-6 animate-scale-in"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 flex-shrink-0">
                  <Building2
                    className="w-10 h-10 text-white"
                    strokeWidth={1.5}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-heading text-xl md:text-2xl font-bold text-white mb-1">
                    Apartments
                  </h3>
                  <p className="text-xs md:text-sm text-white/80">
                    Modern living spaces
                  </p>
                </div>
                <svg
                  className="w-5 h-5 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all"
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
                className="group relative overflow-hidden rounded-xl backdrop-blur-md bg-gradient-to-br from-accent/50 to-accent-dark/40 border border-accent/40 hover:border-accent/70 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl p-5 animate-scale-in"
                style={{ animationDelay: '100ms' }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-white/20 backdrop-blur-sm group-hover:scale-110 transition-all duration-500 flex-shrink-0">
                    <Home className="w-8 h-8 text-white" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading text-lg font-bold text-white mb-0.5">
                      Houses
                    </h3>
                    <p className="text-xs text-white/70">
                      Family homes & estates
                    </p>
                  </div>
                  <svg
                    className="w-4 h-4 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all"
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
                className="group relative overflow-hidden rounded-xl backdrop-blur-md bg-gradient-to-br from-primary/35 to-accent/25 border border-primary/30 hover:border-primary/60 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl p-5 animate-scale-in"
                style={{ animationDelay: '200ms' }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-white/20 backdrop-blur-sm group-hover:scale-110 transition-all duration-500 flex-shrink-0">
                    <Briefcase
                      className="w-8 h-8 text-white"
                      strokeWidth={1.5}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading text-lg font-bold text-white mb-0.5">
                      Commercial
                    </h3>
                    <p className="text-xs text-white/70">
                      Office & business spaces
                    </p>
                  </div>
                  <svg
                    className="w-4 h-4 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all"
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
              className="group relative overflow-hidden rounded-xl backdrop-blur-md bg-gradient-to-br from-accent/45 to-primary/30 border border-accent/40 hover:border-accent/70 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl p-5 animate-scale-in"
              style={{ animationDelay: '300ms' }}
            >
              <div className="text-center space-y-3">
                <div className="inline-flex p-3 rounded-xl bg-white/20 backdrop-blur-sm group-hover:scale-110 transition-all duration-500">
                  <Building className="w-8 h-8 text-white" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-white mb-1">
                    Flats
                  </h3>
                  <p className="text-xs text-white/70">Affordable living</p>
                </div>
              </div>
            </Link>

            <Link
              href="/search?propertyType=land"
              data-testid="link-type-land"
              className="group relative overflow-hidden rounded-xl backdrop-blur-md bg-gradient-to-br from-primary/40 to-accent/35 border border-primary/30 hover:border-primary/60 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl p-5 animate-scale-in"
              style={{ animationDelay: '400ms' }}
            >
              <div className="text-center space-y-3">
                <div className="inline-flex p-3 rounded-xl bg-white/20 backdrop-blur-sm group-hover:scale-110 transition-all duration-500">
                  <MapPin className="w-8 h-8 text-white" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-white mb-1">
                    Land
                  </h3>
                  <p className="text-xs text-white/70">Build your dream</p>
                </div>
              </div>
            </Link>

            <Link
              href="/search?propertyType=shop"
              data-testid="link-type-shop"
              className="group col-span-2 md:col-span-1 relative overflow-hidden rounded-xl backdrop-blur-md bg-gradient-to-br from-accent/40 to-accent-dark/35 border border-accent/40 hover:border-accent/70 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl p-5 animate-scale-in"
              style={{ animationDelay: '500ms' }}
            >
              <div className="text-center space-y-3">
                <div className="inline-flex p-3 rounded-xl bg-white/20 backdrop-blur-sm group-hover:scale-110 transition-all duration-500">
                  <Store className="w-8 h-8 text-white" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-white mb-1">
                    Shops
                  </h3>
                  <p className="text-xs text-white/70">Retail spaces</p>
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
          <div className="inline-flex items-center gap-3 text-sm font-medium text-foreground/70 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full shadow-md">
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-primary to-primary/50" />
            <span>Click any category to explore listings</span>
            <div className="w-12 h-px bg-gradient-to-l from-transparent via-primary to-primary/50" />
          </div>
        </div>
      </div>
    </section>
  );
}
