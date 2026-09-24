# PURE BEAUTY by Petra — Standalone Website for GitHub Pages

A modern, elegant, fully responsive standalone website designed for **PURE BEAUTY by Petra** (solo aesthetician / kozmetika).

## ✨ Features
- **Visual Aesthetic:** Pixel-matched to design with luxury dark forest green (`#142820`) background, warm sand/cream typography, and gold accent badges.
- **Sections Included:**
  - **Hero Banner:** Exact match with *PURE BEAUTY*, *by Petra*, and *KIEGYENSÚLYOZOTT SZÉPSÉG*.
  - **Kezelések (Treatments):** Grid of facial treatments with duration, descriptions, and quick-booking CTAs.
  - **Árlista (Price List):** Transparent, category-based price list with HUF pricing and service durations.
  - **Rólam (About Me):** Bio, credentials, and philosophy.
  - **Időpontfoglalás (Booking):** Interactive booking request form with date picker, treatment selector, and confirmation state.
  - **Kapcsolat (Contact):** Location, telephone, opening hours, and direct links.
- **Mobile First:** Smooth responsive design for desktop, tablet, and smartphone screens with mobile drawer navigation.
- **Zero Dependencies:** Pure HTML5, CSS3, and Vanilla JavaScript.

---

## 🚀 How to Publish on GitHub Pages (Step-by-step)

### Method 1: Push folder to a new GitHub repository
1. Initialize a new Git repo inside `pure-beauty-website/` or push this folder to your GitHub account:
   ```bash
   cd "pure-beauty-website"
   git init
   git add .
   git commit -m "Initial commit for Pure Beauty by Petra website"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/pure-beauty.git
   git push -u origin main
   ```
2. On GitHub:
   - Go to your repository **Settings** → **Pages** (in the left sidebar).
   - Under **Build and deployment** > **Source**, select **Deploy from a branch**.
   - Under **Branch**, select `main` and `/ (root)`.
   - Click **Save**.
3. Your website will be live in ~1 minute at:
   `https://YOUR_USERNAME.github.io/pure-beauty/`

---

## 📁 File Structure
```
pure-beauty-website/
├── index.html        # Main HTML structure
├── styles.css        # Luxury dark green aesthetic styling
├── app.js            # Smooth navigation, active scroll-spy, and form handler
└── README.md         # Deployment instructions
```
