import { siteUrl } from '@/lib/shared';
import {
  ArrowRight,
  BookOpen,
  Cake,
  CreditCard,
  Gauge,
  LayoutDashboard,
  type LucideIcon,
  Megaphone,
  Rocket,
  Server,
  Shield,
  ShieldAlert,
  Sparkles,
  Terminal,
  Ticket,
  Users,
} from 'lucide-react';
import Link from 'next/link';

/**
 * The docs landing page.
 *
 * Somebody arriving here has one of three intents: they just installed Braven
 * and want it working, they are looking for one specific feature, or they hit
 * a problem and want the page about it. The page is built around those three
 * rather than around the shape of the sidebar.
 */

export const metadata = {
  title: 'Braven documentation',
  description:
    'How to set up and run Braven: ticket panels, staff management, moderation, FiveM integrations and billing.',
};

const SECTIONS: Array<{
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    href: '/docs/tickets/overview',
    title: 'Tickets',
    description: 'Panels, categories, intake forms, transcripts and the close DM.',
    icon: Ticket,
  },
  {
    href: '/docs/staff/duty',
    title: 'Staff management',
    description: 'Duty tracking, activity reports, quotas, infractions, leave and applications.',
    icon: Users,
  },
  {
    href: '/docs/moderation/actions',
    title: 'Moderation',
    description: 'Warnings, bans, the player record log, automod and raid protection.',
    icon: Shield,
  },
  {
    href: '/docs/fivem/server-status',
    title: 'FiveM',
    description: 'Live server status, statistic channels, txAdmin restarts, Tebex and gangs.',
    icon: Server,
  },
  {
    href: '/docs/members/roles',
    title: 'Members',
    description: 'Auto roles, self-assignable roles, welcomes, verification and levelling.',
    icon: Sparkles,
  },
  {
    href: '/docs/engagement/announcements',
    title: 'Engagement',
    description: 'Scheduled announcements, birthdays, giveaways, polls and sticky messages.',
    icon: Megaphone,
  },
];

const POPULAR: Array<{ href: string; title: string; icon: LucideIcon }> = [
  { href: '/docs/getting-started/quick-start', title: 'Set Braven up in five minutes', icon: Rocket },
  { href: '/docs/tickets/panels', title: 'Build a ticket panel', icon: Ticket },
  { href: '/docs/staff/quotas', title: 'Set activity quotas', icon: Gauge },
  { href: '/docs/getting-started/permissions', title: 'Fix a permissions problem', icon: Shield },
  { href: '/docs/account/plans', title: 'What each plan includes', icon: CreditCard },
  { href: '/docs/getting-started/commands', title: 'Every command', icon: Terminal },
  { href: '/docs/staff/infractions', title: 'Track staff infractions', icon: ShieldAlert },
  { href: '/docs/engagement/birthdays', title: 'Announce birthdays', icon: Cake },
];

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      {/* ------------------------------------------------------------ hero */}
      <section className="relative overflow-hidden border-fd-border border-b">
        {/* A single soft wash, so the page has depth without a hero image to
            load and no motion to distract from a search box. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              'radial-gradient(60rem 30rem at 50% -20%, color-mix(in srgb, var(--color-fd-primary) 16%, transparent), transparent 70%)',
          }}
        />

        <div className="relative mx-auto w-full max-w-5xl px-6 py-20 text-center sm:py-28">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-fd-border bg-fd-card px-3 py-1 text-fd-muted-foreground text-xs">
            <BookOpen className="h-3.5 w-3.5" />
            Documentation
          </p>

          <h1 className="text-balance font-semibold text-4xl leading-tight tracking-tight sm:text-5xl">
            Everything Braven does, and how to use it
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-balance text-fd-muted-foreground text-lg leading-relaxed">
            Staff management and ticketing for FiveM roleplay Discords. Start with the five-minute
            setup, or jump straight to the feature you are looking for.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/docs/getting-started/quick-start"
              className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-5 py-2.5 font-medium text-fd-primary-foreground text-sm transition-opacity hover:opacity-90"
            >
              Get started
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 rounded-lg border border-fd-border bg-fd-card px-5 py-2.5 font-medium text-sm transition-colors hover:bg-fd-muted"
            >
              Browse the docs
            </Link>
            <a
              href={`${siteUrl}/dashboard`}
              className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 font-medium text-fd-muted-foreground text-sm transition-colors hover:text-fd-foreground"
            >
              <LayoutDashboard className="h-4 w-4" />
              Open the dashboard
            </a>
          </div>

          <p className="mt-6 text-fd-muted-foreground text-xs">
            Press <kbd className="rounded border border-fd-border bg-fd-muted px-1.5 py-0.5">/</kbd>{' '}
            anywhere to search.
          </p>
        </div>
      </section>

      {/* --------------------------------------------------------- popular */}
      <section className="mx-auto w-full max-w-5xl px-6 py-14">
        <h2 className="mb-5 font-medium text-fd-muted-foreground text-sm uppercase tracking-[0.1em]">
          Most people start here
        </h2>

        <div className="grid gap-2 sm:grid-cols-2">
          {POPULAR.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center gap-3 rounded-lg border border-fd-border bg-fd-card px-4 py-3 transition-colors hover:border-fd-primary/40 hover:bg-fd-muted"
            >
              <item.icon className="h-4 w-4 shrink-0 text-fd-muted-foreground transition-colors group-hover:text-fd-primary" />
              <span className="min-w-0 flex-1 truncate text-sm">{item.title}</span>
              <ArrowRight className="h-3.5 w-3.5 shrink-0 text-fd-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------- sections */}
      <section className="mx-auto w-full max-w-5xl px-6 pb-20">
        <h2 className="mb-5 font-medium text-fd-muted-foreground text-sm uppercase tracking-[0.1em]">
          By area
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SECTIONS.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group rounded-xl border border-fd-border bg-fd-card p-5 transition-all hover:border-fd-primary/40 hover:bg-fd-muted"
            >
              <span className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-fd-border bg-fd-background text-fd-primary">
                <section.icon className="h-4 w-4" />
              </span>
              <h3 className="mb-1.5 font-medium">{section.title}</h3>
              <p className="text-fd-muted-foreground text-sm leading-relaxed">
                {section.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ----------------------------------------------------------- close */}
      <section className="border-fd-border border-t">
        <div className="mx-auto w-full max-w-5xl px-6 py-14 text-center">
          <h2 className="font-semibold text-2xl tracking-tight">Still stuck?</h2>
          <p className="mx-auto mt-3 max-w-xl text-fd-muted-foreground leading-relaxed">
            <code className="rounded border border-fd-border bg-fd-muted px-1.5 py-0.5 text-sm">
              /plan
            </code>{' '}
            tells you what your server is on and{' '}
            <code className="rounded border border-fd-border bg-fd-muted px-1.5 py-0.5 text-sm">
              /modules view
            </code>{' '}
            tells you what is switched on. Between them they explain most surprises.
          </p>
          <Link
            href="/docs/getting-started/modules"
            className="mt-6 inline-flex items-center gap-2 text-fd-primary text-sm transition-opacity hover:opacity-80"
          >
            Read about modules
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
