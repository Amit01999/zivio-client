import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Building2, MessageSquare, Send, Users, Loader2, Bell, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { API_URL } from "@/lib/api";
import { AdminSellerDetail } from "./AdminSellerDetail";
import type { SafeUser, Listing } from "@/types/schema";

interface SellerWithStats extends SafeUser {
  totalListings: number;
  activeListings: number;
  totalInquiries: number;
  unreadMessages: number;
}

interface SellerProperty extends Listing {}

export function AdminSellers() {
  const { toast } = useToast();
  const [notifyTarget, setNotifyTarget] = useState<SellerWithStats | null>(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [messageText, setMessageText] = useState("");
  const [detailSellerId, setDetailSellerId] = useState<string | null>(null);
  const [detailSellerName, setDetailSellerName] = useState<string>("");

  const { data: sellersData, isLoading } = useQuery<{ data: SellerWithStats[] }>({
    queryKey: ["/api/admin/sellers/stats"],
    queryFn: async () => {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_URL}/api/admin/sellers/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch sellers");
      return res.json();
    },
  });

  const { data: sellerListings } = useQuery<{ data: SellerProperty[] }>({
    queryKey: ["/api/admin/listings", "seller", notifyTarget?.id],
    queryFn: async () => {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_URL}/api/admin/listings?limit=200`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch listings");
      const result = await res.json();
      return {
        data: (result.data ?? []).filter(
          (l: SellerProperty) => l.postedBy === notifyTarget?.id
        ),
      };
    },
    enabled: !!notifyTarget,
  });

  const sendMessage = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_URL}/api/admin/seller-messages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sellerId: notifyTarget!.id,
          propertyId: selectedPropertyId,
          message: messageText.trim(),
        }),
      });
      if (!res.ok) throw new Error("Failed to send message");
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Message sent", description: `Seller ${notifyTarget?.name} has been notified.` });
      setNotifyTarget(null);
      setSelectedPropertyId("");
      setMessageText("");
      queryClient.invalidateQueries({ queryKey: ["/api/admin/sellers/stats"], exact: false });
    },
    onError: () => {
      toast({ title: "Failed to send message", variant: "destructive" });
    },
  });

  const openNotify = (e: React.MouseEvent, seller: SellerWithStats) => {
    e.stopPropagation();
    setNotifyTarget(seller);
    setSelectedPropertyId("");
    setMessageText("");
  };

  const openDetail = (seller: SellerWithStats) => {
    setDetailSellerId(seller.id);
    setDetailSellerName(seller.name);
  };

  const sellers = sellersData?.data ?? [];

  // Show detail page when a seller is selected
  if (detailSellerId) {
    return (
      <AdminSellerDetail
        sellerId={detailSellerId}
        sellerName={detailSellerName}
        onBack={() => setDetailSellerId(null)}
      />
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Seller Management
          </CardTitle>
          <CardDescription>
            Click on a seller to view their profile, properties, and send direct messages
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : sellers.length === 0 ? (
            <div className="py-12 text-center">
              <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground opacity-40" />
              <p className="text-muted-foreground">No sellers registered yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sellers.map((seller) => (
                <div
                  key={seller.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-lg border p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => openDetail(seller)}
                >
                  {/* Avatar + identity */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarImage src={seller.profilePhotoUrl || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {seller.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{seller.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{seller.email}</p>
                      {seller.phone && (
                        <p className="text-xs text-muted-foreground">{seller.phone}</p>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 flex-wrap text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      <span>{seller.totalListings} listings</span>
                      <span className="text-green-600 font-medium">({seller.activeListings} active)</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <MessageSquare className="h-4 w-4" />
                      <span>{seller.totalInquiries} inquiries</span>
                    </div>
                    {seller.unreadMessages > 0 && (
                      <Badge variant="default" className="gap-1">
                        <Bell className="h-3 w-3" />
                        {seller.unreadMessages} unread
                      </Badge>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2"
                      onClick={(e) => openNotify(e, seller)}
                    >
                      <Send className="h-3.5 w-3.5" />
                      Quick Notify
                    </Button>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Notify Seller Dialog */}
      <Dialog open={!!notifyTarget} onOpenChange={(open) => !open && setNotifyTarget(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Quick Notify Seller</DialogTitle>
            <DialogDescription>
              Send a one-time notification to <strong>{notifyTarget?.name}</strong>.
              For an ongoing conversation, open the seller detail page instead.
              The seller will NOT see any buyer personal details.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Select Property</Label>
              <Select value={selectedPropertyId} onValueChange={setSelectedPropertyId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a property..." />
                </SelectTrigger>
                <SelectContent>
                  {(sellerListings?.data ?? []).map((listing) => (
                    <SelectItem key={listing.id} value={listing.id}>
                      {listing.title} — {listing.city}
                    </SelectItem>
                  ))}
                  {(sellerListings?.data ?? []).length === 0 && (
                    <SelectItem value="_none" disabled>
                      No listings found for this seller
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Message to Seller</Label>
              <Textarea
                placeholder="e.g. A buyer has expressed interest in this property. Please prepare for next steps."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="min-h-[100px] resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground font-medium">Quick templates:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "A buyer is interested in this property. Please prepare for next steps.",
                  "This property has received a viewing request. Please ensure it's available for showing.",
                  "A serious buyer has inquired about this property. Admin will coordinate the next steps.",
                ].map((tpl) => (
                  <button
                    key={tpl}
                    type="button"
                    className="text-xs border rounded px-2 py-1 hover:bg-muted transition-colors text-left"
                    onClick={() => setMessageText(tpl)}
                  >
                    {tpl.slice(0, 50)}…
                  </button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setNotifyTarget(null)}>
              Cancel
            </Button>
            <Button
              className="gap-2"
              disabled={
                !selectedPropertyId ||
                selectedPropertyId === "_none" ||
                !messageText.trim() ||
                sendMessage.isPending
              }
              onClick={() => sendMessage.mutate()}
            >
              {sendMessage.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Send Notification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
