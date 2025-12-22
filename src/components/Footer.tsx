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
import footerimg from '../../assets/footer.png';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={footerimg}
          alt="Footer Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#75577A]/95 via-[#75577A]/90 to-[#5A4260]/95 backdrop-blur-none opacity-70" />
      </div>

      <div className="container relative z-10 mx-auto px-8 md:px-12 lg:px-16 py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-6">
            <Link
              href="/"
              className="flex items-center gap-2 font-heading text-2xl font-bold text-white hover:text-[#E8CDD1] transition-colors"
            >
              ZIVIO LIVING
            </Link>
            <p className="text-sm text-white/80 leading-relaxed">
              Dhaka's premier real estate marketplace. Find your dream
              property across all areas of Dhaka.
            </p>
            <div className="flex gap-3">
              <a
                href="https://web.facebook.com/profile.php?id=61576810865418"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-[#E8CDD1] hover:text-[#75577A] transition-all duration-300 backdrop-blur-sm"
                aria-label="Facebook"
                data-testid="link-facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-[#E8CDD1] hover:text-[#75577A] transition-all duration-300 backdrop-blur-sm"
                aria-label="Twitter"
                data-testid="link-twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-[#E8CDD1] hover:text-[#75577A] transition-all duration-300 backdrop-blur-sm"
                aria-label="Instagram"
                data-testid="link-instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-[#E8CDD1] hover:text-[#75577A] transition-all duration-300 backdrop-blur-sm"
                aria-label="LinkedIn"
                data-testid="link-linkedin"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="font-heading text-lg font-bold text-white">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/search?listingType=sale"
                  className="text-white/70 hover:text-[#E8CDD1] hover:translate-x-1 inline-block transition-all duration-300"
                  data-testid="link-buy-footer"
                >
                  → Buy Property
                </Link>
              </li>
              <li>
                <Link
                  href="/search?listingType=rent"
                  className="text-white/70 hover:text-[#E8CDD1] hover:translate-x-1 inline-block transition-all duration-300"
                  data-testid="link-rent-footer"
                >
                  → Rent Property
                </Link>
              </li>
              <li>
                <Link
                  href="/listings/new"
                  className="text-white/70 hover:text-[#E8CDD1] hover:translate-x-1 inline-block transition-all duration-300"
                  data-testid="link-post-footer"
                >
                  → Post Your Property
                </Link>
              </li>
              <li>
                <Link
                  href="/agents"
                  className="text-white/70 hover:text-[#E8CDD1] hover:translate-x-1 inline-block transition-all duration-300"
                  data-testid="link-agents-footer"
                >
                  → Find Agents
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="font-heading text-lg font-bold text-white">
              Dhaka Areas
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/search?location=Gulshan"
                  className="text-white/70 hover:text-[#E8CDD1] hover:translate-x-1 inline-block transition-all duration-300"
                  data-testid="link-gulshan"
                >
                  → Gulshan
                </Link>
              </li>
              <li>
                <Link
                  href="/search?location=Banani"
                  className="text-white/70 hover:text-[#E8CDD1] hover:translate-x-1 inline-block transition-all duration-300"
                  data-testid="link-banani"
                >
                  → Banani
                </Link>
              </li>
              <li>
                <Link
                  href="/search?location=Dhanmondi"
                  className="text-white/70 hover:text-[#E8CDD1] hover:translate-x-1 inline-block transition-all duration-300"
                  data-testid="link-dhanmondi"
                >
                  → Dhanmondi
                </Link>
              </li>
              <li>
                <Link
                  href="/search?location=Uttara"
                  className="text-white/70 hover:text-[#E8CDD1] hover:translate-x-1 inline-block transition-all duration-300"
                  data-testid="link-uttara"
                >
                  → Uttara
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="font-heading text-lg font-bold text-white">
              Contact Us
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3 text-white/70 hover:text-white transition-colors">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="pt-1">
                  Dhaka, Bangladesh
                </span>
              </li>
              <li className="flex items-center gap-3 text-white/70 hover:text-white transition-colors">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                  <Phone className="h-4 w-4" />
                </div>
                <a href="tel:+8801710339352" className="hover:text-[#E8CDD1] transition-colors">
                  01710-339352
                </a>
              </li>
              <li className="flex items-center gap-3 text-white/70 hover:text-white transition-colors">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                  <Mail className="h-4 w-4" />
                </div>
                <span>info@Zivio Living.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-white/20 pt-8 sm:flex-row">
          <p className="text-sm text-white/60">
            © {currentYear} ZIVIO LIVING. All rights reserved.
          </p>
          <div className="flex gap-8 text-sm">
            <Link
              href="/privacy"
              className="text-white/60 hover:text-[#E8CDD1] transition-colors"
              data-testid="link-privacy"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-white/60 hover:text-[#E8CDD1] transition-colors"
              data-testid="link-terms"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
