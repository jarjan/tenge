# Change Log

This project adheres to [Semantic Versioning](http://semver.org/).

## 1.1.0

- Update tax engine to the 2026 Tax Code: МРП 4 325 ₸, 30 МРП basic deduction, progressive ИПН (15% above 8 500 МРП/year), 90% correction removed, СО 5%, СН 6% without СО offset, ОПВР 3.5%, ВОСМС cap 20 МЗП, ООСМС cap 40 МЗП
- Derive all rates and amounts in UI copy from the tax rules instead of hard-coding them
- Server-render the page in the requested language with real calculated values; add canonical and `hreflang` links
- Share previews now respect the deduction toggle; OG images are versioned by tax year with a shorter cache TTL
- Fix header year badge being wiped by translations
- Thousands separators while typing; Backspace/Delete skip over separators
- Guard against huge or non-finite amounts (no more `NaN ₸`)
- Clipboard fallback and error toast; `aria-checked` / `aria-pressed` kept in sync
- Stale cached exchange rates are no longer labelled as live
- Add Vitest unit tests for the calculator, translations and URL parameters
- Remove unused duplicate assets
- Redesign: flat surfaces instead of glassmorphism and gradients, neutral palette with a single sky-blue accent, tabular Golos Text numerals instead of a monospace font, simpler header, legend and table; the USD/EUR column is hidden on phones instead of scrolling
- OG share image restyled to match; JetBrains Mono dropped
- Upgrade to Astro 7 and `@astrojs/netlify` 8; `sharp` pinned to a patched version via `overrides`

## 1.0.0

- Complete rewrite using Astro 5, TypeScript, and modern component architecture (Node >=24)
- Tri-lingual localization with Kazakh as default (`kk`, `ru`, `en`) and instant persistent switcher
- Accurate 2025/2026 Kazakhstan tax calculation engine with dual mode (Net ➔ Gross & Gross ➔ Net)
- Unified salary breakdown with side-by-side Monthly and Yearly figures
- Live USD / EUR exchange rate fetching with cached fallback
- High-contrast semantic distribution visualizer with live percentage badges
- Always-visible employer contributions & total company payroll cost
- Kazakh Cyrillic typography powered by Golos Text
- Minimum wage constraint (85 000 ₸ / МЗП) with live typing warnings and auto-clamping
- Dynamic OpenGraph social share card generation for Netlify (`/api/og.png`)
- Interactive tax deduction tooltips and popovers with statutory explanations and calculation formulas
- Instant Dark / Light theme switcher without input transitions/flashing
- Responsive mobile-first layout and keyboard accessibility

## 0.7.0

- Migrate to `vite` and `npm`
- Slight refactor of code
- Added typescript

## 0.6.1

- Remove sirv static file server
- Only netto income can be given
- Default year is 2023 and remove the rest
- Show medical insurance

## 0.6.0

- Upgrade node to 18
- Upgrade dependencies
- Support years 2022-2023

## 0.5.0

- Fixed year selector
- Migrate to `yarn`
- Update dependencies and `npm` version
- Refactor round with Intl api to format currency

## 0.4.1

- Fix README commands
- Refactor isNetto checkbox
- Add some styles for footer and label
- Replace custom round with `toLocaleString` method

## 0.4.0

- Update to 2020
- Upgrade dependencies
- Migrate to now.sh

## 0.3.3

- Add Open Graph tags
- Refreshed design

## 0.3.2

- Adjust style for mobile devices (#14)
- Update dependencies (#16)

## 0.3.1

- Update to 2019
- Update dependencies

## 0.3.0

- Move to vue-cli 3

## 0.2.2

- Fixed eur

## 0.2.1

- Fixed mobile view

## 0.2.0

- Added usd/eur currencies
- Fixed bug with checkbox
- Added social share buttons

## 0.1.1

- Added simple PWA support

## 0.1.0

- Initial release with basic calculator
