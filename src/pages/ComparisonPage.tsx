import { useQuery, useMutation } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Scale, X, Check, Minus, Eye, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';
import type { ComparisonCartWithListings } from '@/types/schema';
import { formatPrice } from '@/lib/format';

export default function ComparisonPage() {
  const { toast } = useToast();

  // Fetch comparison cart
  const { data: cart, isLoading } = useQuery<ComparisonCartWithListings>({
    queryKey: ['/api/comparison-cart'],
    queryFn: async () => {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/comparison-cart', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    },
  });

  // Remove from cart mutation
  const removeFromCart = useMutation({
    mutationFn: async (listingId: string) => {
      const token = localStorage.getItem('accessToken');
      await fetch(`/api/comparison-cart/${listingId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      toast({ title: 'Property removed from comparison' });
      queryClient.invalidateQueries({ queryKey: ['/api/comparison-cart'] });
    },
  });

  // Clear cart mutation
  const clearCart = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem('accessToken');
      await fetch('/api/comparison-cart', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      toast({ title: 'Comparison cart cleared' });
      queryClient.invalidateQueries({ queryKey: ['/api/comparison-cart'] });
    },
  });

  if (isLoading) {
    return (
      <div className="bg-muted/30 py-8">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-96 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const listings = cart?.listings || [];

  if (listings.length === 0) {
    return (
      <div className="bg-muted/30 py-16">
        <div className="mx-auto max-w-4xl px-4 md:px-6">
          <Card>
            <CardContent className="py-12 text-center">
              <Scale className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="font-heading text-2xl font-bold mb-2">
                No Properties to Compare
              </h2>
              <p className="text-muted-foreground mb-6">
                Add properties to your comparison cart to see them side-by-side
              </p>
              <Link href="/search">
                <Button>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Browse Properties
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const comparisonFields = [
    { label: 'Price', key: 'price', format: (val: any) => formatPrice(val) },
    { label: 'Property Type', key: 'propertyType', format: (val: any) => val },
    { label: 'Price Type', key: 'priceType', format: (val: any) => val },
    { label: 'City', key: 'city', format: (val: any) => val },
    { label: 'Area', key: 'area', format: (val: any) => val || 'N/A' },
    { label: 'Bedrooms', key: 'bedrooms', format: (val: any) => val || 'N/A' },
    { label: 'Bathrooms', key: 'bathrooms', format: (val: any) => val || 'N/A' },
    { label: 'Area (sq ft)', key: 'areaSqFt', format: (val: any) => val ? val.toLocaleString() : 'N/A' },
    { label: 'Floor', key: 'floor', format: (val: any) => val || 'N/A' },
    { label: 'Parking', key: 'parkingCount', format: (val: any) => val || 'N/A' },
    { label: 'Views', key: 'views', format: (val: any) => val || 0 },
    { label: 'Status', key: 'status', format: (val: any) => val },
  ];

  const amenitiesList = Array.from(
    new Set(listings.flatMap((l) => l.amenities || []))
  );

  return (
    <div className="bg-muted/30 py-8">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold mb-2">
              Property Comparison
            </h1>
            <p className="text-muted-foreground">
              Compare {listings.length} {listings.length === 1 ? 'property' : 'properties'} side-by-side
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/search">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Search
              </Button>
            </Link>
            {listings.length > 0 && (
              <Button
                variant="destructive"
                onClick={() => clearCart.mutate()}
                disabled={clearCart.isPending}
              >
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 min-w-max">
            {listings.map((listing) => (
              <Card key={listing.id} className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 z-10"
                  onClick={() => removeFromCart.mutate(listing.id)}
                >
                  <X className="h-4 w-4" />
                </Button>

                {/* Property Image */}
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  {listing.images?.[0] ? (
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <Scale className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  {listing.isFeatured && (
                    <Badge className="absolute top-2 left-2">Featured</Badge>
                  )}
                </div>

                <CardContent className="p-4 space-y-4">
                  {/* Title */}
                  <div>
                    <h3 className="font-semibold text-lg line-clamp-2 mb-1">
                      {listing.title}
                    </h3>
                    <Link href={`/properties/${listing.slug}`}>
                      <Button variant="link" className="p-0 h-auto text-sm">
                        <Eye className="h-3 w-3 mr-1" />
                        View Details
                      </Button>
                    </Link>
                  </div>

                  {/* Comparison Fields */}
                  {comparisonFields.map((field) => (
                    <div
                      key={field.key}
                      className="flex justify-between items-center py-2 border-b"
                    >
                      <span className="text-sm text-muted-foreground">
                        {field.label}
                      </span>
                      <span className="text-sm font-medium capitalize">
                        {field.format((listing as any)[field.key])}
                      </span>
                    </div>
                  ))}

                  {/* Amenities */}
                  <div className="pt-2">
                    <p className="text-sm font-medium mb-2">Amenities:</p>
                    <div className="space-y-1">
                      {amenitiesList.map((amenity) => (
                        <div
                          key={amenity}
                          className="flex items-center gap-2 text-sm"
                        >
                          {listing.amenities?.includes(amenity) ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Minus className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span
                            className={
                              !listing.amenities?.includes(amenity)
                                ? 'text-muted-foreground'
                                : ''
                            }
                          >
                            {amenity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Add more properties placeholder */}
            {listings.length < 5 && (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-6">
                  <Scale className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">Add More Properties</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Compare up to 5 properties at once
                  </p>
                  <Link href="/search">
                    <Button variant="outline" size="sm">
                      Browse Properties
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
