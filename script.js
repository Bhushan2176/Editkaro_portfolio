const search = document.getElementById('search');
const sort = document.getElementById('sort');
const items = document.querySelectorAll('.item');
const grid = document.getElementById('grid');
const lightbox = document.getElementById('lightbox');
const player = document.getElementById('player');
const closeBtn = document.querySelector('.close');
const state = { query: '', sort: 'new', category: '' };
let debounceTimeout;

function apply() {
  const q = state.query.trim().toLowerCase();
  const filtered = Array.from(items).filter(it => {
    const inText = !q || it.dataset.title.toLowerCase().includes(q) || (it.dataset.tags || '').toLowerCase().includes(q);
    const inCategory = !state.category || it.dataset.category === state.category;
    it.style.display = inText && inCategory ? '' : 'none';
    return inText && inCategory;
  });

  filtered.sort((a, b) => {
    if (state.sort === 'new') return new Date(b.dataset.date) - new Date(a.dataset.date);
    if (state.sort === 'old') return new Date(a.dataset.date) - new Date(b.dataset.date);
    if (state.sort === 'az') return a.dataset.title.localeCompare(b.dataset.title);
    if (state.sort === 'za') return b.dataset.title.localeCompare(a.dataset.title);
    return 0;
  });
  filtered.forEach(el => grid.appendChild(el));
}

document.querySelectorAll('.category-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.category = btn.dataset.category || '';
    apply();
  });
});

document.addEventListener('click', e => {
  const thumb = e.target.closest('.thumb');
  if (thumb && thumb.dataset.video) openLightbox(thumb.dataset.video);
  if (e.target.closest('.close') || e.target === lightbox) closeLightbox();
});

function openLightbox(src) {
  const errorMsg = document.getElementById('video-error');
  player.innerHTML = `<source src="${src}" type="video/mp4">`;
  player.load();
  player.currentTime = 0;
  player.play().catch(() => { errorMsg.style.display = 'block'; });
  errorMsg.style.display = 'none';
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  closeBtn.focus();
}

function closeLightbox() {
  player.pause();
  player.innerHTML = '';
  player.currentTime = 0;
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
}

document.querySelectorAll('.thumb video').forEach(video => {
  video.addEventListener('mouseenter', () => video.play().catch(() => {}));
  video.addEventListener('mouseleave', () => { video.pause(); video.currentTime = 0; });
});

document.getElementById('year').textContent = new Date().getFullYear();
apply();
