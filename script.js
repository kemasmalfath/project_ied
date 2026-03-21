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

(function () {
  'use strict';

  /* ============================================
     1. PRELOADER
     ============================================ */
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

  /* ============================================
     2. CONFETTI ANIMATION
     ============================================ */
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

  /* ============================================
     3. FLOATING ELEMENTS (Decorative particles)
     ============================================ */
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

  /* ============================================
     4. SCROLL ANIMATIONS (Intersection Observer)
     ============================================ */
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

  /* ============================================
     5. HERO LOAD ANIMATIONS
     ============================================ */
  const HeroAnimations = {
    /** Play hero entrance animations with staggered delays */
    play() {
      const elements = document.querySelectorAll('.animate-on-load');
      elements.forEach((el) => {
        const delay = parseInt(el.dataset.delay || '0', 10);
        setTimeout(() => {
          el.classList.add('is-visible');
        }, delay);
      });
    },
  };

  /* ============================================
     6. SCROLL PROGRESS BAR
     ============================================ */
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

  /* ============================================
     7. PARALLAX EFFECTS (Lightweight)
     ============================================ */
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

  /* ============================================
     8. AUDIO CONTROLLER
     ============================================ */
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

  /* ============================================
     9. ADDITIONAL VISUAL EFFECTS
     ============================================ */
  
  /** Smooth mouse-following glow effect on greeting cards */
  const CardGlowEffect = {
    init() {
      const cards = document.querySelectorAll('.greeting-card');
      cards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const glow = card.querySelector('.greeting-card__glow');
          if (glow) {
            glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(201, 168, 76, 0.08) 0%, transparent 50%)`;
            glow.style.opacity = '1';
          }
        });

        card.addEventListener('mouseleave', () => {
          const glow = card.querySelector('.greeting-card__glow');
          if (glow) {
            glow.style.opacity = '0';
          }
        });
      });
    },
  };

  /** Smooth counter animation for the year number */
  const YearCounter = {
    init() {
      const yearEl = document.querySelector('.hero__year-number');
      if (!yearEl) return;

      const target = 1447;
      const startFrom = 1400;
      const duration = 2000; // ms
      let startTime = null;

      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        // Ease out expo
        const eased = 1 - Math.pow(2, -10 * progress);
        const current = Math.floor(startFrom + (target - startFrom) * eased);
        yearEl.textContent = current;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          yearEl.textContent = target;
        }
      };

      // Start counter when hero animations begin (after preloader)
      setTimeout(() => {
        requestAnimationFrame(animate);
      }, 2600); // Matches the hero year delay
    },
  };

  /* ============================================
     9.5. MAAFIN SAYA (Interactive Forgiveness)
     ============================================ */
  const MaafinSaya = {
    // DOM elements
    card: null,
    emoji: null,
    title: null,
    subtitle: null,
    btnYes: null,
    btnNo: null,
    buttons: null,
    success: null,
    counter: null,
    counterText: null,
    confettiContainer: null,

    // State
    attempt: 0,
    maxAttempts: 3,

    /** Messages that change with each "Tidak" click */
    stages: [
      {
        emoji: '🥺',
        title: 'Maafin Saya Ya?',
        subtitle: 'Kalau ada salah kata atau perbuatan, mohon dimaafkan ya 🙏',
        counter: '',
      },
      {
        emoji: '😢',
        title: 'Yakin Tidak Mau Maafin?',
        subtitle: 'Please... saya sudah menyesal. Maafin ya? 🥲',
        counter: 'Percobaan 1 dari 3... ayolah 🙏',
      },
      {
        emoji: '😭',
        title: 'Masih Tidak Mau?!',
        subtitle: 'Hatiku remuk redam... tolonglah maafkan saya 💔',
        counter: 'Percobaan 2 dari 3... kamu serius nih? 😰',
      },
      {
        emoji: '🤗',
        title: 'Udah Ga Bisa Nolak!',
        subtitle: 'Hehehe... tombol "Tidak" nya udah hilang. Pencet yang ijo aja ya! 💚',
        counter: 'Sudah tidak bisa menolak lagi! 😏',
      },
    ],

    /** Mini confetti colors */
    confettiColors: ['#f0d27c', '#c9a84c', '#5cb585', '#3aa56e', '#ffffff', '#e8c255', '#ff6b9d', '#c084fc'],

    init() {
      // Get DOM elements
      this.card = document.querySelector('.maafin-card');
      this.emoji = document.getElementById('maafin-emoji');
      this.title = document.getElementById('maafin-title');
      this.subtitle = document.getElementById('maafin-subtitle');
      this.btnYes = document.getElementById('btn-maafin-yes');
      this.btnNo = document.getElementById('btn-maafin-no');
      this.buttons = document.getElementById('maafin-buttons');
      this.success = document.getElementById('maafin-success');
      this.counter = document.getElementById('maafin-counter');
      this.counterText = document.getElementById('maafin-counter-text');
      this.confettiContainer = document.getElementById('maafin-confetti');

      if (!this.btnYes || !this.btnNo) return;

      // Event listeners
      this.btnYes.addEventListener('click', () => this.handleYes());
      this.btnNo.addEventListener('click', () => this.handleNo());
    },

    /** Handle clicking "Iya, Saya Maafin" */
    handleYes() {
      // Hide buttons and interactive elements
      this.buttons.style.display = 'none';
      this.emoji.style.display = 'none';
      this.title.style.display = 'none';
      this.subtitle.style.display = 'none';
      this.counter.hidden = true;

      // Show success state
      this.success.hidden = false;

      // Spawn mini confetti inside the card
      this.spawnMiniConfetti();

      // Also trigger the global confetti!
      setTimeout(() => Confetti.start(), 200);
    },

    /** Handle clicking "Tidak Saya Maafin" */
    handleNo() {
      this.attempt++;

      // Don't exceed max attempts
      if (this.attempt > this.maxAttempts) return;

      // Shake the card
      this.card.classList.remove('shake');
      // Force reflow to restart animation
      void this.card.offsetWidth;
      this.card.classList.add('shake');

      // Get the stage data
      const stage = this.stages[this.attempt];

      // Update emoji, title, subtitle
      this.emoji.textContent = stage.emoji;
      this.emoji.style.fontSize = `${4 + this.attempt * 0.5}rem`;
      this.title.textContent = stage.title;
      this.subtitle.textContent = stage.subtitle;

      // Show and update counter
      this.counter.hidden = false;
      this.counterText.textContent = stage.counter;

      // Grow "Iya" button
      // Remove previous grow class, add new one
      for (let i = 1; i <= this.maxAttempts; i++) {
        this.btnYes.classList.remove(`grow-${i}`);
        this.btnNo.classList.remove(`shrink-${i}`);
      }
      this.btnYes.classList.add(`grow-${this.attempt}`);
      this.btnNo.classList.add(`shrink-${this.attempt}`);

      // At max attempts, the "Tidak" button becomes unclickable (handled by CSS pointer-events: none)
    },

    /** Spawn mini confetti particles inside the success card */
    spawnMiniConfetti() {
      const count = 40;
      for (let i = 0; i < count; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('mini-confetti');
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.top = `${-10}px`;
        confetti.style.backgroundColor = this.confettiColors[Math.floor(Math.random() * this.confettiColors.length)];
        confetti.style.animationDuration = `${Math.random() * 1.5 + 1}s`;
        confetti.style.animationDelay = `${Math.random() * 0.5}s`;
        confetti.style.width = `${Math.random() * 6 + 4}px`;
        confetti.style.height = `${Math.random() * 6 + 4}px`;
        this.confettiContainer.appendChild(confetti);
      }

      // Clean up after animation
      setTimeout(() => {
        this.confettiContainer.innerHTML = '';
      }, 3000);
    },
  };

  /* ============================================
     9.6. THR ROULETTE (Spin Wheel Game)
     ============================================ */
  const ThrRoulette = {
    canvas: null,
    ctx: null,
    wheel: null,
    spinBtn: null,
    retryBtn: null,
    resultPanel: null,
    resultEmoji: null,
    resultTitle: null,
    resultText: null,

    // Wheel state
    currentAngle: 0,
    isSpinning: false,
    spinAnimationId: null,

    /** The segments on the wheel */
    segments: [
      { label: 'Rp 50.000', color: '#2e8a5b', emoji: '💰' },
      { label: 'ZONK', color: '#d4a843', emoji: '😭' },
      { label: 'Rp 100.000', color: '#175234', emoji: '💸' },
      { label: 'ZONK', color: '#c9a84c', emoji: '😭' },
      { label: 'Rp 500.000', color: '#226e47', emoji: '🤑' },
      { label: 'ZONK', color: '#e8c255', emoji: '😭' },
      { label: 'Rp 1.000.000', color: '#0d4f36', emoji: '💎' },
      { label: 'ZONK', color: '#f0d27c', emoji: '😭' },
    ],

    /** Result messages — all humorous "THR dalam bentuk doa" */
    results: [
      {
        emoji: '💰',
        title: 'Dapat Rp 50.000!',
        text: 'Wah lumayan Rp 50.000! Tapi... THR-nya dalam bentuk doa aja ya! Doanya 50rb perak buat kesehatan dan kebahagiaan kamu! 😁✨',
      },
      {
        emoji: '😭',
        title: 'YAH ZONK!',
        text: 'Duh sayang sekali kamu belum beruntung dapet nominal uangnya! Gak apa-apa, sebagai gantinya ku doakan semoga kamu panjang umur, dimudahkan segala urusannya, dan keluargamu selalu dalam lindungan-Nya. Aamiin! 🤲',
      },
      {
        emoji: '💸',
        title: 'Dapat Rp 100.000!',
        text: 'Rp 100.000 cuy! Eits tapi... THR-nya dalam bentuk doa dulu ya! 100rb doa biar kamu sukses dunia akhirat. Uang mah bisa dicari, didoain dapet yang baik-baik itu lebih mahal harganya! ',
      },
      {
        emoji: '😭',
        title: 'YAH ZONK!',
        text: 'Zonk mulu ya daritadi? 😂 Gak apa-apa! Uang bisa dicari, yang penting adalah pahala silaturahmi. Semoga di tahun yang akan datang, rezekimu dilipatgandakan oleh Allah SWT. Aamiin Ya Rabbal Alamin! 🙌',
      },
      {
        emoji: '🤑',
        title: 'Dapat Rp 500.000!',
        text: 'SETENGAH JUTA! Tapi... THR-nya dalam bentuk doa aja dulu ya! 500rb doa supaya kamu sehat wal afiat. Sehat itu mahal loh, jadi anggap aja THR-nya jutaan! 🧠💰',
      },
      {
        emoji: '😭',
        title: 'YAH ZONK!',
        text: 'Memang rezeki mah ngga bisa dipaksa! Tapi tenang, doaku menyertai hidup kamu: Semoga apapun jalan dan cita-cita yang kamu kejar saat ini diberikan kemudahan dan hasil yang terbaik. Aamiin! 🌟',
      },
      {
        emoji: '💎',
        title: 'Dapat Rp 1.000.000!',
        text: 'SATU JUTA RUPIAH! Wah... sayang banget tapi THR-nya dalam bentuk doa aja dulu ya! Sejuta doa buat kamu biar kebaikan dan rezekimu mengalir terus dari pintu rahmat Allah. Aamiin! 😇',
      },
      {
        emoji: '😭',
        title: 'YAH ZONK!',
        text: 'Dapet Rp 0 alias ZONK nih! 😂 Nggak dapet cuan nggak apa-apa, tapi doaku ini tulus: Semoga hari-harimu ke depan selalu dipenuhi dengan tawa, berkah, bahagia, dan kehangatan keluarga. Selamat Idul Fitri! 💖',
      },
    ],

    init() {
      this.canvas = document.getElementById('thr-canvas');
      this.wheel = document.getElementById('thr-wheel');
      this.spinBtn = document.getElementById('thr-spin-btn');
      this.retryBtn = document.getElementById('thr-retry-btn');
      this.resultPanel = document.getElementById('thr-result');
      this.resultEmoji = document.getElementById('thr-result-emoji');
      this.resultTitle = document.getElementById('thr-result-title');
      this.resultText = document.getElementById('thr-result-text');

      if (!this.canvas || !this.spinBtn) return;

      this.ctx = this.canvas.getContext('2d');
      this.drawWheel();

      // Event listeners
      this.spinBtn.addEventListener('click', () => this.spin());
      this.retryBtn.addEventListener('click', () => this.retry());
    },

    /** Draw the roulette wheel on canvas */
    drawWheel() {
      const ctx = this.ctx;
      const size = this.canvas.width;
      const center = size / 2;
      const radius = size / 2;
      const segCount = this.segments.length;
      const arcSize = (2 * Math.PI) / segCount;

      ctx.clearRect(0, 0, size, size);

      this.segments.forEach((seg, i) => {
        const startAngle = i * arcSize;
        const endAngle = startAngle + arcSize;

        // Draw segment
        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.arc(center, center, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = seg.color;
        ctx.fill();

        // Draw border between segments
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw text
        ctx.save();
        ctx.translate(center, center);
        ctx.rotate(startAngle + arcSize / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px Inter, sans-serif';
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 3;
        ctx.fillText(seg.label, radius - 15, 5);
        ctx.restore();
      });

      // Inner shadow ring
      const grad = ctx.createRadialGradient(center, center, radius * 0.85, center, center, radius);
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0.15)');
      ctx.beginPath();
      ctx.arc(center, center, radius, 0, 2 * Math.PI);
      ctx.fillStyle = grad;
      ctx.fill();
    },

    /** Spin the wheel */
    spin() {
      if (this.isSpinning) return;
      this.isSpinning = true;
      this.spinBtn.disabled = true;
      this.resultPanel.hidden = true;

      const segCount = this.segments.length;
      const segAngle = 360 / segCount;

      // Spin 5-10 full rotations plus a random offset
      const extraRotations = (Math.floor(Math.random() * 5) + 5) * 360;
      const randomOffset = Math.random() * 360;
      const totalSpin = extraRotations + randomOffset;

      const startAngle = this.currentAngle;
      const endAngle = startAngle + totalSpin;
      const duration = 4000 + Math.random() * 2000; // 4-6 seconds
      const startTime = performance.now();

      const animate = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic for smooth deceleration
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = startAngle + totalSpin * eased;

        this.currentAngle = current;
        this.wheel.style.transform = `rotate(${current}deg)`;

        if (progress < 1) {
          this.spinAnimationId = requestAnimationFrame(animate);
        } else {
          // Spin completed!
          this.currentAngle = endAngle;
          this.isSpinning = false;
          this.spinBtn.disabled = false;

          // Calculate which segment is under the pointer (top = 270° in canvas coords)
          const normalizedAngle = ((endAngle % 360) + 360) % 360;
          const pointerAngle = ((270 - normalizedAngle) % 360 + 360) % 360;
          const landedSegment = Math.floor(pointerAngle / segAngle) % segCount;

          this.showResult(landedSegment);
        }
      };

      requestAnimationFrame(animate);
    },

    /** Show the result card */
    showResult(segmentIndex) {
      const result = this.results[segmentIndex];
      this.resultEmoji.textContent = result.emoji;
      this.resultTitle.textContent = result.title;
      this.resultText.textContent = result.text;
      this.resultPanel.hidden = false;

      // Re-trigger animation by removing and re-adding the element
      this.resultPanel.style.animation = 'none';
      void this.resultPanel.offsetWidth; // force reflow
      this.resultPanel.style.animation = '';
    },

    /** Retry / spin again */
    retry() {
      this.resultPanel.hidden = true;
    },
  };

  /* ============================================
     9.7. COUNTDOWN TIMER (to next Ramadan)
     ============================================ */
  const CountdownTimer = {
    // Ramadan 1448 H ~ February 18, 2027
    targetDate: new Date('2027-02-18T00:00:00'),
    daysEl: null,
    hoursEl: null,
    minutesEl: null,
    secondsEl: null,
    intervalId: null,

    init() {
      this.daysEl = document.getElementById('cd-days');
      this.hoursEl = document.getElementById('cd-hours');
      this.minutesEl = document.getElementById('cd-minutes');
      this.secondsEl = document.getElementById('cd-seconds');

      if (!this.daysEl) return;

      this.update();
      this.intervalId = setInterval(() => this.update(), 1000);
    },

    update() {
      const now = new Date();
      const diff = this.targetDate - now;

      if (diff <= 0) {
        this.daysEl.textContent = '0';
        this.hoursEl.textContent = '00';
        this.minutesEl.textContent = '00';
        this.secondsEl.textContent = '00';
        clearInterval(this.intervalId);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      this.daysEl.textContent = days;
      this.hoursEl.textContent = String(hours).padStart(2, '0');
      this.minutesEl.textContent = String(minutes).padStart(2, '0');
      this.secondsEl.textContent = String(seconds).padStart(2, '0');
    },
  };

  /* ============================================
     9.8. BACK TO TOP BUTTON
     ============================================ */
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

  /* ============================================
     9.9. TEKA TEKI DANA KAGET
     ============================================ */
  const TekaTekiDana = {
    btn: null,
    modal: null,
    input: null,
    errorObj: null,
    submitBtn: null,
    cancelBtn: null,
    riddleText: null,
    questionView: null,
    successView: null,
    realLink: null,
    closeSuccessBtn: null,
    targetUrl: '',

    riddles: [
      {
        question: 'Tahap 1 :\nBerapakah hasil dari 2 dikali 5?',
        answers: ['10', 'sepuluh']
      },
      {
        question: 'Tahap 2 :\nBerapakah hasil dahi hitungan berikut ini:\n(40²) - (300 ÷ 2) - 3 = ?\n\n(Petunjuk misal mau cepet: jawabanya adalah angka yang lumayan sering di sebut di bulan ramadhan ini )',
        answers: ['1447', 'seribu empat ratus empat puluh tujuh']
      }
    ],
    currentStep: 0,

    init() {
      this.btn = document.querySelector('.dana-kaget-btn');
      this.modal = document.getElementById('teka-teki-modal');
      this.input = document.getElementById('teka-teki-input');
      this.errorObj = document.getElementById('teka-teki-error');
      this.submitBtn = document.getElementById('teka-teki-submit');
      this.cancelBtn = document.getElementById('teka-teki-cancel');
      this.riddleText = document.querySelector('.teka-teki-modal__riddle');
      this.questionView = document.getElementById('teka-teki-question-view');
      this.successView = document.getElementById('teka-teki-success-view');
      this.realLink = document.getElementById('teka-teki-real-link');
      this.closeSuccessBtn = document.getElementById('teka-teki-close-success');

      if (!this.btn || !this.modal) return;

      this.targetUrl = this.btn.href;

      // Override the link behavior
      this.btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openModal();
      });

      this.submitBtn.addEventListener('click', () => this.checkAnswer());
      this.cancelBtn.addEventListener('click', () => this.closeModal());
      if (this.closeSuccessBtn) {
        this.closeSuccessBtn.addEventListener('click', () => this.closeModal());
      }
      
      this.input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.checkAnswer();
        }
      });
      
      this.input.addEventListener('input', () => {
        this.errorObj.hidden = true;
        this.errorObj.style.color = ''; // Reset color
      });
    },

    openModal() {
      this.currentStep = 0;
      this.riddleText.textContent = this.riddles[this.currentStep].question;
      
      this.input.value = '';
      this.errorObj.hidden = true;
      
      if (this.questionView && this.successView) {
        this.questionView.hidden = false;
        this.successView.hidden = true;
      }

      this.modal.hidden = false;
      this.modal.setAttribute('aria-hidden', 'false');
      
      setTimeout(() => this.input.focus(), 100);
    },

    closeModal() {
      this.modal.hidden = true;
      this.modal.setAttribute('aria-hidden', 'true');
    },

    checkAnswer() {
      const userAnswer = this.input.value.trim().toLowerCase();
      
      if (!userAnswer) {
        this.showError('Isi dulu dong jawaban angka kamu! 😋');
        return;
      }

      // Khusus angka / teks yang match
      const isCorrect = this.riddles[this.currentStep].answers.some(ans => userAnswer.includes(ans));

      if (isCorrect) {
        if (this.currentStep < this.riddles.length - 1) {
          // Pindah ke soal berikutnya
          this.currentStep++;
          this.riddleText.textContent = this.riddles[this.currentStep].question;
          this.input.value = '';
          this.input.focus();
          
          // Pesan sukses kecil
          this.errorObj.style.color = '#5cb585';
          this.errorObj.textContent = 'Benar! Sekarang lanjut soal terakhir...';
          this.errorObj.hidden = false;
          
          this.errorObj.style.animation = 'none';
          void this.errorObj.offsetWidth;
          this.errorObj.style.animation = 'shakeError 0.4s ease-in-out';
          
          setTimeout(() => {
            if (this.errorObj.style.color === 'rgb(92, 181, 133)') { // #5cb585
              this.errorObj.hidden = true;
            }
          }, 2500);
          
        } else {
          // Lolos semua soal
          if (this.questionView && this.successView && this.realLink) {
            this.questionView.hidden = true;
            this.successView.hidden = false;
            this.realLink.href = this.targetUrl;
          } else {
            // Fallback
            this.closeModal();
            setTimeout(() => {
              window.open(this.targetUrl, '_blank', 'noopener,noreferrer');
            }, 300);
          }
          
          if (typeof Confetti !== 'undefined') Confetti.start();
        }
      } else {
        // Jawaban Salah
        this.showError('Tetot! Hitungannya salah tuh, coba lagi! 🤪');
        this.input.value = '';
        this.input.focus();
        
        this.errorObj.style.animation = 'none';
        void this.errorObj.offsetWidth;
        this.errorObj.style.animation = 'shakeError 0.4s ease-in-out';
      }
    },
    
    showError(msg) {
      this.errorObj.style.color = '#ff6b6b';
      this.errorObj.textContent = msg;
      this.errorObj.hidden = false;
    }
  };

  /* ============================================
     10. INITIALIZATION
     ============================================ */
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
})();
