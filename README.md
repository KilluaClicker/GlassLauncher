# GlassLauncher — official website

Static landing page for **GlassLauncher**, a monochrome Minecraft launcher by KilluaDEV.

- Live site: https://killuaclicker.github.io/GlassLauncher/
- Repository: https://github.com/KilluaClicker/GlassLauncher
- Installer: `downloads/GlassLauncherSetup.exe` (v1.1.0)
- SHA-256: `E4968588E8B0B21A332E53BA9D5F9FB749560998D2F0F7045A33A269AD78108B`

## Stack

No build step, no dependencies. Plain HTML, CSS and a small vanilla JS file.

```
index.html          landing page
styles.css          monochrome glass design
app.js              menu, gallery lightbox, reveal, copy hash, toast
assets/fonts/       Onest + Unbounded (SIL OFL)
assets/screens/     real launcher screenshots
assets/og.png       1200x630 social preview
downloads/          GlassLauncherSetup.exe + portable build + SHA-256
favicon.png         site icon (GL glass mark)
```

## Local preview

```powershell
cd C:\Users\004ne\GlassLauncherSite
python -m http.server 8080
# open http://localhost:8080
```

Or just open `index.html` in a browser. The download button works locally too.

## Deploy

The site is published with **GitHub Pages** from the `main` branch root.

```powershell
git add .
git commit -m "GlassLauncher site v1.1.0"
git push origin main
```

Pages settings: **Settings → Pages → Build and deployment → Deploy from a branch → main / (root)**.

## Updating the launcher

1. Build a new installer in the launcher project: `tools\build-release.ps1`.
2. Copy the new files:

```powershell
Copy-Item C:\Users\004ne\GlassLauncher\dist\GlassLauncherSetup.exe downloads\ -Force
Copy-Item C:\Users\004ne\GlassLauncher\dist\GlassLauncher.exe downloads\ -Force
Copy-Item C:\Users\004ne\GlassLauncher\dist\GlassLauncherSetup.sha256 downloads\ -Force
```

3. Update the version, file size and SHA-256 in `index.html` (download panel, hero meta, JSON-LD).
4. Commit and push. GitHub Pages updates automatically.

## License

Site code: MIT. Fonts: SIL Open Font License (see `assets/fonts/OFL-*.txt`).
Minecraft is a trademark of Mojang Studios. This project is not affiliated with Mojang or Microsoft.
