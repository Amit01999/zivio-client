import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import {
  Home,
  Heart,
  MessageSquare,
  Settings,
  Plus,
  Building2,
  TrendingUp,
  Eye,
  Users,
  LayoutDashboard,
  ChevronRight,
  Bell,
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
import type { Listing, PaginatedResponse, SafeUser } from '@/types/schema';
import { API_URL } from '@/lib/api';

export default function Dashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const [location, setLocation] = useLocation();

  const { data: myListings, isLoading: listingsLoading } = useQuery<
    PaginatedResponse<Listing>
  >({
    queryKey: ['/api/listings/my'],
    queryFn: async () => {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/api/listings/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    },
    enabled: !!user,
  });

  const { data: favorites, isLoading: favoritesLoading } = useQuery<{
    data: Listing[];
  }>({
    queryKey: ['/api/favorites'],
    queryFn: async () => {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/api/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    },
    enabled: !!user,
  });

  const stats = [
    {
      label: 'My Listings',
      value: myListings?.total || 0,
      icon: Building2,
      href: '/dashboard/listings',
    },
    {
      label: 'Total Views',
      value: myListings?.data?.reduce((acc, l) => acc + (l.views || 0), 0) || 0,
      icon: Eye,
    },
    {
      label: 'Favorites',
      value: favorites?.data?.length || 0,
      icon: Heart,
      href: '/favorites',
    },
    {
      label: 'Messages',
      value: 0,
      icon: MessageSquare,
      href: '/messages',
    },
  ];

  if (!user && !authLoading) {
    setLocation('/login');
    return null;
  }

  return (
    <div className="bg-muted/30 py-8">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user?.profilePhotoUrl || undefined} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                {user?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1
                className="font-heading text-2xl font-bold"
                data-testid="text-user-name"
              >
                Welcome, {user?.name?.split(' ')[0]}!
              </h1>
              <p className="text-muted-foreground">{user?.email}</p>
              <Badge variant="secondary" className="mt-1 capitalize">
                {user?.role}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/listings/new">
              <Button className="gap-2" data-testid="button-new-listing">
                <Plus className="h-4 w-4" />
                Post Property
              </Button>
            </Link>
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map(stat => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.label}
                className={
                  stat.href
                    ? 'cursor-pointer hover:shadow-md transition-shadow'
                    : ''
                }
                onClick={() => stat.href && setLocation(stat.href)}
                data-testid={`card-stat-${stat.label
                  .toLowerCase()
                  .replace(/\s+/g, '-')}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {stat.label}
                      </p>
                      <p className="font-heading text-2xl font-bold">
                        {stat.value}
                      </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Tabs defaultValue="listings" className="space-y-6">
          <TabsList>
            <TabsTrigger value="listings" className="gap-2">
              <Building2 className="h-4 w-4" />
              My Listings
            </TabsTrigger>
            <TabsTrigger value="favorites" className="gap-2">
              <Heart className="h-4 w-4" />
              Favorites
            </TabsTrigger>
          </TabsList>

          <TabsContent value="listings">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>My Listings</CardTitle>
                  <CardDescription>
                    Manage your property listings
                  </CardDescription>
                </div>
                <Link href="/listings/new">
                  <Button size="sm" className="gap-1">
                    <Plus className="h-4 w-4" />
                    Add New
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {listingsLoading ? (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <ListingCardSkeleton key={i} />
                    ))}
                  </div>
                ) : myListings?.data && myListings.data.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {myListings.data.slice(0, 6).map(listing => (
                      <ListingCard key={listing.id} listing={listing} />
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="font-heading font-semibold mb-2">
                      No listings yet
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Start by posting your first property listing
                    </p>
                    <Link href="/listings/new">
                      <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Post Your First Property
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

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
                    {favorites.data.map(listing => (
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
        </Tabs>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {[
                {
                  href: '/listings/new',
                  icon: Plus,
                  label: 'Post New Property',
                },
                { href: '/search', icon: Home, label: 'Browse Properties' },
                {
                  href: '/messages',
                  icon: MessageSquare,
                  label: 'View Messages',
                },
                {
                  href: '/dashboard/settings',
                  icon: Settings,
                  label: 'Account Settings',
                },
              ].map(action => {
                const Icon = action.icon;
                return (
                  <Link key={action.href} href={action.href}>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                      data-testid={`link-quick-${action.label
                        .toLowerCase()
                        .replace(/\s+/g, '-')}`}
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

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="py-8 text-center text-muted-foreground">
                <TrendingUp className="mx-auto h-8 w-8 mb-2" />
                <p>No recent activity to show</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
