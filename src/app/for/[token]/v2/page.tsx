import { notFound } from "next/navigation";
import { HomeContent } from "@/components/sections/home/HomeContent";
import { previewBiz } from "@/lib/preview";

export { generateMetadata } from "../page";

// Always the CRM's current data: an edit there shows on the next reload
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ token: string }> };

/** The personalised preview without any 3D: /for/<token> with the SVG hero (see app/(site)/v2). */
export default async function PreviewPageV2({ params }: Props) {
  const biz = await previewBiz((await params).token);
  if (!biz) notFound();
  return <HomeContent biz={biz} hero="flat" />;
}
