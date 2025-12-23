import { useState, useEffect } from 'react';
import { useLocation, useSearch } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Grid, List, Map, SlidersHorizontal, ChevronDown, AlertCircle } from 'lucide-react';
import { FilterPanel } from '@/components/FilterPanel';
import { ListingCard, ListingCardSkeleton } from '@/components/ListingCard';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { API_URL } from '@/lib/api';
import type { SearchFilters, Listing, PaginatedResponse } from '@/types/schema';

type ViewMode = 'grid' | 'list' | 'map';

export default function Search() {
  const [searchString] = useSearch();
  const [, setLocation] = useLocation();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const getInitialFilters = (): SearchFilters => {
    const params = new URLSearchParams(searchString);
    return {
      q: params.get('q') || undefined,
      city: params.get('city') || undefined,
      area: params.get('area') || undefined,
      listingType:
        (params.get('listingType') as SearchFilters['listingType']) || undefined,
      propertyType:
        (params.get('propertyType') as SearchFilters['propertyType']) ||
        undefined,
      // Category removed - use propertyType + listingType instead
      completionStatus:
        (params.get('completionStatus') as SearchFilters['completionStatus']) ||
        undefined,
      furnishingStatus:
        (params.get('furnishingStatus') as SearchFilters['furnishingStatus']) ||
        undefined,
      minPrice: params.get('minPrice')
        ? parseInt(params.get('minPrice')!)
        : undefined,
      maxPrice: params.get('maxPrice')
        ? parseInt(params.get('maxPrice')!)
        : undefined,
      bedrooms: params.get('bedrooms')
        ? parseInt(params.get('bedrooms')!)
        : undefined,
      bathrooms: params.get('bathrooms')
        ? parseInt(params.get('bathrooms')!)
        : undefined,
      minArea: params.get('minArea')
        ? parseInt(params.get('minArea')!)
        : undefined,
      maxArea: params.get('maxArea')
        ? parseInt(params.get('maxArea')!)
        : undefined,
      isFeatured: params.get('isFeatured') === 'true' ? true : undefined,
      isVerified: params.get('isVerified') === 'true' ? true : undefined,
      sortBy: (params.get('sortBy') as SearchFilters['sortBy']) || 'newest',
      page: params.get('page') ? parseInt(params.get('page')!) : 1,
      limit: 12,
    };
  };

  const [filters, setFilters] = useState<SearchFilters>(() => getInitialFilters());

  useEffect(() => {
    const newFilters = getInitialFilters();
    setFilters(newFilters);
  }, [searchString]);

  const updateURL = (newFilters: SearchFilters) => {
    const params = new URLSearchParams();
    console.log('[Search] updateURL - area in newFilters:', newFilters.area);
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== null) {
        if (Array.isArray(value) && value.length > 0) {
          params.set(key, value.join(','));
        } else if (!Array.isArray(value)) {
          params.set(key, String(value));
        }
      }
    });
    const urlString = `/search?${params.toString()}`;
    console.log('[Search] updateURL - final URL:', urlString);
    setLocation(urlString);
  };

  const handleFiltersChange = (newFilters: SearchFilters) => {
    console.log('[Search] Filters changed:', newFilters);
    const updated = { ...newFilters, page: 1 };
    setFilters(updated);
    updateURL(updated);
  };

  const handleSortChange = (sortBy: string) => {
    const updated = { ...filters, sortBy: sortBy as SearchFilters['sortBy'] };
    setFilters(updated);
    updateURL(updated);
  };

  const handlePageChange = (page: number) => {
    const updated = { ...filters, page };
    setFilters(updated);
    updateURL(updated);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const buildQueryString = () => {
    const params = new URLSearchParams();
    params.set('status', 'published');
    params.set('city', 'Dhaka'); // Always filter for Dhaka

    console.log('[Search] buildQueryString - filters.area:', filters.area);
    if (filters.q) params.set('q', filters.q);
    if (filters.area) params.set('area', filters.area);
    if (filters.listingType) params.set('listingType', filters.listingType);
    if (filters.propertyType) params.set('propertyType', filters.propertyType);
    if (filters.category) params.set('category', filters.category);
    if (filters.completionStatus) params.set('completionStatus', filters.completionStatus);
    if (filters.furnishingStatus) params.set('furnishingStatus', filters.furnishingStatus);
    if (filters.minPrice) params.set('minPrice', String(filters.minPrice));
    if (filters.maxPrice) params.set('maxPrice', String(filters.maxPrice));
    if (filters.bedrooms) params.set('bedrooms', String(filters.bedrooms));
    if (filters.bathrooms) params.set('bathrooms', String(filters.bathrooms));
    if (filters.minArea) params.set('minArea', String(filters.minArea));
    if (filters.maxArea) params.set('maxArea', String(filters.maxArea));
    if (filters.isFeatured) params.set('isFeatured', 'true');
    if (filters.isVerified) params.set('isVerified', 'true');
    if (filters.sortBy) params.set('sortBy', filters.sortBy);
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));

    return params.toString();
  };

  const { data, isLoading, error, refetch } = useQuery<PaginatedResponse<Listing>>({
    queryKey: ['/api/listings', filters],
    queryFn: async () => {
      try {
        const queryString = buildQueryString();
        console.log('[Search] Fetching with query:', queryString);
        console.log('[Search] Current filters:', filters);

        const response = await fetch(`${API_URL}/listings?${queryString}`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to fetch listings');
        }
        const result = await response.json();

        // Validate response structure
        if (!result || typeof result.total === 'undefined') {
          throw new Error('Invalid response format');
        }

        console.log('[Search] Received results:', {
          total: result.total,
          count: result.data?.length || 0,
          page: result.page
        });

        return result;
      } catch (error) {
        console.error('[Search] Error fetching listings:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const getActiveFilterLabels = () => {
    const labels: string[] = [];
    if (filters.listingType)
      labels.push(filters.listingType === 'rent' ? 'For Rent' : 'For Sale');
    if (filters.area) labels.push(filters.area);
    // Category removed
    if (filters.propertyType)
      labels.push(
        filters.propertyType.charAt(0).toUpperCase() +
          filters.propertyType.slice(1)
      );
    if (filters.completionStatus) {
      labels.push(
        filters.completionStatus === 'ready'
          ? 'Ready to Move'
          : 'Under Construction'
      );
    }
    if (filters.furnishingStatus) {
      const furnishingLabels: Record<string, string> = {
        furnished: 'Fully Furnished',
        semi_furnished: 'Semi-Furnished',
        unfurnished: 'Unfurnished',
      };
      labels.push(furnishingLabels[filters.furnishingStatus] || filters.furnishingStatus);
    }
    if (filters.bedrooms) labels.push(`${filters.bedrooms}+ Beds`);
    if (filters.bathrooms) labels.push(`${filters.bathrooms}+ Baths`);
    if (filters.isVerified) labels.push('Verified');
    if (filters.isFeatured) labels.push('Featured');
    return labels;
  };

  const activeLabels = getActiveFilterLabels();

  return (
    <>
      <div className="bg-background min-h-screen">
        <div className="container mx-auto px-8 md:px-12 lg:px-16 py-8">
          <div className="mb-8">
            <h1
              className="font-heading text-3xl font-bold md:text-4xl mb-3"
              data-testid="text-search-title"
            >
              {filters.q ? `Results for "${filters.q}"` : filters.area ? `Properties in ${filters.area}, Dhaka` : 'Properties in Dhaka'}
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              {isLoading ? (
                <Skeleton className="h-5 w-32" />
              ) : (
                <span
                  className="text-muted-foreground text-sm"
                  data-testid="text-result-count"
                >
                  {data?.total || 0}{' '}
                  {data?.total === 1 ? 'property' : 'properties'} found
                </span>
              )}
              {activeLabels.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {activeLabels.map(label => (
                    <Badge
                      key={label}
                      variant="secondary"
                      className="text-xs py-1"
                    >
                      {label}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="lg:hidden">
                <FilterPanel
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  totalResults={data?.total}
                />
              </div>

              <div className="hidden sm:flex items-center border rounded-lg p-1 bg-muted/30">
                <Button
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  data-testid="button-view-grid"
                  className="h-8"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  data-testid="button-view-list"
                  className="h-8"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'map' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('map')}
                  data-testid="button-view-map"
                  className="h-8"
                >
                  <Map className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Select
              value={filters.sortBy || 'newest'}
              onValueChange={handleSortChange}
            >
              <SelectTrigger
                className="w-[200px] h-10"
                data-testid="select-sort"
              >
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-6">
            <aside className="hidden lg:block w-72 shrink-0">
              <FilterPanel
                filters={filters}
                onFiltersChange={handleFiltersChange}
                totalResults={data?.total}
              />
            </aside>

            <div className="flex-1">
              {error ? (
                <div className="text-center py-12" data-testid="search-error">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                    <AlertCircle className="h-8 w-8 text-destructive" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-2">
                    Failed to load properties
                  </h3>
                  <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                    {error instanceof Error ? error.message : 'An unexpected error occurred'}
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button onClick={() => refetch()} variant="default">
                      Try Again
                    </Button>
                    <Button
                      onClick={() => handleFiltersChange({ page: 1, limit: 12 })}
                      variant="outline"
                    >
                      Clear Filters
                    </Button>
                  </div>
                </div>
              ) : viewMode === 'map' ? (
                <div
                  className="rounded-xl border bg-muted h-[600px] flex items-center justify-center"
                  data-testid="map-view"
                >
                  <div className="text-center">
                    <Map className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Map view coming soon!
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Google Maps integration will be added in the next phase.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div
                    className={
                      viewMode === 'list'
                        ? 'space-y-4'
                        : 'grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3'
                    }
                    data-testid="listings-grid"
                  >
                    {isLoading
                      ? Array.from({ length: 9 }).map((_, i) => (
                          <ListingCardSkeleton key={i} />
                        ))
                      : data?.data.map(listing => (
                          <ListingCard key={listing.id} listing={listing} />
                        ))}
                  </div>

                  {!isLoading && data?.data.length === 0 && (
                    <div className="text-center py-16" data-testid="no-results">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                        <SlidersHorizontal className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="font-heading font-semibold text-lg mb-2">
                        No properties found
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Try adjusting your filters or search criteria
                      </p>
                      <Button
                        variant="outline"
                        onClick={() =>
                          handleFiltersChange({ page: 1, limit: 12 })
                        }
                        data-testid="button-clear-search"
                      >
                        Clear All Filters
                      </Button>
                    </div>
                  )}

                  {data && data.totalPages > 1 && (
                    <div
                      className="mt-8 flex items-center justify-center gap-2"
                      data-testid="pagination"
                    >
                      <Button
                        variant="outline"
                        disabled={data.page <= 1}
                        onClick={() => handlePageChange(data.page - 1)}
                        data-testid="button-prev-page"
                      >
                        Previous
                      </Button>
                      <div className="flex items-center gap-1">
                        {Array.from(
                          { length: Math.min(5, data.totalPages) },
                          (_, i) => {
                            let page: number;
                            if (data.totalPages <= 5) {
                              page = i + 1;
                            } else if (data.page <= 3) {
                              page = i + 1;
                            } else if (data.page >= data.totalPages - 2) {
                              page = data.totalPages - 4 + i;
                            } else {
                              page = data.page - 2 + i;
                            }
                            return (
                              <Button
                                key={page}
                                variant={
                                  page === data.page ? 'default' : 'outline'
                                }
                                size="sm"
                                onClick={() => handlePageChange(page)}
                                data-testid={`button-page-${page}`}
                              >
                                {page}
                              </Button>
                            );
                          }
                        )}
                      </div>
                      <Button
                        variant="outline"
                        disabled={data.page >= data.totalPages}
                        onClick={() => handlePageChange(data.page + 1)}
                        data-testid="button-next-page"
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
