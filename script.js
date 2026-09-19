// 분기형 이야기
(function adventure() {
  const stageEl = document.getElementById('adventure-stage');
  const artEl = document.getElementById('adventure-art');
  const textEl = document.getElementById('adventure-text');
  const choicesEl = document.getElementById('adventure-choices');
  if (!stageEl || !artEl || !textEl || !choicesEl) return;

  const scenes = {
    start: `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
      <rect width="320" height="180" fill="url(#skyDusk)"/>
      <circle class="a-pulse" cx="250" cy="70" r="46" fill="url(#sunGlow)"/>
      <circle cx="250" cy="70" r="20" fill="#ffe3a1"/>
      <path d="M0 130 Q80 100 160 125 T320 115 L320 180 L0 180 Z" fill="#2a1710" opacity="0.55"/>
      <rect x="20" y="95" width="46" height="45" fill="#3d2418"/>
      <path d="M14 95 L43 70 L72 95 Z" fill="#5a3420"/>
      <rect x="34" y="112" width="14" height="18" fill="#f0c869" opacity="0.85"/>
      <rect x="70" y="105" width="38" height="35" fill="#4a2b1c"/>
      <path d="M65 105 L89 84 L113 105 Z" fill="#6b3f26"/>
      <rect x="82" y="118" width="12" height="14" fill="#e0785a" opacity="0.8"/>
      <circle cx="140" cy="108" r="22" fill="#3c5a3a"/>
      <rect x="136" y="120" width="8" height="20" fill="#2a2016"/>
      <rect x="170" y="148" width="70" height="8" rx="2" fill="#5a3420"/>
      <rect x="176" y="140" width="4" height="10" fill="#3d2418"/>
      <rect x="228" y="140" width="4" height="10" fill="#3d2418"/>
      <circle cx="205" cy="128" r="10" fill="#4a2b1c"/>
      <rect x="196" y="136" width="18" height="16" rx="4" fill="#6b3f26"/>
      <path class="a-sway" d="M214 130 L228 122 L226 136 Z" fill="#e0785a"/>
      <circle class="a-twinkle" cx="60" cy="70" r="2" fill="#f0c869"/>
      <circle class="a-twinkle" style="animation-delay:.5s" cx="180" cy="60" r="1.8" fill="#f0c869"/>
      <circle class="a-twinkle" style="animation-delay:1s" cx="290" cy="130" r="2" fill="#f0c869"/>
      <circle class="a-twinkle" style="animation-delay:.3s" cx="100" cy="40" r="1.5" fill="#f0c869"/>
    </svg>`,
    icecream: `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
      <rect width="320" height="180" fill="url(#skyDay)"/>
      <circle cx="270" cy="40" r="24" fill="#ffe9b0" opacity="0.9"/>
      <rect x="0" y="150" width="320" height="30" fill="#c9a877" opacity="0.4"/>
      <rect x="60" y="95" width="130" height="55" rx="6" fill="#f4ead9"/>
      <rect x="60" y="95" width="130" height="16" fill="#e0785a"/>
      <rect x="190" y="110" width="40" height="40" rx="4" fill="#d98c3c"/>
      <rect x="196" y="118" width="26" height="18" rx="2" fill="#bcdcf0" opacity="0.7"/>
      <circle cx="95" cy="152" r="12" fill="#2a1710"/>
      <circle cx="95" cy="152" r="5" fill="#b7a58c"/>
      <circle cx="175" cy="152" r="12" fill="#2a1710"/>
      <circle cx="175" cy="152" r="5" fill="#b7a58c"/>
      <path d="M55 95 L235 95 L225 80 L65 80 Z" fill="#e0785a"/>
      <rect x="65" y="80" width="20" height="15" fill="#f4ead9"/>
      <rect x="105" y="80" width="20" height="15" fill="#f4ead9"/>
      <rect x="145" y="80" width="20" height="15" fill="#f4ead9"/>
      <rect x="185" y="80" width="20" height="15" fill="#f4ead9"/>
      <circle class="a-float" cx="120" cy="58" r="14" fill="#e0785a"/>
      <path class="a-float" d="M108 64 L132 64 L120 86 Z" fill="#d98c3c"/>
      <circle cx="255" cy="128" r="9" fill="#2a1710"/>
      <path d="M255 137 L255 158 M255 143 L242 150 M255 143 L266 132" stroke="#2a1710" stroke-width="4" stroke-linecap="round" fill="none"/>
    </svg>`,
    bbopgi: `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
      <rect width="320" height="180" fill="url(#skyNight)"/>
      <circle class="a-flicker" cx="160" cy="150" r="40" fill="#e0785a" opacity="0.25"/>
      <circle class="a-flicker" cx="160" cy="150" r="22" fill="#f0a63f" opacity="0.5"/>
      <ellipse cx="160" cy="100" rx="48" ry="16" fill="#2a1710" opacity="0.4"/>
      <circle cx="160" cy="95" r="46" fill="#e8b563"/>
      <path class="a-pulse" d="M160 65 L169 89 L195 89 L174 104 L182 129 L160 114 L138 129 L146 104 L125 89 L151 89 Z" fill="#2a1710" opacity="0.75"/>
      <line x1="188" y1="72" x2="176" y2="84" stroke="#f4ead9" stroke-width="3" stroke-linecap="round"/>
      <path d="M96 150 Q90 120 130 118 L130 150 Z" fill="#4a2b1c"/>
      <path d="M224 150 Q230 120 190 118 L190 150 Z" fill="#4a2b1c"/>
      <circle class="a-twinkle" cx="70" cy="60" r="2" fill="#f0c869"/>
      <circle class="a-twinkle" style="animation-delay:.4s" cx="250" cy="50" r="2" fill="#f0c869"/>
      <circle class="a-twinkle" style="animation-delay:.8s" cx="230" cy="150" r="1.6" fill="#f0c869"/>
    </svg>`,
    comicshop: `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
      <rect width="320" height="180" fill="url(#skyNight)"/>
      <rect x="20" y="30" width="120" height="120" fill="#3a2414"/>
      <rect x="26" y="40" width="14" height="34" fill="#7a8f6a"/>
      <rect x="42" y="40" width="14" height="34" fill="#c97f4a"/>
      <rect x="58" y="40" width="14" height="34" fill="#8a5a8a"/>
      <rect x="74" y="40" width="14" height="34" fill="#d9b34a"/>
      <rect x="90" y="40" width="14" height="34" fill="#5a7a8a"/>
      <rect x="26" y="82" width="14" height="34" fill="#c9694a"/>
      <rect x="42" y="82" width="14" height="34" fill="#5a8a6a"/>
      <rect x="58" y="82" width="14" height="34" fill="#8a6a3a"/>
      <rect x="74" y="82" width="14" height="34" fill="#a54a5a"/>
      <rect x="90" y="82" width="14" height="34" fill="#4a6a8a"/>
      <circle class="a-spin" cx="270" cy="45" r="18" fill="none" stroke="#e0785a" stroke-width="3"/>
      <path class="a-spin" d="M270 45 L270 30 M270 45 L283 53 M270 45 L257 53" stroke="#e0785a" stroke-width="3" stroke-linecap="round"/>
      <rect x="180" y="130" width="70" height="8" fill="#3a2414"/>
      <rect x="196" y="105" width="38" height="26" rx="3" fill="#d98c3c"/>
      <circle class="a-pulse" cx="208" cy="118" r="6" fill="#f0c869"/>
      <rect x="220" y="112" width="10" height="3" fill="#2a1710"/>
      <line x1="196" y1="105" x2="190" y2="90" stroke="#d98c3c" stroke-width="2"/>
      <path d="M150 150 L150 115 L156 115 L156 150 M150 128 L180 128" stroke="#5a3420" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M40 20 L10 150 L70 150 Z" fill="#f0c869" opacity="0.08"/>
    </svg>`,
    endingAlley: `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
      <rect width="320" height="180" fill="url(#skyDusk)"/>
      <circle class="a-pulse" cx="160" cy="120" r="70" fill="url(#sunGlow)"/>
      <path d="M90 120 A70 70 0 0 1 230 120 Z" fill="#f0a63f"/>
      <rect x="0" y="118" width="320" height="4" fill="#2a1710" opacity="0.5"/>
      <path d="M0 140 L40 105 L80 140 M60 140 L110 95 L160 140 M140 140 L190 100 L240 140 M220 140 L270 108 L320 140" fill="none" stroke="#1c110a" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      <path class="a-float" d="M40 40 L50 44 L60 40" stroke="#2a1710" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path class="a-float" style="animation-delay:.6s" d="M240 30 L250 34 L260 30" stroke="#2a1710" stroke-width="2" fill="none" stroke-linecap="round"/>
    </svg>`,
    endingHands: `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
      <rect width="320" height="180" fill="url(#skyNight)"/>
      <circle class="a-twinkle" cx="60" cy="40" r="16" fill="#e0785a" opacity="0.25"/>
      <circle class="a-twinkle" style="animation-delay:.7s" cx="260" cy="60" r="20" fill="#d98c3c" opacity="0.2"/>
      <circle class="a-twinkle" style="animation-delay:.3s" cx="220" cy="140" r="14" fill="#f0c869" opacity="0.2"/>
      <circle class="a-pulse" cx="160" cy="90" r="50" fill="url(#sunGlow)"/>
      <path class="a-pulse" d="M160 55 L171 83 L201 83 L177 100 L186 128 L160 111 L134 128 L143 100 L119 83 L149 83 Z" fill="#f0c869"/>
      <path d="M90 150 Q80 110 140 108 L150 150 Z" fill="#4a2b1c"/>
      <path d="M230 150 Q240 110 180 108 L170 150 Z" fill="#4a2b1c"/>
    </svg>`,
    endingLaugh: `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
      <rect width="320" height="180" fill="url(#skyDusk)"/>
      <path class="a-pulse" d="M160 60 L168 82 L191 82 L172 96 L179 119 L160 105 L141 119 L148 96 L129 82 L152 82 Z" fill="#f0c869"/>
      <circle class="a-float" cx="110" cy="60" r="4" fill="#e0785a"/>
      <circle class="a-float" style="animation-delay:.3s" cx="220" cy="50" r="5" fill="#d98c3c"/>
      <circle class="a-float" style="animation-delay:.6s" cx="90" cy="120" r="3.5" fill="#f0c869"/>
      <circle class="a-float" style="animation-delay:.9s" cx="240" cy="130" r="4" fill="#e0785a"/>
      <circle class="a-twinkle" cx="160" cy="30" r="2" fill="#fff"/>
      <circle class="a-twinkle" style="animation-delay:.4s" cx="60" cy="90" r="2" fill="#fff"/>
      <circle class="a-twinkle" style="animation-delay:.8s" cx="260" cy="95" r="2" fill="#fff"/>
    </svg>`,
    endingPaper: `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
      <rect width="320" height="180" fill="url(#skyNight)"/>
      <circle class="a-pulse" cx="230" cy="55" r="30" fill="url(#sunGlow)" opacity="0.7"/>
      <path d="M215 30 L245 30 L250 45 L210 45 Z" fill="#f0c869"/>
      <rect x="222" y="45" width="6" height="20" fill="#5a3420"/>
      <rect x="60" y="120" width="90" height="16" rx="2" fill="#c9694a" transform="rotate(-3 105 128)"/>
      <rect x="65" y="105" width="90" height="16" rx="2" fill="#5a8a6a" transform="rotate(2 110 113)"/>
      <rect x="70" y="90" width="90" height="16" rx="2" fill="#d9b34a" transform="rotate(-1 115 98)"/>
      <path d="M60 150 Q100 135 140 150 L140 165 Q100 150 60 165 Z" fill="#f4ead9"/>
      <line x1="70" y1="152" x2="120" y2="152" stroke="#b7a58c" stroke-width="1.5"/>
      <line x1="70" y1="158" x2="110" y2="158" stroke="#b7a58c" stroke-width="1.5"/>
      <circle class="a-rise" cx="190" cy="150" r="2" fill="#f0c869" opacity="0.6"/>
      <circle class="a-rise" style="animation-delay:.8s" cx="205" cy="140" r="1.6" fill="#f0c869" opacity="0.5"/>
    </svg>`,
    endingRadio: `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg">
      <rect width="320" height="180" fill="url(#skyNight)"/>
      <rect x="120" y="90" width="90" height="60" rx="8" fill="#d98c3c"/>
      <circle class="a-pulse" cx="145" cy="120" r="14" fill="#f0c869"/>
      <circle cx="145" cy="120" r="6" fill="#2a1710"/>
      <rect x="170" y="105" width="24" height="6" rx="3" fill="#2a1710"/>
      <rect x="170" y="118" width="24" height="6" rx="3" fill="#2a1710"/>
      <rect x="170" y="131" width="16" height="6" rx="3" fill="#2a1710"/>
      <line x1="130" y1="90" x2="120" y2="65" stroke="#d98c3c" stroke-width="3" stroke-linecap="round"/>
      <line x1="190" y1="90" x2="200" y2="65" stroke="#d98c3c" stroke-width="3" stroke-linecap="round"/>
      <path class="a-rise" d="M100 130 q4 -10 0 -18" stroke="#f0c869" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <path class="a-rise" style="animation-delay:.6s" d="M230 120 q-4 -10 0 -18" stroke="#f0c869" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      <path class="a-rise" style="animation-delay:1.1s" d="M215 145 q4 -10 0 -18" stroke="#f0c869" stroke-width="2" fill="none" stroke-linecap="round"/>
    </svg>`,
  };

  const story = {
    intro: {
      text: '오늘 하루 고생 많으셨네요.<br>오늘은 좀 어떠셨나요?<br>저는 야근중에 있어서 살짝 지친 상태네요.',
      choices: [
        { label: '저도 야근중이에요.', next: 'introOvertime' },
        { label: '오늘은 썩 괜찮은 하루였어요.', next: 'introGood' },
      ],
    },
    introOvertime: {
      text: '역시, 우리 둘 다 오늘 고생이 많네요.<br>그래도 이렇게 마주쳤으니, 잠깐이라도 여기 앉아 쉬었다 가요.',
      choices: [
        { label: '네, 잠깐 쉬었다 갈게요', next: 'start' },
      ],
    },
    introGood: {
      text: '그 얘기를 들으니 저도 덩달아 기분이 좋아지네요.<br>오늘처럼 괜찮은 날엔, 오래된 좋은 기억 하나 꺼내보는 것도 잘 어울릴 것 같아요.',
      choices: [
        { label: '네, 한번 볼게요', next: 'start' },
      ],
    },
    start: {
      text: '매미 소리가 시끄럽던 여름 오후, 눈을 감으니 그 골목이 보인다. 낡은 슬레이트 지붕 아래 평상에 앉아 부채질하시던 할머니. 저 멀리서 두 가지 소리가 들려온다.',
      choices: [
        { label: '딸랑딸랑, 아이스크림 트럭 종소리를 따라간다', next: 'icecream' },
        { label: '드르륵, 옆집 만화방 문 열리는 소리를 따라간다', next: 'comicshop' },
      ],
    },
    icecream: {
      text: '백 원짜리 동전을 꼭 쥐고 뛰어나가면, 트럭 아저씨는 늘 웃으며 하나를 더 얹어주셨다. 문방구 앞에선 친구들이 뽑기 판을 들여다보고 있다.',
      choices: [
        { label: '친구들과 함께 달고나 뽑기를 해본다', next: 'bbopgi' },
        { label: '아이스크림을 들고 혼자 골목 끝까지 걸어간다', next: 'endingAlley' },
      ],
    },
    bbopgi: {
      text: '바늘 끝이 떨리는 순간, 옆에서 숨죽이고 지켜봐 주던 친구의 눈빛. 별 모양이 부서질까 봐 손끝에 온 신경을 모았던 그 여름의 오후.',
      choices: [
        { label: '별 모양을 무사히 떼어낸다', next: 'endingHands' },
        { label: '결국 부서뜨리고 둘이 함께 웃는다', next: 'endingLaugh' },
      ],
    },
    comicshop: {
      text: '만화방 아저씨는 오늘도 낡은 선풍기를 돌리며 졸고 계셨다. 빌려온 만화책 냄새, 삐걱이는 나무 의자. 그 옆엔 오래된 라디오가 늘 켜져 있었다.',
      choices: [
        { label: '만화책 속으로 푹 빠져든다', next: 'endingPaper' },
        { label: '라디오에서 나오는 그 시절 노래를 따라 흥얼거린다', next: 'endingRadio' },
      ],
    },
    endingAlley: {
      ending: '골목의 끝',
      text: '아이스크림이 다 녹기도 전에 도착한 골목 끝, 노을이 지고 있었다. 그 자리에 서서 바라본 하늘은 지금도 눈을 감으면 그대로다.',
    },
    endingHands: {
      ending: '그때 그 손',
      text: '별 모양을 무사히 떼어낸 순간, 친구와 나눠 먹던 자부심 가득한 웃음. 성공하지 못해도 함께라서 좋았던 그 마음을, 지금은 어디에 있을 그 손을 떠올리며 다시 느껴본다.',
    },
    endingLaugh: {
      ending: '부서져도 좋았던',
      text: '별은 결국 부서졌지만, 둘이서 터뜨린 웃음소리가 골목에 오래 울렸다. 잘하지 못해도 함께라면 괜찮았던, 그런 날들이 있었다.',
    },
    endingPaper: {
      ending: '종이 냄새',
      text: '마지막 장을 덮을 때 느껴지던 아쉬움, 다음 편이 나올 때까지 손꼽아 기다리던 여름의 시간들. 지금도 오래된 책을 펼치면 그 냄새가 난다.',
    },
    endingRadio: {
      ending: '그 시절의 노래',
      text: '라디오에서 흘러나오던 노래 한 소절에, 온 가족이 저녁상 앞에서 따라 부르던 밤들. 이제는 어디서도 들을 수 없지만, 마음속에선 여전히 재생되고 있다.',
    },
  };

  function fillStage(id) {
    const node = story[id];

    artEl.innerHTML = scenes[id] || '';
    artEl.style.display = scenes[id] ? '' : 'none';

    textEl.innerHTML = node.ending
      ? `<span class="ending-badge">추억 한 조각 · ${node.ending}</span><br>${node.text}`
      : node.text;
    choicesEl.innerHTML = '';

    if (node.ending) {
      const restartBtn = document.createElement('button');
      restartBtn.className = 'choice-btn restart';
      restartBtn.type = 'button';
      restartBtn.textContent = '다시 그 골목으로';
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

  renderNode('intro', false);
})();
