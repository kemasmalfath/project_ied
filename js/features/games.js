'use strict';

/* === MAAFIN SAYA (Interactive Forgiveness) === */

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

  
/* === THR ROULETTE (Spin Wheel Game) === */

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

  
/* === TEKA TEKI DANA KAGET === */

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
        question: 'Berapakah hasil dari 2 dikali 5?',
        answers: ['10', 'sepuluh']
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

  