// Mochi's World History - App Script

document.addEventListener('DOMContentLoaded', () => {
    // App State
    const state = {
        activeGrandUnit: 'grand1', // 'grand1' or 'grand2'
        activeUnit: 'unit1', // 'unit1', 'unit2', ... 'unit6'
        unit1Progress: 0,
        unit2Progress: 0,
        unit3Progress: 0,
        unit4Progress: 0,
        unit5Progress: 0,
        unit6Progress: 0,
        completedActivities: new Set(),
        
        // Unit 1 Quiz State
        u1CurrentQuizIndex: 0,
        u1QuizScore: 0,
        
        // Unit 2 Quiz State
        u2CurrentQuizIndex: 0,
        u2QuizScore: 0,

        // Unit 3 Quiz State
        u3CurrentQuizIndex: 0,
        u3QuizScore: 0,

        // Unit 4 Quiz State
        u4CurrentQuizIndex: 0,
        u4QuizScore: 0,

        // Unit 5 Quiz State
        u5CurrentQuizIndex: 0,
        u5QuizScore: 0,

        // Unit 6 Quiz State
        u6CurrentQuizIndex: 0,
        u6QuizScore: 0,
        
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
            'u2-finalQuiz': 20,

            // Unit 3
            'u3-card1': 5, 'u3-card2': 5, 'u3-card3': 5, 'u3-card4': 5, // Total 20%
            'u3-sortingGame': 20,
            'u3-readCh2': 10,
            'u3-oxGame': 20,
            'u3-finalQuiz': 30,

            // Unit 4
            'u4-card1': 5, 'u4-card2': 5, 'u4-card3': 5, 'u4-card4': 5, // Total 20%
            'u4-sortingGame': 20,
            'u4-readCh2': 10,
            'u4-oxGame': 20,
            'u4-finalQuiz': 30,

            // Unit 5
            'u5-c1-card1': 2.5, 'u5-c1-card2': 2.5, 'u5-c1-card3': 2.5, 'u5-c1-card4': 2.5,
            'u5-c2-card1': 2.5, 'u5-c2-card2': 2.5, 'u5-c2-card3': 2.5, 'u5-c2-card4': 2.5,
            'u5-c3-card1': 2.5, 'u5-c3-card2': 2.5, 'u5-c3-card3': 2.5, 'u5-c3-card4': 2.5, // 12 cards * 2.5% = 30%
            'u5-game1': 10,
            'u5-readCh2': 5,
            'u5-game2': 10,
            'u5-readCh3': 5,
            'u5-game3': 10,
            'u5-finalQuiz': 30,

            // Unit 6
            'u6-c1-card1': 3.75, 'u6-c1-card2': 3.75, 'u6-c1-card3': 3.75, 'u6-c1-card4': 3.75,
            'u6-c2-card1': 3.75, 'u6-c2-card2': 3.75, 'u6-c2-card3': 3.75, 'u6-c2-card4': 3.75, // 8 cards * 3.75% = 30%
            'u6-game1': 20,
            'u6-readCh2': 10,
            'u6-game2': 20,
            'u6-finalQuiz': 20
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
        unit2: document.getElementById('unit2-container'),
        unit3: document.getElementById('unit3-container'),
        unit4: document.getElementById('unit4-container'),
        unit5: document.getElementById('unit5-container'),
        unit6: document.getElementById('unit6-container')
    };

    // Grand Unit Selector Elements
    const grandButtons = document.querySelectorAll('.grand-unit-btn');

    // -----------------------------------------
    // 1. Grand Unit Switching Logic
    // -----------------------------------------
    grandButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const grandId = btn.getAttribute('data-grand');
            switchGrandUnit(grandId);
        });
    });

    function switchGrandUnit(grandId) {
        state.activeGrandUnit = grandId;
        
        // Update Grand Buttons active class
        grandButtons.forEach(btn => {
            if (btn.getAttribute('data-grand') === grandId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Show/Hide sub unit buttons based on Grand Unit
        unitButtons.forEach(btn => {
            const btnGrand = btn.getAttribute('data-grand');
            if (btnGrand === grandId) {
                btn.classList.remove('hidden');
            } else {
                btn.classList.add('hidden');
            }
        });

        // Switch to the default active unit of this Grand Unit
        const defaultUnit = grandId === 'grand1' ? 'unit1' : 'unit4';
        switchUnit(defaultUnit);
    }

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
            progressUnitLabel.textContent = "1단원 모험 진행률";
            heroWelcomeText.innerHTML = `
                역사 시험 범위만 보면 머리가 지끈지끈하지? 🤯<br>
                걱정 마! 나 모찌가 인류가 처음 태어난 <strong>선사 시대</strong>부터 <strong>문명이 싹튼 때</strong>까지 아주 쉽고 재밌게 안내해 줄게!<br>
                카드 공부를 끝내고 신나는 미니 게임을 클리어하면 둥지에 맛있는 해바라기씨가 쌓인다구! 함께 가볼까? 🌻✨
            `;
            updateParrotSpeech("오스트랄로... 발 아파! 최초의 인류 선사 시대로 모험을 떠나자! 🌿");
        } else if (unitId === 'unit2') {
            nestEmoji.textContent = '🏛️';
            progressUnitLabel.textContent = "2단원 모험 진행률";
            heroWelcomeText.innerHTML = `
                두 번째 모험에 온 걸 환영해! 🏺<br>
                여기는 다리우스 1세의 강력한 <strong>페르시아 제국</strong>, 철학의 고향 <strong>그리스</strong>와 <strong>헬레니즘</strong>, 그리고 <strong>로마 제국</strong>이 속한 대단원이야!<br>
                모찌와 함께 카드를 정복하고 로마 콜로세움 둥지 열쇠를 획득해 봐! 🛡️🗝️
            `;
            updateParrotSpeech("대제국 다리우스 1세의 길을 뚫고, 로마의 크리스트교 국교화 비밀을 밝혀내 보자! 🛡️");
        } else if (unitId === 'unit3') {
            nestEmoji.textContent = '🕌';
            progressUnitLabel.textContent = "3단원 모험 진행률";
            heroWelcomeText.innerHTML = `
                세 번째 모험에 온 걸 환영해! ☸️<br>
                여기는 최초로 중국을 통일한 <strong>진나라</strong>와 비단길을 개척한 <strong>한나라</strong>, 그리고 자비와 평등을 전파한 <strong>인도의 통일 왕조들</strong>이 속한 대단원이야!<br>
                모찌와 함께 카드를 정복하고 인도 타지마할 둥지 열쇠를 획득해 봐! 🕌🔑
            `;
            updateParrotSpeech("시황제의 통일 비법과 인도 카니시카왕의 대승 불교 전파 이야기를 파헤쳐 보자! ☸️");
        } else if (unitId === 'unit4') {
            nestEmoji.textContent = '🌸';
            progressUnitLabel.textContent = "1단원 모험 진행률";
            heroWelcomeText.innerHTML = `
                네 번째 모험에 온 걸 환영해! 🌸<br>
                여기는 오랜 분열을 극복한 <strong>수·당 제국</strong>과 다이카 개신으로 성장한 <strong>일본</strong>, 그리고 이들이 연결된 <strong>동아시아 문화권</strong>을 다루는 대단원이야!<br>
                모찌와 함께 카드를 뒤집고 벚꽃 둥지 열쇠를 획득해 봐! 🌸🔑
            `;
            updateParrotSpeech("위진남북조 분열의 역사를 뚫고, 당나라 율령과 동아시아의 4대 공통 패키지를 파헤쳐 보자! 🌸");
        } else if (unitId === 'unit5') {
            nestEmoji.textContent = '🐫';
            progressUnitLabel.textContent = "5단원 모험 진행률";
            heroWelcomeText.innerHTML = `
                다섯 번째 모험에 온 걸 환영해! 🐫<br>
                여기는 인도 고전 문화를 세운 <strong>굽타 왕조</strong>, 동서 무역을 주도한 <strong>사산 왕조 페르시아</strong>, 그리고 세계 제국으로 팽창한 <strong>이슬람 세계</strong>와 <strong>유럽 세계의 형성</strong>을 다루는 대단원이야!<br>
                모찌와 함께 카드를 정복하고 오아시스 둥지 열쇠를 획득해 봐! 🐫🔑
            `;
            updateParrotSpeech("인도의 힌두교 성립과 이슬람의 대제국, 그리고 서로마 멸망 이후 프랑크 왕국을 파헤쳐 보자! 🐫");
        } else {
            nestEmoji.textContent = '⛪';
            progressUnitLabel.textContent = "6단원 모험 진행률";
            heroWelcomeText.innerHTML = `
                여섯 번째 모험에 온 걸 환영해! ⛪<br>
                여기는 주군과 봉신의 <strong>봉건 사회</strong>, 중세를 지배한 <strong>교황권</strong>, 그리고 <strong>십자군 전쟁</strong>과 <strong>흑사병</strong>으로 인한 서유럽의 대변화를 다루는 대단원이야!<br>
                모찌와 함께 카드를 뒤집고 성당 장미창 둥지 열쇠를 획득해 봐! ⛪🔑
            `;
            updateParrotSpeech("서유럽 봉건제의 성립과 중세 크리스트교 문화, 그리고 십자군 전쟁과 흑사병의 여파를 정복해 보자! ⛪");
        }

        updateProgressBar();
    }

    // Start Adventure Button based on Active Unit
    startAdventureBtn.addEventListener('click', () => {
        if (state.activeUnit === 'unit1') {
            switchPanel('unit1', 'u1-chapter1');
            updateParrotSpeech("최초의 인류 카드를 클릭해서 뒤집어봐! 발 아파렌시스! 👣");
        } else if (state.activeUnit === 'unit2') {
            switchPanel('unit2', 'u2-chapter1');
            updateParrotSpeech("페르시아 제국! 다리우스 1세의 카드를 뒤집어서 핵심 정책을 알아봐! 👑");
        } else if (state.activeUnit === 'unit3') {
            switchPanel('unit3', 'u3-chapter1');
            updateParrotSpeech("진나라 시황제 카드를 뒤집어서 중국의 기틀을 어떻게 닦았는지 알아봐! 👑");
        } else if (state.activeUnit === 'unit4') {
            switchPanel('unit4', 'u4-chapter1');
            updateParrotSpeech("위진남북조 귀족 카드를 뒤집어서 분열기의 화려한 예술을 알아봐! 🎨");
        } else if (state.activeUnit === 'unit5') {
            switchPanel('unit5', 'u5-chapter1');
            updateParrotSpeech("굽타 왕조와 힌두교 카드를 뒤집어서 고전 산스크리트 문화의 재미를 알아봐! 🕉️");
        } else if (state.activeUnit === 'unit6') {
            switchPanel('unit6', 'u6-chapter1');
            updateParrotSpeech("봉건제와 농노 카드를 뒤집어서 영주의 장원에서 무슨 일이 있었는지 알아봐! 🚜");
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
            } else if (activityKey.startsWith('u3-')) {
                state.unit3Progress = Math.min(state.unit3Progress + addValue, 100);
            } else if (activityKey.startsWith('u4-')) {
                state.unit4Progress = Math.min(state.unit4Progress + addValue, 100);
            } else if (activityKey.startsWith('u5-')) {
                state.unit5Progress = Math.min(state.unit5Progress + addValue, 100);
            } else if (activityKey.startsWith('u6-')) {
                state.unit6Progress = Math.min(state.unit6Progress + addValue, 100);
            }
            
            updateProgressBar();
            
            const curProgress = getUnitProgress(state.activeUnit);
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

    function getUnitProgress(unitId) {
        if (unitId === 'unit1') return state.unit1Progress;
        if (unitId === 'unit2') return state.unit2Progress;
        if (unitId === 'unit3') return state.unit3Progress;
        if (unitId === 'unit4') return state.unit4Progress;
        if (unitId === 'unit5') return state.unit5Progress;
        return state.unit6Progress;
    }

    function updateProgressBar() {
        const curProgress = getUnitProgress(state.activeUnit);
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
        const navSelector = `#${unitPrefix}-nav`;
        const panelClass = `#${unitPrefix}-container .chapter-panel`;
        
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
        } else if (unitPrefix === 'unit2') {
            if (targetId === 'u2-chapter2') {
                addProgress('u2-readCh2');
                updateParrotSpeech("그리스 폴리스 아테네와 스파르타의 기강 넘치는 대결! 그리고 헬레니즘! 🏛️");
            } else if (targetId === 'u2-chapter3') {
                addProgress('u2-readCh3');
                updateParrotSpeech("모든 길은 로마로 통한다! 로마인들의 유용한 실용주의 문화를 살펴보자! 🛡️");
            } else if (targetId === 'u2-chapter-quiz') {
                updateParrotSpeech("로마 콜로세움 둥지 열쇠를 쥐기 위한 대도전! 퀴즈 시작! 🏆🗝️");
            }
        } else if (unitPrefix === 'unit3') {
            if (targetId === 'u3-chapter2') {
                addProgress('u3-readCh2');
                updateParrotSpeech("인도 대륙의 마우리아 왕조와 쿠샨 왕조가 꽃피운 아름다운 불교 예술! ☸️");
            } else if (targetId === 'u3-chapter-quiz') {
                updateParrotSpeech("마지막 관문! 동아시아와 인도 세계 마스터 퀴즈에 다다랐어! 🏆");
            }
        } else if (unitPrefix === 'unit4') {
            if (targetId === 'u4-chapter2') {
                addProgress('u4-readCh2');
                updateParrotSpeech("야마토 정권과 다이카 개신, 그리고 동아시아를 지배한 4대 문화권! 🌸");
            } else if (targetId === 'u4-chapter-quiz') {
                updateParrotSpeech("마지막 관문! 동아시아 문화의 형성과 발전 종합 퀴즈 시작! 🏆");
            }
        }
    }

    // Initialize listeners
    setupTabListeners('unit1', '#unit1-nav', '#unit1-container .chapter-panel');
    setupTabListeners('unit2', '#unit2-nav', '#unit2-container .chapter-panel');
    setupTabListeners('unit3', '#unit3-nav', '#unit3-container .chapter-panel');
    setupTabListeners('unit4', '#unit4-nav', '#unit4-container .chapter-panel');
    setupTabListeners('unit5', '#unit5-nav', '#unit5-container .chapter-panel');
    setupTabListeners('unit6', '#unit6-nav', '#unit6-container .chapter-panel');

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
                    // Safe lookup: check if direct ID exists in weights, or map uX-cY-cardZ -> uX-cardZ
                    let activityKey = cardId;
                    if (!(activityKey in state.weights)) {
                        const parts = cardId.replace(`${unitPrefix}-`, '').split('-');
                        if (parts.length > 1 && parts[1].startsWith('card')) {
                            activityKey = `${unitPrefix}-${parts[1]}`;
                        } else {
                            activityKey = `${unitPrefix}-${parts[0]}`;
                        }
                    }
                    addProgress(activityKey);
                    
                    // Card Specific Comments
                    if (unitPrefix === 'u1') {
                        if (cardId.includes('card1')) updateParrotSpeech("걷느라 발이 아파(아파렌시스)! 직립 보행 시작! 🦶");
                        if (cardId.includes('card2')) updateParrotSpeech("허리를 에렉! 불과 언어 사용 호모 에렉투스! 🔥");
                        if (cardId.includes('card3')) updateParrotSpeech("친구의 죽음에 마음이 네안(미안)해서 매장한 네안데르탈렌시스 🪦");
                        if (cardId.includes('card4')) updateParrotSpeech("지혜로운 사람! 동굴 벽화를 그린 사피엔스 🎨");
                    } else if (unitPrefix === 'u2') {
                        if (cardId.includes('card1')) updateParrotSpeech("다리(다리우스 1세)를 쩍 뻗어 감찰관 왕의 눈과 왕의 귀 파견! 👁️");
                        if (cardId.includes('card2')) updateParrotSpeech("대제국의 중심 고속도로, 왕의 길! 🛣️");
                        if (cardId.includes('card3')) updateParrotSpeech("세금만 잘 내면 오케이! 종교/전통 인정하는 관용 정책 🤝");
                        if (cardId.includes('card4')) updateParrotSpeech("선의 신과 악의 신 대결, 조로가 구세주를 믿는 조로아스터교! 👼");
                    } else if (unitPrefix === 'u3') {
                        if (cardId.includes('card1')) updateParrotSpeech("시황제의 통일 정책! 문자, 화폐, 도량형 통일! 👑");
                        if (cardId.includes('card2')) updateParrotSpeech("책을 태우고 유학자를 묻은 분서갱유와 흉노 방어 만리장성! 🧱");
                        if (cardId.includes('card3')) updateParrotSpeech("한 무제의 유교 국교화와 강력한 군현제 실시! 🐉");
                        if (cardId.includes('card4')) updateParrotSpeech("서역으로 장거리 건너간(장건) 비단길 개척자! 🐫");
                    } else if (unitPrefix === 'u4') {
                        if (cardId.includes('card1')) updateParrotSpeech("위진남북조! 9품중정제로 귀족들이 떵떵거리고, 불교 석굴을 팠단다! 🎨");
                        if (cardId.includes('card2')) updateParrotSpeech("수나라는 남북을 가로지르는 대운하를 파다가 수~욱 가버렸지! 🧱");
                        if (cardId.includes('card3')) updateParrotSpeech("당나라는 법과 질서인 율령 체제로 나라의 기틀을 확립했어! 🐉");
                        if (cardId.includes('card4')) updateParrotSpeech("화려하고 글로벌한 당삼채! 개방적인 당나라 문화가 유행했단다! 🐫");
                    } else if (unitPrefix === 'u5') {
                        if (cardId.includes('c1-card1')) updateParrotSpeech("왕권을 굽히지(굽타) 않으려 힌두교를 지지한 굽타 왕조! 🕉️");
                        if (cardId.includes('c1-card2')) updateParrotSpeech("인도인의 머릿속 의무와 법률을 빼곡히 담은 마누 법전! 📜");
                        if (cardId.includes('c1-card3')) updateParrotSpeech("우아하고 부드러운 산스크리트 문화와 아잔타 벽화! 🎨");
                        if (cardId.includes('c1-card4')) updateParrotSpeech("아무것도 없는 무(無)를 뜻하는 '0'과 10진법 계산! 🥯");
                        if (cardId.includes('c2-card1')) updateParrotSpeech("중계 무역으로 번성하며 조로아스터교를 신봉한 사산 왕조! 🦁");
                        if (cardId.includes('c2-card2')) updateParrotSpeech("메디나로 헤~지(헤지라) 웃으며 대피한 이슬람의 원년! 🕌");
                        if (cardId.includes('c2-card3')) updateParrotSpeech("아랍인 중심이라 비아랍인들이 '우마(우마이야)이~갓' 하고 반항했지! 😡");
                        if (cardId.includes('c2-card4')) updateParrotSpeech("차별을 아바(아바스)이(바이)하고 동서양 학문을 지혜의 집에서 번역! 🌍");
                        if (cardId.includes('c3-card1')) updateParrotSpeech("가톨릭으로 클로즈업(클로비스) 개종하여 성공한 프랑크 왕국! ⛪");
                        if (cardId.includes('c3-card2')) updateParrotSpeech("로마+크기독교+게르만 3종 세트 황제 대관 카롤루스 대제! 👑");
                        if (cardId.includes('c3-card3')) updateParrotSpeech("로마 영토 수복 뉴스로 유스(유스티니아누스)에 나온 대제! 🏛️");
                        if (cardId.includes('c3-card4')) updateParrotSpeech("황제가 종교 머리까지 독차지한 동로마 황제 교황주의! 👑⛪");
                    } else if (unitPrefix === 'u6') {
                        if (cardId.includes('c1-card1')) updateParrotSpeech("주군과 봉신이 함께 의무를 춤추는 쌍무적 계약 관계! 🤝");
                        if (cardId.includes('c1-card2')) updateParrotSpeech("이사 가겠다고 하면 영주가 '농노(노노)!' 하는 묶인 신분! 🚜");
                        if (cardId.includes('c1-card3')) updateParrotSpeech("신학 밑의 철학과 코가 딕 막히는 고딕 양식 성당! 🏰");
                        if (cardId.includes('c1-card4')) updateParrotSpeech("황제가 교황 발밑에서 싹싹 빈 추운 겨울 카노사의 굴욕! ❄️👑");
                        if (cardId.includes('c2-card1')) updateParrotSpeech("성지를 되찾으러 떠났으나 무역로만 뻥 뚫어준 십자군! ⚔️");
                        if (cardId.includes('c2-card2')) updateParrotSpeech("도시 상인들과 기술자들의 끈끈한 뭉침 조합 길드! 💰");
                        if (cardId.includes('c2-card3')) updateParrotSpeech("벼룩과 쥐 때문에 서유럽 인구의 3분의 1을 몰살시킨 흑사병! 🦠");
                        if (cardId.includes('c2-card4')) updateParrotSpeech("교황청을 프랑스로 납치(유배)하고 백년 전쟁 거쳐 왕권 강화! 🏰");
                    }
                }
            });
        });
    }
    setupFlipCards('.u1-card', 'u1');
    setupFlipCards('.u2-card', 'u2');
    setupFlipCards('.u3-card', 'u3');
    setupFlipCards('.u4-card', 'u4');
    setupFlipCards('.u5-card', 'u5');
    setupFlipCards('.u6-card', 'u6');

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
    // 14. Unit 3 Game 1: Qin vs Han Sorting Game
    // -----------------------------------------
    const u3SortingItems = [
        { name: "문자, 화폐, 도량형 통일 🪙", category: "qin", desc: "전국의 경제와 행정을 묶기 위해 문자, 돈, 단위를 하나로 통일한 것은 진나라!" },
        { name: "만리장성 축조 🧱", category: "qin", desc: "흉노의 침략을 막기 위해 장대한 방어벽을 쌓은 나라는 진나라!" },
        { name: "분서갱유 사건 😡", category: "qin", desc: "법가 이외의 학문책을 태우고 유학자를 묻어 사상을 극단적으로 통제한 곳은 진나라!" },
        { name: "장건의 비단길 개척 🐫", category: "han", desc: "무제가 서역에 장건을 보내며 동서 교통의 통로인 비단길이 뚫린 나라는 한나라!" },
        { name: "유교를 통치 이념으로 채택 🐉", category: "han", desc: "동중서의 건의로 유교를 나라의 통치 규범으로 삼아 중앙집권을 다진 나라는 한나라!" },
        { name: "한 무제의 영토 확장 ⚔️", category: "han", desc: "흉노를 격퇴하고 남越과 고조선을 정벌하여 대제국을 만든 왕조는 한나라!" }
    ];

    let u3SortingIndex = 0;
    let u3SortingScore = 0;
    let u3ShuffledSortingItems = [];

    const startU3G1Btn = document.getElementById('start-game-u3-1-btn');
    const u3SortingCard = document.getElementById('sorting-card-u3');
    const u3SortingItemText = document.getElementById('sorting-item-u3-text');
    const btnQin = document.getElementById('btn-u3-qin');
    const btnHan = document.getElementById('btn-u3-han');
    const u3SortingScoreVal = document.getElementById('sorting-score-u3-val');
    const u3Game1Feedback = document.getElementById('u3-game1-feedback');

    if (startU3G1Btn) startU3G1Btn.addEventListener('click', startU3SortingGame);

    function startU3SortingGame() {
        u3SortingScore = 0; u3SortingIndex = 0;
        u3SortingScoreVal.textContent = "0";
        u3Game1Feedback.classList.remove('show', 'feedback-correct', 'feedback-wrong');
        u3ShuffledSortingItems = [...u3SortingItems].sort(() => Math.random() - 0.5);
        showNextU3SortingItem();
        
        btnQin.disabled = false; btnHan.disabled = false;
        startU3G1Btn.textContent = "다시 시작하기 🔄";
        updateParrotSpeech("진나라(시황제) vs 한나라(무제)! 알맞은 왕조 버튼을 눌러 정답을 골라봐! 🇨🇳");
    }

    function showNextU3SortingItem() {
        if (u3SortingIndex < u3ShuffledSortingItems.length) {
            u3SortingItemText.textContent = u3ShuffledSortingItems[u3SortingIndex].name;
            u3SortingCard.classList.remove('pulse');
            void u3SortingCard.offsetWidth;
            u3SortingCard.classList.add('pulse');
        } else {
            btnQin.disabled = true; btnHan.disabled = true;
            setParrotAvatar('happy');
            u3Game1Feedback.className = "game-feedback show feedback-correct";
            u3Game1Feedback.innerHTML = `🏁 분류 완성! 맞춘 개수: ${u3SortingScore} / 6 <br> 대단해! 🌻 +20% 진행도 획득!`;
            addProgress('u3-sortingGame');
            updateParrotSpeech(`진한 제국의 역사를 완전히 정복했구나! 6개 중에 ${u3SortingScore}개 성공! 🇨🇳`);
        }
    }

    if (btnQin && btnHan) {
        btnQin.addEventListener('click', () => handleU3SortingChoice("qin"));
        btnHan.addEventListener('click', () => handleU3SortingChoice("han"));
    }

    function handleU3SortingChoice(choice) {
        if (u3ShuffledSortingItems.length === 0 || u3SortingIndex >= u3ShuffledSortingItems.length) return;
        const currentItem = u3ShuffledSortingItems[u3SortingIndex];
        const isCorrect = currentItem.category === choice;

        if (isCorrect) {
            u3SortingScore++;
            u3SortingScoreVal.textContent = u3SortingScore;
            showGameFeedback('u3-game1-feedback', true, `딩동댕! ⭕ <br> ${currentItem.desc}`);
            setParrotAvatar('happy');
        } else {
            showGameFeedback('u3-game1-feedback', false, `땡! ❌ <br> ${currentItem.desc}`);
            setParrotAvatar('cheer');
        }
        u3SortingIndex++;
        setTimeout(showNextU3SortingItem, 2500);
    }

    // -----------------------------------------
    // 15. Unit 3 Game 2: India Buddhism OX Game
    // -----------------------------------------
    const u3OxQuestions = [
        {
            q: "인도의 고타마 시다르타(석가모니)가 창시한 불교는 신분 차별을 옹호하는 엄격한 카스트 제도를 적극적으로 찬성했다.",
            ans: false,
            desc: "틀렸어! 불교는 모든 인간은 평등하고 자비가 중요하다고 가르치며 카스트 제도의 신분 차별에 강력히 반대했어!"
        },
        {
            q: "마우리아 왕조의 전성기를 이끈 아소카왕은 영토 확장 전쟁의 참상을 반성하고 불교에 귀의하여 탑을 짓고 경전을 정리했다.",
            ans: true,
            desc: "맞아! 칼링가 전쟁의 무참함을 겪은 뒤 불교를 국가적으로 밀어주며 평화를 선언했지."
        },
        {
            q: "아소카왕 때 발달하여 동남아시아로 주로 전파된 상좌부 불교는 개인의 엄격한 수행과 해탈을 핵심으로 한다.",
            ans: true,
            desc: "정답! 개인이 직접 스스로 도를 닦아 해탈하는 상좌부(소승) 불교가 스리랑카와 미얀마 등으로 전파되었어!"
        },
        {
            q: "쿠샨 왕조 때 헬레니즘 문화의 영향을 받아 인도 최초로 곱슬머리와 서양식 얼굴을 한 불상을 조각하기 시작한 미술은 '로마 미술'이다.",
            ans: false,
            desc: "아니야! 그리스 헬레니즘 스타일과 인도의 불교가 결합한 독특한 미술 명칭은 '간다라 미술'이야!"
        }
    ];

    let u3OxIndex = 0, u3OxScore = 0;
    const startU3G2Btn = document.getElementById('start-game-u3-2-btn');
    const u3OxQuestionBox = document.getElementById('ox-question-u3');
    const btnU3OxO = document.getElementById('btn-u3-ox-o');
    const btnU3OxX = document.getElementById('btn-u3-ox-x');
    const u3OxScoreVal = document.getElementById('ox-score-u3-val');
    const u3Game2Feedback = document.getElementById('u3-game2-feedback');

    if (startU3G2Btn) startU3G2Btn.addEventListener('click', startU3OxGame);

    function startU3OxGame() {
        u3OxScore = 0; u3OxIndex = 0;
        u3OxScoreVal.textContent = "0";
        u3Game2Feedback.classList.remove('show', 'feedback-correct', 'feedback-wrong');
        btnU3OxO.disabled = false; btnU3OxX.disabled = false;
        startU3G2Btn.textContent = "다시 시작하기 🔄";
        showNextU3OxQuestion();
        updateParrotSpeech("인도 불교와 왕조 OX 퀴즈! 천천히 정독해서 풀어봐! ☸️");
    }

    function showNextU3OxQuestion() {
        if (u3OxIndex < u3OxQuestions.length) {
            u3OxQuestionBox.textContent = u3OxQuestions[u3OxIndex].q;
        } else {
            btnU3OxO.disabled = true; btnU3OxX.disabled = true;
            setParrotAvatar('happy');
            u3Game2Feedback.className = "game-feedback show feedback-correct";
            u3Game2Feedback.innerHTML = `🏁 인도 OX 완료! 맞춘 개수: ${u3OxScore} / 4 <br> 최고야! 🌻 +20% 진행도 획득!`;
            addProgress('u3-oxGame');
            updateParrotSpeech(`훌륭해! 마우리아와 쿠샨 두 인도 왕조의 불교 특징을 정확히 나눴어! 🕌`);
        }
    }

    if (btnU3OxO && btnU3OxX) {
        btnU3OxO.addEventListener('click', () => handleU3OxChoice(true));
        btnU3OxX.addEventListener('click', () => handleU3OxChoice(false));
    }

    function handleU3OxChoice(userAns) {
        if (u3OxIndex >= u3OxQuestions.length) return;
        const currentItem = u3OxQuestions[u3OxIndex];
        const isCorrect = currentItem.ans === userAns;

        if (isCorrect) {
            u3OxScore++;
            u3OxScoreVal.textContent = u3OxScore;
            showGameFeedback('u3-game2-feedback', true, `딩동댕! ⭕ <br> ${currentItem.desc}`);
            setParrotAvatar('happy');
        } else {
            showGameFeedback('u3-game2-feedback', false, `땡! ❌ <br> ${currentItem.desc}`);
            setParrotAvatar('cheer');
        }
        u3OxIndex++;
        setTimeout(showNextU3OxQuestion, 3500);
    }

    // -----------------------------------------
    // 16. Unit 3 Final Quiz
    // -----------------------------------------
    const u3FinalQuestions = [
        {
            q: "진 시황제가 중앙 집권을 위해 전국을 36개 군으로 나누고 황제가 직접 관리를 임명해 보낸 제도는 무엇일까요?",
            options: [
                "군현제",
                "봉건제",
                "군국제"
            ],
            correctIndex: 0,
            hint: "모찌 꿀팁: 황제가 각 고을에 자신의 눈과 발이 될 행정 관리를 보낸 것은 군현제야! 👑"
        },
        {
            q: "진나라 시황제가 법가 사상에 반대되는 유학 사상과 학문을 통제하기 위해 책을 불태우고 유학자들을 구덩이에 묻어 죽인 사건은 무엇일까요?",
            options: [
                "분서갱유",
                "도편추방제",
                "12표법"
            ],
            correctIndex: 0,
            hint: "모찌 꿀팁: 책을 태우고(분서) 유학자를 묻은(갱유) 극단적인 사상 탄압! 분서갱유! 😡"
        },
        {
            q: "한나라 무제가 흉노를 견제하기 위해 대월지와 손잡으려 파견한 인물로, 이를 통해 동서양을 연결하는 비단길이 열리게 만든 장본인은 누구일까요?",
            options: [
                "장건",
                "아소카왕",
                "알렉산드로스"
            ],
            correctIndex: 0,
            hint: "모찌 꿀팁: 서역으로 장거리 건너간(장건) 비단길 하이웨이의 주인공! 🐫"
        },
        {
            q: "기원전 3세기 인도 마우리아 왕조의 전성기를 이끌며, 불교를 적극 장려하여 경전을 결집하고 석주(돌기둥)를 세운 인물은 누구일까요?",
            options: [
                "아소카왕",
                "카니시카왕",
                "찬드라굽타"
            ],
            correctIndex: 0,
            hint: "모찌 꿀팁: 백성들의 고달픈 상처를 자비와 평등으로 '아~ 씻어(아소카)' 준 왕! 마우리아 왕조의 아소카왕이야! 🏛️"
        },
        {
            q: "쿠샨 왕조의 카니시카왕 시절 크게 발달한 불교 양식과 그리스 헬레니즘 조각 기술이 융합되어 처음으로 불상을 만들기 시작한 예술 양식은 무엇일까요?",
            options: [
                "대승 불교 - 간다라 미술",
                "상좌부 불교 - 이집트 미술",
                "인도교 - 메소포타미아 미술"
            ],
            correctIndex: 0,
            hint: "모찌 꿀팁: 큰 수레(대승)에 대중을 태워 구원하고, 그리스풍 불상이 인도로 '간다라(간다라 미술)'! ☸️🗿"
        }
    ];

    const startU3FinalQuizBtn = document.getElementById('start-u3-final-quiz-btn');
    const u3QuizIntroView = document.getElementById('u3-quiz-intro-view');
    const u3QuizPlayView = document.getElementById('u3-quiz-play-view');
    const u3QuizResultView = document.getElementById('u3-quiz-result-view');
    const u3CurrentQNum = document.getElementById('u3-current-q-num');
    const u3FinalScoreVal = document.getElementById('u3-final-score-val');
    const u3QuizQuestionText = document.getElementById('u3-quiz-question-text');
    const u3QuizOptionsContainer = document.getElementById('u3-quiz-options-container');
    const u3FinalTotalScore = document.getElementById('u3-final-total-score');
    const u3ResultMessage = document.getElementById('u3-result-message');

    if (startU3FinalQuizBtn) startU3FinalQuizBtn.addEventListener('click', startU3FinalQuiz);

    function startU3FinalQuiz() {
        state.u3CurrentQuizIndex = 0; state.u3QuizScore = 0;
        u3QuizIntroView.classList.add('hidden');
        u3QuizPlayView.classList.remove('hidden');
        u3QuizResultView.classList.add('hidden');
        showU3FinalQuizQuestion();
        updateParrotSpeech("동아시아와 인도 대륙을 정복하는 영광스러운 최종 도전이 시작된다! ☸️👑");
    }

    function showU3FinalQuizQuestion() {
        if (state.u3CurrentQuizIndex < u3FinalQuestions.length) {
            const qData = u3FinalQuestions[state.u3CurrentQuizIndex];
            u3CurrentQNum.textContent = state.u3CurrentQuizIndex + 1;
            u3FinalScoreVal.textContent = state.u3QuizScore;
            u3QuizQuestionText.textContent = qData.q;
            u3QuizOptionsContainer.innerHTML = '';
            
            qData.options.forEach((opt, idx) => {
                const btn = document.createElement('button');
                btn.className = 'quiz-opt-btn';
                btn.textContent = opt;
                btn.addEventListener('click', () => selectU3QuizOption(idx));
                u3QuizOptionsContainer.appendChild(btn);
            });
        } else {
            showU3QuizResults();
        }
    }

    function selectU3QuizOption(userIndex) {
        const qData = u3FinalQuestions[state.u3CurrentQuizIndex];
        const isCorrect = userIndex === qData.correctIndex;
        const optionButtons = u3QuizOptionsContainer.querySelectorAll('.quiz-opt-btn');
        
        optionButtons.forEach(btn => btn.disabled = true);

        if (isCorrect) {
            state.u3QuizScore++;
            optionButtons[userIndex].classList.add('correct');
            updateParrotSpeech("정답이야! 짝짝짝! 역시 너의 세계사 실력은 대륙 급이구나! 🇨🇳🕉️🎉");
            setParrotAvatar('happy');
        } else {
            optionButtons[userIndex].classList.add('wrong');
            optionButtons[qData.correctIndex].classList.add('correct');
            updateParrotSpeech(`아쉽다! 하지만 모찌 꿀팁으로 지식을 탄탄하게 메꿔봐: <br> ${qData.hint}`);
            setParrotAvatar('cheer');
        }
        state.u3CurrentQuizIndex++;
        setTimeout(showU3FinalQuizQuestion, isCorrect ? 1800 : 4000);
    }

    function showU3QuizResults() {
        u3QuizPlayView.classList.add('hidden');
        u3QuizResultView.classList.remove('hidden');
        u3FinalTotalScore.textContent = state.u3QuizScore;
        
        let messageText = "";
        if (state.u3QuizScore === 5) {
            messageText = "💯 완벽한 동아시아·인도 역사 지배자 탄생! 앵무새 모찌가 평화로운 인도 타지마할 둥지를 활짝 개방해 주었어! 너의 지식 수준은 정말 명불허전이야! 🇨🇳☸️🕌🥇";
            setParrotAvatar('happy');
        } else if (state.u3QuizScore >= 3) {
            messageText = "👍 훌륭해! 넓은 동아시아와 인도 대륙의 굵직한 사건들을 다 꿰뚫고 있네! 틀린 것도 모찌의 꿀팁 카드 한두 장으로 쉽게 극복 가능하단다! 🐉✨";
            setParrotAvatar('teacher');
        } else {
            messageText = "🦜 역사 이름들이 길고 헷갈렸지? 괜찮아, 시황제의 통일 분류기 놀이랑 인도 OX 퀴즈를 모찌와 같이 몇 번 더 연습해 보면 머리에 쏙쏙 들어올 거야! 다시 출발! 🚀";
            setParrotAvatar('cheer');
        }
        u3ResultMessage.innerHTML = messageText;
        
        const today = new Date();
        const dateString = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
        document.querySelectorAll('.cert-date-span').forEach(el => el.textContent = dateString);

        addProgress('u3-finalQuiz');
    }

    // -----------------------------------------
    // 17. Shared Actions: Certificate Print & Restart
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
            } else if (unit === 'unit2') {
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
            } else if (unit === 'unit3') {
                state.unit3Progress = 0;
                // Clear Unit 3 completed keys from Set
                for (let key of state.completedActivities) {
                    if (key.startsWith('u3-')) state.completedActivities.delete(key);
                }
                updateProgressBar();
                switchPanel('unit3', 'u3-chapter1');
                u3QuizResultView.classList.add('hidden');
                u3QuizIntroView.classList.remove('hidden');
                updateParrotSpeech("고대 동아시아·인도의 모험을 처음부터 차분히 다시 시작해보자! ☸️");
            } else if (unit === 'unit4') {
                state.unit4Progress = 0;
                state.u4CurrentQuizIndex = 0;
                state.u4QuizScore = 0;
                for (let key of state.completedActivities) {
                    if (key.startsWith('u4-')) state.completedActivities.delete(key);
                }
                updateProgressBar();
                switchPanel('unit4', 'u4-chapter1');
                if (u4QuizResultView) u4QuizResultView.classList.add('hidden');
                if (u4QuizIntroView) u4QuizIntroView.classList.remove('hidden');
                updateParrotSpeech("동아시아 문화권 모험을 처음부터 다시 시작해보자! 🌸");
            } else if (unit === 'unit5') {
                state.unit5Progress = 0;
                state.u5CurrentQuizIndex = 0;
                state.u5QuizScore = 0;
                for (let key of state.completedActivities) {
                    if (key.startsWith('u5-')) state.completedActivities.delete(key);
                }
                updateProgressBar();
                switchPanel('unit5', 'u5-chapter1');
                const u5QuizResultView = document.getElementById('u5-quiz-result');
                const u5QuizIntroView = document.getElementById('u5-quiz-intro');
                if (u5QuizResultView) u5QuizResultView.classList.add('hidden');
                if (u5QuizIntroView) u5QuizIntroView.classList.remove('hidden');
                updateParrotSpeech("인도·서아시아·지중해의 모험을 처음부터 차분히 다시 시작해보자! 🐫");
            } else if (unit === 'unit6') {
                state.unit6Progress = 0;
                state.u6CurrentQuizIndex = 0;
                state.u6QuizScore = 0;
                for (let key of state.completedActivities) {
                    if (key.startsWith('u6-')) state.completedActivities.delete(key);
                }
                updateProgressBar();
                switchPanel('unit6', 'u6-chapter1');
                const u6QuizResultView = document.getElementById('u6-quiz-result');
                const u6QuizIntroView = document.getElementById('u6-quiz-intro');
                if (u6QuizResultView) u6QuizResultView.classList.add('hidden');
                if (u6QuizIntroView) u6QuizIntroView.classList.remove('hidden');
                updateParrotSpeech("크리스트교 세계의 변화 모험을 처음부터 다시 질주해보자! ⛪");
            }
            setParrotAvatar('teacher');
        });
    });

    // Initialize progress bar at load
    updateProgressBar();

    // -----------------------------------------
    // 17. Unit 4 Game 1: 위진남북조 vs 수·당 분류기
    // -----------------------------------------
    const u4SortingItems = [
        { text: "9품중정제 실시", answer: "위진", hint: "9품중정제는 위나라 조비가 만든 관리 선발 제도야! 관료 귀족층이 기득권을 독점했지!" },
        { text: "대운하 건설", answer: "수당", hint: "수 양제가 북쪽 황하와 남쪽 양쯔강을 잇는 대운하를 팠어! 이게 경제를 통합시켰단다!" },
        { text: "관음보살 등 불교 석굴 사원 조성", answer: "위진", hint: "위진남북조 시대에 불교가 크게 유행해서 운강·용문 석굴 같은 아름다운 석굴 사원이 만들어졌어!" },
        { text: "율령 체제 정비", answer: "수당", hint: "당나라는 율(형법)과 령(행정법)을 정비해서 동아시아 전체의 법과 질서 모델이 됐단다!" },
        { text: "삼성육부제 완성", answer: "수당", hint: "수·당에서 완성된 삼성(중서성·문하성·상서성)과 육부(이·호·예·병·형·공부)는 당나라 핵심 행정 체계야!" },
        { text: "죽림칠현의 청담 사상", answer: "위진", hint: "위진 시대 지식인들은 현실 정치를 피해 대나무 숲에 모여 무위자연을 논하는 청담 사상에 빠졌단다!" },
        { text: "과거제 시행", answer: "수당", hint: "수 문제가 시작하고 당나라에서 본격 시행된 과거제! 시험으로 능력 있는 관리를 뽑는 제도야!" },
        { text: "귀족 문화 발달 (도연명, 왕희지)", answer: "위진", hint: "전원생활의 시인 도연명과 서예의 신 왕희지는 모두 위진남북조 시대의 귀족 문화를 대표해!" }
    ];

    const u4SortingGameContainer = document.getElementById('u4-sorting-game-container');
    const u4SortingFeedback = document.getElementById('u4-sorting-feedback');
    const u4SortingResult = document.getElementById('u4-sorting-result');
    const startU4SortingBtn = document.getElementById('start-u4-sorting-btn');

    let u4SortCorrect = 0;
    let u4SortItems = [];
    let u4CurrentSortIdx = 0;

    if (startU4SortingBtn) startU4SortingBtn.addEventListener('click', initU4SortingGame);

    function initU4SortingGame() {
        u4SortCorrect = 0;
        u4CurrentSortIdx = 0;
        u4SortItems = [...u4SortingItems].sort(() => Math.random() - 0.5);
        if (u4SortingFeedback) u4SortingFeedback.classList.remove('show', 'feedback-correct', 'feedback-wrong');
        if (u4SortingResult) u4SortingResult.classList.add('hidden');
        if (startU4SortingBtn) startU4SortingBtn.classList.add('hidden');
        renderU4SortItem();
        updateParrotSpeech("이 사건이 위진남북조 시대야, 수·당 시대야? 잘 분류해봐! 🧩");
    }

    function renderU4SortItem() {
        if (!u4SortingGameContainer) return;
        if (u4CurrentSortIdx >= u4SortItems.length) {
            endU4SortingGame();
            return;
        }
        const item = u4SortItems[u4CurrentSortIdx];
        u4SortingGameContainer.innerHTML = `
            <div class="sort-item-card">
                <p class="sort-item-text">📜 ${item.text}</p>
                <div class="sort-buttons">
                    <button class="sort-btn sort-btn-a" id="u4-sort-btn-wuijin">⚔️ 위진남북조</button>
                    <button class="sort-btn sort-btn-b" id="u4-sort-btn-sudang">🏯 수·당</button>
                </div>
                <p class="sort-progress">📌 ${u4CurrentSortIdx + 1} / ${u4SortItems.length}</p>
            </div>
        `;
        document.getElementById('u4-sort-btn-wuijin').addEventListener('click', () => checkU4Sort('위진'));
        document.getElementById('u4-sort-btn-sudang').addEventListener('click', () => checkU4Sort('수당'));
    }

    function checkU4Sort(answer) {
        const item = u4SortItems[u4CurrentSortIdx];
        const isCorrect = answer === item.answer;
        const btns = u4SortingGameContainer.querySelectorAll('.sort-btn');
        btns.forEach(b => b.disabled = true);
        if (isCorrect) {
            u4SortCorrect++;
            if (u4SortingFeedback) {
                u4SortingFeedback.textContent = "✅ 정답! 모찌가 응원해!";
                u4SortingFeedback.className = 'sorting-feedback show feedback-correct';
            }
            updateParrotSpeech(`맞아! ${item.text} - 정확히 분류했어! 대단해! 🎊`);
        } else {
            if (u4SortingFeedback) {
                u4SortingFeedback.innerHTML = `❌ 아쉽! 정답은 <strong>${item.answer === '위진' ? '⚔️ 위진남북조' : '🏯 수·당'}</strong>이야!<br><small>${item.hint}</small>`;
                u4SortingFeedback.className = 'sorting-feedback show feedback-wrong';
            }
            updateParrotSpeech(`아쉽! 🦜 ${item.hint}`);
        }
        u4CurrentSortIdx++;
        setTimeout(renderU4SortItem, isCorrect ? 1800 : 4000);
    }

    function endU4SortingGame() {
        if (!u4SortingGameContainer) return;
        u4SortingGameContainer.innerHTML = '';
        if (u4SortingFeedback) u4SortingFeedback.classList.remove('show');
        if (u4SortingResult) {
            u4SortingResult.classList.remove('hidden');
            const total = u4SortItems.length;
            document.getElementById('u4-sort-score').textContent = u4SortCorrect;
            document.getElementById('u4-sort-total').textContent = total;
            let msg = '';
            if (u4SortCorrect === total) {
                msg = "완벽해! 위진남북조와 수·당의 차이를 완전히 꿰뚫었어! 🥇";
            } else if (u4SortCorrect >= total * 0.7) {
                msg = "훌륭해! 조금만 더 복습하면 완벽해질 거야! 🌸";
            } else {
                msg = "힘내! 카드를 다시 보고 재도전해봐! 🦜";
            }
            document.getElementById('u4-sort-msg').textContent = msg;
            updateParrotSpeech(`분류 게임 완료! ${u4SortCorrect}/${total} 정답! ${msg}`);
        }
        if (startU4SortingBtn) startU4SortingBtn.classList.remove('hidden');
        addProgress('u4-sortingGame');
    }

    // -----------------------------------------
    // 18. Unit 4 Game 2: 동아시아 문화권 OX 퀴즈
    // -----------------------------------------
    const u4OxQuestions = [
        { q: "동아시아 문화권의 공통 요소로 한자·유교·불교·율령이 꼽힌다.", answer: true, hint: "맞아! 이 4가지가 한국·일본·베트남 등 동아시아 지역에서 공통적으로 수용된 당나라 문화의 핵심이야!" },
        { q: "일본에서 다이카 개신은 신라의 율령 제도를 모델로 하여 실시되었다.", answer: false, hint: "아니야! 다이카 개신은 당나라의 율령 제도를 모델로 했단다. 중앙 집권 강화를 위해 당나라 방식을 받아들인 거야!" },
        { q: "수 문제(양견)는 과거제를 처음으로 시작해 능력 위주의 관리 선발 기반을 마련했다.", answer: true, hint: "맞아! 수 문제 양견이 9품중정제를 대신해 시험 능력으로 관리를 뽑는 과거제를 시작했단다!" },
        { q: "위진남북조 시대에 귀족 문화가 쇠퇴하고 유교가 국가 이념으로 강화되었다.", answer: false, hint: "아니야! 위진남북조 시대에는 오히려 귀족 문화가 꽃피었고, 도교·불교·청담 사상이 유행했어. 유교 강화는 한나라 이야기야!" },
        { q: "당나라의 수도 장안은 인구 100만 명이 넘는 국제 도시로 각국 사람들이 모여들었다.", answer: true, hint: "맞아! 당 장안은 실크로드의 중심지로 서역·신라·일본 등 각국 사람이 모여든 초대형 국제 도시였단다!" },
        { q: "만주와 한반도에서 고구려가 멸망한 후 발해가 세워져 '해동성국'이라 불렸다.", answer: true, hint: "맞아! 대조영이 고구려 유민과 말갈족을 이끌고 세운 발해는 한때 '바다 동쪽의 큰 나라(해동성국)'라 불릴 만큼 강성했단다!" },
        { q: "신라는 삼국 통일 후 당나라의 율령 제도를 완전히 거부하고 독자 제도를 유지했다.", answer: false, hint: "아니야! 통일 신라도 당나라의 율령·유교·불교를 적극 수용했단다. 동아시아 문화권의 일원으로 교류가 활발했어!" }
    ];

    const u4OxGameSection = document.getElementById('u4-ox-game-section');
    const u4OxQuestionText = document.getElementById('u4-ox-question-text');
    const u4OxFeedback = document.getElementById('u4-ox-feedback');
    const u4OxResult = document.getElementById('u4-ox-result');
    const startU4OxBtn = document.getElementById('start-u4-ox-btn');
    const u4OxOBtn = document.getElementById('u4-ox-o-btn');
    const u4OxXBtn = document.getElementById('u4-ox-x-btn');

    let u4OxIndex = 0;
    let u4OxScore = 0;
    let u4OxQuestionsList = [];

    if (startU4OxBtn) startU4OxBtn.addEventListener('click', initU4OxGame);
    if (u4OxOBtn) u4OxOBtn.addEventListener('click', () => checkU4OxAnswer(true));
    if (u4OxXBtn) u4OxXBtn.addEventListener('click', () => checkU4OxAnswer(false));

    function initU4OxGame() {
        u4OxIndex = 0;
        u4OxScore = 0;
        u4OxQuestionsList = [...u4OxQuestions].sort(() => Math.random() - 0.5);
        if (u4OxResult) u4OxResult.classList.add('hidden');
        if (u4OxFeedback) u4OxFeedback.classList.remove('show', 'feedback-correct', 'feedback-wrong');
        if (startU4OxBtn) startU4OxBtn.classList.add('hidden');
        if (u4OxOBtn) u4OxOBtn.classList.remove('hidden');
        if (u4OxXBtn) u4OxXBtn.classList.remove('hidden');
        showNextU4OxQuestion();
        updateParrotSpeech("O야 X야? 동아시아 문화권 상식 퀴즈 시작! 🌸");
    }

    function showNextU4OxQuestion() {
        if (u4OxIndex >= u4OxQuestionsList.length) {
            endU4OxGame();
            return;
        }
        const q = u4OxQuestionsList[u4OxIndex];
        if (u4OxQuestionText) {
            u4OxQuestionText.innerHTML = `<span class="ox-progress">${u4OxIndex + 1}/${u4OxQuestionsList.length}</span><br>${q.q}`;
        }
        if (u4OxFeedback) u4OxFeedback.classList.remove('show', 'feedback-correct', 'feedback-wrong');
        if (u4OxOBtn) u4OxOBtn.disabled = false;
        if (u4OxXBtn) u4OxXBtn.disabled = false;
    }

    function checkU4OxAnswer(userAnswer) {
        const q = u4OxQuestionsList[u4OxIndex];
        const isCorrect = userAnswer === q.answer;
        if (u4OxOBtn) u4OxOBtn.disabled = true;
        if (u4OxXBtn) u4OxXBtn.disabled = true;
        if (isCorrect) {
            u4OxScore++;
            if (u4OxFeedback) {
                u4OxFeedback.textContent = `✅ 정답! ${userAnswer ? '⭕' : '❌'} - 훌륭해!`;
                u4OxFeedback.className = 'ox-feedback show feedback-correct';
            }
            updateParrotSpeech(`맞아! 동아시아 문화권 지식이 탄탄해! 🌸`);
        } else {
            if (u4OxFeedback) {
                u4OxFeedback.innerHTML = `❌ 아쉽! 정답은 <strong>${q.answer ? '⭕' : '❌'}</strong>이야!<br><small>💡 ${q.hint}</small>`;
                u4OxFeedback.className = 'ox-feedback show feedback-wrong';
            }
            updateParrotSpeech(`아쉽! 💡 ${q.hint}`);
        }
        u4OxIndex++;
        setTimeout(showNextU4OxQuestion, isCorrect ? 1800 : 4500);
    }

    function endU4OxGame() {
        if (u4OxOBtn) u4OxOBtn.classList.add('hidden');
        if (u4OxXBtn) u4OxXBtn.classList.add('hidden');
        if (u4OxResult) {
            u4OxResult.classList.remove('hidden');
            const total = u4OxQuestionsList.length;
            document.getElementById('u4-ox-score').textContent = u4OxScore;
            document.getElementById('u4-ox-total').textContent = total;
            let msg = '';
            if (u4OxScore === total) {
                msg = "완벽해! 동아시아 문화권의 모든 지식을 마스터했어! 🥇";
            } else if (u4OxScore >= Math.ceil(total * 0.7)) {
                msg = "훌륭해! 조금만 더 복습하면 완벽해질 거야! 🌸";
            } else {
                msg = "힘내! 카드와 분류기 게임을 다시 보고 재도전해봐! 🦜";
            }
            document.getElementById('u4-ox-msg').textContent = msg;
            updateParrotSpeech(`OX 퀴즈 완료! ${u4OxScore}/${total} 정답! ${msg}`);
        }
        if (startU4OxBtn) startU4OxBtn.classList.remove('hidden');
        addProgress('u4-oxGame');
    }

    // -----------------------------------------
    // 19. Unit 4 Final Quiz
    // -----------------------------------------
    const u4FinalQuestions = [
        {
            q: "위진남북조 시대에 귀족 관료를 선발하던 제도로, 가문 배경을 9등급으로 나누어 관직에 임명한 방식은?",
            options: ["과거제", "9품중정제", "골품제", "음서제"],
            correctIndex: 1,
            hint: "9품중정제는 위나라 조비가 만든 귀족 중심의 관리 선발 제도야. 가문이 좋아야 높은 관직에 갈 수 있었지!"
        },
        {
            q: "수나라가 강남의 풍부한 물자를 수도와 북쪽 변경으로 공급하기 위해 건설한 것으로, 남북을 연결한 대규모 수상 교통로는?",
            options: ["비단길(실크로드)", "왕의 길", "대운하", "경항대운하"],
            correctIndex: 2,
            hint: "수 양제가 만든 대운하는 황하와 양쯔강을 잇는 거대한 물길이야! 이것이 남북 경제 통합의 핵심이었단다!"
        },
        {
            q: "동아시아 문화권이 공통으로 수용한 4가지 요소로 올바르게 묶인 것은?",
            options: ["한자·도교·이슬람·율령", "한자·유교·불교·율령", "한자·유교·조로아스터교·율령", "한자·힌두교·불교·율령"],
            correctIndex: 1,
            hint: "동아시아 문화권의 4대 공통 요소는 한자, 유교, 불교, 율령이야! 이 4가지가 한국·일본·베트남 등에 전파됐단다!"
        },
        {
            q: "야마토 정권이 645년에 당나라 율령 제도를 모델로 하여 천황 중심의 중앙 집권 국가를 만들기 위해 실시한 개혁은?",
            options: ["다이카 개신", "메이지 유신", "태화 개혁", "대보 율령"],
            correctIndex: 0,
            hint: "다이카(大化)는 645년 야마토 정권이 당나라를 모델로 호족 세력을 억누르고 천황 권력을 강화한 개혁이야!"
        },
        {
            q: "고구려 유민과 말갈족을 이끌고 만주에 세워진 나라로, 선왕 때 최전성기를 누리며 '해동성국'이라 불린 국가는?",
            options: ["고구려", "발해", "부여", "옥저"],
            correctIndex: 1,
            hint: "대조영이 세운 발해는 고구려 문화를 계승하면서 당나라의 문물을 수용해 '바다 동쪽의 성스러운 나라(해동성국)'라 불렸단다!"
        }
    ];

    const u4QuizIntroView = document.getElementById('u4-quiz-intro');
    const u4QuizPlayView = document.getElementById('u4-quiz-play');
    const u4QuizResultView = document.getElementById('u4-quiz-result');
    const u4QuizQuestionText = document.getElementById('u4-quiz-question-text');
    const u4QuizOptionsContainer = document.getElementById('u4-quiz-options');
    const u4QuizCounterText = document.getElementById('u4-quiz-counter');
    const u4FinalTotalScore = document.getElementById('u4-final-score');
    const u4ResultMessage = document.getElementById('u4-result-message');
    const startU4QuizBtn = document.getElementById('start-u4-quiz-btn');

    if (startU4QuizBtn) {
        startU4QuizBtn.addEventListener('click', () => {
            state.u4CurrentQuizIndex = 0;
            state.u4QuizScore = 0;
            if (u4QuizIntroView) u4QuizIntroView.classList.add('hidden');
            if (u4QuizResultView) u4QuizResultView.classList.add('hidden');
            if (u4QuizPlayView) u4QuizPlayView.classList.remove('hidden');
            showU4FinalQuizQuestion();
            updateParrotSpeech("동아시아 문화권 최종 보스 퀴즈 시작! 5문제 모두 맞혀봐! 🏆");
        });
    }

    function showU4FinalQuizQuestion() {
        if (!u4QuizPlayView) return;
        if (state.u4CurrentQuizIndex < u4FinalQuestions.length) {
            const qData = u4FinalQuestions[state.u4CurrentQuizIndex];
            if (u4QuizCounterText) u4QuizCounterText.textContent = `${state.u4CurrentQuizIndex + 1} / ${u4FinalQuestions.length}`;
            if (u4QuizQuestionText) u4QuizQuestionText.textContent = qData.q;
            if (u4QuizOptionsContainer) u4QuizOptionsContainer.innerHTML = '';
            
            qData.options.forEach((opt, idx) => {
                const btn = document.createElement('button');
                btn.className = 'quiz-opt-btn';
                btn.textContent = opt;
                btn.addEventListener('click', () => selectU4QuizOption(idx));
                u4QuizOptionsContainer.appendChild(btn);
            });
        } else {
            showU4QuizResults();
        }
    }

    function selectU4QuizOption(userIndex) {
        const qData = u4FinalQuestions[state.u4CurrentQuizIndex];
        const isCorrect = userIndex === qData.correctIndex;
        const optionButtons = u4QuizOptionsContainer.querySelectorAll('.quiz-opt-btn');
        
        optionButtons.forEach(btn => btn.disabled = true);

        if (isCorrect) {
            state.u4QuizScore++;
            optionButtons[userIndex].classList.add('correct');
            updateParrotSpeech("정답이야! 짝짝짝! 동아시아 문화권 지식이 탄탄하구나! 🌸🎉");
            setParrotAvatar('happy');
        } else {
            optionButtons[userIndex].classList.add('wrong');
            optionButtons[qData.correctIndex].classList.add('correct');
            updateParrotSpeech(`아쉽다! 모찌 꿀팁: <br> ${qData.hint}`);
            setParrotAvatar('cheer');
        }
        state.u4CurrentQuizIndex++;
        setTimeout(showU4FinalQuizQuestion, isCorrect ? 1800 : 4000);
    }

    function showU4QuizResults() {
        if (u4QuizPlayView) u4QuizPlayView.classList.add('hidden');
        if (u4QuizResultView) u4QuizResultView.classList.remove('hidden');
        if (u4FinalTotalScore) u4FinalTotalScore.textContent = state.u4QuizScore;
        
        let messageText = "";
        if (state.u4QuizScore === 5) {
            messageText = "💯 완벽한 동아시아 문화권 마스터 탄생! 모찌가 벚꽃 둥지를 활짝 열어줄게! 한자·유교·불교·율령을 손바닥 보듯 꿰뚫는 역사 천재야! 🌸🥇";
            setParrotAvatar('happy');
        } else if (state.u4QuizScore >= 3) {
            messageText = "👍 훌륭해! 수·당의 통일 제국과 동아시아 문화권의 핵심을 잘 파악하고 있어! 틀린 것도 분류기와 OX로 한 번 더 다지면 완벽해질 거야! 🐉✨";
            setParrotAvatar('teacher');
        } else {
            messageText = "🦜 동아시아 역사가 아직 낯설어? 괜찮아! 위진남북조 분류기와 OX 퀴즈를 모찌와 함께 다시 하면 머리에 쏙쏙 들어올 거야! 다시 출발! 🚀";
            setParrotAvatar('cheer');
        }
        if (u4ResultMessage) u4ResultMessage.innerHTML = messageText;
        
        const today = new Date();
        const dateString = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
        document.querySelectorAll('.cert-date-span').forEach(el => el.textContent = dateString);

        addProgress('u4-finalQuiz');
    }

    // =========================================================================
    // 20. Unit 5 Game 1: 인도 굽타 왕조 OX 퀴즈
    // =========================================================================
    const u5G1Questions = [
        { q: "굽타 왕조는 국왕을 신격화하기 위해 민간 신앙, 불교, 브라만교가 결합한 힌두교를 전폭 후원했다.", answer: true, hint: "맞아! 굽타 왕조는 왕권 강화를 위해 힌두교를 장려했어. 힌두교는 다신교로 왕을 신의 화신으로 보았단다!" },
        { q: "카스트 제도에 따른 각 신분의 의무와 일상생활 규범을 담아 인도인의 일상생활 기준이 된 법전은 『바가바드 기타』이다.", answer: false, hint: "틀렸어! 힌두교인의 사회 규범과 의무가 적힌 것은 『마누 법전』이야! 마누라 잔소리처럼 꼼꼼하다고 암기해봐!" },
        { q: "굽타 양식은 헬레니즘 문화의 영향을 듬뿍 받아 그리스 조각풍의 곱슬머리와 얇은 옷자락이 특징이다.", answer: false, hint: "틀렸어! 그리스풍 조각은 쿠샨 왕조 때의 '간다라 양식'이야! 굽타 양식은 인도 순수 예술이 어우러진 부드럽고 우아한 양식이란다. 아잔타 석굴이 대표적이야!" },
        { q: "굽타 수학은 아무것도 없는 상태인 '0'의 개념을 도입하고 10진법을 완성해 훗날 아라비아 숫자의 기틀을 다졌다.", answer: true, hint: "맞아! 인도인들이 발견한 '0'의 개념과 10진법은 이슬람 세계를 거쳐 서유럽 자연과학 발전에 기여했단다!" }
    ];

    const u5G1QuestionText = document.getElementById('u5-g1-question-text');
    const u5G1Feedback = document.getElementById('u5-g1-feedback');
    const u5G1Result = document.getElementById('u5-g1-result');
    const startU5G1Btn = document.getElementById('start-u5-g1-btn');
    const u5G1OBtn = document.getElementById('u5-g1-o-btn');
    const u5G1XBtn = document.getElementById('u5-g1-x-btn');

    let u5G1Index = 0;
    let u5G1Score = 0;
    let u5G1QuestionsList = [];

    if (startU5G1Btn) startU5G1Btn.addEventListener('click', initU5G1Game);
    if (u5G1OBtn) u5G1OBtn.addEventListener('click', () => checkU5G1Answer(true));
    if (u5G1XBtn) u5G1XBtn.addEventListener('click', () => checkU5G1Answer(false));

    function initU5G1Game() {
        u5G1Index = 0;
        u5G1Score = 0;
        u5G1QuestionsList = [...u5G1Questions].sort(() => Math.random() - 0.5);
        if (u5G1Result) u5G1Result.classList.add('hidden');
        if (u5G1Feedback) u5G1Feedback.classList.remove('show', 'feedback-correct', 'feedback-wrong');
        if (startU5G1Btn) startU5G1Btn.classList.add('hidden');
        if (u5G1OBtn) u5G1OBtn.classList.remove('hidden');
        if (u5G1XBtn) u5G1XBtn.classList.remove('hidden');
        showNextU5G1Question();
        updateParrotSpeech("인도 굽타 시대와 힌두교 상식 퀴즈 시작! 🕉️");
    }

    function showNextU5G1Question() {
        if (u5G1Index >= u5G1QuestionsList.length) {
            endU5G1Game();
            return;
        }
        const q = u5G1QuestionsList[u5G1Index];
        if (u5G1QuestionText) {
            u5G1QuestionText.innerHTML = `<span class="ox-progress">${u5G1Index + 1}/${u5G1QuestionsList.length}</span><br>${q.q}`;
        }
        if (u5G1Feedback) u5G1Feedback.classList.remove('show', 'feedback-correct', 'feedback-wrong');
        if (u5G1OBtn) u5G1OBtn.disabled = false;
        if (u5G1XBtn) u5G1XBtn.disabled = false;
    }

    function checkU5G1Answer(userAnswer) {
        const q = u5G1QuestionsList[u5G1Index];
        const isCorrect = userAnswer === q.answer;
        if (u5G1OBtn) u5G1OBtn.disabled = true;
        if (u5G1XBtn) u5G1XBtn.disabled = true;
        if (isCorrect) {
            u5G1Score++;
            if (u5G1Feedback) {
                u5G1Feedback.textContent = `✅ 정답! ${userAnswer ? '⭕' : '❌'} - 대단해!`;
                u5G1Feedback.className = 'ox-feedback show feedback-correct';
            }
            updateParrotSpeech(`맞아! 굽타 시대와 힌두교 핵심 포인트를 잘 알고 있네! 🕉️`);
        } else {
            if (u5G1Feedback) {
                u5G1Feedback.innerHTML = `❌ 아쉽! 정답은 <strong>${q.answer ? '⭕' : '❌'}</strong>이야!<br><small>💡 ${q.hint}</small>`;
                u5G1Feedback.className = 'ox-feedback show feedback-wrong';
            }
            updateParrotSpeech(`아쉽! 💡 ${q.hint}`);
        }
        u5G1Index++;
        setTimeout(showNextU5G1Question, isCorrect ? 1800 : 4500);
    }

    function endU5G1Game() {
        if (u5G1OBtn) u5G1OBtn.classList.add('hidden');
        if (u5G1XBtn) u5G1XBtn.classList.add('hidden');
        if (u5G1Result) {
            u5G1Result.classList.remove('hidden');
            const total = u5G1QuestionsList.length;
            document.getElementById('u5-g1-score').textContent = u5G1Score;
            document.getElementById('u5-g1-total').textContent = total;
            let msg = '';
            if (u5G1Score === total) {
                msg = "완벽해! 굽타 왕조의 문화와 힌두교 법전 규율을 완벽히 정복했어! 🥇";
            } else if (u5G1Score >= 3) {
                msg = "훌륭해! 조금만 더 공부하면 만점도 식은 죽 먹기지! 🕉️";
            } else {
                msg = "괜찮아! 힌두교 법전과 산스크리트 카드를 뒹굴뒹굴 다시 읽고 도전하자! 🦜";
            }
            document.getElementById('u5-g1-msg').textContent = msg;
            updateParrotSpeech(`OX 퀴즈 완료! ${u5G1Score}/${total} 정답! ${msg}`);
        }
        if (startU5G1Btn) startU5G1Btn.classList.remove('hidden');
        addProgress('u5-game1');
    }

    // =========================================================================
    // 21. Unit 5 Game 2: 우마이야 왕조 vs 아바스 왕조 성격 분류기
    // =========================================================================
    const u5G2SortingItems = [
        { text: "다마스쿠스 수도", answer: "우마이야", hint: "우마이야 왕조의 수도는 시리아의 다마스쿠스야!" },
        { text: "바그다드 수도", answer: "아바스", hint: "아바스 왕조의 수도는 '평화의 도시' 바그다드란다!" },
        { text: "아랍인 제일주의 (비아랍인 개종자 차별)", answer: "우마이야", hint: "우마이야는 아랍인만 세금을 면제해주고 관직을 독점하는 등 차별이 심했어!" },
        { text: "다민족 국제 제국 (차별 철폐, 세금 면제)", answer: "아바스", hint: "아바스는 비아랍인 개종자도 세금을 깎아주고 공용어를 아랍어로 쓰게 하며 평등을 추구했지!" },
        { text: "탈라스 전투(751년) 승리", answer: "아바스", hint: "아바스 왕조는 당나라와의 탈라스 전투에서 이겨 비단길 무역권을 먹고 제지술(종이)을 들여왔어!" },
        { text: "이베리아 반도(스페인)까지 최대 영토 개척", answer: "우마이야", hint: "우마이야 왕조는 서쪽으로 나아가 이베리아 반도까지 지배하는 초거대 영토를 일구었어!" },
        { text: "학문소 '지혜의 집(바이트 알히크마)' 건립", answer: "아바스", hint: "아바스 왕조는 바그다드에 '지혜의 집'을 지어 고대 그리스와 인도 책을 아랍어로 번역해 보존했단다!" },
        { text: "이슬람 제국의 기틀 형성", answer: "우마이야", hint: "세습 왕조를 최초로 개척해 대제국의 영토 기틀을 닦았단다!" }
    ];

    const u5G2GameContainer = document.getElementById('u5-g2-game-container');
    const u5G2Feedback = document.getElementById('u5-g2-feedback');
    const u5G2Result = document.getElementById('u5-g2-result');
    const startU5G2Btn = document.getElementById('start-u5-g2-btn');

    let u5G2SortCorrect = 0;
    let u5G2SortItems = [];
    let u5G2CurrentSortIdx = 0;

    if (startU5G2Btn) startU5G2Btn.addEventListener('click', initU5G2SortingGame);

    function initU5G2SortingGame() {
        u5G2SortCorrect = 0;
        u5G2CurrentSortIdx = 0;
        u5G2SortItems = [...u5G2SortingItems].sort(() => Math.random() - 0.5);
        if (u5G2Feedback) u5G2Feedback.classList.remove('show', 'feedback-correct', 'feedback-wrong');
        if (u5G2Result) u5G2Result.classList.add('hidden');
        if (startU5G2Btn) startU5G2Btn.classList.add('hidden');
        renderU5G2SortItem();
        updateParrotSpeech("이 사실이 우마이야 왕조야, 아바스 왕조야? 알맞게 정렬해봐! 🧩");
    }

    function renderU5G2SortItem() {
        if (!u5G2GameContainer) return;
        if (u5G2CurrentSortIdx >= u5G2SortItems.length) {
            endU5G2SortingGame();
            return;
        }
        const item = u5G2SortItems[u5G2CurrentSortIdx];
        u5G2GameContainer.innerHTML = `
            <div class="sort-item-card">
                <p class="sort-item-text">📜 ${item.text}</p>
                <div class="sort-buttons">
                    <button class="sort-btn sort-btn-a" id="u5-g2-btn-umaiyya">🐫 우마이야</button>
                    <button class="sort-btn sort-btn-b" id="u5-g2-btn-abbas">🕌 아바스</button>
                </div>
                <p class="sort-progress">📌 ${u5G2CurrentSortIdx + 1} / ${u5G2SortItems.length}</p>
            </div>
        `;
        document.getElementById('u5-g2-btn-umaiyya').addEventListener('click', () => checkU5G2Sort('우마이야'));
        document.getElementById('u5-g2-btn-abbas').addEventListener('click', () => checkU5G2Sort('아바스'));
    }

    function checkU5G2Sort(answer) {
        const item = u5G2SortItems[u5G2CurrentSortIdx];
        const isCorrect = answer === item.answer;
        const btns = u5G2GameContainer.querySelectorAll('.sort-btn');
        btns.forEach(b => b.disabled = true);
        if (isCorrect) {
            u5G2SortCorrect++;
            if (u5G2Feedback) {
                u5G2Feedback.textContent = "✅ 정답! 모찌가 칭찬할게!";
                u5G2Feedback.className = 'sorting-feedback show feedback-correct';
            }
            updateParrotSpeech(`정답! ${item.text} - 분류를 잘 마쳤네! 🕌`);
        } else {
            if (u5G2Feedback) {
                u5G2Feedback.innerHTML = `❌ 아쉽! 정답은 <strong>${item.answer === '우마이야' ? '🐫 우마이야' : '🕌 아바스'}</strong>야!<br><small>${item.hint}</small>`;
                u5G2Feedback.className = 'sorting-feedback show feedback-wrong';
            }
            updateParrotSpeech(`아쉽! 🦜 ${item.hint}`);
        }
        u5G2CurrentSortIdx++;
        setTimeout(renderU5G2SortItem, isCorrect ? 1800 : 4000);
    }

    function endU5G2SortingGame() {
        if (!u5G2GameContainer) return;
        u5G2GameContainer.innerHTML = '';
        if (u5G2Feedback) u5G2Feedback.classList.remove('show');
        if (u5G2Result) {
            u5G2Result.classList.remove('hidden');
            const total = u5G2SortItems.length;
            document.getElementById('u5-g2-score').textContent = u5G2SortCorrect;
            document.getElementById('u5-g2-total').textContent = total;
            let msg = '';
            if (u5G2SortCorrect === total) {
                msg = "완벽해! 이슬람 두 왕조의 성격을 완벽히 파악했어! 🥇";
            } else if (u5G2SortCorrect >= 6) {
                msg = "아주 훌륭해! 두 왕조의 수도와 차별 정책을 잘 나누는구나! 🕌";
            } else {
                msg = "조금 더 분발해보자! 아랍 차별(우마이야)과 다민족 조화(아바스)를 기억해! 🐫";
            }
            document.getElementById('u5-g2-msg').textContent = msg;
            updateParrotSpeech(`분류 게임 완료! ${u5G2SortCorrect}/${total} 정답! ${msg}`);
        }
        if (startU5G2Btn) startU5G2Btn.classList.remove('hidden');
        
        // Progress trigger
        addProgress('u5-game2');
        addProgress('u5-readCh2');
    }

    // =========================================================================
    // 22. Unit 5 Game 3: 프랑크 왕국 vs 비잔티움 제국 업적 분류기
    // =========================================================================
    const u5G3Items = [
        { text: "클로비스의 가톨릭 개종", answer: "frank", hint: "클로비스는 로마 가톨릭교로 개종하여 원주민들과 교회의 신임을 얻었지!" },
        { text: "성 소피아 대성당 건립", answer: "byz", hint: "비잔티움 제국의 상징인 거대한 돔형 성 소피아 대성당을 지었단다!" },
        { text: "카롤루스 대제의 서로마 황제 대관(800년)", answer: "frank", hint: "서로마 교황이 카롤루스에게 황제관을 주어 서유럽 문화의 틀이 잡혔지!" },
        { text: "유스티니아누스 법전 편찬", answer: "byz", hint: "고대 로마법을 체계적으로 묶어 유스티니아누스 법전을 냈단다!" },
        { text: "황제가 교회 수장을 겸하는 황제 교황주의", answer: "byz", hint: "비잔티움은 서유럽 교황의 말을 듣지 않고 황제가 종교 우두머리까지 겸했지!" },
        { text: "로마 문화 + 크리스트교 + 게르만 문화의 융합", answer: "frank", hint: "카롤루스 대제 시절 완성된 서유럽 문화의 3대 핵심 뼈대란다!" }
    ];

    const u5G3CardDisplay = document.getElementById('sorting-card-u5-3');
    const u5G3ItemText = document.getElementById('sorting-item-u5-3-text');
    const u5G3ScoreVal = document.getElementById('sorting-score-u5-3-val');
    const u5G3Feedback = document.getElementById('u5-game3-feedback');
    const startU5G3Btn = document.getElementById('start-game-u5-3-btn');
    const btnU53Frank = document.getElementById('btn-u5-3-frank');
    const btnU53Byz = document.getElementById('btn-u5-3-byz');

    let u5G3Correct = 0;
    let u5G3Index = 0;
    let u5G3QuestionsList = [];

    if (startU5G3Btn) startU5G3Btn.addEventListener('click', initU5G3Game);
    if (btnU53Frank) btnU53Frank.addEventListener('click', () => checkU5G3Answer('frank'));
    if (btnU53Byz) btnU53Byz.addEventListener('click', () => checkU5G3Answer('byz'));

    function initU5G3Game() {
        u5G3Correct = 0;
        u5G3Index = 0;
        u5G3QuestionsList = [...u5G3Items].sort(() => Math.random() - 0.5);
        if (u5G3Feedback) u5G3Feedback.classList.remove('show', 'feedback-correct', 'feedback-wrong');
        if (startU5G3Btn) startU5G3Btn.classList.add('hidden');
        if (u5G3ScoreVal) u5G3ScoreVal.textContent = "0";
        showNextU5G3Item();
        updateParrotSpeech("프랑크 왕국과 비잔티움 제국 업적 매칭 시작! ⚔️");
    }

    function showNextU5G3Item() {
        if (u5G3Index >= u5G3QuestionsList.length) {
            endU5G3Game();
            return;
        }
        const item = u5G3QuestionsList[u5G3Index];
        if (u5G3ItemText) u5G3ItemText.textContent = item.text;
        if (u5G3Feedback) u5G3Feedback.classList.remove('show', 'feedback-correct', 'feedback-wrong');
        if (btnU53Frank) btnU53Frank.disabled = false;
        if (btnU53Byz) btnU53Byz.disabled = false;
    }

    function checkU5G3Answer(userAnswer) {
        const item = u5G3QuestionsList[u5G3Index];
        const isCorrect = userAnswer === item.answer;
        if (btnU53Frank) btnU53Frank.disabled = true;
        if (btnU53Byz) btnU53Byz.disabled = true;

        if (isCorrect) {
            u5G3Correct++;
            if (u5G3ScoreVal) u5G3ScoreVal.textContent = u5G3Correct;
            if (u5G3Feedback) {
                u5G3Feedback.textContent = "✅ 정답! 모찌가 신났어!";
                u5G3Feedback.className = 'game-feedback show feedback-correct';
            }
            updateParrotSpeech("정답이야! 서로마와 동로마(비잔티움)의 다른 역사를 잘 꿰뚫었네! 🏰");
        } else {
            if (u5G3Feedback) {
                u5G3Feedback.innerHTML = `❌ 아쉽! 정답은 <strong>${item.answer === 'frank' ? '🛡️ 프랑크 왕국' : '🏛️ 비잔티움 제국'}</strong>이야!<br><small>${item.hint}</small>`;
                u5G3Feedback.className = 'game-feedback show feedback-wrong';
            }
            updateParrotSpeech(`아쉽! 🦜 ${item.hint}`);
        }
        u5G3Index++;
        setTimeout(showNextU5G3Item, isCorrect ? 1800 : 4000);
    }

    function endU5G3Game() {
        if (u5G3ItemText) u5G3ItemText.textContent = "분류 종료! 결과를 아래에서 확인해!";
        if (u5G3Feedback) {
            u5G3Feedback.innerHTML = `🎉 프랑크 vs 비잔티움 분류 완료! ${u5G3Correct}/6점 획득!`;
            u5G3Feedback.className = 'game-feedback show feedback-correct';
        }
        if (startU5G3Btn) startU5G3Btn.classList.remove('hidden');
        
        // Progress trigger
        addProgress('u5-game3');
        addProgress('u5-readCh3');
    }

    // =========================================================================
    // 23. Unit 5 Final Quiz
    // =========================================================================
    const u5FinalQuestions = [
        {
            q: "굽타 왕조 시대에 브라만교를 기반으로 불교와 인도 민간 신앙이 결합하여 성립한 종교는?",
            options: ["불교", "힌두교", "이슬람교", "자이나교"],
            correctIndex: 1,
            hint: "힌두교는 굽타 왕조의 후원을 받으며 인도 고유의 다신교로 성장했단다!"
        },
        {
            q: "이슬람교에서 무함마드가 메카 상인들의 박해를 피해 메디나로 피신한 사건(622년)으로 이슬람력의 원년이 된 사건은?",
            options: ["헤지라", "카노사의 굴욕", "대이동", "아비뇽 유배"],
            correctIndex: 0,
            hint: "헤지라(Hegira)는 이슬람 공동체의 성장을 알리는 출발점이야!"
        },
        {
            q: "아바스 왕조가 당나라와의 이 전투(751년)에서 승리하여 동서 교역로를 장악하고 제지술(종이 만드는 법)을 수입한 사건은?",
            options: ["살라미스 해전", "탈라스 전투", "백년 전쟁", "포에니 전쟁"],
            correctIndex: 1,
            hint: "탈라스 전투 승리로 이슬람이 중앙아시아 무역을 쥐고 당나라 제지 기술자를 통해 종이를 서양에 알리게 되었어!"
        },
        {
            q: "800년 교황 레오 3세로부터 서로마 황제의 관을 받아 로마 문화, 크리스트교, 게르만 요소를 융합해 서유럽 문화의 틀을 만든 프랑크 왕국의 국왕은?",
            options: ["클로비스", "카롤루스 대제", "유스티니아누스 대제", "하인리히 4세"],
            correctIndex: 1,
            hint: "카롤루스 대제는 서유럽 문화권의 아버지로 불린단다!"
        },
        {
            q: "비잔티움 제국(동로마)의 6세기 황제로, 옛 로마 영토를 대부분 회복하고 『로마법 대전』 편찬과 성 소피아 대성당을 지은 황제는?",
            options: ["콘스탄티누스 대제", "옥타비아누스", "유스티니아누스 대제", "다리우스 1세"],
            correctIndex: 2,
            hint: "유스티니아누스 대제는 1000년 비잔티움 제국의 최고 전성기를 이끌었어!"
        }
    ];

    const u5QuizIntroView = document.getElementById('u5-quiz-intro');
    const u5QuizPlayView = document.getElementById('u5-quiz-play');
    const u5QuizResultView = document.getElementById('u5-quiz-result');
    const u5QuizQuestionText = document.getElementById('u5-quiz-question-text');
    const u5QuizOptionsContainer = document.getElementById('u5-quiz-options');
    const u5QuizCounterText = document.getElementById('u5-quiz-counter');
    const u5FinalTotalScore = document.getElementById('u5-final-score');
    const u5ResultMessage = document.getElementById('u5-result-message');
    const startU5QuizBtn = document.getElementById('start-u5-quiz-btn');

    if (startU5QuizBtn) {
        startU5QuizBtn.addEventListener('click', () => {
            state.u5CurrentQuizIndex = 0;
            state.u5QuizScore = 0;
            if (u5QuizIntroView) u5QuizIntroView.classList.add('hidden');
            if (u5QuizResultView) u5QuizResultView.classList.add('hidden');
            if (u5QuizPlayView) u5QuizPlayView.classList.remove('hidden');
            showU5FinalQuizQuestion();
            updateParrotSpeech("인도·서아시아·지중해 최종 퀴즈 시작! 5문제 모두 맞혀봐! 🐫🕌");
        });
    }

    function showU5FinalQuizQuestion() {
        if (!u5QuizPlayView) return;
        if (state.u5CurrentQuizIndex < u5FinalQuestions.length) {
            const qData = u5FinalQuestions[state.u5CurrentQuizIndex];
            if (u5QuizCounterText) u5QuizCounterText.textContent = `${state.u5CurrentQuizIndex + 1} / ${u5FinalQuestions.length}`;
            if (u5QuizQuestionText) u5QuizQuestionText.textContent = qData.q;
            if (u5QuizOptionsContainer) u5QuizOptionsContainer.innerHTML = '';
            
            qData.options.forEach((opt, idx) => {
                const btn = document.createElement('button');
                btn.className = 'quiz-opt-btn';
                btn.textContent = opt;
                btn.addEventListener('click', () => selectU5QuizOption(idx));
                u5QuizOptionsContainer.appendChild(btn);
            });
        } else {
            showU5QuizResults();
        }
    }

    function selectU5QuizOption(userIndex) {
        const qData = u5FinalQuestions[state.u5CurrentQuizIndex];
        const isCorrect = userIndex === qData.correctIndex;
        const optionButtons = u5QuizOptionsContainer.querySelectorAll('.quiz-opt-btn');
        
        optionButtons.forEach(btn => btn.disabled = true);

        if (isCorrect) {
            state.u5QuizScore++;
            optionButtons[userIndex].classList.add('correct');
            updateParrotSpeech("정답이야! 짝짝짝! 힌두교와 이슬람 지식이 대단해! 🐫🎉");
            setParrotAvatar('happy');
        } else {
            optionButtons[userIndex].classList.add('wrong');
            optionButtons[qData.correctIndex].classList.add('correct');
            updateParrotSpeech(`아쉽다! 모찌 꿀팁: <br> ${qData.hint}`);
            setParrotAvatar('cheer');
        }
        state.u5CurrentQuizIndex++;
        setTimeout(showU5FinalQuizQuestion, isCorrect ? 1800 : 4000);
    }

    function showU5QuizResults() {
        if (u5QuizPlayView) u5QuizPlayView.classList.add('hidden');
        if (u5QuizResultView) u5QuizResultView.classList.remove('hidden');
        if (u5FinalTotalScore) u5FinalTotalScore.textContent = state.u5QuizScore;
        
        let messageText = "";
        if (state.u5QuizScore === 5) {
            messageText = "💯 완벽한 인도·서아시아·지중해 마스터 탄생! 모찌가 사막 둥지의 모든 해바라기씨를 줄게! 힌두교의 굽타와 이슬람 번영기, 서로마 멸망 역사를 모두 꿰뚫는 역사 장인이야! 🐫🥇";
            setParrotAvatar('happy');
        } else if (state.u5QuizScore >= 3) {
            messageText = "👍 훌륭해! 이슬람 두 제국과 프랑크 왕국, 굽타 수학 유산을 잘 이해하고 있어! 틀린 것도 분류기와 OX로 다시 확인해보자! 🕌✨";
            setParrotAvatar('teacher');
        } else {
            messageText = "🦜 역사가 아직 어렵니? 걱정마! 프랑크 왕국 분류기와 인도 OX 퀴즈를 모찌와 다시 차분히 풀어보면 금방 기억날 거야! 🚀";
            setParrotAvatar('cheer');
        }
        if (u5ResultMessage) u5ResultMessage.innerHTML = messageText;
        
        const today = new Date();
        const dateString = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
        document.querySelectorAll('.cert-date-span').forEach(el => el.textContent = dateString);

        addProgress('u5-finalQuiz');
    }

    // =========================================================================
    // 24. Unit 6 Game 1: 중세 봉건제 & 서임권 OX 퀴즈
    // =========================================================================
    const u6G1Questions = [
        { q: "중세 봉건제의 주종 관계는 영주와 신하가 토지를 매개로 맺은 쌍무적 계약 관계로, 한쪽이 약속을 어기면 파기될 수 있었다.", answer: true, hint: "맞아! 동양의 수직적 충성 관계와 달리 서양 봉건제는 서로 의무를 지는 쌍무적 계약 관계였어!" },
        { q: "장원의 농노는 고대 노예와 완전히 똑같아서 결혼할 수 없었고 개인 재산을 전혀 모을 수 없었다.", answer: false, hint: "틀렸어! 농노는 가정을 이룰 수 있고 재산도 모을 수 있었지만, 거주 이전의 자유가 없어 영주의 땅에 묶여 살았단다!" },
        { q: "카노사의 굴욕 사건에서 교황 그레고리우스 7세가 황제 하인리히 4세에게 굴복하여 황제권이 교회보다 세졌다.", answer: false, hint: "틀렸어! 황제가 교황에게 굴복하고 용서를 구한 사건으로 교황권이 황제권 위에 우뚝 섰음을 보여준 사건이야!" },
        { q: "중세 서유럽은 크리스트교가 중심이 되어 학문은 신학 위주로 발달했으며, 철학은 '신학의 시녀'로 불렸다.", answer: true, hint: "맞아! 신의 뜻을 탐구하는 신학이 왕이었고, 인간 이성의 철학은 신학을 설명하기 위한 도구(시녀)에 불과했단다!" },
        { q: "고딕 양식 성당은 거대한 돔과 두꺼운 벽이 특징이며, 내부 벽면에 알록달록한 모자이크화를 빼곡히 채웠다.", answer: false, hint: "틀렸어! 높은 첨탑과 오색빛깔 '스테인드글라스' 유리창이 고딕 양식의 매력이야! 돔과 모자이크는 비잔티움 양식의 특징이란다!" }
    ];

    const u6G1QuestionText = document.getElementById('u6-g1-question-text');
    const u6G1Feedback = document.getElementById('u6-g1-feedback');
    const u6G1Result = document.getElementById('u6-g1-result');
    const startU6G1Btn = document.getElementById('start-u6-g1-btn');
    const u6G1OBtn = document.getElementById('u6-g1-o-btn');
    const u6G1XBtn = document.getElementById('u6-g1-x-btn');

    let u6G1Index = 0;
    let u6G1Score = 0;
    let u6G1QuestionsList = [];

    if (startU6G1Btn) startU6G1Btn.addEventListener('click', initU6G1Game);
    if (u6G1OBtn) u6G1OBtn.addEventListener('click', () => checkU6G1Answer(true));
    if (u6G1XBtn) u6G1XBtn.addEventListener('click', () => checkU6G1Answer(false));

    function initU6G1Game() {
        u6G1Index = 0;
        u6G1Score = 0;
        u6G1QuestionsList = [...u6G1Questions].sort(() => Math.random() - 0.5);
        if (u6G1Result) u6G1Result.classList.add('hidden');
        if (u6G1Feedback) u6G1Feedback.classList.remove('show', 'feedback-correct', 'feedback-wrong');
        if (startU6G1Btn) startU6G1Btn.classList.add('hidden');
        if (u6G1OBtn) u6G1OBtn.classList.remove('hidden');
        if (u6G1XBtn) u6G1XBtn.classList.remove('hidden');
        showNextU6G1Question();
        updateParrotSpeech("중세 봉건 사회와 교회 관련 OX 퀴즈 시작! ⛪");
    }

    function showNextU6G1Question() {
        if (u6G1Index >= u6G1QuestionsList.length) {
            endU6G1Game();
            return;
        }
        const q = u6G1QuestionsList[u6G1Index];
        if (u6G1QuestionText) {
            u6G1QuestionText.innerHTML = `<span class="ox-progress">${u6G1Index + 1}/${u6G1QuestionsList.length}</span><br>${q.q}`;
        }
        if (u6G1Feedback) u6G1Feedback.classList.remove('show', 'feedback-correct', 'feedback-wrong');
        if (u6G1OBtn) u6G1OBtn.disabled = false;
        if (u6G1XBtn) u6G1XBtn.disabled = false;
    }

    function checkU6G1Answer(userAnswer) {
        const q = u6G1QuestionsList[u6G1Index];
        const isCorrect = userAnswer === q.answer;
        if (u6G1OBtn) u6G1OBtn.disabled = true;
        if (u6G1XBtn) u6G1XBtn.disabled = true;
        if (isCorrect) {
            u6G1Score++;
            if (u6G1Feedback) {
                u6G1Feedback.textContent = `✅ 정답! ${userAnswer ? '⭕' : '❌'} - 중세 역사 천재!`;
                u6G1Feedback.className = 'ox-feedback show feedback-correct';
            }
            updateParrotSpeech(`정답! 쌍무적 계약과 장원의 뼈대를 확실히 아는구나! ⛪`);
        } else {
            if (u6G1Feedback) {
                u6G1Feedback.innerHTML = `❌ 아쉽! 정답은 <strong>${q.answer ? '⭕' : '❌'}</strong>이야!<br><small>💡 ${q.hint}</small>`;
                u6G1Feedback.className = 'ox-feedback show feedback-wrong';
            }
            updateParrotSpeech(`아쉽! 💡 ${q.hint}`);
        }
        u6G1Index++;
        setTimeout(showNextU6G1Question, isCorrect ? 1800 : 4500);
    }

    function endU6G1Game() {
        if (u6G1OBtn) u6G1OBtn.classList.add('hidden');
        if (u6G1XBtn) u6G1XBtn.classList.add('hidden');
        if (u6G1Result) {
            u6G1Result.classList.remove('hidden');
            const total = u6G1QuestionsList.length;
            document.getElementById('u6-g1-score').textContent = u6G1Score;
            document.getElementById('u6-g1-total').textContent = total;
            let msg = '';
            if (u6G1Score === total) {
                msg = "완벽해! 중세 봉건제와 교황권 역사를 완전히 마스터했어! 🥇";
            } else if (u6G1Score >= 3) {
                msg = "훌륭해! 조금만 더 하면 중세 가톨릭 문화의 전설이 될 수 있어! ⛪";
            } else {
                msg = "괜찮아! 카노사의 굴욕과 농노 지위 카드를 다시 보고 재도전하자! 🚜";
            }
            document.getElementById('u6-g1-msg').textContent = msg;
            updateParrotSpeech(`OX 퀴즈 완료! ${u6G1Score}/${total} 정답! ${msg}`);
        }
        if (startU6G1Btn) startU6G1Btn.classList.remove('hidden');
        addProgress('u6-game1');
    }

    // =========================================================================
    // 25. Unit 6 Game 2: 중세 말 사회 변화 분류기 (십자군 전쟁 이전 vs 이후)
    // =========================================================================
    const u6G2SortingItems = [
        { text: "교황권의 절정 및 카노사의 굴욕", answer: "이전", hint: "십자군 전쟁 전에는 교황의 힘이 황제를 누를 만큼 강력했단다!" },
        { text: "십자군 전쟁 실패로 교황권과 영주 세력의 쇠퇴", answer: "이후", hint: "원정이 실패하면서 교황의 권위와 기사(영주)들의 군사력이 몰락했어!" },
        { text: "폐쇄적인 자급자족 농경 장원 경제 중심", answer: "이전", hint: "도시 상업이 발달하기 전에는 장원 안에서 자급자족하며 살았단다!" },
        { text: "흑사병(페스트) 유행으로 농민 인구 급감", answer: "이후", hint: "14세기 흑사병이 돌아 인구의 3분의 1이 숨지자 노동력이 귀해졌어!" },
        { text: "도시 상인들과 장인들의 독점 동업 조합 '길드' 결성", answer: "이후", hint: "도시가 번창하면서 이익 보호를 위해 '길드' 조합이 똘똘 뭉쳤어!" },
        { text: "노동력 부족으로 농노 해방 및 지대 화폐화 가속", answer: "이후", hint: "농민 인구가 부족해지자 영주들이 농민 처우를 개선해주고 농노에서 해방해줬어!" },
        { text: "교황을 프랑스로 체포한 아비뇽 유배 및 교회 분열", answer: "이후", hint: "왕권이 세진 프랑스 국왕이 교황청을 아비뇽으로 옮겨 가둔 사건이야!" },
        { text: "영국과 프랑스의 백년 전쟁 및 왕 중심의 집권 국가 등장", answer: "이후", hint: "영·프 영토 다툼 속에 잔 다르크가 활약했고, 국왕 권력이 극대화됐지!" }
    ];

    const u6G2GameContainer = document.getElementById('u6-g2-game-container');
    const u6G2Feedback = document.getElementById('u6-g2-feedback');
    const u6G2Result = document.getElementById('u6-g2-result');
    const startU6G2Btn = document.getElementById('start-u6-g2-btn');

    let u6G2SortCorrect = 0;
    let u6G2SortItems = [];
    let u6G2CurrentSortIdx = 0;

    if (startU6G2Btn) startU6G2Btn.addEventListener('click', initU6G2SortingGame);

    function initU6G2SortingGame() {
        u6G2SortCorrect = 0;
        u6G2CurrentSortIdx = 0;
        u6G2SortItems = [...u6G2SortingItems].sort(() => Math.random() - 0.5);
        if (u6G2Feedback) u6G2Feedback.classList.remove('show', 'feedback-correct', 'feedback-wrong');
        if (u6G2Result) u6G2Result.classList.add('hidden');
        if (startU6G2Btn) startU6G2Btn.classList.add('hidden');
        renderU6G2SortItem();
        updateParrotSpeech("이 역사적 사실이 십자군 전쟁 이전이야, 이후야? 잘 정렬해봐! 🧩");
    }

    function renderU6G2SortItem() {
        if (!u6G2GameContainer) return;
        if (u6G2CurrentSortIdx >= u6G2SortItems.length) {
            endU6G2SortingGame();
            return;
        }
        const item = u6G2SortItems[u6G2CurrentSortIdx];
        u6G2GameContainer.innerHTML = `
            <div class="sort-item-card">
                <p class="sort-item-text">📜 ${item.text}</p>
                <div class="sort-buttons">
                    <button class="sort-btn sort-btn-a" id="u6-g2-btn-before">⛪ 십자군 이전</button>
                    <button class="sort-btn sort-btn-b" id="u6-g2-btn-after">⚔️ 십자군 이후</button>
                </div>
                <p class="sort-progress">📌 ${u6G2CurrentSortIdx + 1} / ${u6G2SortItems.length}</p>
            </div>
        `;
        document.getElementById('u6-g2-btn-before').addEventListener('click', () => checkU6G2Sort('이전'));
        document.getElementById('u6-g2-btn-after').addEventListener('click', () => checkU6G2Sort('이후'));
    }

    function checkU6G2Sort(answer) {
        const item = u6G2SortItems[u6G2CurrentSortIdx];
        const isCorrect = answer === item.answer;
        const btns = u6G2GameContainer.querySelectorAll('.sort-btn');
        btns.forEach(b => b.disabled = true);
        if (isCorrect) {
            u6G2SortCorrect++;
            if (u6G2Feedback) {
                u6G2Feedback.textContent = "✅ 정답! 모찌 기분 굿!";
                u6G2Feedback.className = 'sorting-feedback show feedback-correct';
            }
            updateParrotSpeech(`정답! ${item.text} - 정확하게 분류했어! ⚔️`);
        } else {
            if (u6G2Feedback) {
                u6G2Feedback.innerHTML = `❌ 아쉽! 정답은 <strong>${item.answer === '이전' ? '⛪ 십자군 이전' : '⚔️ 십자군 이후'}</strong>이야!<br><small>${item.hint}</small>`;
                u6G2Feedback.className = 'sorting-feedback show feedback-wrong';
            }
            updateParrotSpeech(`아쉽! 🦜 ${item.hint}`);
        }
        u6G2CurrentSortIdx++;
        setTimeout(renderU6G2SortItem, isCorrect ? 1800 : 4000);
    }

    function endU6G2SortingGame() {
        if (!u6G2GameContainer) return;
        u6G2GameContainer.innerHTML = '';
        if (u6G2Feedback) u6G2Feedback.classList.remove('show');
        if (u6G2Result) {
            u6G2Result.classList.remove('hidden');
            const total = u6G2SortItems.length;
            document.getElementById('u6-g2-score').textContent = u6G2SortCorrect;
            document.getElementById('u6-g2-total').textContent = total;
            let msg = '';
            if (u6G2SortCorrect === total) {
                msg = "완벽해! 중세 말기 교황권의 실락과 흑사병에 의한 농민들의 성장을 완벽히 분류했어! 🥇";
            } else if (u6G2SortCorrect >= 6) {
                msg = "훌륭해! 중세 말기 붕괴의 역사를 깊이 이해하고 있구나! 🏰";
            } else {
                msg = "조금만 더 복습해볼까? 십자군 실패와 흑사병이 봉건제를 무너뜨린 핵심이야! 🦠";
            }
            document.getElementById('u6-g2-msg').textContent = msg;
            updateParrotSpeech(`분류 게임 완료! ${u6G2SortCorrect}/${total} 정답! ${msg}`);
        }
        if (startU6G2Btn) startU6G2Btn.classList.remove('hidden');
        
        // Progress trigger
        addProgress('u6-game2');
        addProgress('u6-readCh2');
    }

    // =========================================================================
    // 26. Unit 6 Final Quiz
    // =========================================================================
    const u6FinalQuestions = [
        {
            q: "중세 서유럽 봉건 지배층 사이에 맺어진 토지 매개의 관계로, 상호 계약적이며 한쪽이 약속을 어기면 깨질 수 있었던 관계는?",
            options: ["주종 관계(쌍무적 계약)", "부자 관계", "군신 관계", "카스트 제도"],
            correctIndex: 0,
            hint: "서양 봉건제는 주군과 봉신이 상호간의 의무를 약속한 계약적 주종 관계야!"
        },
        {
            q: "중세 장원 사회에서 농가와 재산을 소유하고 결혼은 할 수 있었으나, 거주 이전의 자유가 없어 토지에 묶인 소작인은?",
            options: ["자영 농민", "농노", "노예", "평민"],
            correctIndex: 1,
            hint: "농노는 농민과 노예의 성격을 모두 가진 중세 장원의 핵심 노동자란다!"
        },
        {
            q: "성직 서임권을 둘러싸고 교황과 대립하다 파문당한 신성로마 황제 하인리히 4세가 교황에게 용서를 구한 1077년의 사건은?",
            options: ["카노사의 굴욕", "아비뇽 유배", "십자군 전쟁", "다이카 개신"],
            correctIndex: 0,
            hint: "하인리히 4세가 눈 내리는 카노사 성문 밖에서 3일 동안 빌며 사죄한 사건이야!"
        },
        {
            q: "예루살렘 성지를 회복하고자 11~13세기 교황 우르바누스 2세의 제창으로 결성되어 동방 원정을 떠났으나 결국 실패한 전쟁은?",
            options: ["탈라스 전투", "백년 전쟁", "십자군 전쟁", "페르시아 전쟁"],
            correctIndex: 2,
            hint: "성지 수복은 실패했으나, 동서 무역을 촉진하고 교황·영주가 쇠퇴하는 큰 계기가 되었어!"
        },
        {
            q: "14세기 유라시아와 유럽을 강타해 인구의 3분의 1을 숨지게 함으로써 농민 처우 개선과 농노 해방, 봉건 장원 붕괴를 초래한 병은?",
            options: ["흑사병(페스트)", "장티푸스", "콜레라", "인플루엔자"],
            correctIndex: 0,
            hint: "흑사병으로 노동 인구가 크게 줄어들어 신분 구속력이 급속도로 깨졌단다!"
        }
    ];

    const u6QuizIntroView = document.getElementById('u6-quiz-intro');
    const u6QuizPlayView = document.getElementById('u6-quiz-play');
    const u6QuizResultView = document.getElementById('u6-quiz-result');
    const u6QuizQuestionText = document.getElementById('u6-quiz-question-text');
    const u6QuizOptionsContainer = document.getElementById('u6-quiz-options');
    const u6QuizCounterText = document.getElementById('u6-quiz-counter');
    const u6FinalTotalScore = document.getElementById('u6-final-score');
    const u6ResultMessage = document.getElementById('u6-result-message');
    const startU6QuizBtn = document.getElementById('start-u6-quiz-btn');

    if (startU6QuizBtn) {
        startU6QuizBtn.addEventListener('click', () => {
            state.u6CurrentQuizIndex = 0;
            state.u6QuizScore = 0;
            if (u6QuizIntroView) u6QuizIntroView.classList.add('hidden');
            if (u6QuizResultView) u6QuizResultView.classList.add('hidden');
            if (u6QuizPlayView) u6QuizPlayView.classList.remove('hidden');
            showU6FinalQuizQuestion();
            updateParrotSpeech("크리스트교의 확산과 변화 최종 퀴즈 시작! 5문제 모두 맞춰봐! ⛪🛡️");
        });
    }

    function showU6FinalQuizQuestion() {
        if (!u6QuizPlayView) return;
        if (state.u6CurrentQuizIndex < u6FinalQuestions.length) {
            const qData = u6FinalQuestions[state.u6CurrentQuizIndex];
            if (u6QuizCounterText) u6QuizCounterText.textContent = `${state.u6CurrentQuizIndex + 1} / ${u6FinalQuestions.length}`;
            if (u6QuizQuestionText) u6QuizQuestionText.textContent = qData.q;
            if (u6QuizOptionsContainer) u6QuizOptionsContainer.innerHTML = '';
            
            qData.options.forEach((opt, idx) => {
                const btn = document.createElement('button');
                btn.className = 'quiz-opt-btn';
                btn.textContent = opt;
                btn.addEventListener('click', () => selectU6QuizOption(idx));
                u6QuizOptionsContainer.appendChild(btn);
            });
        } else {
            showU6QuizResults();
        }
    }

    function selectU6QuizOption(userIndex) {
        const qData = u6FinalQuestions[state.u6CurrentQuizIndex];
        const isCorrect = userIndex === qData.correctIndex;
        const optionButtons = u6QuizOptionsContainer.querySelectorAll('.quiz-opt-btn');
        
        optionButtons.forEach(btn => btn.disabled = true);

        if (isCorrect) {
            state.u6QuizScore++;
            optionButtons[userIndex].classList.add('correct');
            updateParrotSpeech("정답이야! 짝짝짝! 중세 크리스트교 지식이 수준급이구나! ⛪🎉");
            setParrotAvatar('happy');
        } else {
            optionButtons[userIndex].classList.add('wrong');
            optionButtons[qData.correctIndex].classList.add('correct');
            updateParrotSpeech(`아쉽다! 모찌 꿀팁: <br> ${qData.hint}`);
            setParrotAvatar('cheer');
        }
        state.u6CurrentQuizIndex++;
        setTimeout(showU6FinalQuizQuestion, isCorrect ? 1800 : 4000);
    }

    function showU6QuizResults() {
        if (u6QuizPlayView) u6QuizPlayView.classList.add('hidden');
        if (u6QuizResultView) u6QuizResultView.classList.remove('hidden');
        if (u6FinalTotalScore) u6FinalTotalScore.textContent = state.u6QuizScore;
        
        let messageText = "";
        if (state.u6QuizScore === 5) {
            messageText = "💯 완벽한 중세 크리스트교 세계 마스터 탄생! 모찌가 아름다운 고딕 둥지를 활짝 열어줄게! 봉건제의 주종/장원, 카노사와 십자군 전쟁, 흑사병 여파까지 완벽히 마스터했어! ⛪🥇";
            setParrotAvatar('happy');
        } else if (state.u6QuizScore >= 3) {
            messageText = "👍 훌륭해! 중세의 장원제와 십자군 영향, 흑사병 여파의 핵심을 잘 파악하고 있구나! 틀린 것도 분류기와 OX로 다시 확인해보자! ⚔️✨";
            setParrotAvatar('teacher');
        } else {
            messageText = "🦜 중세 역사가 머릿속에서 뒹굴뒹굴 헤매는구나! 괜찮아! 중세 사회 변화 분류기랑 OX 퀴즈를 모찌랑 다시 한 번 복습하러 가자! 🚀";
            setParrotAvatar('cheer');
        }
        if (u6ResultMessage) u6ResultMessage.innerHTML = messageText;
        
        const today = new Date();
        const dateString = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
        document.querySelectorAll('.cert-date-span').forEach(el => el.textContent = dateString);

        addProgress('u6-finalQuiz');
    }

    // Initialize progress bar at load
    updateProgressBar();
});
