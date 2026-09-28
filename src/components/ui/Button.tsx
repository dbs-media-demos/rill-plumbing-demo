"use client";

import Link from "next/link";
import { useRef, type ReactNode, type MouseEvent, type PointerEvent } from "react";
import clsx from "clsx";

type Variant = "primary" | "light" | "outline" | "outline-light" | "dark" | "sunny";

const variants: Record<Variant, string> = {
  primary: "bg-bonnet text-white hover:bg-bonnet-deep shadow-[0_14px_30px_-12px_rgba(90,72,224,0.7)]",
  light: "bg-white text-abyss hover:bg-foam",
  outline: "border border-abyss/20 text-abyss hover:border-abyss/60 bg-transparent",
  "outline-light": "border border-white/30 text-white hover:border-white/80 bg-white/5 backdrop-blur-sm",
  dark: "bg-abyss text-white hover:bg-abyss-2",
  sunny: "bg-sunny text-abyss hover:bg-[#ffd76e]",
};

type Props = {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  size?: "md" | "lg";
  className?: string;
  icon?: ReactNode;
  type?: "button" | "submit";
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  disabled?: boolean;
  "aria-label"?: string;
  magnetic?: boolean;
};

/**
 * Pill button with a magnetic pull on desktop and a water ripple that echoes
 * out from the pointer on hover/press.
 */
export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className,
  icon,
  type = "button",
  onClick,
  disabled,
  magnetic = true,
  ...rest
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const inner = useRef<HTMLSpanElement>(null);
  const last = useRef(0);

  const ripple = (e: PointerEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const now = performance.now();
    if (now - last.current < 450) return;
    last.current = now;
    const r = el.getBoundingClientRect();
    const ring = document.createElement("span");
    ring.className = "ripple-ring";
    ring.style.left = `${e.clientX - r.left}px`;
    ring.style.top = `${e.clientY - r.top}px`;
    ring.style.setProperty("--size", `${Math.max(r.width, r.height) * 2.4}px`);
    el.appendChild(ring);
    ring.addEventListener("animationend", () => ring.remove());
  };

  const move = (e: PointerEvent<HTMLElement>) => {
    if (!magnetic || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.22;
    const y = (e.clientY - r.top - r.height / 2) * 0.3;
    ref.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    if (inner.current) inner.current.style.transform = `translate3d(${x * 0.35}px, ${y * 0.35}px, 0)`;
  };
  const leave = () => {
    if (ref.current) ref.current.style.transform = "";
    if (inner.current) inner.current.style.transform = "";
  };

  const cls = clsx(
    "group relative isolate inline-flex select-none items-center justify-center gap-2.5 overflow-hidden rounded-full font-semibold",
    "transition-[background-color,border-color,color,transform] duration-500 ease-[var(--ease-out-expo)]",
    "min-h-11",
    size === "lg" ? "px-7 py-4 text-[1.0625rem]" : "px-5 py-3 text-[0.975rem]",
    variants[variant],
    disabled && "pointer-events-none opacity-50",
    className,
  );

  const content = (
    <span ref={inner} className="relative z-10 inline-flex items-center gap-2.5 transition-transform duration-500 ease-[var(--ease-out-expo)]">
      {children}
      {icon && <span className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5">{icon}</span>}
    </span>
  );

  const handlers = {
    onPointerEnter: ripple,
    onPointerDown: ripple,
    onPointerMove: move,
    onPointerLeave: leave,
    onClick,
  };
  const setRef = (n: HTMLElement | null) => {
    ref.current = n;
  };

  if (href) {
    const external = /^(tel:|sms:|mailto:|https?:)/.test(href);
    if (external) {
      return (
        <a ref={setRef} href={href} className={cls} {...handlers} {...rest}>
          {content}
        </a>
      );
    }
    return (
      <Link ref={setRef} href={href} className={cls} {...handlers} {...rest}>
        {content}
      </Link>
    );
  }
  return (
    <button ref={setRef} type={type} disabled={disabled} className={cls} {...handlers} {...rest}>
      {content}
    </button>
  );
}
