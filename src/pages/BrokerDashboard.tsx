import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import {
  Building2,
  Eye,
  MessageSquare,
  Plus,
  CheckCircle,
  Bell,
  TrendingUp,
  Award,
  Target
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAuth } from '@/lib/auth';
import type { Listing, PaginatedResponse, PropertyInquiryWithDetails } from '@/types/schema';
import { formatPrice, formatDate } from '@/lib/format';

export default function BrokerDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const [location, setLocation] = useLocation();

  // Fetch broker stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/dashboard/broker'],
    queryFn: async () => {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/dashboard/broker', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    },
    enabled: !!user,
  });

  // Fetch broker's listings
  const { data: myListings, isLoading: listingsLoading } = useQuery<
    PaginatedResponse<Listing>
  >({
    queryKey: ['/api/listings/my'],
    queryFn: async () => {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/listings/my', {
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
      label: 'Active Listings',
      value: stats?.activeListings || 0,
      icon: Building2,
      color: 'text-blue-500',
    },
    {
      label: 'Total Views',
      value: stats?.totalViews || 0,
      icon: Eye,
      color: 'text-purple-500',
    },
    {
      label: 'Total Inquiries',
      value: stats?.totalInquiries || 0,
      icon: MessageSquare,
      color: 'text-green-500',
    },
    {
      label: 'Sold/Rented',
      value: stats?.soldRentedCount || 0,
      icon: Target,
      color: 'text-orange-500',
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
                Broker Dashboard
              </h1>
              <p className="text-muted-foreground">{user?.email}</p>
              <Badge variant="secondary" className="mt-1 capitalize flex items-center gap-1 w-fit">
                <Award className="h-3 w-3" />
                {user?.role}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/listings/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Listing
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
                  <Card key={stat.label}>
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

        {/* Performance Metrics */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>
                Your listing performance overview
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Average Views per Listing</p>
                    <p className="text-sm text-muted-foreground">
                      Engagement rate
                    </p>
                  </div>
                  <div className="text-2xl font-bold flex items-center gap-2">
                    {stats?.averageViews || 0}
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Conversion Rate</p>
                    <p className="text-sm text-muted-foreground">
                      Inquiries to listings ratio
                    </p>
                  </div>
                  <div className="text-2xl font-bold">
                    {stats?.activeListings
                      ? Math.round((stats.totalInquiries / stats.activeListings) * 10) / 10
                      : 0}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Manage your broker activities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/listings/new">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Plus className="h-4 w-4" />
                  Add New Listing
                </Button>
              </Link>
              <Link href="/messages">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <MessageSquare className="h-4 w-4" />
                  View Messages
                </Button>
              </Link>
              <Link href="/agents">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Award className="h-4 w-4" />
                  My Profile
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Listings Management */}
        <Card>
          <CardHeader>
            <CardTitle>Manage Listings</CardTitle>
            <CardDescription>
              All your property listings at a glance
            </CardDescription>
          </CardHeader>
          <CardContent>
            {listingsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : myListings?.data && myListings.data.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Inquiries</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myListings.data.map((listing) => (
                    <TableRow key={listing.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-16 rounded-lg overflow-hidden bg-muted">
                            {listing.images?.[0] && (
                              <img
                                src={listing.images[0]}
                                alt={listing.title}
                                className="h-full w-full object-cover"
                              />
                            )}
                          </div>
                          <div>
                            <p className="font-medium line-clamp-1">
                              {listing.title}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {listing.city}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{formatPrice(listing.price)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            listing.status === 'published'
                              ? 'default'
                              : 'secondary'
                          }
                          className="capitalize"
                        >
                          {listing.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                          {listing.views || 0}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4 text-muted-foreground" />
                          0
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/properties/${listing.slug}`}>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="py-12 text-center">
                <Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-heading font-semibold mb-2">
                  No listings yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  Start adding property listings to manage
                </p>
                <Link href="/listings/new">
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add First Listing
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
