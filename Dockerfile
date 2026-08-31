# braven-help — the public documentation at docs.bravenbot.com.
#
# Built from this repo's root:
#   docker build -t braven-help .
#
# The docs are entirely static once built: no database, no API calls, no
# secrets. That is why there are no build arguments here beyond the two public
# URLs, and why this container can be rebuilt and restarted at any time without
# coordinating with anything else in the stack.

FROM node:22-alpine AS build

RUN corepack enable
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# postcss.config.mjs is not optional. Tailwind v4 is a PostCSS plugin and
# nothing else, so without it `next build` runs with no PostCSS pipeline,
# Fumadocs' preset emits no rules, and the build succeeds while producing a
# completely unstyled site.
COPY tsconfig.json next.config.mjs postcss.config.mjs biome.json ./
COPY src src
COPY content content

# NEXT_PUBLIC_* is inlined into the client bundle at build time, not read at
# boot, so these have to be present *here*. Passing them as runtime environment
# would bake in the defaults and no restart would fix it.
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_SUPPORT_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SUPPORT_URL=$NEXT_PUBLIC_SUPPORT_URL

RUN pnpm build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# The standalone server reads PORT and HOSTNAME, defaulting to 3000 and
# localhost. 3000 is braven-api's port and 3001 is braven-web's, so the docs
# take 3002 — and a server bound to localhost inside a container answers
# nothing from outside it.
ENV PORT=3002
ENV HOSTNAME=0.0.0.0

COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static

EXPOSE 3002
USER node
CMD ["node", "server.js"]
