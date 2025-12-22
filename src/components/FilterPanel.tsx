import { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  bangladeshCities,
  propertyTypes,
  amenitiesList,
  completionStatuses,
  furnishingStatuses,
  dhakaAreas,
  type SearchFilters,
  type PropertyType,
  type ListingType,
} from '@/types/schema';
// Category filter removed - use Property Type + Purpose instead
import { formatPrice } from '@/lib/format';

interface FilterPanelProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  totalResults?: number;
}

export function FilterPanel({
  filters,
  onFiltersChange,
  totalResults,
}: FilterPanelProps) {
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    filters.minPrice || 0,
    filters.maxPrice || 50000000,
  ]);

  useEffect(() => {
    setLocalFilters(filters);
    setPriceRange([filters.minPrice || 0, filters.maxPrice || 50000000]);
  }, [filters]);

  const updateLocalFilter = <K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K]
  ) => {
    console.log('[FilterPanel] updateLocalFilter:', { key, value, currentArea: localFilters.area });
    setLocalFilters({ ...localFilters, [key]: value });
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };

  const applyFilters = () => {
    const filtersToApply = {
      ...localFilters,
      minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
      maxPrice: priceRange[1] < 50000000 ? priceRange[1] : undefined,
      page: 1, // Reset to first page
    };
    console.log('[FilterPanel] Applying filters:', {
      localFiltersArea: localFilters.area,
      filtersToApplyArea: filtersToApply.area,
      allFilters: filtersToApply
    });
    onFiltersChange(filtersToApply);
  };

  const clearAllFilters = () => {
    const clearedFilters: SearchFilters = { page: 1, limit: 12 };
    setLocalFilters(clearedFilters);
    setPriceRange([0, 50000000]);
    onFiltersChange(clearedFilters);
  };

  const toggleAmenity = (amenity: string) => {
    const current = localFilters.amenities || [];
    const newAmenities = current.includes(amenity)
      ? current.filter(a => a !== amenity)
      : [...current, amenity];
    setLocalFilters({ ...localFilters, amenities: newAmenities });
  };

  const activeFilterCount = Object.entries(localFilters).filter(
    ([key, value]) =>
      value !== undefined &&
      value !== '' &&
      key !== 'page' &&
      key !== 'limit' &&
      key !== 'sortBy' &&
      !(Array.isArray(value) && value.length === 0)
  ).length;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Purpose Section - Always Visible */}
      <div className="pb-4 border-b">
        <h4 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wide">
          Purpose
        </h4>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={!localFilters.listingType ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateLocalFilter('listingType', undefined)}
            data-testid="filter-purpose-all"
            className="flex-1"
          >
            All
          </Button>
          <Button
            variant={localFilters.listingType === 'sale' ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateLocalFilter('listingType', 'sale')}
            data-testid="filter-buy"
            className="flex-1"
          >
            Buy
          </Button>
          <Button
            variant={localFilters.listingType === 'rent' ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateLocalFilter('listingType', 'rent')}
            data-testid="filter-rent"
            className="flex-1"
          >
            Rent
          </Button>
        </div>
      </div>

      <Accordion
        type="multiple"
        defaultValue={['property-type', 'price', 'bedrooms']}
        className="w-full"
      >
        <AccordionItem value="property-type">
          <AccordionTrigger className="text-sm font-medium py-2">
            Property Type
          </AccordionTrigger>
          <AccordionContent>
            <Select
              value={localFilters.propertyType || ''}
              onValueChange={v =>
                updateLocalFilter(
                  'propertyType',
                  v === '__all' ? undefined : (v as PropertyType)
                )
              }
            >
              <SelectTrigger data-testid="filter-property-type" className="h-9">
                <SelectValue placeholder="All Property Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all">All Types</SelectItem>
                {propertyTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="location">
          <AccordionTrigger className="text-sm font-medium py-2">
            Location
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                <span className="text-xs font-medium text-muted-foreground">City:</span>
                <span className="text-sm font-semibold">Dhaka</span>
              </div>
              <div>
                <Label className="text-xs mb-2 block font-medium">
                  Area in Dhaka
                </Label>
                <Select
                  value={localFilters.area || ''}
                  onValueChange={v => {
                    const newValue = v === '__all' ? undefined : v;
                    console.log('[FilterPanel] Area selected:', { v, newValue });
                    updateLocalFilter('area', newValue);
                  }}
                >
                  <SelectTrigger data-testid="filter-area" className="h-9">
                    <SelectValue placeholder="All Areas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all">All Areas</SelectItem>
                    {dhakaAreas.map(area => (
                      <SelectItem key={area} value={area}>
                        {area}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger className="text-sm font-medium py-2">
            Price Range (BDT)
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                <span>{formatPrice(priceRange[0], true)}</span>
                <span>{formatPrice(priceRange[1], true)}</span>
              </div>
              <Slider
                value={priceRange}
                min={0}
                max={50000000}
                step={100000}
                onValueChange={handlePriceChange}
                className="w-full"
                data-testid="filter-price-slider"
              />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs mb-1.5 block font-medium">
                    Min
                  </Label>
                  <Input
                    type="number"
                    value={priceRange[0]}
                    onChange={e => {
                      const val = parseInt(e.target.value) || 0;
                      setPriceRange([val, priceRange[1]]);
                    }}
                    data-testid="filter-min-price"
                    className="h-9 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs mb-1.5 block font-medium">
                    Max
                  </Label>
                  <Input
                    type="number"
                    value={priceRange[1]}
                    onChange={e => {
                      const val = parseInt(e.target.value) || 50000000;
                      setPriceRange([priceRange[0], val]);
                    }}
                    data-testid="filter-max-price"
                    className="h-9 text-sm"
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="bedrooms">
          <AccordionTrigger className="text-sm font-medium py-2">
            Bedrooms & Bathrooms
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <div>
                <Label className="text-xs mb-2.5 block font-medium">
                  Bedrooms
                </Label>
                <div className="flex flex-wrap gap-2">
                  {['Any', '1', '2', '3', '4', '5+'].map(num => (
                    <Button
                      key={num}
                      variant={
                        (num === 'Any' && !localFilters.bedrooms) ||
                        localFilters.bedrooms?.toString() ===
                          num.replace('+', '')
                          ? 'default'
                          : 'outline'
                      }
                      size="sm"
                      onClick={() =>
                        updateLocalFilter(
                          'bedrooms',
                          num === 'Any'
                            ? undefined
                            : parseInt(num.replace('+', ''))
                        )
                      }
                      data-testid={`filter-bed-${num
                        .toLowerCase()
                        .replace('+', 'plus')}`}
                      className="flex-1 min-w-fit text-xs h-8"
                    >
                      {num}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-xs mb-2.5 block font-medium">
                  Bathrooms
                </Label>
                <div className="flex flex-wrap gap-2">
                  {['Any', '1', '2', '3', '4+'].map(num => (
                    <Button
                      key={num}
                      variant={
                        (num === 'Any' && !localFilters.bathrooms) ||
                        localFilters.bathrooms?.toString() ===
                          num.replace('+', '')
                          ? 'default'
                          : 'outline'
                      }
                      size="sm"
                      onClick={() =>
                        updateLocalFilter(
                          'bathrooms',
                          num === 'Any'
                            ? undefined
                            : parseInt(num.replace('+', ''))
                        )
                      }
                      data-testid={`filter-bath-${num
                        .toLowerCase()
                        .replace('+', 'plus')}`}
                      className="flex-1 min-w-fit text-xs h-8"
                    >
                      {num}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="status">
          <AccordionTrigger className="text-sm font-medium py-2">
            Completion & Furnishing
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              <div>
                <Label className="text-xs mb-2 block font-medium">
                  Completion Status
                </Label>
                <Select
                  value={localFilters.completionStatus || ''}
                  onValueChange={v =>
                    updateLocalFilter('completionStatus', v === '__all' ? undefined : v as any)
                  }
                >
                  <SelectTrigger data-testid="filter-completion-status" className="h-9">
                    <SelectValue placeholder="Any Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all">Any Status</SelectItem>
                    <SelectItem value="ready">Ready to Move</SelectItem>
                    <SelectItem value="under_construction">Under Construction</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs mb-2 block font-medium">
                  Furnishing Status
                </Label>
                <Select
                  value={localFilters.furnishingStatus || ''}
                  onValueChange={v =>
                    updateLocalFilter('furnishingStatus', v === '__all' ? undefined : v as any)
                  }
                >
                  <SelectTrigger data-testid="filter-furnishing-status" className="h-9">
                    <SelectValue placeholder="Any Furnishing" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all">Any Furnishing</SelectItem>
                    <SelectItem value="furnished">Fully Furnished</SelectItem>
                    <SelectItem value="semi_furnished">Semi-Furnished</SelectItem>
                    <SelectItem value="unfurnished">Unfurnished</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="area">
          <AccordionTrigger className="text-sm font-medium py-2">
            Property Size
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <div>
                <Label className="text-xs mb-1.5 block font-medium">
                  Min (sq ft)
                </Label>
                <Input
                  type="number"
                  placeholder="Min"
                  value={localFilters.minArea || ''}
                  onChange={e =>
                    updateLocalFilter(
                      'minArea',
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                  data-testid="filter-min-area"
                  className="h-9 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs mb-1.5 block font-medium">
                  Max (sq ft)
                </Label>
                <Input
                  type="number"
                  placeholder="Max"
                  value={localFilters.maxArea || ''}
                  onChange={e =>
                    updateLocalFilter(
                      'maxArea',
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                  data-testid="filter-max-area"
                  className="h-9 text-sm"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="amenities">
          <AccordionTrigger className="text-sm font-medium py-2">
            Amenities
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              {amenitiesList.map(amenity => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    id={`amenity-${amenity}`}
                    checked={(localFilters.amenities || []).includes(amenity)}
                    onCheckedChange={() => toggleAmenity(amenity)}
                    data-testid={`filter-amenity-${amenity
                      .toLowerCase()
                      .replace(/\s+/g, '-')}`}
                    className="h-4 w-4"
                  />
                  <Label
                    htmlFor={`amenity-${amenity}`}
                    className="text-xs cursor-pointer font-normal"
                  >
                    {amenity}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="verified">
          <AccordionTrigger className="text-sm font-medium py-2">
            Listing Status
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="verified"
                  checked={localFilters.isVerified === true}
                  onCheckedChange={checked =>
                    updateLocalFilter('isVerified', checked ? true : undefined)
                  }
                  data-testid="filter-verified"
                  className="h-4 w-4"
                />
                <Label
                  htmlFor="verified"
                  className="text-xs cursor-pointer font-normal"
                >
                  Verified Only
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={localFilters.isFeatured === true}
                  onCheckedChange={checked =>
                    updateLocalFilter('isFeatured', checked ? true : undefined)
                  }
                  data-testid="filter-featured"
                  className="h-4 w-4"
                />
                <Label
                  htmlFor="featured"
                  className="text-xs cursor-pointer font-normal"
                >
                  Featured Only
                </Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Apply Filters Button */}
      <div className="mt-6 space-y-3">
        <Button
          onClick={applyFilters}
          className="w-full"
          size="lg"
          data-testid="apply-filters-button"
        >
          Apply Filters
        </Button>
        <Button
          onClick={clearAllFilters}
          variant="outline"
          className="w-full"
          size="sm"
        >
          Clear All
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden lg:block">
        <div className="sticky top-24 z-20">
          <div className="bg-background rounded-lg border shadow-sm p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-heading font-semibold text-base">Filters</h3>
              {activeFilterCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  data-testid="button-clear-filters"
                  className="h-8 text-xs"
                >
                  Clear All
                </Button>
              )}
            </div>
            <div className="h-[calc(100vh-250px)] overflow-y-auto pr-3">
              <style>{`
                .overflow-y-auto::-webkit-scrollbar {
                  width: 6px;
                }
                .overflow-y-auto::-webkit-scrollbar-track {
                  background: transparent;
                }
                .overflow-y-auto::-webkit-scrollbar-thumb {
                  background: hsl(var(--muted-foreground) / 0.3);
                  border-radius: 3px;
                }
                .overflow-y-auto::-webkit-scrollbar-thumb:hover {
                  background: hsl(var(--muted-foreground) / 0.5);
                }
              `}</style>
              <FilterContent />
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="gap-2"
              data-testid="button-open-filters"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full sm:max-w-md">
            <SheetHeader>
              <SheetTitle className="flex items-center justify-between">
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                    Clear All
                  </Button>
                )}
              </SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-180px)] pr-4">
              <FilterContent />
            </ScrollArea>
            <SheetFooter className="mt-4 flex-col space-y-2">
              <Button
                className="w-full"
                onClick={applyFilters}
                data-testid="button-apply-filters"
              >
                Apply Filters
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={clearAllFilters}
                size="sm"
              >
                Clear All
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
