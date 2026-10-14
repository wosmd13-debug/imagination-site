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
    { id: 'window', x: 12, y: 10, w: 110, h: 54, label: '창문', mark: [66, 6] },
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
  let glow = 0;
  let glowTarget = 0;
  let count = {};
  let S = {};

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
          if (noise(wx * 3 + wy * 7 + slot * 13) < 0.3 + glow * 0.3) rect(wx, wy, 1, 2, '#f0c869');
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

    const flicker = 0.075 + glow * 0.07 + Math.sin(t / 7) * 0.008;
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
      if (h.id === 'drawer' ? (S.drawerDone || drawerTarget === 1) : count[h.id] > 0) return;
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
    glow += (glowTarget - glow) * 0.02;
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

  const arrival = koreanTime();
  const narrate = (text) => say('', text);
  const host = (text) => say(HOST, text);

  const topics = [
    {
      id: 'hard',
      label: '야근, 힘들지 않아요?',
      async run() {
        await host('힘들죠. 근데 일이 제일 힘든 건 아니에요.');
        await host('제일 힘든 건, 퇴근하고 문을 열었을 때 아무도 “오늘 어땠어?”라고 물어봐 주지 않는 거예요.');
        const pick = await choose(['저도 그래요.', '제가 물어볼게요. 오늘 어땠어요?']);
        if (pick === 0) {
          await host('그렇죠... 우리 다들 괜찮은 척하는 데 너무 익숙해졌어요.');
        } else {
          S.asked = true;
          await narrate('그 사람은 잠시 키보드에서 손을 뗀다.');
          await host('...누가 먼저 물어봐 준 게 얼마 만인지 모르겠네요.');
          await host('솔직히 오늘은 좀 외로웠어요. 그런데 지금은 아니에요.');
        }
      },
    },
    {
      id: 'late',
      label: '보통 몇 시까지 계세요?',
      async run() {
        await host('막차가 끊기고 나서, 택시를 탈지 말지 고민하는 시간까지요.');
        await host('그 고민이 제 하루의 마지막 일과예요. 웃기죠?');
      },
    },
    {
      id: 'why',
      label: '이 일은 왜 시작했어요?',
      async run() {
        await host('누군가에게 도움이 되고 싶었어요. 어릴 땐 그게 엄청 거창한 일인 줄 알았는데요.');
        await host('요즘은 야근하는 사람한테 커피 한 잔 건네주는 것도 도움이라고 생각해요.');
        await host('당신은요? 처음에 이 일, 왜 시작하셨어요?');
        const pick = await choose(['먹고살려고요.', '하고 싶은 게 있었어요.', '이젠 기억이 안 나요.']);
        const replies = [
          '그것도 충분한 이유예요. 누군가의 밥상이 당신 어깨 위에 올라가 있는 거잖아요.',
          '그 마음, 아직 어딘가에 남아 있을 거예요. 서랍 속 물건들처럼요.',
          '괜찮아요. 기억이 안 날 만큼 오래 버텼다는 뜻이니까요.',
        ];
        await host(replies[pick]);
      },
    },
    {
      id: 'drawerq',
      label: '저 서랍엔 뭐가 있어요?',
      async run() {
        S.hinted = true;
        await host('제 보물창고예요. 근데 아무한테나 열리지 않아요. 시각을 맞춰야 열리거든요.');
        await host('벽시계를 한번 봐줄래요? 저는 그 시계가 맞는 건지 늘 헷갈려서요.');
      },
    },
  ];

  async function firstTalk() {
    await host('오늘 하루는 어땠어요?');
    const mood = await choose(['저도 야근중이에요.', '오늘은 썩 괜찮은 하루였어요.']);
    S.mood = mood;
    if (mood === 0) {
      await host('역시, 우리 둘 다 오늘 고생이 많네요.');
      await host('벌어먹고 살기 참 힘들죠? 저도 매주 야근을 하면서 종종 드는 생각이에요. 거기 회사는 괜찮아요?');
      const work = await choose(['네 나름 만족하며 다니고 있어요', '그냥 돈 벌려고 다니는거죠']);
      S.work = work;
      await host(work === 0
        ? '나름 만족하며 다니신다니 다행이에요. 그 “나름” 안에 참은 것들이 얼마나 많은지는, 저도 알아요.'
        : '돈 벌려고 다니는 거죠, 맞아요. 그 말이 얼마나 쓸쓸하고, 또 얼마나 책임감 있는 말인지 알아요.');
    } else {
      await host('다행이에요. 그 얘기를 들으니 저도 덩달아 기분이 좋아지네요.');
      await host('이런 날은 드물잖아요. 오늘 같은 날은 잘 기억해뒀다가, 힘든 날 꺼내 써요.');
    }
    await host('말 걸어줘서 고마워요.');
  }

  async function talkMenu() {
    S.topics = S.topics || new Set();
    for (;;) {
      const remaining = topics.filter((tp) => !S.topics.has(tp.id));
      if (remaining.length === 0) {
        await host('이제 제 얘기는 다 한 것 같아요. 서랍은 열어봤어요?');
        return;
      }
      await host('더 물어보고 싶은 거 있어요?');
      const pick = await choose([...remaining.map((tp) => tp.label), '이만 얘기할게요.']);
      if (pick === remaining.length) {
        await host('네, 편하게 둘러봐요. 저는 여기 있을게요.');
        return;
      }
      S.topics.add(remaining[pick].id);
      await remaining[pick].run();
    }
  }

  async function notebookStory() {
    await narrate('서랍 속에는 낡은 수첩이 있다. 표지에는 손글씨로 ‘오늘 고마웠던 것’이라고 적혀 있다.');
    await narrate('‘3월 2일 — 엘리베이터 문을 잡아준 사람.’\n‘3월 9일 — 괜찮냐고 물어봐 준 후배. 안 괜찮았는데, 괜찮다고 했다.’\n‘3월 15일 — 엄마가 보낸 사과 사진. 말은 없고 사과만 있었다.’');
    attention = true;
    await host('야근하는 밤마다 한 줄씩 적어요. 하루가 아무리 엉망이어도, 신기하게 한 줄은 꼭 나오더라고요.');
    await host('당신이 오늘 한 줄을 적는다면, 뭐라고 쓰시겠어요?');
    const pick = await choose(['누군가 건넨 다정한 한마디', '아무 일도 없었다는 것', '…잘 모르겠어요']);
    const replies = [
      '다정한 한마디는 생각보다 오래 남아요. 그 말을 한 사람은 자기가 뭘 줬는지도 모를 거예요.',
      '아무 일도 없었다는 건 사실 엄청난 일이에요. 오늘도 무너지지 않았다는 뜻이니까요.',
      '괜찮아요. 모르겠는 날엔 오늘 밥 먹은 걸 적으면 돼요. 누군가 차려줬거나, 당신이 당신을 챙긴 거니까요.',
    ];
    await host(replies[pick]);
  }

  async function photoStory() {
    await narrate('서랍 맨 아래에는 오래된 사진이 한 장 있다. 뒷면엔 날짜만 적혀 있다.');
    attention = true;
    await host('이 사진 속에 누가 있을 것 같으세요?');
    const pick = await choose(['소중한 사람이요', '예전의 나요']);
    await host(pick === 0
      ? '그럴 줄 알았어요. 그런데 사실 이 사진엔 아무도 없어요. 저물어가는 골목에 불 켜진 창문 하나뿐이에요.'
      : '예전의 나라니, 쉽게 나오는 대답이 아닌데요. 사실 이 사진엔 아무도 없어요. 저물어가는 골목에 불 켜진 창문 하나뿐이에요.');
    await host(pick === 0
      ? '그런데도 누군가를 떠올렸다면, 지금 그 사람이 그립다는 뜻일 거예요.'
      : '그런데도 지난날의 나를 떠올렸다면, 그때의 당신이 아직 저 불빛 어딘가에 남아 있다는 뜻일지도 몰라요.');
    await host('사람은 비어 있는 곳에서도 기어코 사랑하는 걸 찾아내더라고요.');
  }

  const recipients = [
    {
      pages: [
        '부모님께.\n“잘 지내고 있어요.” 이 말을 몇 해째 하고 있는지 모르겠어요.',
        '사실은 밥을 자주 거르고, 퇴근길에 한참을 앉아 있다 갈 때도 있어요. 그래도 전화를 받으면 늘 괜찮다고 했죠.',
        '그게 걱정시키기 싫어서였다는 걸, 이제는 알 것 같아요. 그 마음을 제게서 가장 먼저 배웠다는 것도요.',
        '고맙다는 말은 아직 입에서 잘 안 떨어지네요. 대신 이것부터 물을게요.\n밥은, 드셨어요?',
      ],
      ask: '그리고 이건 부탁인데요. 오늘 밤, 부모님께 딱 한 줄만 보내봐요. “밥은 드셨어요?” 같은 거면 돼요.',
      wait: '부모님도 어쩌면, 먼저 연락 오길 기다리고 계실지 몰라요.',
    },
    {
      pages: [
        '오랜만이야.\n연락 못 한 게 벌써 몇 해인지, 세는 게 무서워서 그냥 안 세기로 했어.',
        '바쁘다는 핑계였는데, 사실은 먼저 연락하는 법을 잊어버렸어. 네가 먼저 해주길 바라면서도, 나도 너한테 그만큼 못 했잖아.',
        '그래도 가끔 네 생각이 나. 이유도 없이, 비 오는 날이나 그 노래가 흘러나올 때.',
        '다음에 만나면 근황 말고, 그때 우리가 얼마나 웃었는지부터 얘기하자.',
      ],
      ask: '그리고 이건 부탁인데요. 오늘 밤, 그 친구에게 딱 한 줄만 보내봐요. “잘 지내?” 같은 거면 돼요. 답이 늦어도 괜찮아요.',
      wait: '그 친구도 어쩌면, 같은 마음으로 휴대폰을 만지작거리고 있을지 몰라요.',
    },
    {
      pages: [
        '오늘도 늦었어.\n미안하다는 말이 습관이 된 것 같아서, 오늘은 고맙다는 말로 바꿔볼게.',
        '기다려줘서 고마워. 힘들다는 말 대신 “피곤해”라고만 해도, 넌 한 번도 더 캐묻지 않고 불을 켜둬 줬잖아.',
        '말 안 해도 알아주는 척해줘서 고마워. 사실 정말 다 알고 있었다는 것도, 나는 알고 있어.',
        '그 불빛 덕분에 오늘도 집으로 가는 길을 잃지 않았어.',
      ],
      ask: '그리고 이건 부탁인데요. 오늘 밤, 그 사람에게 딱 한 줄만 보내봐요. “오늘도 고마워” 같은 거면 돼요.',
      wait: '그 사람도 어쩌면, 그 말을 오래 기다리고 있었을지 몰라요.',
    },
    {
      pages: [
        '오늘의 나에게.\n수고했어. 이 말을 남한테서만 들으려고 했던 것 같아서, 내가 먼저 해줄게.',
        '잘하고 있는지는 아직 잘 모르겠어. 그런데 적어도 포기하지는 않았잖아. 그건 생각보다 대단한 일이야.',
        '내일도 힘들 수 있어. 그래도 오늘 밤만큼은, 나는 네 편이야.',
      ],
      ask: '그리고 이건 부탁인데요. 오늘 밤, 자기 전에 딱 한 마디만 소리 내서 해줘요. “오늘도 수고했어.” 같은 거면 돼요.',
      wait: '당신도 어쩌면, 그 말을 아주 오래 기다리고 있었을지 몰라요.',
    },
  ];

  async function envelopeStory() {
    envTarget = 1;
    await sleep(900);
    await narrate('봉투가 하나 떠오른다. 받는 사람 칸이 비어 있다.');
    attention = true;
    await host('그 편지예요. 모니터에 쓰다 만 거요. 받는 사람을 아직 못 정했어요.');
    await host('당신이라면, 누구에게 보내고 싶어요?');
    const pick = await choose(['부모님께', '오래 연락 못 한 친구에게', '사랑하는 사람에게', '오늘의 나에게']);
    const r = recipients[pick];
    await narrate('받는 사람 칸에 당신의 대답이 천천히 번진다.');
    envOpenTarget = 1;
    await sleep(700);
    for (const page of r.pages) await say('편지', page);
    await say('편지', '— 쓰다 만 편지 중에서');

    await narrate('편지를 접자, 스탠드 불빛이 조금 따뜻해진 것 같다.');
    glowTarget = 1;
    await narrate('창밖의 불빛이 하나둘 늘어난다. 같은 시간에 깨어 있는 누군가들의 창문이다.');
    attention = true;
    await host('이 편지, 이제야 보낼 수 있겠어요. 받는 사람이 정해졌으니까요.');
    if (S.asked) await host('아까 제게 오늘 어땠냐고 물어봐 준 거, 기억나요? 그게 이 편지의 첫 줄이 됐어요.');
    await host(r.ask);
    await host(r.wait);
    await host('들어줘서 고마워요. 이 시간에 와준 것도요.');
    S.drawerDone = true;
    await narrate('(프로토타입은 여기까지예요.)');
    await choose(['처음부터 다시']);
    resetStory();
  }

  function resetStory() {
    S = {};
    count = {};
    drawerTarget = 0;
    envTarget = 0;
    envOpenTarget = 0;
    glowTarget = 0;
  }

  const scripts = {
    async clock() {
      const n = count.clock;
      if (n === 1) {
        await narrate(`벽시계는 ${withObject(koreanTime())} 가리키고 있다.`);
        attention = true;
        await host('그 시계, 사실 오래전에 멈춘 건데... 이상하게 당신이 오면 움직이더라고요.');
      } else if (n === 2) {
        attention = true;
        await host('저는 가끔 일부러 시계를 안 봐요. 보는 순간 집에 갈 시간이 한참 지났다는 게 진짜가 돼버리거든요.');
      } else {
        await narrate('초침이 조용히 움직인다.');
        attention = true;
        await host('시간은 참 이상해요. 바쁠 땐 안 가고, 소중한 건 꼭 빨리 가요.');
      }
    },
    async monitor() {
      if (count.monitor === 1) {
        await narrate('화면에는 쓰다 만 편지가 떠 있다. ‘오늘 늦게 이곳에 올 당신에게’ 뒤로 커서만 깜빡인다.');
        attention = true;
        await host('아, 그거... 보셨어요? 몇 주째 그 한 줄에서 못 나가고 있어요.');
        await host('누구한테 쓰는 편지인지는 정했는데, 뭐라고 시작해야 할지 모르겠어서요.');
      } else {
        attention = true;
        await host('다 쓰면 보내려고요. 근데 보내는 것보다 다 쓰는 게 더 무섭네요.');
      }
    },
    async window() {
      if (count.window === 1) {
        await narrate('창밖으로 도시의 불빛이 보인다. 이 시간에도 불 켜진 창이 꽤 많다.');
        attention = true;
        await host('야근하다 고개를 들면 저렇게 불 켜진 창이 몇 개씩 있어요. 누군지는 모르는데, 같은 시간에 깨어 있다는 것만으로 이상하게 위로가 돼요.');
        await narrate('어쩌면 저 창들 중 하나에서도 누군가 같은 생각을 하고 있을지 모른다.');
      } else {
        attention = true;
        await host('저 불빛들 중에 당신이 사는 동네도 있을까요?');
      }
    },
    async host() {
      attention = true;
      if (!S.talked) {
        S.talked = true;
        await firstTalk();
      }
      await talkMenu();
    },
    async drawer() {
      if (S.drawerDone) {
        await narrate('서랍은 비어 있다. 책상 위엔 접어둔 편지만 놓여 있다.');
        return;
      }
      if (!count.clock) {
        await narrate('맨 아래 서랍은 잠겨 있다. 열쇠 구멍 대신, 시각을 맞추는 작은 다이얼이 달려 있다.');
        if (S.hinted) {
          attention = true;
          await host('시각은 벽시계를 보면 알 수 있어요. 한번 봐줄래요?');
        } else {
          await narrate('어딘가에서 시각을 알아내야 할 것 같다.');
        }
        return;
      }
      await narrate(`이곳에 도착한 시각, ${arrival}. 다이얼을 그 시각에 맞춘다.`);
      drawerTarget = 1;
      await sleep(900);
      await narrate('딸깍. 서랍이 열렸다.');

      const items = [
        { id: 'notebook', label: '낡은 수첩', run: notebookStory },
        { id: 'photo', label: '오래된 사진', run: photoStory },
        { id: 'envelope', label: '봉투', run: envelopeStory },
      ];
      const seen = new Set();
      for (;;) {
        const left = items.filter((it) => !seen.has(it.id));
        let item = left[0];
        if (left.length > 1) {
          await narrate(seen.size === 0 ? '서랍 안에는 물건이 몇 가지 들어 있다. 무엇부터 볼까?' : '또 무엇을 살펴볼까?');
          item = left[await choose(left.map((it) => it.label))];
        }
        seen.add(item.id);
        await item.run();
        if (item.id === 'envelope') return;
      }
    },
  };

  async function run(id) {
    if (locked) return;
    locked = true;
    hovered = null;
    count[id] = (count[id] || 0) + 1;
    await scripts[id]();
    attention = false;
    locked = false;
    setIdle();
  }

  async function intro() {
    locked = true;
    setIdle();
    await sleep(1400);
    await narrate('불이 하나만 켜진 야근 사무실. 키보드 소리가 조용히 들린다.');
    attention = true;
    await host(`아, 오셨네요. 지금은 ${withCopula(arrival)}네요. 이 시간에 올 줄 알았어요.`);
    await host('이 층엔 저 말고 아무도 없어요. 그래서 누가 오면 괜히 반가워요.');
    await host('편하게 둘러보세요. 반짝이는 곳을 눌러보면 돼요.');
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
