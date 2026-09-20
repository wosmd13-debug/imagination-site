// 분기형 이야기
(function adventure() {
  const stageEl = document.getElementById('adventure-stage');
  const textEl = document.getElementById('adventure-text');
  const choicesEl = document.getElementById('adventure-choices');
  if (!stageEl || !textEl || !choicesEl) return;

  const story = {
    intro: {
      text: '오늘 하루 고생 많으셨네요.<br>오늘은 좀 어떠셨나요?<br>저는 야근중에 있어서 살짝 지친 상태네요.',
      choices: [
        { label: '저도 야근중이에요.', next: 'introOvertime' },
        { label: '오늘은 썩 괜찮은 하루였어요.', next: 'introGood' },
      ],
    },
    introOvertime: {
      text: '역시, 우리 둘 다 오늘 고생이 많네요.<br>벌어먹고 살기 참 힘들죠? 저도 매주 야근을 하면서 종종 드는 생각이에요.<br>거기 회사는 괜찮아요?',
      choices: [
        { label: '네 나름 만족하며 다니고 있어요', next: 'closing' },
        { label: '그냥 돈 벌려고 다니는거죠', next: 'closing' },
      ],
    },
    introGood: {
      text: '그 얘기를 들으니 저도 덩달아 기분이 좋아지네요.<br>오늘처럼 괜찮은 날엔, 오래된 좋은 기억 하나 꺼내보는 것도 잘 어울릴 것 같아요.',
      choices: [
        { label: '네, 한번 볼게요', next: 'closing' },
      ],
    },
    closing: {
      text: '오늘 얘기는 여기까지예요.<br>다음에 또 들러주세요.',
      choices: [
        { label: '처음으로 돌아가기', next: 'intro' },
      ],
    },
  };

  function fillStage(id) {
    const node = story[id];

    textEl.innerHTML = node.text;
    choicesEl.innerHTML = '';

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
