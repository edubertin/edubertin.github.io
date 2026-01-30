# eduardobertin.com.br — Personal Blog/Portfolio

Clean, modern landing page for a personal AI-focused portfolio with bilingual
content (EN/PT), GitHub project listing, and a cinematic hero background.

## Features
- EN/PT language toggle with persistence
- GitHub projects modal with live repo fetch
- Liquid‑metal UI styling for menu and modals
- Accessible focus states and reduced‑motion support

## Structure
```
assets/
  css/
    styles.css
  img/
    image.png
  js/
    script.js
index.html
README.md
```

## Customize
- **Hero image**: replace `assets/img/image.png`
- **GitHub username**: edit `data-github-user` in `index.html`
- **Texts**: update the translation dictionary in `assets/js/script.js`

## Run locally
Open `index.html` in a browser.

## Notes
If GitHub API rate limits, the projects modal falls back to sample items.
