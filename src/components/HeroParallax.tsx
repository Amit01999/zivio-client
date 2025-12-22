import { useState } from 'react';
import { useLocation } from 'wouter';
import { Search, MapPin, Home } from 'lucide-react';
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
// import heroImage from '@assets/generated_images/dhaka_skyline_hero_image.png';
import heroImage from '../../assets/h2.jpg';

export default function HeroParallax() {
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
    <>
      <div className="fixed inset-0 w-full h-screen -z-10">
        <img
          src={heroImage}
          alt="Dhaka skyline"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
      </div>

      <section className="relative h-screen flex items-center justify-center z-10">
        <div className="container mx-auto px-4 relative z-20">
          {/* Hero Text */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
              Find Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-200 to-purple-100">
                Perfect Property
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-light">
              Discover thousands of premium apartments, houses, and commercial
              spaces across Dhaka
            </p>
          </div>
          {/* Search Box */}
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 p-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.25)] animate-fade-in-up animation-delay-200">
            {/* Tabs */}
            <Tabs
              value={priceType}
              onValueChange={v => setPriceType(v as ListingType)}
              className="mb-5"
            >
              <TabsList className="grid grid-cols-2 max-w-[230px] mx-auto p-1 bg-[#E7CDD2]/40 dark:bg-[#75577A]/40 backdrop-blur-md rounded-xl">
                <TabsTrigger
                  value="sale"
                  className="data-[state=active]:bg-[#6C5075] data-[state=active]:text-white dark:data-[state=active]:bg-[#8B6C90] rounded-lg transition"
                >
                  Buy
                </TabsTrigger>
                <TabsTrigger
                  value="rent"
                  className="data-[state=active]:bg-[#6C5075] data-[state=active]:text-white dark:data-[state=active]:bg-[#8B6C90] rounded-lg transition"
                >
                  Rent
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Input Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#6C5075]/60" />
                <Input
                  type="text"
                  placeholder="Search area or property..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="h-12 pl-12 text-base rounded-xl border-[#E7CDD2] focus:border-[#6C5075] focus:ring-2 focus:ring-[#6C5075]/40"
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                />
              </div>

              {/* Area */}
              <Select value={area} onValueChange={setArea}>
                <SelectTrigger className="h-12 rounded-xl border-[#E7CDD2] focus:ring-2 focus:ring-[#6C5075]/40">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-[#6C5075]/70" />
                    <SelectValue placeholder="Select Area in Dhaka" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {dhakaAreas.map(a => (
                    <SelectItem key={a} value={a}>
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Property Type */}
              <Select
                value={propertyType}
                onValueChange={v => setPropertyType(v as PropertyType)}
              >
                <SelectTrigger className="h-12 rounded-xl border-[#E7CDD2] focus:ring-2 focus:ring-[#6C5075]/40">
                  <div className="flex items-center">
                    <Home className="h-4 w-4 mr-2 text-[#6C5075]/70" />
                    <SelectValue placeholder="Property Type" />
                  </div>
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

            {/* Popular Areas */}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <span className="text-gray-800 dark:text-gray-200 font-medium">Popular:</span>
              {popularAreas.map(areaName => (
                <button
                  key={areaName}
                  onClick={() => {
                    setArea(areaName);
                    setSearchQuery(areaName);
                  }}
                  className="px-3 py-1 bg-[#E7CDD2]/50 dark:bg-[#75577A]/50 rounded-full text-[#6C5075] dark:text-[#E8CDD1] hover:bg-[#6C5075] dark:hover:bg-[#8B6C90] hover:text-white transition shadow-sm"
                >
                  {areaName}
                </button>
              ))}
            </div>

            {/* Search Button */}
            <Button
              onClick={handleSearch}
              size="lg"
              className="w-full mt-5 h-12 text-base font-semibold rounded-xl bg-[#6C5075] hover:bg-[#5A3F5E] text-white shadow-lg shadow-[#6C5075]/30"
            >
              Search Properties
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
