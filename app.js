/**
 * ==============================================================================
 * Cine Flow (www.cineflow.com) - Official Application Script
 * Powered by TMDB API (The Movie Database)
 * Naming Conventions: camelCase for JS code, kebab-case for DOM targets
 * ==============================================================================
 */

// 1. API Configuration & Headers provided by Cine Flow
const apiUrl = 'https://api.themoviedb.org/3/trending/all/day?language=en-US';
const apiOptions = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZDM1ZjNmMDk3MDE0ZjEzNGI3Yjg2OTE5NTc3YjJhYiIsIm5iZiI6MTc5MDI0MTAyOC4zMDMsInN1YiI6IjZhYjRlOTA0Y2QwMzg5MWY4OGZhMTRlZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.BavoR3fSQmDMhsCOrQFQsdFcKBXY6LTuYF_TPTg_CS0'
  }
};

// TMDB Image CDN Endpoints
const imageBaseUrlPoster = 'https://image.tmdb.org/t/p/w500';
const imageBaseUrlBackdrop = 'https://image.tmdb.org/t/p/original';
const fallbackPoster = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=500&auto=format&fit=crop';

// TMDB Official Genre Dictionary
const tmdbGenres = {
  12: 'Adventure',
  14: 'Fantasy',
  16: 'Animation',
  18: 'Drama',
  27: 'Horror',
  28: 'Action',
  35: 'Comedy',
  36: 'History',
  37: 'Western',
  53: 'Thriller',
  80: 'Crime',
  99: 'Documentary',
  878: 'Sci-Fi',
  9648: 'Mystery',
  10402: 'Music',
  10749: 'Romance',
  10751: 'Family',
  10752: 'War',
  10759: 'Action & Adventure',
  10762: 'Kids',
  10763: 'News',
  10764: 'Reality',
  10765: 'Sci-Fi & Fantasy',
  10766: 'Soap',
  10767: 'Talk',
  10768: 'War & Politics',
  10770: 'TV Movie'
};

// 2. Application State (camelCase)
let allTitles = [];
let filteredTitles = [];
let currentFilter = 'all';
let currentSort = 'popularity-desc';
let searchQuery = '';
let selectedMovie = null;
let watchlist = JSON.parse(localStorage.getItem('cineflow_watchlist') || '[]');

// 3. DOM Elements Selection (camelCase variables targeting kebab-case DOM IDs)
const heroBackdrop = document.getElementById('hero-backdrop');
const heroTitle = document.getElementById('hero-title');
const heroRating = document.getElementById('hero-rating');
const heroType = document.getElementById('hero-type');
const heroYear = document.getElementById('hero-year');
const heroLang = document.getElementById('hero-lang');
const heroOverview = document.getElementById('hero-overview');
const heroDetailsBtn = document.getElementById('hero-details-btn');
const heroWatchlistBtn = document.getElementById('hero-watchlist-btn');

// Element specifically noted by user: document.getElementById('Img')
const heroImg = document.getElementById('Img') || document.getElementById('hero-img');

// Catalog & Grid Elements
const moviesGrid = document.getElementById('movies-grid');
const resultsCount = document.getElementById('results-count');
const sectionHeading = document.getElementById('section-heading');
const emptyState = document.getElementById('empty-state');
const resetFiltersBtn = document.getElementById('reset-filters-btn');
const sortSelect = document.getElementById('sort-select');

// Search & Filter Controls
const searchInput = document.getElementById('search-input');
const clearSearchBtn = document.getElementById('clear-search-btn');
const filterPillsContainer = document.getElementById('filter-pills');
const navPills = document.querySelectorAll('.nav-pill');

// Modal Elements (Targeting all 8 requested movie properties)
const detailsModal = document.getElementById('details-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const modalBackdropImg = document.getElementById('modal-backdrop-img');
const modalPosterImg = document.getElementById('modal-poster-img');
const modalTitle = document.getElementById('modal-title');
const modalName = document.getElementById('modal-name');
const modalGenres = document.getElementById('modal-genres');
const modalOverview = document.getElementById('modal-overview');
const modalType = document.getElementById('modal-type');
const modalRating = document.getElementById('modal-rating');
const modalDate = document.getElementById('modal-date');
const modalLang = document.getElementById('modal-lang');

// Properties Table Elements
const modalPropTitle = document.getElementById('modal-prop-title');
const modalPropName = document.getElementById('modal-prop-name');
const modalPropRating = document.getElementById('modal-prop-rating');
const modalPropReleaseDate = document.getElementById('modal-prop-release-date');
const modalPropPopularity = document.getElementById('modal-prop-popularity');

const modalToggleWatchlistBtn = document.getElementById('modal-toggle-watchlist-btn');
const modalWatchlistText = document.getElementById('modal-watchlist-text');

// Watchlist Drawer Elements
const watchlistModal = document.getElementById('watchlist-modal');
const watchlistToggleBtn = document.getElementById('watchlist-toggle-btn');
const closeWatchlistBtn = document.getElementById('close-watchlist-btn');
const watchlistItemsContainer = document.getElementById('watchlist-items');
const watchlistCountBadge = document.getElementById('watchlist-count');
const footerWatchlistLink = document.getElementById('footer-watchlist-link');
const toast = document.getElementById('toast');

// ------------------------------------------------------------------------------
// 4. API FETCH & INITIALIZATION
// ------------------------------------------------------------------------------
async function initCineFlow() {
  updateWatchlistBadge();

  try {
    const response = await fetch(apiUrl, apiOptions);
    if (!response.ok) {
      throw new Error(`TMDB HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Cine Flow Trending Data:', data['results']);

    allTitles = data['results'] || [];
    filteredTitles = [...allTitles];

    if (allTitles.length > 0) {
      // 1. Populate Spotlight Hero Section with the #1 Trending item
      renderHero(allTitles[0]);

      // 2. Render Trending Catalog Grid
      applyFiltersAndRender();
    } else {
      showEmptyState(true);
    }
  } catch (error) {
    console.error('Failed to fetch from TMDB:', error);
    moviesGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
        <h3 style="color: #ff2a5f; margin-bottom: 0.5rem;">Connection to TMDB Failed</h3>
        <p style="color: #94a3b8;">${error.message}</p>
        <button class="btn btn-secondary" onclick="location.reload()" style="margin-top: 1rem;">Retry Stream</button>
      </div>
    `;
  }
}

// ------------------------------------------------------------------------------
// 5. HERO SPOTLIGHT RENDERING
// ------------------------------------------------------------------------------
function renderHero(movie) {
  if (!movie) return;

  const title = movie.title || movie.name || 'Untitled';
  const overview = movie.overview || 'No synopsis available for this title.';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
  const releaseDate = movie.release_date || movie.first_air_date || '';
  const year = releaseDate ? releaseDate.slice(0, 4) : '2026';
  const mediaType = movie.media_type === 'tv' ? 'TV SERIES' : 'MOVIE';
  const lang = (movie.original_language || 'EN').toUpperCase();

  // Set Hero Texts
  heroTitle.textContent = title;
  heroOverview.textContent = overview;
  heroRating.textContent = `⭐ ${rating}`;
  heroType.textContent = mediaType;
  heroYear.textContent = year;
  heroLang.textContent = lang;

  // Set Hero Backdrop (Original high-resolution background)
  if (movie.backdrop_path) {
    heroBackdrop.style.backgroundImage = `url('${imageBaseUrlBackdrop}${movie.backdrop_path}')`;
  }

  // Target element 'Img' as requested: document.getElementById('Img')
  if (heroImg) {
    heroImg.src = movie.poster_path 
      ? `${imageBaseUrlPoster}${movie.poster_path}` 
      : fallbackPoster;
    heroImg.alt = `${title} Poster`;
  }

  // Action Buttons
  heroDetailsBtn.onclick = () => openDetailsModal(movie);
  heroWatchlistBtn.onclick = () => toggleWatchlist(movie);
  updateHeroWatchlistBtn(movie.id);
}

function updateHeroWatchlistBtn(movieId) {
  const isSaved = watchlist.some(item => item.id === movieId);
  if (isSaved) {
    heroWatchlistBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
      </svg>
      Saved in Watchlist
    `;
    heroWatchlistBtn.style.background = 'rgba(255, 42, 95, 0.25)';
    heroWatchlistBtn.style.borderColor = 'var(--accent-cine)';
  } else {
    heroWatchlistBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
      </svg>
      Add to Watchlist
    `;
    heroWatchlistBtn.style.background = '';
    heroWatchlistBtn.style.borderColor = '';
  }
}

// ------------------------------------------------------------------------------
// 6. MOVIES GRID RENDERING
// ------------------------------------------------------------------------------
function renderGrid(movies) {
  moviesGrid.innerHTML = '';

  if (!movies || movies.length === 0) {
    showEmptyState(true);
    resultsCount.textContent = '0 Titles Found';
    return;
  }

  showEmptyState(false);
  resultsCount.textContent = `${movies.length} Title${movies.length === 1 ? '' : 's'} Available`;

  movies.forEach(movie => {
    const title = movie.title || movie.name || 'Untitled';
    const releaseDate = movie.release_date || movie.first_air_date || '';
    const year = releaseDate ? releaseDate.slice(0, 4) : '2026';
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
    const mediaType = movie.media_type === 'tv' ? 'TV' : 'Movie';
    const posterSrc = movie.poster_path 
      ? `${imageBaseUrlPoster}${movie.poster_path}` 
      : fallbackPoster;
    const isSaved = watchlist.some(item => item.id === movie.id);

    const card = document.createElement('article');
    card.className = 'movie-card';
    card.setAttribute('data-id', movie.id);

    card.innerHTML = `
      <div class="card-poster-wrap">
        <img 
          class="card-poster-img" 
          src="${posterSrc}" 
          alt="${title}" 
          loading="lazy"
        >
        <span class="card-rating-badge">⭐ ${rating}</span>
        <span class="card-type-badge">${mediaType}</span>
        <button 
          class="card-favorite-btn ${isSaved ? 'in-watchlist' : ''}" 
          title="${isSaved ? 'Remove from Watchlist' : 'Add to Watchlist'}"
          aria-label="Toggle Watchlist"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      </div>

      <div class="card-info">
        <h3 class="card-title" title="${title}">${title}</h3>
        <div class="card-meta">
          <span>${year}</span>
          <span>${mediaType}</span>
        </div>
      </div>
    `;

    // Click card to open Details Modal
    card.addEventListener('click', (e) => {
      // Prevent opening modal when clicking the favorite heart button directly
      if (e.target.closest('.card-favorite-btn')) {
        return;
      }
      openDetailsModal(movie);
    });

    // Favorite button click
    const favBtn = card.querySelector('.card-favorite-btn');
    favBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleWatchlist(movie);
      // Toggle button visual state
      const nowSaved = watchlist.some(item => item.id === movie.id);
      favBtn.classList.toggle('in-watchlist', nowSaved);
      favBtn.querySelector('svg').setAttribute('fill', nowSaved ? 'currentColor' : 'none');
      favBtn.title = nowSaved ? 'Remove from Watchlist' : 'Add to Watchlist';
    });

    moviesGrid.appendChild(card);
  });
}

// ------------------------------------------------------------------------------
// 7. FILTER, SEARCH & SORT LOGIC
// ------------------------------------------------------------------------------
function applyFiltersAndRender() {
  let list = [...allTitles];

  // 1. Text Search Filter
  if (searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase().trim();
    list = list.filter(item => {
      const title = (item.title || item.name || '').toLowerCase();
      const overview = (item.overview || '').toLowerCase();
      return title.includes(q) || overview.includes(q);
    });
  }

  // 2. Category Tab Filter
  if (currentFilter === 'movie') {
    list = list.filter(item => item.media_type === 'movie');
  } else if (currentFilter === 'tv') {
    list = list.filter(item => item.media_type === 'tv');
  } else if (currentFilter === 'high-rated') {
    list = list.filter(item => item.vote_average >= 8.0);
  }

  // 3. Sorting
  if (currentSort === 'popularity-desc') {
    list.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
  } else if (currentSort === 'rating-desc') {
    list.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
  } else if (currentSort === 'date-desc') {
    list.sort((a, b) => {
      const dateA = a.release_date || a.first_air_date || '';
      const dateB = b.release_date || b.first_air_date || '';
      return dateB.localeCompare(dateA);
    });
  } else if (currentSort === 'title-asc') {
    list.sort((a, b) => {
      const titleA = a.title || a.name || '';
      const titleB = b.title || b.name || '';
      return titleA.localeCompare(titleB);
    });
  }

  filteredTitles = list;
  renderGrid(filteredTitles);
}

// Search Input Listener
searchInput.addEventListener('input', (e) => {
  searchQuery = e.target.value;
  clearSearchBtn.classList.toggle('hidden', searchQuery.length === 0);
  sectionHeading.textContent = searchQuery ? `Results for "${searchQuery}"` : "Today's Trending Stream";
  applyFiltersAndRender();
});

// Clear Search Button
clearSearchBtn.addEventListener('click', () => {
  searchInput.value = '';
  searchQuery = '';
  clearSearchBtn.classList.add('hidden');
  sectionHeading.textContent = "Today's Trending Stream";
  applyFiltersAndRender();
});

// Filter Pills (Catalog controls)
filterPillsContainer.addEventListener('click', (e) => {
  const pill = e.target.closest('.pill');
  if (!pill) return;

  filterPillsContainer.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
  pill.classList.add('active');

  currentFilter = pill.getAttribute('data-filter') || pill.getAttribute('data_filter');
  applyFiltersAndRender();
});

// Navigation Bar Category Pills
navPills.forEach(pill => {
  pill.addEventListener('click', () => {
    navPills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');

    const filterVal = pill.getAttribute('data-filter') || pill.getAttribute('data_filter');
    currentFilter = filterVal;

    // Sync catalog filter pill UI
    filterPillsContainer.querySelectorAll('.pill').forEach(p => {
      const pVal = p.getAttribute('data-filter') || p.getAttribute('data_filter');
      p.classList.toggle('active', pVal === filterVal);
    });

    applyFiltersAndRender();
    document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
  });
});

// Sort Dropdown
sortSelect.addEventListener('change', (e) => {
  currentSort = e.target.value;
  applyFiltersAndRender();
});

// Reset Filters in empty state
resetFiltersBtn.addEventListener('click', () => {
  searchInput.value = '';
  searchQuery = '';
  clearSearchBtn.classList.add('hidden');
  currentFilter = 'all';
  filterPillsContainer.querySelectorAll('.pill').forEach(p => {
    const pVal = p.getAttribute('data-filter') || p.getAttribute('data_filter');
    p.classList.toggle('active', pVal === 'all');
  });
  applyFiltersAndRender();
});

function showEmptyState(show) {
  if (show) {
    emptyState.classList.remove('hidden');
    moviesGrid.classList.add('hidden');
  } else {
    emptyState.classList.add('hidden');
    moviesGrid.classList.remove('hidden');
  }
}

// ------------------------------------------------------------------------------
// 8. MOVIE DETAILS MODAL (Renders all 8 requested properties upon clicking)
// ------------------------------------------------------------------------------
function openDetailsModal(movie) {
  selectedMovie = movie;

  // 1. Title & 2. Name
  const title = movie.title || movie.name || 'Untitled';
  const name = movie.name || movie.original_name || movie.title || 'Untitled';

  // 3. Overview
  const overview = movie.overview || 'No overview synopsis provided for this title.';

  // 4. Rating
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

  // 5. Release Date
  const releaseDate = movie.release_date || movie.first_air_date || 'N/A';

  // 6. Popularity
  const popularity = movie.popularity ? movie.popularity.toFixed(1) : 'N/A';

  // Media Type & Language
  const mediaType = movie.media_type === 'tv' ? 'TV SERIES' : 'MOVIE';
  const lang = (movie.original_language || 'EN').toUpperCase();

  // Populate Header & Badges
  modalTitle.textContent = title;
  modalName.textContent = name;
  modalOverview.textContent = overview;
  modalType.textContent = mediaType;
  modalRating.textContent = `⭐ ${rating}/10`;
  modalDate.textContent = releaseDate;
  modalLang.textContent = lang;

  // 7. Genre(s) Mapping
  modalGenres.innerHTML = '';
  const genreIds = movie.genre_ids || [];
  if (genreIds.length > 0) {
    genreIds.forEach(id => {
      const genreName = tmdbGenres[id] || 'General';
      const pill = document.createElement('span');
      pill.className = 'genre-pill';
      pill.textContent = genreName;
      modalGenres.appendChild(pill);
    });
  } else {
    const pill = document.createElement('span');
    pill.className = 'genre-pill';
    pill.textContent = 'General / Streaming';
    modalGenres.appendChild(pill);
  }

  // Populate Explicit Properties Summary Grid
  modalPropTitle.textContent = title;
  modalPropName.textContent = name;
  modalPropRating.textContent = `⭐ ${rating} / 10`;
  modalPropReleaseDate.textContent = releaseDate;
  modalPropPopularity.textContent = `${popularity} pts`;

  // 8. Poster & Backdrop Images
  modalPosterImg.src = movie.poster_path 
    ? `${imageBaseUrlPoster}${movie.poster_path}` 
    : fallbackPoster;
  modalPosterImg.alt = `${title} Poster`;

  modalBackdropImg.src = movie.backdrop_path 
    ? `${imageBaseUrlBackdrop}${movie.backdrop_path}` 
    : (movie.poster_path ? `${imageBaseUrlBackdrop}${movie.poster_path}` : fallbackPoster);

  updateModalWatchlistBtn(movie.id);

  detailsModal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeDetailsModal() {
  detailsModal.classList.add('hidden');
  document.body.style.overflow = '';
  selectedMovie = null;
}

closeModalBtn.addEventListener('click', closeDetailsModal);

detailsModal.addEventListener('click', (e) => {
  if (e.target === detailsModal) {
    closeDetailsModal();
  }
});

modalToggleWatchlistBtn.addEventListener('click', () => {
  if (selectedMovie) {
    toggleWatchlist(selectedMovie);
    updateModalWatchlistBtn(selectedMovie.id);
    applyFiltersAndRender();
  }
});

function updateModalWatchlistBtn(movieId) {
  const isSaved = watchlist.some(item => item.id === movieId);
  if (isSaved) {
    modalWatchlistText.textContent = 'Remove from Watchlist';
    modalToggleWatchlistBtn.style.background = 'rgba(255, 42, 95, 0.2)';
    modalToggleWatchlistBtn.style.borderColor = 'var(--accent-cine)';
  } else {
    modalWatchlistText.textContent = 'Save to Watchlist';
    modalToggleWatchlistBtn.style.background = 'var(--accent-gradient)';
    modalToggleWatchlistBtn.style.borderColor = 'transparent';
  }
}

// ------------------------------------------------------------------------------
// 9. WATCHLIST SYSTEM (LocalStorage)
// ------------------------------------------------------------------------------
function toggleWatchlist(movie) {
  const index = watchlist.findIndex(item => item.id === movie.id);
  const title = movie.title || movie.name || 'Title';

  if (index >= 0) {
    watchlist.splice(index, 1);
    showToast(`Removed "${title}" from Watchlist`);
  } else {
    watchlist.push({
      id: movie.id,
      title: title,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      release_date: movie.release_date || movie.first_air_date || '',
      media_type: movie.media_type
    });
    showToast(`Added "${title}" to Watchlist!`);
  }

  localStorage.setItem('cineflow_watchlist', JSON.stringify(watchlist));
  updateWatchlistBadge();
  renderWatchlistDrawer();
  updateHeroWatchlistBtn(movie.id);
}

function updateWatchlistBadge() {
  watchlistCountBadge.textContent = watchlist.length;
}

function renderWatchlistDrawer() {
  watchlistItemsContainer.innerHTML = '';

  if (watchlist.length === 0) {
    watchlistItemsContainer.innerHTML = `
      <div style="text-align: center; padding: 3rem 1rem; color: #94a3b8;">
        <div style="font-size: 2.5rem; margin-bottom: 0.75rem;">🎬</div>
        <p style="font-weight: 600; color: #fff; margin-bottom: 0.25rem;">Your Watchlist is Empty</p>
        <p style="font-size: 0.85rem;">Click the bookmark icon on any movie to save it for later.</p>
      </div>
    `;
    return;
  }

  watchlist.forEach(item => {
    const posterSrc = item.poster_path 
      ? `${imageBaseUrlPoster}${item.poster_path}` 
      : fallbackPoster;

    const el = document.createElement('div');
    el.className = 'watchlist-item';
    el.innerHTML = `
      <img class="watchlist-thumb" src="${posterSrc}" alt="${item.title}">
      <div class="watchlist-info">
        <h4 class="watchlist-item-title" title="${item.title}">${item.title}</h4>
        <div class="watchlist-item-meta">
          <span>⭐ ${item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}</span> • 
          <span>${item.media_type === 'tv' ? 'TV Series' : 'Movie'}</span>
        </div>
      </div>
      <button class="watchlist-remove-btn" title="Remove" aria-label="Remove from Watchlist">✕</button>
    `;

    // Remove button listener
    el.querySelector('.watchlist-remove-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      toggleWatchlist(item);
      applyFiltersAndRender();
    });

    // Click item to open full details
    el.addEventListener('click', () => {
      const fullMovie = allTitles.find(m => m.id === item.id) || item;
      openDetailsModal(fullMovie);
      watchlistModal.classList.add('hidden');
    });

    watchlistItemsContainer.appendChild(el);
  });
}

// Watchlist Drawer Listeners
watchlistToggleBtn.addEventListener('click', () => {
  renderWatchlistDrawer();
  watchlistModal.classList.remove('hidden');
});

closeWatchlistBtn.addEventListener('click', () => {
  watchlistModal.classList.add('hidden');
});

watchlistModal.addEventListener('click', (e) => {
  if (e.target === watchlistModal) {
    watchlistModal.classList.add('hidden');
  }
});

if (footerWatchlistLink) {
  footerWatchlistLink.addEventListener('click', (e) => {
    e.preventDefault();
    renderWatchlistDrawer();
    watchlistModal.classList.remove('hidden');
  });
}

// ------------------------------------------------------------------------------
// 10. TOAST NOTIFICATION UTILITY
// ------------------------------------------------------------------------------
let toastTimer = null;
function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.remove('hidden');

  toastTimer = setTimeout(() => {
    toast.classList.add('hidden');
  }, 2600);
}

// ------------------------------------------------------------------------------
// 11. KEYBOARD ACCESSIBILITY (ESC to close modals)
// ------------------------------------------------------------------------------
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (!detailsModal.classList.contains('hidden')) {
      closeDetailsModal();
    }
    if (!watchlistModal.classList.contains('hidden')) {
      watchlistModal.classList.add('hidden');
    }
  }
});

// Kick off Cine Flow on DOMContentLoaded
document.addEventListener('DOMContentLoaded', initCineFlow);
