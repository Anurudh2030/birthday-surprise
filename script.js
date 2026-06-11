/* ==========================================================================
   GAME ENGINE & LOGIC - HAPPY BIRTHDAY MAYUKHA!
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- SOUND EFFECTS ---
    const sfxCorrect = document.getElementById('sfx-correct');
    const sfxWrong = document.getElementById('sfx-wrong');
    const sfxPop = document.getElementById('sfx-pop');
    const sfxCheer = document.getElementById('sfx-cheer');
    const sfxWheel = document.getElementById('sfx-wheel');
    const sfxGrowl = document.getElementById('sfx-growl');
    
    // Safety check for audio playing
    function playSFX(audioElement) {
        if (audioElement) {
            audioElement.currentTime = 0;
            audioElement.play().catch(err => console.log('Audio playback blocked: ', err));
        }
    }

    // --- STAGE NAVIGATION ---
    const stages = {
        lock: document.getElementById('stage-lock'),
        quiz: document.getElementById('stage-quiz'),
        immigration: document.getElementById('stage-immigration'),
        dogs: document.getElementById('stage-dogs'),
        weather: document.getElementById('stage-weather'),
        wheel: document.getElementById('stage-wheel'),
        contract: document.getElementById('stage-contract'),
        reveal: document.getElementById('stage-reveal')
    };

    function showStage(stageName) {
        Object.values(stages).forEach(stage => stage.classList.remove('active'));
        stages[stageName].classList.add('active');
        playSFX(sfxPop);

        // Clean up any stray dodging option buttons on document.body when leaving the quiz
        if (stageName !== 'quiz') {
            const strayButtons = document.querySelectorAll('body > .option-btn.is-dodging');
            strayButtons.forEach(btn => btn.remove());
        }

        // Reset NO button position when entering the contract stage
        if (stageName === 'contract') {
            if (typeof resetNoButton === 'function') {
                resetNoButton();
            }
        }
    }

    // --- BACKGROUND HEARTS SPARKLE ---
    const heartsContainer = document.getElementById('heartsContainer');
    const heartEmojis = ['❤️', '💖', '💘', '💝', '🌸', '✨', '🦇', 'batman'];

    function createHeart() {
        const heart = document.createElement('div');
        heart.classList.add('floating-heart');
        
        const chosen = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
        if (chosen === 'batman') {
            heart.innerHTML = `<img src="assets/batman-logo.png" style="width: 24px; height: 24px; border-radius: 50%; display: block; filter: drop-shadow(0 0 4px rgba(255, 215, 0, 0.5)); opacity: 0.75;">`;
        } else {
            heart.innerText = chosen;
        }
        
        // Random placement and sizes
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.fontSize = Math.random() * 20 + 15 + 'px';
        
        // Random speed & delay
        const duration = Math.random() * 5 + 5; // 5s to 10s
        heart.style.animationDuration = duration + 's';
        heart.style.animationDelay = Math.random() * 2 + 's';
        
        heartsContainer.appendChild(heart);
        
        // Clean up heart after animation ends
        setTimeout(() => {
            heart.remove();
        }, duration * 1000);
    }

    // Spawn hearts continuously
    setInterval(createHeart, 450);

    // ==============================================
    // STAGE 0: PASSWORD LOCK ENGINE (4-DIGIT PIN '2030')
    // ==============================================
    const otpInputs = document.querySelectorAll('.otp-input');
    const btnUnlock = document.getElementById('btn-unlock');
    const lockErrorMsg = document.getElementById('lock-error-msg');
    const lockCard = document.querySelector('.lock-card');
    const childhoodOverlay = document.getElementById('childhoodOverlay');
    const btnChildhoodContinue = document.getElementById('btn-childhood-continue');

    const CORRECT_PASSWORD = "2030";

    // Focus first box initially
    if (otpInputs.length > 0) {
        setTimeout(() => otpInputs[0].focus(), 500);
    }

    // Setup input flow behavior
    otpInputs.forEach((input, index) => {
        // Limit typing to digits only and auto-advance
        input.addEventListener('input', (e) => {
            input.value = input.value.replace(/[^0-9]/g, '');
            
            if (input.value.length === 1 && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
            
            // Remove error styling on typing
            otpInputs.forEach(inp => inp.classList.remove('error-border'));
            lockErrorMsg.style.display = 'none';
            
            // Auto validate when 4th digit is typed
            const code = getEnteredCode();
            if (code.length === 4) {
                setTimeout(handleUnlock, 150);
            }
        });

        // Handle backspace to focus previous box
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && input.value.length === 0 && index > 0) {
                otpInputs[index - 1].focus();
            }
            if (e.key === 'Enter') {
                handleUnlock();
            }
        });
        
        // Auto-select on focus for smoother typing
        input.addEventListener('focus', () => {
            input.select();
        });
    });

    function getEnteredCode() {
        return Array.from(otpInputs).map(input => input.value).join('');
    }

    btnUnlock.addEventListener('click', handleUnlock);

    function handleUnlock() {
        const enteredPassword = getEnteredCode();
        
        if (enteredPassword.length < 4) {
            playSFX(sfxWrong);
            lockCard.classList.add('error-shake');
            lockErrorMsg.innerText = "ദയവായി 4 അക്ക പാസ്‌വേഡ് പൂർണ്ണമായി നൽകുക! ⚠️";
            lockErrorMsg.style.display = 'block';
            setTimeout(() => {
                lockCard.classList.remove('error-shake');
            }, 500);
            return;
        }

        if (enteredPassword === CORRECT_PASSWORD) {
            playSFX(sfxCheer);
            lockErrorMsg.style.display = 'none';
            
            // Heart rain shower
            for(let i=0; i<20; i++) {
                setTimeout(createHeart, i * 60);
            }

            // Show Childhood memories overlay
            setTimeout(() => {
                childhoodOverlay.classList.add('active');
            }, 500);
        } else {
            playSFX(sfxWrong);
            lockCard.classList.add('error-shake');
            otpInputs.forEach(input => {
                input.classList.add('error-border');
                input.value = ''; // clear digits
            });
            lockErrorMsg.innerText = "തെറ്റായ രഹസ്യവാക്കാണല്ലോ! ഒന്നുകൂടി നോക്കൂ... ❌";
            lockErrorMsg.style.display = 'block';
            
            otpInputs[0].focus();
            
            setTimeout(() => {
                lockCard.classList.remove('error-shake');
            }, 500);
        }
    }

    // Childhood reveal overlay continue click
    btnChildhoodContinue.addEventListener('click', () => {
        childhoodOverlay.classList.remove('active');
        playSFX(sfxPop);
        showStage('quiz');
        initQuiz();
    });


    // ==============================================
    // STAGE 1: TRIVIA QUIZ LOGIC
    // ==============================================
    const quizData = [
        {
            question: "നമ്മൾ ആദ്യമായി എടുത്ത selfie-യിൽ ഞാൻ ഏത് കളർ ഡ്രസ്സ് ആണ് ഇട്ടത്? നീ ഏത് കളർ ഡ്രസ്സ് ആണ് ഇട്ടത്? 📸",
            isSelfieQuestion: true,
            options: [
                { text: "Blue & Pink 💙💖", correct: true },
                { text: "Black & White 🖤🤍", correct: false },
                { text: "Red & Green ❤️💚", correct: false },
                { text: "Yellow & Black 💛🖤", correct: false }
            ]
        },
        {
            question: "നിനക്ക് ഇതിൽ ഏതാണ് ഏറ്റവും കൂടുതൽ പ്രിയപ്പെട്ടത്? 👗🤵",
            isDodgeQuestion: true,
            options: [
                { text: "ANURUDH 🤵❤️", correct: true },
                { text: "FREE DRESSES 👗🛍️", correct: false, id: "option-free-dresses" }
            ]
        },
        {
            question: "⏰ Dating അല്ലെങ്കിൽ പുറത്ത് കറങ്ങാൻ പോകുമ്പോൾ എപ്പോഴും Late ആകുന്നത് ആരാ? 🤷‍♂️🤷‍♀️",
            isCustomOverlayQuestion: true,
            options: [
                { text: "1️⃣ ANURUDH 🤵", correct: false },
                { text: "2️⃣ MAYUKHA 👸", correct: true }
            ],
            correctFeedback: {
                badge: "✅ Correct Answer!",
                speech: "Finally... sathyam purath vannu 😌😂❤️",
                subSpeech: "+100 Honesty Points Awarded 🏆",
                buttonText: "Proceed to next question ➡️"
            },
            incorrectFeedback: {
                badge: "🚨 Wrong Answer Detected! 🚨",
                speech: "Ayyada... nuna paranjo? 😏",
                subSpeech: "Sathyam parayuu Chinnuu... 😌❤️",
                buttonText: "Veendum try cheyyu. 🔄"
            }
        },
        {
            question: "🍔 Vishakumbol nammalil kooduthal deshyam aavunnath aara? 🤷‍♂️🤷‍♀️",
            isCustomOverlayQuestion: true,
            isHungerQuestion: true,
            options: [
                { text: "1️⃣ ANURUDH 🤵", correct: false },
                { text: "2️⃣ MAYUKHA 👸", correct: true }
            ],
            correctFeedback: {
                badge: "✅ Correct Answer!",
                speech: "Exactly! 🍔➡️😡",
                subSpeech: "Hungry Mayukha detected!<br>Food koduthillengil system unstable aavum 😂❤️",
                buttonText: "Proceed to next question ➡️"
            },
            incorrectFeedback: {
                badge: "🚨 Incorrect Answer!",
                speech: "Ayyada... njan athrem paavam alle? 😌",
                subSpeech: "Onnu koode aalochichu nokku Chinnuu 😂❤️",
                buttonText: "Veendum try cheyyu. 🔄"
            }
        },
        {
            question: "🌙 Night-ൽ ആരാണ് പെട്ടെന്ന് ഉറങ്ങുന്നത്? 😴💤",
            isSleepQuestion: true,
            options: [
                { text: "1️⃣ ANURUDH 🤵", correct: false },
                { text: "2️⃣ MAYUKHA 👸", correct: true }
            ]
        },
        {
            question: "💭 Chinnunte valiya dream entha after getting a job? 💭",
            isDreamQuestion: true,
            options: [
                { text: "💍 Boyfriend (ANURUDH) ne marriage cheyth abroad kond povanam ❤️", correct: true },
                { text: "📋 Nalloru job vedikanam", correct: false, hoverText: "Ath okke und... pakshe ithalla main answer 😌", dodge: true },
                { text: "📱 iPhone vedikanam", correct: false, hoverText: "Nice try 📱😂", dodge: true },
                { text: "💰 Kure paisa indakanam", correct: false, hoverText: "Paisa venam... pakshe vere entho koodi venam alle? 🤭❤️", dodge: true }
            ]
        },
        {
            question: "✈️ Ireland-ൽ എത്തിയാൽ ആദ്യം ആരെയാണ് നീ miss ചെയ്യുക? 🛫🇮🇪",
            isCustomOverlayQuestion: true,
            options: [
                { text: "❤️ ANURUDH", correct: true },
                { text: "👨‍👩‍👧 Family", correct: false },
                { text: "🍛 Kerala Food", correct: false },
                { text: "🛵 Chetak", correct: false }
            ],
            correctFeedback: {
                badge: "🥹 Expected answer detected ❤️",
                speech: "I knew it! 🥰",
                subSpeech: "Ireland poyalum Anurudh package safe aanalle? 🤭❤️✈️",
                buttonText: "Proceed ➡️"
            },
            incorrectFeedback: {
                badge: "🚨 Wrong Answer! 🚨",
                speech: "❌ \"Close... but not close enough 😌\"",
                subSpeech: "Onnu koode aalochichu nokku Chinnuu 😂❤️",
                buttonText: "Veendum try cheyyu. 🔄"
            }
        },
        {
            question: "🐶 Road-ൽ ഒരു പട്ടി വന്നാൽ ആദ്യം ഓടുന്നത് ആരാ? 🏃‍♂️🏃‍♀️💨",
            isCustomOverlayQuestion: true,
            options: [
                { text: "1️⃣ ANURUDH 🤵", correct: false },
                { text: "2️⃣ MAYUKHA 👸", correct: true }
            ],
            correctFeedback: {
                badge: "🏃‍♀️💨💨💨",
                speech: "New Speed Record Created 😂❤️",
                subSpeech: "Bullet speed-il odippokunna Mayukha chinnu detected! 😂🏃‍♀️💨",
                buttonText: "Proceed ➡️"
            },
            incorrectFeedback: {
                badge: "😂",
                speech: "Hehe..Nannayi onnu aalojiku chinnuu...",
                subSpeech: "Njan safe aayi rescue cheyyunnath vare wait cheyyillalloo, athinu munne odille? 😜❤️",
                buttonText: "Veendum try cheyyu. 🔄"
            }
        }
    ];

    let currentQuestionIndex = 0;
    const questionBox = document.getElementById('question-box');
    const optionsContainer = document.getElementById('options-container');
    const quizProgress = document.getElementById('quiz-progress');
    const questionCounter = document.getElementById('question-counter');
    const memeOverlay = document.getElementById('memeOverlay');
    const memeEmoji = document.getElementById('memeEmoji');
    const memeQuote = document.getElementById('memeQuote');

    function initQuiz() {
        currentQuestionIndex = 0;
        loadQuestion();
    }

    function loadQuestion() {
        // Clean up any stray dodging buttons appended to document.body
        const strayButtons = document.querySelectorAll('body > .option-btn.is-dodging');
        strayButtons.forEach(btn => btn.remove());

        const oldDodgeBtn = document.getElementById('option-free-dresses');
        if (oldDodgeBtn) {
            oldDodgeBtn.remove();
        }

        const currentData = quizData[currentQuestionIndex];
        
        // Set Counter and Progress
        questionCounter.innerText = `Question ${currentQuestionIndex + 1} of ${quizData.length}`;
        const progressPercentage = ((currentQuestionIndex) / quizData.length) * 100;
        quizProgress.style.width = `${progressPercentage}%`;

        // Load Question Text
        questionBox.innerHTML = `<h2 class="question-text">${currentData.question}</h2>`;

        // Clear Options
        optionsContainer.innerHTML = '';

        // Load Options
        currentData.options.forEach((option) => {
            const button = document.createElement('button');
            button.classList.add('option-btn');
            button.innerText = option.text;
            if (option.id) {
                button.id = option.id;
                // Add touch triggers directly for the dodging dress button
                button.addEventListener('touchstart', (e) => dodgeDressButton(e, button));
                button.addEventListener('pointerdown', (e) => dodgeDressButton(e, button));
                button.addEventListener('click', (e) => dodgeDressButton(e, button));
            } else if (option.dodge) {
                button.setAttribute('data-dodge', 'true');
                button.setAttribute('data-hover-text', option.hoverText);
                button.setAttribute('data-original-text', option.text);
                button.addEventListener('touchstart', (e) => dodgeOptionButton(e, button));
                button.addEventListener('pointerdown', (e) => dodgeOptionButton(e, button));
                button.addEventListener('click', (e) => dodgeOptionButton(e, button));
            } else {
                button.addEventListener('click', () => handleOptionClick(option));
            }
            optionsContainer.appendChild(button);
        });
    }

    function getDistanceToRect(x, y, rect) {
        const dx = Math.max(rect.left - x, 0, x - rect.right);
        const dy = Math.max(rect.top - y, 0, y - rect.bottom);
        return Math.hypot(dx, dy);
    }

    function dodgeDressButton(e, btnDress) {
        if(e) e.preventDefault();

        // Move to document.body so it escapes parent overflow:hidden and stacking contexts
        if (btnDress.parentElement !== document.body) {
            document.body.appendChild(btnDress);
        }
        btnDress.classList.add('is-dodging');

        const rect = btnDress.getBoundingClientRect();
        const isMobile = window.innerWidth <= 600;
        const btnWidth = rect.width || (isMobile ? 150 : 200);
        const btnHeight = rect.height || (isMobile ? 40 : 50);
        
        // Keep safe margin from screen boundaries to keep it visible
        const margin = 30;
        const minX = margin;
        const maxX = Math.max(margin + 50, window.innerWidth - btnWidth - margin);
        const minY = margin;
        const maxY = Math.max(margin + 50, window.innerHeight - btnHeight - margin);

        // Get cursor position or use screen center
        let clientX = window.innerWidth / 2;
        let clientY = window.innerHeight / 2;
        if (e) {
            if (e.clientX !== undefined) {
                clientX = e.clientX;
                clientY = e.clientY;
            } else if (e.touches && e.touches.length > 0) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else if (e.changedTouches && e.changedTouches.length > 0) {
                clientX = e.changedTouches[0].clientX;
                clientY = e.changedTouches[0].clientY;
            }
        }

        let newX, newY;
        let attempt = 0;
        const minDistance = isMobile ? 80 : 140;
        do {
            newX = Math.random() * (maxX - minX) + minX;
            newY = Math.random() * (maxY - minY) + minY;
            attempt++;
        } while (Math.hypot(newX + btnWidth/2 - clientX, newY + btnHeight/2 - clientY) < minDistance && attempt < 30);

        btnDress.style.position = 'fixed';
        btnDress.style.left = `${newX}px`;
        btnDress.style.top = `${newY}px`;
        btnDress.style.zIndex = '9999';

        playSFX(sfxPop);
    }

    function dodgeOptionButton(e, button) {
        if(e) e.preventDefault();

        // Swap button text if hoverText is specified
        const hoverText = button.getAttribute('data-hover-text');
        if (hoverText) {
            button.innerText = hoverText;
        }

        // Move to document.body so it escapes parent overflow:hidden and stacking contexts
        if (button.parentElement !== document.body) {
            document.body.appendChild(button);
        }
        button.classList.add('is-dodging');

        const rect = button.getBoundingClientRect();
        const isMobile = window.innerWidth <= 600;
        const btnWidth = rect.width || (isMobile ? 150 : 200);
        const btnHeight = rect.height || (isMobile ? 40 : 50);
        
        // Keep safe margin from screen boundaries to keep it visible
        const margin = 30;
        const minX = margin;
        const maxX = Math.max(margin + 50, window.innerWidth - btnWidth - margin);
        const minY = margin;
        const maxY = Math.max(margin + 50, window.innerHeight - btnHeight - margin);

        // Get cursor position or use screen center
        let clientX = window.innerWidth / 2;
        let clientY = window.innerHeight / 2;
        if (e) {
            if (e.clientX !== undefined) {
                clientX = e.clientX;
                clientY = e.clientY;
            } else if (e.touches && e.touches.length > 0) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else if (e.changedTouches && e.changedTouches.length > 0) {
                clientX = e.changedTouches[0].clientX;
                clientY = e.changedTouches[0].clientY;
            }
        }

        let newX, newY;
        let attempt = 0;
        const minDistance = isMobile ? 80 : 140;
        do {
            newX = Math.random() * (maxX - minX) + minX;
            newY = Math.random() * (maxY - minY) + minY;
            attempt++;
        } while (Math.hypot(newX + btnWidth/2 - clientX, newY + btnHeight/2 - clientY) < minDistance && attempt < 30);

        button.style.position = 'fixed';
        button.style.left = `${newX}px`;
        button.style.top = `${newY}px`;
        button.style.zIndex = '9999';

        playSFX(sfxPop);
    }

    // Advanced mouse hover check: tracks cursor movement to move the dress button *before* cursor touches it
    document.addEventListener('mousemove', (e) => {
        if (!stages.quiz.classList.contains('active')) return;
        
        // Check dress button
        const btnDress = document.getElementById('option-free-dresses');
        if (btnDress) {
            const rect = btnDress.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
                const dist = getDistanceToRect(e.clientX, e.clientY, rect);
                if (dist < 65) {
                    dodgeDressButton(e, btnDress);
                }
            }
        }

        // Check general dodging buttons
        const dodgingButtons = document.querySelectorAll('[data-dodge="true"]');
        dodgingButtons.forEach(btn => {
            const rect = btn.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) return;
            const dist = getDistanceToRect(e.clientX, e.clientY, rect);
            if (dist < 65) {
                dodgeOptionButton(e, btn);
            }
        });
    });

    function handleOptionClick(option) {
        const currentData = quizData[currentQuestionIndex];

        if (currentData.isSelfieQuestion) {
            const selfieOverlay = document.getElementById('selfieOverlay');
            const selfiePopBadge = document.getElementById('selfiePopBadge');
            const selfiePopSpeech = document.getElementById('selfiePopSpeech');
            const selfiePopSubSpeech = document.getElementById('selfiePopSubSpeech');
            const selfieCaption = document.querySelector('.selfie-caption-box');

            if (option.correct) {
                playSFX(sfxCorrect);
                // Shower of hearts
                for(let i=0; i<20; i++) {
                    setTimeout(createHeart, i * 80);
                }
                selfiePopBadge.innerText = "😍 Perfect Memory!";
                selfiePopSpeech.innerText = "Wow! കറക്റ്റ് ഓർമ്മയുണ്ടല്ലോ! 😳";
                selfiePopSubSpeech.innerText = "നമ്മൾ എടുത്ത ആദ്യത്തെ സെൽഫി തന്നെ! ❤️";
                selfieCaption.innerHTML = `
                    <p><strong>"Blue shirt-ൽ ഞാനും, Pink dress-ൽ നീയും ❤️"</strong></p>
                    <p class="caption-conclusion">"Case closed. Perfect memory! 😌"</p>
                `;
            } else {
                playSFX(sfxWrong);
                selfiePopBadge.innerText = "😳 Selfie മറന്നോ?!";
                selfiePopSpeech.innerText = "ആദ്യം എടുത്ത selfie തന്നെ മറന്നോ? 🥺";
                selfiePopSubSpeech.innerText = "ഇനി Ireland പോയാൽ എന്നെയും മറക്കുമോ നീ? 😂💔";
                selfieCaption.innerHTML = `
                    <p><strong>"Blue shirt-ൽ ഞാനും, Pink dress-ൽ നീയും ❤️"</strong></p>
                    <p class="caption-conclusion">"Case closed. Memory refresh successful 😌😂"</p>
                `;
            }

            selfieOverlay.classList.add('active');
            return;
        }

        if (currentData.isDodgeQuestion) {
            const quizOverlay = document.getElementById('quizOverlay');
            const quizPopBadge = document.getElementById('quizPopBadge');
            const quizPopSpeech = document.getElementById('quizPopSpeech');
            const quizPopSubSpeech = document.getElementById('quizPopSubSpeech');
            const btnQuizAction = document.getElementById('btn-quiz-action');
            const quizCard = document.getElementById('quizCard');

            quizCard.classList.remove('error-shake');

            playSFX(sfxCorrect);
            for(let i=0; i<20; i++) {
                setTimeout(createHeart, i * 80);
            }

            quizPopBadge.innerText = "👗 Caught Red-Handed!";
            quizPopBadge.style.color = "#20bf6b";
            quizPopBadge.style.borderColor = "#20bf6b";
            quizPopBadge.style.backgroundColor = "rgba(32, 191, 107, 0.15)";
            
            quizPopSpeech.innerHTML = "Free Dresses venam... pakshe njan aanu main! 🤵❤️";
            quizPopSubSpeech.innerHTML = "Pakshe... Kure dress okke vedikanam ennu undalle? Ennalum ninak njan thanneyaanalle ettavum important? 🤭😌❤️";
            btnQuizAction.innerText = "Proceed to next question ➡️";
            btnQuizAction.setAttribute('data-action', 'next');

            quizOverlay.classList.add('active');
            return;
        }

        if (currentData.isCustomOverlayQuestion) {
            const quizOverlay = document.getElementById('quizOverlay');
            const quizPopBadge = document.getElementById('quizPopBadge');
            const quizPopSpeech = document.getElementById('quizPopSpeech');
            const quizPopSubSpeech = document.getElementById('quizPopSubSpeech');
            const btnQuizAction = document.getElementById('btn-quiz-action');
            const quizCard = document.getElementById('quizCard');
            const hungryImgHolder = document.getElementById('hungryImgHolder');

            // Hide initially
            if (hungryImgHolder) {
                hungryImgHolder.style.display = 'none';
            }

            quizCard.classList.remove('error-shake');

            if (option.correct) {
                // Correct choice
                playSFX(sfxCorrect);
                for(let i=0; i<20; i++) {
                    setTimeout(createHeart, i * 80);
                }
                const feedback = currentData.correctFeedback;
                quizPopBadge.innerText = feedback.badge;
                quizPopBadge.style.color = "#20bf6b";
                quizPopBadge.style.borderColor = "#20bf6b";
                quizPopBadge.style.backgroundColor = "rgba(32, 191, 107, 0.15)";
                
                quizPopSpeech.innerHTML = feedback.speech;
                quizPopSubSpeech.innerHTML = feedback.subSpeech;
                btnQuizAction.innerText = feedback.buttonText;
                btnQuizAction.setAttribute('data-action', 'next');

                // Show hungry chinnu image if correct and hunger question
                if (currentData.isHungerQuestion && hungryImgHolder) {
                    hungryImgHolder.style.display = 'block';
                }
            } else {
                // Incorrect choice
                playSFX(sfxWrong);
                
                // Shake the option button in the options list
                const buttons = optionsContainer.querySelectorAll('.option-btn');
                buttons.forEach(btn => {
                    if (btn.innerText.includes(option.text)) {
                        btn.classList.add('error-shake');
                        setTimeout(() => btn.classList.remove('error-shake'), 500);
                    }
                });

                const feedback = currentData.incorrectFeedback;
                quizPopBadge.innerText = feedback.badge;
                quizPopBadge.style.color = "#ff7675";
                quizPopBadge.style.borderColor = "#ff7675";
                quizPopBadge.style.backgroundColor = "rgba(255, 118, 117, 0.15)";
                
                quizPopSpeech.innerHTML = feedback.speech;
                quizPopSubSpeech.innerHTML = feedback.subSpeech;
                btnQuizAction.innerText = feedback.buttonText;
                btnQuizAction.setAttribute('data-action', 'retry');

                setTimeout(() => {
                    quizCard.classList.add('error-shake');
                }, 100);
            }

            quizOverlay.classList.add('active');
            return;
        }

        if (currentData.isSleepQuestion) {
            const sleepOverlay = document.getElementById('sleepOverlay');
            const sleepPopBadge = document.getElementById('sleepPopBadge');
            const sleepPopSpeech = document.getElementById('sleepPopSpeech');
            const btnSleepContinue = document.getElementById('btn-sleep-continue');
            const sleepCard = document.getElementById('sleepCard');

            sleepCard.classList.remove('error-shake');

            if (option.correct) {
                // Correct choice: MAYUKHA
                playSFX(sfxCorrect);
                for(let i=0; i<20; i++) {
                    setTimeout(createHeart, i * 80);
                }
                sleepPopBadge.innerText = "✅ Correct! Self-Admitted! 😂";
                sleepPopBadge.style.color = "#20bf6b";
                sleepPopBadge.style.borderColor = "#20bf6b";
                sleepPopBadge.style.backgroundColor = "rgba(32, 191, 107, 0.15)";
                
                sleepPopSpeech.innerText = "Exactly! Neeyum sammadhichu! Message ayach 2 minute kazhinjappol offline aayidunna aa aal Chinnu thanne! 😂😴";
                btnSleepContinue.innerText = "Proceed to next question ➡️";
                btnSleepContinue.setAttribute('data-action', 'next');
            } else {
                // Incorrect choice: ANURUDH
                playSFX(sfxWrong);
                
                // Shake the ANURUDH button in the options list
                const buttons = optionsContainer.querySelectorAll('.option-btn');
                buttons.forEach(btn => {
                    if (btn.innerText.includes("ANURUDH")) {
                        btn.classList.add('error-shake');
                        setTimeout(() => btn.classList.remove('error-shake'), 500);
                    }
                });

                sleepPopBadge.innerText = "🚨 Evidence Found! 🚨";
                sleepPopBadge.style.color = "#ff7675";
                sleepPopBadge.style.borderColor = "#ff7675";
                sleepPopBadge.style.backgroundColor = "rgba(255, 118, 117, 0.15)";
                
                sleepPopSpeech.innerText = "Message ayach 2 minute kazhinjappol thanne offline aaya aa legendary vyakthi ithaan 😂😴";
                btnSleepContinue.innerText = "Veendum try cheyyu. 🔄";
                btnSleepContinue.setAttribute('data-action', 'retry');

                setTimeout(() => {
                    sleepCard.classList.add('error-shake');
                }, 100);
            }

            sleepOverlay.classList.add('active');
            return;
        }

        if (currentData.isDreamQuestion) {
            const dreamOverlay = document.getElementById('dreamOverlay');
            const dreamStep1 = document.getElementById('dreamStep1');
            const dreamStep2 = document.getElementById('dreamStep2');
            const dreamTrollResult = document.getElementById('dreamTrollResult');
            const btnDreamContinue = document.getElementById('btn-dream-continue');

            // Reset step states
            dreamStep1.style.display = 'block';
            dreamStep2.style.display = 'none';
            dreamTrollResult.style.display = 'none';
            btnDreamContinue.style.display = 'none';

            playSFX(sfxCorrect);
            // Shower of hearts
            for(let i=0; i<20; i++) {
                setTimeout(createHeart, i * 80);
            }

            dreamOverlay.classList.add('active');
            return;
        }

        if (option.correct) {
            playSFX(sfxCorrect);
            
            // Shower of hearts animation on success
            for(let i=0; i<15; i++) {
                setTimeout(createHeart, i * 80);
            }

            // Move to next question or next stage
            currentQuestionIndex++;
            if (currentQuestionIndex < quizData.length) {
                setTimeout(loadQuestion, 800);
            } else {
                // Complete progress bar
                quizProgress.style.width = `100%`;
                setTimeout(() => {
                    showStage('immigration');
                }, 1000);
            }
        } else {
            playSFX(sfxWrong);
            // Trigger Meme Modal
            memeEmoji.innerText = option.emoji || "🤨";
            memeQuote.innerText = `"${option.meme || 'Wrong answer!'}"`;
            memeOverlay.classList.add('active');
        }
    }

    // Try again on wrong answer
    document.getElementById('btn-try-again').addEventListener('click', () => {
        memeOverlay.classList.remove('active');
        playSFX(sfxPop);
    });

    // Continue from selfie modal
    document.getElementById('btn-selfie-continue').addEventListener('click', () => {
        const selfieOverlay = document.getElementById('selfieOverlay');
        selfieOverlay.classList.remove('active');
        playSFX(sfxPop);
 
        // Move to next question or next stage
        currentQuestionIndex++;
        if (currentQuestionIndex < quizData.length) {
            loadQuestion();
        } else {
            quizProgress.style.width = `100%`;
            setTimeout(() => {
                showStage('immigration');
            }, 500);
        }
    });

    // Continue/Retry from custom quiz overlay feedback modal
    document.getElementById('btn-quiz-action').addEventListener('click', (e) => {
        const quizOverlay = document.getElementById('quizOverlay');
        const action = e.currentTarget.getAttribute('data-action');
        quizOverlay.classList.remove('active');
        playSFX(sfxPop);
 
        if (action === 'next') {
            // Move to next question or next stage
            currentQuestionIndex++;
            if (currentQuestionIndex < quizData.length) {
                loadQuestion();
            } else {
                quizProgress.style.width = `100%`;
                setTimeout(() => {
                    showStage('immigration');
                }, 500);
            }
        }
        // If action === 'retry', we do nothing else - the overlay is closed so she can choose again!
    });

    // Continue/Retry from sleep question modal
    document.getElementById('btn-sleep-continue').addEventListener('click', (e) => {
        const sleepOverlay = document.getElementById('sleepOverlay');
        const action = e.currentTarget.getAttribute('data-action');
        sleepOverlay.classList.remove('active');
        playSFX(sfxPop);
 
        if (action === 'next') {
            // Move to next question or next stage
            currentQuestionIndex++;
            if (currentQuestionIndex < quizData.length) {
                loadQuestion();
            } else {
                quizProgress.style.width = `100%`;
                setTimeout(() => {
                    showStage('immigration');
                }, 500);
            }
        }
        // If action === 'retry', we do nothing else - the overlay is closed so she can choose again!
    });

    // Reveal/Verify Dream details troll click handler
    document.getElementById('btn-dream-reveal-troll').addEventListener('click', () => {
        playSFX(sfxPop);
        
        const dreamStep1 = document.getElementById('dreamStep1');
        const dreamStep2 = document.getElementById('dreamStep2');
        const dreamProcessingLog = document.getElementById('dreamProcessingLog');
        const dreamTrollResult = document.getElementById('dreamTrollResult');
        const btnDreamContinue = document.getElementById('btn-dream-continue');

        dreamStep1.style.display = 'none';
        dreamStep2.style.display = 'block';
        dreamProcessingLog.innerHTML = '';
        dreamTrollResult.style.display = 'none';
        btnDreamContinue.style.display = 'none';

        const logs = [
            "📋 Processing...",
            "📋 Checking dream...",
            "📋 Confirming...",
            "📋 Contacting Chinnu..."
        ];

        let currentLogIndex = 0;

        function addLogLine() {
            if (currentLogIndex < logs.length) {
                const p = document.createElement('p');
                p.style.margin = '5px 0';
                p.innerText = logs[currentLogIndex];
                dreamProcessingLog.appendChild(p);
                
                playSFX(sfxPop);

                currentLogIndex++;
                setTimeout(addLogLine, 750);
            } else {
                playSFX(sfxCheer);
                dreamTrollResult.style.display = 'block';
                btnDreamContinue.style.display = 'inline-flex';
                
                for(let i=0; i<10; i++) {
                    setTimeout(createHeart, i * 80);
                }
            }
        }

        setTimeout(addLogLine, 300);
    });

    // Continue from dream modal
    document.getElementById('btn-dream-continue').addEventListener('click', () => {
        const dreamOverlay = document.getElementById('dreamOverlay');
        dreamOverlay.classList.remove('active');
        playSFX(sfxPop);

        // Move to next question or next stage
        currentQuestionIndex++;
        if (currentQuestionIndex < quizData.length) {
            loadQuestion();
        } else {
            quizProgress.style.width = `100%`;
            setTimeout(() => {
                showStage('immigration');
            }, 500);
        }
    });

    // Secret Trigger Click Handler
    document.getElementById('btn-secret-trigger').addEventListener('click', () => {
        playSFX(sfxPop);

        const secretOverlay = document.getElementById('secretOverlay');
        const secretStep1 = document.getElementById('secretStep1');
        const secretStep2 = document.getElementById('secretStep2');

        // Reset steps
        secretStep1.style.display = 'block';
        secretStep2.style.display = 'none';

        // Reset wrong options text and positions back to their original parent
        const secretOptions = secretOverlay.querySelectorAll('[data-dodge="true"]');
        const optionsContainer = document.getElementById('secret-options-container');
        secretOptions.forEach(btn => {
            btn.innerText = btn.getAttribute('data-original-text');
            btn.classList.remove('is-dodging');
            btn.style.position = 'relative';
            btn.style.left = '0px';
            btn.style.top = '0px';
            btn.style.zIndex = 'auto';
            if (btn.parentElement !== optionsContainer) {
                optionsContainer.appendChild(btn);
            }
        });

        secretOverlay.classList.add('active');
    });

    // Obviously button Click Handler
    document.getElementById('secret-btn-obviously').addEventListener('click', () => {
        playSFX(sfxCorrect);
        // Heavy heart shower
        for (let i = 0; i < 20; i++) {
            setTimeout(createHeart, i * 60);
        }

        const secretStep1 = document.getElementById('secretStep1');
        const secretStep2 = document.getElementById('secretStep2');
        secretStep1.style.display = 'none';
        secretStep2.style.display = 'block';
    });

    // Secret Modal Close Handler
    document.getElementById('btn-secret-close').addEventListener('click', () => {
        const secretOverlay = document.getElementById('secretOverlay');
        secretOverlay.classList.remove('active');
        playSFX(sfxPop);

        // Remove any stray dodging option buttons on document.body
        const strayButtons = document.querySelectorAll('body > .option-btn.is-dodging');
        strayButtons.forEach(btn => btn.remove());
    });


    // ==============================================
    // STAGE 2: IMMIGRATION OFFICER BOOTH
    // ==============================================
    const customsChoices = document.querySelectorAll('.customs-choice');
    const customsStampOverlay = document.getElementById('customsStampOverlay');
    const officerPopupText = document.getElementById('officer-popup-text');
    const btnCustomsContinue = document.getElementById('btn-customs-continue');

    customsChoices.forEach(button => {
        button.addEventListener('click', (e) => {
            const choice = e.currentTarget.getAttribute('data-choice');
            playSFX(sfxCheer);
            
            if (choice === 'Escape') {
                officerPopupText.innerHTML = '"Aha, escape boyfriend-o? 😂 Nice try, Mayukha! But he misses you already, so application approved! ❤️"';
            } else if (choice === 'Study') {
                officerPopupText.innerHTML = '"Study is excellent! 📚 Application approved! Keep shining, and remember someone in Kerala misses you already ❤️"';
            } else {
                officerPopupText.innerHTML = '"Adventure is approved! ✈️ But remember, your biggest adventure is back home missing you already ❤️"';
            }

            customsStampOverlay.classList.add('active');
        });
    });

    btnCustomsContinue.addEventListener('click', () => {
        customsStampOverlay.classList.remove('active');
        showStage('dogs');
    });


    // ==============================================
    // STAGE 3: "SAVE ME FROM DOGS" SIMULATOR
    // ==============================================
    const btnSaveDogs = document.getElementById('btn-save-dogs');
    const dogsSwarmOverlay = document.getElementById('dogsSwarmOverlay');
    const heroSaverOverlay = document.getElementById('heroSaverOverlay');
    const btnDogsContinue = document.getElementById('btn-dogs-continue');

    btnSaveDogs.addEventListener('click', () => {
        // Play scary growl sound
        playSFX(sfxGrowl);
        
        // Swarm screen with barking dogs
        dogsSwarmOverlay.style.display = 'flex';

        const numDogs = 18;
        for (let i = 0; i < numDogs; i++) {
            setTimeout(spawnSwarmDog, i * 80);
        }

        // Wait 1.8 seconds, then trigger Superhero save!
        setTimeout(() => {
            dogsSwarmOverlay.style.display = 'none';
            playSFX(sfxCheer);
            heroSaverOverlay.classList.add('active');
        }, 2200);
    });

    function spawnSwarmDog() {
        const dog = document.createElement('div');
        dog.classList.add('swarm-dog');
        dog.innerText = '🐶';
        
        // Random Y target and Y spawn
        const ySpawn = Math.random() * window.innerHeight;
        const yTarget = Math.random(); // scaling factor for CSS target
        
        dog.style.top = ySpawn + 'px';
        dog.style.setProperty('--y-target', yTarget);
        
        // Random rotation speed
        dog.style.animationDuration = (Math.random() * 0.8 + 1.2) + 's';
        
        document.body.appendChild(dog);
        
        // Clean up dog node
        setTimeout(() => {
            dog.remove();
        }, 2000);
    }

    btnDogsContinue.addEventListener('click', () => {
        heroSaverOverlay.classList.remove('active');
        showStage('weather');
    });


    // ==============================================
    // STAGE 4: IRELAND WEATHER PREDICTOR
    // ==============================================
    const btnCheckWeather = document.getElementById('btn-check-weather');
    const weatherDisplay = document.getElementById('weatherDisplay');
    const weatherResultOverlay = document.getElementById('weatherResultOverlay');
    const btnWeatherContinue = document.getElementById('btn-weather-continue');

    btnCheckWeather.addEventListener('click', () => {
        playSFX(sfxWheel);
        
        // Show spinning indicator
        weatherDisplay.innerHTML = `
            <i class="fas fa-spinner fa-spin weather-icon text-info"></i>
            <p class="weather-status">Status: Connecting to Dublin satellite...</p>
        `;

        // Wait 1.8 seconds, then show Predictable Rain!
        setTimeout(() => {
            playSFX(sfxCorrect);
            weatherDisplay.innerHTML = `
                <i class="fas fa-cloud-showers-heavy weather-icon text-primary"></i>
                <p class="weather-status text-primary">Ireland Climate: Rain 🌧️</p>
            `;
            
            // Pop open custom warm quote
            setTimeout(() => {
                weatherResultOverlay.classList.add('active');
            }, 600);

        }, 1800);
    });

    btnWeatherContinue.addEventListener('click', () => {
        weatherResultOverlay.classList.remove('active');
        // Reset weather box
        weatherDisplay.innerHTML = `
            <i class="fas fa-cloud-sun weather-icon"></i>
            <p class="weather-status">Status: Unknown</p>
        `;
        showStage('wheel');
        initWheel();
    });


    // ==============================================
    // STAGE 5: SPIN THE WHEEL
    // ==============================================
    const canvas = document.getElementById('wheel-canvas');
    const ctx = canvas.getContext('2d');
    const btnSpin = document.getElementById('btn-spin');
    const couponOverlay = document.getElementById('couponOverlay');
    const couponGiftTitle = document.getElementById('couponGiftTitle');
    const btnCouponAccept = document.getElementById('btn-coupon-accept');
    const pointer = document.querySelector('.wheel-pointer');

    const prizes = [
        "Free Hug 🤗",
        "Movie Date 🎬",
        "Chocolate 🍫",
        "Long Drive 🚗",
        "Surprise Gift 🎁",
        "No Arguments 🤫"
    ];

    const sliceColors = ['#ff4b72', '#8c7ae6', '#ffd700', '#00d2d3', '#ff9f43', '#10ac84'];
    const numSlices = prizes.length;
    const sliceAngle = (2 * Math.PI) / numSlices;
    
    let currentAngle = 0;
    let isSpinning = false;
    let spinAngleStart = 0;
    let spinTime = 0;
    let spinTimeTotal = 0;
    
    function drawWheel() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const radius = cx - 10;
        
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(currentAngle);
        
        for (let i = 0; i < numSlices; i++) {
            const angle = i * sliceAngle;
            
            // Draw Slices
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, radius, angle, angle + sliceAngle);
            ctx.closePath();
            ctx.fillStyle = sliceColors[i];
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#110722';
            ctx.stroke();
            
            // Add Labels
            ctx.save();
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 13px 'Outfit', sans-serif";
            ctx.textAlign = "right";
            ctx.translate(0, 0);
            ctx.rotate(angle + sliceAngle / 2);
            
            const labelText = prizes[i];
            ctx.fillText(labelText, radius - 20, 5);
            ctx.restore();
        }
        
        ctx.restore();
    }

    function initWheel() {
        currentAngle = 0;
        isSpinning = false;
        drawWheel();
    }

    btnSpin.addEventListener('click', spinWheel);

    function spinWheel() {
        if (isSpinning) return;
        
        isSpinning = true;
        pointer.classList.add('ticking');
        
        spinAngleStart = Math.random() * 10 + 10; // Random speed
        spinTime = 0;
        spinTimeTotal = Math.random() * 3000 + 4000; // Spin between 4 to 7 seconds
        
        rotateWheel();
    }

    let lastTickAngle = 0;

    function rotateWheel() {
        spinTime += 30;
        
        if (spinTime >= spinTimeTotal) {
            stopWheel();
            return;
        }
        
        const spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
        currentAngle += (spinAngle * Math.PI) / 180;
        drawWheel();
        
        // Tick Sound effect physics
        const currentAngleDeg = (currentAngle * 180 / Math.PI) % 360;
        const tickThreshold = 360 / numSlices;
        if (Math.abs(currentAngleDeg - lastTickAngle) >= tickThreshold) {
            playSFX(sfxWheel);
            lastTickAngle = currentAngleDeg;
        }

        requestAnimationFrame(rotateWheel);
    }

    function easeOut(t, b, c, d) {
        const ts = (t /= d) * t;
        const tc = ts * t;
        return b + c * (tc + -3 * ts + 3 * t);
    }

    function stopWheel() {
        isSpinning = false;
        pointer.classList.remove('ticking');
        playSFX(sfxCheer);
        
        // Calculate Landing slice index
        // Pointer is at the top (270 degrees in canvas space)
        const degrees = (currentAngle * 180 / Math.PI) % 360;
        const index = Math.floor((360 - degrees - 90 + 360) % 360 / (360 / numSlices));
        
        const winningPrize = prizes[index];
        
        // Open Coupon claims modal
        setTimeout(() => {
            couponGiftTitle.innerHTML = winningPrize;
            couponOverlay.classList.add('active');
        }, 800);
    }

    btnCouponAccept.addEventListener('click', () => {
        couponOverlay.classList.remove('active');
        playSFX(sfxPop);
        
        // Shower heart
        for(let i=0; i<15; i++) {
            setTimeout(createHeart, i * 60);
        }

        // Advance to Stage 6: Escaping Contract
        setTimeout(() => {
            showStage('contract');
        }, 500);
    });


    // ==============================================
    // STAGE 6: ESCAPING "NO" BUTTON PHYSICS
    // ==============================================
    const btnNo = document.getElementById('btn-contract-no');
    const btnYes = document.getElementById('btn-contract-yes');
    const stampOverlay = document.getElementById('stampOverlay');
    const contractGroup = document.querySelector('.btn-group-contract');

    function resetNoButton() {
        // Return button to original parent if it was moved to body
        if (btnNo.parentElement !== contractGroup) {
            contractGroup.appendChild(btnNo);
        }
        btnNo.classList.remove('is-dodging');
        btnNo.style.position = 'relative';
        btnNo.style.left = '0px';
        btnNo.style.top = '0px';
        btnNo.style.zIndex = 'auto';
    }

    function dodgeNoButton(e) {
        if(e) e.preventDefault();

        // Move to document.body so it escapes parent cards overflow:hidden and backdrop-filters
        if (btnNo.parentElement !== document.body) {
            document.body.appendChild(btnNo);
        }
        btnNo.classList.add('is-dodging');

        const rect = btnNo.getBoundingClientRect();
        const isMobile = window.innerWidth <= 600;
        const btnWidth = rect.width || (isMobile ? 150 : 200);
        const btnHeight = rect.height || (isMobile ? 40 : 50);
        
        // Keep safe margin from screen boundaries to keep it visible
        const margin = 30;
        const minX = margin;
        const maxX = Math.max(margin + 50, window.innerWidth - btnWidth - margin);
        const minY = margin;
        const maxY = Math.max(margin + 50, window.innerHeight - btnHeight - margin);

        // Get cursor position or use screen center
        let clientX = window.innerWidth / 2;
        let clientY = window.innerHeight / 2;
        if (e) {
            if (e.clientX !== undefined) {
                clientX = e.clientX;
                clientY = e.clientY;
            } else if (e.touches && e.touches.length > 0) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else if (e.changedTouches && e.changedTouches.length > 0) {
                clientX = e.changedTouches[0].clientX;
                clientY = e.changedTouches[0].clientY;
            }
        }

        let newX, newY;
        let attempt = 0;
        const minDistance = isMobile ? 80 : 140;
        do {
            newX = Math.random() * (maxX - minX) + minX;
            newY = Math.random() * (maxY - minY) + minY;
            attempt++;
        } while (Math.hypot(newX + btnWidth/2 - clientX, newY + btnHeight/2 - clientY) < minDistance && attempt < 30);

        btnNo.style.position = 'fixed';
        btnNo.style.left = `${newX}px`;
        btnNo.style.top = `${newY}px`;
        btnNo.style.zIndex = '9999';

        playSFX(sfxPop);
    }

    // Advanced mouse hover check: tracks cursor movement to move the button *before* cursor touches it
    document.addEventListener('mousemove', (e) => {
        if (!stages.contract.classList.contains('active')) return;
        
        const rect = btnNo.getBoundingClientRect();
        // If button is off-screen or not rendered yet
        if (rect.width === 0 || rect.height === 0) return;

        const dist = getDistanceToRect(e.clientX, e.clientY, rect);
        
        // If cursor gets within 65px of the button boundary, trigger dodge!
        if (dist < 65) {
            dodgeNoButton(e);
        }
    });

    // Trigger dodge on both desktop hover and mobile touch start
    btnNo.addEventListener('touchstart', dodgeNoButton);
    btnNo.addEventListener('pointerdown', dodgeNoButton);
    btnNo.addEventListener('click', dodgeNoButton);

    // Click YES Contract
    btnYes.addEventListener('click', () => {
        playSFX(sfxCheer);
        
        // Show APPROVED Stamp
        stampOverlay.classList.add('active');

        // Shower hearts
        for(let i=0; i<25; i++) {
            setTimeout(createHeart, i * 60);
        }

        // Transition to stage 7 (Grand Reveal) after 2.5 seconds
        setTimeout(() => {
            stampOverlay.classList.remove('active');
            showStage('reveal');
            initReveal();
        }, 2500);
    });


    // ==============================================
    // STAGE 7: THE GRAND REVEAL & INTERACTIVE CAKE
    // ==============================================
    const bgMusic = document.getElementById('bgMusic');
    const musicWidget = document.getElementById('musicWidget');
    const musicToggle = document.getElementById('musicToggle');
    const musicBars = document.querySelector('.music-bars');
    const cakeSection = document.getElementById('cakeSection');
    const celebrationBoard = document.getElementById('celebrationBoard');
    const interactiveCake = document.getElementById('interactiveCake');
    const flames = document.querySelectorAll('.flame');

    function initReveal() {
        // Prepare canvas-based confetti
        initConfetti();
        // Reset NO button style and return parent container
        resetNoButton();
    }

    // Blow candle logic
    interactiveCake.addEventListener('click', () => {
        // Extinguish flames
        flames.forEach(flame => {
            flame.classList.remove('active');
            flame.classList.add('extinguished');
        });

        playSFX(sfxCheer);
        
        // Start background music
        bgMusic.play().then(() => {
            musicWidget.style.display = 'flex';
            musicBars.classList.add('playing');
        }).catch(err => {
            console.log("Music auto-play blocked, showing play controls: ", err);
            musicWidget.style.display = 'flex'; // show play button anyway
        });

        // Trigger heavy confetti shower
        startConfettiShower();

        // Fade cake and show birthday content
        setTimeout(() => {
            cakeSection.style.display = 'none';
            celebrationBoard.classList.remove('hidden');
            
            // Re-render canvas size for full layout
            resizeCanvas();
        }, 1200);
    });

    // Background Music Controls
    musicToggle.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play();
            musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
            musicBars.classList.add('playing');
        } else {
            bgMusic.pause();
            musicToggle.innerHTML = '<i class="fas fa-music"></i>';
            musicBars.classList.remove('playing');
        }
        playSFX(sfxPop);
    });

    // Final Hidden Page (Relationship Report) Handlers
    const btnOpenReport = document.getElementById('btn-open-report');
    const btnReportClose = document.getElementById('btn-report-close');
    const reportOverlay = document.getElementById('reportOverlay');

    if (btnOpenReport && reportOverlay) {
        btnOpenReport.addEventListener('click', () => {
            playSFX(sfxPop);
            reportOverlay.classList.add('active');
            
            // Special heavy shower of hearts when opening the secret report
            for (let i = 0; i < 20; i++) {
                setTimeout(createHeart, i * 70);
            }
        });
    }

    if (btnReportClose && reportOverlay) {
        btnReportClose.addEventListener('click', () => {
            playSFX(sfxPop);
            reportOverlay.classList.remove('active');
        });
    }

    // Exit Portal (Logout) Handler
    const btnLogoutPortal = document.getElementById('btn-logout-portal');
    if (btnLogoutPortal) {
        btnLogoutPortal.addEventListener('click', () => {
            playSFX(sfxPop);
            
            // Pause music and reset time
            if (bgMusic) {
                bgMusic.pause();
                bgMusic.currentTime = 0;
            }
            if (musicWidget) {
                musicWidget.style.display = 'none';
            }
            if (musicBars) {
                musicBars.classList.remove('playing');
            }
            
            // Reset OTP inputs
            if (otpInputs) {
                otpInputs.forEach(input => input.value = '');
            }
            if (lockErrorMsg) {
                lockErrorMsg.style.display = 'none';
            }
            
            // Reset Quiz progress
            currentQuestionIndex = 0;
            if (quizProgress) {
                quizProgress.style.width = '0%';
            }
            
            // Reset Cake candles
            if (flames) {
                flames.forEach(flame => {
                    flame.classList.remove('extinguished');
                    flame.classList.add('active');
                });
            }
            
            // Hide celebration board and show cake section for next time
            if (cakeSection) {
                cakeSection.style.display = 'block';
            }
            if (celebrationBoard) {
                celebrationBoard.classList.add('hidden');
            }
            
            // Hide any open overlays
            const overlays = document.querySelectorAll('.selfie-overlay, .meme-overlay, .coupon-overlay, .weather-result-overlay, .hero-saver-overlay, .dogs-swarm-overlay, .stamp-overlay');
            overlays.forEach(overlay => overlay.classList.remove('active'));
            const customSwarm = document.getElementById('dogsSwarmOverlay');
            if (customSwarm) {
                customSwarm.style.display = 'none';
            }
            
            // Go to lock stage
            showStage('lock');
            
            // Focus first OTP box
            if (otpInputs && otpInputs.length > 0) {
                setTimeout(() => otpInputs[0].focus(), 500);
            }
        });
    }




    // --- HIGH-PERFORMANCE JS CONFETTI SYSTEM ---
    const confettiCanvas = document.getElementById('confetti-canvas');
    const confettiCtx = confettiCanvas.getContext('2d');
    let confettiParticles = [];
    let animationFrameId;
    let showerActive = false;

    const colors = [
        '#ff4b72', // Rose Pink
        '#8c7ae6', // Pastel Purple
        '#ffd700', // Gold
        '#00d2d3', // Cyan
        '#ff9f43', // Pastel Orange
        '#10ac84'  // Mint Green
    ];

    class Confetti {
        constructor() {
            this.x = Math.random() * confettiCanvas.width;
            this.y = Math.random() * -confettiCanvas.height - 20;
            this.size = Math.random() * 8 + 6;
            this.speed = Math.random() * 4 + 3;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 4 - 2;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.wind = Math.random() * 1.5 - 0.75;
        }

        update() {
            this.y += this.speed;
            this.x += this.wind;
            this.rotation += this.rotationSpeed;

            // Loop particles back to top if they fall off
            if (this.y > confettiCanvas.height) {
                if (showerActive) {
                    this.y = -20;
                    this.x = Math.random() * confettiCanvas.width;
                    this.speed = Math.random() * 4 + 3;
                } else {
                    // remove particle
                    return false;
                }
            }
            return true;
        }

        draw() {
            confettiCtx.save();
            confettiCtx.translate(this.x + this.size / 2, this.y + this.size / 2);
            confettiCtx.rotate((this.rotation * Math.PI) / 180);
            confettiCtx.fillStyle = this.color;
            confettiCtx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
            confettiCtx.restore();
        }
    }

    function initConfetti() {
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
    }

    function resizeCanvas() {
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
    }

    function startConfettiShower() {
        showerActive = true;
        confettiParticles = [];
        
        // Spawn 150 particles initially
        for (let i = 0; i < 150; i++) {
            confettiParticles.push(new Confetti());
        }

        function animate() {
            confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
            
            confettiParticles = confettiParticles.filter(p => {
                const keep = p.update();
                if (keep) p.draw();
                return keep;
            });

            // Keep spawning particles if active and count drops
            if (showerActive && confettiParticles.length < 120) {
                confettiParticles.push(new Confetti());
            }

            animationFrameId = requestAnimationFrame(animate);
        }

        animate();

        // Slowly ease off the heavy shower after 10 seconds to save performance
        setTimeout(() => {
            showerActive = false;
        }, 10000);
    }

    // Mobile touch slide tracking to dodge buttons if they drag finger near them
    document.addEventListener('touchmove', (e) => {
        if (e.touches.length === 0) return;
        const touch = e.touches[0];
        
        // Check quiz buttons
        if (stages.quiz.classList.contains('active')) {
            const btnDress = document.getElementById('option-free-dresses');
            if (btnDress) {
                const rect = btnDress.getBoundingClientRect();
                if (rect.width > 0 && rect.height > 0) {
                    const dist = getDistanceToRect(touch.clientX, touch.clientY, rect);
                    if (dist < 55) {
                        dodgeDressButton(e, btnDress);
                    }
                }
            }

            // Check general dodging buttons
            const dodgingButtons = document.querySelectorAll('[data-dodge="true"]');
            dodgingButtons.forEach(btn => {
                const rect = btn.getBoundingClientRect();
                if (rect.width === 0 || rect.height === 0) return;
                const dist = getDistanceToRect(touch.clientX, touch.clientY, rect);
                if (dist < 55) {
                    dodgeOptionButton(e, btn);
                }
            });
        }
        
        // Check contract NO button
        if (stages.contract.classList.contains('active')) {
            const rect = btnNo.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
                const dist = getDistanceToRect(touch.clientX, touch.clientY, rect);
                if (dist < 55) {
                    dodgeNoButton(e);
                }
            }
        }
    }, { passive: false });

});
