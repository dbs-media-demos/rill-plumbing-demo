"use client";

import { useState, type FormEvent } from "react";
import clsx from "clsx";
import { problems } from "@/content/problems";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Check } from "@/components/ui/Icons";
import { useBiz } from "@/components/preview/BizContext";

type Errors = Partial<Record<"name" | "phone", string>>;

/** Short "send a plumber" form on the phone homepage: validates, shows a success state, sends nothing (concept site). */
export function CallbackForm() {
  const biz = useBiz();
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const next: Errors = {};
    if (String(f.get("name") ?? "").trim().length < 2) next.name = "Tell us your name.";
    const digits = String(f.get("phone") ?? "").replace(/\D/g, "");
    if (biz.lang === "sr" ? digits.length < 8 : digits.replace(/^1/, "").length !== 10) next.phone = "Enter a valid phone number.";
    setErrors(next);
    const first = Object.keys(next)[0];
    if (first) {
      document.getElementById(`cb-${first}`)?.focus();
      return;
    }
    setBusy(true);
    window.setTimeout(() => {
      setBusy(false);
      setSent(true);
    }, 700);
  };

  if (sent) {
    return (
      <div role="status" className="mt-5 rounded-[1.6rem] bg-abyss p-6 text-white">
        <span className="grid size-11 place-items-center rounded-full bg-sunny text-abyss">
          <Check size={22} />
        </span>
        <p className="mt-4 font-display text-2xl font-semibold tracking-tight">Request received.</p>
        <p className="mt-2 text-[0.95rem] text-white/80">A dispatcher calls you back within minutes. For anything wet, call now: we answer 24/7.</p>
        <p className="mt-4 text-sm text-white/65">Concept site by Scale by Noon: nothing was actually sent.</p>
      </div>
    );
  }

  const input = (err?: string) =>
    clsx(
      "mt-1 block min-h-12 w-full rounded-2xl bg-white px-4 py-2.5 ring-1 focus:outline-none focus:ring-2",
      err ? "ring-alert focus:ring-alert" : "ring-abyss/12 focus:ring-bonnet",
    );

  return (
    <form onSubmit={submit} noValidate className="mt-4 grid grid-cols-2 gap-2.5">
      <div>
        <label htmlFor="cb-name" className="text-sm font-semibold">
          Name
        </label>
        <input id="cb-name" name="name" autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? "cb-name-err" : undefined} className={input(errors.name)} />
        {errors.name && (
          <p id="cb-name-err" role="alert" className="mt-1 text-sm font-medium text-[#b4232a]">
            {errors.name}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="cb-phone" className="text-sm font-semibold">
          Phone
        </label>
        <input id="cb-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "cb-phone-err" : undefined} className={input(errors.phone)} />
        {errors.phone && (
          <p id="cb-phone-err" role="alert" className="mt-1 text-sm font-medium text-[#b4232a]">
            {errors.phone}
          </p>
        )}
      </div>
      <div className="col-span-2">
        <label htmlFor="cb-problem" className="text-sm font-semibold">
          What&apos;s happening?
        </label>
        <select id="cb-problem" name="problem" className={input()}>
          {problems.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
          <option value="other">Something else</option>
        </select>
      </div>
      <Button type="submit" size="lg" magnetic={false} disabled={busy} className="col-span-2 mt-1 w-full !py-3.5" icon={<ArrowRight size={18} />}>
        {busy ? "Sending…" : "Send a plumber"}
      </Button>
    </form>
  );
}
