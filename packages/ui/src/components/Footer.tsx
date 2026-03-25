import Link from "next/link";

const footerLinks = [
  { label: "เกี่ยวกับ", href: "/about" },
  { label: "ติดต่อ", href: "/contact" },
  { label: "นโยบายความเป็นส่วนตัว", href: "/privacy" },
  { label: "ข้อกำหนดการใช้งาน", href: "/terms" },
] as const;

export function Footer() {
  return (
    <footer
      className="bg-slate-900 py-12 text-white"
      role="contentinfo"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav aria-label="Footer navigation">
          <ul
            className="flex flex-wrap items-center justify-center gap-6 sm:gap-8"
            role="list"
          >
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-slate-300 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="mt-8 text-center text-sm text-slate-400">
          &copy; {new Date().getFullYear()} FutureCareer
        </p>
      </div>
    </footer>
  );
}
