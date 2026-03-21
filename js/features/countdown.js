'use strict';

/* === COUNTDOWN TIMER (to next Ramadan) === */

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

  