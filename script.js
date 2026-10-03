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

  const moodLine = {
    overtime: '오늘도 "저도 야근중이에요"라고 말할 줄 알았어요. 같은 하루를 지나는 사람끼리는, 그런 건 대충 보이거든요.',
    good: '오늘은 "썩 괜찮은 하루였어요"라고 말할 줄 알았어요. 그 한마디가 이 편지를 쓴 보람이에요.',
  };

  const workLine = {
    satisfied: '회사는 나름 만족하며 다닌다고 하셨죠. 그 "나름" 안에 얼마나 많은 참음이 들어 있는지, 저는 알아요.',
    money: '그냥 돈 벌려고 다닌다고 하셨죠. 그 말이 얼마나 쓸쓸하고, 또 얼마나 책임감 있는 말인지 알아요.',
  };

  const pickLine = {
    clock: '그리고 세 가지 중에 낡은 시계를 고르셨죠. 시간이 늘 모자란 사람이 고르는 물건이에요. 오늘도 당신의 시간은 누군가를 위해 쓰였겠죠.',
    key: '그리고 작은 열쇠를 고르셨죠. 어딘가로 돌아가고 싶은 사람이 고르는 물건이에요. 그곳이 어디든, 문은 아직 닫히지 않았어요.',
    umbrella: '그리고 우산을 고르셨죠. 누군가를 비 맞지 않게 해주던 사람이 고르는 물건이에요. 오늘만큼은 그 우산을 당신 자신에게 씌워주세요.',
  };

  const story = {
    intro: {
      text: '오늘 하루 고생 많으셨네요.<br>오늘은 좀 어떠셨나요?<br>저는 야근중에 있어서 살짝 지친 상태네요.',
      choices: [
        { label: '저도 야근중이에요.', next: 'introOvertime', set: { mood: 'overtime' } },
        { label: '오늘은 썩 괜찮은 하루였어요.', next: 'introGood', set: { mood: 'good' } },
      ],
    },
    introOvertime: {
      text: '역시, 우리 둘 다 오늘 고생이 많네요.<br>벌어먹고 살기 참 힘들죠? 저도 매주 야근을 하면서 종종 드는 생각이에요.<br>거기 회사는 괜찮아요?',
      choices: [
        { label: '네 나름 만족하며 다니고 있어요', next: 'timeRead', set: { work: 'satisfied' } },
        { label: '그냥 돈 벌려고 다니는거죠', next: 'timeRead', set: { work: 'money' } },
      ],
    },
    introGood: {
      text: '그 얘기를 들으니 저도 덩달아 기분이 좋아지네요.<br>이런 날엔 작은 마술 하나쯤 구경해도 좋겠다는 생각이 들어요.',
      choices: [
        { label: '네, 보여주세요', next: 'timeRead' },
      ],
    },
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
        [moodLine[s.mood]],
        ...(s.work ? [[workLine[s.work]]] : []),
        [pickLine[s.pick]],
        ['어떤 하루였든, 이 편지를 끝까지 읽은 사람이라면 오늘도 충분히 잘 해낸 거예요.'],
        ['— 먼저 도착해 있던 사람이', 'sign'],
      ],
      choices: [
        { label: '편지를 접어둔다', next: 'closing' },
      ],
    },
    closing: {
      text: '오늘 얘기는 여기까지예요.<br>다음에 또 들러주세요.',
      choices: [
        { label: '처음으로 돌아가기', next: 'intro' },
      ],
    },
  };

  const LINE_START = 1.8;
  const LINE_STEP = 1.2;

  function fillStage(id) {
    const node = story[id];
    if (id === 'intro') state = {};

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
      textEl.innerHTML = typeof node.text === 'function' ? node.text() : node.text;
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

  renderNode('intro', false);
})();
