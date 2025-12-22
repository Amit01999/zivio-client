import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import {
  Heart,
  MessageSquare,
  Calendar,
  Scale,
  Home,
  Search,
  ChevronRight,
  Bell,
  Building2,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ListingCard, ListingCardSkeleton } from '@/components/ListingCard';
import { useAuth } from '@/lib/auth';
import type { Listing, PropertyInquiryWithDetails } from '@/types/schema';

export default function BuyerDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const [location, setLocation] = useLocation();

  // Fetch buyer stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/dashboard/buyer'],
    queryFn: async () => {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/dashboard/buyer', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    },
    enabled: !!user,
  });

  // Fetch favorites
  const { data: favorites, isLoading: favoritesLoading } = useQuery<{
    data: Listing[];
  }>({
    queryKey: ['/api/favorites'],
    queryFn: async () => {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/favorites', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    },
    enabled: !!user,
  });

  // Fetch inquiries
  const { data: inquiries, isLoading: inquiriesLoading } = useQuery<{
    data: PropertyInquiryWithDetails[];
  }>({
    queryKey: ['/api/property-inquiries'],
    queryFn: async () => {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/property-inquiries', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    },
    enabled: !!user,
  });

  // Fetch comparison cart
  const { data: comparisonCart, isLoading: cartLoading } = useQuery({
    queryKey: ['/api/comparison-cart'],
    queryFn: async () => {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/comparison-cart', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    },
    enabled: !!user,
  });

  if (!user && !authLoading) {
    setLocation('/login');
    return null;
  }

  const statCards = [
    {
      label: 'Favorites',
      value: stats?.favoritesCount || 0,
      icon: Heart,
      href: '#favorites',
      color: 'text-red-500',
    },
    {
      label: 'Inquiries',
      value: stats?.inquiriesCount || 0,
      icon: MessageSquare,
      href: '#inquiries',
      color: 'text-blue-500',
    },
    {
      label: 'Scheduled Viewings',
      value: stats?.scheduledViewings || 0,
      icon: Calendar,
      href: '#inquiries',
      color: 'text-green-500',
    },
    {
      label: 'Comparison Cart',
      value: stats?.comparisonCount || 0,
      icon: Scale,
      href: '/comparison',
      color: 'text-purple-500',
    },
  ];

  return (
    <div className="bg-muted/30 py-8">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user?.profilePhotoUrl || undefined} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                {user?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-heading text-2xl font-bold">
                Welcome, {user?.name?.split(' ')[0]}!
              </h1>
              <p className="text-muted-foreground">{user?.email}</p>
              <Badge variant="secondary" className="mt-1 capitalize">
                {user?.role}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/search">
              <Button className="gap-2">
                <Search className="h-4 w-4" />
                Browse Properties
              </Button>
            </Link>
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {statsLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))
            : statCards.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Card
                    key={stat.label}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() =>
                      stat.href.startsWith('#')
                        ? document.querySelector(stat.href)?.scrollIntoView({ behavior: 'smooth' })
                        : setLocation(stat.href)
                    }
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {stat.label}
                          </p>
                          <p className="font-heading text-3xl font-bold">
                            {stat.value}
                          </p>
                        </div>
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 ${stat.color}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="favorites" className="space-y-6">
          <TabsList>
            <TabsTrigger value="favorites" className="gap-2" id="favorites">
              <Heart className="h-4 w-4" />
              Favorites
            </TabsTrigger>
            <TabsTrigger value="inquiries" className="gap-2" id="inquiries">
              <MessageSquare className="h-4 w-4" />
              My Inquiries
            </TabsTrigger>
          </TabsList>

          {/* Favorites Tab */}
          <TabsContent value="favorites">
            <Card>
              <CardHeader>
                <CardTitle>Saved Properties</CardTitle>
                <CardDescription>
                  Properties you've saved for later
                </CardDescription>
              </CardHeader>
              <CardContent>
                {favoritesLoading ? (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <ListingCardSkeleton key={i} />
                    ))}
                  </div>
                ) : favorites?.data && favorites.data.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {favorites.data.map((listing) => (
                      <ListingCard
                        key={listing.id}
                        listing={listing}
                        isFavorited
                      />
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="font-heading font-semibold mb-2">
                      No favorites yet
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Save properties you like to find them easily later
                    </p>
                    <Link href="/search">
                      <Button variant="outline" className="gap-2">
                        Browse Properties
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inquiries Tab */}
          <TabsContent value="inquiries">
            <Card>
              <CardHeader>
                <CardTitle>My Inquiries</CardTitle>
                <CardDescription>
                  View and track your property inquiries
                </CardDescription>
              </CardHeader>
              <CardContent>
                {inquiriesLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-24 w-full" />
                    ))}
                  </div>
                ) : inquiries?.data && inquiries.data.length > 0 ? (
                  <div className="space-y-4">
                    {inquiries.data.map((inquiry) => (
                      <div
                        key={inquiry.id}
                        className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex gap-4 flex-1">
                            {inquiry.property?.images?.[0] && (
                              <div className="w-24 h-20 rounded-md overflow-hidden flex-shrink-0">
                                <img
                                  src={inquiry.property.images[0]}
                                  alt={inquiry.property.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold truncate">
                                {inquiry.property?.title || 'Property'}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {inquiry.property?.city}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="capitalize">
                                  {inquiry.requestType}
                                </Badge>
                                <Badge
                                  variant={
                                    inquiry.status === 'new'
                                      ? 'default'
                                      : inquiry.status === 'contacted'
                                      ? 'secondary'
                                      : 'outline'
                                  }
                                  className="capitalize"
                                >
                                  {inquiry.status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <Link href={`/properties/${inquiry.property?.slug}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </Link>
                        </div>
                        {inquiry.message && (
                          <p className="text-sm text-muted-foreground mt-3 pl-28">
                            {inquiry.message}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="font-heading font-semibold mb-2">
                      No inquiries yet
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Start exploring properties and send inquiries
                    </p>
                    <Link href="/search">
                      <Button variant="outline" className="gap-2">
                        Browse Properties
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {[
                { href: '/search', icon: Search, label: 'Browse All Properties' },
                { href: '/comparison', icon: Scale, label: 'Compare Properties' },
                { href: '/favorites', icon: Heart, label: 'View All Favorites' },
                { href: '/messages', icon: MessageSquare, label: 'View Messages' },
              ].map((action) => {
                const Icon = action.icon;
                return (
                  <Link key={action.href} href={action.href}>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {action.label}
                      </span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
