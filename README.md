# Advanced Heating & Air — site mockup

A static mockup of a rebuilt advancedairtucson.com, for review before the client sees it.
Prepared by AZ Technology Solutions, September 2026.

**This is not the live site.** The live site is https://advancedairtucson.com and nothing here
is published to it.

## What it is

- `index.html` — home page, ordered phone → service area → trust → everything else
- `coupons.html` — the coupons page, which is the product rather than a page
- `data/coupons.json` — **the offers and the expiry live here.** Edit this file, save, done.
  No developer, no HTML.
- `js/coupons.js` — renders the coupons from that file; the email signup is **mocked**
  so the flow can be seen before a newsletter tool is chosen
- `assets/` — the real logo and the original 2021 coupon images from the live site

## Notes for review

- The three offers are the real ones, read off the current site's coupon images.
- The phone number **520-349-9606** is corroborated by the site's own About widget as well as
  the coupons; still worth confirming with the client.
- Office hours are marked "to be confirmed" because the live site does not state them.
- `robots.txt` and a `noindex` meta tag keep this out of search so it cannot compete with
  the live site.
