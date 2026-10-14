(() => {
  const W = 240;
  const H = 135;
  const HOST = '야근 중인 사람';

  const canvas = document.getElementById('scene');
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  const dialogueEl = document.getElementById('dialogue');
  const speakerEl = document.getElementById('speaker');
  const lineEl = document.getElementById('dline');
  const nextEl = document.getElementById('dnext');
  const choicesEl = document.getElementById('choices');

  const C = {
    wallDark: '#110f18',
    floor: '#1d1824',
    floorLine: '#251f2e',
    frame: '#2d2838',
    farDesk: '#2b2535',
    farFront: '#201b29',
    farMon: '#0f0e15',
    desk: '#5b3e2b',
    deskTop: '#7a5539',
    deskLight: '#8a6244',
    deskFront: '#3a2a1f',
    deskDark: '#2a1d14',
    void: '#0d0b12',
    skin: '#e8b894',
    skinDark: '#c99a78',
    hair: '#2a1d1a',
    shirt: '#3f6286',
    shirtDark: '#335070',
    chair: '#2c2538',
    chairTop: '#352d44',
    lamp: '#f3c969',
    cup: '#d9d2c3',
    coffee: '#4a2f1d',
    screen: '#2f6b7a',
    screenLine: '#8fd3e3',
    cream: '#d9d2c3',
    ink: '#17141f',
  };

  const rect = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };

  const circle = (cx, cy, r, c) => {
    ctx.fillStyle = c;
    for (let dy = -r; dy <= r; dy++) {
      const dx = Math.floor(Math.sqrt(r * r - dy * dy + 0.25));
      ctx.fillRect(cx - dx, cy + dy, dx * 2 + 1, 1);
    }
  };

  const line = (x0, y0, x1, y1, c) => {
    ctx.fillStyle = c;
    x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
    const dx = Math.abs(x1 - x0);
    const dy = -Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx + dy;
    for (;;) {
      ctx.fillRect(x0, y0, 1, 1);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 >= dy) { err += dy; x0 += sx; }
      if (e2 <= dx) { err += dx; y0 += sy; }
    }
  };

  const noise = (n) => {
    const s = Math.sin(n * 127.1) * 43758.5453;
    return s - Math.floor(s);
  };

  const koreanTime = (date = new Date()) => {
    const h = date.getHours();
    const m = date.getMinutes();
    const period = h < 6 ? '새벽' : h < 12 ? '오전' : h < 18 ? '오후' : h < 21 ? '저녁' : '밤';
    return `${period} ${h % 12 || 12}시${m ? ` ${m}분` : ''}`;
  };
  const withCopula = (time) => (time.endsWith('시') ? time : `${time}이`);
  const withObject = (time) => `${time}${time.endsWith('시') ? '를' : '을'}`;

  const buildings = [];
  for (let x = 14, i = 0; x < 118; i++) {
    const w = 8 + Math.floor(noise(i + 3) * 8);
    buildings.push({ x, w: Math.min(w, 120 - x), h: 12 + Math.floor(noise(i + 11) * 24), id: i });
    x += w + 1;
  }

  const hotspots = [
    { id: 'drawer', x: 208, y: 88, w: 24, h: 28, label: '서랍', mark: [220, 86] },
    { id: 'host', x: 178, y: 62, w: 24, h: 30, label: '야근 중인 사람', mark: [190, 58] },
    { id: 'monitor', x: 154, y: 68, w: 22, h: 20, label: '모니터', mark: [165, 64] },
    { id: 'clock', x: 150, y: 14, w: 24, h: 24, label: '벽시계', mark: [162, 10] },
  ];

  let t = 0;
  let fade = 1;
  let attention = false;
  let hovered = null;
  let drawerP = 0;
  let drawerTarget = 0;
  let envP = 0;
  let envTarget = 0;
  let envOpenP = 0;
  let envOpenTarget = 0;
  const visited = new Set();

  function drawWindow() {
    rect(12, 10, 110, 54, C.frame);
    const bands = ['#0b1024', '#10173a', '#161f4a', '#1e2a5c', '#2b3768', '#3d4577'];
    bands.forEach((c, i) => rect(14, 12 + i * 8, 106, 8, c));

    for (let i = 0; i < 22; i++) {
      if (((t >> 4) + i) % 7 === 0) continue;
      rect(15 + Math.floor(noise(i) * 104), 13 + Math.floor(noise(i + 50) * 22), 1, 1, '#cfd6ff');
    }

    circle(100, 22, 4, '#f4efd8');
    circle(102, 21, 3, '#161f4a');

    buildings.forEach((b) => {
      const top = 62 - b.h;
      rect(b.x, top, b.w, b.h, '#0e0c16');
      for (let wy = top + 3; wy < 60; wy += 4) {
        for (let wx = b.x + 2; wx < b.x + b.w - 1; wx += 3) {
          const slot = Math.floor(t / 300 + noise(b.id) * 5);
          if (noise(wx * 3 + wy * 7 + slot * 13) < 0.3) rect(wx, wy, 1, 2, '#f0c869');
        }
      }
    });

    rect(48, 12, 2, 50, C.frame);
    rect(84, 12, 2, 50, C.frame);
    rect(10, 62, 114, 3, C.frame);
  }

  function drawClock() {
    const cx = 162;
    const cy = 26;
    circle(cx, cy, 10, '#4a3f35');
    circle(cx, cy, 9, C.cream);
    rect(cx - 1, cy - 8, 2, 2, C.ink);
    rect(cx - 1, cy + 6, 2, 2, C.ink);
    rect(cx - 8, cy - 1, 2, 2, C.ink);
    rect(cx + 6, cy - 1, 2, 2, C.ink);

    const now = new Date();
    const sec = now.getSeconds() + now.getMilliseconds() / 1000;
    const min = now.getMinutes() + sec / 60;
    const hr = (now.getHours() % 12) + min / 60;
    const hand = (value, max, len, color) => {
      const a = (value / max) * Math.PI * 2;
      line(cx, cy, cx + Math.sin(a) * len, cy - Math.cos(a) * len, color);
    };
    hand(hr, 12, 4, C.ink);
    hand(min, 60, 6, C.ink);
    hand(sec, 60, 7, '#c0504d');
    rect(cx, cy, 1, 1, C.ink);
  }

  function drawFarDesks() {
    [12, 56, 100].forEach((x, i) => {
      rect(x + 10, 66, 18, 11, C.farDesk);
      rect(x + 11, 67, 16, 9, C.farMon);
      rect(x + 17, 77, 4, 2, C.farDesk);
      if (((t + i * 40) % 140) < 70) rect(x + 26, 75, 1, 1, '#4de58a');
      rect(x, 78, 38, 3, C.farDesk);
      rect(x + 2, 81, 34, 7, C.farFront);
    });
  }

  function drawRoom() {
    rect(0, 0, W, 88, '#17141f');
    rect(0, 86, W, 2, '#241f2c');
    rect(0, 88, W, H - 88, C.floor);
    for (let y = 96; y < H; y += 12) rect(0, y, W, 1, C.floorLine);
    drawWindow();
    drawClock();
    drawFarDesks();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fillRect(140, 114, 92, 3);
  }

  function drawHost() {
    rect(178, 64, 24, 28, C.chair);
    rect(180, 62, 20, 4, C.chairTop);

    rect(182, 76, 16, 16, C.shirt);
    rect(180, 77, 20, 4, C.shirtDark);
    rect(181, 80, 3, 8, C.shirtDark);
    rect(196, 80, 3, 8, C.shirtDark);

    rect(188, 76, 4, 2, C.skinDark);
    rect(185, 66, 10, 10, C.skin);
    rect(184, 64, 12, 4, C.hair);
    rect(184, 66, 2, 5, C.hair);
    rect(194, 66, 2, 3, C.hair);

    const blink = t % 150 < 5;
    const ex = attention ? [187, 191] : [186, 190];
    if (blink) {
      rect(ex[0], 71, 2, 1, C.skinDark);
      rect(ex[1], 71, 2, 1, C.skinDark);
    } else {
      rect(ex[0], 70, 1, 2, C.ink);
      rect(ex[1], 70, 1, 2, C.ink);
    }
    if (attention) rect(188, 74, 4, 1, '#b5755d');
  }

  function drawDeskAndProps() {
    rect(140, 88, 66, 4, C.deskTop);
    rect(140, 88, 66, 1, C.deskLight);
    rect(142, 92, 62, 22, C.deskFront);
    rect(160, 92, 40, 22, C.void);
    rect(142, 92, 3, 22, C.deskDark);
    rect(201, 92, 3, 22, C.deskDark);

    rect(154, 68, 22, 18, '#1a1722');
    rect(156, 70, 18, 14, C.screen);
    [12, 9, 14].forEach((len, i) => rect(158, 72 + i * 3, len, 1, C.screenLine));
    const typed = (t >> 2) % 18;
    rect(158, 81, typed, 1, C.screenLine);
    if ((t >> 3) & 1) rect(158 + typed, 80, 2, 3, C.screenLine);
    rect(163, 86, 4, 2, '#2b2535');
    rect(159, 87, 12, 1, '#2b2535');

    rect(170, 90, 28, 2, '#2b2535');
    rect(171, 90, 26, 1, '#3a3347');

    const typing = !attention;
    const hy = 88 + (typing && ((t >> 3) & 1) ? 1 : 0);
    const hy2 = 88 + (typing && !((t >> 3) & 1) ? 1 : 0);
    rect(182, hy, 4, 2, C.skin);
    rect(194, hy2, 4, 2, C.skin);

    rect(200, 84, 5, 4, C.cup);
    rect(200, 84, 5, 1, C.coffee);
    rect(205, 85, 1, 2, C.cup);
    for (let i = 0; i < 3; i++) {
      const p = (t / 6 + i * 5) % 14;
      const alpha = Math.max(0, 0.55 - p / 26);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fillRect(Math.round(202 + Math.sin(t / 10 + i) * 1.5), Math.round(83 - p), 1, 1);
    }
  }

  function drawCabinet() {
    rect(208, 88, 24, 2, C.deskTop);
    rect(208, 90, 24, 26, C.deskFront);
    [92, 100].forEach((y) => {
      rect(210, y, 20, 7, '#4b3626');
      rect(210, y + 6, 20, 1, C.deskDark);
      rect(218, y + 3, 4, 1, '#c9a66b');
    });

    const off = Math.round(drawerP * 4);
    if (off > 0) rect(210, 108, 20, off, C.void);
    rect(210, 108 + off, 20, 7, drawerP > 0.05 ? '#5a422d' : '#4b3626');
    rect(210, 114 + off, 20, 1, C.deskDark);
    rect(218, 111 + off, 4, 1, '#c9a66b');
  }

  function drawEnvelope() {
    if (envP < 0.02) return;
    const x = 214;
    const y = Math.round(108 - envP * 24 + Math.sin(t / 10) * (envP > 0.9 ? 1.5 : 0));
    ctx.fillStyle = `rgba(243, 201, 105, ${0.18 * envP})`;
    for (let r = 14; r >= 6; r -= 4) {
      ctx.beginPath();
      ctx.arc(x + 6, y + 4, r, 0, Math.PI * 2);
      ctx.fill();
    }
    if (envOpenP > 0.05) rect(x + 2, y - Math.round(envOpenP * 7), 8, 7, '#f4ead9');
    rect(x, y, 12, 8, C.cream);
    rect(x, y, 12, 1, '#b7ab97');
    line(x, y, x + 6, y + 4, '#b7ab97');
    line(x + 11, y, x + 6, y + 4, '#b7ab97');
    if (envOpenP < 0.5) rect(x + 5, y + 3, 2, 2, '#9c2f2f');
  }

  function drawLampAndLight() {
    rect(224, 86, 8, 2, '#2a2430');
    rect(227, 72, 1, 14, '#2a2430');
    line(227, 72, 216, 66, '#2a2430');
    rect(210, 64, 10, 5, '#3a3347');
    rect(211, 68, 8, 1, C.lamp);

    const flicker = 0.075 + Math.sin(t / 7) * 0.008;
    ctx.fillStyle = `rgba(243, 201, 105, ${flicker})`;
    ctx.beginPath();
    ctx.moveTo(213, 69);
    ctx.lineTo(218, 69);
    ctx.lineTo(238, 96);
    ctx.lineTo(166, 96);
    ctx.closePath();
    ctx.fill();

    for (let i = 0; i < 6; i++) {
      const mx = 178 + noise(i + 1) * 48 + Math.sin(t / 40 + i) * 3;
      const my = 72 + ((t / 12 + i * 17) % 22);
      ctx.fillStyle = 'rgba(243, 201, 105, 0.55)';
      ctx.fillRect(Math.round(mx), Math.round(my), 1, 1);
    }

    ctx.fillStyle = 'rgba(111, 183, 201, 0.07)';
    ctx.beginPath();
    ctx.arc(165, 76, 26, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawMarkers() {
    hotspots.forEach((h) => {
      if (visited.has(h.id) && h.id !== 'drawer') return;
      if (h.id === 'drawer' && drawerTarget === 1) return;
      const bob = Math.round(Math.sin(t / 6 + h.x) * 1.5);
      const [mx, my] = h.mark;
      rect(mx - 3, my - 8 + bob, 7, 7, C.lamp);
      rect(mx, my - 7 + bob, 1, 3, C.ink);
      rect(mx, my - 3 + bob, 1, 1, C.ink);
      rect(mx, my - 1 + bob, 1, 1, C.lamp);
    });

    if (hovered && !locked) {
      ctx.strokeStyle = `rgba(243, 201, 105, ${0.7 + Math.sin(t / 4) * 0.25})`;
      ctx.lineWidth = 1;
      ctx.strokeRect(hovered.x + 0.5, hovered.y + 0.5, hovered.w, hovered.h);
    }
  }

  function draw() {
    drawRoom();
    drawHost();
    drawDeskAndProps();
    drawCabinet();
    drawEnvelope();
    drawLampAndLight();

    const vg = ctx.createRadialGradient(W / 2, H / 2, 40, W / 2, H / 2, 150);
    vg.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vg.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, W, H);

    drawMarkers();

    if (fade > 0.01) {
      ctx.fillStyle = `rgba(0, 0, 0, ${fade})`;
      ctx.fillRect(0, 0, W, H);
    }
  }

  function update() {
    t++;
    fade = Math.max(0, fade - 0.02);
    drawerP += (drawerTarget - drawerP) * 0.12;
    envP += (envTarget - envP) * 0.07;
    envOpenP += (envOpenTarget - envOpenP) * 0.12;
  }

  let last = 0;
  let acc = 0;
  function frame(ts) {
    acc = Math.min(acc + (ts - last), 200);
    last = ts;
    while (acc >= 33) { acc -= 33; update(); }
    draw();
    requestAnimationFrame(frame);
  }
  requestAnimationFrame((ts) => { last = ts; frame(ts); });

  let advance = null;
  let locked = false;
  const idleText = '반짝이는 곳을 눌러보세요.';

  function setIdle(label) {
    speakerEl.hidden = true;
    nextEl.style.visibility = 'hidden';
    lineEl.classList.add('idle');
    lineEl.textContent = label ? `▶ ${label}` : idleText;
  }

  function say(speaker, text) {
    return new Promise((resolve) => {
      choicesEl.innerHTML = '';
      lineEl.classList.remove('idle');
      speakerEl.hidden = !speaker;
      speakerEl.textContent = speaker;
      nextEl.style.visibility = 'hidden';
      lineEl.textContent = '';

      const chars = [...text];
      let i = 0;
      let typing = true;
      const timer = setInterval(() => {
        i++;
        lineEl.textContent = chars.slice(0, i).join('');
        if (i >= chars.length) finish();
      }, 32);

      function finish() {
        clearInterval(timer);
        typing = false;
        lineEl.textContent = text;
        nextEl.style.visibility = 'visible';
        advance = () => { advance = null; resolve(); };
      }
      advance = () => { if (typing) finish(); };
    });
  }

  function choose(options) {
    return new Promise((resolve) => {
      nextEl.style.visibility = 'hidden';
      choicesEl.innerHTML = '';
      options.forEach((label, i) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'choice';
        btn.textContent = label;
        btn.addEventListener('click', () => {
          choicesEl.innerHTML = '';
          resolve(i);
        });
        choicesEl.appendChild(btn);
      });
    });
  }

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const scripts = {
    async clock() {
      const now = koreanTime();
      await say('', `벽시계는 ${withObject(now)} 가리키고 있다.`);
      attention = true;
      await say(HOST, '그 시계, 사실 오래전에 멈춘 건데... 이상하게 당신이 오면 움직이더라고요.');
    },
    async monitor() {
      await say('', '화면에는 쓰다 만 편지가 떠 있다. ‘오늘 늦게 이곳에 올 당신에게’ 뒤로 커서만 깜빡인다.');
    },
    async host() {
      attention = true;
      await say(HOST, '오늘 하루는 어땠어요?');
      const pick = await choose(['저도 야근중이에요.', '오늘은 썩 괜찮은 하루였어요.']);
      if (pick === 0) {
        await say(HOST, '역시, 우리 둘 다 오늘 고생이 많네요. 벌어먹고 살기 참 힘들죠?');
      } else {
        await say(HOST, '다행이에요. 그 얘기를 들으니 저도 덩달아 기분이 좋아지네요.');
      }
    },
    async drawer() {
      if (drawerTarget === 1) {
        await say('', '서랍은 이미 열려 있다. 안은 비어 있다.');
        return;
      }
      await say('', '맨 아래 서랍 틈으로 희미한 빛이 새어 나온다.');
      drawerTarget = 1;
      await sleep(700);
      envTarget = 1;
      await sleep(900);
      await say('', '봉투가 하나 떠올랐다. 겉봉에는 ‘오늘 늦게 이곳에 올 당신에게’라고 적혀 있다.');
      const pick = await choose(['열어본다', '그냥 둔다']);
      if (pick === 0) {
        envOpenTarget = 1;
        await sleep(600);
        const now = koreanTime();
        await say('편지', '이 편지를 열고 있는 당신에게.');
        await say('편지', `지금은 ${withCopula(now)}겠네요. 맞죠?`);
        await say('편지', '어떤 하루였든, 이 편지를 끝까지 읽은 사람이라면 오늘도 충분히 잘 해낸 거예요.');
        await say('편지', '— 먼저 도착해 있던 사람이');
        attention = true;
        await say('', '편지를 접자, 사무실의 불빛이 조금 따뜻해진 것 같다.');
        await say('', '(프로토타입은 여기까지예요.)');
        await choose(['처음부터 다시']);
        envOpenTarget = 0;
        envTarget = 0;
        drawerTarget = 0;
        visited.clear();
      } else {
        attention = true;
        await say(HOST, '그것도 좋아요. 열고 싶어지는 날, 그때 열어봐요.');
        envTarget = 0;
        envOpenTarget = 0;
        drawerTarget = 0;
      }
    },
  };

  async function run(id) {
    if (locked) return;
    locked = true;
    hovered = null;
    visited.add(id);
    await scripts[id]();
    attention = false;
    locked = false;
    setIdle();
  }

  async function intro() {
    locked = true;
    setIdle();
    await sleep(1400);
    await say('', '불이 하나만 켜진 야근 사무실. 키보드 소리가 조용히 들린다.');
    attention = true;
    await say(HOST, `아, 오셨네요. 지금은 ${withCopula(koreanTime())}네요. 이 시간에 올 줄 알았어요.`);
    await say(HOST, '편하게 둘러보세요. 반짝이는 곳을 눌러보면 돼요.');
    attention = false;
    locked = false;
    setIdle();
  }

  const toLogical = (e) => {
    const r = canvas.getBoundingClientRect();
    return [((e.clientX - r.left) / r.width) * W, ((e.clientY - r.top) / r.height) * H];
  };

  const hitTest = (x, y) => hotspots.find((h) => x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h) || null;

  canvas.addEventListener('mousemove', (e) => {
    if (locked) return;
    const h = hitTest(...toLogical(e));
    hovered = h;
    canvas.style.cursor = h ? 'pointer' : 'default';
    setIdle(h ? h.label : '');
  });

  canvas.addEventListener('mouseleave', () => {
    hovered = null;
    if (!locked) setIdle();
  });

  canvas.addEventListener('click', (e) => {
    if (locked) return;
    const h = hitTest(...toLogical(e));
    if (h) run(h.id);
  });

  const onAdvance = () => { if (advance) advance(); };
  dialogueEl.addEventListener('click', onAdvance);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (document.activeElement && document.activeElement.classList.contains('choice')) return;
      e.preventDefault();
      onAdvance();
    }
  });

  intro();
})();
