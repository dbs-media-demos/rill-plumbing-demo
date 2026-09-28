import { ViewTransition, type ReactNode } from "react";

/**
 * Wraps every page. Route changes animate through CSS view transitions:
 * the old page lifts away and the new one rises like water filling a glass
 * (see ::view-transition-*(.page) in globals.css).
 */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page" exit="page" default="none">
      <main id="main" className="relative">
        {children}
      </main>
    </ViewTransition>
  );
}
