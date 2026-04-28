import { useState } from 'react';
import { Link, useLocation, useSearch } from 'wouter';
import {
  Menu,
  Heart,
  MessageSquare,
  User,
  LogOut,
  Plus,
  LayoutDashboard,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  const searchString = useSearch();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentPath = location.split('?')[0];
  const currentParams = new URLSearchParams(searchString);
  const currentListingType =
    currentParams.get('priceType') || currentParams.get('listingType');

  const handleLogout = async () => {
    await logout();
    setLocation('/');
  };

  const navLinks = [
    { href: '/search?priceType=sale', label: 'Buy' },
    { href: '/search?priceType=rent', label: 'Rent' },
    { href: '/agents', label: 'Agents' },
  ];

  const isNavLinkActive = (href: string) => {
    const [hrefPath, hrefQuery = ''] = href.split('?');

    if (hrefPath === '/search') {
      const hrefParams = new URLSearchParams(hrefQuery);
      const hrefListingType =
        hrefParams.get('priceType') || hrefParams.get('listingType');

      return (
        currentPath === '/search' &&
        Boolean(hrefListingType) &&
        currentListingType === hrefListingType
      );
    }

    return currentPath === hrefPath || currentPath.startsWith(`${hrefPath}/`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#eadfe6] bg-[#F4EEE8]/90 shadow-[0_12px_32px_rgba(48,35,53,0.10)] backdrop-blur-xl dark:border-white/10 ">
      <nav className="container relative mx-auto flex h-[70px] items-center justify-between gap-8 px-5 sm:px-6 md:px-10 lg:px-16">
        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center justify-center rounded-2xl transition-all duration-300 hover:scale-[1.02]"
          data-testid="link-home"
          aria-label="ZIVIO"
        >
          <span
            className="h-14 w-[62px] bg-[#401F48] drop-shadow-[0_8px_18px_rgba(36,24,39,0.18)] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain] dark:bg-white"
            style={{
              WebkitMaskImage: `url(${logo})`,
              maskImage: `url(${logo})`,
            }}
          />
        </Link>

        {/* Right Side Controls */}
        <div className="flex flex-1 items-center justify-end gap-5">
          <div className="hidden items-center gap-5 md:flex">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant="ghost"
                  className={`h-10 rounded-full px-4 text-base font-semibold transition-all duration-200 ease-out ${
                    isNavLinkActive(link.href)
                      ? 'bg-[#2C1133]/10 text-[#2C1133] shadow-[inset_0_0_0_1px_rgba(44,17,51,0.12)] dark:bg-white/15 dark:text-white dark:shadow-none'
                      : 'text-[#401F48] hover:bg-[#2C1133]/10 hover:text-[#2C1133] dark:text-white/82 dark:hover:bg-white/10 dark:hover:text-white'
                  }`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>

          {isAuthenticated ? (
            <>
              {/* Small screen icons hidden sm+ */}
              {/* <Link href="/favorites" className="hidden md:block">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full text-[#401F48] hover:bg-[#f4edf2] hover:text-[#2D1235] dark:text-white/82 dark:hover:bg-white/10 dark:hover:text-white"
                >
                  <Heart className="h-5 w-5" />
                </Button>
              </Link>

              <Link href="/messages" className="hidden md:block">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full text-[#401F48] hover:bg-[#f4edf2] hover:text-[#2D1235] dark:text-white/82 dark:hover:bg-white/10 dark:hover:text-white"
                >
                  <MessageSquare className="h-5 w-5" />
                </Button>
              </Link> */}

              {(user?.role === 'seller' ||
                user?.role === 'broker' ||
                user?.role === 'admin') && (
                <Link href="/listings/new">
                  <Button className="hidden min-h-10 rounded-full border-[#eadfe6] bg-[#401F48] px-4 py-2 text-base font-semibold text-white shadow-[0_10px_24px_rgba(36,24,39,0.18)] transition-all hover:-translate-y-0.5 hover:bg-[#2D1235] hover:shadow-[0_14px_30px_rgba(36,24,39,0.22)] dark:border-white/10 dark:bg-white dark:text-[#111827] dark:hover:bg-[#f4edf2] md:flex">
                    <Plus className="h-4 w-4" />
                    Post Property
                  </Button>
                </Link>
              )}

              <div className="hidden md:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-11 w-11 overflow-hidden rounded-full border border-[#eadfe6] bg-[#f8f3f6] p-0 hover:bg-[#f4edf2] dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/16"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={user?.profilePhotoUrl || undefined}
                          alt={user?.name}
                        />
                        <AvatarFallback className="bg-[#8a6690] font-semibold text-white">
                          {user?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    className="w-60 rounded-2xl border border-[#eadfe6] bg-white p-2 text-[#2f2333] shadow-[0_20px_60px_rgba(48,35,53,0.18)]"
                    align="end"
                  >
                    <div className="px-3 py-2">
                      <p className="font-semibold text-[#2f2333]">
                        {user?.name}
                      </p>
                      <p className="text-sm text-[#736776]">{user?.email}</p>
                    </div>

                    <DropdownMenuSeparator className="bg-[#eadfe6]" />

                    <DropdownMenuItem asChild>
                      <Link
                        href="/dashboard"
                        className="flex items-center text-sm font-medium text-[#401F48] hover:text-[#401F48]"
                      >
                        <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                      </Link>
                    </DropdownMenuItem>

                    {(user?.role === 'seller' ||
                      user?.role === 'broker' ||
                      user?.role === 'admin') && (
                      <DropdownMenuItem asChild>
                        <Link
                          href="/dashboard/listings"
                          className="flex items-center text-sm font-medium text-[#401F48] hover:text-[#401F48]"
                        >
                          <Plus className="mr-2 h-4 w-4" /> My Listings
                        </Link>
                      </DropdownMenuItem>
                    )}

                    {(user?.role === 'broker' || user?.role === 'admin') && (
                      <DropdownMenuItem asChild>
                        <Link
                          href="/dashboard/broker"
                          className="flex items-center text-sm font-medium text-[#401F48] hover:text-[#401F48]"
                        >
                          <User className="mr-2 h-4 w-4" /> Broker Profile
                        </Link>
                      </DropdownMenuItem>
                    )}

                    {user?.role === 'admin' && (
                      <DropdownMenuItem asChild>
                        <Link
                          href="/admin"
                          className="flex items-center text-sm font-medium text-[#401F48] hover:text-[#401F48]"
                        >
                          <Shield className="mr-2 h-4 w-4" /> Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuSeparator className="bg-[#eadfe6]" />

                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer text-red-600 focus:text-red-700"
                    >
                      <LogOut className="mr-2 h-4 w-4" /> Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link href="/login">
                <Button
                  variant="ghost"
                  className={`h-10 rounded-full px-4 text-base font-semibold transition-all duration-200 ease-out ${
                    isNavLinkActive('/login')
                      ? 'bg-[#2C1133]/10 text-[#2C1133] shadow-[inset_0_0_0_1px_rgba(44,17,51,0.12)] dark:bg-white/15 dark:text-white dark:shadow-none'
                      : 'text-[#401F48] hover:bg-[#2C1133]/10 hover:text-[#2C1133] dark:text-white/82 dark:hover:bg-white/10 dark:hover:text-white'
                  }`}
                >
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="min-h-10 rounded-full border-[#eadfe6] bg-[#401F48] px-5 py-2 text-base font-semibold text-white shadow-[0_10px_24px_rgba(36,24,39,0.18)] transition-all hover:-translate-y-0.5 hover:bg-[#2D1235] hover:shadow-[0_14px_30px_rgba(36,24,39,0.22)] dark:border-white/10 dark:bg-white dark:text-[#111827] dark:hover:bg-[#f4edf2]">
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
                className="h-10 w-10 rounded-full text-[#401F48] hover:bg-[#f4edf2] hover:text-[#2D1235] dark:text-white/82 dark:hover:bg-white/10 dark:hover:text-white"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-80 border-l border-[#eadfe6] bg-[#fbf8f4] p-0 text-[#401F48] shadow-[0_24px_70px_rgba(36,24,39,0.20)] dark:border-white/10 dark:bg-[#111827] dark:text-white"
            >
              <div className="flex h-full flex-col">
                <div className="border-b border-[#eadfe6] bg-[#F4EEE8] px-6 pb-5 pt-7 dark:border-white/10 dark:bg-white/5">
                  <Link
                    href="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex items-center gap-3"
                    aria-label="ZIVIO"
                  >
                    <span
                      className="h-11 w-12 bg-[#401F48] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain] dark:bg-white"
                      style={{
                        WebkitMaskImage: `url(${logo})`,
                        maskImage: `url(${logo})`,
                      }}
                    />
                    <span className="font-heading text-lg font-semibold text-[#401F48] dark:text-white">
                      Zivio Living
                    </span>
                  </Link>
                </div>

                <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-5 py-6">
                  {isAuthenticated && (
                    <div className="rounded-2xl border border-[#eadfe6] bg-white px-4 py-4 shadow-sm dark:border-white/10 dark:bg-white/8">
                      <p className="text-base font-semibold text-[#401F48] dark:text-white">
                        {user?.name}
                      </p>
                      <p className="text-sm font-medium text-[#6f6173] dark:text-white/68">
                        {user?.email}
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <p className="px-3 text-xs font-semibold uppercase text-[#8c7b91] dark:text-white/45">
                      Explore
                    </p>
                    {navLinks.map(link => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          className={`min-h-11 w-full justify-start rounded-xl px-4 py-2 text-base font-semibold transition-all ${
                            isNavLinkActive(link.href)
                              ? 'bg-[#efe4eb] text-[#401F48] dark:bg-white/12 dark:text-white'
                              : 'text-[#401F48] hover:bg-[#f2e9ef] hover:text-[#401F48] dark:text-white/82 dark:hover:bg-white/10 dark:hover:text-white'
                          }`}
                        >
                          {link.label}
                        </Button>
                      </Link>
                    ))}
                  </div>

                  {isAuthenticated ? (
                    <div className="space-y-2 border-t border-[#eadfe6] pt-5 dark:border-white/10">
                      <p className="px-3 text-xs font-semibold uppercase text-[#8c7b91] dark:text-white/45">
                        Account
                      </p>
                      <Link
                        href="/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          className="min-h-11 w-full justify-start rounded-xl px-4 py-2 text-base font-semibold text-[#401F48] hover:bg-[#f2e9ef] hover:text-[#401F48] dark:text-white/82 dark:hover:bg-white/10 dark:hover:text-white"
                        >
                          <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                        </Button>
                      </Link>
                      <Link
                        href="/favorites"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          className="min-h-11 w-full justify-start rounded-xl px-4 py-2 text-base font-semibold text-[#401F48] hover:bg-[#f2e9ef] hover:text-[#401F48] dark:text-white/82 dark:hover:bg-white/10 dark:hover:text-white"
                        >
                          <Heart className="mr-2 h-4 w-4" /> Favorites
                        </Button>
                      </Link>
                      <Link
                        href="/messages"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          className="min-h-11 w-full justify-start rounded-xl px-4 py-2 text-base font-semibold text-[#401F48] hover:bg-[#f2e9ef] hover:text-[#401F48] dark:text-white/82 dark:hover:bg-white/10 dark:hover:text-white"
                        >
                          <MessageSquare className="mr-2 h-4 w-4" /> Messages
                        </Button>
                      </Link>

                      {(user?.role === 'seller' ||
                        user?.role === 'broker' ||
                        user?.role === 'admin') && (
                        <Link
                          href="/dashboard/listings"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Button
                            variant="ghost"
                            className="min-h-11 w-full justify-start rounded-xl px-4 py-2 text-base font-semibold text-[#401F48] hover:bg-[#f2e9ef] hover:text-[#401F48] dark:text-white/82 dark:hover:bg-white/10 dark:hover:text-white"
                          >
                            <Plus className="mr-2 h-4 w-4" /> My Listings
                          </Button>
                        </Link>
                      )}

                      {(user?.role === 'broker' || user?.role === 'admin') && (
                        <Link
                          href="/dashboard/broker"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Button
                            variant="ghost"
                            className="min-h-11 w-full justify-start rounded-xl px-4 py-2 text-base font-semibold text-[#401F48] hover:bg-[#f2e9ef] hover:text-[#401F48] dark:text-white/82 dark:hover:bg-white/10 dark:hover:text-white"
                          >
                            <User className="mr-2 h-4 w-4" /> Broker Profile
                          </Button>
                        </Link>
                      )}

                      {user?.role === 'admin' && (
                        <Link
                          href="/admin"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Button
                            variant="ghost"
                            className="min-h-11 w-full justify-start rounded-xl px-4 py-2 text-base font-semibold text-[#401F48] hover:bg-[#f2e9ef] hover:text-[#401F48] dark:text-white/82 dark:hover:bg-white/10 dark:hover:text-white"
                          >
                            <Shield className="mr-2 h-4 w-4" /> Admin Panel
                          </Button>
                        </Link>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2 border-t border-[#eadfe6] pt-5 dark:border-white/10">
                      <p className="px-3 text-xs font-semibold uppercase text-[#8c7b91] dark:text-white/45">
                        Account
                      </p>
                      <Link
                        href="/login"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          className="min-h-11 w-full justify-start rounded-xl px-4 py-2 text-base font-semibold text-[#401F48] hover:bg-[#f2e9ef] hover:text-[#401F48] dark:text-white/82 dark:hover:bg-white/10 dark:hover:text-white"
                        >
                          Login
                        </Button>
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          className="min-h-11 w-full justify-start rounded-xl px-4 py-2 text-base font-semibold text-[#401F48] hover:bg-[#f2e9ef] hover:text-[#401F48] dark:text-white/82 dark:hover:bg-white/10 dark:hover:text-white"
                        >
                          Sign Up
                        </Button>
                      </Link>
                    </div>
                  )}

                  {isAuthenticated &&
                    (user?.role === 'seller' ||
                      user?.role === 'broker' ||
                      user?.role === 'admin') && (
                      <Link
                        href="/listings/new"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button className="min-h-11 w-full gap-2 rounded-xl bg-[#401F48] px-4 py-2 text-base font-semibold text-white shadow-md hover:bg-[#2D1235] dark:bg-white dark:text-[#111827] dark:hover:bg-[#f4edf2]">
                          <Plus className="h-4 w-4" /> Post Property
                        </Button>
                      </Link>
                    )}

                  {isAuthenticated && (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full justify-start rounded-xl px-4 py-2 text-base font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-500/10"
                    >
                      <LogOut className="mr-2 h-4 w-4" /> Log out
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
