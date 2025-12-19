### Linkify – Device-aware redirector

This is a Next.js 16 app that builds a landing page readable by mobile/desktop visitors and forwards them to the correct destination when a device-specific query is provided.

**Key behaviors**
- parses `deviceN`/`urlN` search params (case‑insensitive, covering mobile/desktop keywords).
- detects the incoming `user-agent`, picks the first matching entry, and replaces the default log output with an animated status line.

**Getting started**

```bash
npm install
npm run dev
```

Visit `http://localhost:3000/?device1=mobile&url1=https://example.com` (etc.) in different browsers/UA emulators to exercise the redirect logic.

**Build & lint**

```bash
npm run lint
npm run build
```

**Production**

Deploy with Vercel/Next.js hosting just like any App Router project; the redirect logic runs server-side, so every visitor landing on `/` is routed immediately whenever a match exists.
