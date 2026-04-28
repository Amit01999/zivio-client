import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { MessageSquare, ChevronDown, ChevronUp, Phone, Mail, Calendar, Send, ShieldCheck, User, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { API_URL } from "@/lib/api";
import { formatDate } from "@/lib/format";
import type { PropertyInquiryWithDetails, InquiryMessage } from "@/types/schema";

const STATUS_BADGE: Record<string, "default" | "secondary" | "outline"> = {
  new: "default",
  contacted: "secondary",
  closed: "outline",
};

const TYPE_COLORS: Record<string, string> = {
  viewing: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  buy: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  meeting: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
};

function buildThread(inquiry: PropertyInquiryWithDetails): InquiryMessage[] {
  if (inquiry.messages && inquiry.messages.length > 0) return inquiry.messages;
  if (inquiry.adminReply) {
    return [{ senderRole: 'admin', text: inquiry.adminReply, sentAt: inquiry.adminReplyAt || inquiry.updatedAt || '' }];
  }
  return [];
}

export function AdminInquiries() {
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [sellerNotifyText, setSellerNotifyText] = useState<Record<string, string>>({});

  const { data: inquiriesData, isLoading } = useQuery<{
    data: PropertyInquiryWithDetails[];
    total: number;
  }>({
    queryKey: ["/api/admin/inquiries", statusFilter, typeFilter],
    queryFn: async () => {
      const token = localStorage.getItem("accessToken");
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (typeFilter !== "all") params.set("requestType", typeFilter);
      const response = await fetch(`${API_URL}/api/admin/inquiries?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch");
      return response.json();
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_URL}/api/property-inquiries/${id}/status`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error("Failed to update");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Inquiry status updated" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/inquiries"], exact: false });
    },
    onError: () => {
      toast({ title: "Failed to update status", variant: "destructive" });
    },
  });

  const sendReply = useMutation({
    mutationFn: async ({ id, reply }: { id: string; reply: string }) => {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_URL}/api/property-inquiries/${id}/reply`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reply }),
      });
      if (!response.ok) throw new Error("Failed to send reply");
      return response.json();
    },
    onSuccess: (_data, variables) => {
      toast({ title: "Reply sent", description: "The buyer will see your response." });
      setReplyText((prev) => ({ ...prev, [variables.id]: "" }));
      queryClient.invalidateQueries({ queryKey: ["/api/admin/inquiries"], exact: false });
    },
    onError: () => {
      toast({ title: "Failed to send reply", variant: "destructive" });
    },
  });

  const notifySeller = useMutation({
    mutationFn: async ({ inquiry, message }: { inquiry: PropertyInquiryWithDetails; message: string }) => {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_URL}/api/admin/seller-messages`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          sellerId: inquiry.property?.postedBy,
          propertyId: inquiry.propertyId,
          message,
          relatedInquiryId: inquiry.id,
        }),
      });
      if (!res.ok) throw new Error("Failed to notify seller");
      return res.json();
    },
    onSuccess: (_data, variables) => {
      toast({ title: "Seller notified", description: "The seller has been sent your message." });
      setSellerNotifyText((prev) => ({ ...prev, [variables.inquiry.id]: "" }));
    },
    onError: () => {
      toast({ title: "Failed to notify seller", variant: "destructive" });
    },
  });

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between flex-wrap gap-4">
        <div>
          <CardTitle>Inquiries Management</CardTitle>
          <CardDescription>
            View and manage all property inquiries from buyers
          </CardDescription>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="viewing">Viewing</SelectItem>
              <SelectItem value="buy">Buying</SelectItem>
              <SelectItem value="meeting">Meeting</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : inquiriesData?.data && inquiriesData.data.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Update</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {inquiriesData.data.map((inquiry) => (
                  <>
                    <TableRow
                      key={inquiry.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => toggleExpand(inquiry.id)}
                    >
                      {/* Property */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {inquiry.property?.images?.[0] && (
                            <div className="h-10 w-14 flex-shrink-0 overflow-hidden rounded bg-muted">
                              <img
                                src={inquiry.property.images[0]}
                                alt={inquiry.property.title}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="line-clamp-1 text-sm font-medium">
                              {inquiry.property?.title ?? "Property"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {inquiry.property?.city}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Buyer */}
                      <TableCell>
                        <p className="text-sm font-medium">{inquiry.buyer?.name ?? "—"}</p>
                        <p className="text-xs text-muted-foreground">{inquiry.buyer?.email}</p>
                        {inquiry.messages?.some((m) => m.senderRole === "buyer") && (
                          <span className="inline-flex items-center gap-1 mt-0.5 text-xs text-amber-600 dark:text-amber-400 font-medium">
                            <User className="h-3 w-3" /> Buyer replied
                          </span>
                        )}
                      </TableCell>

                      {/* Type */}
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                            TYPE_COLORS[inquiry.requestType] ?? ""
                          }`}
                        >
                          {inquiry.requestType}
                        </span>
                      </TableCell>

                      {/* Date */}
                      <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                        {inquiry.createdAt ? formatDate(inquiry.createdAt) : "—"}
                      </TableCell>

                      {/* Current status badge */}
                      <TableCell>
                        <Badge
                          variant={STATUS_BADGE[inquiry.status] ?? "outline"}
                          className="capitalize"
                        >
                          {inquiry.status}
                        </Badge>
                      </TableCell>

                      {/* Update status select */}
                      <TableCell
                        className="text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Select
                          value={inquiry.status}
                          onValueChange={(val) =>
                            updateStatus.mutate({ id: inquiry.id, status: val })
                          }
                          disabled={updateStatus.isPending}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="contacted">Contacted</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>

                      {/* Expand toggle */}
                      <TableCell>
                        {expandedId === inquiry.id ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </TableCell>
                    </TableRow>

                    {/* Expanded detail panel */}
                    {expandedId === inquiry.id && (
                      <TableRow key={`${inquiry.id}-detail`}>
                        <TableCell colSpan={7} className="bg-muted/30 p-0">
                          <div className="p-4 space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                              {/* Buyer contact info */}
                              <div className="space-y-1">
                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                  Buyer Contact
                                </p>
                                <div className="flex items-center gap-2 text-sm">
                                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                                  <span>{inquiry.buyer?.email ?? "—"}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                                  <span>{inquiry.buyer?.phone ?? "Not provided"}</span>
                                </div>
                              </div>

                              {/* Preferred schedule (viewing only) */}
                              {inquiry.requestType === "viewing" && (
                                <div className="space-y-1">
                                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    Preferred Schedule
                                  </p>
                                  <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                    <span>
                                      {inquiry.metadata?.preferredDate
                                        ? formatDate(inquiry.metadata.preferredDate as any)
                                        : "Not specified"}
                                    </span>
                                  </div>
                                  {inquiry.metadata?.preferredTime && (
                                    <p className="text-sm pl-5">{inquiry.metadata.preferredTime}</p>
                                  )}
                                </div>
                              )}

                              {/* Property info */}
                              <div className="space-y-1">
                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                  Property
                                </p>
                                <p className="text-sm font-medium">{inquiry.property?.title}</p>
                                <p className="text-xs text-muted-foreground">
                                  {inquiry.property?.address}, {inquiry.property?.city}
                                </p>
                              </div>
                            </div>

                            {/* Initial buyer message */}
                            {inquiry.message && (
                              <div className="space-y-1">
                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                  Initial Message
                                </p>
                                <p className="text-sm bg-background border rounded-md p-3 whitespace-pre-wrap">
                                  {inquiry.message}
                                </p>
                              </div>
                            )}

                            {/* Conversation thread */}
                            {(() => {
                              const thread = buildThread(inquiry);
                              return thread.length > 0 ? (
                                <div className="space-y-1">
                                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    Conversation
                                  </p>
                                  <div className="rounded-md border overflow-hidden divide-y">
                                    {thread.map((msg, idx) => (
                                      <div
                                        key={idx}
                                        className={`flex gap-3 p-3 ${
                                          msg.senderRole === "admin"
                                            ? "bg-blue-50 dark:bg-blue-950/20"
                                            : "bg-amber-50 dark:bg-amber-950/20"
                                        }`}
                                      >
                                        <div className={`flex-shrink-0 h-7 w-7 rounded-full flex items-center justify-center text-white ${
                                          msg.senderRole === "admin" ? "bg-blue-600" : "bg-amber-600"
                                        }`}>
                                          {msg.senderRole === "admin"
                                            ? <ShieldCheck className="h-3.5 w-3.5" />
                                            : <User className="h-3.5 w-3.5" />
                                          }
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-2 mb-0.5">
                                            <span className="text-xs font-semibold">
                                              {msg.senderRole === "admin" ? "You (Admin)" : "Buyer"}
                                            </span>
                                            {msg.sentAt && (
                                              <span className="text-xs text-muted-foreground">
                                                {formatDate(msg.sentAt as any)}
                                              </span>
                                            )}
                                          </div>
                                          <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ) : null;
                            })()}

                            {/* Admin reply form */}
                            <div className="space-y-2">
                              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Send Reply to Buyer
                              </p>
                              <Textarea
                                placeholder="Write your response to the buyer..."
                                value={replyText[inquiry.id] ?? ""}
                                onChange={(e) =>
                                  setReplyText((prev) => ({
                                    ...prev,
                                    [inquiry.id]: e.target.value,
                                  }))
                                }
                                className="min-h-[80px] resize-none"
                              />
                              <Button
                                size="sm"
                                className="gap-2"
                                disabled={!replyText[inquiry.id]?.trim() || sendReply.isPending}
                                onClick={() =>
                                  sendReply.mutate({
                                    id: inquiry.id,
                                    reply: replyText[inquiry.id] ?? "",
                                  })
                                }
                              >
                                <Send className="h-3.5 w-3.5" />
                                Send Reply
                              </Button>
                            </div>

                            {/* Notify seller about this inquiry */}
                            {inquiry.property?.postedBy && (
                              <div className="space-y-2 border-t pt-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                                  <Bell className="h-3.5 w-3.5" />
                                  Notify Property Seller
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Send a message to the seller about this buyer interest.
                                  The seller will <strong>not</strong> see any buyer contact details.
                                </p>
                                <Textarea
                                  placeholder="e.g. A buyer has shown interest in this property. Please prepare for next steps."
                                  value={sellerNotifyText[inquiry.id] ?? ""}
                                  onChange={(e) =>
                                    setSellerNotifyText((prev) => ({
                                      ...prev,
                                      [inquiry.id]: e.target.value,
                                    }))
                                  }
                                  className="min-h-[72px] resize-none"
                                />
                                <div className="flex gap-2 flex-wrap">
                                  {[
                                    "A buyer is interested in this property. Please prepare for next steps.",
                                    "This property has received a viewing request. Please ensure availability.",
                                    ...(inquiry.requestType === "viewing" && inquiry.metadata?.preferredDate
                                      ? [
                                          `A buyer has requested a viewing on ${formatDate(inquiry.metadata.preferredDate as any)}${inquiry.metadata.preferredTime ? ` at ${inquiry.metadata.preferredTime}` : ""}. Please ensure the property is accessible.`,
                                        ]
                                      : []),
                                  ].map((tpl) => (
                                    <button
                                      key={tpl}
                                      type="button"
                                      className="text-xs border rounded px-2 py-1 hover:bg-muted transition-colors text-left max-w-xs"
                                      onClick={() =>
                                        setSellerNotifyText((prev) => ({
                                          ...prev,
                                          [inquiry.id]: tpl,
                                        }))
                                      }
                                    >
                                      {tpl.slice(0, 55)}…
                                    </button>
                                  ))}
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-2"
                                  disabled={
                                    !sellerNotifyText[inquiry.id]?.trim() ||
                                    notifySeller.isPending
                                  }
                                  onClick={() =>
                                    notifySeller.mutate({
                                      inquiry,
                                      message: sellerNotifyText[inquiry.id] ?? "",
                                    })
                                  }
                                >
                                  <Bell className="h-3.5 w-3.5" />
                                  Notify Seller
                                </Button>
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="py-12 text-center">
            <MessageSquare className="mx-auto mb-4 h-12 w-12 text-muted-foreground opacity-40" />
            <p className="text-muted-foreground">
              No {statusFilter !== "all" ? statusFilter : ""} inquiries found
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
