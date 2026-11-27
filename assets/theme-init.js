/* MRuiz · aplica el tema guardado antes de pintar la página */
(function () {
  try {
    var tema = localStorage.getItem('mruiz-theme');
    if (tema === 'light' || tema === 'dark') {
      document.documentElement.dataset.theme = tema;
    }
  } catch (error) {}
})();
