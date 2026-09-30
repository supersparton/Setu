# syntax=docker/dockerfile:1

# corepack ships pnpm with node 22; the version is pinned here, not in the image,
# so the local machine and CI produce the same lockfile resolution.
FROM node:22-alpine AS build
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@12.4.1 --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY tsconfig.json ./
COPY src ./src
RUN pnpm build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable && corepack prepare pnpm@12.4.1 --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile && pnpm store prune
COPY --from=build /app/dist ./dist

# Cloud Run overrides PORT; kept aligned with .env.example.
ENV PORT=8080
EXPOSE 8080

USER node
CMD ["node", "dist/main.js"]
