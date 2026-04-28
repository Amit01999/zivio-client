import { useState } from "react";
import { Send, Loader2, Calendar, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import type { Listing, SafeUser } from "@/types/schema";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { format } from "date-fns";

interface ContactFormProps {
  listing: Listing;
  agent?: SafeUser;
}

export function ContactForm({ listing }: ContactFormProps) {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(
    `Hi, I'm interested in this property: ${listing.title}. Please contact me with more details.`
  );
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [viewingNotes, setViewingNotes] = useState("");

  const handleSendMessage = async () => {
    if (!isAuthenticated) {
      toast({ title: "Login required", description: "Please login to send messages.", variant: "destructive" });
      return;
    }
    if (!message.trim()) {
      toast({ title: "Message required", description: "Please enter a message.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/property-inquiries", {
        requestType: "meeting",
        propertyId: listing.id,
        message: message.trim(),
      });
      toast({ title: "Message Sent!", description: "The agent will contact you shortly." });
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ["/api/property-inquiries"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/buyer"] });
    } catch {
      toast({ title: "Error", description: "Failed to send message. Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleScheduleViewing = async () => {
    if (!isAuthenticated) {
      toast({ title: "Login required", description: "Please login to schedule viewings.", variant: "destructive" });
      return;
    }
    if (!selectedDate) {
      toast({ title: "Select a date", description: "Please select a preferred viewing date.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/property-inquiries", {
        requestType: "viewing",
        propertyId: listing.id,
        message: viewingNotes.trim() || `Viewing request for: ${listing.title}`,
        metadata: {
          preferredDate: selectedDate.toISOString(),
        },
      });
      toast({ title: "Viewing Requested!", description: "We'll confirm your viewing appointment shortly." });
      setSelectedDate(undefined);
      setViewingNotes("");
      queryClient.invalidateQueries({ queryKey: ["/api/property-inquiries"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/buyer"] });
    } catch {
      toast({ title: "Error", description: "Failed to schedule viewing. Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="sticky top-20" data-testid="contact-form-card">
      <CardHeader className="pb-4">
        <CardTitle className="font-heading text-xl">Contact Agent</CardTitle>
        {user && (
          <p className="text-sm text-muted-foreground">
            Sending as <span className="font-medium">{user.name}</span>
          </p>
        )}
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="message" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="message" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Message
            </TabsTrigger>
            <TabsTrigger value="viewing" className="gap-2">
              <Calendar className="h-4 w-4" />
              Schedule
            </TabsTrigger>
          </TabsList>

          {/* Message Tab */}
          <TabsContent value="message">
            <div className="space-y-4">
              <div>
                <Label htmlFor="message" className="mb-1.5 block">Your Message</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="I'm interested in this property..."
                  className="min-h-[120px] resize-none"
                  data-testid="input-contact-message"
                />
              </div>
              <Button
                className="w-full gap-2"
                onClick={handleSendMessage}
                disabled={isSubmitting || !message.trim()}
                data-testid="button-send-message"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Send Message
              </Button>
            </div>
          </TabsContent>

          {/* Viewing Tab */}
          <TabsContent value="viewing">
            <div className="space-y-4">
              <div>
                <Label className="mb-2 block">Select Preferred Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      data-testid="button-select-date"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="viewing-notes" className="mb-1.5 block">Notes (Optional)</Label>
                <Textarea
                  id="viewing-notes"
                  value={viewingNotes}
                  onChange={(e) => setViewingNotes(e.target.value)}
                  placeholder="Any specific time or requirements?"
                  className="min-h-[80px] resize-none"
                  data-testid="input-viewing-notes"
                />
              </div>

              <Button
                className="w-full gap-2"
                onClick={handleScheduleViewing}
                disabled={isSubmitting || !selectedDate}
                data-testid="button-schedule-viewing"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Calendar className="h-4 w-4" />
                )}
                Schedule Viewing
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
