import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  ArrowLeft,
  Building2,
  MessageSquare,
  ShieldCheck,
  User,
  Send,
  Loader2,
  Phone,
  Mail,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { formatDate, formatRelativeTime } from "@/lib/format";
import { API_URL } from "@/lib/api";
import type { AdminSellerMessage, AdminSellerMessageThread, SellerFullProfile } from "@/types/schema";

type ConversationDoc = AdminSellerMessage & {
  property?: { id: string; title: string; city: string; images?: string[] };
};

interface FlatMessage {
  key: string;
  senderRole: "admin" | "seller";
  text: string;
  sentAt: Date | string | null | undefined;
}

function buildTimeline(docs: ConversationDoc[]): FlatMessage[] {
  const out: FlatMessage[] = [];
  for (const doc of docs) {
    out.push({ key: `${doc.id}-init`, senderRole: "admin", text: doc.message, sentAt: doc.createdAt });
    for (let i = 0; i < (doc.thread ?? []).length; i++) {
      const t = doc.thread![i];
      out.push({ key: `${doc.id}-t${i}`, senderRole: t.senderRole, text: t.text, sentAt: t.sentAt });
    }
  }
  return out;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; Icon: React.ComponentType<{ className?: string }> }> = {
  pending:   { label: "Pending",   color: "text-yellow-500", Icon: Clock },
  published: { label: "Published", color: "text-green-600",  Icon: CheckCircle },
  rejected:  { label: "Rejected",  color: "text-red-500",    Icon: XCircle },
  sold:      { label: "Sold",      color: "text-gray-500",   Icon: CheckCircle },
  rented:    { label: "Rented",    color: "text-gray-500",   Icon: CheckCircle },
};

interface Props {
  sellerId: string;
  sellerName?: string;
  onBack: () => void;
}

export function AdminSellerDetail({ sellerId, sellerName, onBack }: Props) {
  const { toast } = useToast();
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [draftText, setDraftText] = useState("");
  const timelineEndRef = useRef<HTMLDivElement>(null);

  // Seller profile + listings
  const { data: seller, isLoading: sellerLoading } = useQuery<SellerFullProfile>({
    queryKey: ["/api/admin/sellers", sellerId, "details"],
    queryFn: async () => {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_URL}/api/admin/sellers/${sellerId}/details`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  // All conversations for this seller
  const { data: conversationsData, isLoading: convsLoading } = useQuery<{ data: ConversationDoc[] }>({
    queryKey: ["/api/admin/sellers", sellerId, "conversations"],
    queryFn: async () => {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_URL}/api/admin/sellers/${sellerId}/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    refetchInterval: 15000,
    staleTime: 0,
  });

  const allConversations = conversationsData?.data ?? [];
  const propertyDocs = selectedPropertyId
    ? allConversations.filter((c) => c.propertyId === selectedPropertyId)
    : [];
  const timeline = buildTimeline(propertyDocs);
  const selectedProperty = seller?.listings.find((l) => l.id === selectedPropertyId);

  // Scroll to bottom when timeline updates
  useEffect(() => {
    timelineEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [timeline.length]);

  // Send new message (creates new AdminSellerMessage doc)
  const sendNew = useMutation({
    mutationFn: async (text: string) => {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_URL}/api/admin/seller-messages`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ sellerId, propertyId: selectedPropertyId, message: text }),
      });
      if (!res.ok) throw new Error("Failed to send");
      return res.json();
    },
    onSuccess: () => {
      setDraftText("");
      queryClient.invalidateQueries({ queryKey: ["/api/admin/sellers", sellerId, "conversations"] });
    },
    onError: () => toast({ title: "Failed to send message", variant: "destructive" }),
  });

  // Reply to the latest existing message's thread
  const replyThread = useMutation({
    mutationFn: async ({ messageId, text }: { messageId: string; text: string }) => {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_URL}/api/admin/seller-messages/${messageId}/reply`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("Failed to send");
      return res.json();
    },
    onSuccess: () => {
      setDraftText("");
      queryClient.invalidateQueries({ queryKey: ["/api/admin/sellers", sellerId, "conversations"] });
    },
    onError: () => toast({ title: "Failed to send reply", variant: "destructive" }),
  });

  const handleSend = () => {
    const text = draftText.trim();
    if (!text || !selectedPropertyId) return;
    // If conversation already exists, reply to the latest doc's thread
    if (propertyDocs.length > 0) {
      const latestDoc = propertyDocs[propertyDocs.length - 1];
      replyThread.mutate({ messageId: latestDoc.id, text });
    } else {
      sendNew.mutate(text);
    }
  };

  const isSending = sendNew.isPending || replyThread.isPending;

  const msgCountForProperty = (propertyId: string) =>
    allConversations.filter((c) => c.propertyId === propertyId).length;

  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" onClick={onBack} className="gap-2 -ml-1">
        <ArrowLeft className="h-4 w-4" />
        Back to Sellers
      </Button>

      {/* 3-column grid */}
      <div className="grid gap-4 lg:grid-cols-[260px_1fr_1fr] items-start">

        {/* ── LEFT: Seller Profile ── */}
        <Card>
          <CardContent className="p-4 space-y-4">
            {sellerLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-16 w-16 rounded-full mx-auto" />
                <Skeleton className="h-4 w-3/4 mx-auto" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-full" />
              </div>
            ) : seller ? (
              <>
                <div className="flex flex-col items-center text-center gap-2 pt-2">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={seller.profilePhotoUrl || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                      {seller.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-base leading-tight">{seller.name}</p>
                    <Badge variant="secondary" className="mt-1 text-xs">Seller</Badge>
                  </div>
                </div>

                <div className="space-y-1.5 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="truncate">{seller.email}</span>
                  </div>
                  {seller.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                      <span>{seller.phone}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 border-t pt-3">
                  {[
                    { label: "Listings",  value: seller.totalListings,  color: "" },
                    { label: "Active",    value: seller.activeListings,  color: "text-green-600" },
                    { label: "Inquiries", value: seller.totalInquiries,  color: "" },
                    { label: "Unread",    value: seller.unreadMessages,  color: seller.unreadMessages > 0 ? "text-primary font-bold" : "" },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="text-center">
                      <p className={`text-2xl font-bold ${color}`}>{value}</p>
                      <p className="text-xs text-muted-foreground">{label}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">Seller not found</p>
            )}
          </CardContent>
        </Card>

        {/* ── MIDDLE: Properties ── */}
        <Card>
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Properties ({seller?.listings.length ?? 0})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {sellerLoading ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (seller?.listings ?? []).length === 0 ? (
              <div className="py-10 text-center">
                <Building2 className="mx-auto h-8 w-8 text-muted-foreground opacity-30 mb-2" />
                <p className="text-sm text-muted-foreground">No listings yet</p>
              </div>
            ) : (
              <div className="divide-y max-h-[520px] overflow-y-auto">
                {(seller?.listings ?? []).map((listing) => {
                  const isSelected = selectedPropertyId === listing.id;
                  const cfg = STATUS_CONFIG[listing.status] ?? STATUS_CONFIG.pending;
                  const StatusIcon = cfg.Icon;
                  const msgCount = msgCountForProperty(listing.id);
                  return (
                    <button
                      key={listing.id}
                      type="button"
                      onClick={() => setSelectedPropertyId(isSelected ? null : listing.id)}
                      className={`w-full flex items-start gap-3 p-3 text-left transition-colors ${
                        isSelected
                          ? "bg-primary/10 border-l-2 border-primary"
                          : "hover:bg-muted/50 border-l-2 border-transparent"
                      }`}
                    >
                      {listing.images?.[0] && (
                        <div className="h-12 w-16 flex-shrink-0 overflow-hidden rounded bg-muted">
                          <img
                            src={listing.images[0]}
                            alt={listing.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium line-clamp-1">{listing.title}</p>
                        <p className="text-xs text-muted-foreground">{listing.city}</p>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          <span className={`flex items-center gap-1 text-xs ${cfg.color}`}>
                            <StatusIcon className="h-3 w-3" />
                            {cfg.label}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {listing.inquiryCount}
                          </span>
                          {msgCount > 0 && (
                            <Badge variant="outline" className="text-xs py-0 px-1.5 h-4">
                              {msgCount} msg{msgCount !== 1 ? "s" : ""}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── RIGHT: Conversation ── */}
        <Card className="flex flex-col">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              {selectedProperty
                ? `Chat — ${selectedProperty.title}`
                : "Select a property to start chatting"}
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col gap-3 p-4 flex-1">
            {!selectedPropertyId ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground opacity-25 mb-3" />
                <p className="text-sm text-muted-foreground max-w-[200px]">
                  Select a property from the middle panel to view and send messages to{" "}
                  {sellerName ?? "this seller"}
                </p>
              </div>
            ) : (
              <>
                {/* Timeline */}
                <div className="flex flex-col gap-3 min-h-0 max-h-80 overflow-y-auto pr-1">
                  {convsLoading && (
                    <div className="space-y-2">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                      ))}
                    </div>
                  )}
                  {!convsLoading && timeline.length === 0 && (
                    <div className="py-6 text-center">
                      <p className="text-sm text-muted-foreground">
                        No messages yet for this property. Send the first message below.
                      </p>
                    </div>
                  )}
                  {timeline.map((msg) => {
                    const isAdmin = msg.senderRole === "admin";
                    return (
                      <div
                        key={msg.key}
                        className={`flex gap-2 ${isAdmin ? "" : "flex-row-reverse"}`}
                      >
                        <div
                          className={`flex-shrink-0 h-7 w-7 rounded-full flex items-center justify-center text-white ${
                            isAdmin ? "bg-blue-600" : "bg-emerald-600"
                          }`}
                        >
                          {isAdmin ? (
                            <ShieldCheck className="h-3.5 w-3.5" />
                          ) : (
                            <User className="h-3.5 w-3.5" />
                          )}
                        </div>
                        <div
                          className={`max-w-[78%] rounded-xl px-3 py-2 ${
                            isAdmin
                              ? "bg-blue-50 dark:bg-blue-950/30 rounded-tl-sm"
                              : "bg-emerald-50 dark:bg-emerald-950/30 rounded-tr-sm"
                          }`}
                        >
                          <p className="text-xs font-semibold mb-0.5">
                            {isAdmin ? "You (Admin)" : seller?.name ?? "Seller"}
                          </p>
                          <p className="text-sm whitespace-pre-wrap break-words">{msg.text}</p>
                          {msg.sentAt && (
                            <p className="text-[10px] text-muted-foreground mt-1">
                              {formatRelativeTime(msg.sentAt as string)}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={timelineEndRef} />
                </div>

                {/* Compose */}
                <div className="border-t pt-3 space-y-2">
                  <Textarea
                    placeholder={`Message ${seller?.name ?? "seller"} about this property…`}
                    value={draftText}
                    onChange={(e) => setDraftText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleSend();
                    }}
                    className="min-h-[72px] resize-none text-sm"
                  />
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs text-muted-foreground">Ctrl+Enter to send</p>
                    <Button
                      size="sm"
                      className="gap-2"
                      disabled={!draftText.trim() || isSending}
                      onClick={handleSend}
                    >
                      {isSending ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Send className="h-3.5 w-3.5" />
                      )}
                      Send
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
