// Année footer
document.getElementById('year').textContent = new Date().getFullYear();

// Révélation au scroll
const io = new IntersectionObserver((entries)=> {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
},{threshold:0.12});
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Filtrage de projets
const chips = document.querySelectorAll('.chip');
const cards = document.querySelectorAll('.card');
chips.forEach(chip=>{
  chip.addEventListener('click', ()=>{
    chips.forEach(c=>c.classList.remove('active'));
    chip.classList.add('active');
    const f = chip.dataset.filter;
    cards.forEach(card=>{
      const show = f === 'all' || card.dataset.cat === f;
      card.style.display = show ? '' : 'none';
    });
  });
});

// Hover preview: si la carte contient une vidéo, on la lance/stoppe au survol
cards.forEach(card=>{
  const vid = card.querySelector('video');
  if (vid){
    card.addEventListener('mouseenter', ()=> {
      vid.currentTime = 0;
      const play = vid.play();
      if (play && typeof play.catch === 'function') play.catch(()=>{ /* ignore autoplay restrictions */ });
    });
    card.addEventListener('mouseleave', ()=> vid.pause());
  }
});

// Lightbox vidéo (mp4, YouTube, Vimeo)
const lightbox = document.getElementById('lightbox');
const lightboxContent = lightbox.querySelector('.lightbox-content');
const closeBtn = lightbox.querySelector('.lightbox-close');

function openLightboxFor(card){
  const type = card.dataset.type;
  const src  = card.dataset.src;
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden','false');

  if (type === 'mp4'){
    const v = document.createElement('video');
    v.src = src;
    v.controls = true;
    v.playsInline = true;
    v.autoplay = true;
    v.style.background = '#000';
    lightboxContent.innerHTML = '';
    lightboxContent.appendChild(v);
  } else if (type === 'youtube'){
    // Remplace YOUTUBE_VIDEO_ID par l’ID réel (ex: dQw4w9WgXcQ)
    const id = src;
    lightboxContent.innerHTML = `<iframe src="https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1"
      title="YouTube video" frameborder="0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
  } else if (type === 'vimeo'){
    const id = src;
    lightboxContent.innerHTML = `<iframe src="https://player.vimeo.com/video/${id}?autoplay=1&title=0&byline=0&portrait=0"
      title="Vimeo video" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
  }
}
function closeLightbox(){
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden','true');
  lightboxContent.innerHTML = '';
}
closeBtn.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e)=> { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e)=> { if (e.key === 'Escape') closeLightbox(); });

// Clic carte -> ouvrir la lightbox
cards.forEach(card=>{
  card.addEventListener('click', ()=> openLightboxFor(card));
});

// Parallax doux sur le titre (subtil)
const heroTitle = document.querySelector('.hero-title');
let raf = null;
window.addEventListener('mousemove', (e)=>{
  if (!heroTitle) return;
  const { innerWidth:w, innerHeight:h } = window;
  const dx = (e.clientX / w - 0.5) * 2; // -1..1
  const dy = (e.clientY / h - 0.5) * 2;
  if (raf) cancelAnimationFrame(raf);
  raf = requestAnimationFrame(()=>{
    heroTitle.style.transform = `translate3d(${dx*6}px, ${dy*4}px, 0)`;
  });
});
