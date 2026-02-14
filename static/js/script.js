document.addEventListener('DOMContentLoaded', () => {

    // --- Global Theme Logic (Moved to Top) ---
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');

    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Apply theme immediately
    if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
        document.body.classList.add('dark');
        if (sunIcon) sunIcon.style.display = 'none';
        if (moonIcon) moonIcon.style.display = 'block';
    } else {
        if (sunIcon) sunIcon.style.display = 'block';
        if (moonIcon) moonIcon.style.display = 'none';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark');
            const isDark = document.body.classList.contains('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');

            if (sunIcon) sunIcon.style.display = isDark ? 'none' : 'block';
            if (moonIcon) moonIcon.style.display = isDark ? 'block' : 'none';

            // Update Chart if exists
            const chart = Chart.getChart("progressChart");
            if (chart) {
                // calls the function defined later
                updateChartColors(chart, isDark);
            }
        });
    }

    // --- Typing Test Logic ---
    const typingText = document.getElementById('typing-text');
    const timerElement = document.getElementById('timer');
    const wpmElement = document.getElementById('wpm');
    const accuracyElement = document.getElementById('accuracy');
    const restartBtn = document.getElementById('restart-btn');
    const timeOptions = document.querySelectorAll('.time-option');
    const modeOptions = document.querySelectorAll('.mode-option');
    const keys = document.querySelectorAll('.key');

    let timeLeft = 30;
    let initialTime = 30;
    let timer = null;
    let isTyping = false;
    let mistakes = 0;
    let correctChars = 0;
    let mode = 'words';
    let audioCtx = null;

    // Pagination variables
    const WORDS_PER_PAGE = 30;
    let sessionTotalChars = 0; // Total chars typed in session (for WPM)
    let localCharIndex = 0;    // Index within current page
    let text = "";             // Current page text

    const words = [
        "the", "be", "of", "and", "a", "to", "in", "he", "have", "it", "that", "for", "they", "i", "with", "as", "not", "on", "she", "at", "by", "this", "we", "you", "do", "but", "from", "or", "which", "one", "would", "all", "will", "there", "say", "who", "make", "when", "can", "more", "if", "no", "man", "out", "other", "so", "what", "time", "up", "go", "about", "than", "into", "could", "state", "only", "new", "year", "some", "take", "come", "these", "know", "see", "use", "get", "like", "then", "first", "any", "work", "now", "may", "such", "give", "over", "think", "most", "even", "find", "day", "also", "after", "way", "many", "must", "look", "before", "great", "back", "through", "long", "where", "much", "should", "well", "people", "down", "own", "just", "because", "good", "each", "those", "feel", "seem", "how", "high", "too", "place", "little", "world", "very", "still", "nation", "hand", "old", "life", "tell", "write", "become", "here", "show", "house", "both", "between", "need", "mean", "call", "develop", "under", "last", "right", "move", "thing", "general", "school", "never", "same", "another", "begin", "while", "number", "part", "turn", "real", "leave", "might", "want", "point", "form", "off", "child", "few", "small", "since", "against", "ask", "late", "home", "interest", "large", "person", "end", "open", "public", "follow", "during", "present", "without", "again", "hold", "govern", "around", "possible", "head", "consider", "word", "program", "problem", "however", "lead", "system", "set", "order", "eye", "plan", "run", "keep", "face", "fact", "group", "play", "stand", "increase", "early", "course", "change", "help", "line", "coding", "algorithm", "python", "javascript", "react", "flask", "database", "server", "cloud", "design", "interface", "modern", "future", "cyber", "neon", "speed", "power", "energy", "visual", "audio", "system", "data", "compute", "logic", "matrix"
    ];

    const sentences = [
        "The quick brown fox jumps over the lazy dog.",
        "A journey of a thousand miles begins with a single step.",
        "To be or not to be, that is the question.",
        "All that glitters is not gold.",
        "Actions speak louder than words.",
        "Simplicity is the soul of wit.",
        "Knowledge is power.",
        "Code is poetry written for machines."
    ];

    const numbers = "0123456789";
    const punctuation = ".,!?;:'\"()[]{}-_+=@#$%^&*";

    function initAudio() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    function generateContent(count = WORDS_PER_PAGE) {
        let newText = "";
        let generatedCount = 0;

        while (generatedCount < count) {
            if (mode === 'sentences') {
                newText += sentences[Math.floor(Math.random() * sentences.length)] + " ";
                generatedCount += 5;
            } else if (mode === 'numbers') {
                if (Math.random() > 0.6) {
                    newText += words[Math.floor(Math.random() * words.length)];
                } else {
                    let numLen = Math.floor(Math.random() * 4) + 1;
                    for (let j = 0; j < numLen; j++) newText += numbers[Math.floor(Math.random() * numbers.length)];
                }
                newText += " ";
                generatedCount++;
            } else if (mode === 'punctuation') {
                if (Math.random() > 0.5) {
                    newText += words[Math.floor(Math.random() * words.length)];
                } else {
                    let puncLen = Math.floor(Math.random() * 3) + 1;
                    for (let j = 0; j < puncLen; j++) newText += punctuation[Math.floor(Math.random() * punctuation.length)];
                }
                newText += " ";
                generatedCount++;
            } else {
                newText += words[Math.floor(Math.random() * words.length)] + " ";
                generatedCount++;
            }
        }
        return newText;
    }

    function setNewPage() {
        typingText.innerHTML = "";
        typingText.scrollTop = 0;

        text = generateContent(WORDS_PER_PAGE);

        // Better approach: iterate text and group into words
        // But our logic relies on flat list of spans.
        // Let's create word wrappers but keep individual spans addressable via querySelectorAll("span")

        let wordDiv = document.createElement("div");
        wordDiv.className = "word";

        text.split("").forEach(char => {
            let span = document.createElement("span");
            span.innerText = char;

            if (char === " ") {
                wordDiv.appendChild(span);
                typingText.appendChild(wordDiv);
                wordDiv = document.createElement("div");
                wordDiv.className = "word";
            } else {
                wordDiv.appendChild(span);
            }
        });
        // Append last word if exists
        if (wordDiv.hasChildNodes()) {
            typingText.appendChild(wordDiv);
        }

        // Create Cursor
        const cursorSpan = document.createElement("span");
        cursorSpan.className = "cursor";
        typingText.appendChild(cursorSpan);

        localCharIndex = 0;
        // Use specific selector to avoid selecting the cursor span itself as a char
        updateCursor(typingText.querySelectorAll(".word span"), 0);
    }

    function resetGame() {
        clearInterval(timer);
        timeLeft = initialTime;
        mistakes = 0;
        isTyping = false;
        correctChars = 0;
        timerElement.innerText = timeLeft;
        wpmElement.innerText = 0;
        accuracyElement.innerText = 100;

        sessionTotalChars = 0;

        setNewPage();

        const modal = document.getElementById('results-modal');
        const overlay = document.getElementById('modal-overlay');
        modal.style.display = 'none';
        overlay.style.display = 'none';

        typingText.focus();
    }

    function initTyping(e) {
        initAudio();

        // Specific selector for characters only
        let chars = typingText.querySelectorAll(".word span");
        let typedChar = e.key;

        if (e.key === 'Shift') {
            toggleShift(true);
            return;
        }

        highlightKey(typedChar);

        if (!isTyping) {
            timer = setInterval(initTimer, 1000);
            isTyping = true;
        }

        if (timerElement.innerText <= 0) return;

        // Pagination: Auto-load next page if current is done
        if (localCharIndex >= chars.length) {
            setNewPage();
            chars = typingText.querySelectorAll(".word span");
        }

        if (typedChar === 'Backspace') {
            if (localCharIndex > 0) {
                if (chars[localCharIndex - 1].classList.contains("incorrect")) {
                    mistakes--;
                }
                localCharIndex--;
                sessionTotalChars--;
                chars[localCharIndex].classList.remove("correct", "incorrect");
                updateCursor(chars, localCharIndex);
            }
        } else if (typedChar.length === 1) {
            if (localCharIndex >= chars.length) {
                setNewPage();
                chars = typingText.querySelectorAll(".word span");
            }

            if (typedChar === chars[localCharIndex].innerText) {
                chars[localCharIndex].classList.add("correct");
                correctChars++;
                playTone('correct');
            } else {
                chars[localCharIndex].classList.add("incorrect");
                mistakes++;
                playTone('error');
            }

            // Check if word completed (space typed)
            if (typedChar === " ") {
                const currentSpan = chars[localCharIndex];
                const currentWordDiv = currentSpan.parentElement;

                // Check if all spans in this word are correct (excluding the space itself)
                const spans = currentWordDiv.querySelectorAll('span');
                let allCorrect = true;
                spans.forEach(s => {
                    if (s.innerText !== " " && !s.classList.contains('correct')) {
                        allCorrect = false;
                    }
                    if (s.classList.contains('incorrect')) {
                        allCorrect = false;
                    }
                });

                if (allCorrect) {
                    currentWordDiv.classList.add('correct-word');
                }
            }

            localCharIndex++;
            sessionTotalChars++;
            updateCursor(chars, localCharIndex);

            if (localCharIndex >= chars.length) {
                setTimeout(() => {
                    setNewPage();
                }, 100);
            }
        }

        let timeElapsed = initialTime - timeLeft;
        if (timeElapsed > 0) {
            let wpm = Math.round(((sessionTotalChars - mistakes) / 5) / (timeElapsed / 60));
            wpm = wpm < 0 ? 0 : wpm;
            wpmElement.innerText = wpm;

            let accuracy = Math.floor(((sessionTotalChars - mistakes) / sessionTotalChars) * 100);
            accuracy = accuracy < 0 || isNaN(accuracy) ? 100 : accuracy;
            accuracyElement.innerText = accuracy;
        }
    }

    function updateCursor(chars, index) {
        const cursor = document.querySelector('.cursor');
        if (!cursor) return;

        if (index < chars.length) {
            const char = chars[index];
            cursor.style.left = char.offsetLeft + 'px';
            cursor.style.top = char.offsetTop + 'px';
        } else if (chars.length > 0) {
            // End of text, position after last char
            const lastChar = chars[chars.length - 1];
            cursor.style.left = (lastChar.offsetLeft + lastChar.offsetWidth) + 'px';
            cursor.style.top = lastChar.offsetTop + 'px';
        } else {
            // Empty (start)
            cursor.style.left = '0px';
            cursor.style.top = '0px';
        }
    }

    function toggleShift(active) {
        keys.forEach(key => {
            const shiftVal = key.dataset.shift;
            if (shiftVal) {
                if (active) {
                    key.innerText = shiftVal;
                } else {
                    if (key.dataset.key.match(/[a-z]/i) && key.dataset.key.length === 1) {
                        key.innerText = key.dataset.key.toUpperCase();
                    } else {
                        key.innerText = key.dataset.key === 'Space' ? 'Space' : key.dataset.key;
                        if (key.dataset.key === 'Backspace') key.innerText = 'Bksp';
                        if (key.dataset.key === 'Tab') key.innerText = 'Tab';
                        if (key.dataset.key === 'CapsLock') key.innerText = 'Caps';
                        if (key.dataset.key === 'Enter') key.innerText = 'Enter';
                        if (key.dataset.key === 'Shift') key.innerText = 'Shift';
                    }
                }
            }
        });
    }

    document.addEventListener('keyup', (e) => {
        if (e.key === 'Shift') toggleShift(false);
    });

    function initTimer() {
        if (timeLeft > 0) {
            timeLeft--;
            timerElement.innerText = timeLeft;

            let timeElapsed = initialTime - timeLeft;
            let wpm = Math.round(((sessionTotalChars - mistakes) / 5) / (timeElapsed / 60));
            wpm = wpm < 0 ? 0 : wpm;
            wpmElement.innerText = wpm;

        } else {
            clearInterval(timer);
            finishTest();
        }
    }

    function finishTest() {
        isTyping = false;
        const modal = document.getElementById('results-modal');
        const overlay = document.getElementById('modal-overlay');
        const finalWpm = document.getElementById('final-wpm');
        const finalAcc = document.getElementById('final-accuracy');
        const finalMistakes = document.getElementById('final-mistakes');

        finalWpm.innerText = wpmElement.innerText + " WPM";
        finalAcc.innerText = accuracyElement.innerText + "%";
        finalMistakes.innerText = mistakes;

        modal.style.display = 'block';
        overlay.style.display = 'block';

        saveResultToDB();
    }

    function saveResultToDB() {
        fetch('/save_result', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                wpm: parseInt(wpmElement.innerText),
                accuracy: parseFloat(accuracyElement.innerText),
                mistakes: mistakes,
                total_characters: sessionTotalChars,
                mode: mode + '_' + initialTime,
                duration: initialTime
            })
        }).then(res => { if (res.ok) console.log("Saved"); });
    }

    function highlightKey(key) {
        if (key === ' ') key = 'Space';

        let targetKey = null;

        keys.forEach(k => {
            const normal = k.dataset.key;
            const shifted = k.dataset.shift;

            if (
                normal === key ||
                (normal && normal.toLowerCase() === key.toLowerCase()) ||
                shifted === key
            ) {
                targetKey = k;
            }
        });

        if (targetKey) {
            targetKey.classList.add('active');
            setTimeout(() => targetKey.classList.remove('active'), 100);
        }
    }


    function playTone(type) {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        const now = audioCtx.currentTime;

        if (type === 'correct') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
            gainNode.gain.setValueAtTime(0.3, now); // Increased volume
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
        } else {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.linearRampToValueAtTime(100, now + 0.15);
            gainNode.gain.setValueAtTime(0.2, now);
            gainNode.gain.linearRampToValueAtTime(0.01, now + 0.15);
            osc.start(now);
            osc.stop(now + 0.15);
        }
    }

    if (typingText) {
        typingText.addEventListener('keydown', (e) => {
            if (e.key === ' ') e.preventDefault();
            if (e.key === 'Shift') { initTyping(e); return; }
            if (e.key.length > 1 && e.key !== 'Backspace') return;
            initTyping(e);
        });

        typingText.addEventListener('click', () => { typingText.focus(); initAudio(); });
        document.addEventListener('keydown', () => typingText.focus());

        if (typeof resetGame === 'function') {
            if (restartBtn) restartBtn.addEventListener('click', resetGame);
            const closeModal = document.getElementById('close-modal');
            if (closeModal) closeModal.addEventListener('click', resetGame);
        }
    }


    function updateChartColors(chart, isDark) {
        const borderColor = isDark ? '#00f2ff' : '#4f46e5';
        const bgColor = isDark ? 'rgba(0, 242, 255, 0.2)' : 'rgba(79, 70, 229, 0.2)';
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        const textColor = isDark ? '#8b949e' : '#64748b';

        if (chart.data && chart.data.datasets && chart.data.datasets[0]) {
            chart.data.datasets[0].borderColor = borderColor;
            chart.data.datasets[0].backgroundColor = bgColor;
        }

        if (chart.options && chart.options.scales) {
            if (chart.options.scales.y && chart.options.scales.y.grid) chart.options.scales.y.grid.color = gridColor;
            if (chart.options.scales.x && chart.options.scales.x.ticks) chart.options.scales.x.ticks.color = textColor;
            if (chart.options.scales.y && chart.options.scales.y.ticks) chart.options.scales.y.ticks.color = textColor;
        }

        if (chart.options && chart.options.plugins && chart.options.plugins.legend && chart.options.plugins.legend.labels) {
            chart.options.plugins.legend.labels.color = textColor;
        }

        chart.update();
    }

    timeOptions.forEach(o => o.addEventListener('click', () => {
        timeOptions.forEach(x => x.classList.remove('active'));
        o.classList.add('active');
        initialTime = parseInt(o.dataset.time);
        resetGame();
    }));

    modeOptions.forEach(o => o.addEventListener('click', () => {
        modeOptions.forEach(x => x.classList.remove('active'));
        o.classList.add('active');
        mode = o.dataset.mode;
        resetGame();
    }));

    resetGame();
});
