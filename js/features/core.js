'use strict';

/* --- JS CORE --- */
/**
 * ============================================
 * IDUL FITRI 1447 H — GREETING WEBSITE
 * Main JavaScript
 *
 * Table of Contents:
 * 1. Preloader
 * 2. Confetti Animation
 * 3. Floating Elements
 * 4. Scroll Animations (Intersection Observer)
 * 5. Hero Load Animations
 * 6. Scroll Progress Bar
 * 7. Parallax Effects
 * 8. Audio Controller
 * 9. Initialization
 * ============================================
 */



  
/* === PRELOADER === */

  const Preloader = {
    el: document.getElementById('preloader'),
    enterBtn: document.getElementById('preloader-enter'),

    /** Hide the preloader and trigger page entry animations */
    hide() {
      this.el.classList.add('is-hidden');
      // Trigger hero animations after preloader hides
      HeroAnimations.play();
      // Start confetti after a short delay
      setTimeout(() => Confetti.start(), 400);
      // Play audio immediately (user just clicked, so browser allows it)
      AudioController.tryAutoPlay();
    },

    init() {
      // Wait for page to load, then show the enter button
      window.addEventListener('load', () => {
        // Button is already visible, just attach click handler
        this.enterBtn.addEventListener('click', () => this.hide());
      });
    }
  };

  
/* === CONFETTI ANIMATION === */

  const Confetti = {
    canvas: document.getElementById('confetti-canvas'),
    ctx: null,
    particles: [],
    animationId: null,
    duration: 5000, // ms

    /** Color palette for confetti */
    colors: [
      '#f0d27c', '#c9a84c', '#e8c255', // golds
      '#5cb585', '#3aa56e', '#2e8a5b', // greens
      '#ffffff', '#faefc5',             // whites/creams
    ],

    /** Initialize canvas and create particles */
    start() {
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      this.createParticles(150);
      this.animate();

      // Stop confetti after duration
      setTimeout(() => this.stop(), this.duration);

      // Handle resize
      window.addEventListener('resize', () => this.resize());
    },

    /** Resize canvas to viewport */
    resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    },

    /** Create N confetti particles */
    createParticles(count) {
      this.particles = [];
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height - this.canvas.height,
          size: Math.random() * 8 + 3,
          speedX: (Math.random() - 0.5) * 4,
          speedY: Math.random() * 3 + 2,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 10,
          color: this.colors[Math.floor(Math.random() * this.colors.length)],
          opacity: Math.random() * 0.7 + 0.3,
          shape: Math.random() > 0.5 ? 'rect' : 'circle',
          wobble: Math.random() * 10,
          wobbleSpeed: Math.random() * 0.05 + 0.02,
        });
      }
    },

    /** Animation loop */
    animate() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.particles.forEach((p) => {
        this.ctx.save();
        this.ctx.globalAlpha = p.opacity;
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate((p.rotation * Math.PI) / 180);
        this.ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        } else {
          this.ctx.beginPath();
          this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          this.ctx.fill();
        }

        this.ctx.restore();

        // Update position
        p.x += p.speedX + Math.sin(p.wobble) * 0.5;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;
        p.wobble += p.wobbleSpeed;

        // Gentle gravity and wind
        p.speedY += 0.02;
        p.speedX *= 0.999;

        // Fade out near bottom
        if (p.y > this.canvas.height * 0.8) {
          p.opacity -= 0.01;
        }
      });

      // Remove invisible particles
      this.particles = this.particles.filter((p) => p.opacity > 0 && p.y < this.canvas.height + 50);

      if (this.particles.length > 0) {
        this.animationId = requestAnimationFrame(() => this.animate());
      }
    },

    /** Stop the confetti animation */
    stop() {
      // Gradually fade remaining particles
      this.particles.forEach((p) => {
        p.opacity -= 0.02;
      });
    },
  };

  
/* === FLOATING ELEMENTS (Decorative particles) === */

  const FloatingElements = {
    container: document.getElementById('floating-elements'),

    /** Symbols to float */
    symbols: ['☪', '⭐', '✦', '✧', '◆', '🌙', '✨'],

    /** Create floating elements */
    init() {
      const count = window.innerWidth < 768 ? 8 : 15;
      for (let i = 0; i < count; i++) {
        this.createItem(i, count);
      }
    },

    /** Create a single floating element */
    createItem(index, total) {
      const el = document.createElement('span');
      el.classList.add('floating-el');
      el.textContent = this.symbols[Math.floor(Math.random() * this.symbols.length)];

      // Random positioning and timing
      const size = Math.random() * 1.2 + 0.6;
      const left = Math.random() * 100;
      const delay = (index / total) * 20; // Stagger start times
      const duration = Math.random() * 15 + 20; // 20-35 seconds

      el.style.cssText = `
        left: ${left}%;
        font-size: ${size}rem;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
        color: rgba(201, 168, 76, ${Math.random() * 0.4 + 0.2});
      `;

      this.container.appendChild(el);
    },
  };

  
/* === SCROLL ANIMATIONS (Intersection Observer) === */

  const ScrollAnimations = {
    /** Initialize the observer for scroll-triggered animations */
    init() {
      const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px',
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const stagger = parseInt(el.dataset.stagger || '0', 10);
            const delay = stagger * 120; // 120ms stagger between items

            setTimeout(() => {
              el.classList.add('is-visible');
            }, delay);

            // Unobserve after animating
            observer.unobserve(el);
          }
        });
      }, observerOptions);

      // Observe all scroll-animate elements
      document.querySelectorAll('.scroll-animate').forEach((el) => {
        observer.observe(el);
      });
    },
  };

  
/* === SCROLL PROGRESS BAR === */

  const ScrollProgress = {
    bar: document.querySelector('.scroll-progress__bar'),

    /** Update the progress bar width based on scroll position */
    update() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      this.bar.style.width = `${progress}%`;
    },

    init() {
      window.addEventListener('scroll', () => this.update(), { passive: true });
    },
  };

  
/* === PARALLAX EFFECTS (Lightweight) === */

  const Parallax = {
    elements: [],

    init() {
      // Register parallax targets
      this.elements = [
        {
          el: document.querySelector('.hero__glow'),
          speed: 0.3,
          type: 'translate',
        },
        {
          el: document.querySelector('.hero__stars'),
          speed: 0.15,
          type: 'translate',
        },
        {
          el: document.querySelector('.hero__mosque'),
          speed: 0.1,
          type: 'translate',
        },
      ];

      // Use requestAnimationFrame for smooth updates
      let ticking = false;
      window.addEventListener(
        'scroll',
        () => {
          if (!ticking) {
            requestAnimationFrame(() => {
              this.update();
              ticking = false;
            });
            ticking = true;
          }
        },
        { passive: true }
      );
    },

    /** Update parallax positions */
    update() {
      const scrollY = window.scrollY;
      // Only apply parallax in the hero area (first 100vh)
      if (scrollY > window.innerHeight) return;

      this.elements.forEach(({ el, speed }) => {
        if (!el) return;
        const yOffset = scrollY * speed;
        el.style.transform = `translateY(${yOffset}px)`;
      });
    },
  };

  
/* === AUDIO CONTROLLER === */

  const AudioController = {
    toggleBtn: document.getElementById('audio-toggle'),
    audio: null,
    isMuted: false,
    hasAutoPlayed: false,

    /** Initialize audio with a takbiran sound */
    init() {
      // Create an audio element programmatically
      this.audio = new Audio();
      
      this.audio.src = 'assets/audio/takbiran.mp3';
      this.audio.loop = true;
      this.audio.volume = 0.3;
      this.audio.preload = 'auto';

      // Start as NOT muted (we want it to play)
      this.toggleBtn.classList.remove('is-muted');

      // Toggle handler
      this.toggleBtn.addEventListener('click', () => this.toggle());

      // Handle audio loading errors gracefully
      this.audio.addEventListener('error', () => {
        console.log('Audio file not found. Place takbiran.mp3 in assets/audio/ folder.');
      });
    },

    /** Try to autoplay audio (called after preloader hides) */
    tryAutoPlay() {
      this.audio.play().then(() => {
        this.isMuted = false;
        this.hasAutoPlayed = true;
        this.toggleBtn.classList.remove('is-muted');
      }).catch(() => {
        // Browser blocked autoplay — wait for first user interaction
        console.log('Autoplay blocked. Will play on first interaction.');
        this.setupInteractionFallback();
      });
    },

    /** Fallback: play audio on first user interaction */
    setupInteractionFallback() {
      const playOnInteraction = () => {
        if (!this.hasAutoPlayed) {
          this.audio.play().then(() => {
            this.isMuted = false;
            this.hasAutoPlayed = true;
            this.toggleBtn.classList.remove('is-muted');
          }).catch(() => {});
        }
        // Remove listeners after first interaction
        document.removeEventListener('click', playOnInteraction);
        document.removeEventListener('touchstart', playOnInteraction);
        document.removeEventListener('scroll', playOnInteraction);
      };

      document.addEventListener('click', playOnInteraction, { once: true });
      document.addEventListener('touchstart', playOnInteraction, { once: true });
      document.addEventListener('scroll', playOnInteraction, { once: true });
    },

    /** Toggle audio play/pause */
    toggle() {
      if (this.isMuted) {
        this.audio.play().then(() => {
          this.isMuted = false;
          this.hasAutoPlayed = true;
          this.toggleBtn.classList.remove('is-muted');
        }).catch((err) => {
          console.log('Audio playback error:', err.message);
        });
      } else {
        this.audio.pause();
        this.isMuted = true;
        this.toggleBtn.classList.add('is-muted');
      }
    },
  };

  
/* === BACK TO TOP BUTTON === */

  const BackToTop = {
    btn: document.getElementById('back-to-top'),

    init() {
      if (!this.btn) return;

      // Show/hide based on scroll position
      window.addEventListener('scroll', () => {
        if (window.scrollY > window.innerHeight) {
          this.btn.classList.add('is-visible');
        } else {
          this.btn.classList.remove('is-visible');
        }
      }, { passive: true });

      // Scroll to top on click
      this.btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    },
  };

  