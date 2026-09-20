# Advanced Heating & Air — site mockup

A static mockup of a rebuilt advancedairtucson.com, for review before the client sees it.
Prepared by AZ Technology Solutions, 20 September 2026.

**This is not the live site.** The live site is https://advancedairtucson.com and nothing here
is published to it. `robots.txt` and a `noindex` tag on every page keep it out of search so it
cannot compete with the real site.

**Live at:** https://djangelic.github.io/advancedair-mockup/

## Pages

| file | what it is |
|---|---|
| `index.html` | Home. Ordered phone → service area → trust → everything else, because this is an emergency service. Their live site has no home page at all. |
| `services.html` | Residential and commercial, written from their own copy. |
| `coupons.html` | **The product.** Three offers as text cards with a print view. |
| `contact.html` | Leads with the phone; the message form is mocked. |
| `404.html` | Branded, and still offers the phone number. |
| `brief.html` | **Internal.** The audit findings and the argument, for Angel — not linked from any client-facing page. |

## Editing the coupons

`data/coupons.json` holds the amounts, wording, redemption codes and the expiry.
Change the file, save, and the site updates. No developer, no HTML.

## What is deliberately mocked

The newsletter signup and the contact form look and behave real but send nothing. The
newsletter tool is undecided by ruling; the real contact form goes to an n8n webhook with a
honeypot and a classifier, per the Off WordPress plan.

## What the audit found

- The coupons page was **three PNG screenshots from 5 August 2021** — invisible to search,
  unreadable to a screen reader, uneditable without Photoshop.
- **No redemption mechanism at all.** "Mention this ad" — no code, no tracking, no capture. Four
  years of coupons with no way to know whether one ever produced a call. That is what the
  `AHA-` codes fix.
- The coupons **never expire**: `Expires 12/31/[wpsos_year]` rolls the year forward silently.
- **No home page** — `show_on_front` is `posts`, so the site serves a blog roll.
- Every page dates to **31 May 2012**. Theme is `alyeska`.
- Their **Rheem badge links to a dead domain** (`advancedairtucson.myvirtualhvac.com`, HTTP 000).
- The **ROC licence was buried in a sidebar widget**. It is in the hero and footer now.

## Open questions for the client

1. Is **520-349-9606** still the number they answer? Corroborated by the coupons and the site's
   own About widget, but both are old.
2. **Office hours** — the live site never states them, so the page says "to be confirmed".
3. Does the **Tax Credits** page still matter? Federal HVAC credits have changed since 2012.
4. **Photos** of the truck or crew. The only imagery in their library is dated Tempstar
   manufacturer stock — a model in a competitor's polo — deliberately not used.

## Not built

Photography, a map on the contact page, an About page (the home page trust band absorbs most of
what one would carry), and the live newsletter wiring.
