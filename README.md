# tenge.work 💼

> **Calculate your tenge salary in Kazakhstan** | **Қазақстандағы жалақыңызды есептеңіз**

A modern, fast, and accessible Kazakhstani tenge (KZT) salary and tax calculator built with **Astro** and **TypeScript**.

🌐 **Live:** [https://tenge.work](https://tenge.work)

---

## ✨ Features

- 🇰🇿 **Multi-Language Support**: Default **Kazakh (Қазақша)**, with instant switcher to **Russian (Русский)** and **English**.
- 🔄 **Dual Direction Calculation**:
  - **Take-Home (Net) ➔ Gross Salary**: calculate contract salary and taxes from your net pay.
  - **Gross Salary ➔ Take-Home (Net)**: calculate actual take-home pay and all deductions from gross contract amount.
- 📊 **Comprehensive 2025/2026 Kazakhstan Tax Rules**:
  - **Employee Deductions**: OPV (10%), VOSMS (2%), IPN (10%), with 14 MRP standard tax relief toggle and 90% correction for small salaries (<= 25 MRP).
  - **Employer Contributions**: SO (3.5%), OOSMS (3%), OPVR (1.5%), and Social Tax (SN).
- 📱 **Mobile-First & Accessible**: Designed for quick one-thumb usage with 48px+ touch targets, numeric keypads (`inputmode="numeric"`), and zero layout shifts.
- 🌓 **Dark & Light Mode**: Bespoke glassmorphism theme with automatic system preference detection.
- 📋 **Share & Export**: One-tap copy calculation summary to clipboard and URL query params sync (`?amount=500000&mode=net&lang=kk`).
- ⚡ **Lightning Fast**: Powered by **Astro 5+** with zero-overhead static generation and minimal client scripts.

---

## 🛠️ Development & Contribution

### Requirements
- **Node.js**: `v24+` (use `.nvmrc` with `nvm use`)
- **npm**: `v10+`

### Setup

```bash
# 1. Clone repository
git clone https://github.com/jarjan/tenge.git
cd tenge

# 2. Use Node 24 and install dependencies
nvm use
npm install

# 3. Start local development server
npm run dev

# 4. Check types
npm run check

# 5. Build for production
npm run build
```

---

## 👥 Contributors

| <img src="https://avatars2.githubusercontent.com/u/836813?s=100&v=4" width="100" alt="jarjan" /> | <img src="https://avatars3.githubusercontent.com/u/41541742?s=100&v=4" width="100" alt="ramyamahi" /> | <img src="https://avatars1.githubusercontent.com/u/15848876?s=100&v=4" width="100" alt="pheeria" /> | <img src="https://avatars0.githubusercontent.com/u/1858708?s=100&v=4" width="100" alt="drugoi" /> | <img src="https://avatars3.githubusercontent.com/u/11878817?s=100&v=4" width="100" alt="Baukaalm" /> |
| :----------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------: | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
|                               [jarjan](https://github.com/jarjan)                                |                               [ramyamahi](https://github.com/ramyamahi)                               |                                [pheeria](https://github.com/pheeria)                                | [drugoi](https://github.com/drugoi)                                                               | [Baukaalm](https://github.com/Baukaalm)                                                              |

---

## 📄 License

MIT © [Zharzhan Kulmyrza](https://jarjan.xyz)
