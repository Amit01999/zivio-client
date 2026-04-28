import { useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";
import { AdminOverview } from "./sections/AdminOverview";
import { AdminListings } from "./sections/AdminListings";
import { AdminUsers } from "./sections/AdminUsers";
import { AdminBrokers } from "./sections/AdminBrokers";
import { AdminInquiries } from "./sections/AdminInquiries";
import { AdminAnalytics } from "./sections/AdminAnalytics";
import { AdminProfile } from "./sections/AdminProfile";
import { AdminSellers } from "./sections/AdminSellers";

type AdminSection =
  | "overview"
  | "listings"
  | "users"
  | "sellers"
  | "buyers"
  | "brokers"
  | "analytics"
  | "inquiries"
  | "profile";

export function AdminLayout() {
  const [activeSection, setActiveSection] = useState<AdminSection>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function renderSection() {
    switch (activeSection) {
      case "overview":
        return <AdminOverview />;
      case "analytics":
        return <AdminAnalytics />;
      case "listings":
        return <AdminListings />;
      case "users":
        return <AdminUsers />;
      case "sellers":
        return <AdminSellers />;
      case "buyers":
        return <AdminUsers roleFilter="buyer" />;
      case "brokers":
        return <AdminBrokers />;
      case "inquiries":
        return <AdminInquiries />;
      case "profile":
        return <AdminProfile />;
      default:
        return <AdminOverview />;
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-muted/30">
      <AdminSidebar
        activeSection={activeSection}
        onNavigate={(s) => setActiveSection(s as AdminSection)}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <AdminTopbar
          activeSection={activeSection}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-6">
          {renderSection()}
        </main>
      </div>
    </div>
  );
}
