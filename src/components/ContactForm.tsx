import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, Loader2, Calendar, MessageSquare, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { contactFormSchema, type ContactFormData, type Listing, type SafeUser } from "@/types/schema";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import { format } from "date-fns";

interface ContactFormProps {
  listing: Listing;
  agent?: SafeUser;
}

export function ContactForm({ listing, agent }: ContactFormProps) {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      message: `Hi, I'm interested in this property: ${listing.title}. Please contact me with more details.`,
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/inquiries", {
        ...data,
        listingId: listing.id,
        type: "contact",
      });
      toast({
        title: "Message Sent!",
        description: "The agent will contact you shortly.",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleScheduleViewing = async () => {
    if (!selectedDate) {
      toast({
        title: "Select a date",
        description: "Please select a preferred viewing date.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/viewing-requests", {
        listingId: listing.id,
        preferredDate: selectedDate.toISOString(),
        message: form.getValues("message"),
      });
      toast({
        title: "Viewing Requested!",
        description: "We'll confirm your viewing appointment shortly.",
      });
      setSelectedDate(undefined);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule viewing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="sticky top-20" data-testid="contact-form-card">
      <CardHeader className="pb-4">
        <CardTitle className="font-heading text-xl">Contact Agent</CardTitle>
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

          <TabsContent value="message">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} data-testid="input-contact-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          {...field}
                          data-testid="input-contact-email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="+880 1XXX-XXXXXX"
                          {...field}
                          data-testid="input-contact-phone"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="I'm interested in this property..."
                          className="min-h-[100px] resize-none"
                          {...field}
                          data-testid="input-contact-message"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full gap-2"
                  disabled={isSubmitting}
                  data-testid="button-send-message"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  Send Message
                </Button>
              </form>
            </Form>
          </TabsContent>

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

              <Textarea
                placeholder="Any specific time or requirements? (Optional)"
                className="min-h-[80px] resize-none"
                data-testid="input-viewing-notes"
              />

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

        {agent?.phone && (
          <div className="mt-4 pt-4 border-t">
            <Button variant="outline" className="w-full gap-2" asChild data-testid="button-call-agent">
              <a href={`tel:${agent.phone}`}>
                <Phone className="h-4 w-4" />
                Call Agent
              </a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}