# Change Log

This project adheres to [Semantic Versioning](http://semver.org/).

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
