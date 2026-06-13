// Mochi's World History - App Script

document.addEventListener('DOMContentLoaded', () => {
    // App State
    const state = {
        activeUnit: 'unit1', // 'unit1' or 'unit2'
        unit1Progress: 0,
        unit2Progress: 0,
        completedActivities: new Set(),
        
        // Unit 1 Quiz State
        u1CurrentQuizIndex: 0,
        u1QuizScore: 0,
        
        // Unit 2 Quiz State
        u2CurrentQuizIndex: 0,
        u2QuizScore: 0,
        
        theme: 'light',
        
        // Progress weight config
        weights: {
            // Unit 1
            'u1-card1': 5, 'u1-card2': 5, 'u1-card3': 5, 'u1-card4': 5, // Total 20%
            'u1-matchingGame': 15,
            'u1-readCh2': 5,
            'u1-sortingGame': 20,
            'u1-readCh3': 5,
            'u1-oxGame': 15,
            'u1-finalQuiz': 20,
            
            // Unit 2
            'u2-card1': 5, 'u2-card2': 5, 'u2-card3': 5, 'u2-card4': 5, // Total 20%
            'u2-pathGame': 15,
            'u2-readCh2': 5,
            'u2-sortingGame': 20,
            'u2-readCh3': 5,
            'u2-oxGame': 15,
            'u2-finalQuiz': 20
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
    const flightAvatar = document.querySelector('.flight-avatar');
    const nestEmoji = document.getElementById('nest-emoji');
    const progressUnitLabel = document.getElementById('progress-unit-label');
    const heroWelcomeText = document.getElementById('hero-welcome-text');

    // Unit Selector Elements
    const unitButtons = document.querySelectorAll('.unit-btn');
    const unitContainers = {
        unit1: document.getElementById('unit1-container'),
        unit2: document.getElementById('unit2-container')
    };

    // -----------------------------------------
    // 1. Grand Unit Switching Logic
    // -----------------------------------------
    unitButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedUnit = btn.getAttribute('data-unit');
            switchUnit(selectedUnit);
        });
    });

    function switchUnit(unitId) {
        state.activeUnit = unitId;
        
        // Update Unit buttons active status
        unitButtons.forEach(btn => {
            if (btn.getAttribute('data-unit') === unitId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Toggle Unit Views
        Object.keys(unitContainers).forEach(key => {
            if (key === unitId) {
                unitContainers[key].classList.add('active');
            } else {
                unitContainers[key].classList.remove('active');
            }
        });

        // Update Progress bar and comments
        if (unitId === 'unit1') {
            nestEmoji.textContent = '🪹';
            progressUnitLabel.textContent = "단원 1 모험 진행률";
            heroWelcomeText.innerHTML = `
                역사 시험 범위만 보면 머리가 지끈지끈하지? 🤯<br>
                걱정 마! 나 모찌가 인류가 처음 태어난 <strong>선사 시대</strong>부터 <strong>문명이 싹튼 때</strong>까지 아주 쉽고 재밌게 안내해 줄게!<br>
                카드 공부를 끝내고 신나는 미니 게임을 클리어하면 둥지에 맛있는 해바라기씨가 쌓인다구! 함께 가볼까? 🌻✨
            `;
            updateParrotSpeech("오스트랄로... 발 아파! 최초의 인류 선사 시대로 모험을 떠나자! 🌿");
        } else {
            nestEmoji.textContent = '🏛️';
            progressUnitLabel.textContent = "단원 2 모험 진행률";
            heroWelcomeText.innerHTML = `
                두 번째 모험에 온 걸 환영해! 🏺<br>
                여기는 다리우스 1세의 강력한 <strong>페르시아 제국</strong>, 철학의 고향 <strong>그리스</strong>와 <strong>헬레니즘</strong>, 그리고 <strong>로마 제국</strong>이 속한 대단원이야!<br>
                모찌와 함께 카드를 정복하고 로마 콜로세움 둥지 열쇠를 획득해 봐! 🛡️🗝️
            `;
            updateParrotSpeech("대제국 다리우스 1세의 길을 뚫고, 로마의 크리스트교 국교화 비밀을 밝혀내 보자! 🛡️");
        }

        updateProgressBar();
    }

    // Start Adventure Button based on Active Unit
    startAdventureBtn.addEventListener('click', () => {
        if (state.activeUnit === 'unit1') {
            switchPanel('unit1', 'u1-chapter1');
            updateParrotSpeech("최초의 인류 카드를 클릭해서 뒤집어봐! 발 아파렌시스! 👣");
        } else {
            switchPanel('unit2', 'u2-chapter1');
            updateParrotSpeech("페르시아 제국! 다리우스 1세의 카드를 뒤집어서 핵심 정책을 알아봐! 👑");
        }
    });

    // -----------------------------------------
    // 2. Day/Night Theme Toggle
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

    function updateParrotSpeech(text) {
        if (speechBubble) {
            speechBubble.innerHTML = text;
        }
    }

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
    // 3. Progress Calculation & Flying Animation
    // -----------------------------------------
    function addProgress(activityKey) {
        if (!state.completedActivities.has(activityKey)) {
            state.completedActivities.add(activityKey);
            const addValue = state.weights[activityKey] || 0;
            
            if (activityKey.startsWith('u1-')) {
                state.unit1Progress = Math.min(state.unit1Progress + addValue, 100);
            } else if (activityKey.startsWith('u2-')) {
                state.unit2Progress = Math.min(state.unit2Progress + addValue, 100);
            }
            
            updateProgressBar();
            
            const curProgress = state.activeUnit === 'unit1' ? state.unit1Progress : state.unit2Progress;
            if (curProgress >= 100) {
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
        const curProgress = state.activeUnit === 'unit1' ? state.unit1Progress : state.unit2Progress;
        progressFill.style.width = `${curProgress}%`;
        progressPercent.textContent = `${curProgress}%`;
        
        const pathWidthPercent = Math.min(curProgress, 95); 
        parrotFlight.style.left = `${pathWidthPercent}%`;
        
        const flightComments = [
            "가자 가자! 출발~! 🚀",
            "오호, 조금씩 날고 있어! 🌱",
            "절반이나 왔어! 힘내자구! 🦜",
            "둥지가 코앞이야! 🌻",
            "미션 컴플리트! 둥지 도착! 🏠"
        ];
        
        let commentIdx = Math.floor(curProgress / 25);
        commentIdx = Math.min(commentIdx, flightComments.length - 1);
        document.querySelector('.flight-bubble').textContent = flightComments[commentIdx];
    }

    // -----------------------------------------
    // 4. Sub-Chapter Navigation for Units
    // -----------------------------------------
    function setupTabListeners(unitPrefix, navSelector, panelClass) {
        const navTabs = document.querySelectorAll(`${navSelector} .nav-tab`);
        const subPanels = document.querySelectorAll(panelClass);
        
        navTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.getAttribute('data-target');
                
                // Set active class
                navTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                subPanels.forEach(p => {
                    if (p.id === target) {
                        p.classList.add('active');
                    } else {
                        p.classList.remove('active');
                    }
                });

                // Smooth Scroll to Tab
                document.querySelector(navSelector).scrollIntoView({ behavior: 'smooth' });

                // Navigation triggers progress & comments
                handleSubChapterOpen(unitPrefix, target);
            });
        });
    }

    function switchPanel(unitPrefix, targetPanelId) {
        const navSelector = unitPrefix === 'unit1' ? '#unit1-nav' : '#unit2-nav';
        const panelClass = unitPrefix === 'unit1' ? '#unit1-container .chapter-panel' : '#unit2-container .chapter-panel';
        
        const tab = document.querySelector(`${navSelector} .nav-tab[data-target="${targetPanelId}"]`);
        const panel = document.getElementById(targetPanelId);
        const allTabs = document.querySelectorAll(`${navSelector} .nav-tab`);
        const allPanels = document.querySelectorAll(panelClass);
        
        if (tab && panel) {
            allTabs.forEach(t => t.classList.remove('active'));
            allPanels.forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            panel.classList.add('active');
            handleSubChapterOpen(unitPrefix, targetPanelId);
        }
    }

    function handleSubChapterOpen(unitPrefix, targetId) {
        if (unitPrefix === 'unit1') {
            if (targetId === 'u1-chapter2') {
                addProgress('u1-readCh2');
                updateParrotSpeech("구석기와 신석기는 도구랑 먹고사는 법이 완전 딴판이야! 잘 봐봐! 🪓");
            } else if (targetId === 'u1-chapter3') {
                addProgress('u1-readCh3');
                updateParrotSpeech("청동기는 비싸서 농사를 못 지었대! 그래서 반달돌칼을 썼지! 🗡️");
            } else if (targetId === 'u1-chapter-quiz') {
                updateParrotSpeech("마지막 관문 보물상자 퀴즈에 어서 와! 5문제를 다 맞춰봐! 🏆");
            }
        } else {
            if (targetId === 'u2-chapter2') {
                addProgress('u2-readCh2');
                updateParrotSpeech("그리스 폴리스 아테네와 스파르타의 기강 넘치는 대결! 그리고 헬레니즘! 🏛️");
            } else if (targetId === 'u2-chapter3') {
                addProgress('u2-readCh3');
                updateParrotSpeech("모든 길은 로마로 통한다! 로마인들의 유용한 실용주의 문화를 살펴보자! 🛡️");
            } else if (targetId === 'u2-chapter-quiz') {
                updateParrotSpeech("로마 콜로세움 둥지 열쇠를 쥐기 위한 대도전! 퀴즈 시작! 🏆🗝️");
            }
        }
    }

    // Initialize listeners
    setupTabListeners('unit1', '#unit1-nav', '#unit1-container .chapter-panel');
    setupTabListeners('unit2', '#unit2-nav', '#unit2-container .chapter-panel');

    // -----------------------------------------
    // 5. Flip Cards for Units
    // -----------------------------------------
    function setupFlipCards(cardSelector, unitPrefix) {
        const cards = document.querySelectorAll(cardSelector);
        cards.forEach(card => {
            card.addEventListener('click', () => {
                card.classList.toggle('flipped');
                const cardId = card.id;
                
                if (card.classList.contains('flipped')) {
                    addProgress(`${unitPrefix}-${cardId.replace(`${unitPrefix}-`, '').split('-')[0]}`); // Triggers progress u1-card1, u2-card1...
                    
                    // Card Specific Comments
                    if (unitPrefix === 'u1') {
                        if (cardId.includes('card1')) updateParrotSpeech("걷느라 발이 아파(아파렌시스)! 직립 보행 시작! 🦶");
                        if (cardId.includes('card2')) updateParrotSpeech("허리를 에렉! 불과 언어 사용 호모 에렉투스! 🔥");
                        if (cardId.includes('card3')) updateParrotSpeech("친구의 죽음에 마음이 네안(미안)해서 매장한 네안데르탈렌시스 🪦");
                        if (cardId.includes('card4')) updateParrotSpeech("지혜로운 사람! 동굴 벽화를 그린 사피엔스 🎨");
                    } else {
                        if (cardId.includes('card1')) updateParrotSpeech("다리(다리우스 1세)를 쩍 뻗어 감찰관 왕의 눈과 왕의 귀 파견! 👁️");
                        if (cardId.includes('card2')) updateParrotSpeech("대제국의 중심 고속도로, 왕의 길! 🛣️");
                        if (cardId.includes('card3')) updateParrotSpeech("세금만 잘 내면 오케이! 종교/전통 인정하는 관용 정책 🤝");
                        if (cardId.includes('card4')) updateParrotSpeech("선의 신과 악의 신 대결, 조로가 구세주를 믿는 조로아스터교! 👼");
                    }
                }
            });
        });
    }
    setupFlipCards('.u1-card', 'u1');
    setupFlipCards('.u2-card', 'u2');

    // -----------------------------------------
    // 6. Unit 1 Game 1: Matching Card Game
    // -----------------------------------------
    const matchingGameContainer = document.getElementById('matching-game-container');
    const game1Feedback = document.getElementById('game1-feedback');
    const startG1Btn = document.getElementById('start-game-1-btn');
    
    let firstCard = null, secondCard = null;
    let lockBoard = false;
    let matchCount = 0;

    const u1MatchItems = [
        { id: 1, type: 'name', value: '오스트랄로피테쿠스' },
        { id: 1, type: 'desc', value: '두 발로 걷기 (아파!) 👣' },
        { id: 2, type: 'name', value: '호모 에렉투스' },
        { id: 2, type: 'desc', value: '불과 언어 사용 (에렉!) 🔥' },
        { id: 3, type: 'name', value: '호모 네안데르탈렌시스' },
        { id: 3, type: 'desc', value: '시신 매장 풍습 (미안!) 🪦' },
        { id: 4, type: 'name', value: '호모 사피엔스' },
        { id: 4, type: 'desc', value: '동굴 벽화 그리기 (슬기!) 🎨' }
    ];

    if (startG1Btn) startG1Btn.addEventListener('click', initMatchingGame);

    function initMatchingGame() {
        matchCount = 0;
        firstCard = null; secondCard = null;
        lockBoard = false;
        game1Feedback.classList.remove('show', 'feedback-correct', 'feedback-wrong');
        matchingGameContainer.innerHTML = '';

        const shuffled = [...u1MatchItems].sort(() => Math.random() - 0.5);
        shuffled.forEach(item => {
            const cardEl = document.createElement('div');
            cardEl.classList.add('game-card');
            cardEl.dataset.id = item.id;
            cardEl.dataset.type = item.type;
            cardEl.textContent = item.value;
            cardEl.addEventListener('click', (e) => {
                if (lockBoard) return;
                const clickedCard = e.currentTarget;
                if (clickedCard === firstCard) return;

                clickedCard.classList.add('selected');

                if (!firstCard) {
                    firstCard = clickedCard;
                    return;
                }
                secondCard = clickedCard;
                
                // Check Match
                let isMatch = firstCard.dataset.id === secondCard.dataset.id && firstCard.dataset.type !== secondCard.dataset.type;
                if (isMatch) {
                    firstCard.classList.remove('selected');
                    secondCard.classList.remove('selected');
                    firstCard.classList.add('matched');
                    secondCard.classList.add('matched');
                    matchCount++;
                    firstCard = null; secondCard = null;
                    showGameFeedback('game1-feedback', true, "우와! 짝을 맞췄어! 대단해! 🎉");
                    
                    if (matchCount === 4) {
                        setTimeout(() => {
                            setParrotAvatar('happy');
                            game1Feedback.innerHTML = "🎯 미션 클리어! 인류의 진화를 다 매칭했어! 🌻 +15% 진행도 획득!";
                            game1Feedback.className = 'game-feedback show feedback-correct';
                            addProgress('u1-matchingGame');
                            updateParrotSpeech("인류 진화 맞추기를 마스터했어! 최고야! 👍✨");
                        }, 500);
                    }
                } else {
                    lockBoard = true;
                    showGameFeedback('game1-feedback', false, "앗! 짝이 맞지 않아. 다시 해봐! 🦜");
                    setTimeout(() => {
                        firstCard.classList.remove('selected');
                        secondCard.classList.remove('selected');
                        firstCard = null; secondCard = null;
                        lockBoard = false;
                    }, 1000);
                }
            });
            matchingGameContainer.appendChild(cardEl);
        });
        updateParrotSpeech("카드 짝 맞추기 시작! 이름과 알맞은 특징 카드를 매칭해봐!");
    }

    // Helper to display transient game feedbacks
    function showGameFeedback(feedbackId, isCorrect, message) {
        const feedbackEl = document.getElementById(feedbackId);
        if (!feedbackEl) return;
        feedbackEl.innerHTML = message;
        feedbackEl.className = `game-feedback show ${isCorrect ? 'feedback-correct' : 'feedback-wrong'}`;
        
        if (!message.includes("미션 클리어") && !message.includes("게임 끝") && !message.includes("완료")) {
            setTimeout(() => {
                feedbackEl.classList.remove('show');
            }, 2000);
        }
    }

    // -----------------------------------------
    // 7. Unit 1 Game 2: Sorting Game (Paleo vs Neo)
    // -----------------------------------------
    const u1SortingItems = [
        { name: "주먹도끼 🔨", category: "paleo", desc: "주먹도끼는 떼어낸 석기니까 구석기야!" },
        { name: "빗살무늬 토기 🌾", category: "neo", desc: "빗살무늬 토기는 신석기 시대의 곡식 저장용 그릇이야!" },
        { name: "막집 ⛺", category: "paleo", desc: "구석기인들은 사냥 따라 이동하며 막 지은 막집에 살았어!" },
        { name: "움집 🏡", category: "neo", desc: "신석기인들은 농사를 지으며 정착해 깊게 판 움집에 살았어!" },
        { name: "갈판과 갈돌 🪓", category: "neo", desc: "곡식 껍질을 벗기기 위해 돌을 갈아 쓴 도구는 신석기!" },
        { name: "찍개 🪨", category: "paleo", desc: "찍개는 뗀석기로, 동물 사냥이나 손질에 쓰인 구석기 도구야!" }
    ];

    let u1SortingIndex = 0;
    let u1SortingScore = 0;
    let u1ShuffledSortingItems = [];

    const startG2Btn = document.getElementById('start-game-2-btn');
    const u1SortingCard = document.getElementById('sorting-card');
    const u1SortingItemText = document.getElementById('sorting-item-text');
    const btnPaleo = document.getElementById('btn-paleo');
    const btnNeo = document.getElementById('btn-neo');
    const sortingScoreVal = document.getElementById('sorting-score-val');
    const game2Feedback = document.getElementById('game2-feedback');

    if (startG2Btn) startG2Btn.addEventListener('click', startU1SortingGame);

    function startU1SortingGame() {
        u1SortingScore = 0; u1SortingIndex = 0;
        sortingScoreVal.textContent = "0";
        game2Feedback.classList.remove('show', 'feedback-correct', 'feedback-wrong');
        u1ShuffledSortingItems = [...u1SortingItems].sort(() => Math.random() - 0.5);
        showNextU1SortingItem();
        btnPaleo.disabled = false; btnNeo.disabled = false;
        startG2Btn.textContent = "다시 시작하기 🔄";
        updateParrotSpeech("구석기 vs 신석기! 도구 이름이 나타나면 아래 바구니 버튼으로 골라봐!");
    }

    function showNextU1SortingItem() {
        if (u1SortingIndex < u1ShuffledSortingItems.length) {
            u1SortingItemText.textContent = u1ShuffledSortingItems[u1SortingIndex].name;
            u1SortingCard.classList.remove('pulse');
            void u1SortingCard.offsetWidth;
            u1SortingCard.classList.add('pulse');
        } else {
            btnPaleo.disabled = true; btnNeo.disabled = true;
            setParrotAvatar('happy');
            game2Feedback.className = "game-feedback show feedback-correct";
            game2Feedback.innerHTML = `🏁 게임 끝! 맞춘 개수: ${u1SortingScore} / 6 <br> 대단해! 🌻 +20% 진행도 획득!`;
            addProgress('u1-sortingGame');
            updateParrotSpeech(`구석기 신석기 완벽 마스터! 6개 중에 ${u1SortingScore}개나 맞췄어! 🌱`);
        }
    }

    if (btnPaleo && btnNeo) {
        btnPaleo.addEventListener('click', () => handleU1SortingChoice("paleo"));
        btnNeo.addEventListener('click', () => handleU1SortingChoice("neo"));
    }

    function handleU1SortingChoice(choice) {
        if (u1ShuffledSortingItems.length === 0 || u1SortingIndex >= u1ShuffledSortingItems.length) return;
        const currentItem = u1ShuffledSortingItems[u1SortingIndex];
        const isCorrect = currentItem.category === choice;

        if (isCorrect) {
            u1SortingScore++;
            sortingScoreVal.textContent = u1SortingScore;
            showGameFeedback('game2-feedback', true, `딩동댕! ⭕ ${currentItem.desc}`);
            setParrotAvatar('happy');
        } else {
            showGameFeedback('game2-feedback', false, `땡! ❌ ${currentItem.desc}`);
            setParrotAvatar('cheer');
        }
        u1SortingIndex++;
        setTimeout(showNextU1SortingItem, 2500);
    }

    // -----------------------------------------
    // 8. Unit 1 Game 3: OX Quiz (Bronze & Civil)
    // -----------------------------------------
    const u1OxQuestions = [
        {
            q: "청동기 시대의 사람들은 귀하고 소중한 '청동'으로 만든 괭이와 낫으로 밭을 갈아 농사를 지었다.",
            ans: false,
            desc: "청동은 너무 귀하고 물러서 농기구로 못 쓰고, 농사는 여전히 돌(반달 돌칼)이나 나무로 지었어!"
        },
        {
            q: "고인돌은 청동기 시대에 농사가 잘되어 잉여 생산물과 사유 재산이 생기면서 등장한 '지배자(군장)'의 권력을 증명하는 거대한 무덤이다.",
            ans: true,
            desc: "맞아! 돌이 엄청 크기 때문에 수많은 사람을 동원할 수 있는 힘센 지배자가 있었다는 아주 든든한 증거지!"
        },
        {
            q: "티그리스강과 유프라테스강 사이에서 쐐기 문자를 쓰며 수메르인들에 의해 꽃을 피운 고대 문명은 '메소포타미아 문명'이다.",
            ans: true,
            desc: "티그리스와 유프라테스강! 그리고 쐐기 문자와 지구라트(신전)는 모두 메소포타미아 문명의 트레이드 마크야!"
        },
        {
            q: "이집트 문명, 메소포타미아 문명, 인더스 문명, 황하 문명 등 고대 문명 발생지들의 핵심 공통점은 '모두 철기 무기를 사용했다'는 점이다.",
            ans: false,
            desc: "땡! 4대 문명은 모두 '청동기'를 기반으로 시작했어. 나중에 철기가 보급되었단다."
        }
    ];

    let u1OxIndex = 0, u1OxScore = 0;
    const startG3Btn = document.getElementById('start-game-3-btn');
    const u1OxQuestionBox = document.getElementById('ox-question');
    const btnOxO = document.getElementById('btn-ox-o');
    const btnOxX = document.getElementById('btn-ox-x');
    const oxScoreVal = document.getElementById('ox-score-val');
    const game3Feedback = document.getElementById('game3-feedback');

    if (startG3Btn) startG3Btn.addEventListener('click', startU1OxGame);

    function startU1OxGame() {
        u1OxScore = 0; u1OxIndex = 0;
        oxScoreVal.textContent = "0";
        game3Feedback.classList.remove('show', 'feedback-correct', 'feedback-wrong');
        btnOxO.disabled = false; btnOxX.disabled = false;
        startG3Btn.textContent = "다시 시작하기 🔄";
        showNextU1OxQuestion();
        updateParrotSpeech("문명 OX 낚시 퀴즈 시작! 문제를 꼼꼼하게 끝까지 읽어봐! 🎣");
    }

    function showNextU1OxQuestion() {
        if (u1OxIndex < u1OxQuestions.length) {
            u1OxQuestionBox.textContent = u1OxQuestions[u1OxIndex].q;
        } else {
            btnOxO.disabled = true; btnOxX.disabled = true;
            setParrotAvatar('happy');
            game3Feedback.className = "game-feedback show feedback-correct";
            game3Feedback.innerHTML = `🏁 OX 퀴즈 완료! 맞춘 개수: ${u1OxScore} / 4 <br> 최고야! 🌻 +15% 진행도 획득!`;
            addProgress('u1-oxGame');
            updateParrotSpeech(`와! 멋져! 4대 문명의 상식을 정복했구나! 🎉`);
        }
    }

    if (btnOxO && btnOxX) {
        btnOxO.addEventListener('click', () => handleU1OxChoice(true));
        btnOxX.addEventListener('click', () => handleU1OxChoice(false));
    }

    function handleU1OxChoice(userAns) {
        if (u1OxIndex >= u1OxQuestions.length) return;
        const currentItem = u1OxQuestions[u1OxIndex];
        const isCorrect = currentItem.ans === userAns;

        if (isCorrect) {
            u1OxScore++;
            oxScoreVal.textContent = u1OxScore;
            showGameFeedback('game3-feedback', true, `딩동댕! ⭕ <br> ${currentItem.desc}`);
            setParrotAvatar('happy');
        } else {
            showGameFeedback('game3-feedback', false, `땡! ❌ <br> ${currentItem.desc}`);
            setParrotAvatar('cheer');
        }
        u1OxIndex++;
        setTimeout(showNextU1OxQuestion, 3500);
    }

    // -----------------------------------------
    // 9. Unit 1 Final Quiz
    // -----------------------------------------
    const u1FinalQuestions = [
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
            hint: "모찌 꿀팁: 농사 생산량이 늘어 계급이 나뉘는 '계급 사회'가 형성되었어! 👑"
        }
    ];

    const startFinalQuizBtn = document.getElementById('start-final-quiz-btn');
    const u1QuizIntroView = document.getElementById('u1-quiz-intro-view');
    const u1QuizPlayView = document.getElementById('u1-quiz-play-view');
    const u1QuizResultView = document.getElementById('u1-quiz-result-view');
    const u1CurrentQNum = document.getElementById('u1-current-q-num');
    const u1FinalScoreVal = document.getElementById('u1-final-score-val');
    const u1QuizQuestionText = document.getElementById('u1-quiz-question-text');
    const u1QuizOptionsContainer = document.getElementById('u1-quiz-options-container');
    const u1FinalTotalScore = document.getElementById('u1-final-total-score');
    const u1ResultMessage = document.getElementById('u1-result-message');

    if (startFinalQuizBtn) startFinalQuizBtn.addEventListener('click', startU1FinalQuiz);

    function startU1FinalQuiz() {
        state.u1CurrentQuizIndex = 0; state.u1QuizScore = 0;
        u1QuizIntroView.classList.add('hidden');
        u1QuizPlayView.classList.remove('hidden');
        u1QuizResultView.classList.add('hidden');
        showU1FinalQuizQuestion();
        updateParrotSpeech("보물상자 퀴즈가 드디어 시작되었어! 5문제를 향해 출동! 🚀💎");
    }

    function showU1FinalQuizQuestion() {
        if (state.u1CurrentQuizIndex < u1FinalQuestions.length) {
            const qData = uFinalQuestionsSelector(state.u1CurrentQuizIndex);
            u1CurrentQNum.textContent = state.u1CurrentQuizIndex + 1;
            u1FinalScoreVal.textContent = state.u1QuizScore;
            u1QuizQuestionText.textContent = qData.q;
            u1QuizOptionsContainer.innerHTML = '';
            
            qData.options.forEach((opt, idx) => {
                const btn = document.createElement('button');
                btn.className = 'quiz-opt-btn';
                btn.textContent = opt;
                btn.addEventListener('click', () => selectU1QuizOption(idx));
                u1QuizOptionsContainer.appendChild(btn);
            });
        } else {
            showU1QuizResults();
        }
    }

    function uFinalQuestionsSelector(idx) {
        return u1FinalQuestions[idx];
    }

    function selectU1QuizOption(userIndex) {
        const qData = u1FinalQuestions[state.u1CurrentQuizIndex];
        const isCorrect = userIndex === qData.correctIndex;
        const optionButtons = u1QuizOptionsContainer.querySelectorAll('.quiz-opt-btn');
        
        optionButtons.forEach(btn => btn.disabled = true);

        if (isCorrect) {
            state.u1QuizScore++;
            optionButtons[userIndex].classList.add('correct');
            updateParrotSpeech("정답이야! 짝짝짝! 넌 진짜 천재인가 봐! 🦜🎉");
            setParrotAvatar('happy');
        } else {
            optionButtons[userIndex].classList.add('wrong');
            optionButtons[qData.correctIndex].classList.add('correct');
            updateParrotSpeech(`앗! 틀렸지만 괜찮아! 다음 꿀팁을 봐바: <br> ${qData.hint}`);
            setParrotAvatar('cheer');
        }
        state.u1CurrentQuizIndex++;
        setTimeout(showU1FinalQuizQuestion, isCorrect ? 1800 : 4000);
    }

    function showU1QuizResults() {
        u1QuizPlayView.classList.add('hidden');
        u1QuizResultView.classList.remove('hidden');
        u1FinalTotalScore.textContent = state.u1QuizScore;
        
        let messageText = "";
        if (state.u1QuizScore === 5) {
            messageText = "💯 우와아! 5점 만점에 5점! 앵무새 모찌마저 깜짝 놀라게 만든 역사 신동 탄생! 둥지에 있는 모든 황금 해바라기씨는 네 거야! 학교 시험은 백점 따놓은 당상이구만! 🌻🏆🥇";
            setParrotAvatar('happy');
        } else if (state.u1QuizScore >= 3) {
            messageText = "👍 훌륭해! 대부분의 문제를 다 이해했구나! 헷갈린 한두 문제만 모찌 카드로 다시 쓱 훑어보면 금방 마스터할 수 있어! 정말 잘했어! 🦜✨";
            setParrotAvatar('teacher');
        } else {
            messageText = "🦜 괜찮아, 역사 용어는 원래 낯설고 외우기 힘들어! 모찌랑 같이 인류 진화 카드 뒤집기 놀이랑 분류 게임을 한 번만 더 복습해 보면 점수가 쑥쑥 오를 거야! 화이팅! 🚀";
            setParrotAvatar('cheer');
        }
        u1ResultMessage.innerHTML = messageText;
        
        const today = new Date();
        const dateString = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
        document.querySelectorAll('.cert-date-span').forEach(el => el.textContent = dateString);

        addProgress('u1-finalQuiz');
    }

    // -----------------------------------------
    // 10. Unit 2 Game 1: Persian Royal Road Game
    // -----------------------------------------
    const pathGameContainer = document.getElementById('path-game-container');
    const u2Game1Feedback = document.getElementById('u2-game1-feedback');
    const startU2G1Btn = document.getElementById('start-game-u2-1-btn');
    
    let pathStepIndex = 0;
    
    const roadQuestions = [
        {
            q: "1단계 역참 건설: 다리우스 1세가 전국을 효율적으로 다스리기 위해 총독을 보낸 행정 구역의 수는?",
            opts: ["20개 주", "100개 주"],
            ansIdx: 0,
            desc: "전국을 20개 주로 나누고 믿음직한 총독들을 각각 보냈어!"
        },
        {
            q: "2단계 역참 건설: 총독들이 나쁜 마음을 먹지 않게 감시하려 임명한 왕의 감찰관의 별명은?",
            opts: ["왕의 첩자와 밀정", "왕의 눈과 귀"],
            ansIdx: 1,
            desc: "왕의 눈과 귀가 되어 지방 사정을 낱낱이 왕에게 들려줬지!"
        },
        {
            q: "3단계 역참 건설: 수사에서 사르디스까지 닦은 전용 고속도로의 정확한 이름은?",
            opts: ["왕의 길", "페르시아 실크로드"],
            ansIdx: 0,
            desc: "전령들이 말을 갈아타며 달릴 수 있게 닦은 '왕의 길(Royal Road)'이야!"
        },
        {
            q: "4단계 역참 건설: 선과 악의 대결, 천국과 지옥, 최후의 심판 등을 강조하여 크리스트교에 큰 영향을 준 종교는?",
            opts: ["조로아스터교", "오리엔트교"],
            ansIdx: 0,
            desc: "불을 신성하게 받든 조로아스터교(배화교)가 정답이란다!"
        }
    ];

    if (startU2G1Btn) startU2G1Btn.addEventListener('click', initPathGame);

    function initPathGame() {
        pathStepIndex = 0;
        u2Game1Feedback.classList.remove('show', 'feedback-correct', 'feedback-wrong');
        buildPathGameUI();
        updateParrotSpeech("페르시아 왕의 길을 닦아보자! 문제를 맞출 때마다 역참이 건설돼! 🛣️");
    }

    function buildPathGameUI() {
        pathGameContainer.innerHTML = '';
        
        // 1. Render Map
        const mapDiv = document.createElement('div');
        mapDiv.className = 'road-map-display';
        
        const pointsDiv = document.createElement('div');
        pointsDiv.className = 'road-points';
        
        // Render nodes
        const nodes = ["수사", "역참1", "역참2", "역참3", "사르디스"];
        nodes.forEach((nName, idx) => {
            const nodeEl = document.createElement('div');
            nodeEl.className = 'road-node';
            nodeEl.textContent = idx === 0 ? "🏁" : idx === 4 ? "🏺" : idx;
            
            // Check status
            if (idx === pathStepIndex) {
                nodeEl.classList.add('active');
            } else if (idx < pathStepIndex) {
                nodeEl.classList.add('passed');
                nodeEl.textContent = "✔";
            }
            pointsDiv.appendChild(nodeEl);
        });
        
        mapDiv.appendChild(pointsDiv);
        
        // Active description
        const descDiv = document.createElement('div');
        descDiv.className = 'road-desc-box';
        if (pathStepIndex < 4) {
            descDiv.textContent = `현재 위치: ${nodes[pathStepIndex]} -> 다음 목적지: ${nodes[pathStepIndex + 1]}`;
        } else {
            descDiv.textContent = "🎉 축하합니다! 왕의 길(수사 ~ 사르디스)이 완전 연결되었습니다!";
        }
        mapDiv.appendChild(descDiv);
        pathGameContainer.appendChild(mapDiv);

        // 2. Render Question if active
        if (pathStepIndex < 4) {
            const qData = roadQuestions[pathStepIndex];
            
            const qEl = document.createElement('div');
            qEl.className = 'quiz-question';
            qEl.style.marginTop = '15px';
            qEl.style.fontSize = '1rem';
            qEl.textContent = qData.q;
            pathGameContainer.appendChild(qEl);
            
            const optsGrid = document.createElement('div');
            optsGrid.className = 'road-options-grid';
            
            qData.opts.forEach((oText, oIdx) => {
                const oBtn = document.createElement('button');
                oBtn.className = 'road-opt-btn';
                oBtn.textContent = oText;
                oBtn.addEventListener('click', () => selectRoadOption(oIdx));
                optsGrid.appendChild(oBtn);
            });
            pathGameContainer.appendChild(optsGrid);
        } else {
            // Game Finished
            setParrotAvatar('happy');
            u2Game1Feedback.className = "game-feedback show feedback-correct";
            u2Game1Feedback.innerHTML = `🏁 왕의 길 건설 완료! 다리우스 1세가 기뻐합니다! 🌻 +15% 진행도 획득!`;
            addProgress('u2-pathGame');
            updateParrotSpeech("왕의 길을 완벽히 뚫었어! 동서 교통이 뻥 뚫렸구만! 🛣️✨");
        }
    }

    function selectRoadOption(selectedIdx) {
        const qData = roadQuestions[pathStepIndex];
        const isCorrect = selectedIdx === qData.ansIdx;
        const optButtons = pathGameContainer.querySelectorAll('.road-opt-btn');
        
        optButtons.forEach(b => b.disabled = true);
        
        if (isCorrect) {
            optButtons[selectedIdx].classList.add('correct');
            showGameFeedback('u2-game1-feedback', true, `딩동댕! ⭕ <br> ${qData.desc}`);
            setParrotAvatar('happy');
            pathStepIndex++;
        } else {
            optButtons[selectedIdx].classList.add('wrong');
            optButtons[qData.ansIdx].classList.add('correct');
            showGameFeedback('u2-game1-feedback', false, `땡! ❌ <br> ${qData.desc}`);
            setParrotAvatar('cheer');
        }
        
        setTimeout(buildPathGameUI, 3000);
    }

    // -----------------------------------------
    // 11. Unit 2 Game 2: Athens, Sparta, Hellenism Sorting Game
    // -----------------------------------------
    const u2SortingItems = [
        { name: "도편추방제 🗳️", category: "athens", desc: "독재자가 될 법한 사람을 쫓아내며 민주주의를 지킨 곳은 아테네!" },
        { name: "스파르타식 공동 교육 ⚔️", category: "sparta", desc: "엄격하고 거친 군사식 공동 교육을 행한 도시는 스파르타!" },
        { name: "세계 시민주의 🌍", category: "hellenism", desc: "알렉산드로스의 융합 정책으로 생긴 무국경 헬레니즘 문화의 특징!" },
        { name: "라오콘 군상 미술품 🏛️", category: "hellenism", desc: "고통을 생동감 있게 표현한 헬레니즘 시대의 대표 미술품은 라오콘 군상!" },
        { name: "직접 민주 정치 🗣️", category: "athens", desc: "민회에 시민들이 모여 직접 국정을 토론한 폴리스는 아테네!" },
        { name: "펠로폰네소스 전쟁 승리 🛡️", category: "sparta", desc: "강력한 육군으로 그리스 동맹국 간의 전쟁에서 승리한 나라는 스파르타!" }
    ];

    let u2SortingIndex = 0;
    let u2SortingScore = 0;
    let u2ShuffledSortingItems = [];

    const startU2G2Btn = document.getElementById('start-game-u2-2-btn');
    const u2SortingCard = document.getElementById('sorting-card-u2');
    const u2SortingItemText = document.getElementById('sorting-item-u2-text');
    const btnAthens = document.getElementById('btn-u2-athens');
    const btnSparta = document.getElementById('btn-u2-sparta');
    const btnHellenism = document.getElementById('btn-u2-hellenism');
    const u2SortingScoreVal = document.getElementById('sorting-score-u2-val');
    const u2Game2Feedback = document.getElementById('u2-game2-feedback');

    if (startU2G2Btn) startU2G2Btn.addEventListener('click', startU2SortingGame);

    function startU2SortingGame() {
        u2SortingScore = 0; u2SortingIndex = 0;
        u2SortingScoreVal.textContent = "0";
        u2Game2Feedback.classList.remove('show', 'feedback-correct', 'feedback-wrong');
        u2ShuffledSortingItems = [...u2SortingItems].sort(() => Math.random() - 0.5);
        showNextU2SortingItem();
        
        btnAthens.disabled = false; btnSparta.disabled = false; btnHellenism.disabled = false;
        startU2G2Btn.textContent = "다시 시작하기 🔄";
        updateParrotSpeech("아테네, 스파르타, 헬레니즘! 알맞은 바구니 단추를 꾹 눌러봐! 🏛️");
    }

    function showNextU2SortingItem() {
        if (u2SortingIndex < u2ShuffledSortingItems.length) {
            u2SortingItemText.textContent = u2ShuffledSortingItems[u2SortingIndex].name;
            u2SortingCard.classList.remove('pulse');
            void u2SortingCard.offsetWidth;
            u2SortingCard.classList.add('pulse');
        } else {
            btnAthens.disabled = true; btnSparta.disabled = true; btnHellenism.disabled = true;
            setParrotAvatar('happy');
            u2Game2Feedback.className = "game-feedback show feedback-correct";
            u2Game2Feedback.innerHTML = `🏁 분류 완성! 맞춘 개수: ${u2SortingScore} / 6 <br> 훌륭해! 🌻 +20% 진행도 획득!`;
            addProgress('u2-sortingGame');
            updateParrotSpeech(`그리스 지중해 분류 클리어! 6개 중에 ${u2SortingScore}개를 정렬했어! 🏺`);
        }
    }

    if (btnAthens && btnSparta && btnHellenism) {
        btnAthens.addEventListener('click', () => handleU2SortingChoice("athens"));
        btnSparta.addEventListener('click', () => handleU2SortingChoice("sparta"));
        btnHellenism.addEventListener('click', () => handleU2SortingChoice("hellenism"));
    }

    function handleU2SortingChoice(choice) {
        if (u2ShuffledSortingItems.length === 0 || u2SortingIndex >= u2ShuffledSortingItems.length) return;
        const currentItem = u2ShuffledSortingItems[u2SortingIndex];
        const isCorrect = currentItem.category === choice;

        if (isCorrect) {
            u2SortingScore++;
            u2SortingScoreVal.textContent = u2SortingScore;
            showGameFeedback('u2-game2-feedback', true, `딩동댕! ⭕ <br> ${currentItem.desc}`);
            setParrotAvatar('happy');
        } else {
            showGameFeedback('u2-game2-feedback', false, `땡! ❌ <br> ${currentItem.desc}`);
            setParrotAvatar('cheer');
        }
        u2SortingIndex++;
        setTimeout(showNextU2SortingItem, 2500);
    }

    // -----------------------------------------
    // 12. Unit 2 Game 3: Roman Empire OX Game
    // -----------------------------------------
    const u2OxQuestions = [
        {
            q: "로마 공화정 시대의 로마인들은 카르타고와의 포에니 전쟁에서 처참하게 패해 지중해 지배권을 내어주었다.",
            ans: false,
            desc: "패배하지 않았어! 치열한 싸움 끝에 카르타고를 무찌르고 승리하여 지중해를 장악했단다!"
        },
        {
            q: "로마 공화정의 혼란을 끝내고 실질적인 황제(제정) 시대를 열어 아우구스투스 칭호를 얻은 인물은 옥타비아누스이다.",
            ans: true,
            desc: "맞아! 옥타비아누스가 '아우구스투스(존엄한 자)' 칭호를 받으며 로마 평화 시대(팍스 로마나)가 개막했어."
        },
        {
            q: "로마인들은 그리스 문화에 비해 도량형, 도로, 수로, 공공 건축물, 법률 등 실용적인 문화를 크게 발달시켰다.",
            ans: true,
            desc: "정답! 로마는 아주 현실적이고 편리한 건축, 도로망, 법률(로마법 대전)을 주로 남겼지!"
        },
        {
            q: "크리스트교(기독교)를 박해하던 로마 제국에서, 크리스트교를 '국교화'하여 로마의 유일한 종교로 공식 선언한 법령은 콘스탄티누스의 밀라노 칙령이다.",
            ans: false,
            desc: "주의해! 콘스탄티누스는 밀라노 칙령으로 크리스트교를 '공인(믿어도 됨)' 해 준 것이고, '국교(이것만 믿어라)'로 선언한 것은 테오도시우스 대제야!"
        }
    ];

    let u2OxIndex = 0, u2OxScore = 0;
    const startU2G3Btn = document.getElementById('start-game-u2-3-btn');
    const u2OxQuestionBox = document.getElementById('ox-question-u2');
    const btnU2OxO = document.getElementById('btn-u2-ox-o');
    const btnU2OxX = document.getElementById('btn-u2-ox-x');
    const u2OxScoreVal = document.getElementById('ox-score-u2-val');
    const u2Game3Feedback = document.getElementById('u2-game3-feedback');

    if (startU2G3Btn) startU2G3Btn.addEventListener('click', startU2OxGame);

    function startU2OxGame() {
        u2OxScore = 0; u2OxIndex = 0;
        u2OxScoreVal.textContent = "0";
        u2Game3Feedback.classList.remove('show', 'feedback-correct', 'feedback-wrong');
        btnU2OxO.disabled = false; btnU2OxX.disabled = false;
        startU2G3Btn.textContent = "다시 시작하기 🔄";
        showNextU2OxQuestion();
        updateParrotSpeech("로마 제국 OX 퀴즈를 돌파해보자! 끝까지 꼼꼼히 읽어! 🛡️");
    }

    function showNextU2OxQuestion() {
        if (u2OxIndex < u2OxQuestions.length) {
            u2OxQuestionBox.textContent = u2OxQuestions[u2OxIndex].q;
        } else {
            btnU2OxO.disabled = true; btnU2OxX.disabled = true;
            setParrotAvatar('happy');
            u2Game3Feedback.className = "game-feedback show feedback-correct";
            u2Game3Feedback.innerHTML = `🏁 로마 OX 완료! 맞춘 개수: ${u2OxScore} / 4 <br> 축하해! 🌻 +15% 진행도 획득!`;
            addProgress('u2-oxGame');
            updateParrotSpeech(`대단해! 로마 제국의 역사 사실을 철저히 구분해냈어! 🏛️`);
        }
    }

    if (btnU2OxO && btnU2OxX) {
        btnU2OxO.addEventListener('click', () => handleU2OxChoice(true));
        btnU2OxX.addEventListener('click', () => handleU2OxChoice(false));
    }

    function handleU2OxChoice(userAns) {
        if (u2OxIndex >= u2OxQuestions.length) return;
        const currentItem = u2OxQuestions[u2OxIndex];
        const isCorrect = currentItem.ans === userAns;

        if (isCorrect) {
            u2OxScore++;
            u2OxScoreVal.textContent = u2OxScore;
            showGameFeedback('u2-game3-feedback', true, `딩동댕! ⭕ <br> ${currentItem.desc}`);
            setParrotAvatar('happy');
        } else {
            showGameFeedback('u2-game3-feedback', false, `땡! ❌ <br> ${currentItem.desc}`);
            setParrotAvatar('cheer');
        }
        u2OxIndex++;
        setTimeout(showNextU2OxQuestion, 3500);
    }

    // -----------------------------------------
    // 13. Unit 2 Final Quiz
    // -----------------------------------------
    const u2FinalQuestions = [
        {
            q: "아케메네스 왕조 페르시아의 다리우스 1세가 전국 20개 주의 총독을 감시하려고 파견한 국왕의 눈, 귀 역할을 한 감찰관은 무엇일까요?",
            options: [
                "왕의 눈과 귀",
                "국왕 파견관",
                "로열 총독관"
            ],
            correctIndex: 0,
            hint: "모찌 꿀팁: 다리우스 1세가 전국 총독을 감시하기 위해 눈과 귀를 크게 열어둔 '왕의 눈과 귀'를 보냈어! 👁️👂"
        },
        {
            q: "세상을 선의 신과 악의 신의 대결로 묘사하며, 훗날 크리스트교의 천국과 지옥, 종말 사상에 지대한 영향을 미친 페르시아의 종교는 무엇일까요?",
            options: [
                "이슬람교",
                "조로아스터교 (배화교)",
                "불교"
            ],
            correctIndex: 1,
            hint: "모찌 꿀팁: 불을 소중히 섬기고 악을 징벌하는 영웅 '조로(조로아스터교)'를 떠올려봐! 👼"
        },
        {
            q: "그리스 아테네 민주정의 대표적인 제도로, 독재 위험이 있는 정치가의 이름을 도자기 조각에 써내서 쫓아내는 제도는 무엇일까요?",
            options: [
                "도편추방제",
                "도자기 세금법",
                "12표법"
            ],
            correctIndex: 0,
            hint: "모찌 꿀팁: 깨진 도자기 편(조각)에 독재자 이름을 써서 멀리 추방(도편추방제)했어! 🗳️"
        },
        {
            q: "그리스 문화와 오리엔트(동방) 문화가 합쳐져 탄생했으며, 세계 시민주의와 라오콘 군상 등으로 대표되는 문화는 무엇일까요?",
            options: [
                "헬레니즘 문화",
                "로마 실용 문화",
                "비잔티움 문화"
            ],
            correctIndex: 0,
            hint: "모찌 꿀팁: 알렉산드로스 왕의 원정으로 서양과 동양을 마구 섞어 헬렐레~ '헬레니즘 문화'가 생겼어! 🌍"
        },
        {
            q: "로마 제국에서 억압받던 크리스트교(기독교)를 법적으로 공식 공인(허용)해 준 황제와 그의 칙령은 무엇일까요?",
            options: [
                "아우구스투스 황제 - 로마 칙령",
                "콘스탄티누스 대제 - 밀라노 칙령",
                "테오도시우스 대제 - 국교 공화령"
            ],
            correctIndex: 1,
            hint: "모찌 꿀팁: 황제가 교회를 인정해주려고 뒤에서 '밀었어!(밀라노 칙령, 콘스탄티누스)' 국교로 정한 테오도시우스와 헷갈리지 마! ⛪"
        }
    ];

    const startU2FinalQuizBtn = document.getElementById('start-u2-final-quiz-btn');
    const u2QuizIntroView = document.getElementById('u2-quiz-intro-view');
    const u2QuizPlayView = document.getElementById('u2-quiz-play-view');
    const u2QuizResultView = document.getElementById('u2-quiz-result-view');
    const u2CurrentQNum = document.getElementById('u2-current-q-num');
    const u2FinalScoreVal = document.getElementById('u2-final-score-val');
    const u2QuizQuestionText = document.getElementById('u2-quiz-question-text');
    const u2QuizOptionsContainer = document.getElementById('u2-quiz-options-container');
    const u2FinalTotalScore = document.getElementById('u2-final-total-score');
    const u2ResultMessage = document.getElementById('u2-result-message');

    if (startU2FinalQuizBtn) startU2FinalQuizBtn.addEventListener('click', startU2FinalQuiz);

    function startU2FinalQuiz() {
        state.u2CurrentQuizIndex = 0; state.u2QuizScore = 0;
        u2QuizIntroView.classList.add('hidden');
        u2QuizPlayView.classList.remove('hidden');
        u2QuizResultView.classList.add('hidden');
        showU2FinalQuizQuestion();
        updateParrotSpeech("지중해 세계의 숨겨진 열쇠를 쥐기 위한 종합 시험이 시작되었다! 🛡️🔑");
    }

    function showU2FinalQuizQuestion() {
        if (state.u2CurrentQuizIndex < u2FinalQuestions.length) {
            const qData = u2FinalQuestions[state.u2CurrentQuizIndex];
            u2CurrentQNum.textContent = state.u2CurrentQuizIndex + 1;
            u2FinalScoreVal.textContent = state.u2QuizScore;
            u2QuizQuestionText.textContent = qData.q;
            u2QuizOptionsContainer.innerHTML = '';
            
            qData.options.forEach((opt, idx) => {
                const btn = document.createElement('button');
                btn.className = 'quiz-opt-btn';
                btn.textContent = opt;
                btn.addEventListener('click', () => selectU2QuizOption(idx));
                u2QuizOptionsContainer.appendChild(btn);
            });
        } else {
            showU2QuizResults();
        }
    }

    function selectU2QuizOption(userIndex) {
        const qData = u2FinalQuestions[state.u2CurrentQuizIndex];
        const isCorrect = userIndex === qData.correctIndex;
        const optionButtons = u2QuizOptionsContainer.querySelectorAll('.quiz-opt-btn');
        
        optionButtons.forEach(btn => btn.disabled = true);

        if (isCorrect) {
            state.u2QuizScore++;
            optionButtons[userIndex].classList.add('correct');
            updateParrotSpeech("정답! 우와 지중해 제국의 최고 지혜를 가졌구나! 🏺🎉");
            setParrotAvatar('happy');
        } else {
            optionButtons[userIndex].classList.add('wrong');
            optionButtons[qData.correctIndex].classList.add('correct');
            updateParrotSpeech(`아깝다! 틀렸지만 모찌 꿀팁으로 다시 새겨둬: <br> ${qData.hint}`);
            setParrotAvatar('cheer');
        }
        state.u2CurrentQuizIndex++;
        setTimeout(showU2FinalQuizQuestion, isCorrect ? 1800 : 4000);
    }

    function showU2QuizResults() {
        u2QuizPlayView.classList.add('hidden');
        u2QuizResultView.classList.remove('hidden');
        u2FinalTotalScore.textContent = state.u2QuizScore;
        
        let messageText = "";
        if (state.u2QuizScore === 5) {
            messageText = "💯 최고 존엄 아우구스투스 급 만점 달성! 앵무새 모찌의 로마 콜로세움 둥지 주인이 될 자격을 얻었어! 지중해와 아시아 역사는 완전히 정복했구만! 🛡️🏺👑🥇";
            setParrotAvatar('happy');
        } else if (state.u2QuizScore >= 3) {
            messageText = "👍 훌륭한 역사 수호자! 그리스 철학자들처럼 합리적인 점수를 받았어. 조금 헷갈렸던 문제만 한 번 더 짚고 넘어가 봐! 정말 잘했어! ⛪✨";
            setParrotAvatar('teacher');
        } else {
            messageText = "🦜 좌절 금지! 로마도 하루아침에 이루어지지 않았다는 명언을 기억해! 모찌와 페르시아 길 닦기 놀이부터 차근차근 다시 돌다리를 두드려보자! 🛣️";
            setParrotAvatar('cheer');
        }
        u2ResultMessage.innerHTML = messageText;
        
        const today = new Date();
        const dateString = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
        document.querySelectorAll('.cert-date-span').forEach(el => el.textContent = dateString);

        addProgress('u2-finalQuiz');
    }

    // -----------------------------------------
    // 14. Shared Actions: Certificate Print & Restart
    // -----------------------------------------
    const printButtons = document.querySelectorAll('.btn-print-cert-class');
    printButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            window.print();
        });
    });

    const restartButtons = document.querySelectorAll('.btn-restart-adventure-class');
    restartButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const unit = state.activeUnit;
            if (unit === 'unit1') {
                state.unit1Progress = 0;
                // Clear Unit 1 completed keys from Set
                for (let key of state.completedActivities) {
                    if (key.startsWith('u1-')) state.completedActivities.delete(key);
                }
                updateProgressBar();
                switchPanel('unit1', 'u1-chapter1');
                u1QuizResultView.classList.add('hidden');
                u1QuizIntroView.classList.remove('hidden');
                updateParrotSpeech("선사 시대 공부를 처음부터 차분히 다시 해보자! 🌱");
            } else {
                state.unit2Progress = 0;
                // Clear Unit 2 completed keys from Set
                for (let key of state.completedActivities) {
                    if (key.startsWith('u2-')) state.completedActivities.delete(key);
                }
                updateProgressBar();
                switchPanel('unit2', 'u2-chapter1');
                u2QuizResultView.classList.add('hidden');
                u2QuizIntroView.classList.remove('hidden');
                updateParrotSpeech("고대 서아시아·지중해의 모험을 처음부터 다시 질주해보자! 🛡️");
            }
            setParrotAvatar('teacher');
        });
    });

    // Initialize progress bar at load
    updateProgressBar();
});
