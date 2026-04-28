import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import {
  Building2,
  Eye,
  MessageSquare,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  Bell,
  TrendingUp,
  Edit,
  Trash2,
  ShieldCheck,
  MailOpen,
  Mail,
  Send,
  Loader2,
  User,
  ChevronDown,
  ChevronUp,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';
import type {
  Listing,
  PaginatedResponse,
  PropertyInquiryWithDetails,
  AdminSellerMessage,
  AdminSellerMessageThread,
} from '@/types/schema';
import { formatPrice, formatDate } from '@/lib/format';
import { API_URL } from '@/lib/api';

interface AdminSellerMessageWithProperty extends AdminSellerMessage {
  property?: { id: string; title: string; city: string; images?: string[] };
}

const TYPE_COLORS: Record<string, string> = {
  viewing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  buy: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  meeting:
    'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
};

const INQUIRY_STATUS_VARIANT: Record<
  string,
  'default' | 'secondary' | 'outline'
> = {
  new: 'default',
  contacted: 'secondary',
  closed: 'outline',
};

export default function SellerDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [deletingListingId, setDeletingListingId] = useState<string | null>(
    null,
  );

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/dashboard/seller'],
    queryFn: async () => {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/api/dashboard/seller`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    },
    enabled: !!user,
  });

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

  const { data: inquiries, isLoading: inquiriesLoading } = useQuery<{
    data: PropertyInquiryWithDetails[];
  }>({
    queryKey: ['/api/property-inquiries/seller'],
    queryFn: async () => {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/api/property-inquiries/seller`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    },
    enabled: !!user,
  });

  const { data: adminMessages, isLoading: adminMessagesLoading } = useQuery<{
    data: AdminSellerMessageWithProperty[];
  }>({
    queryKey: ['/api/seller-messages'],
    queryFn: async () => {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_URL}/api/seller-messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
    enabled: !!user,
    refetchInterval: 30000,
    staleTime: 0,
  });

  const markReadMutation = useMutation({
    mutationFn: async (messageId: string) => {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(
        `${API_URL}/api/seller-messages/${messageId}/read`,
        {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!res.ok) throw new Error('Failed to mark as read');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/seller-messages'] });
    },
  });

  const unreadAdminMessages = (adminMessages?.data ?? []).filter(
    m => !m.read,
  ).length;

  const [expandedMsgId, setExpandedMsgId] = useState<string | null>(null);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});

  const sellerReplyMutation = useMutation({
    mutationFn: async ({
      messageId,
      text,
    }: {
      messageId: string;
      text: string;
    }) => {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(
        `${API_URL}/api/seller-messages/${messageId}/reply`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text }),
        },
      );
      if (!res.ok) throw new Error('Failed to send reply');
      return res.json();
    },
    onSuccess: (_data, variables) => {
      toast({ title: 'Reply sent' });
      setReplyDrafts(prev => ({ ...prev, [variables.messageId]: '' }));
      queryClient.invalidateQueries({ queryKey: ['/api/seller-messages'] });
    },
    onError: () =>
      toast({ title: 'Failed to send reply', variant: 'destructive' }),
  });

  const updateListingMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Listing>;
    }) => {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/api/listings/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: 'Listing updated successfully' });
      queryClient.invalidateQueries({ queryKey: ['/api/listings/my'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/seller'] });
      setEditingListing(null);
    },
    onError: () => {
      toast({ title: 'Failed to update listing', variant: 'destructive' });
    },
  });

  const deleteListingMutation = useMutation({
    mutationFn: async (listingId: string) => {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/api/listings/${listingId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to delete');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: 'Listing deleted successfully' });
      queryClient.invalidateQueries({ queryKey: ['/api/listings/my'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/seller'] });
      setDeletingListingId(null);
    },
    onError: () => {
      toast({ title: 'Failed to delete listing', variant: 'destructive' });
    },
  });

  const handleSaveListing = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingListing) return;
    const formData = new FormData(e.currentTarget);
    updateListingMutation.mutate({
      id: editingListing.id,
      data: {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        price: Number(formData.get('price')),
        address: formData.get('address') as string,
        city: formData.get('city') as string,
        bedrooms: Number(formData.get('bedrooms')) || undefined,
        bathrooms: Number(formData.get('bathrooms')) || undefined,
        areaSqFt: Number(formData.get('areaSqFt')) || undefined,
      },
    });
  };

  if (!user && !authLoading) {
    setLocation('/login');
    return null;
  }

  const statCards = [
    {
      label: 'Total Listings',
      value: stats?.totalListings || 0,
      icon: Building2,
      color: 'text-blue-500',
    },
    {
      label: 'Pending Approval',
      value: stats?.pendingListings || 0,
      icon: Clock,
      color: 'text-yellow-500',
    },
    {
      label: 'Published',
      value: stats?.publishedListings || 0,
      icon: CheckCircle,
      color: 'text-green-500',
    },
    {
      label: 'Total Views',
      value: stats?.totalViews || 0,
      icon: Eye,
      color: 'text-purple-500',
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      pending: { variant: 'outline', icon: Clock, color: 'text-yellow-500' },
      published: {
        variant: 'default',
        icon: CheckCircle,
        color: 'text-green-500',
      },
      rejected: {
        variant: 'destructive',
        icon: XCircle,
        color: 'text-red-500',
      },
      sold: { variant: 'secondary', icon: CheckCircle, color: 'text-gray-500' },
      rented: {
        variant: 'secondary',
        icon: CheckCircle,
        color: 'text-gray-500',
      },
    };
    const config = variants[status] || variants.pending;
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="capitalize gap-1">
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    );
  };

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
                Seller Dashboard
              </h1>
              <p className="text-muted-foreground">{user?.email}</p>
              <Badge variant="secondary" className="mt-1 capitalize">
                {user?.role}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/listings/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Post New Property
              </Button>
            </Link>
            {/* <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button> */}
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
            : statCards.map(stat => {
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
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 ${stat.color}`}
                        >
                          <Icon className="h-6 w-6" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
        </div>

        {/* Tabs: My Listings + Inquiries */}
        <Tabs defaultValue="listings" className="space-y-6">
          <TabsList>
            <TabsTrigger value="listings" className="gap-2">
              <Building2 className="h-4 w-4" />
              My Listings
            </TabsTrigger>
            <TabsTrigger value="inquiries" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Inquiries
              {inquiries?.data && inquiries.data.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs px-1.5 py-0">
                  {inquiries.data.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="admin-messages" className="gap-2">
              <ShieldCheck className="h-4 w-4" />
              Admin Messages
              {unreadAdminMessages > 0 && (
                <Badge variant="default" className="ml-1 text-xs px-1.5 py-0">
                  {unreadAdminMessages}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* My Listings Tab */}
          <TabsContent value="listings">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>My Listings</CardTitle>
                  <CardDescription>
                    Manage all your property listings
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
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                ) : myListings?.data && myListings.data.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Property</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Views</TableHead>
                          <TableHead>Posted</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {myListings.data.map(listing => (
                          <TableRow key={listing.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="h-12 w-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                  {listing.images?.[0] && (
                                    <img
                                      src={listing.images[0]}
                                      alt={listing.title}
                                      className="h-full w-full object-cover"
                                    />
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <p className="font-medium line-clamp-1">
                                    {listing.title}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {listing.propertyType}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {formatPrice(listing.price)}
                            </TableCell>
                            <TableCell>{listing.city}</TableCell>
                            <TableCell>
                              {getStatusBadge(listing.status)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Eye className="h-4 w-4 text-muted-foreground" />
                                {listing.views || 0}
                              </div>
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {listing.createdAt &&
                                formatDate(listing.createdAt)}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Link href={`/properties/${listing.slug}`}>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    title="View"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </Link>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  title="Edit"
                                  onClick={() => setEditingListing(listing)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  title="Delete"
                                  className="text-red-500 hover:text-red-600"
                                  onClick={() =>
                                    setDeletingListingId(listing.id)
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
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

          {/* Inquiries Tab */}
          <TabsContent value="inquiries">
            <Card>
              <CardHeader>
                <CardTitle>Property Inquiries</CardTitle>
                {/* <CardDescription>
                  Buyers interested in your properties — admin manages all communication
                </CardDescription> */}
              </CardHeader>
              <CardContent>
                {inquiriesLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                ) : inquiries?.data && inquiries.data.length > 0 ? (
                  <div className="space-y-3">
                    {inquiries.data.map(inquiry => (
                      <div
                        key={inquiry.id}
                        className="rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          {inquiry.property?.images?.[0] && (
                            <div className="h-16 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                              <img
                                src={inquiry.property.images[0]}
                                alt={inquiry.property.title}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          )}

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div>
                                <p className="font-semibold line-clamp-1">
                                  {inquiry.property?.title ?? 'Property'}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {inquiry.property?.city}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <span
                                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                                    TYPE_COLORS[inquiry.requestType] ?? ''
                                  }`}
                                >
                                  {inquiry.requestType}
                                </span>
                                <Badge
                                  variant={
                                    INQUIRY_STATUS_VARIANT[inquiry.status] ??
                                    'outline'
                                  }
                                  className="capitalize"
                                >
                                  {inquiry.status}
                                </Badge>
                              </div>
                            </div>

                            {inquiry.message && (
                              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                                {inquiry.message}
                              </p>
                            )}

                            <p className="mt-1 text-xs text-muted-foreground">
                              Received{' '}
                              {inquiry.createdAt
                                ? formatDate(inquiry.createdAt)
                                : ''}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-40" />
                    <h3 className="font-heading font-semibold mb-2">
                      No inquiries yet
                    </h3>
                    <p className="text-muted-foreground">
                      Inquiries from interested buyers will appear here once
                      your listings go live
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Admin Messages Tab */}
          <TabsContent value="admin-messages">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  Messages from Admin
                </CardTitle>
                <CardDescription>
                  Notifications about buyer interest in your properties — no
                  buyer personal details are shared
                </CardDescription>
              </CardHeader>
              <CardContent>
                {adminMessagesLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-24 w-full" />
                    ))}
                  </div>
                ) : (adminMessages?.data ?? []).length === 0 ? (
                  <div className="py-12 text-center">
                    <ShieldCheck className="mx-auto h-12 w-12 text-muted-foreground opacity-40 mb-4" />
                    <h3 className="font-heading font-semibold mb-2">
                      No messages yet
                    </h3>
                    <p className="text-muted-foreground">
                      Admin will send you a message when there is buyer interest
                      in one of your properties
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {(adminMessages?.data ?? []).map(msg => {
                      const isExpanded = expandedMsgId === msg.id;
                      const thread: AdminSellerMessageThread[] =
                        msg.thread ?? [];
                      const hasThread = thread.length > 0;
                      return (
                        <div
                          key={msg.id}
                          className={`rounded-lg border transition-colors ${
                            msg.read
                              ? 'bg-background'
                              : 'bg-primary/5 border-primary/30'
                          }`}
                        >
                          {/* Message header — click to expand */}
                          <div
                            className="flex items-start gap-4 p-4 cursor-pointer"
                            onClick={() => {
                              if (!msg.read) markReadMutation.mutate(msg.id);
                              setExpandedMsgId(isExpanded ? null : msg.id);
                            }}
                          >
                            {msg.property?.images?.[0] && (
                              <div className="h-14 w-18 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                                <img
                                  src={msg.property.images[0]}
                                  alt={msg.property.title}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-start justify-between gap-2">
                                <div>
                                  <p className="font-semibold line-clamp-1">
                                    {msg.property?.title ?? 'Property'}
                                  </p>
                                  {msg.property?.city && (
                                    <p className="text-xs text-muted-foreground">
                                      {msg.property.city}
                                    </p>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  {hasThread && (
                                    <Badge
                                      variant="secondary"
                                      className="text-xs gap-1"
                                    >
                                      <MessageSquare className="h-3 w-3" />
                                      {thread.length}
                                    </Badge>
                                  )}
                                  {msg.read ? (
                                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                      <MailOpen className="h-3.5 w-3.5" />
                                      Read
                                    </span>
                                  ) : (
                                    <Badge
                                      variant="default"
                                      className="gap-1 text-xs"
                                    >
                                      <Mail className="h-3 w-3" />
                                      New
                                    </Badge>
                                  )}
                                  {isExpanded ? (
                                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                  )}
                                </div>
                              </div>
                              {/* Preview of initial message */}
                              <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2 flex items-start gap-1.5">
                                <ShieldCheck className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
                                {msg.message}
                              </p>
                              <p className="mt-1 text-xs text-muted-foreground">
                                {msg.createdAt ? formatDate(msg.createdAt) : ''}
                              </p>
                            </div>
                          </div>

                          {/* Expanded: full thread + reply input */}
                          {isExpanded && (
                            <div className="border-t px-4 pb-4 space-y-3">
                              {/* Full conversation thread */}
                              <div className="space-y-2 pt-3">
                                {/* Initial admin message */}
                                <div className="flex gap-2">
                                  <div className="flex-shrink-0 h-7 w-7 rounded-full bg-blue-600 flex items-center justify-center">
                                    <ShieldCheck className="h-3.5 w-3.5 text-white" />
                                  </div>
                                  <div className="max-w-[85%] rounded-xl rounded-tl-sm bg-blue-50 dark:bg-blue-950/30 px-3 py-2">
                                    <p className="text-xs font-semibold mb-0.5">
                                      Admin
                                    </p>
                                    <p className="text-sm whitespace-pre-wrap">
                                      {msg.message}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground mt-1">
                                      {msg.createdAt
                                        ? formatDate(msg.createdAt)
                                        : ''}
                                    </p>
                                  </div>
                                </div>

                                {/* Thread replies */}
                                {thread.map((t, idx) => {
                                  const isAdmin = t.senderRole === 'admin';
                                  return (
                                    <div
                                      key={idx}
                                      className={`flex gap-2 ${isAdmin ? '' : 'flex-row-reverse'}`}
                                    >
                                      <div
                                        className={`flex-shrink-0 h-7 w-7 rounded-full flex items-center justify-center ${
                                          isAdmin
                                            ? 'bg-blue-600'
                                            : 'bg-emerald-600'
                                        }`}
                                      >
                                        {isAdmin ? (
                                          <ShieldCheck className="h-3.5 w-3.5 text-white" />
                                        ) : (
                                          <User className="h-3.5 w-3.5 text-white" />
                                        )}
                                      </div>
                                      <div
                                        className={`max-w-[85%] rounded-xl px-3 py-2 ${
                                          isAdmin
                                            ? 'rounded-tl-sm bg-blue-50 dark:bg-blue-950/30'
                                            : 'rounded-tr-sm bg-emerald-50 dark:bg-emerald-950/30'
                                        }`}
                                      >
                                        <p className="text-xs font-semibold mb-0.5">
                                          {isAdmin ? 'Admin' : 'You'}
                                        </p>
                                        <p className="text-sm whitespace-pre-wrap">
                                          {t.text}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground mt-1">
                                          {t.sentAt
                                            ? formatDate(t.sentAt as string)
                                            : ''}
                                        </p>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Reply input */}
                              <div className="border-t pt-3 space-y-2">
                                <Textarea
                                  placeholder="Reply to Admin..."
                                  value={replyDrafts[msg.id] ?? ''}
                                  onChange={e =>
                                    setReplyDrafts(prev => ({
                                      ...prev,
                                      [msg.id]: e.target.value,
                                    }))
                                  }
                                  className="min-h-[72px] resize-none text-sm"
                                />
                                <div className="flex justify-end">
                                  <Button
                                    size="sm"
                                    className="gap-2"
                                    disabled={
                                      !replyDrafts[msg.id]?.trim() ||
                                      sellerReplyMutation.isPending
                                    }
                                    onClick={() =>
                                      sellerReplyMutation.mutate({
                                        messageId: msg.id,
                                        text: replyDrafts[msg.id] ?? '',
                                      })
                                    }
                                  >
                                    {sellerReplyMutation.isPending ? (
                                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    ) : (
                                      <Send className="h-3.5 w-3.5" />
                                    )}
                                    Reply to Admin
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Performance Insights */}
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Insights</CardTitle>
              <CardDescription>
                Overview of your listings performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Total Inquiries</p>
                    <p className="text-sm text-muted-foreground">
                      Buyers interested in your properties
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-2xl font-bold">
                      {stats?.totalInquiries || 0}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Average Views per Listing</p>
                    <p className="text-sm text-muted-foreground">
                      How much attention your properties get
                    </p>
                  </div>
                  <div className="text-2xl font-bold">
                    {stats?.totalListings
                      ? Math.round(stats.totalViews / stats.totalListings)
                      : 0}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Listing Dialog */}
      <Dialog
        open={!!editingListing}
        onOpenChange={() => setEditingListing(null)}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Listing</DialogTitle>
            <DialogDescription>
              Update your property information
            </DialogDescription>
          </DialogHeader>
          {editingListing && (
            <form onSubmit={handleSaveListing} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={editingListing.title}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingListing.description || ''}
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price (BDT)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    defaultValue={editingListing.price as number}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="areaSqFt">Area (sq ft)</Label>
                  <Input
                    id="areaSqFt"
                    name="areaSqFt"
                    type="number"
                    defaultValue={editingListing.areaSqFt || ''}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    name="bedrooms"
                    type="number"
                    defaultValue={editingListing.bedrooms || ''}
                  />
                </div>
                <div>
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    name="bathrooms"
                    type="number"
                    defaultValue={editingListing.bathrooms || ''}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    defaultValue={editingListing.city}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    defaultValue={editingListing.address}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingListing(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateListingMutation.isPending}
                >
                  {updateListingMutation.isPending
                    ? 'Saving...'
                    : 'Save Changes'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Listing Confirmation */}
      <AlertDialog
        open={!!deletingListingId}
        onOpenChange={() => setDeletingListingId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Listing?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this listing. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deletingListingId &&
                deleteListingMutation.mutate(deletingListingId)
              }
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
