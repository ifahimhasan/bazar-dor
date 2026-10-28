# 🛒 বাজার দর (BazarDor)

**আজকের বাজারের দাম এক নজরে** — a Bangla market-price tracker for everyday essentials in Bangladesh. Browse today's prices for rice, lentils, oil, vegetables, fish, meat, eggs/milk and spices, see which items got costlier or cheaper today, and compare prices across markets all over the country.

🔗 **Live:** [bazardor-fahim.netlify.app](https://bazardor-fahim.netlify.app)  
📦 **Repository:** [github.com/ifahimhasan/bazar-dor](https://github.com/ifahimhasan/bazar-dor)

---

## ✨ Key Features

1. **Live price ticker & movers** — an infinitely scrolling marquee of every product (emoji, name, ৳/unit, ▲/▼ %) plus "আজ দাম বেড়েছে ▲" and "আজ দাম কমেছে ▼" sections showing the top 6 risers and fallers.
2. **Search, filter & smart sort** — search products by name, filter by category chips, and sort by price (ডিফল্ট / কম থেকে বেশি / বেশি থেকে কম). Sorting is numeric and Bengali-numeral safe (`১,৮৫০` > `৯৯`).
3. **Detailed product pages (protected)** — min / max / average price, yesterday / last week / last month comparison, and a market-by-market price table across divisions, cheapest market highlighted.
4. **Authentication with BetterAuth** — email/password sign up & sign in, Google and GitHub social login, protected routes with redirect-back, and toast feedback for every action.
5. **Profile & update information** — `/profile` shows account and session details; `/profile/update` lets the user change their name and photo (`authClient.updateUser`).
6. **Fully Bangla & responsive UI** — Bengali digits and dates (`বুধবার, ২৮ অক্টোবর, ২০২৬`), Hind Siliguri font, skeleton loaders, friendly 404 pages, and layouts tuned for mobile, tablet and desktop.

## 🧰 Technologies Used

| Technology | Purpose |
| --- | --- |
| **Next.js 16 (App Router)** | Pages, routing, server components, route proxy |
| **TypeScript** | Type-safe code |
| **Tailwind CSS v4 + DaisyUI 5** | Styling, custom `bazar` theme from the Figma tokens |
| **BetterAuth** | Email/password + Google + GitHub authentication |
| **MongoDB** | User / session storage (BetterAuth MongoDB adapter) |
| **react-hot-toast** | Toast notifications |
| **@fontsource/hind-siliguri** | Self-hosted Bangla font |
| **Netlify** | Deployment (Next.js runtime with server functions) |

## 🗺️ Routes

| Route | Description |
| --- | --- |
| `/` | Hero, price movers, all products (search / filter / sort) |
| `/category/[slug]` | Products of a category with sort, skeleton & empty / 404 state |
| `/product/[slug]` | 🔒 Product details — summary, history, market table |
| `/signin`, `/signup` | Authentication pages |
| `/profile` | 🔒 My profile |
| `/profile/update` | 🔒 Update information (name, photo) |

## 🔌 API

Data comes from the BazarDor API (`/products`, `/products?category=chal`, `/categories`). The app tries the main URL first, then the mirrors, and finally falls back to a bundled snapshot so the site never breaks if the API is down.

```
https://openapi.programming-hero.com/api/bazardor
https://api.api-store.workers.dev/api/bazardor
https://api.abcz.workers.dev/api/bazardor
```

## 🚀 Getting Started

```bash
git clone <your-repo-url>
cd bazar-dor
npm install
cp .env.example .env.local   # then fill the values
npm run dev
```

### Environment variables

| Variable | Notes |
| --- | --- |
| `BETTER_AUTH_SECRET` | Long random string (`openssl rand -hex 32`) |
| `BETTER_AUTH_URL` | `http://localhost:3000` locally, `https://bazardor-fahim.netlify.app` in production |
| `MONGODB_URI` | MongoDB Atlas connection string (without it, accounts are kept in memory — dev only) |
| `MONGODB_DB` | Database name (default `bazardor`) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth — redirect URI: `<BETTER_AUTH_URL>/api/auth/callback/google` |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | GitHub OAuth — callback URL: `<BETTER_AUTH_URL>/api/auth/callback/github` |

### Deploying to Netlify

1. Push the project to GitHub (`.env.local` stays out of the repo via `.gitignore`).
2. Netlify → **Add new project → Import an existing project → GitHub** → select `bazar-dor`. Build command `npm run build` is detected automatically.
3. Add the environment variables above, with `BETTER_AUTH_URL=https://<your-site>.netlify.app`.
4. MongoDB Atlas → **Network Access** → add `0.0.0.0/0` so Netlify's servers can connect.
5. **Google OAuth** (Google Cloud Console → Clients): add both origins and redirect URIs, then publish the app under **Audience**:
   - `http://localhost:3000` · `http://localhost:3000/api/auth/callback/google`
   - `https://<your-site>.netlify.app` · `https://<your-site>.netlify.app/api/auth/callback/google`
6. **GitHub OAuth**: a GitHub OAuth App allows only one callback URL, so create two apps:
   - Local: callback `http://localhost:3000/api/auth/callback/github` (keys in `.env.local`)
   - Live: callback `https://<your-site>.netlify.app/api/auth/callback/github` (keys in Netlify)
7. After changing environment variables, run **Deploys → Trigger deploy → Deploy project**.

> ⚠️ Do **not** drag-and-drop the `.next` folder (Netlify Drop). Auth, the route proxy and dynamic pages need server functions, which only work when Netlify builds the project itself.

### Troubleshooting

| Problem | Fix |
| --- | --- |
| `querySrv ECONNREFUSED` when running locally | Some ISPs block the SRV lookup of `mongodb+srv://` links. Use Atlas → Connect → Drivers → **Legacy URI String** (`mongodb://…shard-00-00…`) as `MONGODB_URI`. |
| `bad auth : authentication failed` | Wrong database password in `MONGODB_URI`. Reset it in Atlas → Database Users → Edit. |
| Hydration warning about `cz-shortcut-listen` / `data-gr-ext-installed` | Caused by browser extensions (ColorZilla, Grammarly) — harmless, already suppressed on `<body>`. |
| Social login shows "এই সোশ্যাল লগইন এখনো চালু করা হয়নি" | Client ID / secret for that provider is missing in the environment. |

---

সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।