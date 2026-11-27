/* MRuiz · selector de tema compartido para todo el sitio */
(function () {
  const raiz = document.documentElement;
  const CLAVE = 'mruiz-theme';

  function cargarTema() {
    try {
      const guardado = localStorage.getItem(CLAVE);
      if (guardado === 'light' || guardado === 'dark') raiz.dataset.theme = guardado;
    } catch (error) {}
  }

  function crearEnlaceGlobal() {
    if (document.querySelector('link[href*="global-theme.css"]')) return;
    const enlace = document.createElement('link');
    enlace.rel = 'stylesheet';
    const src = document.currentScript && document.currentScript.src;
    enlace.href = src
      ? new URL('global-theme.css', src).href
      : new URL('assets/global-theme.css', document.baseURI).href;
    enlace.dataset.globalTheme = '';
    document.head.appendChild(enlace);
  }

  function crearBoton() {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'theme-toggle';
    boton.innerHTML =
      '<svg class="icon-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"></path></svg>' +
      '<svg class="icon-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path></svg>' +
      '<span class="theme-label">Tema</span>';
    boton.addEventListener('click', alternarTema);
    return boton;
  }

  function actualizarBoton() {
    document.querySelectorAll('.theme-toggle').forEach((boton) => {
      const texto = raiz.dataset.theme === 'light' ? 'Cambiar a tema oscuro' : 'Cambiar a tema claro';
      boton.setAttribute('aria-label', texto);
      boton.setAttribute('title', texto);
    });
  }

  function actualizarThemeColor() {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) return;
    if (!meta.dataset.dark) meta.dataset.dark = meta.content || '#060914';
    meta.content = raiz.dataset.theme === 'light' ? '#f6f8fc' : meta.dataset.dark;
  }

  function alternarTema() {
    raiz.dataset.theme = raiz.dataset.theme === 'light' ? 'dark' : 'light';
    try {
      localStorage.setItem(CLAVE, raiz.dataset.theme);
    } catch (error) {}
    actualizarBoton();
    actualizarThemeColor();
  }

  function colocarBoton() {
    if (document.querySelector('.theme-toggle')) {
      actualizarBoton();
      return;
    }

    const boton = crearBoton();
    const nav = document.querySelector('nav');

    if (nav) {
      const enlaces = nav.querySelectorAll('a');
      if (enlaces.length) enlaces[enlaces.length - 1].insertAdjacentElement('afterend', boton);
      else nav.appendChild(boton);
    } else {
      boton.classList.add('theme-floating');
      const label = boton.querySelector('.theme-label');
      if (label) label.remove();
      document.body.appendChild(boton);
    }

    actualizarBoton();
  }

  cargarTema();
  crearEnlaceGlobal();
  actualizarThemeColor();
  colocarBoton();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', colocarBoton, { once: true });
  }
})();
