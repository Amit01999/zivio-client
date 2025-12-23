import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Users,
  Building2,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  DollarSign,
  Eye,
  Shield,
  Search,
  Edit,
  Trash2,
  Star,
  StarOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { SafeUser, Listing, Broker, PaginatedResponse } from "@/types/schema";
import { formatPrice, formatDate } from "@/lib/format";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { API_URL } from '@/lib/api';

function AdminContent() {
  const { toast } = useToast();
  const [listingFilter, setListingFilter] = useState<string>("pending");
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [deletingListing, setDeletingListing] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<SafeUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<string | null>(null);

  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ["/api/admin/stats"],
    queryFn: async () => {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_URL}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch");
      return response.json();
    },
  });

  const { data: users, isLoading: loadingUsers } = useQuery<{ data: SafeUser[] }>({
    queryKey: ["/api/admin/users"],
    queryFn: async () => {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch");
      return response.json();
    },
  });

  const { data: pendingListings, isLoading: loadingListings } = useQuery<
    PaginatedResponse<Listing>
  >({
    queryKey: ["/api/admin/listings", listingFilter],
    queryFn: async () => {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `/api/admin/listings?status=${listingFilter}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch");
      return response.json();
    },
  });

  const { data: brokers, isLoading: loadingBrokers } = useQuery<{
    data: (Broker & { user: SafeUser })[];
  }>({
    queryKey: ["/api/admin/brokers"],
    queryFn: async () => {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_URL}/admin/brokers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch");
      return response.json();
    },
  });

  const approveListing = useMutation({
    mutationFn: async (listingId: string) => {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_URL}/admin/listings/${listingId}/approve`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to approve");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Listing approved successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/listings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
    },
    onError: () => {
      toast({ title: "Failed to approve listing", variant: "destructive" });
    },
  });

  const rejectListing = useMutation({
    mutationFn: async (listingId: string) => {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_URL}/admin/listings/${listingId}/reject`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to reject");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Listing rejected successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/listings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
    },
    onError: () => {
      toast({ title: "Failed to reject listing", variant: "destructive" });
    },
  });

  const toggleFeatured = useMutation({
    mutationFn: async (listingId: string) => {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_URL}/admin/listings/${listingId}/toggle-featured`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to toggle featured");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Featured status updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/listings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/listings"] });
    },
    onError: () => {
      toast({ title: "Failed to update featured status", variant: "destructive" });
    },
  });

  const deleteListingMutation = useMutation({
    mutationFn: async (listingId: string) => {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_URL}/admin/listings/${listingId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to delete");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Listing deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/listings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      setDeletingListing(null);
    },
    onError: () => {
      toast({ title: "Failed to delete listing", variant: "destructive" });
    },
  });

  const updateListingMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Listing> }) => {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_URL}/admin/listings/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Listing updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/listings"] });
      setEditingListing(null);
    },
    onError: () => {
      toast({ title: "Failed to update listing", variant: "destructive" });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<SafeUser> }) => {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_URL}/admin/users/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "User updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setSelectedUser(null);
    },
    onError: () => {
      toast({ title: "Failed to update user", variant: "destructive" });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_URL}/admin/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to delete");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "User deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      setDeletingUser(null);
    },
    onError: () => {
      toast({ title: "Failed to delete user", variant: "destructive" });
    },
  });

  const verifyBroker = useMutation({
    mutationFn: async (brokerId: string) => {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_URL}/admin/brokers/${brokerId}/verify`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to verify");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Broker verified successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/brokers"] });
    },
    onError: () => {
      toast({ title: "Failed to verify broker", variant: "destructive" });
    },
  });

  const handleEditListing = (listing: Listing) => {
    setEditingListing(listing);
  };

  const handleSaveListing = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingListing) return;

    const formData = new FormData(e.currentTarget);
    const updates: Partial<Listing> = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      price: Number(formData.get("price")),
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      bedrooms: Number(formData.get("bedrooms")) || undefined,
      bathrooms: Number(formData.get("bathrooms")) || undefined,
      areaSqFt: Number(formData.get("areaSqFt")) || undefined,
    };

    updateListingMutation.mutate({ id: editingListing.id, data: updates });
  };

  const handleEditUser = (user: SafeUser) => {
    setSelectedUser(user);
  };

  const handleSaveUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedUser) return;

    const formData = new FormData(e.currentTarget);
    const updates: Partial<SafeUser> = {
      role: formData.get("role") as any,
      verified: formData.get("verified") === "true",
    };

    updateUserMutation.mutate({ id: selectedUser.id, data: updates });
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      change: "+12%",
    },
    {
      title: "Total Listings",
      value: stats?.totalListings || 0,
      icon: Building2,
      change: "+8%",
    },
    {
      title: "Pending Review",
      value: stats?.pendingListings || 0,
      icon: Clock,
      change: "-5%",
    },
    {
      title: "Total Revenue",
      value: formatPrice(stats?.totalRevenue || 0, true),
      icon: DollarSign,
      change: "+22%",
    },
  ];

  return (
    <div className="bg-muted/30 py-8">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage users, listings, and platform settings
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {loadingStats
            ? Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))
            : statCards.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Card key={stat.title}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {stat.title}
                          </p>
                          <p className="font-heading text-2xl font-bold">
                            {stat.value}
                          </p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <div className="mt-2 flex items-center text-sm">
                        <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                        <span className="text-green-500">{stat.change}</span>
                        <span className="ml-1 text-muted-foreground">
                          from last month
                        </span>
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
              Listings
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="brokers" className="gap-2">
              <Shield className="h-4 w-4" />
              Brokers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="listings">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Property Management</CardTitle>
                  <CardDescription>
                    View, edit, and moderate all property listings
                  </CardDescription>
                </div>
                <Select value={listingFilter} onValueChange={setListingFilter}>
                  <SelectTrigger className="w-40" data-testid="select-listing-filter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="all">All</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                {loadingListings ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : pendingListings?.data && pendingListings.data.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Property</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingListings.data.map((listing) => (
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
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant={
                                    listing.status === "pending"
                                      ? "outline"
                                      : listing.status === "published"
                                      ? "default"
                                      : "destructive"
                                  }
                                >
                                  {listing.status}
                                </Badge>
                                {listing.isFeatured && (
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1 flex-wrap">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setSelectedListing(listing)}
                                  title="View Details"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleEditListing(listing)}
                                  title="Edit"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => toggleFeatured.mutate(listing.id)}
                                  title={listing.isFeatured ? "Remove from Featured" : "Mark as Featured"}
                                  className={listing.isFeatured ? "text-yellow-600 hover:text-yellow-700" : "hover:text-yellow-600"}
                                >
                                  {listing.isFeatured ? (
                                    <StarOff className="h-4 w-4" />
                                  ) : (
                                    <Star className="h-4 w-4" />
                                  )}
                                </Button>
                                {listing.status === "pending" && (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="text-green-600"
                                      onClick={() => approveListing.mutate(listing.id)}
                                      title="Approve"
                                    >
                                      <CheckCircle className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="text-red-600"
                                      onClick={() => rejectListing.mutate(listing.id)}
                                      title="Reject"
                                    >
                                      <XCircle className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-red-600"
                                  onClick={() => setDeletingListing(listing.id)}
                                  title="Delete"
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
                    <p className="text-muted-foreground">
                      No {listingFilter !== "all" ? listingFilter : ""} listings found
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View and manage platform users</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingUsers ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : users?.data && users.data.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Joined</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.data.map((u) => (
                          <TableRow key={u.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={u.profilePhotoUrl || undefined} />
                                  <AvatarFallback>
                                    {u.name?.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{u.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>{u.email}</TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="capitalize">
                                {u.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={u.verified ? "default" : "outline"}>
                                {u.verified ? "Verified" : "Unverified"}
                              </Badge>
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {u.createdAt && formatDate(u.createdAt)}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleEditUser(u)}
                                  title="Edit User"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-red-600"
                                  onClick={() => setDeletingUser(u.id)}
                                  title="Delete User"
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
                  <div className="py-12 text-center text-muted-foreground">
                    No users found
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="brokers">
            <Card>
              <CardHeader>
                <CardTitle>Broker Verification</CardTitle>
                <CardDescription>
                  Review and verify broker applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingBrokers ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : brokers?.data && brokers.data.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Broker</TableHead>
                          <TableHead>Agency</TableHead>
                          <TableHead>License No</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {brokers.data.map((broker) => (
                          <TableRow key={broker.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage
                                    src={broker.user?.profilePhotoUrl || undefined}
                                  />
                                  <AvatarFallback>
                                    {broker.user?.name?.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{broker.user?.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {broker.user?.email}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{broker.agencyName || "-"}</TableCell>
                            <TableCell>{broker.licenseNo || "-"}</TableCell>
                            <TableCell>
                              <Badge variant={broker.verified ? "default" : "outline"}>
                                {broker.verified ? "Verified" : "Pending"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              {!broker.verified && (
                                <Button
                                  size="sm"
                                  onClick={() => verifyBroker.mutate(broker.id)}
                                  data-testid={`button-verify-broker-${broker.id}`}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Verify
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="py-12 text-center text-muted-foreground">
                    No broker applications
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* View Listing Dialog */}
      <Dialog open={!!selectedListing} onOpenChange={() => setSelectedListing(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Listing Details</DialogTitle>
            <DialogDescription>View complete property information</DialogDescription>
          </DialogHeader>
          {selectedListing && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{selectedListing.title}</h3>
                <p className="text-2xl font-bold text-primary">
                  {formatPrice(selectedListing.price)}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Type:</span>
                  <p className="font-medium capitalize">{selectedListing.propertyType}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Listing Type:</span>
                  <p className="font-medium capitalize">{selectedListing.listingType}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Location:</span>
                  <p className="font-medium">{selectedListing.city}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Address:</span>
                  <p className="font-medium">{selectedListing.address}</p>
                </div>
                {selectedListing.bedrooms && (
                  <div>
                    <span className="text-muted-foreground">Bedrooms:</span>
                    <p className="font-medium">{selectedListing.bedrooms}</p>
                  </div>
                )}
                {selectedListing.bathrooms && (
                  <div>
                    <span className="text-muted-foreground">Bathrooms:</span>
                    <p className="font-medium">{selectedListing.bathrooms}</p>
                  </div>
                )}
                {selectedListing.areaSqFt && (
                  <div>
                    <span className="text-muted-foreground">Area:</span>
                    <p className="font-medium">{selectedListing.areaSqFt} sq ft</p>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <Badge className="ml-2" variant={selectedListing.status === "published" ? "default" : "outline"}>
                    {selectedListing.status}
                  </Badge>
                </div>
              </div>
              {selectedListing.description && (
                <div>
                  <span className="text-muted-foreground">Description:</span>
                  <p className="mt-1">{selectedListing.description}</p>
                </div>
              )}
              {selectedListing.images && selectedListing.images.length > 0 && (
                <div>
                  <span className="text-muted-foreground">Images:</span>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {selectedListing.images.slice(0, 4).map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Property ${idx + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Listing Dialog */}
      <Dialog open={!!editingListing} onOpenChange={() => setEditingListing(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Listing</DialogTitle>
            <DialogDescription>Update property information</DialogDescription>
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
                  defaultValue={editingListing.description || ""}
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    defaultValue={editingListing.price}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="areaSqFt">Area (sq ft)</Label>
                  <Input
                    id="areaSqFt"
                    name="areaSqFt"
                    type="number"
                    defaultValue={editingListing.areaSqFt || ""}
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
                    defaultValue={editingListing.bedrooms || ""}
                  />
                </div>
                <div>
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    name="bathrooms"
                    type="number"
                    defaultValue={editingListing.bathrooms || ""}
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
                <Button type="button" variant="outline" onClick={() => setEditingListing(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateListingMutation.isPending}>
                  {updateListingMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Listing Confirmation */}
      <AlertDialog open={!!deletingListing} onOpenChange={() => setDeletingListing(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this listing. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingListing && deleteListingMutation.mutate(deletingListing)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit User Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user role and verification status</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <Label>User</Label>
                <p className="text-sm font-medium">{selectedUser.name}</p>
                <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select name="role" defaultValue={selectedUser.role}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buyer">Buyer</SelectItem>
                    <SelectItem value="seller">Seller</SelectItem>
                    <SelectItem value="broker">Broker</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="verified">Verification Status</Label>
                <Select name="verified" defaultValue={selectedUser.verified ? "true" : "false"}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Verified</SelectItem>
                    <SelectItem value="false">Unverified</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setSelectedUser(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateUserMutation.isPending}>
                  {updateUserMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete User Confirmation */}
      <AlertDialog open={!!deletingUser} onOpenChange={() => setDeletingUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this user and all associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingUser && deleteUserMutation.mutate(deletingUser)}
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

export default function Admin() {
  return (
    <ProtectedRoute requiredRole={["admin"]}>
      <AdminContent />
    </ProtectedRoute>
  );
}
