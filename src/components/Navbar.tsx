import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import {
  Search,
  Menu,
  X,
  Heart,
  MessageSquare,
  User,
  LogOut,
  Plus,
  LayoutDashboard,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '@/lib/auth';
import logo from '../../assets/logo2.png';

export function Navbar() {
  const [location, setLocation] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim())
      setLocation(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const handleLogout = async () => {
    await logout();
    setLocation('/');
  };

  const navLinks = [
    { href: '/search?priceType=sale', label: 'Buy' },
    { href: '/search?priceType=rent', label: 'Rent' },
    { href: '/agents', label: 'Agents' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#86587E] backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.25)]">
      <nav className="container mx-auto flex h-16 items-center justify-between gap-4 px-8 md:px-12 lg:px-16">
        {/* Logo + Desktop Nav */}
        <div className="flex items-center gap-8">
          <Link href="/" data-testid="link-home">
            <div className="flex items-center">
              <img
                src={logo}
                alt="ZIVIO"
                className="h-14 w-auto object-contain transition-all hover:opacity-90"
              />
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant="ghost"
                  className={`font-medium px-4 py-2 rounded-xl text-[#FCEFF1] hover:text-white hover:bg-white/15 transition-all ${
                    location.startsWith(link.href.split('?')[0])
                      ? 'bg-white/20 text-white shadow-sm'
                      : ''
                  }`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>

        {/* Desktop Search */}
        <form
          onSubmit={handleSearch}
          className="hidden lg:flex flex-1 max-w-md"
        >
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#FCEFF1]/20" />
            <Input
              type="search"
              placeholder="Search properties..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-[#FCEFF1]/40 focus:bg-white/20 backdrop-blur-sm"
            />
          </div>
        </form>

        {/* Right Side Controls */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {isAuthenticated ? (
            <>
              {/* Small screen icons hidden sm+ */}
              <Link href="/favorites" className="hidden sm:block">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-[#FCEFF1] hover:text-white hover:bg-white/15 rounded-xl"
                >
                  <Heart className="h-5 w-5" />
                </Button>
              </Link>

              <Link href="/messages" className="hidden sm:block">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-[#FCEFF1] hover:text-white hover:bg-white/15 rounded-xl"
                >
                  <MessageSquare className="h-5 w-5" />
                </Button>
              </Link>

              {(user?.role === 'seller' || user?.role === 'broker' || user?.role === 'admin') && (
                <Link href="/listings/new">
                  <Button className="hidden sm:flex gap-2 px-4 py-2 bg-[#97729D] hover:bg-[#A784B0] text-white rounded-xl shadow-md hover:shadow-lg transition-all">
                    <Plus className="h-4 w-4" />
                    Post Property
                  </Button>
                </Link>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-10 w-10 p-0 rounded-full overflow-hidden"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={user?.profilePhotoUrl || undefined}
                        alt={user?.name}
                      />
                      <AvatarFallback className="bg-[#97729D] text-white">
                        {user?.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className="w-56 bg-[#6E4E73]/90 text-white backdrop-blur-xl border border-white/20 rounded-xl shadow-xl"
                  align="end"
                >
                  <div className="px-3 py-2">
                    <p className="font-semibold">{user?.name}</p>
                    <p className="text-sm opacity-70">{user?.email}</p>
                  </div>

                  <DropdownMenuSeparator className="bg-white/20" />

                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center">
                      <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                    </Link>
                  </DropdownMenuItem>

                  {(user?.role === 'seller' || user?.role === 'broker' || user?.role === 'admin') && (
                    <DropdownMenuItem asChild>
                      <Link
                        href="/dashboard/listings"
                        className="flex items-center"
                      >
                        <Plus className="mr-2 h-4 w-4" /> My Listings
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {(user?.role === 'broker' || user?.role === 'admin') && (
                    <DropdownMenuItem asChild>
                      <Link
                        href="/dashboard/broker"
                        className="flex items-center"
                      >
                        <User className="mr-2 h-4 w-4" /> Broker Profile
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {user?.role === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center">
                        <Shield className="mr-2 h-4 w-4" /> Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator className="bg-white/20" />

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-300 hover:text-red-400"
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="text-[#FCEFF1] hover:text-white hover:bg-white/15 px-4 py-2 rounded-xl"
                >
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="px-4 py-2 bg-[#97729D] hover:bg-[#A784B0] text-white rounded-xl shadow-md hover:shadow-lg">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="text-[#FCEFF1] hover:text-white hover:bg-white/15 rounded-xl"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-80 bg-[#6E4E73]/95 text-white backdrop-blur-xl border-l border-white/20"
            >
              <div className="flex flex-col gap-4 py-4">
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
                  <Input
                    type="search"
                    placeholder="Search properties..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-9 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40"
                  />
                </form>

                <div className="flex flex-col gap-1">
                  {navLinks.map(link => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button
                        variant="ghost"
                        className="w-full justify-start px-4 py-2 text-white hover:bg-white/15 rounded-xl"
                      >
                        {link.label}
                      </Button>
                    </Link>
                  ))}
                </div>

                {isAuthenticated && (user?.role === 'seller' || user?.role === 'broker' || user?.role === 'admin') && (
                  <Link
                    href="/listings/new"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button className="w-full gap-2 px-4 py-2 bg-[#97729D] hover:bg-[#A784B0] text-white rounded-xl shadow-md hover:shadow-lg">
                      <Plus className="h-4 w-4" /> Post Property
                    </Button>
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
