# 🎬 Cine Flow (www.cineflow.com)

**Cine Flow** is a cinematic movie & TV series discovery platform powered by the **TMDB API** (The Movie Database).

---

## 🌟 Key Features & Updates

### 1. Naming Conventions
- **HTML IDs & Classes**: Restored to standard web **`kebab-case`** (e.g. `brand-logo`, `search-input`, `hero-backdrop`, `movie-card`, `card-poster-wrap`, `modal-content-grid`, etc.).
- **CSS Custom Properties & Selectors**: Restored to standard **`kebab-case`** (e.g. `--bg-deep`, `--bg-surface`, `--accent-cine`, `--accent-gradient`, `--radius-md`, etc.).
- **JavaScript Identifiers**: Clean **`camelCase`** for all variables and functions (e.g. `apiUrl`, `allTitles`, `filteredTitles`, `openDetailsModal()`, `renderHero()`, `applyFiltersAndRender()`, etc.), targeting the restored DOM elements.
- **Hero Image Requirement**: Maintained `<img id="Img">` on the featured hero poster to satisfy `document.getElementById('Img')`.

### 2. Complete Movie Properties Display on Click
Whenever you click any movie or TV series card (in the trending catalog, hero spotlight, or watchlist), the **Details Modal** explicitly showcases all 8 requested attributes:

| Property | TMDB Field | Description / Format |
| :--- | :--- | :--- |
| **Title** | `title` / `name` | Main title of the film or series |
| **Name** | `name` / `original_title` | Series name or original title |
| **Popularity** | `popularity` | Real-time TMDB trending popularity score |
| **Poster** | `poster_path` | High-definition poster image from TMDB CDN (visible on all devices) |
| **Overview** | `overview` | Full synopsis and plot summary |
| **Genre** | `genre_ids` | Mapped from TMDB genre IDs into stylized tag pills (e.g. Action, Drama, Sci-Fi) |
| **Rating** | `vote_average` | Star rating out of 10 (e.g. ⭐ `8.4 / 10`) |
| **Release Date** | `release_date` / `first_air_date` | Initial release or premiere air date |

### 3. Multi-Screen Mobile Responsiveness
Engineered to look stunning and function smoothly across all screen sizes:
- **Extra-Small Mobile (320px – 380px)**: Compact header, 2-column movie grid, single-column properties breakdown, centered poster.
- **Standard Mobile (390px – 540px)**: iPhone 13/14/15/16, Samsung Galaxy, Pixel. 2-column cards with clamped 2-line titles, touch-friendly buttons, full-screen watchlist drawer.
- **Tablets & Phablets (541px – 768px)**: Horizontally scrollable filter pills, 2–3 column grid, responsive modal layout.
- **Laptops & Desktops (769px+)**: Multi-column catalog, hero spotlight with `<img id="Img">`, side-by-side modal with high-res backdrop and 240px poster.

---

## 📁 File Structure

| File | Description |
| :--- | :--- |
| [`index.html`](index.html) | Semantic markup with standard `kebab-case` IDs and classes, hero spotlight, catalog grid, modal, and watchlist drawer. |
| [`style.css`](style.css) | Cinematic dark theme (`#07090e`), standard tokens and selectors, responsive media queries, glassmorphism. |
| [`app.js`](app.js) | TMDB API fetch, `camelCase` functions/variables, genre mapping, click handlers, and `localStorage` watchlist. |

---

## 🚀 How to Run

1. **Directly in Browser**:
   - Double-click [`index.html`](index.html) or right click and open with Chrome, Edge, Safari, or Firefox.
2. **With a Local Dev Server**:
   ```bash
   npx serve .
   ```
   Navigate to `http://localhost:3000`.

---

## 🛡️ Attribution & Disclaimer
This product uses the TMDB API but is not endorsed or certified by TMDB.
Official Domain reference: `www.cineflow.com`.
