export const appName = 'Braven';
export const docsRoute = '/docs';
export const docsImageRoute = '/og/docs';
export const docsContentRoute = '/llms.mdx/docs';

/**
 * These docs are public; the repository behind them is not.
 *
 * `githubUrl` is therefore left off the nav in `layout.shared.tsx` — an "Edit
 * on GitHub" link pointing at a private repo is a 404 for every reader.
 */
export const gitConfig = {
  user: 'Braven-Bot',
  repo: 'braven-help',
  branch: 'master',
};

/** Where the dashboard and the marketing site live, linked from the docs. */
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bravenbot.com';
export const supportUrl = process.env.NEXT_PUBLIC_SUPPORT_URL ?? 'https://bravenbot.com';
