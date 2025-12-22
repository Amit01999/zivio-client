import { useLocation } from 'wouter';
import {
  Heart,
  Bed,
  Bath,
  Maximize2,
  MapPin,
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { Listing } from '@/types/schema';
import {
  formatPrice,
  formatArea,
  formatRelativeTime,
  getPropertyTypeLabel,
} from '@/lib/format';
import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface ListingCardProps {
  listing: Listing;
  isFavorited?: boolean;
}

export function ListingCard({
  listing,
  isFavorited = false,
}: ListingCardProps) {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [favorited, setFavorited] = useState(isFavorited);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast({
        title: 'Login Required',
        description: 'Please login to save properties to your favorites.',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (favorited) {
        await apiRequest('DELETE', `/api/favorites/${listing.id}`);
        setFavorited(false);
        toast({ title: 'Removed from favorites' });
      } else {
        await apiRequest('POST', '/api/favorites', { listingId: listing.id });
        setFavorited(true);
        toast({ title: 'Added to favorites' });
      }
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update favorites. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const primaryImage = listing.images?.[0] || '/placeholder-property.jpg';

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on the favorite button
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    setLocation(`/property/${listing.slug}`);
  };

  return (
    <Card
      className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
      onClick={handleCardClick}
      data-testid={`card-listing-${listing.id}`}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {!imageLoaded && <Skeleton className="absolute inset-0" />}
        <img
          src={primaryImage}
          alt={listing.title}
          className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <Badge
            className={`${
              listing.listingType === 'rent'
                ? 'bg-accent text-accent-foreground'
                : 'bg-primary text-primary-foreground'
            } font-medium`}
          >
            {listing.listingType === 'rent' ? 'For Rent' : 'For Sale'}
          </Badge>
          {listing.isFeatured && (
            <Badge className="featured-gradient text-white gap-1">
              <Sparkles className="h-3 w-3" />
              Featured
            </Badge>
          )}
          {listing.isVerified && (
            <Badge
              variant="secondary"
              className="gap-1 bg-white/90 text-foreground"
            >
              <CheckCircle className="h-3 w-3 text-primary" />
              Verified
            </Badge>
          )}
          {listing.completionStatus === 'under_construction' && (
            <Badge
              variant="secondary"
              className="gap-1 bg-orange-500/90 text-white"
            >
              Under Construction
            </Badge>
          )}
          {listing.negotiable && (
            <Badge
              variant="secondary"
              className="gap-1 bg-blue-500/90 text-white"
            >
              Negotiable
            </Badge>
          )}
        </div>

        <div className="absolute left-3 bottom-3 flex flex-col gap-1">
          <div className="glass rounded-lg px-3 py-1.5">
            <span className="font-heading text-lg font-bold text-foreground dark:text-white">
              {formatPrice(listing.price, true)}
              {listing.listingType === 'rent' && (
                <span className="text-sm font-normal text-muted-foreground">
                  /mo
                </span>
              )}
            </span>
          </div>
          {listing.pricePerSqft && (
            <div className="glass rounded-lg px-2 py-1">
              <span className="text-xs text-foreground dark:text-white">
                {formatPrice(listing.pricePerSqft)}/sqft
              </span>
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className={`absolute right-3 top-3 h-9 w-9 rounded-full bg-white/80 backdrop-blur hover:bg-white ${
            favorited
              ? 'text-red-500'
              : 'text-muted-foreground hover:text-red-500'
          }`}
          onClick={handleFavorite}
          data-testid={`button-favorite-${listing.id}`}
        >
          <Heart className={`h-5 w-5 ${favorited ? 'fill-current' : ''}`} />
        </Button>
      </div>

      <CardContent className="p-4">
        <div className="mb-2">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3
              className="font-heading font-semibold line-clamp-1 text-base"
              data-testid={`text-title-${listing.id}`}
            >
              {listing.title}
            </h3>
            <Badge variant="outline" className="shrink-0 text-xs">
              {getPropertyTypeLabel(listing.propertyType)}
            </Badge>
          </div>
          {listing.category && (
            <Badge variant="secondary" className="text-xs">
              {listing.category}
            </Badge>
          )}
        </div>

        <div className="mb-3 flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span
            className="line-clamp-1"
            data-testid={`text-location-${listing.id}`}
          >
            {listing.area ? `${listing.area}, ` : ''}
            {listing.city}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            {listing.bedrooms !== null && listing.bedrooms !== undefined && (
              <div className="flex items-center gap-1">
                <Bed className="h-4 w-4" />
                <span>{listing.bedrooms}</span>
              </div>
            )}
            {listing.bathrooms !== null && listing.bathrooms !== undefined && (
              <div className="flex items-center gap-1">
                <Bath className="h-4 w-4" />
                <span>{listing.bathrooms}</span>
              </div>
            )}
            {listing.areaSqFt && (
              <div className="flex items-center gap-1">
                <Maximize2 className="h-4 w-4" />
                <span>{formatArea(listing.areaSqFt)}</span>
              </div>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            {listing.createdAt && formatRelativeTime(listing.createdAt)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export function ListingCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-[16/10]" />
      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-3">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-20" />
        </div>
      </CardContent>
    </Card>
  );
}
