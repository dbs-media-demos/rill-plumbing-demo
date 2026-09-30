import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { Breadcrumbs } from "@/components/sections/PageHero";
import { JsonLd } from "@/components/ui/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, graph, webPageSchema } from "@/lib/schema";
import { mailHref, site } from "@/lib/site";

const title = "Privacy Policy";
const description = "How Rill Plumbing Co. handles the information you share when you book, call or contact us.";

export const metadata: Metadata = buildMetadata({ title, description, path: "/privacy", eyebrow: "Privacy" });

export default function PrivacyPage() {
  return (
    <PageShell>
      <JsonLd
        data={graph(
          webPageSchema({ path: "/privacy", name: title, description }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Privacy", path: "/privacy" },
          ]),
        )}
      />
      <section data-header="light" className="bg-porcelain pb-24 pt-32 lg:pt-40">
        <div className="container-x">
          <Breadcrumbs
            tone="light"
            items={[
              { name: "Home", path: "/" },
              { name: "Privacy", path: "/privacy" },
            ]}
          />
          <h1 className="t-1 anim-heading mt-8 font-display font-semibold">Privacy policy</h1>
          <p className="mt-4 text-slate">Last updated September 28, 2026</p>
          <div className="prose-rill mt-12 max-w-3xl">
            <p>
              <strong>This is a concept website created by Scale by Noon.</strong> {site.name} is a fictional company, and the booking and contact
              forms on this site do not send or store any information. The policy below shows what a real plumbing company&apos;s policy would
              cover.
            </p>
            <h2>What we collect</h2>
            <p>When you book or contact us, we collect what you give us: your name, phone number, email, service address and a description of the problem. When you call, we may record the call for quality and training.</p>
            <h2>How we use it</h2>
            <ul>
              <li>To schedule and dispatch a plumber, and to text or call you about your appointment.</li>
              <li>To prepare quotes, invoices and warranty records.</li>
              <li>To follow up about your job and, if you agree, to ask for a review.</li>
            </ul>
            <p>We never sell your personal information.</p>
            <h2>Who we share it with</h2>
            <p>Only the service providers we need to run the business (scheduling, payments, texting), each bound to protect your data, and authorities when required by law.</p>
            <h2>Cookies &amp; analytics</h2>
            <p>We use privacy-friendly analytics to understand which pages help people most. You can block cookies in your browser without breaking the site.</p>
            <h2>Your choices</h2>
            <p>You can ask us to access, correct or delete your information, or to stop marketing messages, at any time. Reply STOP to any text to opt out.</p>
            <h2>Contact</h2>
            <p>
              Questions? Email <a href={mailHref}>{site.email}</a> or call {site.phoneDisplay}.
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
