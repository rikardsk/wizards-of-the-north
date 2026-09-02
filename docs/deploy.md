# Playing from Another Computer & Deployment Guide

This guide covers the different ways to play **Wizards of the North** from another computer or mobile device.

---

## Option 1: On the Same Wi-Fi / Local Network (LAN) — *Easiest & Fastest*

Because this game is a web app served by Vite, you can expose it directly to any device on your local network by enabling the `--host` flag.

### 1. Enable `--host` in your startup
Update `Start.bat` (or your run command) to include `--host`:

```bat
npm run dev -- --host --port 8080
```

*(Alternatively, configure `vite.config.ts` to always enable network access):*
```ts
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 8080,
  },
})
```

### 2. Run the game
Double-click `Start.bat` (or run `npm run dev -- --host --port 8080` in your terminal).

Vite will print both a **Local** and a **Network** address:
```text
  ➜  Local:   http://localhost:8080/
  ➜  Network: http://192.168.1.45:8080/
```

### 3. Connect from the other computer / device
Open a browser (Chrome, Edge, Firefox, Safari) on the second computer/phone and navigate to that **Network URL** (e.g. `http://192.168.1.45:8080`).

> **Troubleshooting Firewall**: If the page does not load, make sure Windows Defender Firewall allows Node.js / port 8080 on private networks.

---

## Option 2: Over the Internet (Different Locations / Networks)

If the other computer is not connected to your home Wi-Fi:

### A. Instant Tunnel (No signup or hosting setup required)
While the game is running locally on port 8080, open a terminal on your host computer and run:

```powershell
npx localtunnel --port 8080
```

This generates a temporary public HTTPS link (e.g. `https://brave-frog-12.loca.lt`) that you can open from any device anywhere in the world.

### B. Free Static Web Hosting (Permanent Online URL)
Because **Wizards of the North** is a 100% client-side React app, you can host it permanently for free:

1. Build the production files:
   ```powershell
   npm run build
   ```
   This creates a static bundle inside the `dist/` directory.

2. Deploy using one of these free providers:
   - **Netlify**: Drag and drop the `dist/` folder into [Netlify Drop](https://app.netlify.com/drop).
   - **Vercel**: Link your GitHub repository to [Vercel](https://vercel.com/) for automatic deployments.
   - **GitHub Pages**: Deploy the `dist/` directory to GitHub Pages via GitHub Actions.

Once hosted, anyone with the link can play without needing your host computer to stay on.
