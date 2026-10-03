// 분기형 이야기
(function adventure() {
  const stageEl = document.getElementById('adventure-stage');
  const envelopeEl = document.getElementById('adventure-envelope');
  const textEl = document.getElementById('adventure-text');
  const choicesEl = document.getElementById('adventure-choices');
  if (!stageEl || !envelopeEl || !textEl || !choicesEl) return;

  let state = {};
  let openTimer = 0;

  function koreanTime(date = new Date()) {
    const h = date.getHours();
    const m = date.getMinutes();
    const period = h < 6 ? '새벽' : h < 12 ? '오전' : h < 18 ? '오후' : h < 21 ? '저녁' : '밤';
    return `${period} ${h % 12 || 12}시${m ? ` ${m}분` : ''}`;
  }

  function withCopula(time) {
    return time.endsWith('시') ? time : `${time}이`;
  }

  function timeRemark(h) {
    if (h >= 22 || h < 5) return '이 시간까지 깨어 계신 걸 보니, 오늘 하루가 쉽게 끝나지 않았나 봐요.';
    if (h < 12) return '아직 이른 시간인데 벌써 와 계시네요. 하루를 일찍 시작하셨거나, 어젯밤이 아직 끝나지 않았거나.';
    if (h < 18) return '한낮에 잠깐 몰래 들어오셨나 봐요. 걱정 마세요, 아무한테도 말 안 할게요.';
    return '퇴근길이거나, 막 집에 도착했거나, 그 사이 어디쯤이겠네요.';
  }

  const pickName = {
    clock: '낡은 시계',
    key: '작은 열쇠',
    umbrella: '우산',
  };

  const officeLine = {
    home: '맞아요. 그 ‘곧’ 속엔 집이 들어 있어요. 현관 불빛, 따뜻한 밥 냄새, 아무 말 안 해도 되는 저녁이요.',
    work: '맞아요. 그 ‘곧’ 속엔 할 일이 들어 있어요. 그런데 솔직히 말하면 할 일 때문만은 아니에요. 돌아갈 곳이 조금 멀게 느껴지는 날도 있거든요.',
  };

  const photoLine = {
    loved: '그럴 줄 알았어요. 그런데 사실 이 사진엔 아무도 없어요. 저물어가는 골목에 불 켜진 창문 하나뿐이에요.<br>그런데도 누군가를 떠올렸다면, 지금 그 사람이 그립다는 뜻일 거예요.',
    past: '예전의 나라니, 쉽게 나오는 대답이 아닌데요. 사실 이 사진엔 아무도 없어요. 저물어가는 골목에 불 켜진 창문 하나뿐이에요.<br>그런데도 지난날의 나를 떠올렸다면, 그때의 당신이 아직 저 불빛 어딘가에 남아 있다는 뜻일지도 몰라요.',
  };

  const coverLine = {
    loved: '이상하죠. 겉봉 글씨가 어쩐지, 아까 당신이 떠올린 그 사람의 글씨 같다는 생각이 들어요.',
    past: '이상하죠. 겉봉 글씨가 어쩐지, 어린 시절 당신의 글씨 같다는 생각이 들어요.',
  };

  const letterLines = {
    loved: [
      ['오늘 늦게 이곳에 올 당신에게.'],
      ['밥은 먹었어? 늦게까지 일하느라 또 건너뛰진 않았는지, 그게 제일 걱정이야.'],
      ['별일 없이 지낸다면 그걸로 충분해. 잘 지내냐는 말은 못 하겠고, 그냥 하루가 너무 길지만 않았으면 좋겠어.'],
      ['그리고 가끔은 나도 생각해줘. 많이도 말고, 오늘 같은 밤에 한 번만.'],
      ['— 당신이 떠올린 그 사람이', 'sign'],
    ],
    past: [
      ['오늘 늦게 이곳에 올 당신에게.'],
      ['어릴 적에 밤새도록 상상하던 거 기억나? 우리는 어른이 되면 뭐든 해낼 줄 알았잖아.'],
      ['막상 되어보니 매일 버티는 게 전부라는 게 좀 웃기지. 그래도 난 네가 부끄럽지 않아.'],
      ['오늘 하루를 버텨낸 너에게, 그때의 내가 크게 박수 치고 있어. 들리지?'],
      ['— 예전의 당신이', 'sign'],
    ],
  };

  const pickLine = {
    clock: '그리고 세 가지 중에 낡은 시계를 고르셨죠. 시간이 늘 모자란 사람이 고르는 물건이에요. 오늘도 당신의 시간은 누군가를 위해 쓰였겠죠.',
    key: '그리고 작은 열쇠를 고르셨죠. 어딘가로 돌아가고 싶은 사람이 고르는 물건이에요. 그곳이 어디든, 문은 아직 닫히지 않았어요.',
    umbrella: '그리고 우산을 고르셨죠. 누군가를 비 맞지 않게 해주던 사람이 고르는 물건이에요. 오늘만큼은 그 우산을 당신 자신에게 씌워주세요.',
  };

  const story = {
    timeRead: {
      envelope: 'sealed',
      text: () => {
        const now = new Date();
        return `지금은 ${withCopula(koreanTime(now))}네요.<br>${timeRemark(now.getHours())}<br>그래서 말인데요, 오늘 이 시간에 이곳에 올 사람에게 쓴 편지를 미리 봉인해뒀어요.`;
      },
      choices: [
        { label: '무슨 편지인데요?', next: 'pick' },
      ],
    },
    pick: {
      envelope: 'sealed',
      text: '편지를 열기 전에, 하나만 골라주세요.<br>마음 가는 대로요. 어차피 저는 이미 알고 있으니까요.',
      choices: [
        { label: '낡은 시계', next: 'reveal', set: { pick: 'clock' } },
        { label: '작은 열쇠', next: 'reveal', set: { pick: 'key' } },
        { label: '우산 하나', next: 'reveal', set: { pick: 'umbrella' } },
      ],
    },
    reveal: {
      envelope: 'open',
      lines: (s) => [
        ['이 편지를 열고 있는 당신에게.'],
        [`지금은 ${withCopula(koreanTime())}겠네요. 맞죠?`],
        [pickLine[s.pick]],
        ['어떤 하루였든, 이 편지를 끝까지 읽은 사람이라면 오늘도 충분히 잘 해낸 거예요.'],
        ['— 먼저 도착해 있던 사람이', 'sign'],
      ],
      choices: [
        { label: '편지를 접어둔다', next: 'afterLetter' },
      ],
    },
    afterLetter: {
      text: (s) => `편지는 접어두셔도 좋아요.<br>방금 고르신 ${pickName[s.pick]}, 사실 제 서랍에서 꺼내온 거예요.<br>야근하는 밤이면 그 서랍을 열어보곤 해요. 아무도 없는 사무실에서 혼자 불을 켜두면, 서랍 속 물건들이 제일 먼저 말을 걸어오거든요.`,
      choices: [
        { label: '서랍에 또 뭐가 있나요?', next: 'drawer' },
        { label: '그 사무실은 어떤 곳이에요?', next: 'office' },
      ],
    },
    office: {
      text: '층 전체에서 제 자리 불만 켜져 있는 곳이에요.<br>청소하시는 분이 지나가며 ‘아직 안 가셨어요?’ 하고 물으면, 저는 늘 ‘곧 가요’ 하고 대답해요. 곧 가지 못하는 날이 더 많은데도요.<br>그 ‘곧’이 무슨 뜻일 것 같아요?',
      choices: [
        { label: '집에 가고 싶다는 말 같아요', next: 'officeAnswer', set: { office: 'home' } },
        { label: '아직 할 일이 남았다는 말 같아요', next: 'officeAnswer', set: { office: 'work' } },
      ],
    },
    officeAnswer: {
      text: (s) => `${officeLine[s.office]}<br>그래서 저는 그런 밤마다 서랍을 열어요.`,
      choices: [
        { label: '서랍엔 뭐가 있나요?', next: 'drawer' },
      ],
    },
    drawer: {
      text: '서랍 맨 아래엔 오래된 사진이 한 장 있어요.<br>뒷면엔 날짜만 적혀 있고, 오래 들여다보면 어쩐지 마음이 가라앉는 사진이에요.<br>이 사진 속에 누가 있을 것 같으세요?',
      choices: [
        { label: '소중한 사람이요', next: 'photoReveal', set: { photo: 'loved' } },
        { label: '예전의 나요', next: 'photoReveal', set: { photo: 'past' } },
      ],
    },
    photoReveal: {
      text: (s) => `${photoLine[s.photo]}<br>사람은 비어 있는 곳에서도 기어코 사랑하는 걸 찾아내더라고요.`,
      choices: [
        { label: '…그러네요', next: 'compartment' },
      ],
    },
    compartment: {
      text: (s) => `그러고 보니 서랍 맨 아래에 칸이 하나 더 있어요. 자물쇠가 달려 있는데, 숫자 대신 시각으로 열리는 거예요.<br>아까 이곳에 도착하신 ${s.arrival}, 그 시각으로 맞춰볼게요.`,
      choices: [
        { label: '맞춰본다', next: 'compartmentOpen' },
      ],
    },
    compartmentOpen: {
      envelope: 'sealed',
      text: (s) => `딸깍. 자물쇠가 열렸어요.<br>칸 안에는 봉투가 하나 들어 있어요. 겉봉에는 ‘오늘 늦게 이곳에 올 당신에게’라고만 적혀 있고요.<br>${coverLine[s.photo]}`,
      choices: [
        { label: '열어본다', next: 'drawerLetter' },
        { label: '열지 않고 간직한다', next: 'keepSealed' },
      ],
    },
    drawerLetter: {
      envelope: 'open',
      lines: (s) => letterLines[s.photo],
      choices: [
        { label: '편지를 접어둔다', next: 'closing' },
      ],
    },
    keepSealed: {
      envelope: 'sealed',
      text: '열지 않는 것도 하나의 답이죠. 어떤 편지는 열지 않아야 계속 편지로 남거든요.<br>그럼 이 편지는 서랍에 다시 넣어둘게요. 열고 싶어지는 날, 그 시각에 맞춰서요.',
      choices: [
        { label: '그렇게 해주세요', next: 'closing' },
      ],
    },
    closing: {
      text: '오늘 얘기는 여기까지예요.<br>서랍은 그대로 열어둘게요. 다음에 오시면, 저에 대해서도 조금 더 얘기해드릴게요.',
      choices: [
        { label: '처음으로 돌아가기', next: 'timeRead' },
      ],
    },
  };

  const LINE_START = 1.8;
  const LINE_STEP = 1.2;

  function fillStage(id) {
    const node = story[id];
    if (id === 'timeRead') state = { arrival: koreanTime() };

    stageEl.classList.remove('skip');

    clearTimeout(openTimer);
    envelopeEl.hidden = !node.envelope;
    envelopeEl.classList.remove('is-open');
    if (node.envelope === 'open') {
      openTimer = setTimeout(() => envelopeEl.classList.add('is-open'), 700);
    }

    let choicesDelay = 0;
    if (node.lines) {
      const lines = node.lines(state);
      textEl.innerHTML = lines
        .map(([text, cls], i) => `<span class="line${cls ? ` ${cls}` : ''}" style="--d:${(LINE_START + i * LINE_STEP).toFixed(1)}s">${text}</span>`)
        .join('');
      choicesDelay = LINE_START + lines.length * LINE_STEP;
    } else {
      textEl.innerHTML = typeof node.text === 'function' ? node.text(state) : node.text;
    }
    textEl.classList.toggle('letter', Boolean(node.lines));

    choicesEl.classList.toggle('late', Boolean(node.lines));
    choicesEl.style.setProperty('--d', `${choicesDelay.toFixed(1)}s`);
    choicesEl.innerHTML = '';

    node.choices.forEach((choice) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.type = 'button';
      btn.textContent = choice.label;
      btn.addEventListener('click', () => {
        Object.assign(state, choice.set);
        renderNode(choice.next);
      });
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

  textEl.addEventListener('click', () => stageEl.classList.add('skip'));

  renderNode('timeRead', false);
})();
