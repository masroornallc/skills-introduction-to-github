# ✦ Lumina Clean — Premium Cleaning Business Website

A modern, highly interactive single-page website for a premium cleaning business. Built with pure HTML, CSS and JavaScript — no frameworks, no build step.

---

## 🌐 Live Demo

**[View it live on GitHub Pages →](https://masroornallc.github.io/skills-introduction-to-github/)**

> GitHub Pages is deployed automatically on every push via the workflow in `.github/workflows/deploy.yml`.  
> It may take a minute or two after a new push for changes to appear.

---

## 🚀 Run Locally in 30 Seconds

No dependencies or build tools required — just a browser.

**Option 1 — Open directly:**
```
# Clone the repo (or use the copy you already have)
git clone https://github.com/masroornallc/skills-introduction-to-github.git
cd skills-introduction-to-github

# Open in your default browser
open index.html          # macOS
start index.html         # Windows
xdg-open index.html      # Linux
```

**Option 2 — Local dev server (recommended for full feature support):**
```bash
# Python 3 (built-in, no install needed)
python3 -m http.server 3000
# Then open http://localhost:3000 in your browser
```

---

## ✨ Features

| Feature | Details |
|---|---|
| 🌌 Particle Canvas | 120 animated nodes with mouse-repulsion and constellation links |
| 🖱️ Custom Cursor | Smooth-lerp dot + ring, glows gold on interactive elements |
| 📜 Scroll Reveals | IntersectionObserver-driven fade-up on every section |
| 🔢 Counter Animation | Cubic-ease number roll-up triggered on viewport entry |
| 🎠 Testimonials Carousel | Auto-play, touch/swipe, dot-navigation |
| ↔️ Before/After Slider | Drag to compare 4 room transformations |
| 💡 Pricing Toggle | Monthly ↔ Annual billing (20% discount) |
| 🧲 Magnetic Buttons | Subtle cursor-attraction on hover |
| ⌨️ Typewriter Effect | Cycles through service names in the hero subtitle |
| 📱 Fully Responsive | Tested from 320 px to 1440 px |
| ♿ Accessible | ARIA labels, semantic HTML, keyboard navigation |

---

## 🗂️ File Structure

```
├── index.html       # Full page markup (11 sections)
├── styles.css       # Luxury dark theme + all animations
├── script.js        # Interactive engine (pure JS, no deps)
└── .github/
    └── workflows/
        └── deploy.yml   # GitHub Pages CI/CD
```
