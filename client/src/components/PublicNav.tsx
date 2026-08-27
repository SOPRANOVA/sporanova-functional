import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router";
import { useEffect, useState } from "react";
import Logo from "./Logo";

const navItems = [
  { label: "Product", href: "/platform" },
  { label: "Solutions", href: "/solutions" },
  { label: "Resources", href: "/about" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Enterprise", href: "/enterprise" },
];

export default function PublicNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  const active = (href: string) => href !== "/#pricing" && location.pathname === href;
  const renderLink = (item: (typeof navItems)[number], mobile = false) => item.href.includes("#") ? <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className={mobile ? "border-b border-[#E8E8E6] py-4 text-lg font-medium text-[#111111]" : "rounded-lg px-3 py-2 text-sm text-[#6B6B6B] transition-colors duration-150 hover:bg-[#F3F3F1] hover:text-[#111111]"}>{item.label}</a> : <Link key={item.href} to={item.href} onClick={() => setMenuOpen(false)} className={mobile ? "border-b border-[#E8E8E6] py-4 text-lg font-medium text-[#111111]" : `rounded-lg px-3 py-2 text-sm transition-colors duration-150 ${active(item.href) ? "bg-[#F3F3F1] font-medium text-[#111111]" : "text-[#6B6B6B] hover:bg-[#F3F3F1] hover:text-[#111111]"}`}>{item.label}</Link>;

  return <>
    <nav className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-200 ${scrolled ? "border-b border-[#E8E8E6] bg-white/90 backdrop-blur-xl" : "border-b border-transparent bg-white/75 backdrop-blur-sm"}`} aria-label="Main navigation">
      <div className="mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between px-5 lg:px-8"><Link to="/" className="shrink-0 transition-opacity duration-150 hover:opacity-75" aria-label="SOPRANOVA home"><Logo size={24} showWordmark /></Link><div className="hidden items-center gap-1 md:flex">{navItems.map((item) => renderLink(item))}</div><div className="hidden items-center gap-3 md:flex"><Link to="/login" className="px-3 py-2 text-sm font-medium text-[#6B6B6B] transition-colors duration-150 hover:text-[#111111]">Log in</Link><Link to="/signup" className="rounded-[10px] bg-[#111111] px-4 py-2.5 text-sm font-medium text-white transition duration-150 hover:bg-[#2B2B2B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B7FBF]">Get started</Link></div><button type="button" onClick={() => setMenuOpen((open) => !open)} className="grid h-10 w-10 place-items-center rounded-lg text-[#111111] transition hover:bg-[#F3F3F1] md:hidden" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button></div>
    </nav>
    <div className={`fixed inset-0 z-40 bg-white px-5 pt-24 transition-opacity duration-200 md:hidden ${menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`} aria-hidden={!menuOpen}><div className="flex flex-col">{navItems.map((item) => renderLink(item, true))}<div className="mt-7 flex flex-col gap-3"><Link to="/login" onClick={() => setMenuOpen(false)} className="rounded-[10px] border border-[#E8E8E6] py-3 text-center text-sm font-medium text-[#111111]">Log in</Link><Link to="/signup" onClick={() => setMenuOpen(false)} className="rounded-[10px] bg-[#111111] py-3 text-center text-sm font-medium text-white">Get started</Link></div></div></div>
  </>;
}
