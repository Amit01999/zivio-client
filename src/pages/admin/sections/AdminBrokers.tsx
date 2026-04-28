import { useQuery, useMutation } from "@tanstack/react-query";
import { CheckCircle, Shield } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { API_URL } from "@/lib/api";
import type { Broker, SafeUser } from "@/types/schema";

export function AdminBrokers() {
  const { toast } = useToast();

  const { data: brokers, isLoading: loadingBrokers } = useQuery<{
    data: (Broker & { user: SafeUser })[];
  }>({
    queryKey: ["/api/admin/brokers"],
    queryFn: async () => {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_URL}/api/admin/brokers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch");
      return response.json();
    },
  });

  const verifyBroker = useMutation({
    mutationFn: async (brokerId: string) => {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_URL}/api/admin/brokers/${brokerId}/verify`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to verify");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Broker verified successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/brokers"] });
    },
    onError: () => {
      toast({ title: "Failed to verify broker", variant: "destructive" });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Broker Verification</CardTitle>
        <CardDescription>Review and verify broker applications</CardDescription>
      </CardHeader>
      <CardContent>
        {loadingBrokers ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : brokers?.data && brokers.data.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Broker</TableHead>
                  <TableHead>Agency</TableHead>
                  <TableHead>License No</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {brokers.data.map((broker) => (
                  <TableRow key={broker.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={broker.user?.profilePhotoUrl || undefined} />
                          <AvatarFallback>
                            {broker.user?.name?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{broker.user?.name}</p>
                          <p className="text-sm text-muted-foreground">{broker.user?.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{broker.agencyName || "-"}</TableCell>
                    <TableCell>{broker.licenseNo || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={broker.verified ? "default" : "outline"}>
                        {broker.verified ? "Verified" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {!broker.verified && (
                        <Button
                          size="sm"
                          onClick={() => verifyBroker.mutate(broker.id)}
                          data-testid={`button-verify-broker-${broker.id}`}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Verify
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="py-12 text-center text-muted-foreground">
            <Shield className="mx-auto h-12 w-12 mb-4 opacity-40" />
            <p>No broker applications</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
