"use client";

import NextLink from "next/link";
import type { ComponentProps } from "react";
import { isPhone } from "@/lib/phone";

/** next/link, except phones don't fetch every page a link points at just because the link came on screen. */
export default function Link(props: ComponentProps<typeof NextLink>) {
  return <NextLink {...props} prefetch={props.prefetch ?? (isPhone() ? false : undefined)} />;
}
