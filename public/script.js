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
      this.len = 10 + Math.random() * 45;
      this.ang = Math.random() * Math.PI * 2;
      this.width = 0.18 + Math.random() * 0.35;
      this.alpha = 0.1 + Math.random() * 0.45;
      this.turn = (Math.random() - 0.5) * 0.00035;
      this.speed = 0.007 + Math.random() * 0.03;
      this.age = 0;
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      if (!init && Math.random() < 0.28) {
        const edge = Math.floor(Math.random() * 4);
        const margin = 8 + Math.random() * 50;
        if (edge === 0) { this.x = Math.random() * w; this.y = -margin; }
        else if (edge === 1) { this.x = w + margin; this.y = Math.random() * h; }
        else if (edge === 2) { this.x = Math.random() * w; this.y = h + margin; }
        else { this.x = -margin; this.y = Math.random() * h; }
        // pick an angle so it crosses the screen instead of straight inward
        this.ang = Math.random() * Math.PI * 2;
      }
    }
    update(dt) {
      this.ang += this.turn * dt;
      const vx = Math.cos(this.ang) * this.speed;
      const vy = Math.sin(this.ang) * this.speed;
      this.x += vx * dt;
      this.y += vy * dt;
      if (this.x < -this.len) this.x = w + this.len;
      if (this.x > w + this.len) this.x = -this.len;
      if (this.y < -this.len) this.y = h + this.len;
      if (this.y > h + this.len) this.y = -this.len;
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
      const r = 0.35 + Math.random() * 0.35;
      ctx.fillStyle = `rgba(255,255,255,${Math.min(0.75, this.alpha + 0.12)})`;
      ctx.beginPath(); ctx.arc(this.x, this.y, r, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(x2, y2, r, 0, Math.PI * 2); ctx.fill();
    }
  }

  // small floating dots
  class Dot {
    constructor() { this.reset(true); }
    reset(init) {
      const fromEdge = Math.random() < 0.35 && !init;
      this.r = 0.2 + Math.random() * 0.7;
      this.alpha = 0.06 + Math.random() * 0.3;
      const ang = Math.random() * Math.PI * 2;
      const speed = 0.008 + Math.random() * 0.025;
      if (fromEdge) {
        const edge = Math.floor(Math.random() * 4);
        const margin = 6 + Math.random() * 30;
        if (edge === 0) { this.x = Math.random() * w; this.y = -margin; }
        else if (edge === 1) { this.x = w + margin; this.y = Math.random() * h; }
        else if (edge === 2) { this.x = Math.random() * w; this.y = h + margin; }
        else { this.x = -margin; this.y = Math.random() * h; }
        this.vx = Math.cos(ang) * speed;
        this.vy = Math.sin(ang) * speed;
      } else {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = Math.cos(ang) * speed;
        this.vy = Math.sin(ang) * speed;
      }
    }
    update(dt) {
      this.x += this.vx * dt;
      this.y += this.vy * dt;
      if (this.x < -10) this.x = w + 10;
      if (this.x > w + 10) this.x = -10;
      if (this.y < -10) this.y = h + 10;
      if (this.y > h + 10) this.y = -10;
    }
    draw(ctx) {
      ctx.fillStyle = `rgba(255,255,255,${this.alpha})`;
      ctx.beginPath(); ctx.arc(this.x, this.y, this.r * DPR, 0, Math.PI * 2); ctx.fill();
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
