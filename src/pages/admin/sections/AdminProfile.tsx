import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { User, Mail, Phone, Shield, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { API_URL } from "@/lib/api";
import { formatDate } from "@/lib/format";

export function AdminProfile() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);

  const updateProfile = useMutation({
    mutationFn: async (data: { name: string; phone?: string }) => {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_URL}/api/admin/users/${user!.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update profile");
      return response.json();
    },
    onSuccess: async () => {
      toast({ title: "Profile updated successfully" });
      await refreshUser();
      setEditing(false);
    },
    onError: () => {
      toast({ title: "Failed to update profile", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    updateProfile.mutate({
      name: formData.get("name") as string,
      phone: (formData.get("phone") as string) || undefined,
    });
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="font-heading text-xl font-bold">My Profile</h2>
        <p className="text-sm text-muted-foreground">View and update your admin account details</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 ring-2 ring-primary/20">
              <AvatarImage src={user.profilePhotoUrl || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
              <Badge variant="secondary" className="mt-1 capitalize">
                <Shield className="mr-1 h-3 w-3" />
                {user.role}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {editing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" defaultValue={user.name} required />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" type="tel" defaultValue={user.phone ?? ""} placeholder="+880..." />
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="submit" disabled={updateProfile.isPending}>
                  {updateProfile.isPending ? "Saving..." : "Save Changes"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Name</p>
                    <p className="text-sm font-medium truncate">{user.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium truncate">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm font-medium">{user.phone ?? "Not set"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Member Since</p>
                    <p className="text-sm font-medium">
                      {user.createdAt ? formatDate(user.createdAt) : "—"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Account Status</p>
                    <p className="text-sm font-medium">
                      {user.verified ? "Verified Account" : "Unverified"}
                    </p>
                  </div>
                </div>
                <Badge variant={user.verified ? "default" : "outline"}>
                  {user.verified ? "Verified" : "Pending"}
                </Badge>
              </div>
              <Button onClick={() => setEditing(true)} variant="outline">
                Edit Profile
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
