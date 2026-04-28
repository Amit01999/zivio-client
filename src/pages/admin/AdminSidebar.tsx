import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import {
  LayoutDashboard,
  Building2,
  Users,
  UserCheck,
  ShoppingBag,
  Shield,
  Plus,
  MessageSquare,
  BarChart3,
  User,
  LogOut,
  X,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  indent?: boolean;
  external?: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: "Main",
    items: [
      { id: "overview", label: "Dashboard", icon: LayoutDashboard },
      { id: "listings", label: "Properties", icon: Building2 },
      { id: "users", label: "Users", icon: Users },
      { id: "sellers", label: "Sellers", icon: UserCheck, indent: true },
      { id: "buyers", label: "Buyers", icon: ShoppingBag, indent: true },
      { id: "brokers", label: "Agents / Brokers", icon: Shield },
    ],
  },
  {
    label: "Management",
    items: [
      { id: "add-property", label: "Add Property", icon: Plus, external: "/listings/new" },
      { id: "analytics", label: "Analytics", icon: BarChart3 },
      { id: "inquiries", label: "Messages / Inquiries", icon: MessageSquare },
    ],
  },
  {
    label: "Account",
    items: [
      { id: "profile", label: "My Profile", icon: User },
    ],
  },
];

interface AdminSidebarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ activeSection, onNavigate, isOpen, onClose }: AdminSidebarProps) {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  const handleItemClick = (item: NavItem) => {
    if (item.external) {
      setLocation(item.external);
    } else {
      onNavigate(item.id);
    }
    onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-sidebar",
          "transition-transform duration-300 ease-in-out",
          "lg:relative lg:z-auto lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-sm">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="font-heading text-sm font-bold leading-none text-sidebar-foreground">
                ZivioLiving
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">Admin Panel</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 lg:hidden"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
          {navGroups.map((group) => (
            <div key={group.label} className="mb-5">
              <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {group.label}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = !item.external && activeSection === item.id;
                  return (
                    <li key={`${group.label}-${item.id}`}>
                      <button
                        onClick={() => handleItemClick(item)}
                        className={cn(
                          "group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
                          item.indent && "pl-8",
                          isActive
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-4 w-4 flex-shrink-0 transition-colors",
                            isActive
                              ? "text-primary-foreground"
                              : "text-muted-foreground group-hover:text-sidebar-accent-foreground"
                          )}
                        />
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.external && (
                          <ChevronRight className="h-3.5 w-3.5 flex-shrink-0 opacity-40" />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* User footer */}
        <div className="border-t border-border p-3 space-y-1">
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <Avatar className="h-8 w-8 ring-2 ring-primary/20">
              <AvatarImage src={user?.profilePhotoUrl || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                {user?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-sidebar-foreground">
                {user?.name}
              </p>
              <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <Badge variant="secondary" className="flex-shrink-0 text-[10px] capitalize px-1.5">
              {user?.role}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2.5 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>
    </>
  );
}
