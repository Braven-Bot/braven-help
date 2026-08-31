import { baseOptions } from '@/lib/layout.shared';
import { siteUrl } from '@/lib/shared';
import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';

/**
 * The docs frame.
 *
 * The sidebar is grouped by area — the same grouping the dashboard uses, so
 * somebody moving between the product and its documentation is not learning a
 * second map. `collapsible` is off: with eight sections and forty pages, the
 * whole tree fits, and a sidebar that hides most of itself makes the site feel
 * smaller than it is.
 */
export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <DocsLayout
      tree={source.getPageTree()}
      {...baseOptions()}
      sidebar={{
        collapsible: false,
        // The banner sits above the tree: the fastest route back to the thing
        // the docs are about.
        banner: (
          <a
            href={`${siteUrl}/dashboard`}
            className="flex items-center justify-between rounded-lg border border-fd-border bg-fd-card px-3 py-2 text-sm transition-colors hover:bg-fd-muted"
          >
            <span>Open the dashboard</span>
            <span aria-hidden className="text-fd-muted-foreground">
              →
            </span>
          </a>
        ),
      }}
    >
      {children}
    </DocsLayout>
  );
}
