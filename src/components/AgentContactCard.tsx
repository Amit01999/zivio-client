import { Phone, MessageSquare, Calendar, Star, Building2, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Broker, SafeUser, Listing } from "@/types/schema";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ContactForm } from "./ContactForm";

interface AgentContactCardProps {
  broker?: Broker & { user?: SafeUser };
  listing: Listing;
  agent?: SafeUser;
}

export function AgentContactCard({ broker, listing, agent }: AgentContactCardProps) {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [showContactDialog, setShowContactDialog] = useState(false);
  const user = broker?.user || agent;

  const handleCallAgent = () => {
    if (!user?.phone) {
      toast({
        title: "Phone not available",
        description: "Agent's phone number is not available.",
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to send messages.",
        variant: "destructive",
      });
      return;
    }
    setShowContactDialog(true);
  };

  const handleScheduleViewing = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to schedule viewings.",
        variant: "destructive",
      });
      return;
    }
    setShowContactDialog(true);
  };

  return (
    <>
      <Card className="sticky top-20 shadow-lg" data-testid="agent-contact-card">
        <CardContent className="p-6">
          {/* Agent Info */}
          <div className="flex items-start gap-4 mb-6">
            <Avatar className="h-16 w-16 shrink-0 ring-2 ring-primary/10">
              <AvatarImage src={user?.profilePhotoUrl || undefined} alt={user?.name} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xl font-semibold">
                {user?.name?.charAt(0).toUpperCase() || "A"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-heading font-bold text-lg truncate mb-1" data-testid="agent-name">
                {user?.name || "Property Agent"}
              </h3>
              {broker?.agencyName && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
                  <Building2 className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{broker.agencyName}</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                {broker?.rating && broker.rating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-sm">{broker.rating.toFixed(1)}</span>
                  </div>
                )}
                {broker?.verified && (
                  <Badge variant="secondary" className="gap-1 h-5 px-2">
                    <CheckCircle className="h-3 w-3 text-primary" />
                    <span className="text-xs">Verified</span>
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <Separator className="mb-6" />

          {/* CTA Buttons */}
          <div className="space-y-3">
            <Button
              className="w-full h-12 gap-2 text-base font-semibold shadow-md hover:shadow-lg transition-shadow"
              onClick={handleCallAgent}
              disabled={!user?.phone}
              asChild={!!user?.phone}
              data-testid="button-call-agent-cta"
            >
              {user?.phone ? (
                <a href={`tel:${user.phone}`}>
                  <Phone className="h-5 w-5" />
                  Call Agent
                </a>
              ) : (
                <>
                  <Phone className="h-5 w-5" />
                  Call Agent
                </>
              )}
            </Button>

            <Button
              variant="outline"
              className="w-full h-12 gap-2 text-base font-semibold border-2 hover:bg-accent"
              onClick={handleSendMessage}
              data-testid="button-send-message-cta"
            >
              <MessageSquare className="h-5 w-5" />
              Send Message
            </Button>

            <Button
              variant="outline"
              className="w-full h-12 gap-2 text-base font-semibold border-2 hover:bg-accent"
              onClick={handleScheduleViewing}
              data-testid="button-schedule-viewing-cta"
            >
              <Calendar className="h-5 w-5" />
              Schedule Viewing
            </Button>
          </div>

          {/* Additional Info */}
          {broker?.totalListings && broker.totalListings > 0 && (
            <>
              <Separator className="my-6" />
              <div className="text-sm text-muted-foreground text-center">
                {broker.totalListings} properties listed
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Contact Form Dialog */}
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Contact Agent</DialogTitle>
            <DialogDescription>
              Send a message or schedule a viewing for this property
            </DialogDescription>
          </DialogHeader>
          <ContactForm listing={listing} agent={user} />
        </DialogContent>
      </Dialog>
    </>
  );
}
