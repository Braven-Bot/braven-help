# braven-help

The **public** documentation for Braven, served at
[docs.bravenbot.com](https://docs.bravenbot.com).

Not to be confused with `braven-docs`, which is the private repo holding
`ROADMAP.md`, `PRICING.md` and the internal specs. This one is written for
customers and is safe to share.

## Stack

Next.js 16 · Fumadocs 16 · MDX · TypeScript · Tailwind v4 · Orama search
(built in, no external service).

## Running it

```bash
pnpm install
pnpm dev            # http://localhost:3000
```

## Writing

Pages are MDX under `content/docs/`, and the sidebar comes from the
`meta.json` in each folder. Add a page, add its slug to the folder's
`meta.json`, done.

Fumadocs components available in any page: `<Callout>`, `<Cards>` / `<Card>`,
`<Tabs>`, `<Steps>`, `<Accordion>`.

Use a callout to mark a paid feature, matching the existing pages:

```mdx
<Callout>This is a **Pro** feature. `/subscribe` to enable it.</Callout>
```

## Regenerating the command reference

`content/docs/getting-started/commands.mdx` and the command tables on the
feature pages are **generated from the bot's own command definitions**, so a
renamed subcommand shows up as a docs diff rather than as a page that quietly
lies.

After adding or changing a command in braven-bot:

```bash
# 1. In braven-bot, dump the manifest (see scripts/generate-pages.mjs header)
# 2. Here:
node scripts/generate-pages.mjs commands.json
```

The generator prints `UNPLACED COMMANDS` if a new command is not assigned to a
docs section — that is a deliberate nag, not a warning to ignore. A command
nobody documented is a command nobody can find.

Pages needing real explanation — panels, duty, quotas, infractions, plans — are
written by hand and are **not** in the generator. Editing them there would be
overwritten on the next run.

## Deploying

Part of the `braven-deploy` stack as the `docs` service, behind Caddy at
`docs.bravenbot.com`. It has no database, no API calls and no secrets, so it
can be rebuilt on its own:

```bash
cd ~/braven-deploy && docker compose up -d --build docs
```
