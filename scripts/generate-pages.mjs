/**
 * Generates the feature pages that are mostly "here is the command and what it
 * does", from the bot's own command manifest.
 *
 * The prose is written here by hand; the command tables are generated, so a
 * renamed subcommand shows up as a docs diff rather than as a page that quietly
 * lies. Run it again after adding a command:
 *
 *   node scripts/generate-pages.mjs <path-to-commands.json>
 *
 * Pages that need real explanation — panels, duty, quotas, infractions, plans —
 * are written by hand and deliberately not listed here.
 */
import { readFileSync, writeFileSync } from "node:fs";

const manifest = JSON.parse(readFileSync(process.argv[2], "utf8"));
const byName = new Map(manifest.map((command) => [command.name, command]));

/** `plan` marks the tier a feature needs; omit it for free features. */
const PAGES = [
  {
    path: "getting-started/permissions.mdx",
    title: "Permissions",
    description: "What Braven asks for, why, and what breaks without each one.",
    commands: [],
    body: `Braven does not need Administrator. If an invite link is offering it, it is the
wrong link — use the button on [bravenbot.com](https://bravenbot.com).

## What it asks for

| Permission | Used for |
| --- | --- |
| **Manage Channels** | Creating ticket threads and renaming them. |
| **Manage Roles** | The On Duty role, reward roles, self-assignable roles, LOA roles. |
| **Manage Threads** | Working tickets: archiving, adding and removing people. |
| **Create Private Threads** | Tickets are private threads, so only the opener and staff see them. |
| **Send Messages in Threads** | Posting inside tickets. |
| **Embed Links** | Nearly every message Braven sends is an embed. |
| **Attach Files** | Posting transcripts when a ticket closes. |
| **Read Message History** | Building transcripts, and measuring first reply time. |
| **Add Reactions** | Suggestion voting and the FiveM sits tracker. |
| **Kick / Ban Members** | Only used by \`/mod kick\` and \`/mod ban\`. |
| **Moderate Members** | Timeouts, and automod. |

## The role hierarchy catch

Discord will not let any bot manage a role that sits **above its own** in your
server settings, no matter what permissions it has.

If reward roles, the On Duty role or LOA roles are not being applied, this is
almost always why. Drag Braven's role above the roles it needs to hand out.

<Callout title="Braven tells you what is missing">
  When a permission is missing, Braven names the exact permission and the exact
  channel rather than failing silently. If something is not working and you have
  seen no message, permissions are probably not the cause.
</Callout>

## Privileged intents

Two features need privileged intents enabled on the bot, which is already done on
the hosted version:

- **Server Members** — the join gate, raid protection, sticky roles and welcomes.
- **Presence** — vanity role rewards and the status blacklist.

Without Presence, those two features are simply inert; nothing else is affected.`,
  },
  {
    path: "getting-started/modules.mdx",
    title: "Modules",
    description: "Switch any Braven feature on or off for your server.",
    commands: ["modules"],
    body: `Braven ships with a lot. Modules are how you turn off the parts you do not want.

\`\`\`
/modules view
/modules disable module:levelling
/modules enable module:levelling
\`\`\`

## Modules are not a plan

They are two separate ideas, and Braven keeps them separate on purpose:

- A **switched-off module** is your choice. The feature stays silent — no refusal,
  no upgrade prompt, no nagging.
- A **missing entitlement** is your plan. The feature refuses cleanly and names
  \`/subscribe\`.

Switching a module on never grants something your plan does not include, and a
paid feature never quietly substitutes for a module you turned off.

## What defaults to on

Everything that shipped before the module system defaults on — tickets, duty,
applications, records and the rest. Anything that **hands out roles** defaults
**off**: levelling, auto roles, sticky roles, verification, birthdays and
scheduled posts.

A bot that starts assigning roles the moment it joins is a bot that gets removed,
so those wait until you ask.

## Switching one off keeps the data

Disable levelling and nobody loses their XP. Disable duty and existing sessions
stay. The feature stops acting; nothing is deleted. Turn it back on and it picks
up where it left off — though nothing is recorded while it is off, so reports for
that period will read as zero.`,
  },
  {
    path: "tickets/overview.mdx",
    title: "How tickets work",
    description:
      "Panels, categories, threads and transcripts — the whole flow in one page.",
    commands: [],
    body: `A member clicks a panel, a private thread opens, staff work it, and a transcript
is saved when it closes. Four pieces:

**[Panels](/docs/tickets/panels)** are the message members click. One panel holds up
to 25 options.

**[Categories](/docs/tickets/categories)** are the options on it. Each one decides
where the ticket opens, who can see it, and whether the member fills in a
[form](/docs/tickets/forms) first.

**Tickets** are private threads. Only the opener and your staff roles can see one,
so you are not managing channel permissions per ticket, and your channel list does
not fill up with dead \`ticket-0042\` channels.

**[Transcripts](/docs/tickets/transcripts)** are saved when a ticket closes and
posted to your transcript channel.

## The numbering

Tickets are numbered per server, starting at 1. Numbers are never reused, so
"ticket 46" means one thing forever.

## Claiming

On Pro and above, staff claim a ticket before working it, which stops two people
answering the same person. Claiming is recorded, so [activity
reports](/docs/staff/activity) can tell you who handled what.

## Closing

Closing archives the thread, saves the transcript, and — if you have switched it on
with \`/setup close-dm\` — sends the opener a copy along with a rating prompt.

Reopening is possible for 7 days. After that the thread stays archived and the
transcript is the record.`,
  },
  {
    path: "tickets/categories.mdx",
    title: "Categories",
    description: "The options on a panel, and what each one controls.",
    commands: ["ticketconfig"],
    body: `A category is one option on a [panel](/docs/tickets/panels). It decides everything
about the tickets opened from it.

| Setting | What it does |
| --- | --- |
| **Label** | What members see. Up to 80 characters. |
| **Description** | The line under the label in a dropdown. |
| **Emoji** | Shown beside the label. |
| **Button colour** | Only used when the panel is styled as buttons. |
| **Parent channel** | Open these tickets somewhere other than the server default. |
| **Support roles** | Who can see these tickets, on top of the panel's roles. |
| **Opening message** | The first thing posted inside the ticket. |
| **Intake form** | A [form](/docs/tickets/forms) the member fills in first. |

## How support roles stack

Category roles, then the panel's roles, then your server's staff roles. The most
specific wins, which is what lets one category be handled by a different team
without reconfiguring the whole server.

## Category types

Beyond a standard ticket, a category can be an **enquiry**, **bug report**,
**appeal** or **player report**. The type decides which preset intake form it
starts from — a report asks who you are reporting and for what; an appeal asks
which ban you are appealing.

Set \`custom\` if you built the form yourself.

## Limits

Free servers get 3 categories, Pro 15, Elite unlimited. Discord caps any single
panel at 25 regardless.

Removing a category **archives** it. Tickets already opened under it keep working
and keep their history — the option just disappears from the panel.`,
  },
  {
    path: "tickets/working-a-ticket.mdx",
    title: "Working a ticket",
    description: "Claim, add people, rename, hand over, close and reopen.",
    commands: ["ticket", "tickets"],
    body: `Everything here runs **inside the ticket thread**.

## The usual flow

Claim it, answer, close it. The buttons on the first message cover all three, and
the commands below do the same thing when you need more control.

## Close requests

\`/tickets close-request\` asks the opener to confirm rather than closing on them
mid-sentence. They get Yes and No buttons; either way the thread does not sit open
for a week waiting.

## Reopening

A closed ticket can be reopened by staff for **7 days**. After that the thread stays
archived and the [transcript](/docs/tickets/transcripts) is the record.

## Deleting

\`/tickets delete\` removes the thread entirely. The row and its transcript are kept,
so it still appears in reports and dashboard search — but the conversation in Discord
is gone and cannot be brought back.`,
  },
  {
    path: "tickets/transcripts.mdx",
    title: "Transcripts",
    description:
      "What is saved when a ticket closes, where it goes, and how long it is kept.",
    plan: "Pro",
    commands: [],
    body: `When a ticket closes, Braven saves the whole conversation as an HTML page —
messages, authors, timestamps and attachment links — and posts it to your transcript
channel:

\`\`\`
/setup transcripts channel:#ticket-logs
\`\`\`

## Searching them

The dashboard's **Transcripts** page searches across every closed ticket by content,
subject or the member who opened it. That is usually faster than scrolling a log
channel.

## The close DM

Off by default. Switched on, the person who opened the ticket gets a message when it
closes, with a link to their transcript and a one-click rating:

\`\`\`
/setup close-dm enabled:true rating:true
\`\`\`

Ratings show up on the dashboard under **Staff**, credited to whoever claimed the
ticket. Anyone with DMs from server members switched off simply does not receive it —
the ticket still closes normally.

## Retention

| Plan | Kept for |
| --- | --- |
| Free | Transcripts are not saved |
| Pro | 90 days |
| Elite | 1 year |

Transcripts past the window are deleted automatically. If your plan lapses, existing
transcripts are **not** deleted — the sweep only runs for plans that include
retention.

<Callout title="Transcripts contain real personal data">
  They hold other people's messages. Braven escapes everything before rendering, so
  a transcript cannot run scripts in your browser, but treat the files themselves as
  sensitive — a transcript channel should not be public.
</Callout>`,
  },
  {
    path: "tickets/forms.mdx",
    title: "Intake forms",
    description:
      "Ask questions before the ticket opens, so staff start with the details.",
    plan: "Pro",
    commands: ["form"],
    body: `A form attached to a category runs before the ticket opens. The member fills in a
modal, and their answers are the first thing in the thread — so nobody starts with
"what is your character name?"

The same engine powers [applications](/docs/staff/applications), whitelist forms,
ban appeals and player reports. There is one form builder, not four.

## Question types

Short text, paragraph, and a required flag on each. Discord allows 5 questions per
modal; longer forms run as several pages.

## Where the answers go

Into the ticket thread when it opens, and into the dashboard where they stay
searchable after the thread is archived.`,
  },
  {
    path: "staff/activity.mdx",
    title: "Activity reports",
    description:
      "Hours on duty, tickets handled, and how quickly staff respond.",
    plan: "Pro",
    commands: ["activity", "leaderboard"],
    body: `Everything here is computed from [duty sessions](/docs/staff/duty) and ticket
history. If nobody clocks in, these read as zero.

## What is measured

| Metric | Meaning |
| --- | --- |
| **Duty hours** | Time clocked on. |
| **Tickets claimed** | How many they picked up. |
| **Tickets closed** | How many they finished. |
| **Median first reply** | How long a member waits for a staff answer. |
| **Median close time** | How long a ticket stays open. |

Medians, not averages, deliberately — one ticket left open over a holiday weekend
would wreck an average and tell you nothing about a normal day.

## Reading it

\`/activity member:@Alex days:30\` for one person, \`/leaderboard days:7\` to rank the
team. The dashboard shows the same data as charts over time.

<Callout title="These are conversation starters">
  A low number can mean somebody is slacking, or that they work a quiet timezone, or
  that they spent the week on one enormous case. The numbers tell you where to look,
  not what to conclude.
</Callout>`,
  },
  {
    path: "staff/loa.mdx",
    title: "Leave of absence",
    description:
      "Staff request time off, management approves, and quotas skip them while they are away.",
    plan: "Pro",
    commands: ["loa"],
    body: `A staff member requests leave, management approves it, and Braven applies a role for
the dates and removes it afterwards. Anyone on approved LOA is skipped by the weekly
[quota report](/docs/staff/quotas) — which is the entire point.

## Setting it up

\`\`\`
/setup loa role:@On Leave
/setup management channel:#management
\`\`\`

Requests go to the management channel with Approve and Deny buttons.

## Approving stays in Discord

It grants a Discord role, so it happens where the bot can carry it out. The dashboard
shows LOA as a record but does not approve it.

## What happens on the dates

The role is applied when the leave starts and removed when it ends, automatically. If
somebody comes back early, cancelling the LOA removes the role immediately.`,
  },
  {
    path: "staff/applications.mdx",
    title: "Applications",
    description:
      "Staff, whitelist and custom applications, with a review flow.",
    plan: "Pro",
    commands: ["application"],
    body: `Applications use the same [form engine](/docs/tickets/forms) as everything else.
Braven ships presets for Staff, EMS, Police and Mechanic that you can copy and edit
rather than starting from a blank page.

## The review flow

Submissions land in your results channel with a **View application** button.
Accepting or denying asks for a **front-facing reason** shown to the applicant — so
"denied" is never just "denied".

Accepting can grant a role automatically and DM the applicant.

## Limits

Free servers get no application forms, Pro gets 2, Elite unlimited. Existing forms
keep working if you downgrade; you just cannot create another.`,
  },
  {
    path: "staff/feedback.mdx",
    title: "Staff feedback",
    description: "Let members rate the staff who helped them.",
    plan: "Pro",
    commands: ["feedback", "staff"],
    body: `Members rate a staff member directly with \`/staff upvote\` and \`/staff downvote\`.
It is separate from [ticket ratings](/docs/tickets/transcripts), which are tied to a
specific closed ticket.

Use ticket ratings to measure how support is going. Use this for the member who was
helped in a voice channel at 2am where no ticket existed.`,
  },
  {
    path: "members/roles.mdx",
    title: "Roles",
    description:
      "Auto roles on join, sticky roles, self-assignable panels, and delegated granting.",
    commands: ["autoroles", "stickyroles", "selfroles", "rolemanager", "role"],
    body: `Four different ways of deciding who holds which role.

**Auto roles** are given when somebody joins. Free.

**Sticky roles** come back if a member leaves and rejoins — so leaving does not shed
a mute or a blacklist. Pro.

**Self-assignable roles** are panels members use to pick their own roles, with
buttons or a dropdown. Free.

**Delegated granting** lets a role hand out specific other roles without giving
anyone Manage Roles. Pro.

<Callout title="Braven's role must sit above the roles it grants">
  Discord will not let any bot manage a role above its own, whatever its permissions.
  If roles are not being applied, check the hierarchy first.
</Callout>`,
  },
  {
    path: "members/welcome.mdx",
    title: "Welcome messages",
    description: "Greet new members, and thank the ones who boost.",
    commands: ["welcome", "booster"],
    body: `Welcome messages are free. Booster replies are Pro.

Both support placeholders like \`{user}\`, \`{server}\` and \`{count}\`, so a message can
name the person and the server it is in.

Members held by [raid protection](/docs/moderation/raid) are not welcomed until they
are let through — otherwise a raid produces a wall of greetings for accounts you are
about to remove.`,
  },
  {
    path: "members/verification.mdx",
    title: "Verification",
    description:
      "Gate the server behind a button, a captcha, or a minimum account age.",
    commands: ["verification"],
    body: `Members verify before they can see the rest of the server, and get a role when they
do.

| Mode | What it asks |
| --- | --- |
| **Button** | One click. Stops the laziest bots. Free. |
| **Captcha** | An emoji challenge. Pro. |
| **Account age** | Refuses accounts newer than the age you set. |

The captcha is emoji-based rather than an image — an image captcha would mean a
rendering dependency, and it stops the same bots either way.`,
  },
  {
    path: "members/levelling.mdx",
    title: "Levelling and XP",
    description: "Members earn XP for talking, and roles as they level up.",
    plan: "Pro",
    commands: ["level", "rank", "xp"],
    body: `Off by default — it hands out roles, so it waits until you ask.

\`\`\`
/level setup enabled:true
/level reward level:5 role:@Regular
\`\`\`

## The curve

Level *n* costs \`5n² + 50n + 100\` XP more than the level before it. That is the same
curve MEE6 and Arcane use, deliberately: members compare the numbers, and a curve
that made level 10 arrive twice as fast would read as broken rather than generous.

## The cooldown

By default a member earns XP at most once every 60 seconds. Without it, levelling
ranks whoever spams "." in a quiet channel rather than who actually shows up.

## Tuning it

| Setting | Default |
| --- | --- |
| XP per message | 15 |
| Cooldown | 60s |
| Level-up announcement | In the channel they were talking in |
| Reward roles | Stack as you pass each level |

Channels can be excluded entirely or given a multiplier — \`0\` earns nothing, \`2\`
earns double. Roles can be excluded too, which is how you keep staff off a public
leaderboard.

## Migrating from another bot

\`/level set member:@Alex xp:12500\` sets someone's total outright, so you can carry
levels over rather than resetting everybody to zero.`,
  },
  {
    path: "members/suggestions.mdx",
    title: "Suggestions",
    description:
      "Members suggest things, everyone votes, staff mark the outcome.",
    commands: ["suggest", "suggestion"],
    body: `\`/suggest\` posts a suggestion with voting buttons. One vote per member — changing
your mind updates your vote rather than stacking another one, so the count is always
the real count.

Staff mark each one accepted, denied or implemented, with a reason.

Free servers get a limited number of open suggestions; Pro is unlimited.`,
  },
  {
    path: "moderation/actions.mdx",
    title: "Moderation actions",
    description: "Warn, timeout, kick, ban, purge, slowmode and lock.",
    commands: ["mod", "mass-unban"],
    body: `The actions themselves are **free on every plan**. A server that cannot remove a
spammer will not stay installed long enough to upgrade.

Every action writes a numbered case to the [record log](/docs/moderation/records),
on every tier — so a server that upgrades later finds its history already there.

## Channel tools

Purge, slowmode and lock are Pro. \`/mod purge\` can filter to one member's messages
rather than clearing everything.

<Callout title="/mass-unban cannot be undone">
  It unbans everybody. There is no list of who was unbanned afterwards, because they
  are no longer banned. Braven asks for confirmation, and that is the only safeguard
  there is.
</Callout>`,
  },
  {
    path: "moderation/records.mdx",
    title: "Player records",
    description:
      "A numbered, searchable punishment log tied to Discord IDs and in-game identifiers.",
    plan: "Pro",
    commands: ["record"],
    body: `Every moderation action writes a case. Cases are numbered per server and never
reused.

## Searching

Look a player up by Discord ID, in-game name, or licence identifier — which matters
in FiveM, where the same person has a Discord account and a game identity that need
tying together.

## Editing

Cases can be edited, and every edit is recorded with who made it and when. A log
somebody can quietly rewrite is not a log.

## Expiry

Temporary punishments expire on their own. The case stays in the history marked as
expired rather than disappearing.

<Callout title="This is not the same as staff infractions">
  Player records are about players and are visible to staff. [Staff
  infractions](/docs/staff/infractions) are about your own team and are
  management-only. Keeping them apart is why a demotion note never turns up in a
  public punishment lookup.
</Callout>`,
  },
  {
    path: "moderation/automod.mdx",
    title: "Automod",
    description: "Invites, mass mentions, spam, caps, banned words and links.",
    plan: "Pro",
    commands: ["automod"],
    body: `Six independent rules, each with its own action and its own exemptions:

| Rule | Catches |
| --- | --- |
| **Invites** | Discord invite links to other servers. |
| **Mass mention** | More than N mentions in one message. |
| **Spam** | The same message repeated, or messages too fast. |
| **Caps** | Messages over a percentage of capitals. |
| **Words** | A list you set. |
| **Links** | URLs, with an allowlist. |

Each rule deletes, warns, or times the member out. Roles and channels can be exempt
per rule, so staff and your bot-commands channel are not caught by the same net.`,
  },
  {
    path: "moderation/raid.mdx",
    title: "Raid protection",
    description:
      "Lock the door when joins spike, and hold new accounts for review.",
    plan: "Pro",
    commands: ["raid"],
    body: `Two defences, both needing the Server Members intent.

**Join-rate lockdown** watches how many accounts join in a window. Cross the
threshold and new members are held for review for 30 minutes. Lift it early with
\`/raid off\`.

**The account-age gate** holds accounts newer than the age you set, which is the
single most effective filter against throwaway raid accounts.

Held members get no [welcome message](/docs/members/welcome) and no auto roles until
they are let through — a raid should not produce a wall of greetings for accounts you
are about to ban.

Everything is announced in your modlog channel so you know it happened.`,
  },
  {
    path: "fivem/server-status.mdx",
    title: "FiveM server status",
    description:
      "A live player count and queue in Discord, updated automatically.",
    plan: "Pro",
    commands: ["fivem"],
    body: `Braven polls your server's own public endpoints — \`/info.json\`, \`/players.json\`
and \`/dynamic.json\` — and keeps an embed updated with player count, queue length and
uptime.

\`\`\`
/fivem setup address:play.yourserver.com:30120
\`\`\`

## Read-only, always

Braven **never** issues a command to your game server. No RCON, no txAdmin control,
no in-game bans, no writes of any kind. It reads public endpoints and receives
webhooks. Anything that would write to your server is deliberately out of scope.

## The players token

\`sv_playersToken\` exposes player identifiers, which lets Braven tie a Discord
account to an in-game licence. It is optional, stored **encrypted**, and never
returned by the dashboard — not even to you. Status polling works fine without it.`,
  },
  {
    path: "fivem/stats-channels.mdx",
    title: "Statistic channels",
    description: "Voice channels whose name is a live number.",
    plan: "Pro",
    commands: ["statschannel"],
    body: `A channel named \`Players: 64/128\` that updates itself. Members read it from the
channel list without opening anything.

Available statistics include player count, queue length, server status, member count
and open tickets.

<Callout title="Discord rate-limits channel renames hard">
  Two renames per ten minutes, per channel. Braven respects that, so a stats channel
  updates every few minutes rather than every few seconds. This is a Discord limit,
  not a Braven one.
</Callout>`,
  },
  {
    path: "fivem/restarts.mdx",
    title: "Restart announcements",
    description: "Announce scheduled restarts from txAdmin in Discord.",
    plan: "Pro",
    commands: ["restarts"],
    body: `txAdmin sends a webhook when a restart is scheduled, and Braven announces it in the
channel you pick.

The webhook goes to Braven's API, which forwards it to the bot — the bot itself opens
no inbound port. \`/restarts setup\` shows you the exact URL to paste into txAdmin.`,
  },
  {
    path: "fivem/tebex.mdx",
    title: "Tebex payments",
    description: "Verify donations and grant roles automatically.",
    plan: "Pro",
    commands: ["tebex"],
    body: `Tebex sends a webhook on payment, and Braven records the transaction and can grant a
role for it.

\`/tebex lookup\` checks a transaction ID, which is how you answer "I paid and did not
get my perks" without leaving Discord.

Chargebacks are recorded too, so a refunded donation does not leave someone holding a
role they no longer paid for.`,
  },
  {
    path: "fivem/sits.mdx",
    title: "Sits tracker",
    description: "Count which staff actually answer player reports.",
    plan: "Pro",
    commands: ["sitstracker", "checksits", "checkall", "wipesits"],
    body: `A staff member reacting to a report message counts as a sit. It is a low-friction way
of measuring who is answering reports in-game, where no ticket exists.

\`/checksits\` shows your own count — members can run it. \`/checkall\` is the
management leaderboard.`,
  },
  {
    path: "fivem/gangs.mdx",
    title: "Gangs and priority",
    description:
      "Delegated gang membership with a hard slot ceiling, and strikes.",
    plan: "Pro",
    commands: ["gangpriority", "gang", "prio", "strike"],
    body: `Gang owners manage their own members within a slot limit you set, so you are not
adding and removing roles for thirty gangs by hand.

**Slots are a hard ceiling.** A gang cannot exceed the slots it has been given, and
slots can be increased but never silently shrink below the members already in.

One person belongs to one gang. Strikes against a gang are counted, expire on a
schedule, and flag the gang when they cross your threshold.`,
  },
  {
    path: "engagement/announcements.mdx",
    title: "Scheduled announcements",
    description: "Recurring and one-off messages posted on a schedule.",
    plan: "Pro",
    commands: ["schedule"],
    body: `\`\`\`
/schedule add channel:#announcements message:Server restarts in 10 minutes cadence:daily time:17:50
\`\`\`

Four cadences: **once**, **every N minutes**, **daily** and **weekly**.

## Everything is UTC

Times are UTC and every reply says so. Braven does not guess at your local timezone,
because a schedule that silently drifts twice a year with daylight saving is worse
than one you convert once.

## After downtime

If the bot is down when an announcement was due, it does **not** fire a burst of
catch-up posts when it comes back. It moves to the next real occurrence. Missing one
announcement is much cheaper than sending twenty at once.`,
  },
  {
    path: "engagement/birthdays.mdx",
    title: "Birthdays and anniversaries",
    description:
      "Birthday greetings, a role for the day, and staff anniversaries.",
    plan: "Elite",
    commands: ["birthday"],
    body: `Members add their own birthday with \`/birthday set\`. Admins configure where
greetings post with \`/birthday setup\`.

<Callout title="No year is ever stored">
  A month and a day is all a greeting needs. A full date of birth is personal data
  with a real cost to holding, and Braven has no reason to hold it. If you want
  "turns 21 today", the answer is no.
</Callout>

## Staff anniversaries

Counted from the first day Braven saw somebody holding a staff role. That means your
first anniversaries land a year after installing Braven, not a year after the person
was actually promoted — which is honest, rather than inventing a date.

## The birthday role

Applied for the day and removed the next, so nobody is still wearing it a week later.`,
  },
  {
    path: "engagement/giveaways-polls.mdx",
    title: "Giveaways and polls",
    description: "Run a giveaway with role requirements, or ask the community.",
    commands: ["giveaway", "poll"],
    body: `**Polls** are free. \`/poll\` asks a question with up to 25 options and live results.
One vote per member, changeable.

**Giveaways** are Pro. Set a duration, a number of winners, and optionally require a
role to enter or give boosters bonus entries. Braven draws automatically when it
ends, and can reroll if a winner does not claim.`,
  },
  {
    path: "engagement/messages.mdx",
    title: "Sticky messages and keywords",
    description:
      "Keep a message at the bottom of a channel, or reply when a keyword appears.",
    plan: "Pro",
    commands: ["stickymessage", "keyword"],
    body: `**Sticky messages** stay at the bottom of a channel as people talk. Braven reposts
and deletes the old copy — posting before deleting, so there is never a moment where
the sticky does not exist.

**Keyword responses** reply automatically when a message matches. Match on a whole
word, anywhere in the message, or exactly. Each keyword has its own cooldown so a
busy channel does not turn into a bot conversation.`,
  },
  {
    path: "account/billing.mdx",
    title: "Billing",
    description: "Subscribing, changing plan, invoices and cancelling.",
    commands: ["subscribe", "plan", "referral"],
    body: `\`/subscribe\` gives you a checkout link for this server. Billing is **per server** —
each one is subscribed separately.

## Managing an existing subscription

\`/subscribe\` again opens the Stripe billing portal, where you can change plan, update
your card, download invoices and cancel. Braven never sees your card details.

## Cancelling

Your plan runs to the end of the period you have paid for, then drops to free.
Nothing is deleted — see [plans](/docs/account/plans).

## Failed payments

Paid features keep working for three days after a failed payment, so a declined card
does not take down your ticket system mid-shift.

## Referrals

\`/referral\` creates a code. FiveM runs on community recommendations, and the credit
goes to whoever referred the server.`,
  },
  {
    path: "account/branding.mdx",
    title: "Branding",
    description: "Match Braven to your server: colour, footer and nickname.",
    plan: "Elite",
    commands: ["branding", "embed"],
    body: `Set an accent colour and footer used across every embed Braven sends, so it looks
like part of your server rather than a third-party bot.

Individual [panels](/docs/tickets/panels) can override the colour, which is how one
panel can look different without losing branding everywhere else.

\`/embed\` builds a standalone embed — announcements, rules, anything — using the same
builder. That one is free on every plan.`,
  },
  {
    path: "account/api.mdx",
    title: "API and custom instances",
    description:
      "A read API for your server, and running Braven under your own bot application.",
    plan: "Elite",
    commands: ["api-key", "instance"],
    body: `## The API

\`/api-key create\` issues a token scoped to your server. The token decides the server
— there is no way to read another server's data with it.

Read-only, covering tickets, duty sessions and player records. Useful for a website
that shows staff activity, or for tying Braven's records to your own systems.

Keys are stored hashed. If you lose one, revoke it and make another; it cannot be
shown to you a second time.

## Custom instances

\`/instance\` runs Braven under **your own** Discord application — your name, your
avatar, your bot tag. Members never see the word Braven.

The token is encrypted at rest and never returned by the dashboard. The instance
serves exactly one server: anything arriving from elsewhere is ignored.`,
  },
];

let written = 0;
for (const page of PAGES) {
  const parts = [
    "---",
    `title: ${page.title}`,
    // Quoted: a description containing a colon is invalid YAML unquoted.
    `description: ${JSON.stringify(page.description)}`,
    "---",
    "",
  ];

  if (page.plan) {
    parts.push(
      `<Callout>This is a **${page.plan}** feature. \`/subscribe\` to enable it.</Callout>`,
      "",
    );
  }

  parts.push(page.body, "");

  // The command tables are generated so a renamed subcommand shows up as a docs
  // diff rather than a page that quietly lies.
  const commands = page.commands
    .map((name) => byName.get(name))
    .filter(Boolean);
  if (commands.length > 0) {
    parts.push("## Commands", "");
    for (const command of commands) {
      parts.push(`### \`/${command.name}\``, "", command.description, "");
      if (command.subcommands.length > 0) {
        parts.push("| Subcommand | What it does |", "| --- | --- |");
        for (const sub of command.subcommands) {
          if (sub.subs) {
            for (const inner of sub.subs) {
              parts.push(
                `| \`/${command.name} ${sub.group} ${inner.name}\` | ${inner.description} |`,
              );
            }
          } else {
            parts.push(
              `| \`/${command.name} ${sub.name}\` | ${sub.description} |`,
            );
          }
        }
        parts.push("");
      }
    }
  }

  writeFileSync(`content/docs/${page.path}`, parts.join("\n"));
  written += 1;
}

console.log(`wrote ${written} pages`);
