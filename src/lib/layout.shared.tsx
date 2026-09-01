import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { appName, siteUrl } from "./shared";

/**
 * The chrome around every page.
 *
 * No `githubUrl`: the repository is private, so an "Edit on GitHub" link would
 * be a 404 for every reader. The links that matter to a customer are the
 * dashboard and the invite, so those take its place.
 */
export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="inline-flex items-center gap-2 font-semibold">
          <span
            aria-hidden
            className="inline-block h-5 w-5 rounded-md bg-fd-primary"
          />
          {appName}
        </span>
      ),
    },
    links: [
      { text: "Dashboard", url: `${siteUrl}/dashboard`, external: true },
      { text: "Pricing", url: `${siteUrl}/pricing`, external: true },
    ],
  };
}
