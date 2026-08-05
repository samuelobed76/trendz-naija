# StitchNaija Rebrand & Pivot Plan

## Goal
Rebuild the app from a shopper-facing fashion store into a tailor/designer-focused platform called **StitchNaija**, with a premium Emerald Prestige visual identity and magazine-style editorial layout.

## Visual Foundation
- **Name:** StitchNaija
- **Palette:** Emerald Prestige — deep emerald (#064e3b), teal (#0d7a5f), gold (#c9a84c), cream (#f5f0e0)
- **Typography:** DM Serif Display (headings), Fira Sans (body)
- **Layout language:** Magazine — large featured hero, editorial grids, asymmetric compositions, generous whitespace
- **Mood:** Premium, crafted, confident, African luxury

## Information Architecture Changes

### New core routes (tailor/vendor facing)
- `/` — Magazine-style home: hero, featured collections, how it works, tailor spotlight
- `/dashboard` — Tailor dashboard: orders pipeline, stats, recent messages
- `/portfolio` — Portfolio/showcase grid for a tailor's work
- `/clients` — Client list with measurements and order history
- `/orders` — Order management (received → in progress → ready → delivered)
- `/measurements` — Client measurement library
- `/chat` — Conversations with clients
- `/account` — Tailor profile, business settings, subscription
- `/auth` — Sign in / sign up (kept, updated branding)

### Routes to repurpose or remove
- `/shop` → replace with `/portfolio` or convert to a public lookbook/catalog
- `/cart`, `/checkout`, `/wishlist`, `/product/$id` → remove from primary nav; may become public client-facing pages later if needed
- `/tailors` → convert to `/community` or tailor discovery (optional v2)
- `/premium` → keep as `/prime` or fold into `/account/subscription`
- `/splash` → update with new brand

## Components to Update
- `AppShell.tsx` — new header, navigation, and mobile bottom nav for tailor workflow
- `SplashGate.tsx` — new brand animation and colors
- Product cards → portfolio/lookbook cards
- Store context → simplify or remove shopper cart/wishlist

## Assets to Generate
- New hero image: editorial tailor workspace / African fabric / craftsmanship
- New logo / wordmark for favicon and splash
- Portfolio sample images (6–8 looks)

## Implementation Steps
1. Update design tokens in `src/styles.css` (colors, fonts, shadows)
2. Update `src/routes/__root.tsx` with new fonts and metadata
3. Replace favicon and splash screen
4. Rebuild `src/routes/index.tsx` as magazine-style home
5. Create `/dashboard` route with tailor KPIs and order pipeline
6. Create `/portfolio` route with lookbook grid
7. Create `/clients` route with measurement cards
8. Update `/orders` and `/orders/$id` for tailor order management
9. Update `/chat` and `/chat/$tailorId` to client-chat context
10. Update `/account` for tailor profile
11. Update `AppShell.tsx` navigation
12. Remove or hide shopper-only routes from nav
13. Run build and verify

## Out of Scope for This Pass
- Real payment integration
- Admin dashboard (now replaced by tailor dashboard)
- Client-side booking/payment flows
- Multi-vendor marketplace features

## Verification
- Build passes
- Mobile and desktop screenshots of home, dashboard, portfolio, orders, chat, account
