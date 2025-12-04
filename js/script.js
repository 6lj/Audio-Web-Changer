const translations = {
    en: {
        title: "Audio Web Changer",
        description: "A tool for speeding up and slowing down music, adding audio effects, and enhancing sound quality with ease",
        uploadTitle: "Upload Your MP3 Files",
        uploadDesc: "Drag and drop files here, or click to select them from your device",
        chooseFiles: "Choose Files",
        uploadedFiles: "Uploaded Files",
        noAudioFile: "No audio file selected",
        previousFile: "Previous File",
        playPause: "Play/Pause",
        nextFile: "Next File",
        loop: "Loop",
        shuffle: "Shuffle",
        processAudio: "Process Audio",
        downloadResult: "Download Result",
        reset: "Reset",
        playbackSpeed: "Playback Speed",
        verySlow: "Very Slow",
        veryFast: "Very Fast",
        pitch: "Pitch",
        low: "Low",
        high: "High",
        volumeLevel: "Volume Level",
        mute: "Mute",
        veryHigh: "Very High",
        addFile: "Add File",
        anotherFile: "Another File",
        manageFiles: "Manage Files",
        quickEffects: "Quick Effects",
        switchToArabic: "العربيه",
        switchToEnglish: "English"
    },
    ar: {
        title: "معالج الصوت المتقدم",
        description: "أداة احترافية لتسريع وبطء الموسيقى، إضافة التأثيرات الصوتية، وتحسين جودة الصوت بسهولة تامة",
        uploadTitle: "ارفع ملفات MP3 الخاصة بك",
        uploadDesc: "اسحب الملفات وأفلتها هنا، أو انقر لاختيارها من جهازك",
        chooseFiles: "اختر الملفات",
        uploadedFiles: "الملفات المرفوعة",
        noAudioFile: "لم يتم تحديد ملف صوتي",
        previousFile: "الملف السابق",
        playPause: "تشغيل/إيقاف",
        nextFile: "الملف التالي",
        loop: "تكرار",
        shuffle: "خلط عشوائي",
        processAudio: "معالجة الصوت",
        downloadResult: "تحميل النتيجة",
        reset: "إعادة تعيين",
        playbackSpeed: "سرعة التشغيل",
        verySlow: "بطيء جداً",
        veryFast: "سريع جداً",
        pitch: "النغمة",
        low: "منخفضة",
        high: "مرتفعة",
        volumeLevel: "مستوى الصوت",
        mute: "صامت",
        veryHigh: "عالي جداً",
        addFile: "إضافة ملف",
        anotherFile: "ملف آخر",
        manageFiles: "إدارة الملفات",
        quickEffects: "التأثيرات السريعة",
        switchToArabic: "العربيه",
        switchToEnglish: "English"
    }
};

let currentLanguage = 'en';

let audioFiles = [];
let currentAudioIndex = 0;
let audioContext = null;
let audioBuffer = null;
let audioSource = null;
let gainNode = null;
let isPlaying = false;
let processedBuffer = null;
let currentSource = null;
let startTime = 0;
let pausedAt = 0;
let isLooping = false;
let isShuffling = false;

let currentEffect = 'none';
let visualizerParticles = [];
let effectColors = {
    'none': 0xffffff,
    'slowed': 0x00ffff,
    'sped': 0xffa500,
    'nightcore': 0xff00ff,
    'daycore': 0xffd700,
    'reverb': 0x00ff00,
    'echo': 0xff1493,
    'deep': 0x8a2be2,
    'chipmunk': 0xff6347
};

let effectSettings = {
    'none': { speed: 1.0, size: 1.0, intensity: 0.5 },
    'slowed': { speed: 0.5, size: 1.2, intensity: 0.8 },
    'sped': { speed: 2.5, size: 0.8, intensity: 1.2 },
    'nightcore': { speed: 1.8, size: 1.0, intensity: 1.5 },
    'daycore': { speed: 0.7, size: 1.3, intensity: 0.9 },
    'reverb': { speed: 1.2, size: 1.1, intensity: 1.1 },
    'echo': { speed: 1.4, size: 0.9, intensity: 1.3 },
    'deep': { speed: 0.6, size: 1.4, intensity: 0.7 },
    'chipmunk': { speed: 1.6, size: 0.7, intensity: 1.4 }
};

let hasAudioFile = false;

const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const fileList = document.getElementById('fileList');
const fileItems = document.getElementById('fileItems');
let isFileDialogOpen = false;
const audioPlayer = document.getElementById('audioPlayer');
const audioTitle = document.getElementById('audioTitle');
const playBtn = document.getElementById('playBtn');
const progressBar = document.getElementById('progressBar');
const progressFill = document.getElementById('progressFill');
const currentTime = document.getElementById('currentTime');
const totalTime = document.getElementById('totalTime');
const speedSlider = document.getElementById('speedSlider');
const pitchSlider = document.getElementById('pitchSlider');
const volumeSlider = document.getElementById('volumeSlider');
const processBtn = document.getElementById('processBtn');
const downloadBtn = document.getElementById('downloadBtn');
const notification = document.getElementById('notification');
const languageToggle = document.getElementById('languageToggle');

function switchLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'ar' : 'en';

    document.querySelector('.header h1').innerHTML = `<i class="fas fa-music"></i> ${translations[currentLanguage].title}`;
    document.querySelector('.header p').textContent = translations[currentLanguage].description;
    document.querySelector('.upload-text h3').textContent = translations[currentLanguage].uploadTitle;
    document.querySelector('.upload-text p').textContent = translations[currentLanguage].uploadDesc;
    document.getElementById('uploadBtn').innerHTML = `<i class="fas fa-folder-open"></i> ${translations[currentLanguage].chooseFiles}`;
    document.querySelector('.file-list-title').innerHTML = `<i class="fas fa-list-music"></i> ${translations[currentLanguage].uploadedFiles}`;
    document.getElementById('audioTitle').textContent = translations[currentLanguage].noAudioFile;
    document.getElementById('prevBtn').title = translations[currentLanguage].previousFile;
    document.getElementById('playBtn').title = translations[currentLanguage].playPause;
    document.getElementById('nextBtn').title = translations[currentLanguage].nextFile;
    document.getElementById('loopBtn').title = translations[currentLanguage].loop;
    document.getElementById('shuffleBtn').title = translations[currentLanguage].shuffle;
    document.getElementById('processBtn').innerHTML = `<i class="fas fa-cog"></i> ${translations[currentLanguage].processAudio}`;
    document.getElementById('downloadBtn').innerHTML = `<i class="fas fa-download"></i> ${translations[currentLanguage].downloadResult}`;
    document.getElementById('resetBtn').innerHTML = `<i class="fas fa-undo"></i> ${translations[currentLanguage].reset}`;

    const controlTitles = document.querySelectorAll('.control-title');
    const titleMappings = [
        translations[currentLanguage].playbackSpeed,
        translations[currentLanguage].pitch,
        translations[currentLanguage].volumeLevel,
        translations[currentLanguage].addFile
    ];
    controlTitles.forEach((title, index) => {
        if (titleMappings[index]) {
            title.textContent = titleMappings[index];
        }
    });

    document.querySelector('.slider-label').innerHTML = `
        <span>${translations[currentLanguage].verySlow}</span>
        <span id="speedValue" class="value-display">1.0x</span>
        <span>${translations[currentLanguage].veryFast}</span>
    `;

    document.querySelectorAll('.slider-label')[1].innerHTML = `
        <span>${translations[currentLanguage].low}</span>
        <span id="pitchValue" class="value-display">0</span>
        <span>${translations[currentLanguage].high}</span>
    `;

    document.querySelectorAll('.slider-label')[2].innerHTML = `
        <span>${translations[currentLanguage].mute}</span>
        <span id="volumeValue" class="value-display">100%</span>
        <span>${translations[currentLanguage].veryHigh}</span>
    `;

    document.getElementById('newFileBtn').innerHTML = `<i class="fas fa-plus"></i> ${translations[currentLanguage].anotherFile}`;
    document.getElementById('manageFilesBtn').innerHTML = `<i class="fas fa-list"></i> ${translations[currentLanguage].manageFiles}`;
    document.querySelector('.effects-title').innerHTML = `<i class="fas fa-magic"></i> ${translations[currentLanguage].quickEffects}`;

    languageToggle.innerHTML = `<i class="fas fa-globe"></i> ${currentLanguage === 'en' ? translations[currentLanguage].switchToArabic : translations[currentLanguage].switchToEnglish}`;
    languageToggle.title = currentLanguage === 'en' ? 'Switch to Arabic' : 'Switch to English';

    document.documentElement.lang = currentLanguage;
    document.documentElement.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';
    document.body.style.direction = currentLanguage === 'ar' ? 'rtl' : 'ltr';

    const elementsToAlign = document.querySelectorAll('.control-title, .effects-title, .file-list-title');
    elementsToAlign.forEach(el => {
        el.style.textAlign = currentLanguage === 'ar' ? 'right' : 'left';
    });

    updateSpeedValue();
    updatePitchValue();
    updateVolumeValue();
}

languageToggle.addEventListener('click', switchLanguage);

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
});

function openFileDialog() {
    if (isFileDialogOpen) return; 

    isFileDialogOpen = true;
    fileInput.click();

    setTimeout(() => {
        isFileDialogOpen = false;
    }, 1000);
}

uploadArea.addEventListener('click', (e) => {

    if (e.target.closest('.upload-btn')) return;
    openFileDialog();
});

document.getElementById('uploadBtn').addEventListener('click', () => {
    openFileDialog();
});

fileInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
    isFileDialogOpen = false; 

});

fileInput.addEventListener('blur', () => {
    setTimeout(() => {
        isFileDialogOpen = false;
    }, 100);
});

function handleFiles(files) {
    const audioFilesFiltered = files.filter(file =>
        file.type.startsWith('audio/') || file.name.toLowerCase().endsWith('.mp3')
    );

    if (audioFilesFiltered.length === 0) {
        showNotification(currentLanguage === 'ar' ? 'يرجى اختيار ملفات صوتية فقط (MP3, WAV, OGG, إلخ)' : 'Please select audio files only (MP3, WAV, OGG, etc.)', 'error');
        return;
    }

    audioFiles = [...audioFiles, ...audioFilesFiltered];
    updateFileList();

    if (audioFiles.length > 0 && audioPlayer.style.display === 'none') {

        document.getElementById('fileList').style.display = 'block';

        setTimeout(() => {
            loadAudio(audioFiles[0]);
        }, 1500);
    }

    showNotification(`${audioFilesFiltered.length} ${currentLanguage === 'ar' ? 'ملف تم رفعه بنجاح! 🎵' : 'file(s) uploaded successfully! 🎵'}`);
}

function updateFileList() {
    fileItems.innerHTML = '';
    audioFiles.forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <div class="file-icon">
                <i class="fas fa-music"></i>
            </div>
            <div class="file-info">
                <h5>${file.name}</h5>
                <p>${formatFileSize(file.size)} • ${file.type || 'MP3'}</p>
            </div>
            <div class="file-actions">
                <button class="file-action-btn remove-btn" onclick="removeFile(${index})" title="حذف الملف">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        fileItem.addEventListener('click', () => loadAudio(file, index));
        fileItems.appendChild(fileItem);
    });

    if (audioFiles.length > 0) {
        fileList.style.display = 'block';
    } else {
        fileList.style.display = 'none';
    }
}

function removeFile(index) {
    if (currentAudioIndex === index && isPlaying) {
        stopAudio();
    }

    audioFiles.splice(index, 1);

    if (audioFiles.length === 0) {
        fileList.style.display = 'none';
        audioPlayer.style.display = 'none';
        hasAudioFile = false;
        currentEffect = 'none';
        resetAudio();
    } else {
        if (currentAudioIndex >= audioFiles.length) {
            currentAudioIndex = audioFiles.length - 1;
        }
        updateFileList();
        loadAudio(audioFiles[currentAudioIndex]);
    }
}

function loadAudio(file, index = 0) {
    currentAudioIndex = index;
    audioTitle.textContent = file.name;

    const loadingBar = document.getElementById('loadingBar');
    const loadingProgress = document.getElementById('loadingProgress');
    const loadingText = document.getElementById('loadingText');

    loadingBar.style.display = 'block';
    loadingProgress.style.width = '0%';
    loadingText.textContent = currentLanguage === 'ar' ? 'جاري تحميل الملف...' : 'Loading file...';

    document.getElementById('fileList').style.display = 'none';

    if (!audioContext) {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            loadingBar.style.display = 'none';
            showNotification(currentLanguage === 'ar' ? 'متصفحك لا يدعم معالجة الصوت المتقدمة' : 'Your browser does not support advanced audio processing', 'error');
            return;
        }
    }

    const reader = new FileReader();
    reader.onloadstart = () => {
        loadingText.textContent = currentLanguage === 'ar' ? 'بدء تحميل الملف...' : 'Starting file upload...';
    };

    reader.onprogress = (e) => {
        if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            loadingProgress.style.width = percentComplete + '%';
            loadingText.textContent = `${currentLanguage === 'ar' ? 'تحميل...' : 'Loading...'} ${Math.round(percentComplete)}%`;
        }
    };

    reader.onload = (e) => {
        loadingText.textContent = currentLanguage === 'ar' ? 'معالجة الصوت...' : 'Processing audio...';
        loadingProgress.style.width = '90%';

        audioContext.decodeAudioData(e.target.result, (buffer) => {
            audioBuffer = buffer;
            processedBuffer = buffer;
            hasAudioFile = true;

            loadingProgress.style.width = '100%';
            loadingText.textContent = currentLanguage === 'ar' ? 'تم التحميل بنجاح!' : 'Loaded successfully!';

            setTimeout(() => {
                loadingBar.style.display = 'none';

                document.querySelector('.upload-section').style.display = 'none';
                audioPlayer.style.display = 'block';
                setTimeout(() => audioPlayer.classList.add('show'), 10);

                currentEffect = 'none';

                updateDuration();

                showNotification(currentLanguage === 'ar' ? 'تم تحميل الملف بنجاح! 🎧' : 'File loaded successfully! 🎧');
            }, 500);

        }, (error) => {
            loadingBar.style.display = 'none';
            showNotification(currentLanguage === 'ar' ? 'خطأ في قراءة ملف الصوت' : 'Error reading audio file', 'error');
            console.error('Error decoding audio:', error);
        });
    };
    reader.onerror = () => {
        loadingBar.style.display = 'none';
        showNotification(currentLanguage === 'ar' ? 'خطأ في قراءة الملف' : 'Error reading file', 'error');
    };
    reader.readAsArrayBuffer(file);
}

function updateDuration() {
    if (audioBuffer) {
        const duration = audioBuffer.duration;
        totalTime.textContent = formatTime(duration);
        currentTime.textContent = '00:00';
        progressFill.style.width = '0%';
    }
}

playBtn.addEventListener('click', () => {
    if (isPlaying) {
        pauseAudio();
    } else {
        playAudio();
    }
});

function playAudio() {
    if (!processedBuffer) return;

    if (currentSource) {
        currentSource.stop();
    }

    currentSource = audioContext.createBufferSource();
    currentSource.buffer = processedBuffer;

    const playbackRate = currentSpeed * Math.pow(2, currentPitch / 12);
    currentSource.playbackRate.setValueAtTime(playbackRate, audioContext.currentTime);

    gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(currentVolume, audioContext.currentTime);

    currentSource.connect(gainNode);
    gainNode.connect(audioContext.destination);

    const startOffset = pausedAt;
    startTime = audioContext.currentTime - startOffset;

    currentSource.start(0, startOffset);
    isPlaying = true;
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';

    currentEffect = currentEffect || 'none';

    updateProgress();

    currentSource.onended = () => {
        if (isLooping) {
            pausedAt = 0;
            playAudio();
        } else if (isShuffling) {
            playRandomTrack();
        } else {
            nextTrack();
        }
    };
}

function pauseAudio() {
    if (currentSource && isPlaying) {
        currentSource.stop();
        pausedAt = audioContext.currentTime - startTime;
        isPlaying = false;
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
}

function stopAudio() {
    if (currentSource) {
        currentSource.stop();
        currentSource = null;
    }
    isPlaying = false;
    pausedAt = 0;
    startTime = 0;
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    progressFill.style.width = '0%';
    currentTime.textContent = '00:00';
}

function updateProgress() {
    if (!isPlaying) return;

    const current = audioContext.currentTime - startTime;
    const duration = processedBuffer.duration;
    const progress = (current / duration) * 100;

    progressFill.style.width = Math.min(progress, 100) + '%';
    currentTime.textContent = formatTime(current);

    if (current < duration) {
        requestAnimationFrame(updateProgress);
    }
}

progressBar.addEventListener('click', (e) => {
    if (!processedBuffer) return;

    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * processedBuffer.duration;

    if (isPlaying) {
        pauseAudio();
        pausedAt = newTime;
        playAudio();
    } else {
        pausedAt = newTime;
        progressFill.style.width = percentage * 100 + '%';
        currentTime.textContent = formatTime(newTime);
    }
});

document.getElementById('prevBtn').addEventListener('click', prevTrack);
document.getElementById('nextBtn').addEventListener('click', nextTrack);
document.getElementById('loopBtn').addEventListener('click', toggleLoop);
document.getElementById('shuffleBtn').addEventListener('click', toggleShuffle);

function prevTrack() {
    if (audioFiles.length === 0) return;

    if (isShuffling) {
        playRandomTrack();
    } else {
        currentAudioIndex = (currentAudioIndex - 1 + audioFiles.length) % audioFiles.length;
        loadAudio(audioFiles[currentAudioIndex]);
    }
}

function nextTrack() {
    if (audioFiles.length === 0) return;

    if (isShuffling) {
        playRandomTrack();
    } else {
        currentAudioIndex = (currentAudioIndex + 1) % audioFiles.length;
        loadAudio(audioFiles[currentAudioIndex]);
    }
}

function playRandomTrack() {
    if (audioFiles.length <= 1) return;

    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * audioFiles.length);
    } while (randomIndex === currentAudioIndex);

    currentAudioIndex = randomIndex;
    loadAudio(audioFiles[currentAudioIndex]);
}

function toggleLoop() {
    isLooping = !isLooping;
    document.getElementById('loopBtn').classList.toggle('active', isLooping);
    showNotification(isLooping ?
        (currentLanguage === 'ar' ? 'تم تفعيل التكرار 🔄' : 'Loop enabled 🔄') :
        (currentLanguage === 'ar' ? 'تم إلغاء التكرار' : 'Loop disabled'));
}

function toggleShuffle() {
    isShuffling = !isShuffling;
    document.getElementById('shuffleBtn').classList.toggle('active', isShuffling);
    showNotification(isShuffling ?
        (currentLanguage === 'ar' ? 'تم تفعيل الخلط العشوائي 🔀' : 'Shuffle enabled 🔀') :
        (currentLanguage === 'ar' ? 'تم إلغاء الخلط العشوائي' : 'Shuffle disabled'));
}

function applyEffect(effect, buttonElement) {
    if (!audioBuffer) {
        showNotification(currentLanguage === 'ar' ? 'يرجى رفع ملف صوتي أولاً' : 'Please upload an audio file first', 'error');
        return;
    }

    document.querySelectorAll('.effect-btn.active').forEach(btn => {
        btn.classList.remove('active');
    });

    if (buttonElement) {
        buttonElement.classList.add('active');
    }

    currentEffect = effect;

    createEffectFlash(effect);

    processedBuffer = audioBuffer; 

    switch (effect) {
        case 'slowed':
            speedSlider.value = 0.75;
            pitchSlider.value = -1;
            currentSpeed = 0.75;
            currentPitch = -1;
            updateSpeedValue();
            updatePitchValue();
            break;
        case 'sped':
            speedSlider.value = 1.5;
            pitchSlider.value = 1;
            currentSpeed = 1.5;
            currentPitch = 1;
            updateSpeedValue();
            updatePitchValue();
            break;
        case 'nightcore':
            speedSlider.value = 1.25;
            pitchSlider.value = 3;
            currentSpeed = 1.25;
            currentPitch = 3;
            updateSpeedValue();
            updatePitchValue();
            break;
        case 'daycore':
            speedSlider.value = 0.8;
            pitchSlider.value = -3;
            currentSpeed = 0.8;
            currentPitch = -3;
            updateSpeedValue();
            updatePitchValue();
            break;
        case 'reverb':

            applyReverbEffect();
            break;
        case 'echo':

            applyEchoEffect();
            break;
        case 'deep':
            pitchSlider.value = -6;
            speedSlider.value = 0.9;
            currentPitch = -6;
            currentSpeed = 0.9;
            updatePitchValue();
            updateSpeedValue();
            break;
        case 'chipmunk':
            pitchSlider.value = 8;
            speedSlider.value = 1.2;
            currentPitch = 8;
            currentSpeed = 1.2;
            updatePitchValue();
            updateSpeedValue();
            break;
        default:
            showNotification(`تأثير ${effect} قيد التطوير`);
            return;
    }

    if (isPlaying) {
        applyRealtimeChanges();
    }

    showNotification(`${currentLanguage === 'ar' ? 'تم تطبيق تأثير' : 'Applied effect'} ${effect} ✨`);

    createScreenEffect(effect);
}

function applyReverbEffect() {
    if (!audioContext || !audioBuffer) return;

    try {

        const reverbNode = audioContext.createConvolver();

        const length = audioContext.sampleRate * 2; 

        const impulse = audioContext.createBuffer(2, length, audioContext.sampleRate);

        for (let channel = 0; channel < 2; channel++) {
            const channelData = impulse.getChannelData(channel);
            for (let i = 0; i < length; i++) {

                channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
            }
        }

        reverbNode.buffer = impulse;

        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;

        const gainNode = audioContext.createGain();
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime); 

        const dryGain = audioContext.createGain();
        dryGain.gain.setValueAtTime(0.7, audioContext.currentTime); 

        source.connect(dryGain);
        source.connect(reverbNode);
        reverbNode.connect(gainNode);

        const outputBuffer = audioContext.createBuffer(
            audioBuffer.numberOfChannels,
            audioBuffer.length,
            audioBuffer.sampleRate
        );

        const offlineContext = new OfflineAudioContext(
            audioBuffer.numberOfChannels,
            audioBuffer.length,
            audioBuffer.sampleRate
        );

        const offlineSource = offlineContext.createBufferSource();
        offlineSource.buffer = audioBuffer;

        const offlineDryGain = offlineContext.createGain();
        offlineDryGain.gain.setValueAtTime(0.7, 0);

        const offlineReverbNode = offlineContext.createConvolver();
        offlineReverbNode.buffer = impulse;

        const offlineReverbGain = offlineContext.createGain();
        offlineReverbGain.gain.setValueAtTime(0.3, 0);

        offlineSource.connect(offlineDryGain);
        offlineSource.connect(offlineReverbNode);
        offlineReverbNode.connect(offlineReverbGain);

        offlineDryGain.connect(offlineContext.destination);
        offlineReverbGain.connect(offlineContext.destination);

        offlineSource.start();

        offlineContext.startRendering().then((renderedBuffer) => {
            processedBuffer = renderedBuffer;
            showNotification(currentLanguage === 'ar' ? 'تم تطبيق تأثير Reverb بنجاح! 🌊' : 'Reverb effect applied successfully! 🌊');
        });

    } catch (error) {
        console.error('خطأ في تطبيق Reverb:', error);
        showNotification('حدث خطأ في تطبيق تأثير Reverb', 'error');
    }
}

function applyEchoEffect() {
    if (!audioContext || !audioBuffer) return;

    try {
        const delayTime = 0.3; 

        const feedback = 0.4; 

        const offlineContext = new OfflineAudioContext(
            audioBuffer.numberOfChannels,
            audioBuffer.length + Math.floor(audioContext.sampleRate * delayTime),
            audioBuffer.sampleRate
        );

        const source = offlineContext.createBufferSource();
        source.buffer = audioBuffer;

        const delayNode = offlineContext.createDelay(delayTime);
        const feedbackGain = offlineContext.createGain();
        feedbackGain.gain.setValueAtTime(feedback, 0);

        const outputGain = offlineContext.createGain();
        outputGain.gain.setValueAtTime(0.7, 0);

        source.connect(outputGain);
        source.connect(delayNode);
        delayNode.connect(feedbackGain);
        feedbackGain.connect(delayNode);
        delayNode.connect(outputGain);

        outputGain.connect(offlineContext.destination);

        source.start();

        offlineContext.startRendering().then((renderedBuffer) => {
            processedBuffer = renderedBuffer;
            showNotification(currentLanguage === 'ar' ? 'تم تطبيق تأثير Echo بنجاح! 🔊' : 'Echo effect applied successfully! 🔊');
        });

    } catch (error) {
        console.error('خطأ في تطبيق Echo:', error);
        showNotification('حدث خطأ في تطبيق تأثير Echo', 'error');
    }
}

processBtn.addEventListener('click', () => {
    if (!audioBuffer) {
        showNotification(currentLanguage === 'ar' ? 'يرجى رفع ملف صوتي أولاً' : 'Please upload an audio file first', 'error');
        return;
    }

    processBtn.classList.add('processing');
    processBtn.innerHTML = `<i class="fas fa-spinner loading"></i> ${currentLanguage === 'ar' ? 'جاري المعالجة...' : 'Processing...'}`;
    processBtn.disabled = true;

    setTimeout(() => {
        processedBuffer = audioBuffer; 

        processBtn.classList.remove('processing');
        processBtn.innerHTML = `<i class="fas fa-cog"></i> ${currentLanguage === 'ar' ? 'معالجة الصوت' : 'Process Audio'}`;
        processBtn.disabled = false;
        downloadBtn.style.display = 'inline-block';
        showNotification(currentLanguage === 'ar' ? 'تمت معالجة الصوت بنجاح! 🎉' : 'Audio processed successfully! 🎉');
    }, 2500);
});

downloadBtn.addEventListener('click', () => {
    if (!processedBuffer) return;

    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([processedBuffer], { type: 'audio/wav' }));
    link.download = `${audioTitle.textContent.replace(/\.[^/.]+$/, '')}_processed.wav`;
    link.click();

    showNotification(currentLanguage === 'ar' ? 'بدء تحميل الملف... 📥' : 'Starting download... 📥');
});

function resetAudio() {
    speedSlider.value = 1.0;
    pitchSlider.value = 0;
    volumeSlider.value = 100;
    processedBuffer = audioBuffer;

    currentSpeed = 1.0;
    currentPitch = 0;
    currentVolume = 1.0;

    currentEffect = 'none';
    hasAudioFile = !!audioBuffer;

    updateSpeedValue();
    updatePitchValue();
    updateVolumeValue();

    document.querySelectorAll('.effect-btn.active').forEach(btn => {
        btn.classList.remove('active');
    });

    downloadBtn.style.display = 'none';
    showNotification(currentLanguage === 'ar' ? 'تم إعادة تعيين الإعدادات 🔄' : 'Settings reset 🔄');
}

function updateSpeedValue() {
    document.getElementById('speedValue').textContent = speedSlider.value + 'x';
    const speedValue = parseFloat(speedSlider.value);

    if (speedValue > 1.5) {
        currentEffect = 'sped';
        createSpeedEffect('sped');
    } else if (speedValue > 1.2) {
        currentEffect = 'sped';
    } else if (speedValue < 0.6) {
        currentEffect = 'slowed';
        createSpeedEffect('slowed');
    } else if (speedValue < 0.8) {
        currentEffect = 'slowed';
    } else {
        currentEffect = hasAudioFile ? 'none' : 'none';
    }
    applyRealtimeChanges();
}

function updatePitchValue() {
    const value = parseInt(pitchSlider.value);
    document.getElementById('pitchValue').textContent = value > 0 ? '+' + value : value;

    if (value > 8) {
        currentEffect = 'chipmunk';
        createPitchEffect('chipmunk');
    } else if (value > 5) {
        currentEffect = 'chipmunk';
    } else if (value < -8) {
        currentEffect = 'deep';
        createPitchEffect('deep');
    } else if (value < -5) {
        currentEffect = 'deep';
    } else if (value > 4) {
        currentEffect = 'nightcore';
        createPitchEffect('nightcore');
    } else if (value > 2) {
        currentEffect = 'nightcore';
    } else if (value < -4) {
        currentEffect = 'daycore';
        createPitchEffect('daycore');
    } else if (value < -2) {
        currentEffect = 'daycore';
    } else {
        currentEffect = hasAudioFile ? 'none' : 'none';
    }
    applyRealtimeChanges();
}

function createSpeedEffect(effect) {
    if (!hasAudioFile) return;

    const settings = effectSettings[effect];
    if (settings) {

        setTimeout(() => {
            if (currentEffect === effect) {

                const flashDiv = document.createElement('div');
                flashDiv.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: ${effect === 'sped' ? 'rgba(255, 165, 0, 0.1)' : 'rgba(0, 255, 255, 0.1)'};
                    pointer-events: none;
                    z-index: 999;
                    animation: flash 0.3s ease-out;
                `;
                document.body.appendChild(flashDiv);
                setTimeout(() => flashDiv.remove(), 300);
            }
        }, 100);
    }
}

function createPitchEffect(effect) {
    if (!hasAudioFile) return;

    const color = effectColors[effect];
    if (color) {
        setTimeout(() => {
            if (currentEffect === effect) {

                const flashDiv = document.createElement('div');
                const r = ((color >> 16) & 0xff).toString(16).padStart(2, '0');
                const g = ((color >> 8) & 0xff).toString(16).padStart(2, '0');
                const b = (color & 0xff).toString(16).padStart(2, '0');
                flashDiv.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(${parseInt(r, 16)}, ${parseInt(g, 16)}, ${parseInt(b, 16)}, 0.15);
                    pointer-events: none;
                    z-index: 999;
                    animation: flash 0.5s ease-out;
                `;
                document.body.appendChild(flashDiv);
                setTimeout(() => flashDiv.remove(), 500);
            }
        }, 50);
    }
}

function updateVolumeValue() {
    document.getElementById('volumeValue').textContent = volumeSlider.value + '%';
    applyRealtimeChanges();
}

function applyRealtimeChanges() {
    const speed = parseFloat(speedSlider.value);
    const pitch = parseFloat(pitchSlider.value);
    const volume = parseFloat(volumeSlider.value) / 100;

    currentSpeed = speed;
    currentPitch = pitch;
    currentVolume = volume;

    if (!currentSource || !isPlaying) return;

    const playbackRate = speed * Math.pow(2, pitch / 12);
    currentSource.playbackRate.setValueAtTime(playbackRate, audioContext.currentTime);

    if (gainNode) {
        gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    }

    showRealtimeEffect();

    if (isPlaying) {
        showNotification(currentLanguage === 'ar' ? 'تم تطبيق التعديل فورًا ⚡' : 'Applied changes instantly ⚡', 'success');
    }
}

function showRealtimeEffect() {
    const player = document.querySelector('.audio-player');
    if (player) {
        player.style.transform = 'scale(1.02)';
        player.style.boxShadow = '0 15px 35px rgba(99, 102, 241, 0.4)';

        setTimeout(() => {
            player.style.transform = 'scale(1)';
            player.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
        }, 200);
    }
}

let currentSpeed = 1.0;
let currentPitch = 0;
let currentVolume = 1.0;

speedSlider.addEventListener('input', updateSpeedValue);
pitchSlider.addEventListener('input', updatePitchValue);
volumeSlider.addEventListener('input', updateVolumeValue);

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function showNotification(message, type = 'success') {
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
}

currentSpeed = parseFloat(speedSlider.value);
currentPitch = parseFloat(pitchSlider.value);
currentVolume = parseFloat(volumeSlider.value) / 100;

updateSpeedValue();
updatePitchValue();
updateVolumeValue();

function showUploadSection() {
    const uploadSection = document.querySelector('.upload-section');
    const audioPlayer = document.getElementById('audioPlayer');
    const fileList = document.getElementById('fileList');

    audioPlayer.classList.remove('show');
    setTimeout(() => {
        uploadSection.style.display = 'block';
        audioPlayer.style.display = 'none';

        if (audioFiles.length > 0) {
            fileList.style.display = 'block';
        } else {
            fileList.style.display = 'none';
        }

        resetAudio();
    }, 300);
}

function toggleFileList() {
    const fileList = document.getElementById('fileList');
    const manageBtn = document.getElementById('manageFilesBtn');

    if (fileList.style.display === 'none' || fileList.style.display === '') {
        fileList.style.display = 'block';
        manageBtn.innerHTML = `<i class="fas fa-eye-slash"></i> ${currentLanguage === 'ar' ? 'إخفاء الملفات' : 'Hide Files'}`;
        showNotification(currentLanguage === 'ar' ? 'تم إظهار قائمة الملفات 📁' : 'File list shown 📁');
    } else {
        fileList.style.display = 'none';
        manageBtn.innerHTML = `<i class="fas fa-list"></i> ${currentLanguage === 'ar' ? 'إدارة الملفات' : 'Manage Files'}`;
        showNotification(currentLanguage === 'ar' ? 'تم إخفاء قائمة الملفات 👁️‍🗨️' : 'File list hidden 👁️‍🗨️');
    }
}

document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return; 

    switch (e.code) {
        case 'Space':
            e.preventDefault();
            playBtn.click();
            break;
        case 'ArrowLeft':
            if (e.ctrlKey) prevTrack();
            break;
        case 'ArrowRight':
            if (e.ctrlKey) nextTrack();
            break;
        case 'KeyR':
            if (e.ctrlKey) resetAudio();
            break;
    }
});

window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

document.addEventListener('DOMContentLoaded', () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('visualizer-canvas'), antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    camera.position.z = 5;

    const particleCount = 3000;
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.02,
        transparent: true,
        opacity: 0.8,
        vertexColors: true
    });

    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 30;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 30;

        velocities[i * 3] = (Math.random() - 0.5) * 0.05;
        velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.05;
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.05;

        colors[i * 3] = 1;
        colors[i * 3 + 1] = 1;
        colors[i * 3 + 2] = 1;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    particles.visible = false;

    function updateParticles() {
        particles.visible = true;
        const positions = particlesGeometry.attributes.position.array;
        const colors = particlesGeometry.attributes.color.array;

        const effectColor = (hasAudioFile && currentEffect !== 'none') ? (effectColors[currentEffect] || 0xffffff) : 0xffffff;
        const settings = effectSettings[currentEffect] || effectSettings['none'];

        const r = ((effectColor >> 16) & 0xff) / 255;
        const g = ((effectColor >> 8) & 0xff) / 255;
        const b = (effectColor & 0xff) / 255;

        const speedMultiplier = settings.speed;
        const sizeMultiplier = settings.size;
        const intensityMultiplier = settings.intensity;

        for (let i = 0; i < particleCount; i++) {

            positions[i * 3] += velocities[i * 3] * speedMultiplier;
            positions[i * 3 + 1] += velocities[i * 3 + 1] * speedMultiplier;
            positions[i * 3 + 2] += velocities[i * 3 + 2] * speedMultiplier;

            if (positions[i * 3] > 15) positions[i * 3] = -15;
            if (positions[i * 3] < -15) positions[i * 3] = 15;
            if (positions[i * 3 + 1] > 15) positions[i * 3 + 1] = -15;
            if (positions[i * 3 + 1] < -15) positions[i * 3 + 1] = 15;
            if (positions[i * 3 + 2] > 15) positions[i * 3 + 2] = -15;
            if (positions[i * 3 + 2] < -15) positions[i * 3 + 2] = 15;

            if (effectColor === 0xffffff) {

                const whiteVariation = 0.6 + Math.random() * 0.8 * intensityMultiplier;
                colors[i * 3] = Math.min(1, whiteVariation);
                colors[i * 3 + 1] = Math.min(1, whiteVariation);
                colors[i * 3 + 2] = Math.min(1, whiteVariation);
            } else {

                const colorVariation = (Math.random() - 0.5) * 0.5 * intensityMultiplier;
                colors[i * 3] = Math.max(0, Math.min(1, r + colorVariation));
                colors[i * 3 + 1] = Math.max(0, Math.min(1, g + colorVariation));
                colors[i * 3 + 2] = Math.max(0, Math.min(1, b + colorVariation));
            }

            if (Math.random() < 0.001 * intensityMultiplier) {

                positions[i * 3] = (Math.random() - 0.5) * 30;
                positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
                positions[i * 3 + 2] = (Math.random() - 0.5) * 30;

                velocities[i * 3] = (Math.random() - 0.5) * 0.05 * speedMultiplier;
                velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.05 * speedMultiplier;
                velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.05 * speedMultiplier;
            }
        }

        particlesGeometry.attributes.position.needsUpdate = true;
        particlesGeometry.attributes.color.needsUpdate = true;

        particlesMaterial.size = 0.02 * sizeMultiplier;
    }

    function animate() {
        requestAnimationFrame(animate);
        updateParticles();

        const settings = effectSettings[currentEffect] || effectSettings['none'];
        const rotationSpeed = 0.001 * settings.speed;

        particles.rotation.x += rotationSpeed;
        particles.rotation.y += rotationSpeed * 1.5;
        particles.rotation.z += rotationSpeed * 0.5;

        renderer.render(scene, camera);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener('resize', onWindowResize);
    animate();
});

function createEffectFlash(effect) {
    if (!hasAudioFile) return;

    const color = effectColors[effect];
    if (color) {
        const flashDiv = document.createElement('div');
        const r = ((color >> 16) & 0xff).toString(16).padStart(2, '0');
        const g = ((color >> 8) & 0xff).toString(16).padStart(2, '0');
        const b = (color & 0xff).toString(16).padStart(2, '0');
        flashDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(${parseInt(r, 16)}, ${parseInt(g, 16)}, ${parseInt(b, 16)}, 0.2);
            pointer-events: none;
            z-index: 999;
            animation: flash 0.8s ease-out;
        `;
        document.body.appendChild(flashDiv);
        setTimeout(() => flashDiv.remove(), 800);
    }
}

function createScreenEffect(effect) {
    if (!hasAudioFile) return;

    const effectDiv = document.createElement('div');
    effectDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 50%);
        pointer-events: none;
        z-index: 998;
        animation: pulse 1s ease-out;
    `;
    document.body.appendChild(effectDiv);
    setTimeout(() => effectDiv.remove(), 1000);
}

