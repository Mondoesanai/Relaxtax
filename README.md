# Relax Tax & Business Services — website

Family-run tax firm in Plano, TX. Coastal-calm design, mobile-first, no build step.

## Run it locally
Double-click **`START SERVER.bat`** (opens http://localhost:3090), or:
```
node serve.mjs
```

## Pages
| File | Purpose |
|------|---------|
| `index.html` | Home — hero, stats, why-us, services preview, Relax-o-meter, process, reviews |
| `services.html` | Full service list — Individuals / Businesses toggle + accordions |
| `about.html` | Story (Jim → Kyle), team bios (Kyle EA, Stephen CPA), values |
| `contact.html` | Three "reach us" cards (call/email/visit), what-happens-next, directions card — no form |
| `quote.html` | 5-step **Request a Quote** wizard (the only lead form; emails on submit) |

## What's real vs. simulated
- **Quote wizard** is the only lead form (the separate contact form was removed — everything
  funnels here or to phone/email). On the final step it POSTs to `CONFIG.formEndpoint` in
  `js/main.js` — currently `https://formsubmit.co/ajax/Tax@relaxtaxes.com`. FormSubmit needs a
  one-time activation (the first real submission emails a confirm link). Swap in the confirmed
  address, or change the endpoint to GoHighLevel / Formspree / your own handler. The success
  screen shows regardless so the demo always feels complete.
- **Deep links:** `quote.html?service=bookkeeping` (or `tax`, `payroll`, `planning`, `irs`,
  `startup`, `quickbooks`) pre-checks that service. The per-service "Get a quote for this"
  buttons on the Services page use this. `?stress=high` also pre-selects a situation.
- **Relax-o-meter** button text + link change with the slider; at the top ("overwhelmed") it
  becomes an urgent "Get me a call — today" `tel:` button.
- **Reviews** are seeded placeholders in `js/main.js` (`SEED_REVIEWS`). Floating bubble,
  on-page marquee, and "Leave a review" modal all work; submitted reviews save to the visitor's
  browser only. Swap in real Google reviews by editing `SEED_REVIEWS`.
- Public review count shows `100 + (reviews left this session)` — change the base in `main.js`.

## Images (`images/`)
- `logo.png`, `team-kyle-jim.png`, `stephen-peyton.png` — real client assets.
- `beach-band.jpg`, `palms-sky.jpg`, `coastal-dawn.jpg`, `pro-cafe.jpg` — free Pexels stock
  (commercial use, no attribution). `beach-band.jpg` is the home photo band.
- `atmo-*.jpg` — AI-generated (Pollinations) atmosphere backgrounds, placeholder quality.
  Regenerate at higher fidelity once an image API key is set — see `.env.example`.
- Drop replacement photos in with the same filename to swap them in.

## Island intro + ambient sound
- **Intro** (`#intro` on every page): a full-screen animated island scene (inline SVG) — sunset
  gradient sky, the sun rises, birds drift in, three layered waves slide up and then keep
  drifting, a palm grows with a gentle sway. Copy: "Give yourself permission to relax about
  taxes." + a **Step onto the island** button. Shows **once per browser session**
  (`sessionStorage.relaxtax_entered`); a tiny inline `<head>` script hides it with no flash on
  later pages. Clicking the button (or "skip") is the gesture that starts the music.
- **Audio**: `audio/ambient.mp3` ("Sunset Island Voyage" by Djovan), `<audio id="ambient-audio">`
  on every page, `preload="metadata"`. Starts on the intro button, fades in over ~0.9s, loops.
  **Keeps playing across page navigation** — on each new page it auto-resumes (works on Chrome
  after the first play; on stricter browsers it resumes on the first click). Bottom-left toggle
  mutes/unmutes. Missing file → synthesized ocean fallback. Swap the mp3, keep the filename.
- `serve.mjs` now supports **HTTP Range** so the 14MB track streams instantly on localhost.
  A smaller re-encode (~96–128 kbps) would start even faster.
- **Wave dividers** (`.wave-sep`) drift continuously — layered SVG waves translated on a loop.

## Brand palette
Ocean teal `#023a51` · aqua `#5cc6d0` · tropical green `#2cbc63` · sun gold `#ffcc29` ·
seafoam `#e9f3f1` · warm paper `#fbfaf6`. All defined as CSS variables at the top of `css/style.css`.

## Email
Per the client, the email address is **not shown publicly** (their live site does the same).
`Tax@relaxtaxes.com` is used only server-side as the quote form's delivery address
(`CONFIG.formEndpoint`). Everywhere email would normally appear — the footer "Send us a message"
link and the Contact page's middle "Send a message" card — routes to `quote.html` instead.
No `mailto:` links anywhere. First real quote submission triggers FormSubmit's one-time
activation email to that address.

## To confirm with the client
- Real client reviews to seed.
- Solo photo of Kyle (only a two-person photo with Jim is on hand).
- Where quote / contact submissions should go.
