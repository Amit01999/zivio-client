import { Link } from 'wouter';
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';
import footerimg from '../../assets/footer6.png';
import logo from '../../assets/logo2.png';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    {
      href: '/search?listingType=sale',
      label: 'Buy Property',
      testId: 'link-buy-footer',
    },
    {
      href: '/search?listingType=rent',
      label: 'Rent Property',
      testId: 'link-rent-footer',
    },
    {
      href: '/listings/new',
      label: 'Post Your Property',
      testId: 'link-post-footer',
    },
    {
      href: '/agents',
      label: 'Find Agents',
      testId: 'link-agents-footer',
    },
  ];

  const areas = [
    {
      href: '/search?location=Gulshan',
      label: 'Gulshan',
      testId: 'link-gulshan',
    },
    { href: '/search?location=Banani', label: 'Banani', testId: 'link-banani' },
    {
      href: '/search?location=Dhanmondi',
      label: 'Dhanmondi',
      testId: 'link-dhanmondi',
    },
    { href: '/search?location=Uttara', label: 'Uttara', testId: 'link-uttara' },
  ];

  const socialLinks = [
    {
      href: 'https://web.facebook.com/profile.php?id=61576810865418',
      label: 'Facebook',
      testId: 'link-facebook',
      icon: Facebook,
      external: true,
    },
    { href: '#', label: 'Twitter', testId: 'link-twitter', icon: Twitter },
    {
      href: 'https://www.facebook.com/profile.php?id=61576810865418',
      label: 'Instagram',
      testId: 'link-instagram',
      icon: Instagram,
    },
    {
      href: 'https://www.facebook.com/profile.php?id=61576810865418',
      label: 'LinkedIn',
      testId: 'link-linkedin',
      icon: Linkedin,
    },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-[#401F48] bg-[#17091C] text-[#F5F0EA]">
      <div className="absolute inset-0 z-0">
        <img
          src={footerimg}
          alt="Footer Background"
          className="h-full w-full object-cover opacity-45"
        />
      </div>

      <div className="container relative z-10 mx-auto px-6 py-9 md:px-12 lg:px-16">
        <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center transition-transform duration-300 hover:scale-[1.02]"
            aria-label="ZIVIO LIVING"
          >
            <span
              className="h-14 w-20 bg-[#F5F0EA] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]"
              style={{
                WebkitMaskImage: `url(${logo})`,
                maskImage: `url(${logo})`,
              }}
            />
          </Link>

          <p className="mt-3 max-w-2xl font-heading text-base leading-7 text-white/70">
            Dhaka's premier real estate marketplace. Find your dream property
            across all areas of Dhaka.
          </p>

          <div className="mt-5 grid w-full max-w-3xl grid-cols-1 gap-4 text-white/70 md:grid-cols-[1fr_auto_1fr] md:items-center">
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row md:justify-end">
              <div className="text-center md:text-right">
                <p className="font-heading text-sm">Mail us for Inquiry:</p>
                <span className="text-base font-medium">
                  info@Zivio Living.com
                </span>
              </div>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-white/70 text-white/70">
                <Mail className="h-6 w-6" />
              </span>
            </div>

            <div className="hidden h-11 w-px bg-[#F5F0EA]/70 md:block" />

            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row md:justify-start">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl text-white/70">
                <Phone className="h-7 w-7" />
              </span>
              <div className="text-center md:text-left">
                <p className="font-heading text-sm">Give us a call:</p>
                <a
                  href="tel:+8801710339352"
                  className="text-base font-medium transition-colors hover:text-white"
                >
                  01710-339352
                </a>
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-2 text-sm font-medium text-white/70">
            <MapPin className="h-4 w-4" />
            <span>Dhaka, Bangladesh</span>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-x-7 gap-y-3 text-sm font-medium">
            {[...quickLinks, ...areas].map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/70 transition-colors hover:text-white"
                data-testid={link.testId}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-[#F5F0EA]/70 pt-5">
          <div className="grid grid-cols-1 items-center gap-5 lg:grid-cols-3">
            <p className="text-center text-sm font-medium text-white/70 lg:text-left">
              &copy; {currentYear} ZIVIO LIVING. All rights reserved.
            </p>

            <div className="flex justify-center gap-5">
              {socialLinks.map(
                ({ href, label, testId, icon: Icon, external }) => (
                  <a
                    key={label}
                    href={href}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F5F0EA] text-[#17091C] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white"
                    aria-label={label}
                    data-testid={testId}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ),
              )}
            </div>

            <div className="flex justify-center gap-8 text-sm lg:justify-end">
              <Link
                href="/privacy"
                className="font-medium text-white/70 transition-colors hover:text-white"
                data-testid="link-privacy"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="font-medium text-white/70 transition-colors hover:text-white"
                data-testid="link-terms"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
