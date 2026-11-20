/* MRuiz · realce compartido de las páginas de categoría */
(function () {
  const tarjetas = Array.from(document.querySelectorAll('.servei'));

  function iniciales(nombre) {
    const limpio = nombre.replace(/[█▓▒░]/g, '').replace(/\([^)]*\)/g, '').trim();
    const palabras = limpio.split(/[^A-Za-z0-9ÁÉÍÓÚÜÑáéíóúüñ]+/).filter(Boolean);
    if (!palabras.length) return '••';
    if (palabras.length === 1) return palabras[0].slice(0, 2).toUpperCase();
    return (palabras[0][0] + palabras[1][0]).toUpperCase();
  }

  const estilo = getComputedStyle(document.body);
  const base = parseInt(estilo.getPropertyValue('--hue'), 10) || 210;

  tarjetas.forEach((card, indice) => {
    const titulo = card.querySelector('h3');
    const nombre = titulo ? titulo.textContent.trim() : 'Servicio';
    const hue = card.classList.contains('nether') ? 282 : (base + (indice % 4) * 18) % 360;
    card.style.setProperty('--card-hue', hue);

    const media = document.createElement('div');
    media.className = 'card-media';
    media.innerHTML = '<span class="card-glyph">' + iniciales(nombre) + '</span>' +
      '<span class="card-badge">' + String(indice + 1).padStart(2, '0') + '</span>';

    const cuerpo = document.createElement('div');
    cuerpo.className = 'servei-body';
    while (card.firstChild) cuerpo.appendChild(card.firstChild);

    card.appendChild(media);
    card.appendChild(cuerpo);

    card.addEventListener('pointermove', (evento) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((evento.clientX - rect.left) / rect.width * 100) + '%');
      card.style.setProperty('--my', ((evento.clientY - rect.top) / rect.height * 100) + '%');
    });
  });

  const observador = 'IntersectionObserver' in window
    ? new IntersectionObserver((entradas, obs) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            entrada.target.classList.add('is-visible');
            obs.unobserve(entrada.target);
          }
        });
      }, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' })
    : null;

  tarjetas.forEach((card, indice) => {
    card.style.transitionDelay = (indice % 6) * 60 + 'ms';
    if (observador) observador.observe(card);
    else card.classList.add('is-visible');
  });

  /* Salvaguarda: asegura que las tarjetas visibles nunca queden ocultas */
  setTimeout(() => {
    tarjetas.forEach((card) => {
      const rect = card.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        card.classList.add('is-visible');
      }
    });
  }, 1200);

  const botonSubir = document.getElementById('scroll-top');
  if (botonSubir) {
    const actualizar = () => botonSubir.classList.toggle('show', window.scrollY > 400);
    window.addEventListener('scroll', actualizar, { passive: true });
    actualizar();
    botonSubir.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();
