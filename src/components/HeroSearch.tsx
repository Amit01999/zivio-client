import { useState } from 'react';
import { useLocation } from 'wouter';
import { Search, MapPin, Home, DollarSign, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  dhakaAreas,
  propertyTypes,
  type ListingType,
  type PropertyType,
} from '@/types/schema';
import heroImage from '@assets/generated_images/dhaka_skyline_hero_image.png';

export function HeroSearch() {
  const [, setLocation] = useLocation();
  const [priceType, setPriceType] = useState<ListingType>('sale');
  const [area, setArea] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType | ''>('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (priceType) params.set('listingType', priceType);
    params.set('city', 'Dhaka'); // Always search in Dhaka
    if (area) params.set('area', area);
    if (propertyType) params.set('propertyType', propertyType);
    if (searchQuery) params.set('q', searchQuery);

    setLocation(`/search?${params.toString()}`);
  };

  const popularAreas = [
    'Gulshan',
    'Banani',
    'Dhanmondi',
    'Uttara',
    'Bashundhara',
    'Mirpur',
  ];

  return (
    <section
      className="relative min-h-[600px] overflow-hidden"
      data-testid="section-hero"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="hero-overlay absolute inset-0" />

      <div className="relative z-10 mx-auto flex min-h-[600px] max-w-7xl flex-col items-center justify-center px-4 py-16 text-center md:px-6">
        <h1 className="mb-4 font-heading text-4xl font-bold text-white md:text-5xl lg:text-6xl animate-fade-in">
          Find Your Perfect Property
        </h1>
        <p className="mb-8 max-w-2xl text-lg text-white/90 md:text-xl animate-slide-up">
          Discover thousands of apartments, houses, and commercial properties
          across Dhaka
        </p>

        <div className="w-full max-w-4xl animate-scale-in">
          <div className="rounded-2xl bg-white/95 p-4 shadow-2xl backdrop-blur-sm dark:bg-card/95 md:p-6">
            <Tabs
              value={priceType}
              onValueChange={v => setPriceType(v as ListingType)}
              className="mb-4"
            >
              <TabsList className="grid w-full max-w-xs mx-auto grid-cols-2">
                <TabsTrigger value="sale" data-testid="tab-buy">
                  Buy
                </TabsTrigger>
                <TabsTrigger value="rent" data-testid="tab-rent">
                  Rent
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by location, property name..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="h-12 pl-10 text-base"
                  data-testid="input-search-hero"
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                />
              </div>

              <Select value={area} onValueChange={setArea}>
                <SelectTrigger className="h-12" data-testid="select-area">
                  <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Area in Dhaka" />
                </SelectTrigger>
                <SelectContent>
                  {dhakaAreas.map(a => (
                    <SelectItem key={a} value={a}>
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={propertyType}
                onValueChange={v => setPropertyType(v as PropertyType)}
              >
                <SelectTrigger
                  className="h-12"
                  data-testid="select-property-type"
                >
                  <Home className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mt-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground">Popular:</span>
                {popularAreas.map(areaName => (
                  <Button
                    key={areaName}
                    variant="outline"
                    size="sm"
                    className="h-8"
                    onClick={() => {
                      setArea(areaName);
                      setSearchQuery(areaName);
                    }}
                    data-testid={`button-popular-${areaName.toLowerCase()}`}
                  >
                    {areaName}
                  </Button>
                ))}
              </div>

              <Button
                size="lg"
                className="h-12 gap-2 px-8"
                onClick={handleSearch}
                data-testid="button-search"
              >
                <Search className="h-5 w-5" />
                Search Properties
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-8 text-white md:grid-cols-4">
          {[
            { value: '10,000+', label: 'Properties' },
            { value: '5,000+', label: 'Happy Buyers' },
            { value: '500+', label: 'Verified Agents' },
            { value: 'Dhaka', label: 'Focus Area' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <p className="font-heading text-2xl font-bold md:text-3xl">
                {stat.value}
              </p>
              <p className="text-sm text-white/80">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
