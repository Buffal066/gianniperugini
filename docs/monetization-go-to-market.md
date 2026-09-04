# Monetization go-to-market

**Shared source of truth for Cursor + Codex.**  
Update this file when a step finishes (`[ ]` → `[x]`), either directly or through the local interactive checklist. In either tool, say: *Read `docs/monetization-go-to-market.md` and continue the next open checklist item.*

- **Updated:** 2026-09-01
- **Agency:** https://glacenoire.com/
- **Art hub:** https://glacenoire.com/art
- **Store:** https://gianniperugini.com/archive.html  
- **Free sample (Payhip):** https://payhip.com/b/lFO2d  
- **GA4 (Gianni):** `G-EZ82P4XTFW`  
- **GA4 (Glace Noire):** `G-5BTGRF0PWS`
- **Last market recheck:** 2026-09-01

## Status

Ops + tracking are done and the catalog is fully buyable. Two things changed the plan on 2026-08-30.

First, **the $1–$6 wallpaper ladder is now the lowest-margin corner of this market.** Generic AI wall art and print packs are the most commoditized digital-product category of 2026: high search volume, low intent to pay, near-infinite supply. The store is built and paid for, so keep it running — but adding Pins to sell $4 packs is not a path to financial independence, and treating it as the main engine was the plan's biggest error.

Second, **the scarce good is now trust, not supply.** Buyers have been burned by unedited AI output, and platforms label AI content automatically. That cuts both ways: it is a risk to the planned Pinterest channel, and it is the clearest opening for a real artist with a coherent brand, actual photography, and honest disclosure.

So the emphasis moves from *more volume into a commodity* to *higher-margin offers plus a defensible, disclosed brand*.

| Metric | Value |
| --- | --- |
| Catalog Payhip pages buyable | 17 / 17 |
| Discovery + on-site tracking | GSC + GA4 live |
| Checkout path | Verified |
| Best-margin existing SKU | Commercial archive, $79+ — currently buried |
| Product-level AI disclosure | Not published yet — blocks Etsy and weakens trust |
| Distribution tasks still open | Email signature + first short video + hybrid Pins + social links |
| Current job-search constraint | Employment is urgent. Cap store work at roughly 20% of the week until applications and interviews are moving. |

**Next open action:** In one bounded 90-minute block, publish the "How these are made" AI-disclosure page and add the professional email signature. Then return to the job sprint. Reuse the first 6–10s portfolio motion proof as the first Glace Noire Reel/TikTok; do not create three separate videos before applying for jobs.

---

## Market recheck — 2026-08-30

| Change in the market | Consequence for this plan |
| --- | --- |
| Generic AI wall art / print packs are now heavily commoditized — strong search volume, weak intent to pay, terrible margins. What sells is a *system* solving a specific need, bought for saved time. | **Changed:** volume into $4 packs is demoted. New **Higher-margin tracks** section added. The $79+ commercial licence and service work move to the front. |
| Pinterest auto-applies an "AI modified" label using its own classifiers, even with no metadata markers, and is testing a per-topic "see fewer AI Pins" control **specifically in art and beauty** — the exact category here. | **Changed:** Pinterest is no longer assumed to be the top channel. New **Pinterest AI-label mitigation** section. Use real photographic plates and in-situ shots, expect the label, appeal misclassifications, and confirm with data before scaling. |
| EU AI Act Article 50 has applied since 2026-08-02. Deployer disclosure is triggered for content that would falsely appear authentic; purely fantastical art generally is not a deepfake, but product imagery that misleads about what the buyer receives is exposed. | **Changed:** compliance section added. Store mockups must represent the actual delivered files. Do not strip provenance metadata that AI tools embed. |
| Etsy's Seller Policy (effective 2026-07-09) requires disclosing an item created through AI, and classifies seller-prompted AI work as "Designed by a seller." | **Changed:** the optional Etsy item now has a hard prerequisite — the disclosure page and per-listing disclosure must exist first. |
| Agentic commerce is live: ChatGPT, Copilot, and Google AI Mode now surface and transact products, and roughly 60% of traditional search-referral intent has moved into AI surfaces. Structured product data is the new ranking substrate. | **Mostly ready, one gap:** Product JSON-LD, sitemap, and `llms.txt` are already in place and ahead of most sellers. AI-referred traffic is invisible in GA4 by default, and Payhip's off-site checkout is not agent-native. New **Agent discovery** section. |
| Zedge remains a high-volume, ad-revenue wallpaper channel with fast time-to-traction. | **Added** as a low-effort volume test against the existing 168 files. |

**What did not change:** free sample as lead magnet, the revenue ladder shape, collection SEO pages, Glace Noire as the public social brand with checkout on gianniperugini.com, and "don't spend on ads before an organic baseline." Those held up.

### Market recheck — 2026-09-01

| What changed or was reconfirmed | What was fixed |
| --- | --- |
| The user confirmed that no short-form videos have been created. The previous top-level “push everywhere” item was checked even though the email signature and three videos were still open. | Corrected the top-level item to incomplete. One shared 6–10s motion proof now serves the portfolio and the first Glace Noire post; three separate videos no longer block the job search. |
| Etsy’s current Seller Policy still requires an accurate description and disclosure when an item is created with AI. | Kept the disclosure page as the one short compliance block worth doing now; Etsy expansion stays optional and later. |
| Pinterest still uses metadata plus classifiers to label AI-modified Pins, and people can tune down GenAI interests. | Kept Pinterest as an experiment, not the primary revenue engine. No metadata-stripping or label-evasion work is allowed. |
| The earlier monetization review still supports the existing $0 / $1 / $4 / $6 / $19–$29 / $79+ ladder, while the 2026-08-30 correction puts growth on services and commercial licensing. | Preserved pricing. Moved the $79+ commercial licence and a concrete creative-production service offer into the first monetization sprint; no new low-price wallpaper SKU work. |
| Job applications are now the highest-urgency outcome. | Added an 80/20 operating rule: employment work first; monetization gets one bounded block and must reuse portfolio assets. |

---

## Checklist

### Completed

- [x] Add GA4 + CSP allowlist; track Payhip outbound clicks
- [x] Fix Measurement ID and confirm Realtime
- [x] Install Glace Noire GA4 (`G-5BTGRF0PWS`) + CSP allowlist
- [x] Update `llms.txt` — individuals are live
- [x] Contact form → iCloud; contact@ domains on iCloud Mail
- [x] Mobile store matches desktop (Featured / Other + preview UX)
- [x] Catalog + 168 individuals buyable from the site
- [x] Verify domain + submit `sitemap.xml` in Google Search Console
- [x] Run one free + one paid test purchase; confirm ZIP delivery and Quebec tax
- [x] Add glacenoire.com/art landing → Gianni store + free sample
- [x] Add a shared interactive checklist backed directly by this Markdown file

### In progress

- [ ] **Finish pushing the free sample everywhere** — social bios are live; email signature, first Reel/TikTok and Pins remain open
- [x] Create Glace Noire social accounts (not personal Instagram)

### Fast monetization sprint — maximum one workday, then back to applications

- [ ] **90 minutes:** publish the "How these are made" page and link it from the store / FAQ / licensing entry points
- [ ] **30 minutes:** add the Glace Noire professional email signature with the free-sample link
- [ ] **2 hours:** publish a clear $79+ commercial-licence page with named use cases and an enquiry CTA
- [ ] **2 hours:** publish one creative-production service offer for local brands: campaign stills, short motion, and batch content systems
- [ ] **Reuse, do not duplicate:** post the portfolio’s first 6–10s Glace Noire motion proof as Reel/TikTok #1 with a sample CTA
- [ ] Stop after this sprint and return to applications; Pins 2–10, Etsy, Zedge and extra SKUs wait until interviews/applications are moving

### Compliance + trust — do first, this gates the rest

Cheap, fast, and it unblocks Etsy while turning a liability into the brand's main differentiator.

- [ ] Publish a "How these are made" page: which tools, where AI enters, what is hand-finished, what the buyer receives
- [ ] Link that page from the store, FAQ, licensing, and every `digital-art/*.html` collection page
- [ ] Confirm every store mockup shows the actual delivered files — no upscaled or re-rendered previews that flatter the product
- [ ] Do **not** strip provenance / IPTC metadata from exports; platforms detect AI anyway and stripping reads as concealment
- [ ] Add a plain-language AI note to the Payhip product descriptions for the sample, collections, and archives
- [ ] Confirm licensing copy states what a buyer may do with AI-assisted work (personal vs. commercial)

### Pending — distribution

- [ ] Ship the first shared 6–10s motion proof as Reel/TikTok #1; videos 2–3 and 10 Pinterest Pins follow only after the job sprint
- [ ] Add social profile links on site (+ Person schema `sameAs` when ready)
- [ ] Add a conversion path inside the free-sample ZIP (`START-HERE` guide → related collections + store)
- [ ] Configure consent-based email capture and a short post-download sequence
- [ ] Optional: Etsy listings for 4–6 best collections + personal archive — **only after** the disclosure page exists and per-listing AI disclosure is written
- [ ] Test Zedge with 20–30 existing wallpapers for ad-revenue volume and demand signal

### Higher-margin tracks — where the real money is

The $1–$6 ladder cannot fund independence at realistic traffic. These can. Each one reuses work that already exists or is already planned.

- [ ] Surface the $79+ commercial licence properly: its own page, a use-case list (streamers, game backdrops, book covers, venues), and a link from every collection page
- [ ] Package one *use-case* product instead of a style pack — e.g. stream overlays, book-cover plates, or venue loops — priced for the job it does, not per image
- [ ] Publish a creative-production service offer on glacenoire.com: AI-assisted campaign visuals and batch content for local brands, using the Track B pipeline from the portfolio plan
- [ ] Add a commercial-licence enquiry path to the contact form (separate from job enquiries)
- [ ] Quote one paid pilot for a Montréal business or agency at service rates, not product prices

### Pinterest AI-label mitigation

Pinterest labels AI content automatically and is testing a per-topic "see fewer" control in art categories. Plan for the label instead of hoping to dodge it.

- [ ] Build Pins from real photographic plates where possible — the existing photography archive is a genuine advantage here, not a workaround
- [ ] Favour in-situ Pins (artwork on a real phone or monitor, shot on camera) over bare artwork exports
- [ ] Mix process and creation content with product Pins; pure product feeds read as low-effort to both users and the algorithm
- [ ] Track impressions per Pin and record which ones carry the AI label
- [ ] Appeal labels only where genuinely misapplied — https://help.pinterest.com/en/article/gen-ai-labels
- [ ] Decide after 30 days of data whether Pinterest stays the primary channel or drops behind Zedge / short-form

### Agent discovery (AEO / GEO)

AI assistants now answer product questions and increasingly transact. Structured data already in place puts this site ahead; the gap is measurement.

- [ ] Add AI-assistant referrers as a tracked traffic segment in GA4 (ChatGPT, Perplexity, Copilot, Gemini)
- [ ] Verify every collection page exposes accurate price, formats, resolutions, and licence in Product JSON-LD
- [ ] Keep `llms.txt` current whenever the catalog or pricing changes
- [ ] Confirm AI crawlers are not blocked in `robots.txt`
- [ ] Note the limitation: Payhip's off-site checkout is not agent-native, so agent-assisted buyers must hand off to a normal browser — revisit only if AI-referred sessions become material

---

## Brand routing

Do not use a personal Instagram for this campaign. Public socials are **Glace Noire**. Checkout stays on **gianniperugini.com**.

| Surface | Role | URL |
| --- | --- | --- |
| glacenoire.com | Agency / media | https://glacenoire.com/ |
| glacenoire.com/art | Art hub for social traffic | https://glacenoire.com/art |
| gianniperugini.com/archive.html | Shop / catalog | https://gianniperugini.com/archive.html |
| Payhip sample | Instant free download | https://payhip.com/b/lFO2d |

**Social bio rule:** display name / handle = Glace Noire. Suggested handle: `@glacenoire` (or closest available). Use a work inbox, not a personal email.

If the platform allows two links:

1. Free sample: https://payhip.com/b/lFO2d
2. Art hub: https://glacenoire.com/art

If it allows only one link, use https://glacenoire.com/art and keep **Free sample** as the first button on that page.

Pinterest’s Website field rejects paths. Public site is `https://glacenoire.com` (verified). Homepage → Digital Art Store (`/art`) still carries the free sample.

---

## Social accounts to create

Create these as **Glace Noire** business/creator accounts. Click the URL, sign up, then come back and check the box only after the live profile exists.

Live Instagram: https://www.instagram.com/glace_noire_studio/ (Creator, category Art, display name Glace Noire)

### Required now

- [x] Instagram Creator — https://www.instagram.com/accounts/emailsignup/
- [x] Switch that Instagram to Creator or Business (Settings → Account type and tools)
- [x] TikTok — https://www.tiktok.com/signup
- [x] Pinterest Business — https://www.pinterest.com/business/create/

### Add if the platform allows a second link, or skip if Instagram already has two links

- [x] Linktree (optional) — skipped; Instagram already has two links

### Later / optional

- [ ] YouTube channel — https://www.youtube.com/create_channel
- [ ] Threads (uses the Instagram account) — https://www.threads.com/login
- [ ] Facebook Page — https://www.facebook.com/pages/creation/?ref_type=launch_point
- [ ] X / Twitter — https://x.com/i/flow/signup

After each required account exists, set the bio and links before marking the matching “bio → free sample” item below.

---

## Free sample push — how to finish

**Links to use**

- Art hub: https://glacenoire.com/art  
- Free sample product page: https://payhip.com/b/lFO2d  
- Store: https://gianniperugini.com/archive.html  

The Payhip link is a free product/checkout page, not a raw file URL. Buyers enter an email address but do not need payment details.

**Done when all are checked**

- [x] Instagram bio → free sample
- [x] TikTok bio → free sample
- [x] Pinterest profile → free sample (public site `https://glacenoire.com`; About mentions the free 6-pack)
- [ ] Professional email signature → free sample
- [x] Linktree / link-in-bio — skipped; Instagram already has two links
- [ ] 3 Reels/TikToks posted with CTA to sample
- [ ] 10 Pins live (sample + collection heroes)

**Bio one-liner:** `Free dark-art wallpapers — 3 desktop + 3 mobile ↓`  

**French bio option:** `6 fonds d’écran sombres gratuits — ordinateur + mobile ↓`  

**Email signature:**

```text
Gianni Perugini
Glace Noire
contact@glacenoire.com

Original dark art for desktop + mobile
Free 6-pack: https://payhip.com/b/lFO2d
Shop: https://gianniperugini.com/archive.html
```

**Caption template:**

```text
Six dark-art wallpapers, free for personal use:
3 × 4K desktop files + 3 mobile compositions.
No payment required. Instant digital download.

Link in bio → Free sample
Full collections: gianniperugini.com/archive.html
```

Do not claim “no spam.” If marketing follow-up is enabled, use a clear consent choice and honour unsubscribe requests.

**Suggested order:** disclosure page → professional signature → 3 videos → schedule 10 hybrid Pins over 2–3 weeks. Create boards when the first Pins are ready.

### Channel routing

| Content | Destination | Reason |
| --- | --- | --- |
| Social profile / brand hub | https://glacenoire.com/art | Glace Noire is the public art brand |
| Bio / “get it free now” CTA (if two links) | https://payhip.com/b/lFO2d | Fewest steps to the sample |
| Sample-artwork Pin or Reel | https://payhip.com/b/lFO2d | Direct lead-magnet conversion |
| Collection hero / artwork story | Matching `digital-art/*.html` page | Lets buyers preview desktop + mobile before Payhip |
| Shop / full catalog | https://gianniperugini.com/archive.html | Checkout and product SEO live here |

---

## Live catalog

| Offer | What | Price | Where | Status |
| --- | --- | --- | --- | --- |
| Free sample | Dark Art Sample Pack | $0 | https://payhip.com/b/lFO2d | Buyable |
| Collections | 14 series | $4 / $4 / $6+ | Site + Payhip | Buyable |
| Individuals | 168 wallpapers | $1+ | Store lightbox | Buyable |
| Personal archive | Complete Dark Art Archive — Personal | $19–$29+ | https://payhip.com/b/WDg0R | Buyable |
| Commercial archive | Complete Dark Art Archive — Commercial | $79+ | https://payhip.com/b/ZUP3V | Buyable |

---

## Readiness

| Area | Evidence | Status |
| --- | --- | --- |
| Branded storefront | archive.html live with Buy CTAs | Ready |
| Collection SEO pages | 14 `digital-art/*.html` + Product JSON-LD | Ready |
| Payhip checkout links | 17 catalog URLs buyable | Ready |
| Individual SKUs | 168 enabled with Payhip URLs | Ready |
| FAQ + licensing | Live | Ready |
| Analytics | GA4 + `payhip_click` events | Ready |
| Glace Noire analytics | GA4 on glacenoire.com | Ready |
| Contact → iCloud | FormSubmit + contact@ | Ready |
| Mobile store UX | Featured/Other + preview defaults | Ready |
| Search Console | Domain verified; sitemap submitted | Ready |
| Owned audience | No newsletter / email capture yet | Gap |
| Off-site distribution | No blog, no social links on site, no Etsy yet | Gap |
| Product-level AI disclosure | Identity pages mention AI; store, FAQ, and licensing do not | Gap — blocks Etsy |
| AI-referral measurement | Assistant traffic not segmented in GA4 | Gap |
| Higher-margin offers | $79+ commercial licence exists but is buried; no service offer published | Gap |

---

## SEO / AEO / GEO / Ads

| Channel | Grade | Notes |
| --- | --- | --- |
| SEO (Google) | Strong foundation | Canonicals, meta, OG/Twitter, sitemap, robots, Product schema, GSC verified |
| AEO / GEO | Mostly ready | `llms.txt` updated; AI bots allowed; add `sameAs` when socials exist |
| Google Ads | Tracking ready; don’t spend yet | Start unpaid distribution first |
| Payhip discovery | Secondary | Checkout engine; SEO lives on gianniperugini.com |

---

## Revenue ladder (keep as-is)

| Offer | Price | Role |
| --- | --- | --- |
| Free sample | $0 | Lead magnet / trust |
| Individual wallpaper | $1+ | Impulse favorite |
| Collection one format | $4+ | Core SKU |
| Collection both formats | $6+ | Best personal upsell |
| Personal archive | $19–$29+ | Power buyer |
| Commercial archive | $79+ | Creators / businesses |

Push: **free → featured collections → archive.** Don’t rebuild pricing before traffic data.

---

## Traffic channels

| Channel | Role | Playbook |
| --- | --- | --- |
| Free sample push | Highest leverage now | Every bio, Reel, Pin, outreach |
| Pinterest | High-intent hypothesis | Pin collection pages + sample; confirm with analytics |
| Instagram / TikTok Reels | Awareness | Install demos, texture close-ups; CTA → sample |
| Etsy (4–6 listings) | Paid discovery | Top collections + mega bundle later |
| Google organic | Compounding | Collection pages already structured |
| Email list | Owned traffic | After sample / purchase |
| Small paid ads | After baseline | Cap spend until a collection converts |

### Pinterest execution standard

- Use a Pinterest Business account and claim `gianniperugini.com`
- Create original vertical Pins at 2:3 (recommended working size: 1000 × 1500)
- Schedule the first 10 Pins over 2–3 weeks instead of publishing them all at once
- Use descriptive, natural keywords in Pin titles, descriptions, board titles, and board descriptions
- Publish English and French variants where practical
- Suggested boards: Dark Phone Wallpapers, Gothic Desktop Wallpapers, 4K Dark Art, Neon Noir Wallpapers, Fonds d’écran sombres
- Review outbound clicks and saves; do not assume Pinterest is the best channel until the data confirms it

### Short-form content standard

The first three videos are a test batch, not the end of the campaign:

1. Phone wallpaper installation / lock-screen reveal
2. Texture close-ups (burned paint, soot, neon rain)
3. Before/after: default screen → Gianni artwork

Use the same offer but edit natively for each platform. Avoid making every post a hard sell; mix wallpaper use, artwork details, and creation/process content.

---

## Payhip ops (optional polish)

| Item | Why |
| --- | --- |
| Discount codes / sales | Urgency for launch or first purchase |
| Email capture in Payhip | If site newsletter isn’t ready |
| Feature collections in shop | Control what shop browsers see first |
| Custom domain (optional) | `shop.gianniperugini.com` for branding |

---

## Free-sample conversion path

Traffic alone is not the full funnel. Target flow:

**Post / Pin → free sample → useful download experience → related collection → paid offer**

### Sample ZIP follow-through

Add a concise `START-HERE` guide to the delivered ZIP before scaling promotion. It should contain:

- Thank-you message
- Names of all six included wallpapers
- Desktop/mobile installation guidance
- Link from every sample artwork to its related full collection
- Store link: https://gianniperugini.com/archive.html
- Personal-use reminder

Do not mark this complete until a fresh Payhip sample download contains the updated guide.

### Consent-based email follow-up

Payhip supports free products as lead magnets and can connect products to supported email providers. Marketing email must use appropriate consent, sender identification, and unsubscribe handling; Gianni operates from Canada, so use a CASL-conscious explicit opt-in rather than assuming every downloader wants promotions.

Suggested sequence after consent:

1. Immediately: download help + artwork names
2. Day 2: “Which style did you prefer?” → related collections
3. Day 5: explain mobile vs 4K desktop and $4/$6 options
4. Day 9: introduce the $19–$29 personal archive; mention commercial only when relevant

References:

- Payhip lead magnet: https://help.payhip.com/article/311-use-payhip-as-lead-magnet
- Payhip mailing lists: https://help.payhip.com/article/90-mailing-lists
- CRTC CASL consent guidance: https://crtc.gc.ca/eng/com500/guide.htm

---

## Conversion focus

- Lead every campaign with the free sample
- Feature 4 collections hard; keep the rest secondary
- Lightbox path: $1 individual → full collection upsell
- Use Payhip for “get the sample now”; use collection pages for artwork-specific discovery

---

## Measurement and review

Existing measurement IDs (do not replace without verification):

- Gianni GA4: `G-EZ82P4XTFW`
- Glace Noire GA4: `G-5BTGRF0PWS`

Track weekly:

| Funnel stage | Primary signals |
| --- | --- |
| Content reach | Views, watch time, saves |
| Interest | Profile visits, collection-page sessions |
| Traffic | Payhip clicks (`payhip_click`) and visitor sources |
| Lead conversion | Free-sample product views → downloads |
| Owned audience | Explicit email opt-ins |
| Revenue | Individual, collection, archive, and commercial sales |

Review after 30 days, not after a single post. Double down on the artwork styles and channels that generate qualified clicks, downloads, and sales—not merely likes.

## Do not prioritize yet

- Large Google Ads spend before organic baseline
- Full blog before distribution is running
- Listing all 168 individuals on Etsy
- Store redesign — funnel and traffic matter more now
- More volume into $1–$6 packs as the primary growth plan (2026-08-30 correction — margins there are the worst in the category)
- Stripping AI metadata or otherwise trying to defeat platform AI detection; disclose instead
- Any Etsy listing before the AI-disclosure page and per-listing disclosure exist

---

## 90-day plan

Revised 2026-08-30. The product store keeps running in the background; the growth bet moves to margin.

1. **Week 1 (bounded around the job sprint):** Disclosure page + email signature. Publish the $79+ commercial-licence page and service offer. Reuse the portfolio micro-clip as Reel/TikTok #1. Do not build three separate videos before applications.
2. **Weeks 2–6:** Finish the remaining two short videos and hybrid Pins only if the first post produces useful clicks. Activate consent-based email follow-up. Etsy only after disclosure is live; Zedge remains a low-priority test.
3. **Weeks 7–12:** Quote one paid pilot at service rates. Ship one use-case product. Commercial-licence outreach. Small paid tests only if a collection has already converted organically.  

**The 30-day question to answer honestly:** did any channel produce paid conversions, or only downloads? If only downloads, shift the remaining effort to services and commercial licensing rather than adding more $4 SKUs.

---

## How to use with Cursor and Codex

1. Treat this Markdown as the checklist of record. Cursor and Codex can both edit it directly.  
2. Start the interactive checklist from the repository root:  
   `python scripts/monetization-checklist-server.py`  
3. Open `http://127.0.0.1:8771/`. Checking or unchecking an item writes the change to this Markdown file immediately. The page also detects direct edits made by Cursor or Codex.  
4. Keep only one checklist server running. Stop it with `Ctrl+C` when it is no longer needed.  
5. Prompt either agent:  
   `Read docs/monetization-go-to-market.md. What’s the next open item and help me execute it.`
