import { Link } from 'wouter';
import { ArrowRight, MapPin, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
//import all the image from assets/Dhaka-area photo
import banani2 from '../../assets/Dhaka-area/banani1.webp';
import bashundhara from '../../assets/Dhaka-area/bashundhara.jpeg';
import dhanmondi from '../../assets/Dhaka-area/dhanmondi 2.jpg';
import gulshan from '../../assets/Dhaka-area/Gulshan.jpg';
import mohammadpur from '../../assets/Dhaka-area/mohammadpur 2.avif';
import mirpur from '../../assets/Dhaka-area/mirpurr 2.jpg';
import savar from '../../assets/Dhaka-area/savar.jpg';
import uttara from '../../assets/Dhaka-area/uttora.webp';

const locations = [
  {
    name: 'Dhanmondi',
    image: dhanmondi,
  },
  {
    name: 'Gulshan',
    image: gulshan,
  },
  {
    name: 'Banani',
    image: banani2,
  },
  {
    name: 'Uttara',
    image: uttara,
  },
  {
    name: 'Bashundhara',
    image: bashundhara,
  },
  {
    name: 'Mohammadpur',
    image: mohammadpur,
  },
  {
    name: 'Savar',
    image: savar,
  },
  {
    name: 'Mirpur',
    image: mirpur,
  },
];

export function PopularCities() {
  return (
    <section
      className="relative overflow-hidden bg-[#F5F0EA] py-20 dark:bg-gray-900"
      data-testid="section-cities"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(232,205,209,0.42),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.72),rgba(245,240,234,0.9))] dark:bg-none" />
      <div className="container relative z-10 mx-auto px-8 md:px-12 lg:px-16">
        {/* Section Header */}
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#E8CDD1] bg-white/72 px-5 py-2.5 shadow-[0_12px_34px_rgba(101,75,107,0.12)] backdrop-blur">
            <Sparkles className="h-4 w-4 fill-[#E8CDD1] text-[#401F48]" />
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#401F48]">
              Signature Locations
            </span>
          </div>
          <h2 className="mb-4 text-4xl font-bold text-[#401F48] md:text-5xl">
            Available Properties by Location
          </h2>
          <p className="mx-auto max-w-3xl text-lg leading-8 text-[#401F48]/78 dark:text-[#654B6B]">
            Find a suitable property of your choice from these exclusive &
            prominent locations of Dhaka.
          </p>
        </div>

        {/* Locations Grid */}
        <div className="mb-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {locations.map(location => (
            <Link
              key={location.name}
              href={`/search?area=${location.name}`}
              data-testid={`link-city-${location.name.toLowerCase()}`}
              className="group block"
            >
              <div className="relative h-64 cursor-pointer overflow-hidden rounded-2xl border border-[#E8CDD1]/80 bg-white/70 p-2 shadow-[0_18px_48px_rgba(64,31,72,0.13)] backdrop-blur transition-all duration-500 group-hover:-translate-y-1 group-hover:border-[#401F48]/35 group-hover:shadow-[0_26px_64px_rgba(64,31,72,0.20)]">
                <div className="relative h-full overflow-hidden rounded-xl">
                  {/* Background Image */}
                  <img
                    src={location.image}
                    alt={location.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1f1523]/88 via-[#401F48]/28 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-[#E8CDD1]/18 opacity-90" />

                  {/* Location Name */}
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <div className="mb-3 h-px w-12 bg-[#F5F0EA]/70 transition-all duration-500 group-hover:w-20" />
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-[#F5F0EA]/72">
                          Dhaka
                        </p>
                        <h3 className="font-heading text-2xl font-bold text-[#F5F0EA] drop-shadow-lg md:text-3xl">
                          {location.name}
                        </h3>
                      </div>
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#F5F0EA]/35 bg-[#F5F0EA]/16 text-[#F5F0EA] backdrop-blur transition-all duration-500 group-hover:bg-[#F5F0EA] group-hover:text-[#401F48]">
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>

                  {/* Hover Effect - Border */}
                  <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/24 transition-all duration-500 group-hover:ring-[#F5F0EA]/65" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* More Location Button */}
        <div className="text-center">
          <Link href="/search">
            <Button className="h-12 rounded-full bg-[#401F48] px-7 text-sm font-bold uppercase tracking-wide text-white shadow-[0_14px_34px_rgba(101,75,107,0.24)] transition-all hover:-translate-y-0.5 hover:bg-[#2D1235] hover:shadow-[0_18px_44px_rgba(64,31,72,0.28)] dark:bg-[#401F48] dark:hover:bg-[#2D1235]">
              <MapPin className="mr-2 h-5 w-5" />
              More Location
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
