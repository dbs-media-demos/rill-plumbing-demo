import type { ReactNode } from "react";
import { serviceLinks } from "@/content/services";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { MobileBar } from "./MobileBar";
import { DemoPill } from "./DemoPill";
import { SectionRise } from "./SectionRise";
import type { Biz } from "@/lib/biz-core";

/** Header, the page, footer, the phone bar and the demo pill. Client parts read the business from BizProvider. */
export function SiteChrome({ children, biz }: { children: ReactNode; biz?: Biz }) {
  return (
    <>
      <Header services={serviceLinks} />
      {children}
      <Footer biz={biz} />
      <MobileBar />
      <DemoPill />
      <SectionRise />
    </>
  );
}
