import { useQuery } from "@tanstack/react-query";
import {
  Users,
  Building2,
  Clock,
  MessageSquare,
  TrendingUp,
  CheckCircle,
  XCircle,
  Eye,
  ShoppingBag,
  UserCheck,
  Shield,
  AlertCircle,
  Home,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { API_URL } from "@/lib/api";
import { formatPrice, formatDate, formatRelativeTime } from "@/lib/format";

// ── Types ─────────────────────────────────────────────────────────────────────

interface DashboardData {
  users: { total: number; buyers: number; sellers: number; admins: number };
  listings: { total: number; published: number; pending: number; rejected: number; sold: number; rented: number };
  inquiries: { total: number; new: number; contacted: number; closed: number };
  revenue: number;
  recentListings: Array<{ id: string; title: string; city: string; status: string; propertyType: string; images?: string[]; createdAt: string; price?: number | string | null; views?: number }>;
  recentInquiries: Array<{ id: string; requestType: string; status: string; buyerName: string; propertyTitle: string; propertyCity: string; createdAt: string }>;
  recentUsers: Array<{ id: string; name: string; email: string; role: string; createdAt: string; profilePhotoUrl?: string | null }>;
  topListingsByViews: Array<{ id: string; title: string; city: string; views: number; images?: string[]; slug?: string }>;
  topListingsByInquiries: Array<{ id: string; title: string; city: string; inquiryCount: number; images?: string[] }>;
  sellerPerformance: Array<{ id: string; name: string; email: string; profilePhotoUrl?: string | null; totalListings: number; totalInquiries: number }>;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  published: "text-green-600 bg-green-50 dark:bg-green-950/30",
  pending:   "text-yellow-600 bg-yellow-50 dark:bg-yellow-950/30",
  rejected:  "text-red-600 bg-red-50 dark:bg-red-950/30",
  sold:      "text-blue-600 bg-blue-50 dark:bg-blue-950/30",
  rented:    "text-purple-600 bg-purple-50 dark:bg-purple-950/30",
  new:       "text-blue-600 bg-blue-50 dark:bg-blue-950/30",
  contacted: "text-yellow-600 bg-yellow-50 dark:bg-yellow-950/30",
  closed:    "text-green-600 bg-green-50 dark:bg-green-950/30",
};

const ROLE_COLORS: Record<string, string> = {
  buyer:  "text-sky-600 bg-sky-50 dark:bg-sky-950/30",
  seller: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30",
  admin:  "text-violet-600 bg-violet-50 dark:bg-violet-950/30",
};

const TYPE_COLORS: Record<string, string> = {
  viewing: "bg-blue-100 text-blue-800 dark:bg-blue-900/40",
  buy:     "bg-green-100 text-green-800 dark:bg-green-900/40",
  meeting: "bg-purple-100 text-purple-800 dark:bg-purple-900/40",
};

function SkeletonCard() {
  return (
    <Card>
      <CardContent className="p-6">
        <Skeleton className="h-4 w-24 mb-3" />
        <Skeleton className="h-8 w-16 mb-2" />
        <Skeleton className="h-3 w-32" />
      </CardContent>
    </Card>
  );
}

// ── Metric Card ───────────────────────────────────────────────────────────────

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  sub?: string;
  subColor?: string;
}

function MetricCard({ title, value, icon: Icon, iconBg, iconColor, sub, subColor }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1 min-w-0">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
            <p className="text-2xl font-bold font-heading">{value}</p>
            {sub && (
              <p className={`text-xs font-medium ${subColor ?? "text-muted-foreground"}`}>{sub}</p>
            )}
          </div>
          <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function AdminOverview() {
  const { data, isLoading, isError } = useQuery<DashboardData>({
    queryKey: ["/api/admin/dashboard"],
    queryFn: async () => {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_URL}/api/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    staleTime: 60_000,
  });

  if (isError) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-2">
          <AlertCircle className="h-10 w-10 text-destructive mx-auto" />
          <p className="font-semibold">Failed to load dashboard</p>
          <p className="text-sm text-muted-foreground">Check the server and try refreshing.</p>
        </div>
      </div>
    );
  }

  // ── Bar chart data
  const listingBarData = data
    ? [
        { name: "Active",   value: data.listings.published, fill: "#22c55e" },
        { name: "Pending",  value: data.listings.pending,   fill: "#f59e0b" },
        { name: "Sold",     value: data.listings.sold,      fill: "#3b82f6" },
        { name: "Rented",   value: data.listings.rented,    fill: "#8b5cf6" },
        { name: "Rejected", value: data.listings.rejected,  fill: "#ef4444" },
      ]
    : [];

  // ── Pie chart data
  const inquiryPieData = data
    ? [
        { name: "New",       value: data.inquiries.new,       fill: "#3b82f6" },
        { name: "Contacted", value: data.inquiries.contacted, fill: "#f59e0b" },
        { name: "Closed",    value: data.inquiries.closed,    fill: "#22c55e" },
      ].filter((d) => d.value > 0)
    : [];

  // ── User breakdown bar
  const totalUsers = data?.users.total ?? 1;
  const userBreakdown = data
    ? [
        { label: "Buyers",  count: data.users.buyers,  color: "bg-sky-500",     pct: Math.round((data.users.buyers / totalUsers) * 100) },
        { label: "Sellers", count: data.users.sellers, color: "bg-emerald-500", pct: Math.round((data.users.sellers / totalUsers) * 100) },
        { label: "Admins",  count: data.users.admins,  color: "bg-violet-500",  pct: Math.round((data.users.admins / totalUsers) * 100) },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div>
        <h2 className="font-heading text-xl font-bold">Platform Overview</h2>
        <p className="text-sm text-muted-foreground">Real-time insights across all platform activity</p>
      </div>

      {/* ── Section 1: Key Metrics (6 cards) ── */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 xl:grid-cols-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <MetricCard
              title="Total Properties"
              value={data!.listings.total}
              icon={Building2}
              iconBg="bg-blue-50 dark:bg-blue-950/30"
              iconColor="text-blue-600"
              sub={`${data!.listings.published} active`}
              subColor="text-green-600"
            />
            <MetricCard
              title="Pending Approval"
              value={data!.listings.pending}
              icon={Clock}
              iconBg="bg-yellow-50 dark:bg-yellow-950/30"
              iconColor="text-yellow-600"
              sub="Awaiting review"
              subColor="text-yellow-600"
            />
            <MetricCard
              title="Active Listings"
              value={data!.listings.published}
              icon={CheckCircle}
              iconBg="bg-green-50 dark:bg-green-950/30"
              iconColor="text-green-600"
              sub="Published & live"
              subColor="text-green-600"
            />
            <MetricCard
              title="Sold / Rented"
              value={data!.listings.sold + data!.listings.rented}
              icon={Home}
              iconBg="bg-indigo-50 dark:bg-indigo-950/30"
              iconColor="text-indigo-600"
              sub={`${data!.listings.sold} sold, ${data!.listings.rented} rented`}
            />
            <MetricCard
              title="Total Users"
              value={data!.users.total}
              icon={Users}
              iconBg="bg-violet-50 dark:bg-violet-950/30"
              iconColor="text-violet-600"
              sub={`${data!.users.buyers}B · ${data!.users.sellers}S · ${data!.users.admins}A`}
            />
            <MetricCard
              title="Total Inquiries"
              value={data!.inquiries.total}
              icon={MessageSquare}
              iconBg="bg-rose-50 dark:bg-rose-950/30"
              iconColor="text-rose-600"
              sub={`${data!.inquiries.new} new`}
              subColor="text-blue-600"
            />
          </>
        )}
      </div>

      {/* ── Section 2: Analytics Row ── */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* User Breakdown */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4 text-violet-600" />
              User Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)
              : userBreakdown.map(({ label, count, color, pct }) => (
                  <div key={label} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{label}</span>
                      <span className="text-muted-foreground">{count} ({pct}%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full ${color} transition-all`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                ))}
            {!isLoading && (
              <div className="grid grid-cols-3 gap-2 pt-2 border-t">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Buyers</p>
                  <div className="flex items-center justify-center gap-1 mt-0.5">
                    <ShoppingBag className="h-3.5 w-3.5 text-sky-500" />
                    <span className="text-sm font-bold">{data?.users.buyers}</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Sellers</p>
                  <div className="flex items-center justify-center gap-1 mt-0.5">
                    <UserCheck className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="text-sm font-bold">{data?.users.sellers}</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Admins</p>
                  <div className="flex items-center justify-center gap-1 mt-0.5">
                    <Shield className="h-3.5 w-3.5 text-violet-500" />
                    <span className="text-sm font-bold">{data?.users.admins}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Listings Bar Chart */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Building2 className="h-4 w-4 text-blue-600" />
              Listings by Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-36 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={listingBarData} margin={{ top: 0, right: 0, left: -28, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ fontSize: 12, borderRadius: 8 }}
                    cursor={{ fill: "hsl(var(--muted))" }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {listingBarData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Inquiry Pie Chart */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-rose-600" />
              Inquiry Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-36 w-full" />
            ) : inquiryPieData.length === 0 ? (
              <div className="flex items-center justify-center h-36 text-sm text-muted-foreground">
                No inquiries yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie
                    data={inquiryPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={32}
                    outerRadius={56}
                    dataKey="value"
                    paddingAngle={3}
                  >
                    {inquiryPieData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Section 3: Recent Activity ── */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Recent Listings */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Recent Properties
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex gap-3 items-center">
                    <Skeleton className="h-10 w-14 rounded flex-shrink-0" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-3 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (data?.recentListings ?? []).length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">No listings yet</div>
            ) : (
              <div className="divide-y">
                {(data?.recentListings ?? []).map((listing) => (
                  <div key={listing.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/40 transition-colors">
                    {listing.images?.[0] ? (
                      <div className="h-10 w-14 flex-shrink-0 overflow-hidden rounded bg-muted">
                        <img src={listing.images[0]} alt={listing.title} className="h-full w-full object-cover" />
                      </div>
                    ) : (
                      <div className="h-10 w-14 flex-shrink-0 rounded bg-muted flex items-center justify-center">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium line-clamp-1">{listing.title}</p>
                      <p className="text-[10px] text-muted-foreground">{listing.city}</p>
                    </div>
                    <span className={`flex-shrink-0 text-[10px] font-semibold capitalize px-1.5 py-0.5 rounded-full ${STATUS_COLORS[listing.status] ?? ""}`}>
                      {listing.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Inquiries */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Recent Inquiries
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (data?.recentInquiries ?? []).length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">No inquiries yet</div>
            ) : (
              <div className="divide-y">
                {(data?.recentInquiries ?? []).map((inq) => (
                  <div key={inq.id} className="px-4 py-2.5 hover:bg-muted/40 transition-colors">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <p className="text-xs font-medium line-clamp-1">{inq.propertyTitle}</p>
                      <span className={`flex-shrink-0 text-[10px] font-semibold capitalize px-1.5 py-0.5 rounded-full ${TYPE_COLORS[inq.requestType] ?? ""}`}>
                        {inq.requestType}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] text-muted-foreground">by {inq.buyerName}</p>
                      <span className={`text-[10px] font-semibold capitalize px-1 py-0.5 rounded ${STATUS_COLORS[inq.status] ?? ""}`}>
                        {inq.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {inq.createdAt ? formatRelativeTime(inq.createdAt) : ""}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4" />
              Recent Users
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex gap-3 items-center">
                    <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-3 w-2/3" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (data?.recentUsers ?? []).length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">No users yet</div>
            ) : (
              <div className="divide-y">
                {(data?.recentUsers ?? []).map((user) => (
                  <div key={user.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/40 transition-colors">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src={user.profilePhotoUrl || undefined} />
                      <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium line-clamp-1">{user.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <span className={`flex-shrink-0 text-[10px] font-semibold capitalize px-1.5 py-0.5 rounded-full ${ROLE_COLORS[user.role] ?? ""}`}>
                      {user.role}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Section 4: Property Insights ── */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Top by Views */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Eye className="h-4 w-4 text-indigo-600" />
              Most Viewed Properties
            </CardTitle>
            <CardDescription className="text-xs">Top 5 published listings by page views</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)
            ) : (data?.topListingsByViews ?? []).length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No published listings yet</p>
            ) : (
              (data?.topListingsByViews ?? []).map((listing, rank) => {
                const maxViews = data?.topListingsByViews[0]?.views ?? 1;
                const pct = Math.round(((listing.views ?? 0) / maxViews) * 100);
                return (
                  <div key={listing.id} className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-5 text-xs font-bold text-muted-foreground text-right">
                      #{rank + 1}
                    </span>
                    {listing.images?.[0] ? (
                      <div className="h-9 w-12 flex-shrink-0 overflow-hidden rounded bg-muted">
                        <img src={listing.images[0]} alt={listing.title} className="h-full w-full object-cover" />
                      </div>
                    ) : (
                      <div className="h-9 w-12 flex-shrink-0 rounded bg-muted flex items-center justify-center">
                        <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium line-clamp-1">{listing.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-[10px] text-muted-foreground flex-shrink-0 flex items-center gap-0.5">
                          <Eye className="h-3 w-3" />
                          {listing.views ?? 0}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Top by Inquiries */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-rose-600" />
              Most Inquired Properties
            </CardTitle>
            <CardDescription className="text-xs">Top 5 listings by buyer inquiry count</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)
            ) : (data?.topListingsByInquiries ?? []).length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No inquiries recorded yet</p>
            ) : (
              (data?.topListingsByInquiries ?? []).map((listing, rank) => {
                const maxInq = data?.topListingsByInquiries[0]?.inquiryCount ?? 1;
                const pct = Math.round((listing.inquiryCount / maxInq) * 100);
                return (
                  <div key={listing.id} className="flex items-center gap-3">
                    <span className="flex-shrink-0 w-5 text-xs font-bold text-muted-foreground text-right">
                      #{rank + 1}
                    </span>
                    {listing.images?.[0] ? (
                      <div className="h-9 w-12 flex-shrink-0 overflow-hidden rounded bg-muted">
                        <img src={listing.images[0]} alt={listing.title} className="h-full w-full object-cover" />
                      </div>
                    ) : (
                      <div className="h-9 w-12 flex-shrink-0 rounded bg-muted flex items-center justify-center">
                        <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium line-clamp-1">{listing.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-rose-500 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-[10px] text-muted-foreground flex-shrink-0 flex items-center gap-0.5">
                          <MessageSquare className="h-3 w-3" />
                          {listing.inquiryCount}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Section 5: Seller Performance ── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-emerald-600" />
            Seller Performance
          </CardTitle>
          <CardDescription className="text-xs">Top sellers ranked by number of listings</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-3 w-1/3" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-16" />
                </div>
              ))}
            </div>
          ) : (data?.sellerPerformance ?? []).length === 0 ? (
            <div className="py-10 text-center">
              <UserCheck className="h-10 w-10 text-muted-foreground opacity-30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No sellers registered yet</p>
            </div>
          ) : (
            <div className="divide-y">
              {/* Header */}
              <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                <span>Seller</span>
                <span className="text-right w-24">Listings</span>
                <span className="text-right w-24">Inquiries</span>
              </div>
              {(data?.sellerPerformance ?? []).map((seller, rank) => {
                const maxListings = data!.sellerPerformance[0]?.totalListings ?? 1;
                const pct = Math.round((seller.totalListings / maxListings) * 100);
                return (
                  <div key={seller.id} className="grid grid-cols-[1fr_auto_auto] gap-4 items-center px-4 py-3 hover:bg-muted/40 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="flex-shrink-0 w-5 text-xs font-bold text-muted-foreground text-right">
                        #{rank + 1}
                      </span>
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage src={seller.profilePhotoUrl || undefined} />
                        <AvatarFallback className="text-xs font-bold bg-emerald-50 text-emerald-700">
                          {seller.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-medium line-clamp-1">{seller.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right w-24">
                      <span className="inline-flex items-center gap-1 text-sm font-semibold">
                        <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                        {seller.totalListings}
                      </span>
                    </div>
                    <div className="text-right w-24">
                      <span className="inline-flex items-center gap-1 text-sm font-semibold">
                        <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                        {seller.totalInquiries}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
