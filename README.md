# DavKays website

A lightweight, responsive static website for DavKays. No build step, framework, or runtime dependencies are needed. Deploy the contents of this folder as the site's document root on any static host (for example, Cloudflare Pages, Netlify, GitHub Pages, or standard HTTPS web hosting). Configure the custom 404 page to use `/404.html` if your host needs that setting.

## Before launch

1. Confirm that `davidkanyurira6@gmail.com` is monitored and that the domain points to the chosen host.
2. Review the privacy, terms, and accessibility pages. The legal pages are general drafts, not legal advice; align them with your jurisdiction, hosting provider, business details, and actual practices.
3. The contact form opens a prefilled `mailto:` message. It does not submit to a server. For an on-page submission experience, connect an email/form provider and update the privacy policy.
4. The homepage image and Google Fonts currently load from external hosts. For stricter privacy or fully self-hosted performance, use appropriately licensed local image/font files and update `index.html`, `style.css`, and its Open Graph image.
5. Add a real social sharing image and your preferred analytics only if needed, with corresponding privacy disclosures.

## Files

- `index.html`, `about.html`, `services.html`, `contact.html`: main pages
- `privacy.html`, `terms.html`, `accessibility.html`: trust pages
- `404.html`, `sitemap.xml`, `robots.txt`: utility files
- `style.css`, `script.js`: shared design and small navigation/contact-form behavior

Contact details shown: `davidkanyurira6@gmail.com`, call `078 240 0100`, WhatsApp `071 188 1780`. Hours are Monday to Friday 8:00 am to 4:00 pm, Saturday 9:00 am to 1:00 pm, and Sunday email only (Zimbabwe time, CAT).

## Namecheap domain

Your domain is registered at Namecheap; the website files need to be hosted separately. Choose a static host and follow its custom-domain instructions. In Namecheap, open **Domain List → Manage → Advanced DNS** and add the DNS records provided by that host (usually an apex A/ALIAS record and a `www` CNAME). Use the host’s exact values, remove conflicting parking records, and enable HTTPS at the host after DNS has propagated. Keep existing email-related MX records intact so mail routing is not interrupted.
## Assistant and project links

The small DavKays helper bot answers common questions about services, project pricing, contact details, and opening hours. It uses a short set of local rules in `chat.js`; it is not an AI service and does not send messages to a server.

To publish a project link, open `projects-data.js` and add an object to the `DAVKAYS_PROJECTS` list with a title, short description, URL, and optional image. Then upload the updated file with the website to your host. The Work page reads that file and creates the project cards. Only add public links and images you have permission to share.
## Time and language greeting

The welcome greeting uses the visitor device local time and automatically selects English, Shona, or Ndebele when one is preferred by the browser. The visitor can change the greeting language from the header; the choice is remembered on that device. The greeting and bot welcome are localized, while the rest of the site and detailed bot answers remain in English. Full page translations should be reviewed by fluent speakers before publishing.
## International greeting and opening status

The greeting selector supports English, Shona, Ndebele, Simplified and Traditional Chinese, French, Portuguese, Spanish, Arabic, Hindi, Swahili, Japanese, Korean, German, Italian, and Russian. It follows a supported browser language by default and can be changed manually. The greeting uses the visitor device time. The Contact page separately shows live time in Harare and whether the business is open for calls, email only, or closed. Check all translations with fluent speakers before making them the primary language for complete pages.
A floating panel stays at the upper right while visitors scroll. During open hours it shows the remaining hours, minutes, and seconds until closing. Outside open hours it shows a simple closed or email only status.