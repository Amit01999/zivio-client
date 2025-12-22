import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import {
  Bed,
  Bath,
  Maximize2,
  MapPin,
  Calendar,
  Eye,
  Heart,
  Share2,
  CheckCircle,
  Sparkles,
  ChevronRight,
  Building2,
  Car,
  Wifi,
  Zap,
  Droplets,
  Shield,
  Dumbbell,
} from 'lucide-react';
import { PropertyGalleryPro } from '@/components/PropertyGalleryPro';
import { AgentContactCard } from '@/components/AgentContactCard';
import { ListingCard } from '@/components/ListingCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import type {
  ListingWithBroker,
  Listing,
  PaginatedResponse,
} from '@/types/schema';
import {
  formatPrice,
  formatArea,
  formatDate,
  getPropertyTypeLabel,
} from '@/lib/format';
import { useAuth } from '@/lib/auth';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Link } from 'wouter';

const amenityIcons: Record<string, typeof Bed> = {
  Parking: Car,
  Elevator: Building2,
  Generator: Zap,
  Security: Shield,
  Gym: Dumbbell,
  'Water Supply': Droplets,
  Internet: Wifi,
};

export default function PropertyDetail() {
  const params = useParams<{ slug: string }>();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isFavorited, setIsFavorited] = useState(false);

  const {
    data: listing,
    isLoading,
    error,
  } = useQuery<ListingWithBroker>({
    queryKey: ['/api/listings', params.slug],
    queryFn: async () => {
      const response = await fetch(`/api/listings/${params.slug}`);
      if (!response.ok) throw new Error('Failed to fetch listing');
      return response.json();
    },
    enabled: !!params.slug,
  });

  const { data: similarListings } = useQuery<PaginatedResponse<Listing>>({
    queryKey: ['/api/listings', { similar: listing?.id }],
    queryFn: async () => {
      const response = await fetch(
        `/api/listings?city=${listing?.city}&propertyType=${listing?.propertyType}&limit=4&status=published`
      );
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    },
    enabled: !!listing,
  });

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      toast({
        title: 'Login Required',
        description: 'Please login to save properties.',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (isFavorited) {
        await apiRequest('DELETE', `/api/favorites/${listing?.id}`);
        setIsFavorited(false);
        toast({ title: 'Removed from favorites' });
      } else {
        await apiRequest('POST', '/api/favorites', { listingId: listing?.id });
        setIsFavorited(true);
        toast({ title: 'Added to favorites' });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update favorites.',
        variant: 'destructive',
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: listing?.title,
          text: `Check out this property: ${listing?.title}`,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled or share failed
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast({ title: 'Link copied to clipboard!' });
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-2xl font-bold mb-2">
            Property Not Found
          </h1>
          <p className="text-muted-foreground mb-4">
            The property you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/search">
            <Button>Browse Properties</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
          {isLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-6 w-64" />
              <Skeleton className="h-[400px] w-full rounded-xl" />
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-32 w-full" />
                </div>
                <Skeleton className="h-[400px] w-full" />
              </div>
            </div>
          ) : listing ? (
            <>
              <Breadcrumb className="mb-4">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/search">Properties</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href={`/search?city=${listing.city}`}>
                      {listing.city}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <span className="text-muted-foreground truncate max-w-[200px]">
                      {listing.title}
                    </span>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              <PropertyGalleryPro
                images={listing.images || []}
                title={listing.title}
              />

              <div className="mt-6 grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                  {/* Header Section with Badges and Title */}
                  <div className="space-y-4">
                    {/* Badges Row */}
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        className={
                          listing.listingType === 'rent'
                            ? 'bg-accent text-accent-foreground uppercase text-xs px-3 py-1 font-semibold'
                            : 'bg-primary text-primary-foreground uppercase text-xs px-3 py-1 font-semibold'
                        }
                      >
                        {listing.listingType === 'rent' ? 'For Rent' : 'For Sale'}
                      </Badge>
                      {listing.category && (
                        <Badge variant="outline" className="px-3 py-1 text-xs font-semibold">
                          {listing.category}
                        </Badge>
                      )}
                      {listing.isVerified && (
                        <Badge variant="secondary" className="gap-1 px-3 py-1">
                          <CheckCircle className="h-3.5 w-3.5 text-primary" />
                          <span className="text-xs font-semibold">
                            Verified
                          </span>
                        </Badge>
                      )}
                      {listing.isFeatured && (
                        <Badge className="bg-accent text-accent-foreground gap-1 px-3 py-1">
                          <Sparkles className="h-3.5 w-3.5" />
                          <span className="text-xs font-semibold">
                            Featured
                          </span>
                        </Badge>
                      )}
                      {listing.completionStatus === 'under_construction' && (
                        <Badge className="bg-orange-500 text-white px-3 py-1 text-xs font-semibold">
                          Under Construction
                        </Badge>
                      )}
                      {listing.furnishingStatus && (
                        <Badge variant="secondary" className="px-3 py-1 text-xs font-semibold">
                          {listing.furnishingStatus === 'furnished' && 'Fully Furnished'}
                          {listing.furnishingStatus === 'semi_furnished' && 'Semi-Furnished'}
                          {listing.furnishingStatus === 'unfurnished' && 'Unfurnished'}
                        </Badge>
                      )}
                      {listing.negotiable && (
                        <Badge className="bg-blue-500 text-white px-3 py-1 text-xs font-semibold">
                          Negotiable
                        </Badge>
                      )}
                    </div>

                    {/* Title and Location */}
                    <div>
                      <h1
                        className="font-heading text-3xl font-bold md:text-4xl mb-3"
                        data-testid="text-listing-title"
                      >
                        {listing.title}
                      </h1>
                      <div className="flex items-start gap-2 text-muted-foreground">
                        <MapPin className="h-5 w-5 shrink-0 mt-0.5" />
                        <span
                          className="text-base"
                          data-testid="text-listing-location"
                        >
                          {listing.address},{' '}
                          {listing.area && `${listing.area}, `}
                          {listing.city}
                        </span>
                      </div>
                    </div>

                    {/* Price and Actions Row */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Price
                        </p>
                        <p
                          className="font-heading text-4xl font-bold text-primary"
                          data-testid="text-listing-price"
                        >
                          {formatPrice(listing.price)}
                          {listing.listingType === 'rent' && (
                            <span className="text-xl font-normal text-muted-foreground">
                              /month
                            </span>
                          )}
                        </p>
                        {listing.pricePerSqft && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {formatPrice(listing.pricePerSqft)}/sqft
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={handleFavorite}
                          className={`gap-2 ${
                            isFavorited ? 'text-red-500 border-red-500' : ''
                          }`}
                          data-testid="button-favorite-detail"
                        >
                          <Heart
                            className={`h-5 w-5 ${
                              isFavorited ? 'fill-current' : ''
                            }`}
                          />
                          <span className="hidden sm:inline">Save</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={handleShare}
                          className="gap-2"
                          data-testid="button-share"
                        >
                          <Share2 className="h-5 w-5" />
                          <span className="hidden sm:inline">Share</span>
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Property Stats Card */}
                  <Card className="border-2">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                        {listing.bedrooms !== null &&
                          listing.bedrooms !== undefined && (
                            <div className="flex items-center gap-3">
                              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                                <Bed className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                <p className="text-2xl font-bold">
                                  {listing.bedrooms}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Bedrooms
                                </p>
                              </div>
                            </div>
                          )}
                        {listing.bathrooms !== null &&
                          listing.bathrooms !== undefined && (
                            <div className="flex items-center gap-3">
                              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                                <Bath className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                <p className="text-2xl font-bold">
                                  {listing.bathrooms}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Bathrooms
                                </p>
                              </div>
                            </div>
                          )}
                        {listing.areaSqFt && (
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                              <Maximize2 className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <p className="text-2xl font-bold">
                                {formatArea(listing.areaSqFt)}
                              </p>
                              <p className="text-sm text-muted-foreground whitespace-nowrap">
                                Sq Ft
                              </p>
                            </div>
                          </div>
                        )}
                        {listing.propertyType && (
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                              <Building2 className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <p className="text-base font-semibold">
                                {getPropertyTypeLabel(listing.propertyType)}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Type
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="w-full justify-start overflow-x-auto">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="amenities">Amenities</TabsTrigger>
                      <TabsTrigger value="location">Location</TabsTrigger>
                      {listing.floorPlanUrl && (
                        <TabsTrigger value="floorplan">Floor Plan</TabsTrigger>
                      )}
                    </TabsList>

                    <TabsContent value="overview" className="mt-4 space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p
                            className="text-muted-foreground whitespace-pre-wrap"
                            data-testid="text-listing-description"
                          >
                            {listing.description || 'No description provided.'}
                          </p>
                        </CardContent>
                      </Card>

                      {/* Property Details */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Property Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                            {listing.propertySubType && (
                              <div>
                                <p className="text-sm text-muted-foreground">Sub-Type</p>
                                <p className="font-medium">{listing.propertySubType}</p>
                              </div>
                            )}
                            {listing.unitType && (
                              <div>
                                <p className="text-sm text-muted-foreground">Unit Type</p>
                                <p className="font-medium">{listing.unitType}</p>
                              </div>
                            )}
                            {listing.floor !== null && listing.floor !== undefined && (
                              <div>
                                <p className="text-sm text-muted-foreground">Floor</p>
                                <p className="font-medium">{listing.floor}</p>
                              </div>
                            )}
                            {listing.totalFloors && (
                              <div>
                                <p className="text-sm text-muted-foreground">Total Floors</p>
                                <p className="font-medium">{listing.totalFloors}</p>
                              </div>
                            )}
                            {listing.parkingCount !== null && listing.parkingCount !== undefined && (
                              <div>
                                <p className="text-sm text-muted-foreground">Parking Spaces</p>
                                <p className="font-medium">{listing.parkingCount}</p>
                              </div>
                            )}
                            {listing.facing && (
                              <div>
                                <p className="text-sm text-muted-foreground">Facing</p>
                                <p className="font-medium">{listing.facing}</p>
                              </div>
                            )}
                            {listing.balconies !== null && listing.balconies !== undefined && (
                              <div>
                                <p className="text-sm text-muted-foreground">Balconies</p>
                                <p className="font-medium">{listing.balconies}</p>
                              </div>
                            )}
                            {listing.servantRoom && (
                              <div>
                                <p className="text-sm text-muted-foreground">Servant Room</p>
                                <p className="font-medium">Yes</p>
                              </div>
                            )}
                            {listing.servantBathroom && (
                              <div>
                                <p className="text-sm text-muted-foreground">Servant Bathroom</p>
                                <p className="font-medium">Yes</p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Seller Information */}
                      {(listing.sellerName || listing.sellerType) && (
                        <Card>
                          <CardHeader>
                            <CardTitle>Seller Information</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                              {listing.sellerName && (
                                <div>
                                  <p className="text-sm text-muted-foreground">Seller Name</p>
                                  <p className="font-medium">{listing.sellerName}</p>
                                </div>
                              )}
                              {listing.sellerType && (
                                <div>
                                  <p className="text-sm text-muted-foreground">Seller Type</p>
                                  <p className="font-medium capitalize">{listing.sellerType}</p>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </TabsContent>

                    <TabsContent value="amenities" className="mt-4 space-y-4">
                      {/* Security Features */}
                      {(listing.security24x7 || listing.cctv || listing.generatorBackup ||
                        listing.fireSafety || listing.liftAvailable) && (
                        <Card>
                          <CardHeader>
                            <CardTitle>Security & Building Features</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                              {listing.security24x7 && (
                                <div className="flex items-center gap-2">
                                  <Shield className="h-5 w-5 text-primary" />
                                  <span>24/7 Security</span>
                                </div>
                              )}
                              {listing.cctv && (
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="h-5 w-5 text-primary" />
                                  <span>CCTV Surveillance</span>
                                </div>
                              )}
                              {listing.generatorBackup && (
                                <div className="flex items-center gap-2">
                                  <Zap className="h-5 w-5 text-primary" />
                                  <span>Generator Backup</span>
                                </div>
                              )}
                              {listing.fireSafety && (
                                <div className="flex items-center gap-2">
                                  <Shield className="h-5 w-5 text-primary" />
                                  <span>Fire Safety System</span>
                                </div>
                              )}
                              {listing.liftAvailable && (
                                <div className="flex items-center gap-2">
                                  <Building2 className="h-5 w-5 text-primary" />
                                  <span>Lift/Elevator</span>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* General Amenities */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Amenities & Features</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {listing.amenities && listing.amenities.length > 0 ? (
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                              {listing.amenities.map(amenity => {
                                const Icon =
                                  amenityIcons[amenity] || CheckCircle;
                                return (
                                  <div
                                    key={amenity}
                                    className="flex items-center gap-2"
                                  >
                                    <Icon className="h-5 w-5 text-primary" />
                                    <span>{amenity}</span>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="text-muted-foreground">
                              No amenities listed for this property.
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="location" className="mt-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Location</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="mb-4">
                            <p className="font-medium">{listing.address}</p>
                            <p className="text-muted-foreground">
                              {listing.area && `${listing.area}, `}
                              {listing.city}
                              {listing.district && `, ${listing.district}`}
                            </p>
                          </div>
                          <div className="rounded-xl border bg-muted h-[300px] flex items-center justify-center">
                            <div className="text-center">
                              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                              <p className="text-muted-foreground">
                                Map view coming soon
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {listing.floorPlanUrl && (
                      <TabsContent value="floorplan" className="mt-4">
                        <Card>
                          <CardHeader>
                            <CardTitle>Floor Plan</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <img
                              src={listing.floorPlanUrl}
                              alt="Floor Plan"
                              className="w-full rounded-lg"
                            />
                          </CardContent>
                        </Card>
                      </TabsContent>
                    )}
                  </Tabs>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{listing.views || 0} views</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      <span>{listing.favorites || 0} saves</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <AgentContactCard
                    listing={listing}
                    broker={listing.broker}
                    agent={listing.user}
                  />
                </div>
              </div>

              {similarListings && similarListings.data.length > 0 && (
                <section className="mt-12">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-heading text-xl font-bold">
                      Similar Properties
                    </h2>
                    <Link
                      href={`/search?city=${listing.city}&propertyType=${listing.propertyType}`}
                    >
                      <Button variant="ghost" className="gap-1">
                        View More
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {similarListings.data
                      .filter(l => l.id !== listing.id)
                      .slice(0, 4)
                      .map(similarListing => (
                        <ListingCard
                          key={similarListing.id}
                          listing={similarListing}
                        />
                      ))}
                  </div>
                </section>
              )}
            </>
          ) : null}
        </div>
    </div>
  );
}
