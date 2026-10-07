import Link from "next/link";
import { AkucheBrandLogo } from "@/components/brand/akuche-brand-logo";

const footerLinks = {
  Product: [
    { href: "/features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "About" },
  ],
  Support: [
    { href: "/dashboard/guide", label: "Guide & Manual" },
    { href: "/dashboard/ask", label: "Ask Akuche" },
    { href: "/dashboard/profile", label: "My Profile" },
  ],
  Legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/about", label: "About Akuche" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <AkucheBrandLogo variant="horizontal" size="sm" />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Think Better. Decide Better. Live Better. Non-medical cognitive clarity, intelligent decision support, and real-world execution.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-border/40 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} AKUCHE. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
