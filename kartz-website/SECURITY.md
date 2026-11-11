# Kartz PK website: security review

Reviewed 11 November 2026.

## Where data goes today

The site is static. It has no server, no database, no cookies, no analytics and no login. The booking form never sends anything to us. It builds a WhatsApp message in the visitor's browser and opens WhatsApp. The message is only sent if the visitor presses send in WhatsApp.

So the website itself holds no customer data. Bookings live in the business WhatsApp account, and that is the place to protect (see "Operational" below).

## Fixed in this review

| Issue | Risk | Fix |
| --- | --- | --- |
| Fonts loaded from Google | Every visitor's IP address and browsing sent to a third party | Fonts are now self-hosted in `fonts/` (SIL Open Font License). The page now makes zero third-party requests. |
| No security headers | Clickjacking, content injection, downgrade to HTTP | `vercel.json` sets a strict Content Security Policy (`default-src 'none'`, scripts, styles and fonts from this site only, no framing, no form posts), HSTS, nosniff, X-Frame-Options DENY, Referrer-Policy no-referrer, Permissions-Policy blocking camera, mic, location and payment, plus same-origin COOP and CORP. |
| Inline script and styles | Would force a weak CSP (`unsafe-inline`) | Moved to `app.js` and `styles.css`. No inline code or `style=` attributes remain. |
| `innerHTML` on the leaderboard | XSS once real names are loaded from a lap timing system | Rows are now built with `textContent`, so a name can never run as code. |
| Unbounded form input | Oversized or malformed messages | Length limits on every field, phone format check, control characters stripped, driver count clamped to 1 to 40. |
| Data left in the form | Next person on a shared device sees it | Form is cleared after sending. |
| Referrer leakage | Page URL sent to WhatsApp and other sites | `no-referrer` everywhere, `noopener,noreferrer` on new windows. |
| No privacy notice | Visitors not told how their details are used | Short notice above the send button. Notes field warns against card or ID numbers. |

Tested in Chromium with the production headers enforced: no CSP violations, no console errors, no external requests, fonts load, leaderboard and booking flow work, and an HTML/script payload typed into the form stays plain text.

## Known limits (by design)

* **The booking message travels in a `wa.me` link.** Name, phone and booking details sit in that URL, so they can land in the visitor's browser history and pass through WhatsApp (Meta). That is fine for a name and phone number. Never ask for CNIC, card numbers or anything more sensitive through this form.
* **Contact details in the page are public by nature.** The phone number and address are meant to be seen.

## Before going live

1. Replace the placeholders in `app.js` (`KARTZ` object). A wrong WhatsApp number would send customer details to a stranger. The script warns in the console if the format is wrong.
2. Use a custom domain and, once it works over HTTPS, submit it at hstspreload.org.
3. Turn on two-factor authentication on the Vercel account, the GitHub account and the domain registrar. Account takeover is the most likely real attack on a static site.
4. Check the deployed headers at securityheaders.com and observatory.mozilla.org. The target is A+.

## Operational: protecting the bookings

* Use a WhatsApp **Business** account on a company phone, with two-step verification PIN on and a screen lock.
* Limit who can access that phone or WhatsApp Web sessions, and log out of WhatsApp Web on shared computers.
* Delete old booking chats on a schedule (for example after 90 days) unless you need them.

## If you add a backend later

Real sensitive data (online payments, accounts, stored bookings, CNIC for events) needs a backend. When that happens:

* Take payments only through a PCI compliant gateway's hosted page. Never let card data touch our code.
* Put the database (for example Supabase) behind Row Level Security on every table, with the service key only on the server and never in browser code.
* Validate every input on the server, not just in the browser, and rate limit the booking endpoint.
* Collect the minimum data, encrypt at rest, set a retention period, and publish a full privacy policy.
* Get an independent review or penetration test before launch.
