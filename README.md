# Voltix — demo e-commerce store (QA test target)

A small, **static** e-commerce site built to be a clean, bot-friendly target for QA
automation (Meridian / mabl / Playwright). No backend, no CAPTCHA, no 2FA — auth and
cart live in `localStorage`.

## Demo login
```
Email:    shopper@voltix.io
Password: Voltix123
```
(shown on the login page too)

## Pages / flows a crawler will find
- `login.html` — sign-in form (guarded pages redirect here when logged out)
- `products.html` — catalog: 12 products, category filter (`?cat=`), search
- `product.html?id=N` — product detail: add to cart / buy now
- `cart.html` — quantities, remove, live totals (subtotal + shipping + 8% tax)
- `checkout.html` — shipping + payment form with validation
- `confirmation.html?order=…` — order confirmation
- `account.html` — profile + order history + **Sign out**

## Run locally
```bash
python3 -m http.server 4321      # then open http://localhost:4321
```

## Deploy to Vercel
It's a plain static site — zero config.
```bash
npm i -g vercel        # or use: npx vercel
vercel login           # one-time (opens browser / emails a code)
vercel                 # deploy a preview URL
vercel --prod          # promote to the production URL
```
When prompted: accept the detected settings (framework: **Other**, output: current dir).
Vercel prints the public URL — that's what you connect in Meridian.

> Demo only — not a real shop; no payments are processed.
