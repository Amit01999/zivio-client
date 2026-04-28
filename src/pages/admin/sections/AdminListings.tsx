import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Star,
  StarOff,
  Eye,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { API_URL } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import type { Listing, PaginatedResponse } from "@/types/schema";

export function AdminListings() {
  const { toast } = useToast();
  const [listingFilter, setListingFilter] = useState("pending");
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [deletingListing, setDeletingListing] = useState<string | null>(null);

  const { data: pendingListings, isLoading: loadingListings } = useQuery<PaginatedResponse<Listing>>({
    queryKey: ["/api/admin/listings", listingFilter],
    queryFn: async () => {
      const token = localStorage.getItem("accessToken");
      const params = new URLSearchParams();
      if (listingFilter !== "all") params.set("status", listingFilter);
      const response = await fetch(`${API_URL}/api/admin/listings?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch");
      return response.json();
    },
  });

  const approveListing = useMutation({
    mutationFn: async (listingId: string) => {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_URL}/api/admin/listings/${listingId}/approve`, {
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
      const response = await fetch(`${API_URL}/api/admin/listings/${listingId}/reject`, {
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
      const response = await fetch(`${API_URL}/api/admin/listings/${listingId}/toggle-featured`, {
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
      const response = await fetch(`${API_URL}/api/admin/listings/${listingId}`, {
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
      const response = await fetch(`${API_URL}/api/admin/listings/${id}`, {
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

  const handleEditListing = (listing: Listing) => setEditingListing(listing);

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

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Property Management</CardTitle>
            <CardDescription>View, edit, and moderate all property listings</CardDescription>
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
                            <p className="font-medium line-clamp-1">{listing.title}</p>
                            <p className="text-sm text-muted-foreground">{listing.propertyType}</p>
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
                            className={
                              listing.isFeatured
                                ? "text-yellow-600 hover:text-yellow-700"
                                : "hover:text-yellow-600"
                            }
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
                  <Badge
                    className="ml-2"
                    variant={selectedListing.status === "published" ? "default" : "outline"}
                  >
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
                <Input id="title" name="title" defaultValue={editingListing.title} required />
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
                  <Input id="city" name="city" defaultValue={editingListing.city} required />
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
    </>
  );
}
