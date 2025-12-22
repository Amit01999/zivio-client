import { Link } from 'wouter';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const locations = [
  {
    name: 'Dhanmondi',
    image:
      'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600&auto=format&fit=crop&q=60',
  },
  {
    name: 'Gulshan',
    image:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=60',
  },
  {
    name: 'Banani',
    image:
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&auto=format&fit=crop&q=60',
  },
  {
    name: 'Uttara',
    image:
      'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&auto=format&fit=crop&q=60',
  },
  {
    name: 'Bashundhara',
    image:
      'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600&auto=format&fit=crop&q=60',
  },
  {
    name: 'Mohammadpur',
    image:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=60',
  },
  {
    name: 'Savar',
    image:
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&auto=format&fit=crop&q=60',
  },
  {
    name: 'Mirpur',
    image:
      'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&auto=format&fit=crop&q=60',
  },
];

export function PopularCities() {
  return (
    <section
      className="py-20 bg-white dark:bg-gray-900"
      data-testid="section-cities"
    >
      <div className="container mx-auto px-8 md:px-12 lg:px-16">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Available Properties by Location
          </h2>
          <p className="text-lg text-[#75577A] dark:text-[#A88AAD] max-w-3xl mx-auto">
            Find a suitable property of your choice from these exclusive & prominent locations of Dhaka.
          </p>
        </div>

        {/* Locations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {locations.map(location => (
            <Link
              key={location.name}
              href={`/search?area=${location.name}`}
              data-testid={`link-city-${location.name.toLowerCase()}`}
            >
              <div className="group relative h-64 overflow-hidden rounded-2xl cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300">
                {/* Background Image */}
                <img
                  src={location.image}
                  alt={location.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* Location Name */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-3xl font-bold text-white drop-shadow-lg">
                    {location.name}
                  </h3>
                </div>

                {/* Hover Effect - Border */}
                <div className="absolute inset-0 border-4 border-transparent group-hover:border-[#75577A] dark:group-hover:border-[#A88AAD] rounded-2xl transition-all duration-300" />
              </div>
            </Link>
          ))}
        </div>

        {/* More Location Button */}
        <div className="text-center">
          <Link href="/search">
            <Button
              className="bg-[#75577A] dark:bg-[#8B6C90] hover:bg-[#5A4260] dark:hover:bg-[#A88AAD] text-white px-8 py-6 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              <MapPin className="mr-2 h-5 w-5" />
              More Location
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
