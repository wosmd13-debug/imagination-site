// 분기형 이야기
(function adventure() {
  const stageEl = document.getElementById('adventure-stage');
  const textEl = document.getElementById('adventure-text');
  const choicesEl = document.getElementById('adventure-choices');
  const sceneUseEl = document.getElementById('scene-use');
  if (!stageEl || !textEl || !choicesEl || !sceneUseEl) return;

  const story = {
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

    sceneUseEl.setAttribute('href', `#scene-${id}`);
    sceneUseEl.setAttribute('xlink:href', `#scene-${id}`);

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

  renderNode('start', false);
})();
