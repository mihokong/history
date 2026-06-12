// Mochi's World History - App Script

document.addEventListener('DOMContentLoaded', () => {
    // App State
    const state = {
        progress: 0,
        completedActivities: new Set(),
        currentQuizIndex: 0,
        quizScore: 0,
        theme: 'light',
        
        // Progress weight config
        weights: {
            card1: 5, card2: 5, card3: 5, card4: 5, // Total 20% for flipping cards
            matchingGame: 15,                      // 15%
            sortingGame: 20,                       // 20%
            oxGame: 15,                            // 15%
            readCh2: 5,
            readCh3: 5,                            // Total 10% for viewing tabs
            finalQuiz: 20                          // 20% for final quiz
        }
    };

    // DOM Elements
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    const parrotFlight = document.getElementById('parrot-flight');
    const progressFill = document.getElementById('progress-bar-fill');
    const progressPercent = document.getElementById('progress-percentage');
    const speechBubble = document.querySelector('.speech-bubble');
    const startAdventureBtn = document.getElementById('start-adventure-btn');
    const tabs = document.querySelectorAll('.nav-tab');
    const panels = document.querySelectorAll('.chapter-panel');
    const flightAvatar = document.querySelector('.flight-avatar');

    // -----------------------------------------
    // 1. Theme Toggle (Day & Night)
    // -----------------------------------------
    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('light-mode')) {
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            themeToggle.style.color = '#ccff33';
            themeToggle.style.borderColor = '#00b4d8';
            state.theme = 'dark';
            updateParrotSpeech("하암~ 밤이 되었네! 졸려도 세계사 모험은 멈추지 않아! 😴🌟");
        } else {
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            themeToggle.style.color = '#ff9100';
            themeToggle.style.borderColor = '#ffb703';
            state.theme = 'light';
            updateParrotSpeech("햇살이 쨍쨍! 활기차게 역사 공부를 시작해볼까? 🦜☀️");
        }
    });

    // Helper to update speech bubble of hero section parrot
    function updateParrotSpeech(text) {
        if (speechBubble) {
            speechBubble.innerHTML = text;
        }
    }

    // Dynamic Parrot avatar reaction
    function setParrotAvatar(status) {
        const avatars = {
            teacher: 'assets/parrot_teacher.png',
            happy: 'assets/parrot_happy.png',
            cheer: 'assets/parrot_cheer.png'
        };
        
        const heroAvatar = document.querySelector('.hero-avatar');
        if (heroAvatar && avatars[status]) {
            heroAvatar.src = avatars[status];
        }
        if (flightAvatar && avatars[status]) {
            flightAvatar.src = avatars[status];
        }
    }

    // -----------------------------------------
    // 2. Progress Tracker & Flight Animation
    // -----------------------------------------
    function addProgress(activityKey) {
        if (!state.completedActivities.has(activityKey)) {
            state.completedActivities.add(activityKey);
            const addValue = state.weights[activityKey] || 0;
            state.progress = Math.min(state.progress + addValue, 100);
            updateProgressBar();
            
            if (state.progress >= 100) {
                setParrotAvatar('happy');
                updateParrotSpeech("와아아! 둥지에 다 왔어! 🌻 너 정말 엄청난 역사 천재로구나! 🥇");
                document.querySelector('.flight-bubble').textContent = "둥지 도착! 고마워! 🦜🏠";
            } else {
                setParrotAvatar('happy');
                setTimeout(() => setParrotAvatar('teacher'), 1500);
            }
        }
    }

    function updateProgressBar() {
        progressFill.style.width = `${state.progress}%`;
        progressPercent.textContent = `${state.progress}%`;
        // Move parrot across path (leave offset room for nest icon)
        const pathWidthPercent = Math.min(state.progress, 95); 
        parrotFlight.style.left = `${pathWidthPercent}%`;
        
        // Update flying parrot comment
        const flightComments = [
            "가자 가자! 출발~! 🚀",
            "오호, 조금씩 날고 있어! 🌱",
            "절반이나 왔어! 힘내자구! 🦜",
            "둥지가 코앞이야! 🌻",
            "미션 컴플리트! 둥지 도착! 🏠"
        ];
        
        let commentIdx = Math.floor(state.progress / 25);
        commentIdx = Math.min(commentIdx, flightComments.length - 1);
        document.querySelector('.flight-bubble').textContent = flightComments[commentIdx];
    }

    // Start Adventure Button
    startAdventureBtn.addEventListener('click', () => {
        // Go to chapter 1 panel
        switchPanel('chapter1');
        updateParrotSpeech("오스트랄로... 발 아파! 최초의 인류 카드를 클릭해서 뒤집어봐! 👣");
    });

    // -----------------------------------------
    // 3. Tab System (Chapter Navigation)
    // -----------------------------------------
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-target');
            switchPanel(target);
            
            // Add view-based progress triggers
            if (target === 'chapter2') {
                addProgress('readCh2');
                updateParrotSpeech("구석기와 신석기는 도구랑 먹고사는 법이 완전 딴판이야! 잘 봐봐! 🪓");
            } else if (target === 'chapter3') {
                addProgress('readCh3');
                updateParrotSpeech("청동기는 비싸서 농사를 못 지었대! 그래서 반달돌칼을 썼지! 🗡️");
            } else if (target === 'chapter-quiz') {
                updateParrotSpeech("마지막 관문 보물상자 퀴즈에 어서 와! 5문제를 다 맞춰봐! 🏆");
            }
        });
    });

    function switchPanel(targetId) {
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        
        const activeTab = document.querySelector(`.nav-tab[data-target="${targetId}"]`);
        const activePanel = document.getElementById(targetId);
        
        if (activeTab) activeTab.classList.add('active');
        if (activePanel) activePanel.classList.add('active');
        
        // Scroll to the content tab container smoothly
        document.querySelector('.chapter-nav').scrollIntoView({ behavior: 'smooth' });
    }

    // -----------------------------------------
    // 4. Chapter 1: Flip Cards Triggers
    // -----------------------------------------
    const flipCards = document.querySelectorAll('.flip-card');
    flipCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
            const cardId = card.id; // c1-card1, c1-card2...
            
            if (card.classList.contains('flipped')) {
                // If card flipped, give progress
                if (cardId === 'c1-card1') {
                    addProgress('card1');
                    updateParrotSpeech("최초의 인류! 직립보행 시작해서 발이 아파(아파렌시스)! 기억해! 🦶");
                } else if (cardId === 'c1-card2') {
                    addProgress('card2');
                    updateParrotSpeech("호모 에렉투스는 허리를 에렉! 세우고 불을 지폈대! 🔥");
                } else if (cardId === 'c1-card3') {
                    addProgress('card3');
                    updateParrotSpeech("친구가 죽으니 네안(미안)해서 매장해 줬대. 따뜻한 마음이야 😢");
                } else if (cardId === 'c1-card4') {
                    addProgress('card4');
                    updateParrotSpeech("사피엔스는 완전 똑똑해! 동굴에 멋진 그림도 그렸어! 🎨");
                }
            }
        });
    });

    // -----------------------------------------
    // 5. Game 1: Matching Card Game (Ch1)
    // -----------------------------------------
    const matchingGameContainer = document.getElementById('matching-game-container');
    const game1Feedback = document.getElementById('game1-feedback');
    const startG1Btn = document.getElementById('start-game-1-btn');
    
    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let matchCount = 0;

    const matchItems = [
        { id: 1, type: 'name', value: '오스트랄로피테쿠스' },
        { id: 1, type: 'desc', value: '두 발로 걷기 (아파!) 👣' },
        { id: 2, type: 'name', value: '호모 에렉투스' },
        { id: 2, type: 'desc', value: '불과 언어 사용 (에렉!) 🔥' },
        { id: 3, type: 'name', value: '호모 네안데르탈렌시스' },
        { id: 3, type: 'desc', value: '시신 매장 풍습 (미안!) 🪦' },
        { id: 4, type: 'name', value: '호모 사피엔스' },
        { id: 4, type: 'desc', value: '동굴 벽화 그리기 (슬기!) 🎨' }
    ];

    if (startG1Btn) {
        startG1Btn.addEventListener('click', initMatchingGame);
    }

    function initMatchingGame() {
        matchCount = 0;
        firstCard = null;
        secondCard = null;
        lockBoard = false;
        game1Feedback.classList.remove('show', 'feedback-correct', 'feedback-wrong');
        game1Feedback.innerHTML = '';
        matchingGameContainer.innerHTML = '';

        // Shuffle cards
        const shuffled = [...matchItems].sort(() => Math.random() - 0.5);

        shuffled.forEach(item => {
            const cardEl = document.createElement('div');
            cardEl.classList.add('game-card');
            cardEl.dataset.id = item.id;
            cardEl.dataset.type = item.type;
            cardEl.textContent = item.value;
            cardEl.addEventListener('click', handleCardClick);
            matchingGameContainer.appendChild(cardEl);
        });

        updateParrotSpeech("카드 짝 맞추기 시작! 이름과 알맞은 특징 카드를 번갈아 눌러봐!");
    }

    function handleCardClick(e) {
        if (lockBoard) return;
        const clickedCard = e.currentTarget;
        if (clickedCard === firstCard) return;

        clickedCard.classList.add('selected');

        if (!firstCard) {
            firstCard = clickedCard;
            return;
        }

        secondCard = clickedCard;
        checkMatch();
    }

    function checkMatch() {
        let isMatch = firstCard.dataset.id === secondCard.dataset.id && firstCard.dataset.type !== secondCard.dataset.type;

        if (isMatch) {
            disableCards();
            showGameFeedback(true, "우와! 짝을 맞췄어! 대단해! 🎉", 1);
        } else {
            unflipCards();
            showGameFeedback(false, "앗! 짝이 맞지 않아. 다시 해봐! 🦜", 1);
        }
    }

    function disableCards() {
        firstCard.classList.remove('selected');
        secondCard.classList.remove('selected');
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        
        matchCount++;
        resetBoard();

        if (matchCount === 4) {
            setTimeout(() => {
                setParrotAvatar('happy');
                game1Feedback.innerHTML = "🎯 미션 클리어! 인류의 진화를 다 매칭했어! 🌻 +15% 진행도 획득!";
                game1Feedback.className = 'game-feedback show feedback-correct';
                addProgress('matchingGame');
                updateParrotSpeech("우와 대단해! 4단계 카드를 완벽하게 맞췄어! 최고야! 👍✨");
            }, 500);
        }
    }

    function unflipCards() {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('selected');
            secondCard.classList.remove('selected');
            resetBoard();
        }, 1000);
    }

    function resetBoard() {
        [firstCard, secondCard] = [null, null];
        lockBoard = false;
    }

    // -----------------------------------------
    // 6. Game 2: Sorting Game (Ch2)
    // -----------------------------------------
    const sortingItems = [
        { name: "주먹도끼 🔨", category: "paleo", desc: "주먹도끼는 떼어낸 석기니까 구석기야!" },
        { name: "빗살무늬 토기 🌾", category: "neo", desc: "빗살무늬 토기는 신석기 시대의 곡식 저장용 그릇이야!" },
        { name: "막집 ⛺", category: "paleo", desc: "구석기인들은 사냥 따라 이동하며 막 지은 막집에 살았어!" },
        { name: "움집 🏡", category: "neo", desc: "신석기인들은 농사를 지으며 정착해 깊게 판 움집에 살았어!" },
        { name: "갈판과 갈돌 🪓", category: "neo", desc: "곡식 껍질을 벗기기 위해 돌을 갈아 쓴 도구는 신석기!" },
        { name: "찍개 🪨", category: "paleo", desc: "찍개는 뗀석기로, 동물 사냥이나 손질에 쓰인 구석기 도구야!" }
    ];

    let currentSortingIndex = 0;
    let sortingScore = 0;
    let currentShuffledSortingItems = [];

    const startG2Btn = document.getElementById('start-game-2-btn');
    const sortingCard = document.getElementById('sorting-card');
    const sortingItemText = document.getElementById('sorting-item-text');
    const btnPaleo = document.getElementById('btn-paleo');
    const btnNeo = document.getElementById('btn-neo');
    const sortingScoreVal = document.getElementById('sorting-score-val');
    const game2Feedback = document.getElementById('game2-feedback');

    if (startG2Btn) {
        startG2Btn.addEventListener('click', startSortingGame);
    }

    function startSortingGame() {
        sortingScore = 0;
        currentSortingIndex = 0;
        sortingScoreVal.textContent = "0";
        game2Feedback.classList.remove('show', 'feedback-correct', 'feedback-wrong');
        game2Feedback.innerHTML = '';
        
        currentShuffledSortingItems = [...sortingItems].sort(() => Math.random() - 0.5);
        showNextSortingItem();
        
        btnPaleo.disabled = false;
        btnNeo.disabled = false;
        startG2Btn.textContent = "다시 시작하기 🔄";
        updateParrotSpeech("구석기 vs 신석기! 도구 이름이 나타나면 아래 바구니 버튼으로 골라봐!");
    }

    function showNextSortingItem() {
        if (currentSortingIndex < currentShuffledSortingItems.length) {
            sortingItemText.textContent = currentShuffledSortingItems[currentSortingIndex].name;
            // bounce animation
            sortingCard.classList.remove('pulse');
            void sortingCard.offsetWidth; // Trigger reflow
            sortingCard.classList.add('pulse');
        } else {
            // Game End
            btnPaleo.disabled = true;
            btnNeo.disabled = true;
            setParrotAvatar('happy');
            game2Feedback.className = "game-feedback show feedback-correct";
            game2Feedback.innerHTML = `🏁 게임 끝! 맞춘 개수: ${sortingScore} / 6 <br> 대단해! 🌻 +20% 진행도 획득!`;
            addProgress('sortingGame');
            updateParrotSpeech(`구석기 신석기 완벽 마스터! 6개 중에 ${sortingScore}개나 맞췄어! 🌱`);
        }
    }

    if (btnPaleo && btnNeo) {
        btnPaleo.addEventListener('click', () => handleSortingChoice("paleo"));
        btnNeo.addEventListener('click', () => handleSortingChoice("neo"));
    }

    function handleSortingChoice(choice) {
        if (currentShuffledSortingItems.length === 0 || currentSortingIndex >= currentShuffledSortingItems.length) return;

        const currentItem = currentShuffledSortingItems[currentSortingIndex];
        const isCorrect = currentItem.category === choice;

        if (isCorrect) {
            sortingScore++;
            sortingScoreVal.textContent = sortingScore;
            showGameFeedback(true, `딩동댕! ⭕ ${currentItem.desc}`, 2);
            setParrotAvatar('happy');
        } else {
            showGameFeedback(false, `땡! ❌ ${currentItem.desc}`, 2);
            setParrotAvatar('cheer');
        }

        currentSortingIndex++;
        setTimeout(showNextSortingItem, 2500); // Give time to read feedback
    }

    // Helper to display transient game feedbacks
    function showGameFeedback(isCorrect, message, gameNumber) {
        const feedbackEl = document.getElementById(`game${gameNumber}-feedback`);
        if (!feedbackEl) return;
        
        feedbackEl.innerHTML = message;
        feedbackEl.className = `game-feedback show ${isCorrect ? 'feedback-correct' : 'feedback-wrong'}`;
        
        // Auto-fade matching individual card messages except completion message
        if (gameNumber === 1 && matchCount < 4) {
            setTimeout(() => {
                feedbackEl.classList.remove('show');
            }, 1800);
        }
    }

    // -----------------------------------------
    // 7. Game 3: OX Quiz (Ch3)
    // -----------------------------------------
    const oxQuestions = [
        {
            q: "청동기 시대의 사람들은 귀하고 소중한 '청동'으로 만든 괭이와 낫으로 밭을 갈아 농사를 지었다.",
            ans: false, // X
            desc: "청동은 너무 귀하고 성질이 물러서 농기구로는 쓰지 못하고 무기나 제사 도구로만 썼어. 농사는 여전히 돌(반달 돌칼)이나 나무로 지었단다! (엄청 중요!)"
        },
        {
            q: "고인돌은 청동기 시대에 농사가 잘되어 잉여 생산물과 사유 재산이 생기면서 등장한 '지배자(군장)'의 권력을 증명하는 거대한 무덤이다.",
            ans: true, // O
            desc: "맞아! 돌이 엄청 크기 때문에 수많은 사람을 동원할 수 있는 힘센 지배자가 있었다는 아주 든든한 증거지!"
        },
        {
            q: "티그리스강과 유프라테스강 사이에서 쐐기 문자를 쓰며 수메르인들에 의해 꽃을 피운 고대 문명은 '메소포타미아 문명'이다.",
            ans: true, // O
            desc: "티그리스와 유프라테스강! 그리고 쐐기 문자와 지구라트(신전)는 모두 메소포타미아 문명의 트레이드 마크야!"
        },
        {
            q: "이집트 문명, 메소포타미아 문명, 인더스 문명, 황하 문명 등 고대 문명 발생지들의 핵심 공통점은 '모두 철기 무기를 사용했다'는 점이다.",
            ans: false, // X
            desc: "땡! 4대 문명은 모두 '청동기'를 기반으로 시작했어. 나중에 철기가 보급되었단다. 큰 강 유역, 청동기, 문자, 계급 발생이 진짜 공통점이지!"
        }
    ];

    let currentOxIndex = 0;
    let oxScore = 0;
    const startG3Btn = document.getElementById('start-game-3-btn');
    const oxQuestionBox = document.getElementById('ox-question');
    const btnOxO = document.getElementById('btn-ox-o');
    const btnOxX = document.getElementById('btn-ox-x');
    const oxScoreVal = document.getElementById('ox-score-val');
    const game3Feedback = document.getElementById('game3-feedback');

    if (startG3Btn) {
        startG3Btn.addEventListener('click', startOxGame);
    }

    function startOxGame() {
        oxScore = 0;
        currentOxIndex = 0;
        oxScoreVal.textContent = "0";
        game3Feedback.classList.remove('show', 'feedback-correct', 'feedback-wrong');
        game3Feedback.innerHTML = '';
        
        btnOxO.disabled = false;
        btnOxX.disabled = false;
        startG3Btn.textContent = "다시 시작하기 🔄";
        
        showNextOxQuestion();
        updateParrotSpeech("문명 OX 낚시 퀴즈 시작! 문제를 꼼꼼하게 끝까지 읽어봐! 🎣");
    }

    function showNextOxQuestion() {
        if (currentOxIndex < oxQuestions.length) {
            oxQuestionBox.textContent = oxQuestions[currentOxIndex].q;
        } else {
            // End
            btnOxO.disabled = true;
            btnOxX.disabled = true;
            setParrotAvatar('happy');
            game3Feedback.className = "game-feedback show feedback-correct";
            game3Feedback.innerHTML = `🏁 OX 퀴즈 완료! 맞춘 개수: ${oxScore} / 4 <br> 최고야! 🌻 +15% 진행도 획득!`;
            addProgress('oxGame');
            updateParrotSpeech(`와! 멋져! 4대 문명의 상식을 정복했구나! 🎉`);
        }
    }

    if (btnOxO && btnOxX) {
        btnOxO.addEventListener('click', () => handleOxChoice(true));
        btnOxX.addEventListener('click', () => handleOxChoice(false));
    }

    function handleOxChoice(userAns) {
        if (currentOxIndex >= oxQuestions.length) return;

        const currentItem = oxQuestions[currentOxIndex];
        const isCorrect = currentItem.ans === userAns;

        if (isCorrect) {
            oxScore++;
            oxScoreVal.textContent = oxScore;
            showGameFeedback(true, `딩동댕! ⭕ <br> ${currentItem.desc}`, 3);
            setParrotAvatar('happy');
        } else {
            showGameFeedback(false, `땡! ❌ <br> ${currentItem.desc}`, 3);
            setParrotAvatar('cheer');
        }

        currentOxIndex++;
        setTimeout(showNextOxQuestion, 3500); // Long timeout to read explanation
    }

    // -----------------------------------------
    // 8. Final Quiz Stage: 5 Multiple Choice Questions
    // -----------------------------------------
    const finalQuizQuestions = [
        {
            q: "지구에 가장 먼저 태어난 인류 조상으로, 두 발로 걷는 직립 보행을 시작하여 손으로 간단한 도구를 다루기 시작한 인류는 누구일까요?",
            options: [
                "호모 에렉투스 (곧선 사람)",
                "오스트랄로피테쿠스 아파렌시스 (남쪽의 원숭이)",
                "호모 사피엔스 (지혜로운 사람)"
            ],
            correctIndex: 1,
            hint: "모찌 꿀팁: 두 발로 걸어 다녀서 다리가 '아파! 아파렌시스'라고 외웠지! 👣"
        },
        {
            q: "추위와 맹수로부터 스스로를 지키기 위해 최초로 '불'을 소중히 다루고, 동료들과 '언어'로 소통하기 시작한 인류는 누구일까요?",
            options: [
                "호모 에렉투스 (곧선 사람)",
                "호모 네안데르탈렌시스",
                "오스트랄로피테쿠스 아파렌시스"
            ],
            correctIndex: 0,
            hint: "모찌 꿀팁: 불이 솟구치는 걸 보고 '에렉(에렉투스)!!' 놀랐어! 🔥"
        },
        {
            q: "구석기 시대와 신석기 시대의 설명으로 틀린 것은 무엇일까요?",
            options: [
                "구석기 시대에는 돌을 떼어 만든 주먹도끼 같은 뗀석기를 썼다.",
                "신석기 시대에는 농사와 목축을 시작하여 정착하고 움집을 지었다.",
                "구석기 시대 사람들은 빗살무늬 토기를 만들어 곡식을 보관했다."
            ],
            correctIndex: 2,
            hint: "모찌 꿀팁: 토기를 만들어 음식을 가열하고 저장한 것은 농사를 짓기 시작한 '신석기' 시대야! 🌾"
        },
        {
            q: "청동기 시대의 지배자가 썼던 비싼 무기나 제사도구(동검, 청동거울)가 아닌, '농사를 지을 때 수확을 위해 사용한 반달 모양의 돌 도구'는 무엇일까요?",
            options: [
                "반달 돌칼",
                "빗살무늬 토기",
                "고인돌"
            ],
            correctIndex: 0,
            hint: "모찌 꿀팁: 청동은 귀해서 농기구로 못 쓰고 돌(반달 돌칼)을 여전히 사용했어! 🗡️"
        },
        {
            q: "황하, 인더스, 이집트, 메소포타미아 등 인류 최초의 문명 발생지가 가진 공통점이 아닌 것은 무엇일까요?",
            options: [
                "모두 비옥한 큰 강 유역에서 탄생했다.",
                "청동기 무기와 도구, 그리고 고유 문자를 발명해 기록했다.",
                "신분이나 계급이 없는 완벽히 평등한 평화 사회였다."
            ],
            correctIndex: 2,
            hint: "모찌 꿀팁: 농사 생산량이 늘어 뺏고 뺏기는 싸움이 일어나면서 지배자와 피지배자가 나뉘는 '계급 사회'가 형성되었어! 👑"
        }
    ];

    const startFinalQuizBtn = document.getElementById('start-final-quiz-btn');
    const quizIntroView = document.getElementById('quiz-intro-view');
    const quizPlayView = document.getElementById('quiz-play-view');
    const quizResultView = document.getElementById('quiz-result-view');
    const currentQNum = document.getElementById('current-q-num');
    const finalScoreVal = document.getElementById('final-score-val');
    const quizQuestionText = document.getElementById('quiz-question-text');
    const quizOptionsContainer = document.getElementById('quiz-options-container');
    const finalTotalScore = document.getElementById('final-total-score');
    const resultMessage = document.getElementById('result-message');
    const btnPrintCert = document.getElementById('btn-print-cert');
    const btnRestartAdventure = document.getElementById('btn-restart-adventure');

    if (startFinalQuizBtn) {
        startFinalQuizBtn.addEventListener('click', startFinalQuiz);
    }

    function startFinalQuiz() {
        state.currentQuizIndex = 0;
        state.quizScore = 0;
        
        quizIntroView.classList.add('hidden');
        quizPlayView.classList.remove('hidden');
        quizResultView.classList.add('hidden');
        
        showFinalQuizQuestion();
        updateParrotSpeech("보물상자 퀴즈가 드디어 시작되었어! 5문제를 향해 출동! 🚀💎");
    }

    function showFinalQuizQuestion() {
        if (state.currentQuizIndex < finalQuizQuestions.length) {
            const qData = finalQuizQuestions[state.currentQuizIndex];
            currentQNum.textContent = state.currentQuizIndex + 1;
            finalScoreVal.textContent = state.quizScore;
            
            quizQuestionText.textContent = qData.q;
            quizOptionsContainer.innerHTML = '';
            
            qData.options.forEach((opt, idx) => {
                const btn = document.createElement('button');
                btn.className = 'quiz-opt-btn';
                btn.textContent = opt;
                btn.addEventListener('click', () => selectQuizOption(idx));
                quizOptionsContainer.appendChild(btn);
            });
        } else {
            // Finish
            showQuizResults();
        }
    }

    function selectQuizOption(userIndex) {
        const qData = finalQuizQuestions[state.currentQuizIndex];
        const isCorrect = userIndex === qData.correctIndex;
        const optionButtons = quizOptionsContainer.querySelectorAll('.quiz-opt-btn');
        
        // Disable all buttons to prevent multiple clicks
        optionButtons.forEach(btn => btn.disabled = true);

        if (isCorrect) {
            state.quizScore++;
            optionButtons[userIndex].classList.add('correct');
            updateParrotSpeech("정답이야! 짝짝짝! 넌 진짜 천재인가 봐! 🦜🎉");
            setParrotAvatar('happy');
        } else {
            optionButtons[userIndex].classList.add('wrong');
            optionButtons[qData.correctIndex].classList.add('correct'); // Show correct answer
            updateParrotSpeech(`앗! 틀렸지만 속상해 마! 다음 꿀팁을 봐바: <br> ${qData.hint}`);
            setParrotAvatar('cheer');
        }

        state.currentQuizIndex++;
        // Give 3.5 seconds to see the answer and read hint if wrong
        setTimeout(showFinalQuizQuestion, isCorrect ? 1800 : 4000);
    }

    function showQuizResults() {
        quizPlayView.classList.add('hidden');
        quizResultView.classList.remove('hidden');
        
        finalTotalScore.textContent = state.quizScore;
        
        // Personalised feedback message based on score
        let messageText = "";
        if (state.quizScore === 5) {
            messageText = "💯 우와아! 5점 만점에 5점! 앵무새 모찌마저 깜짝 놀라게 만든 역사 신동 탄생! 둥지에 있는 모든 황금 해바라기씨는 네 거야! 학교 시험은 백점 따놓은 당상이구만! 🌻🏆🥇";
            setParrotAvatar('happy');
        } else if (state.quizScore >= 3) {
            messageText = "👍 훌륭해! 대부분의 문제를 다 이해했구나! 헷갈린 한두 문제만 모찌 카드로 다시 쓱 훑어보면 금방 마스터할 수 있어! 정말 잘했어! 🦜✨";
            setParrotAvatar('teacher');
        } else {
            messageText = "🦜 괜찮아, 역사 용어는 원래 낯설고 외우기 힘들어! 모찌랑 같이 인류 진화 카드 뒤집기 놀이랑 분류 게임을 한 번만 더 복습해 보면 점수가 쑥쑥 오를 거야! 화이팅! 🚀";
            setParrotAvatar('cheer');
        }
        
        resultMessage.innerHTML = messageText;
        
        // Update certificate date
        const today = new Date();
        const dateString = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
        document.getElementById('cert-date').textContent = dateString;

        // Finish Progress
        addProgress('finalQuiz');
    }

    // Print/Save Certificate Button
    if (btnPrintCert) {
        btnPrintCert.addEventListener('click', () => {
            window.print();
        });
    }

    // Restart adventure
    if (btnRestartAdventure) {
        btnRestartAdventure.addEventListener('click', () => {
            // Reset everything
            state.progress = 0;
            state.completedActivities.clear();
            updateProgressBar();
            
            // Go to home view
            switchPanel('chapter1');
            quizResultView.classList.add('hidden');
            quizIntroView.classList.remove('hidden');
            
            updateParrotSpeech("처음부터 다시 학습을 시작해보자구! 화이팅! 🦜🔥");
            setParrotAvatar('teacher');
        });
    }

    // Initialize progress bar at load
    updateProgressBar();
});
