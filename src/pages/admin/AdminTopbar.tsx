import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/lib/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const sectionLabels: Record<string, string> = {
  overview: 'Dashboard Overview',
  listings: 'Property Management',
  users: 'User Management',
  sellers: 'Sellers Management',
  buyers: 'Buyers Management',
  brokers: 'Broker Management',
  analytics: 'Platform Analytics',
  inquiries: 'Inquiries Management',
  profile: 'My Profile',
};

interface AdminTopbarProps {
  activeSection: string;
  onMenuClick: () => void;
}

export function AdminTopbar({ activeSection, onMenuClick }: AdminTopbarProps) {
  const { user } = useAuth();

  return (
    <header className="flex h-[68.8px] shrink-0 items-center gap-4 border-b border-border bg-background px-6">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 lg:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex-1 min-w-0">
        <h1 className="font-heading text-base font-semibold text-foreground truncate">
          {sectionLabels[activeSection] ?? 'Admin Dashboard'}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Avatar className="h-8 w-8 ring-2 ring-primary/20">
          <AvatarImage src={user?.profilePhotoUrl || undefined} />
          <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
            {user?.name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
