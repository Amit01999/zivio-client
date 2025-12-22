import { Link } from "wouter";
import { Star, CheckCircle, MessageSquare, Phone, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Broker, SafeUser } from "@/types/schema";

interface AgentCardProps {
  broker: Broker & { user?: SafeUser };
  compact?: boolean;
}

export function AgentCard({ broker, compact = false }: AgentCardProps) {
  const user = broker.user;

  if (compact) {
    return (
      <Card className="overflow-hidden" data-testid={`card-agent-${broker.id}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 shrink-0">
              <AvatarImage src={user?.profilePhotoUrl || undefined} alt={user?.name} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user?.name?.charAt(0).toUpperCase() || "A"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold truncate" data-testid={`text-agent-name-${broker.id}`}>
                  {user?.name || "Agent"}
                </span>
                {broker.verified && (
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                )}
              </div>
              {broker.agencyName && (
                <p className="text-sm text-muted-foreground truncate">{broker.agencyName}</p>
              )}
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 gap-1" data-testid={`button-contact-agent-${broker.id}`}>
              <MessageSquare className="h-4 w-4" />
              Contact
            </Button>
            <Link href={`/agent/${broker.id}`} className="flex-1">
              <Button variant="ghost" size="sm" className="w-full" data-testid={`link-agent-profile-${broker.id}`}>
                View Profile
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow" data-testid={`card-agent-${broker.id}`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 shrink-0 ring-2 ring-primary/10">
            <AvatarImage src={user?.profilePhotoUrl || undefined} alt={user?.name} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xl">
              {user?.name?.charAt(0).toUpperCase() || "A"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-heading font-semibold text-lg truncate" data-testid={`text-agent-name-${broker.id}`}>
                {user?.name || "Agent"}
              </h3>
              {broker.verified && (
                <Badge variant="secondary" className="gap-1 shrink-0">
                  <CheckCircle className="h-3 w-3 text-primary" />
                  Verified
                </Badge>
              )}
            </div>
            {broker.agencyName && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                <Building2 className="h-3.5 w-3.5" />
                <span className="truncate">{broker.agencyName}</span>
              </div>
            )}
            <div className="flex items-center gap-4 text-sm">
              {broker.rating && broker.rating > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{broker.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({broker.reviewCount})</span>
                </div>
              )}
              {broker.totalListings && broker.totalListings > 0 && (
                <span className="text-muted-foreground">
                  {broker.totalListings} listings
                </span>
              )}
            </div>
          </div>
        </div>

        {broker.description && (
          <p className="mt-4 text-sm text-muted-foreground line-clamp-2">
            {broker.description}
          </p>
        )}

        <div className="mt-4 flex gap-2">
          <Button className="flex-1 gap-2" data-testid={`button-contact-agent-${broker.id}`}>
            <MessageSquare className="h-4 w-4" />
            Contact
          </Button>
          {user?.phone && (
            <Button variant="outline" size="icon" asChild data-testid={`button-call-agent-${broker.id}`}>
              <a href={`tel:${user.phone}`}>
                <Phone className="h-4 w-4" />
              </a>
            </Button>
          )}
          <Link href={`/agent/${broker.id}`}>
            <Button variant="outline" data-testid={`link-agent-profile-${broker.id}`}>
              View Profile
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export function AgentCardSkeleton({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <Skeleton className="h-8 flex-1" />
            <Skeleton className="h-8 flex-1" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <Skeleton className="mt-4 h-10 w-full" />
        <div className="mt-4 flex gap-2">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}