'use strict';

/* === INITIALIZATION === */

  function init() {
    Preloader.init();
    FloatingElements.init();
    ScrollAnimations.init();
    ScrollProgress.init();
    Parallax.init();
    AudioController.init();
    CardGlowEffect.init();
    YearCounter.init();
    MaafinSaya.init();
    ThrRoulette.init();
    CountdownTimer.init();
    BackToTop.init();
    TekaTekiDana.init();
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
