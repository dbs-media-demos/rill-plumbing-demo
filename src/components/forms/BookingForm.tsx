"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import clsx from "clsx";
import { problems } from "@/content/problems";
import { services, serviceBySlug } from "@/content/services";
import { cities, cityBySlug, zipToCity } from "@/content/cities";
import { ProblemIcon } from "@/components/sections/ProblemIcons";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Check, Phone } from "@/components/ui/Icons";
import { site, telHref } from "@/lib/site";

type Data = {
  problem: string;
  service: string;
  details: string;
  when: "now" | "today" | "later";
  date: string;
  window: string;
  zip: string;
  address: string;
  home: string;
  name: string;
  phone: string;
  email: string;
  contact: "text" | "call";
};

const initial: Data = {
  problem: "",
  service: "",
  details: "",
  when: "today",
  date: "",
  window: "",
  zip: "",
  address: "",
  home: "House",
  name: "",
  phone: "",
  email: "",
  contact: "text",
};

const steps = ["Problem", "Timing", "Address", "Contact"] as const;
const windows = ["8–10 am", "10–12 pm", "12–2 pm", "2–4 pm", "4–6 pm"];

const digits = (s: string) => s.replace(/\D/g, "");
const formatPhone = (s: string) => {
  const d = digits(s).replace(/^1/, "").slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
};

export function BookingForm() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Data>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof Data, string>>>({});
  const [done, setDone] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const top = useRef<HTMLDivElement>(null);
  const [today, setToday] = useState("");

  // Prefill from ?problem= / ?service= / ?city= (read on the client so the form stays statically rendered).
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const problem = q.get("problem") ?? "";
    const service = q.get("service") ?? "";
    const city = cityBySlug(q.get("city") ?? "");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- URL is only readable after hydration (page is static)
    setData((d) => ({
      ...d,
      problem: problems.some((p) => p.id === problem) ? problem : d.problem,
      service: serviceBySlug(service) ? service : d.service,
      zip: city ? city.zips[0] : d.zip,
      when: problem && problems.find((p) => p.id === problem)?.urgency === 3 ? "now" : d.when,
    }));
    setToday(new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10));
  }, []);

  const set = <K extends keyof Data>(k: K, v: Data[K]) => {
    setData((d) => ({ ...d, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const zipCity = useMemo(() => (digits(data.zip).length === 5 ? zipToCity(digits(data.zip)) : undefined), [data.zip]);
  const problem = problems.find((p) => p.id === data.problem);
  const service = serviceBySlug(data.service || problem?.service || "");

  const validate = (s: number) => {
    const e: Partial<Record<keyof Data, string>> = {};
    if (s === 0 && !data.problem && !data.service) e.problem = "Pick the closest problem or a service.";
    if (s === 1 && data.when === "later") {
      if (!data.date) e.date = "Choose a day.";
      if (!data.window) e.window = "Choose an arrival window.";
    }
    if (s === 2) {
      if (digits(data.zip).length !== 5) e.zip = "Enter a 5-digit ZIP code.";
      if (data.address.trim().length < 5) e.address = "Enter the street address.";
    }
    if (s === 3) {
      if (data.name.trim().length < 2) e.name = "Tell us your name.";
      if (digits(data.phone).replace(/^1/, "").length !== 10) e.phone = "Enter a 10-digit US phone number.";
      if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = "That email doesn't look right.";
    }
    setErrors(e);
    const first = Object.keys(e)[0];
    if (first) window.setTimeout(() => document.getElementById(`bk-${first}`)?.focus(), 0);
    return !first;
  };

  const go = (n: number) => {
    setStep(n);
    const y = (top.current?.getBoundingClientRect().top ?? 0) + window.scrollY - 110;
    if (window.scrollY <= y) return;
    if (window.__lenis) window.__lenis.scrollTo(y);
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  const next = (e: FormEvent) => {
    e.preventDefault();
    if (!validate(step)) return;
    if (step < steps.length - 1) return go(step + 1);
    // Concept site: nothing is sent anywhere.
    setSending(true);
    window.setTimeout(() => {
      setSending(false);
      setDone(`RP-${Math.floor(10000 + Math.random() * 89999)}`);
      go(0);
    }, 1100);
  };

  if (done) {
    const city = zipCity;
    return (
      <div ref={top} className="anim-fade rounded-[2rem] bg-abyss p-8 text-white sm:p-12" role="status">
        <span className="grid size-16 place-items-center rounded-full bg-sunny text-abyss">
          <Check size={30} />
        </span>
        <p className="eyebrow mt-8 text-spray">Request {done}</p>
        <h2 className="t-2 mt-3 font-display font-semibold">
          You&apos;re booked, {data.name.split(" ")[0]}. <span className="accent font-normal text-spray">Breathe.</span>
        </h2>
        <p className="mt-5 max-w-xl text-lg text-white/80">
          {data.when === "now"
            ? `Rosa at dispatch will ${data.contact} you at ${formatPhone(data.phone)} within 5 minutes with your plumber's name and arrival time${city ? ` (about ${city.eta} min to ${city.name})` : ""}.`
            : `We'll ${data.contact} you at ${formatPhone(data.phone)} to confirm your ${data.when === "today" ? "same-day" : data.window} window, then text when your plumber is on the way.`}
        </p>
        {problem?.urgency === 3 && (
          <p className="mt-6 max-w-xl rounded-2xl bg-alert/20 p-4 text-white ring-1 ring-alert/40">
            While you wait: shut off the main valve and turn off the water heater.
          </p>
        )}
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href={telHref} variant="light" icon={<Phone size={18} />}>
            Call dispatch
          </Button>
          <Button href="/emergency-tips" variant="outline-light">
            Find your shut-off
          </Button>
        </div>
        <p className="mt-8 text-sm text-white/65">Concept site by Scale by Noon: this form validates but doesn&apos;t send anything.</p>
      </div>
    );
  }

  return (
    <div ref={top} id="booking" className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-12">
      <form onSubmit={next} noValidate className="rounded-[2rem] bg-white p-6 ring-1 ring-abyss/8 sm:p-10" aria-labelledby="bk-title">
        {/* progress: a pipe filling with water */}
        <div className="flex items-center justify-between gap-4">
          <h2 id="bk-title" className="font-display text-2xl font-semibold tracking-tight">
            {["What's going on?", "When do you need us?", "Where are we going?", "How do we reach you?"][step]}
          </h2>
          <span className="text-sm font-semibold text-slate">
            Step {step + 1} of {steps.length}
          </span>
        </div>
        <div className="relative mt-5 h-3 overflow-hidden rounded-full bg-mist" aria-hidden>
          <div
            className="h-full rounded-full bg-[linear-gradient(90deg,#0a6b85,#35c2e0)] transition-[width] duration-700 ease-[var(--ease-out-expo)]"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>
        <ol className="mt-3 grid grid-cols-4 text-xs font-semibold text-slate">
          {steps.map((s, i) => (
            <li key={s} className={clsx(i <= step && "text-abyss")}>
              {s}
            </li>
          ))}
        </ol>

        <div key={step} className="anim-fade mt-8">
          {step === 0 && (
            <fieldset>
              <legend className="sr-only">Problem</legend>
              <div id="bk-problem" tabIndex={-1} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {problems.map((p) => {
                  const on = data.problem === p.id;
                  return (
                    <label
                      key={p.id}
                      className={clsx(
                        "flex cursor-pointer flex-col gap-3 rounded-2xl p-4 ring-1 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-bonnet",
                        on ? "pi-live bg-abyss text-white ring-abyss" : "ring-abyss/12 hover:ring-abyss/40",
                      )}
                    >
                      <input type="radio" name="problem" className="sr-only" checked={on} onChange={() => set("problem", p.id)} />
                      <span className={on ? "text-spray" : "text-river"}>
                        <ProblemIcon id={p.id} />
                      </span>
                      <span className="font-semibold leading-tight">{p.label}</span>
                    </label>
                  );
                })}
                <label
                  className={clsx(
                    "flex cursor-pointer flex-col justify-end gap-3 rounded-2xl p-4 ring-1 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-bonnet",
                    data.problem === "other" ? "bg-abyss text-white ring-abyss" : "ring-abyss/12 hover:ring-abyss/40",
                  )}
                >
                  <input type="radio" name="problem" className="sr-only" checked={data.problem === "other"} onChange={() => set("problem", "other")} />
                  <span className="font-semibold leading-tight">Install, remodel or something else</span>
                </label>
              </div>
              <Field label="Service (optional)" id="bk-service" className="mt-6">
                <select id="bk-service" value={data.service} onChange={(e) => set("service", e.target.value)} className={inputCls()}>
                  <option value="">Not sure / let the plumber decide</option>
                  {services.map((s) => (
                    <option key={s.slug} value={s.slug}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Anything we should know? (optional)" id="bk-details" className="mt-5">
                <textarea
                  id="bk-details"
                  rows={3}
                  value={data.details}
                  onChange={(e) => set("details", e.target.value)}
                  placeholder="e.g. Water coming through the kitchen ceiling under the upstairs bathroom."
                  className={inputCls()}
                />
              </Field>
              <Err msg={errors.problem} id="bk-problem-err" />
            </fieldset>
          )}

          {step === 1 && (
            <fieldset>
              <legend className="sr-only">Timing</legend>
              <div className="grid gap-3 sm:grid-cols-3">
                {(
                  [
                    ["now", "Right now", "Emergency · 24/7, no overtime"],
                    ["today", "Today", "Same-day window"],
                    ["later", "Pick a day", "Choose a 2-hour window"],
                  ] as const
                ).map(([v, t, b]) => (
                  <label
                    key={v}
                    className={clsx(
                      "cursor-pointer rounded-2xl p-5 ring-1 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-bonnet",
                      data.when === v ? (v === "now" ? "bg-alert text-white ring-alert" : "bg-abyss text-white ring-abyss") : "ring-abyss/12 hover:ring-abyss/40",
                    )}
                  >
                    <input type="radio" name="when" className="sr-only" checked={data.when === v} onChange={() => set("when", v)} />
                    <span className="block font-display text-xl font-semibold">{t}</span>
                    <span className={clsx("mt-1 block text-sm", data.when === v ? "text-white/80" : "text-slate")}>{b}</span>
                  </label>
                ))}
              </div>
              {data.when === "later" && (
                <div className="anim-fade mt-6 grid gap-5 sm:grid-cols-[1fr_1.4fr]">
                  <Field label="Day" id="bk-date" error={errors.date}>
                    <input
                      id="bk-date"
                      type="date"
                      min={today}
                      value={data.date}
                      onChange={(e) => set("date", e.target.value)}
                      aria-invalid={!!errors.date}
                      className={inputCls(!!errors.date)}
                    />
                  </Field>
                  <fieldset>
                    <legend className="mb-2 text-sm font-semibold">Arrival window</legend>
                    <div id="bk-window" tabIndex={-1} className="flex flex-wrap gap-2">
                      {windows.map((w) => (
                        <label
                          key={w}
                          className={clsx(
                            "flex min-h-11 cursor-pointer items-center rounded-full px-4 text-sm font-semibold ring-1 has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-bonnet",
                            data.window === w ? "bg-abyss text-white ring-abyss" : "ring-abyss/15",
                          )}
                        >
                          <input type="radio" name="window" className="sr-only" checked={data.window === w} onChange={() => set("window", w)} />
                          {w}
                        </label>
                      ))}
                    </div>
                    <Err msg={errors.window} id="bk-window-err" />
                  </fieldset>
                </div>
              )}
              {data.when === "now" && (
                <p className="anim-fade mt-6 rounded-2xl bg-[#fff4f2] p-4 ring-1 ring-alert/25">
                  Water spreading? Shut off the main valve now. Faster: call{" "}
                  <a href={telHref} className="font-semibold underline underline-offset-4">
                    {site.phoneDisplay}
                  </a>
                  .
                </p>
              )}
            </fieldset>
          )}

          {step === 2 && (
            <div className="grid gap-5 sm:grid-cols-[0.8fr_1.6fr]">
              <Field label="ZIP code" id="bk-zip" error={errors.zip}>
                <input
                  id="bk-zip"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  maxLength={5}
                  value={data.zip}
                  onChange={(e) => set("zip", digits(e.target.value).slice(0, 5))}
                  aria-invalid={!!errors.zip}
                  aria-describedby="bk-zip-hint"
                  className={inputCls(!!errors.zip)}
                />
                <p id="bk-zip-hint" className="mt-1.5 text-sm text-slate" aria-live="polite">
                  {zipCity ? `✓ ${zipCity.name} · ~${zipCity.eta} min average arrival` : digits(data.zip).length === 5 ? "Just outside our usual area. We'll call to confirm." : "We serve 25 ZIP codes across North Dallas."}
                </p>
              </Field>
              <Field label="Street address" id="bk-address" error={errors.address}>
                <input
                  id="bk-address"
                  autoComplete="street-address"
                  value={data.address}
                  onChange={(e) => set("address", e.target.value)}
                  aria-invalid={!!errors.address}
                  className={inputCls(!!errors.address)}
                />
              </Field>
              <fieldset className="sm:col-span-2">
                <legend className="mb-2 text-sm font-semibold">Home type</legend>
                <div className="flex flex-wrap gap-2">
                  {["House", "Townhome", "Condo / apartment", "Business"].map((h) => (
                    <label
                      key={h}
                      className={clsx(
                        "flex min-h-11 cursor-pointer items-center rounded-full px-4 text-sm font-semibold ring-1 has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-bonnet",
                        data.home === h ? "bg-abyss text-white ring-abyss" : "ring-abyss/15",
                      )}
                    >
                      <input type="radio" name="home" className="sr-only" checked={data.home === h} onChange={() => set("home", h)} />
                      {h}
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
          )}

          {step === 3 && (
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full name" id="bk-name" error={errors.name}>
                <input id="bk-name" autoComplete="name" value={data.name} onChange={(e) => set("name", e.target.value)} aria-invalid={!!errors.name} className={inputCls(!!errors.name)} />
              </Field>
              <Field label="Mobile phone" id="bk-phone" error={errors.phone}>
                <input
                  id="bk-phone"
                  type="tel"
                  autoComplete="tel-national"
                  inputMode="tel"
                  value={data.phone}
                  onChange={(e) => set("phone", formatPhone(e.target.value))}
                  aria-invalid={!!errors.phone}
                  placeholder="(972) 555-0100"
                  className={inputCls(!!errors.phone)}
                />
              </Field>
              <Field label="Email (optional)" id="bk-email" error={errors.email} className="sm:col-span-2">
                <input id="bk-email" type="email" autoComplete="email" value={data.email} onChange={(e) => set("email", e.target.value)} aria-invalid={!!errors.email} className={inputCls(!!errors.email)} />
              </Field>
              <fieldset className="sm:col-span-2">
                <legend className="mb-2 text-sm font-semibold">Best way to reach you</legend>
                <div className="flex gap-2">
                  {(["text", "call"] as const).map((c) => (
                    <label
                      key={c}
                      className={clsx(
                        "flex min-h-11 cursor-pointer items-center rounded-full px-5 text-sm font-semibold capitalize ring-1 has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-bonnet",
                        data.contact === c ? "bg-abyss text-white ring-abyss" : "ring-abyss/15",
                      )}
                    >
                      <input type="radio" name="contact" className="sr-only" checked={data.contact === c} onChange={() => set("contact", c)} />
                      {c}
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
          )}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-abyss/10 pt-6">
          {step > 0 ? (
            <button type="button" onClick={() => go(step - 1)} className="min-h-11 rounded-full px-4 font-semibold text-slate hover:text-abyss">
              ← Back
            </button>
          ) : (
            <span />
          )}
          <Button type="submit" size="lg" disabled={sending} icon={<ArrowRight size={18} />}>
            {sending ? "Sending…" : step === steps.length - 1 ? "Request my plumber" : "Continue"}
          </Button>
        </div>
      </form>

      {/* live summary */}
      <aside className="h-fit rounded-[2rem] bg-abyss p-7 text-white lg:sticky lg:top-28" aria-label="Your request">
        <p className="eyebrow text-spray">Your request</p>
        <dl className="mt-5 space-y-4">
          <Summary label="Problem" value={problem?.label ?? (data.problem === "other" ? "Install / other" : "—")} />
          <Summary label="Service" value={service?.name ?? "Plumber will advise"} />
          <Summary label="Typical price" value={problem?.price ?? (service ? `From ${service.from}` : "Quoted on site")} />
          <Summary
            label="When"
            value={data.when === "now" ? "Right now (emergency)" : data.when === "today" ? "Today" : data.date ? `${data.date} · ${data.window || "window TBD"}` : "Pick a day"}
          />
          <Summary label="Where" value={zipCity ? `${zipCity.name} ${digits(data.zip)}` : data.zip || "—"} />
        </dl>
        <ul className="mt-7 space-y-2 border-t border-white/10 pt-6 text-sm text-white/75">
          {["Flat price before work starts", "No overtime, nights or weekends", "Shoe covers & full clean-up", "1-year labor warranty"].map((x) => (
            <li key={x} className="flex items-center gap-2">
              <Check size={16} className="text-spray" /> {x}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-white/60">
          Prefer to talk?{" "}
          <a href={telHref} className="font-semibold text-white underline underline-offset-4">
            {site.phoneDisplay}
          </a>
        </p>
        <p className="mt-2 text-xs text-white/65">Serving {cities.map((c) => c.name).join(", ")}.</p>
      </aside>
    </div>
  );
}

const inputCls = (err?: boolean) =>
  clsx(
    "mt-2 block min-h-12 w-full rounded-2xl bg-porcelain px-4 py-3 text-abyss ring-1 transition-shadow placeholder:text-slate/60 focus:outline-none focus:ring-2",
    err ? "ring-alert focus:ring-alert" : "ring-abyss/12 focus:ring-bonnet",
  );

function Field({ label, id, error, className, children }: { label: string; id: string; error?: string; className?: string; children: ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      {children}
      <Err msg={error} id={`${id}-err`} />
    </div>
  );
}

function Err({ msg, id }: { msg?: string; id: string }) {
  if (!msg) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-sm font-medium text-[#b4232a]">
      {msg}
    </p>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-3">
      <dt className="text-sm text-white/60">{label}</dt>
      <dd className="text-right font-semibold">{value}</dd>
    </div>
  );
}
