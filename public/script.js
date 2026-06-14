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

  // segment definition
  class Seg {
    constructor() {
      this.reset(true);
    }
    reset(init) {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      const ang = Math.random() * Math.PI * 2;
      this.len = 40 + Math.random() * 120; // short to medium
      this.vx = Math.cos(ang) * (0.2 + Math.random() * 0.9);
      this.vy = Math.sin(ang) * (0.2 + Math.random() * 0.9);
      this.life = 4 + Math.random() * 6; // seconds
      this.age = init ? Math.random() * this.life : 0;
      this.ang = ang;
      this.width = 1 + Math.random() * 1.6;
      this.alpha = 0.2 + Math.random() * 0.9;
    }
    update(dt) {
      this.x += this.vx * dt;
      this.y += this.vy * dt;
      this.age += dt / 1000;
      // wrap around edges
      if (this.x < -this.len) this.x = w + this.len;
      if (this.x > w + this.len) this.x = -this.len;
      if (this.y < -this.len) this.y = h + this.len;
      if (this.y > h + this.len) this.y = -this.len;
      if (this.age >= this.life) this.reset(false);
    }
    draw(ctx) {
      const x2 = this.x + Math.cos(this.ang) * this.len;
      const y2 = this.y + Math.sin(this.ang) * this.len;
      ctx.strokeStyle = `rgba(124,255,178,${this.alpha})`;
      ctx.lineWidth = this.width;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  }

  const MAX = 12; // don't clutter
  const segs = [];
  for (let i = 0; i < MAX; i++) segs.push(new Seg());

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
