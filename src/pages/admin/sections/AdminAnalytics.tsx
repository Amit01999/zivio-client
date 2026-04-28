import { useQuery } from "@tanstack/react-query";
import {
  Users,
  Building2,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  Eye,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { API_URL } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import type { PaginatedResponse, Listing, SafeUser } from "@/types/schema";

function StatRow({ label, value, icon: Icon, color }: { label: string; value: string | number; icon: React.ComponentType<{ className?: string }>; color: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0">
      <div className="flex items-center gap-3">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-muted ${color}`}>
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <span className="font-bold text-foreground">{value}</span>
    </div>
  );
}

export function AdminAnalytics() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/stats"],
    queryFn: async () => {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_URL}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch");
      return response.json();
    },
  });

  const { data: allListings, isLoading: listingsLoading } = useQuery<PaginatedResponse<Listing>>({
    queryKey: ["/api/admin/listings/analytics"],
    queryFn: async () => {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_URL}/api/admin/listings?limit=200`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch");
      return response.json();
    },
  });

  const { data: users, isLoading: usersLoading } = useQuery<{ data: SafeUser[] }>({
    queryKey: ["/api/admin/users", undefined],
    queryFn: async () => {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch");
      return response.json();
    },
  });

  const listings = allListings?.data ?? [];
  const usersData = users?.data ?? [];

  const byStatus = {
    published: listings.filter((l) => l.status === "published").length,
    pending: listings.filter((l) => l.status === "pending").length,
    rejected: listings.filter((l) => l.status === "rejected").length,
    sold: listings.filter((l) => l.status === "sold").length,
    rented: listings.filter((l) => l.status === "rented").length,
  };

  const byRole = {
    buyer: usersData.filter((u) => u.role === "buyer").length,
    seller: usersData.filter((u) => u.role === "seller").length,
    broker: usersData.filter((u) => u.role === "broker").length,
    admin: usersData.filter((u) => u.role === "admin").length,
  };

  const totalViews = listings.reduce((sum, l) => sum + (l.views || 0), 0);
  const featuredCount = listings.filter((l) => l.isFeatured).length;
  const verifiedCount = listings.filter((l) => l.isVerified).length;

  const isLoading = statsLoading || listingsLoading || usersLoading;

  const topListings = [...listings]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-bold">Analytics</h2>
        <p className="text-sm text-muted-foreground">Platform-wide performance metrics</p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {/* Top stat cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Total Users", value: stats?.totalUsers ?? 0, icon: Users, color: "text-blue-500" },
              { label: "Published Listings", value: byStatus.published, icon: CheckCircle, color: "text-green-500" },
              { label: "Pending Approval", value: byStatus.pending, icon: Clock, color: "text-yellow-500" },
              { label: "Total Revenue", value: formatPrice(stats?.totalRevenue ?? 0, true), icon: DollarSign, color: "text-purple-500" },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <Card key={s.label}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{s.label}</p>
                        <p className="font-heading text-2xl font-bold">{s.value}</p>
                      </div>
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 ${s.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Listings by status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Listings Breakdown
                </CardTitle>
                <CardDescription>Distribution across all listing statuses</CardDescription>
              </CardHeader>
              <CardContent>
                <StatRow label="Published / Live" value={byStatus.published} icon={CheckCircle} color="text-green-500" />
                <StatRow label="Pending Approval" value={byStatus.pending} icon={Clock} color="text-yellow-500" />
                <StatRow label="Rejected" value={byStatus.rejected} icon={XCircle} color="text-red-500" />
                <StatRow label="Sold" value={byStatus.sold} icon={TrendingUp} color="text-blue-500" />
                <StatRow label="Rented Out" value={byStatus.rented} icon={TrendingUp} color="text-purple-500" />
                <StatRow label="Featured" value={featuredCount} icon={Building2} color="text-orange-500" />
                <StatRow label="Verified" value={verifiedCount} icon={CheckCircle} color="text-teal-500" />
              </CardContent>
            </Card>

            {/* Users by role */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Users by Role
                </CardTitle>
                <CardDescription>Account distribution across platform roles</CardDescription>
              </CardHeader>
              <CardContent>
                <StatRow label="Buyers" value={byRole.buyer} icon={Users} color="text-blue-500" />
                <StatRow label="Sellers" value={byRole.seller} icon={Building2} color="text-green-500" />
                <StatRow label="Brokers / Agents" value={byRole.broker} icon={Users} color="text-purple-500" />
                <StatRow label="Admins" value={byRole.admin} icon={Users} color="text-red-500" />
                <StatRow label="Total Inquiries" value={stats?.totalInquiries ?? 0} icon={MessageSquare} color="text-orange-500" />
                <StatRow label="New Inquiries" value={stats?.newInquiries ?? 0} icon={MessageSquare} color="text-yellow-500" />
                <StatRow label="Total Views" value={totalViews} icon={Eye} color="text-teal-500" />
              </CardContent>
            </Card>
          </div>

          {/* Top listings by views */}
          {topListings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" />
                  Top Listings by Views
                </CardTitle>
                <CardDescription>Most visited properties on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topListings.map((listing, idx) => (
                    <div key={listing.id} className="flex items-center gap-4 py-2 border-b last:border-0">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary flex-shrink-0">
                        {idx + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium line-clamp-1">{listing.title}</p>
                        <p className="text-xs text-muted-foreground">{listing.city}</p>
                      </div>
                      <Badge
                        variant={listing.status === "published" ? "default" : "outline"}
                        className="flex-shrink-0 capitalize"
                      >
                        {listing.status}
                      </Badge>
                      <div className="flex items-center gap-1 flex-shrink-0 text-sm font-semibold">
                        <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                        {listing.views || 0}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
