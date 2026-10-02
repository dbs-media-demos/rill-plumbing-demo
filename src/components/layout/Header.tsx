"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { ArrowRight, ArrowUpRight, Close, Menu, Phone } from "@/components/ui/Icons";
import { services } from "@/content/services";
import { useBiz } from "@/components/preview/BizContext";
import { telOf } from "@/lib/biz-core";
import { OpenBadge } from "./OpenBadge";

const nav = [
  { label: "Services", href: "/services", mega: true },
  { label: "Pricing", href: "/pricing" },
  { label: "Our work", href: "/work" },
  { label: "Reviews", href: "/reviews" },
  { label: "Areas", href: "/service-areas" },
  { label: "About", href: "/about" },
];

const mobileExtra = [
  { label: "Emergency tips", href: "/emergency-tips" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const biz = useBiz();
  const telHref = telOf(biz) ?? "";
  const pathname = usePathname();
  const ref = useRef<HTMLElement>(null);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const [megaImg, setMegaImg] = useState(services[0].image);

  // Which section is under the header decides light/dark text; direction decides hide/show.
  useEffect(() => {
    let lastY = window.scrollY;
    let raf = 0;
    const detect = () => {
      raf = 0;
      const y = window.scrollY;
      setScrolled(y > 24);
      setHidden(y > 480 && y > lastY + 2 ? true : y < lastY - 2 ? false : (h) => h);
      lastY = y;
      const els = document.elementsFromPoint(window.innerWidth / 2, 40);
      const hit = els.find((e) => !ref.current?.contains(e) && e.closest("[data-header]"));
      const t = hit?.closest("[data-header]")?.getAttribute("data-header");
      setTheme(t === "dark" ? "dark" : "light");
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(detect);
    };
    detect();
    const t1 = window.setTimeout(detect, 120);
    const t2 = window.setTimeout(detect, 900);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pathname]);

  // Close menus on navigation (adjust state during render instead of in an effect).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
    setMega(false);
  }

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (open) window.__lenis?.stop();
    else window.__lenis?.start();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && (setOpen(false), setMega(false));
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const dark = theme === "dark" && !mega;

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[100] rounded-full bg-bonnet px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <header
        ref={ref}
        style={{ viewTransitionName: "site-header" }}
        className={clsx(
          "fixed inset-x-0 top-0 z-50 transition-transform duration-700 ease-[var(--ease-out-expo)]",
          hidden && !open && !mega ? "-translate-y-[120%]" : "translate-y-0",
        )}
        onMouseLeave={() => setMega(false)}
      >
        <div className="container-x pt-3">
          <div
            className={clsx(
              "flex h-[3.75rem] items-center justify-between gap-4 rounded-full pl-5 pr-2 transition-[background-color,box-shadow,color] duration-500",
              dark ? "text-white" : "text-abyss",
              scrolled || mega
                ? dark
                  ? "bg-abyss/55 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl"
                  : "bg-white/80 shadow-[0_10px_40px_-18px_rgba(6,34,47,0.35)] backdrop-blur-xl"
                : "bg-transparent",
            )}
          >
            <Link href="/" aria-label={`${biz.name}, ${biz.lang === "sr" ? "početna" : "home"}`} className="shrink-0 rounded-lg">
              <Logo tone={dark ? "light" : "dark"} />
            </Link>

            <nav aria-label="Main" className="hidden xl:block">
              <ul className="flex items-center gap-1">
                {nav.map((item) => {
                  const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                  return (
                    <li key={item.href} onMouseEnter={() => setMega(!!item.mega)}>
                      <Link
                        href={item.href}
                        aria-expanded={item.mega ? mega : undefined}
                        onFocus={() => setMega(!!item.mega)}
                        className={clsx(
                          "relative rounded-full px-3.5 py-2 text-[0.95rem] font-medium transition-colors",
                          dark ? "hover:bg-white/10" : "hover:bg-abyss/5",
                        )}
                      >
                        {item.label}
                        {active && (
                          <span className="absolute inset-x-3.5 -bottom-0.5 mx-auto h-[3px] w-1.5 rounded-full bg-current" aria-hidden />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="flex items-center gap-2">
              <a
                href={telHref}
                className={clsx(
                  "hidden items-center gap-2 rounded-full px-3 py-2 text-[0.95rem] font-semibold transition-colors lg:inline-flex",
                  dark ? "hover:bg-white/10" : "hover:bg-abyss/5",
                )}
              >
                <Phone size={18} />
                {biz.phoneDisplay}
              </a>
              <span className="hidden sm:block">
                <Button href="/book" size="md">
                  Book a plumber
                </Button>
              </span>
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Open menu"
                aria-expanded={open}
                aria-controls="mobile-menu"
                className={clsx(
                  "grid size-11 place-items-center rounded-full xl:hidden",
                  dark ? "bg-white/10 text-white" : "bg-abyss text-white",
                )}
              >
                <Menu size={22} />
              </button>
            </div>
          </div>

          {/* Services mega panel */}
          <div
            className={clsx(
              "absolute inset-x-0 top-full hidden xl:block",
              "transition-[opacity,transform] duration-500 ease-[var(--ease-out-expo)]",
              mega ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-3 opacity-0",
            )}
            onMouseEnter={() => setMega(true)}
          >
            <div className="container-x pt-2">
              <div className="grid grid-cols-[1.4fr_1fr] gap-6 overflow-hidden rounded-[2rem] bg-white p-3 shadow-[0_30px_80px_-30px_rgba(6,34,47,0.45)]">
                <ul className="grid grid-cols-2 gap-1 p-4">
                  {services.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/services/${s.slug}`}
                        tabIndex={mega ? 0 : -1}
                        onMouseEnter={() => setMegaImg(s.image)}
                        onFocus={() => setMegaImg(s.image)}
                        className="group flex items-start justify-between gap-3 rounded-2xl p-3.5 transition-colors hover:bg-foam"
                      >
                        <span>
                          <span className="block font-display text-lg font-semibold tracking-tight">{s.name}</span>
                          <span className="mt-0.5 block text-sm text-slate">From {s.from}</span>
                        </span>
                        <ArrowUpRight size={18} className="mt-1 opacity-0 transition-opacity group-hover:opacity-100" />
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="relative min-h-[20rem] overflow-hidden rounded-[1.5rem] bg-abyss">
                  {services.map((s) => (
                    <Image
                      key={s.slug}
                      src={s.image}
                      alt=""
                      fill
                      sizes="480px"
                      quality={60}
                      className={clsx(
                        "object-cover transition-[opacity,transform] duration-700 ease-[var(--ease-out-expo)]",
                        megaImg === s.image ? "scale-100 opacity-100" : "scale-110 opacity-0",
                      )}
                    />
                  ))}
                  <div className="absolute inset-0 bg-gradient-to-t from-abyss/80 via-abyss/10 to-transparent" />
                  <div className="absolute inset-x-6 bottom-6 text-white">
                    <p className="font-display text-2xl font-semibold tracking-tight">Not sure what you need?</p>
                    <Link
                      href="/#problem"
                      tabIndex={mega ? 0 : -1}
                      className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-spray hover:text-white"
                    >
                      Tell us the problem <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!open}
        className={clsx(
          "on-dark fixed inset-0 z-[60] flex flex-col bg-abyss text-white xl:hidden",
          "transition-[clip-path] duration-700 ease-[var(--ease-in-out-quart)]",
          open ? "[clip-path:circle(150%_at_calc(100%-2.5rem)_2.5rem)]" : "[clip-path:circle(0%_at_calc(100%-2.5rem)_2.5rem)]",
        )}
      >
        <div className="container-x flex h-[4.5rem] items-center justify-between pt-3">
          <Logo tone="light" />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="grid size-11 place-items-center rounded-full bg-white/10"
          >
            <Close size={22} />
          </button>
        </div>
        <nav aria-label="Mobile" className="container-x mt-6 flex-1 overflow-y-auto">
          <ul>
            {[...nav, ...mobileExtra].map((item, i) => (
              <li
                key={item.href}
                className={clsx(
                  "border-b border-white/10 transition-[opacity,transform] duration-700 ease-[var(--ease-out-expo)]",
                  open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
                )}
                style={{ transitionDelay: open ? `${120 + i * 45}ms` : "0ms" }}
              >
                <Link href={item.href} className="flex items-center justify-between py-3.5 font-display text-[1.9rem] font-semibold tracking-tight">
                  {item.label}
                  <ArrowRight size={22} className="text-spray" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="container-x pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5">
          <OpenBadge tone="dark" compact className="mb-4" />
          <div className="grid grid-cols-2 gap-3">
            <Button href={telHref} variant="light" icon={<Phone size={18} />} magnetic={false}>
              Call now
            </Button>
            <Button href="/book" magnetic={false}>
              Book online
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
