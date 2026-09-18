// 배경 별빛 캔버스
(function bgStars() {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let stars = [];
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = document.body.scrollHeight;
    const count = Math.floor((w * h) / 9000);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.3 + 0.3,
      speed: Math.random() * 0.015 + 0.003,
      phase: Math.random() * Math.PI * 2,
    }));
  }

  function draw(t) {
    ctx.clearRect(0, 0, w, h);
    for (const s of stars) {
      const twinkle = 0.5 + 0.5 * Math.sin(t * s.speed + s.phase);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(244,241,251,${0.25 + twinkle * 0.6})`;
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(draw);
})();

// 분기형 이야기
(function adventure() {
  const stageEl = document.getElementById('adventure-stage');
  const textEl = document.getElementById('adventure-text');
  const choicesEl = document.getElementById('adventure-choices');
  if (!stageEl || !textEl || !choicesEl) return;

  const story = {
    start: {
      text: '눈을 뜨니 온통 보랏빛 안개다. 발밑에서 별가루가 반딧불처럼 흩어진다. 저 멀리 두 개의 문이 보인다.',
      choices: [
        { label: '새소리가 들리는 왼쪽 문으로 간다', next: 'forest' },
        { label: '조용히 빛나는 오른쪽 문으로 간다', next: 'lighthouse' },
      ],
    },
    forest: {
      text: '문을 열자 밤의 숲이 펼쳐진다. 나무마다 작은 등불이 걸려 있고, 그 사이로 여우 한 마리가 말을 건넨다. "더 갈래, 아니면 이 등불 하나를 가져갈래?"',
      choices: [
        { label: '더 깊이 들어간다', next: 'forestDeep' },
        { label: '등불을 받아 든다', next: 'endingLantern' },
      ],
    },
    forestDeep: {
      text: '숲 깊은 곳, 커다란 나무 문에는 이렇게 적혀 있다. "너의 가장 오래된 기억을 두고 가라."',
      choices: [
        { label: '기억을 두고 문을 연다', next: 'endingMemory' },
        { label: '기억을 지키고 돌아선다', next: 'endingKeep' },
      ],
    },
    lighthouse: {
      text: '문 너머엔 파도 없는 검은 바다 위, 홀로 빛나는 등대가 있다. 등대지기가 손짓하며 묻는다. "배를 타고 나갈래, 아니면 등대에 머물며 불을 밝힐래?"',
      choices: [
        { label: '배를 타고 나간다', next: 'lighthouseBoat' },
        { label: '등대에 머문다', next: 'endingKeeper' },
      ],
    },
    lighthouseBoat: {
      text: '파도 없는 바다는 이상하리만치 고요하다. 배는 스스로 방향을 안다는 듯 나아가고, 수평선 너머로 희미한 빛이 보이기 시작한다.',
      choices: [
        { label: '빛을 향해 계속 간다', next: 'endingHorizon' },
        { label: '노를 멈추고 고요함에 머문다', next: 'endingStill' },
      ],
    },
    endingLantern: {
      ending: '등불을 든 자',
      text: '당신은 등불을 손에 쥔 채 숲을 나선다. 그 빛은 이후로도 오랫동안 당신의 길을 밝혀줄 것이다.',
    },
    endingMemory: {
      ending: '새로운 시작',
      text: '당신은 가장 오래된 기억을 내려놓는다. 문이 열리고, 새로운 시작이 눈부시게 쏟아진다. 무언가를 잃었지만, 그만큼 가벼워졌다.',
    },
    endingKeep: {
      ending: '지켜낸 것',
      text: '당신은 기억을 지키기로 한다. 문은 다시 닫히고 안개 속. 하지만 당신은 안다 — 지켜야 할 것은 지켜야 한다는 것을.',
    },
    endingKeeper: {
      ending: '등대지기',
      text: '당신은 등대지기가 되기로 한다. 아무도 오지 않는 밤에도, 당신의 불빛은 누군가의 길이 되어줄 것이다.',
    },
    endingHorizon: {
      ending: '새로운 지평',
      text: '수평선 너머, 한 번도 상상해보지 못한 색의 하늘이 펼쳐진다. 그곳이 어디든, 이제부터가 진짜 이야기다.',
    },
    endingStill: {
      ending: '고요함 속에서',
      text: '당신은 노를 내려놓는다. 파도도 바람도 없는 고요함 속에서, 당신은 처음으로 아무것도 하지 않아도 되는 법을 배운다.',
    },
  };

  function fillStage(id) {
    const node = story[id];

    textEl.innerHTML = node.ending
      ? `<span class="ending-badge">ENDING · ${node.ending}</span><br>${node.text}`
      : node.text;
    choicesEl.innerHTML = '';

    if (node.ending) {
      const restartBtn = document.createElement('button');
      restartBtn.className = 'choice-btn restart';
      restartBtn.type = 'button';
      restartBtn.textContent = '처음부터 다시';
      restartBtn.addEventListener('click', () => renderNode('start'));
      choicesEl.appendChild(restartBtn);
      return;
    }

    node.choices.forEach((choice) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.type = 'button';
      btn.textContent = choice.label;
      btn.addEventListener('click', () => renderNode(choice.next));
      choicesEl.appendChild(btn);
    });
  }

  function renderNode(id, animate = true) {
    if (!animate) {
      fillStage(id);
      return;
    }

    stageEl.classList.add('stage-hidden');

    setTimeout(() => {
      fillStage(id);
      stageEl.style.transition = 'none';
      stageEl.classList.remove('stage-hidden');
      stageEl.style.transform = 'translateX(24px)';
      stageEl.style.opacity = '0';
      stageEl.offsetWidth;
      requestAnimationFrame(() => {
        stageEl.style.transition = '';
        stageEl.style.transform = '';
        stageEl.style.opacity = '';
      });
    }, 350);
  }

  renderNode('start', false);
})();

// 스크롤 등장 애니메이션
document.querySelectorAll('.intro').forEach((el) => {
  el.classList.add('reveal');
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
