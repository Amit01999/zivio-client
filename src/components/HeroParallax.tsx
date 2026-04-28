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
import heroImage from '../../assets/h101.jpg';

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
      <div className="fixed inset-0 -z-10 h-[90vh] w-full">
        <img
          src={heroImage}
          alt="Dhaka skyline"
          className="h-full w-full object-cover mt-16"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/28 to-black/52" />
      </div>

      <section className="relative z-10 flex h-[80vh] min-h-[560px] items-center justify-center">
        <div className="container relative z-20 mx-auto px-4 pt-4">
          <div className="mb-6 text-center">
            <h1 className="mx-auto mb-4 max-w-5xl font-heading text-4xl font-bold leading-[1.04] tracking-normal text-white md:text-6xl lg:text-[68px]">
              Find Your <span className="text-[#d9c8df]">Perfect Property</span>
            </h1>
            <p className="mx-auto max-w-2xl text-base font-medium leading-7 text-gray-200 md:text-xl">
              Discover thousands of premium apartments, houses, and commercial
              spaces across Dhaka
            </p>
          </div>

          <div className="mx-auto max-w-5xl animate-fade-in-up rounded-[28px] border border-[#401F48]/45 bg-[#EBE6E0]/50 p-3 shadow-[0_24px_64px_rgba(18,12,22,0.38)] backdrop-blur-sm animation-delay-200 dark:border-[#401F48]/35 dark:bg-[#2A2030]/55 dark:shadow-[0_20px_56px_rgba(0,0,0,0.48)]">
            <Tabs
              value={priceType}
              onValueChange={v => setPriceType(v as ListingType)}
              className="mb-3"
            >
              <TabsList className="mx-auto grid h-[34px] max-w-[168px] grid-cols-2 rounded-full bg-white/20 p-[3px] ring-2 ring-white/40 shadow-[0_2px_14px_rgba(235,230,224,0.20)] dark:bg-white/8 dark:ring-white/20">
                <TabsTrigger
                  value="sale"
                  className="rounded-full text-[12px] font-semibold tracking-wide text-[#401F48] transition-all data-[state=active]:bg-[#401F48] data-[state=active]:text-[#EBE6E0] data-[state=active]:shadow-md dark:text-white/50 dark:data-[state=active]:bg-[#C9C6C1] dark:data-[state=active]:text-[#111827]"
                >
                  Buy
                </TabsTrigger>
                <TabsTrigger
                  value="rent"
                  className="rounded-full text-[12px] font-semibold tracking-wide text-[#401F48] transition-all data-[state=active]:bg-[#401F48] data-[state=active]:text-[#EBE6E0] data-[state=active]:shadow-md dark:text-white/50 dark:data-[state=active]:bg-[#C9C6C1] dark:data-[state=active]:text-[#111827]"
                >
                  Rent
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="grid grid-cols-1 overflow-hidden rounded-[20px] border border-[#401F48]/60 bg-transparent md:grid-cols-[1.35fr_1fr_1fr_auto] dark:border-[#401F48]/40 dark:bg-[#1E1A24]/85">
              <div className="relative px-5 py-4 md:border-r md:border-[#401F48]/45 dark:md:border-[#401F48]/30">
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.15em] text-[#2C1F35] dark:text-[#C9C6C1]/60">
                  Location
                </label>
                <Search className="absolute left-5 top-[50px] h-[14px] w-[14px] -translate-y-1/2 text-white/55 dark:text-[#C9C6C1]/50" />
                <Input
                  type="text"
                  placeholder="City, neighbourhood, address…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="h-7 rounded-none border-0 bg-transparent pl-6 text-[13px] font-semibold text-white shadow-none placeholder:font-normal placeholder:text-[#3d1b45] focus-visible:ring-0 focus-visible:ring-offset-0 dark:text-white dark:placeholder:text-white/35"
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                />
              </div>

              <Select value={area} onValueChange={setArea}>
                <SelectTrigger className="h-full min-h-[68px] rounded-none border-0 border-t border-[#401F48]/45 bg-transparent px-5 text-[13px] font-semibold text-white shadow-none focus:ring-0 focus:ring-offset-0 md:border-l-0 md:border-t-0 md:border-r dark:border-[#401F48]/30 dark:text-white [&>svg]:text-[#17091C] [&_[data-placeholder]]:text-[#401F48] dark:[&>svg]:text-[#401F48] dark:[&_[data-placeholder]]:text-white/60">
                  <div className="flex flex-col items-start gap-0">
                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#2C1F35] dark:text-[#C9C6C1]/60">
                      Area
                    </span>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-[13px] w-[13px] shrink-0 text-white/95 dark:text-[#C9C6C1]/50" />
                      <SelectValue
                        placeholder="Select area in Dhaka"
                        className="text-[#401F48]"
                      />
                    </div>
                  </div>
                </SelectTrigger>
                <SelectContent className="border-[#401F48]/40 bg-[#EBE6E0] text-[#2C1F35] shadow-[0_12px_36px_rgba(101,75,107,0.22)] dark:border-white/8 dark:bg-[#1E1A24] dark:text-white">
                  {dhakaAreas.map(a => (
                    <SelectItem
                      key={a}
                      value={a}
                      className="text-[#2C1F35]/85 focus:bg-[#401F48]/15 focus:text-[#2C1F35] dark:text-white/78 dark:focus:bg-white/8 dark:focus:text-white"
                    >
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={propertyType}
                onValueChange={v => setPropertyType(v as PropertyType)}
              >
                <SelectTrigger className="h-full min-h-[68px] rounded-none border-0 border-t border-[#401F48]/45 bg-transparent px-5 text-[13px] font-semibold text-white shadow-none focus:ring-0 focus:ring-offset-0 md:border-t-0 md:border-r dark:border-[#401F48]/30 dark:text-white [&>svg]:text-[#17091C] [&_[data-placeholder]]:text-[#401F48] dark:[&>svg]:text-[#401F48] dark:[&_[data-placeholder]]:text-white/60">
                  <div className="flex flex-col items-start gap-0">
                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#2C1F35] dark:text-[#C9C6C1]/60">
                      Type
                    </span>
                    <div className="flex items-center gap-1.5">
                      <Home className="h-[13px] w-[13px] shrink-0 text-white/55 dark:text-[#C9C6C1]/50" />
                      <SelectValue
                        placeholder="Property type"
                        className="text-[#401F48]"
                      />
                    </div>
                  </div>
                </SelectTrigger>
                <SelectContent className="border-[#401F48]/40 bg-[#EBE6E0] text-[#2C1F35] shadow-[0_12px_36px_rgba(101,75,107,0.22)] dark:border-white/8 dark:bg-[#1E1A24] dark:text-white">
                  {propertyTypes.map(type => (
                    <SelectItem
                      key={type}
                      value={type}
                      className="text-[#2C1F35]/85 focus:bg-[#401F48]/15 focus:text-[#2C1F35] dark:text-white/78 dark:focus:bg-white/8 dark:focus:text-white"
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                onClick={handleSearch}
                size="lg"
                className="m-2.5 min-h-[52px] rounded-[14px] bg-[#401F48] px-6 text-[11px] font-bold uppercase tracking-[0.1em] text-white shadow-[0_6px_22px_rgba(101,75,107,0.38)] transition-all hover:bg-[#2D1235] hover:shadow-[0_8px_28px_rgba(101,75,107,0.48)] dark:bg-[#401F48] dark:text-white dark:hover:bg-[#2D1235] md:min-w-[140px]"
              >
                Search
              </Button>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 pb-0.5">
              <span className="mr-0.5 text-[12px] font-bold uppercase tracking-[0.15em] text-[#401F48] dark:text-[#C9C6C1]/45">
                Popular
              </span>
              {popularAreas.map(areaName => (
                <button
                  key={areaName}
                  onClick={() => {
                    setArea(areaName);
                    setSearchQuery(areaName);
                  }}
                  className="rounded-full border border-[#EBE6E0]/28 bg-[#EBE6E0]/12 px-3.5 py-1 text-[11px] font-medium text-[#EBE6E0]/72 backdrop-blur-sm transition-all hover:border-[#EBE6E0]/50 hover:bg-[#EBE6E0]/22 hover:text-white dark:border-white/10 dark:bg-white/5 dark:text-white/58 dark:hover:bg-white/10 dark:hover:text-white"
                >
                  {areaName}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
