"use client";

import { useState, type FormEvent } from "react";
import clsx from "clsx";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Check } from "@/components/ui/Icons";

type Errors = Partial<Record<"name" | "reach" | "message", string>>;

const topics = ["A quote", "Scheduling", "A past job", "Billing", "Careers", "Something else"];

/** Contact form: validates, shows a success state, sends nothing (concept site). */
export function ContactForm() {
  const [topic, setTopic] = useState(topics[0]);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") ?? "").trim();
    const reach = String(f.get("reach") ?? "").trim();
    const message = String(f.get("message") ?? "").trim();
    const next: Errors = {};
    if (name.length < 2) next.name = "Tell us your name.";
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reach);
    const isPhone = reach.replace(/\D/g, "").replace(/^1/, "").length === 10;
    if (!isEmail && !isPhone) next.reach = "Enter an email or a 10-digit phone number.";
    if (message.length < 10) next.message = "A few more words, please (10+ characters).";
    setErrors(next);
    const first = Object.keys(next)[0];
    if (first) {
      document.getElementById(`ct-${first}`)?.focus();
      return;
    }
    setBusy(true);
    window.setTimeout(() => {
      setBusy(false);
      setSent(true);
    }, 900);
  };

  if (sent) {
    return (
      <div role="status" className="anim-fade rounded-[2rem] bg-abyss p-8 text-white sm:p-10">
        <span className="grid size-14 place-items-center rounded-full bg-sunny text-abyss">
          <Check size={26} />
        </span>
        <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight">Message received.</h2>
        <p className="mt-3 max-w-md text-white/80">We reply within one business hour, Mon–Sat. For anything wet, call instead: we answer 24/7.</p>
        <p className="mt-6 text-sm text-white/55">Concept site by DBS Media: nothing was actually sent.</p>
      </div>
    );
  }

  const input = (err?: string) =>
    clsx(
      "mt-2 block min-h-12 w-full rounded-2xl bg-porcelain px-4 py-3 ring-1 focus:outline-none focus:ring-2",
      err ? "ring-alert focus:ring-alert" : "ring-abyss/12 focus:ring-bonnet",
    );

  return (
    <form onSubmit={submit} noValidate className="rounded-[2rem] bg-white p-6 ring-1 ring-abyss/8 sm:p-10">
      <fieldset>
        <legend className="text-sm font-semibold">I&apos;m getting in touch about</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {topics.map((t) => (
            <label
              key={t}
              className={clsx(
                "flex min-h-11 cursor-pointer items-center rounded-full px-4 text-sm font-semibold ring-1 has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-bonnet",
                topic === t ? "bg-abyss text-white ring-abyss" : "ring-abyss/15",
              )}
            >
              <input type="radio" name="topic" value={t} className="sr-only" checked={topic === t} onChange={() => setTopic(t)} />
              {t}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="ct-name" className="text-sm font-semibold">
            Name
          </label>
          <input id="ct-name" name="name" autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? "ct-name-err" : undefined} className={input(errors.name)} />
          {errors.name && (
            <p id="ct-name-err" role="alert" className="mt-1.5 text-sm font-medium text-[#b4232a]">
              {errors.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="ct-reach" className="text-sm font-semibold">
            Email or phone
          </label>
          <input id="ct-reach" name="reach" autoComplete="email" aria-invalid={!!errors.reach} aria-describedby={errors.reach ? "ct-reach-err" : undefined} className={input(errors.reach)} />
          {errors.reach && (
            <p id="ct-reach-err" role="alert" className="mt-1.5 text-sm font-medium text-[#b4232a]">
              {errors.reach}
            </p>
          )}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="ct-message" className="text-sm font-semibold">
            Message
          </label>
          <textarea id="ct-message" name="message" rows={5} aria-invalid={!!errors.message} aria-describedby={errors.message ? "ct-message-err" : undefined} className={input(errors.message)} />
          {errors.message && (
            <p id="ct-message-err" role="alert" className="mt-1.5 text-sm font-medium text-[#b4232a]">
              {errors.message}
            </p>
          )}
        </div>
      </div>
      <div className="mt-8">
        <Button type="submit" size="lg" disabled={busy} icon={<ArrowRight size={18} />}>
          {busy ? "Sending…" : "Send message"}
        </Button>
      </div>
    </form>
  );
}
