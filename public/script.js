(() => {
  const canvas = document.getElementById('bg');
  const ctx = canvas.getContext('2d');

  let w = 0, h = 0, DPR = Math.max(1, window.devicePixelRatio || 1);
  function resize() {
    w = Math.max(window.innerWidth, 300);
    h = Math.max(window.innerHeight, 300);
    canvas.width = Math.floor(w * DPR);
    canvas.height = Math.floor(h * DPR);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  window.addEventListener('resize', resize, { passive: true });
  resize();


  // segment definition (thin white lines with endpoints)
  class Seg {
    constructor() { this.reset(true); }
    reset(init) {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.ang = Math.random() * Math.PI * 2;
      this.len = 30 + Math.random() * 90; // short to medium
      // velocity in pixels per millisecond (slow)
      const speed = 0.02 + Math.random() * 0.06;
      this.vx = Math.cos(this.ang) * speed * (Math.random() > 0.5 ? 1 : -1);
      this.vy = Math.sin(this.ang) * speed * (Math.random() > 0.5 ? 1 : -1);
      this.life = 6 + Math.random() * 8; // seconds
      this.age = init ? Math.random() * this.life : 0;
      this.width = 0.6 + Math.random() * 0.9; // thinner
      this.alpha = 0.25 + Math.random() * 0.65;
    }
    update(dt) {
      // dt in ms
      this.x += this.vx * dt;
      this.y += this.vy * dt;
      this.age += dt / 1000;
      // wrap
      if (this.x < -this.len) this.x = w + this.len;
      if (this.x > w + this.len) this.x = -this.len;
      if (this.y < -this.len) this.y = h + this.len;
      if (this.y > h + this.len) this.y = -this.len;
      if (this.age >= this.life) this.reset(false);
    }
    draw(ctx) {
      const x2 = this.x + Math.cos(this.ang) * this.len;
      const y2 = this.y + Math.sin(this.ang) * this.len;
      ctx.strokeStyle = `rgba(255,255,255,${this.alpha})`;
      ctx.lineWidth = this.width;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      // endpoints
      const r = Math.max(1.2, 1.5 * (DPR / 1));
      ctx.fillStyle = `rgba(255,255,255,${Math.min(0.95, this.alpha + 0.2)})`;
      ctx.beginPath(); ctx.arc(this.x, this.y, r, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(x2, y2, r, 0, Math.PI * 2); ctx.fill();
    }
  }

  // small floating dots
  class Dot {
    constructor() { this.reset(true); }
    reset(init) {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      const ang = Math.random() * Math.PI * 2;
      const speed = 0.01 + Math.random() * 0.035;
      this.vx = Math.cos(ang) * speed;
      this.vy = Math.sin(ang) * speed;
      this.r = 0.6 + Math.random() * 1.6;
      this.alpha = 0.12 + Math.random() * 0.5;
      this.life = 8 + Math.random() * 8;
      this.age = init ? Math.random() * this.life : 0;
    }
    update(dt) {
      this.x += this.vx * dt;
      this.y += this.vy * dt;
      this.age += dt / 1000;
      if (this.x < -10) this.x = w + 10;
      if (this.x > w + 10) this.x = -10;
      if (this.y < -10) this.y = h + 10;
      if (this.y > h + 10) this.y = -10;
      if (this.age >= this.life) this.reset(false);
    }
    draw(ctx) {
      ctx.fillStyle = `rgba(255,255,255,${this.alpha})`;
      ctx.beginPath(); ctx.arc(this.x, this.y, this.r * (DPR/1), 0, Math.PI * 2); ctx.fill();
    }
  }

  const MAX_SEGS = 8; // limited to avoid clutter
  const MAX_DOTS = 10;
  const segs = Array.from({ length: MAX_SEGS }, () => new Seg());
  const dots = Array.from({ length: MAX_DOTS }, () => new Dot());

  let last = performance.now();
  function loop(t) {
    const dt = t - last; last = t;
    ctx.clearRect(0, 0, w, h);

    // subtle background vignette
    // draw segments
    for (let s of segs) {
      s.update(dt);
      s.draw(ctx);
    }

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  // conserve CPU if tab hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      // stop drawing by slowing down updates
    }
  });
})();
