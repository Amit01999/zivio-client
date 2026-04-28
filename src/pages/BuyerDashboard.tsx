import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import {
  Heart,
  MessageSquare,
  Calendar,
  Scale,
  Search,
  ChevronRight,
  Bell,
  Eye,
  Send,
  Loader2,
  User,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
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
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';
import type {
  Listing,
  PropertyInquiryWithDetails,
  InquiryMessage,
} from '@/types/schema';
import { API_URL } from '@/lib/api';
import { formatDate } from '@/lib/format';

export default function BuyerDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  const [replyText, setReplyText] = useState<Record<string, string>>({});

  // Fetch buyer stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/dashboard/buyer'],
    queryFn: async () => {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/api/dashboard/buyer`, {
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
      const response = await fetch(`${API_URL}/api/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    },
    enabled: !!user,
  });

  // Fetch inquiries — poll every 30s so new admin messages appear without a manual refresh
  const { data: inquiries, isLoading: inquiriesLoading } = useQuery<{
    data: PropertyInquiryWithDetails[];
  }>({
    queryKey: ['/api/property-inquiries'],
    queryFn: async () => {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/api/property-inquiries`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    },
    enabled: !!user,
    refetchInterval: 30000,
    staleTime: 0,
  });

  // Fetch comparison cart
  const { data: comparisonCart } = useQuery({
    queryKey: ['/api/comparison-cart'],
    queryFn: async () => {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/api/comparison-cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    },
    enabled: !!user,
  });

  const sendReply = useMutation({
    mutationFn: async ({ id, reply }: { id: string; reply: string }) => {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${API_URL}/api/property-inquiries/${id}/buyer-reply`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ reply }),
        },
      );
      if (!response.ok) throw new Error('Failed to send reply');
      return response.json();
    },
    onSuccess: (_data, variables) => {
      toast({
        title: 'Reply sent!',
        description: 'Your message has been sent to the admin.',
      });
      setReplyText(prev => ({ ...prev, [variables.id]: '' }));
      queryClient.invalidateQueries({
        queryKey: ['/api/property-inquiries'],
        exact: false,
      });
    },
    onError: () => {
      toast({ title: 'Failed to send reply', variant: 'destructive' });
    },
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

  // Build the visible conversation thread for an inquiry.
  // Prefer the messages[] array; fall back to adminReply for older records.
  function buildThread(inquiry: PropertyInquiryWithDetails): InquiryMessage[] {
    if (inquiry.messages && inquiry.messages.length > 0) {
      return inquiry.messages;
    }
    // backwards-compat: no messages array yet but adminReply exists
    if (inquiry.adminReply) {
      return [
        {
          senderRole: 'admin',
          text: inquiry.adminReply,
          sentAt: inquiry.adminReplyAt || inquiry.updatedAt || '',
        },
      ];
    }
    return [];
  }

  function hasAdminReplied(inquiry: PropertyInquiryWithDetails): boolean {
    const thread = buildThread(inquiry);
    if (thread.length === 0) return false;
    // allow reply if ANY admin message exists (buyer can reply to the latest)
    return thread.some(m => m.senderRole === 'admin');
  }

  function lastMessageIsAdmin(inquiry: PropertyInquiryWithDetails): boolean {
    const thread = buildThread(inquiry);
    if (thread.length === 0) return false;
    return thread[thread.length - 1].senderRole === 'admin';
  }

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
                  <Card
                    key={stat.label}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() =>
                      stat.href.startsWith('#')
                        ? document
                            .querySelector(stat.href)
                            ?.scrollIntoView({ behavior: 'smooth' })
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
                    {favorites.data.map(listing => (
                      <ListingCard
                        key={listing.id}
                        listing={listing}
                        isFavorited
                      />
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center ">
                    <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="font-heading font-semibold mb-2">
                      No favorites yet
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Save properties you like to find them easily later
                    </p>
                    <Link href="/search">
                      <Button variant="outline" className="gap-2">
                        Browse Properties <ChevronRight className="h-4 w-4" />
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
                  Track your inquiries and communicate with the admin
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
                    {inquiries.data.map(inquiry => {
                      const thread = buildThread(inquiry);
                      const canReply = lastMessageIsAdmin(inquiry);
                      const replyValue = replyText[inquiry.id] ?? '';

                      return (
                        <div
                          key={inquiry.id}
                          className="border rounded-lg overflow-hidden"
                        >
                          {/* Property + status row */}
                          <div className="flex items-start gap-4 p-4">
                            {inquiry.property?.images?.[0] && (
                              <div className="w-20 h-16 rounded-md overflow-hidden flex-shrink-0">
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
                              <div className="flex items-center gap-2 mt-2 flex-wrap">
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
                                {hasAdminReplied(inquiry) && (
                                  <Badge className="bg-green-600 hover:bg-green-600 gap-1">
                                    <MessageSquare className="h-3 w-3" />
                                    Admin replied
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <Link
                              href={`/properties/${inquiry.property?.slug}`}
                            >
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </Link>
                          </div>

                          {/* Initial inquiry message */}
                          {inquiry.message && (
                            <div className="px-4 pb-3 border-t pt-3">
                              <p className="text-xs text-muted-foreground font-medium mb-1">
                                Your initial message
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {inquiry.message}
                              </p>
                            </div>
                          )}

                          {/* Conversation thread */}
                          {thread.length > 0 && (
                            <div className="border-t">
                              <div className="px-4 py-2 bg-muted/40">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                  Conversation
                                </p>
                              </div>
                              <div className="divide-y">
                                {thread.map((msg, idx) => (
                                  <div
                                    key={idx}
                                    className={`px-4 py-3 flex gap-3 ${
                                      msg.senderRole === 'admin'
                                        ? 'bg-blue-50 dark:bg-blue-950/20'
                                        : 'bg-background'
                                    }`}
                                  >
                                    <div
                                      className={`flex-shrink-0 h-7 w-7 rounded-full flex items-center justify-center text-white text-xs ${
                                        msg.senderRole === 'admin'
                                          ? 'bg-blue-600'
                                          : 'bg-primary'
                                      }`}
                                    >
                                      {msg.senderRole === 'admin' ? (
                                        <ShieldCheck className="h-3.5 w-3.5" />
                                      ) : (
                                        <User className="h-3.5 w-3.5" />
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-semibold capitalize">
                                          {msg.senderRole === 'admin'
                                            ? 'Admin'
                                            : 'You'}
                                        </span>
                                        {msg.sentAt && (
                                          <span className="text-xs text-muted-foreground">
                                            {formatDate(msg.sentAt as any)}
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-sm whitespace-pre-wrap">
                                        {msg.text}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Buyer reply form — shown when the last message is from admin */}
                          {canReply && (
                            <div className="border-t px-4 py-3 bg-muted/20">
                              <p className="text-xs font-semibold text-muted-foreground mb-2">
                                Reply to Admin
                              </p>
                              <Textarea
                                placeholder="Write your reply..."
                                value={replyValue}
                                onChange={e =>
                                  setReplyText(prev => ({
                                    ...prev,
                                    [inquiry.id]: e.target.value,
                                  }))
                                }
                                className="min-h-[72px] resize-none mb-2 text-sm"
                              />
                              <Button
                                size="sm"
                                className="gap-2"
                                disabled={
                                  !replyValue.trim() || sendReply.isPending
                                }
                                onClick={() =>
                                  sendReply.mutate({
                                    id: inquiry.id,
                                    reply: replyValue,
                                  })
                                }
                              >
                                {sendReply.isPending ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <Send className="h-3.5 w-3.5" />
                                )}
                                Send Reply
                              </Button>
                            </div>
                          )}
                        </div>
                      );
                    })}
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
                        Browse Properties <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        {/* <div className="mt-8">
          <Card>
            <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
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
                    <Button variant="outline" className="w-full justify-between">
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
        </div> */}
      </div>
    </div>
  );
}
