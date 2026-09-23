# 🛰️ Sector Sweeper

> A tactical roguelike Minesweeper featuring procedural item pools, active gadgets, shields, escalating hazards, and built-in stealth camouflage skins for school or work.

---

## 🚀 Live Demo & Deployment

This project is built with **Vite**, **React 19**, and **Tailwind CSS**. It is configured to run smoothly on:
- **GitHub Pages** (under repository subpaths such as `https://<username>.github.io/SectorSweeper/`)
- **Vercel / Netlify / Cloudflare Pages**
- Local development servers

### Why did you see a white screen previously?
Vite defaults to `base: '/'` when building assets. When deployed to a GitHub repository link (`https://<username>.github.io/SectorSweeper/`), the browser attempted to fetch scripts from `https://<username>.github.io/assets/...` (root domain), which resulted in a 404 error and a blank white screen.

**The Fix:**
- `base: './'` is configured in `vite.config.ts`, ensuring all scripts, styles, and assets resolve relative to the current subpath.
- An **Error Boundary** was added to catch any unexpected runtime issues.
- A ready-to-use **GitHub Actions workflow** (`.github/workflows/deploy.yml`) is included for 1-click automatic GitHub Pages publishing.

---

## 🛠️ GitHub Pages Setup

1. Push this repository to your GitHub repo named `SectorSweeper`.
2. Go to **Settings** → **Pages** in your GitHub repository.
3. Under **Build and deployment** → **Source**, select **GitHub Actions**.
4. Every push to `main` will automatically build and publish the game to:
   ```
   https://<your-username>.github.io/SectorSweeper/
   ```

---

## 💻 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev

# 3. Build for production
npm run build

# 4. Preview the production build locally
npm run preview
```

---

## 🎮 Key Features
- **Roguelike Progression**: Traverse through increasingly treacherous deep-space sectors.
- **Armor & Shields**: Absorb mine detonations instead of instant death.
- **Tactical Gadgets**: Sonar Scanners, Mine Defusers, X-Ray Chisels, Crossfire Beams, Recon Drones, and EMP Bursts.
- **Synergistic Relics**: Over 20 passive relics to customize builds (Adrenalin Core, Black Market Pass, Compound Ledger, Nanite Sponge, etc.).
- **Stealth Camouflage (Boss Key)**: Press `B` or click the stealth icon to instantly swap between the Cyberpunk Dark theme, a 1995 Minesweeper skin, and a convincing fake Excel financial sheet.
- **Daily Challenge & Seed Replay**: Share seed codes or debrief logs with friends to compare scores on deterministic boards.
