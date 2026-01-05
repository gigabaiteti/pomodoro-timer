// Elementos do DOM
const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const modeIndicator = document.getElementById('mode-indicator');
const cycleCountDisplay = document.getElementById('cycle-count');
const focusInput = document.getElementById('focus-duration');
const breakInput = document.getElementById('break-duration');
const saveSettingsBtn = document.getElementById('save-settings-btn');
const historyList = document.getElementById('history-list');
const clearHistoryBtn = document.getElementById('clear-history-btn');
const emptyHistoryMsg = document.getElementById('empty-history-msg');

// Bootstrap Modals
let settingsModal;
let dialogModal;

// Elementos do Dialog Genérico
const dialogTitle = document.getElementById('dialog-title');
const dialogMessage = document.getElementById('dialog-message');
const dialogCancelBtn = document.getElementById('dialog-cancel-btn');
const dialogConfirmBtn = document.getElementById('dialog-confirm-btn');

// i18n
const translations = {
    pt: {
        title: "Pomodoro",
        modeFocus: "Foco",
        modeBreak: "Pausa",
        start: "Iniciar",
        pause: "Pausar",
        reset: "Resetar",
        cycles: "Ciclos",
        historyTitle: "Histórico",
        clear: "Limpar",
        emptyHistory: "Nenhuma sessão registrada",
        settingsTitle: "Opções",
        focusLabel: "Foco (min)",
        breakLabel: "Pausa (min)",
        saveSettings: "Salvar",
        footer: "Gigabaite Tecnologia",
        dialogTitleError: "Erro",
        dialogMsgInvalid: "Por favor, insira valores válidos maiores que 0",
        dialogTitleFocus: "Foco Concluído!",
        dialogMsgFocus: "Tempo de foco encerrado! Hora da pausa",
        dialogTitleBreak: "Pausa Concluída!",
        dialogMsgBreak: "Pausa encerrada! Hora de focar.",
        dialogTitleClear: "Limpar",
        dialogMsgClear: "Tem certeza que deseja apagar todo o histórico?",
        btnCancel: "Cancelar",
        btnOk: "OK",
        historyFocus: "Foco concluído em",
        historyBreak: "Pausa concluída em",
        alertTitle: "Aviso",
        languageLabel: "Alterar Idioma"
    },
    en: {
        title: "Pomodoro",
        modeFocus: "Focus",
        modeBreak: "Break",
        start: "Start",
        pause: "Pause",
        reset: "Reset",
        cycles: "Cycles",
        historyTitle: "History",
        clear: "Clear",
        emptyHistory: "No sessions recorded",
        settingsTitle: "Settings",
        focusLabel: "Focus (min)",
        breakLabel: "Break (min)",
        saveSettings: "Save",
        footer: "Gigabaite Tecnologia",
        dialogTitleError: "Error",
        dialogMsgInvalid: "Please enter valid values greater than 0.",
        dialogTitleFocus: "Focus Completed!",
        dialogMsgFocus: "Focus time is up! Time for a break.",
        dialogTitleBreak: "Break Completed!",
        dialogMsgBreak: "Break is over! Time to focus.",
        dialogTitleClear: "Clear History",
        dialogMsgClear: "Are you sure you want to delete all history?",
        btnCancel: "Cancel",
        btnOk: "OK",
        historyFocus: "Focus completed at",
        historyBreak: "Break completed at",
        alertTitle: "Notice",
        languageLabel: "Change Language"
    },
    es: {
        title: "Pomodoro",
        modeFocus: "Enfoque",
        modeBreak: "Descanso",
        start: "Iniciar",
        pause: "Pausar",
        reset: "Reiniciar",
        cycles: "Ciclos",
        historyTitle: "Historial",
        clear: "Limpiar",
        emptyHistory: "No hay sesiones registradas",
        settingsTitle: "Opciones",
        focusLabel: "Enfoque (min)",
        breakLabel: "Descanso (min)",
        saveSettings: "Guardar",
        footer: "Gigabaite Tecnologia",
        dialogTitleError: "Error",
        dialogMsgInvalid: "Por favor, introduzca valores válidos mayores que 0.",
        dialogTitleFocus: "¡Enfoque Completado!",
        dialogMsgFocus: "¡El tiempo de enfoque ha terminado! Hora de descansar.",
        dialogTitleBreak: "¡Descanso Completado!",
        dialogMsgBreak: "¡El descanso ha terminado! Hora de enfocarse.",
        dialogTitleClear: "Limpiar",
        dialogMsgClear: "¿Estás seguro de que quieres borrar todo el historial?",
        btnCancel: "Cancelar",
        btnOk: "OK",
        historyFocus: "Enfoque completado a las",
        historyBreak: "Descanso completado a las",
        alertTitle: "Aviso",
        languageLabel: "Cambiar Idioma"
    }
};

function getInitialLanguage() {
    const saved = localStorage.getItem('pomodoroLang');
    if (saved && translations[saved]) return saved;

    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang) {
        const shortLang = browserLang.split('-')[0].toLowerCase();
        if (translations[shortLang]) return shortLang;
    }
    
    return 'pt';
}

let currentLang = getInitialLanguage();

window.changeLanguage = function(lang) {
    if (translations[lang]) {
        currentLang = lang;
        localStorage.setItem('pomodoroLang', lang);
        updateLanguage();
    }
}

function updateLanguage() {
    const t = translations[currentLang];
    
    // Atualizar elementos com data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (t[key]) {
            element.textContent = t[key];
        }
    });

    // Atualizar elementos dinâmicos
    updateDisplay(); // Atualiza título
    
    // Atualizar indicador de modo
    modeIndicator.textContent = state.isFocusMode ? t.modeFocus : t.modeBreak;

    // Atualizar histórico (para traduzir itens)
    renderHistory();
}

// Estado da Aplicação
let state = {
    timeLeft: 25 * 60,
    isRunning: false,
    isFocusMode: true,
    timerId: null,
    cycles: 0,
    settings: {
        focusDuration: 25,
        breakDuration: 5
    },
    history: []
};

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar instâncias do Bootstrap
    settingsModal = new bootstrap.Modal(document.getElementById('settingsModal'));
    dialogModal = new bootstrap.Modal(document.getElementById('dialogModal'));
    
    init();
});

function init() {
    loadData();
    setupEventListeners();
    updateLanguage(); // Aplicar idioma inicial
    updateDisplay();
    updateControls();
}

// Configuração dos Event Listeners
function setupEventListeners() {
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    saveSettingsBtn.addEventListener('click', saveSettings);
}

// Lógica do Timer
function startTimer() {
    if (state.isRunning) return;

    state.isRunning = true;
    updateControls();
    
    // Web Audio API
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    state.timerId = setInterval(() => {
        state.timeLeft--;
        updateDisplay();

        if (state.timeLeft <= 0) {
            handleTimerComplete();
        }
    }, 1000);
}

function pauseTimer() {
    if (!state.isRunning) return;

    clearInterval(state.timerId);
    state.isRunning = false;
    state.timerId = null;
    updateControls();
}

function resetTimer() {
    pauseTimer();
    state.timeLeft = state.isFocusMode 
        ? state.settings.focusDuration * 60 
        : state.settings.breakDuration * 60;
    updateDisplay();
}

function handleTimerComplete() {
    pauseTimer();
    playAlarm();
    
    const t = translations[currentLang];

    if (state.isFocusMode) {
        state.cycles++;
        cycleCountDisplay.textContent = state.cycles;
        addToHistory('focus');
        
        // Alternar para Pausa
        switchMode(false);
        customAlert(t.dialogTitleFocus, t.dialogMsgFocus);
    } else {
        addToHistory('break');
        
        // Alternar para Foco
        switchMode(true);
        customAlert(t.dialogTitleBreak, t.dialogMsgBreak);
    }
    
    saveData();
}

function switchMode(toFocus) {
    state.isFocusMode = toFocus;
    state.timeLeft = toFocus 
        ? state.settings.focusDuration * 60 
        : state.settings.breakDuration * 60;
    
    const t = translations[currentLang];
    if (toFocus) {
        modeIndicator.textContent = t.modeFocus;
        document.body.classList.remove('break-mode');
    } else {
        modeIndicator.textContent = t.modeBreak;
        document.body.classList.add('break-mode');
    }
    
    updateDisplay();
}

// Atualização da Interface
function updateDisplay() {
    const minutes = Math.floor(state.timeLeft / 60);
    const seconds = state.timeLeft % 60;
    const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    timerDisplay.textContent = timeString;
    
    // Atualizar título da aba
    document.title = `${timeString} - ${translations[currentLang].title}`;
}

function updateControls() {
    startBtn.disabled = state.isRunning;
    pauseBtn.disabled = !state.isRunning;
    
    focusInput.disabled = state.isRunning;
    breakInput.disabled = state.isRunning;
    saveSettingsBtn.disabled = state.isRunning;
}

// Configurações
function saveSettings() {
    const newFocus = parseInt(focusInput.value);
    const newBreak = parseInt(breakInput.value);
    const t = translations[currentLang];

    if (newFocus > 0 && newBreak > 0) {
        state.settings.focusDuration = newFocus;
        state.settings.breakDuration = newBreak;
        
        if (!state.isRunning) {
            resetTimer();
        }
        
        saveData();
        settingsModal.hide();
    } else {
        customAlert(t.dialogTitleError, t.dialogMsgInvalid);
    }
}

// Histórico
function addToHistory(type) {
    const id = Date.now().toString();
    // Armazena tipo ('focus' ou 'break') para suporte a i18n
    const item = { id, type, date: new Date().toISOString() };
    state.history.unshift(item); 
    renderHistory();
    saveData();
}

function renderHistory() {
    historyList.innerHTML = '';
    const t = translations[currentLang];
    
    if (state.history.length === 0) {
        emptyHistoryMsg.classList.remove('d-none');
        return;
    }
    
    emptyHistoryMsg.classList.add('d-none');

    state.history.forEach(item => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center bg-transparent';
        
        let displayText;
        if (item.type) {
            // Novo formato com suporte a i18n
            const dateObj = new Date(item.date);
            const timeString = dateObj.toLocaleTimeString(currentLang === 'pt' ? 'pt-BR' : currentLang === 'es' ? 'es-ES' : 'en-US', { hour: '2-digit', minute: '2-digit' });
            const prefix = item.type === 'focus' ? t.historyFocus : t.historyBreak;
            displayText = `${prefix} ${timeString}`;
        } else {
            // Legado (texto fixo)
            displayText = item.text;
        }

        li.innerHTML = `
            <span>${displayText}</span>
            <button class="btn btn-sm text-danger border-0" onclick="deleteHistoryItem('${item.id}')" title="Excluir">
                <i class="fa-solid fa-trash"></i>
            </button>
        `;
        historyList.appendChild(li);
    });
}

// Função global para ser acessada via onclick no HTML
window.deleteHistoryItem = function(id) {
    state.history = state.history.filter(item => item.id !== id);
    renderHistory();
    saveData();
}

function clearHistory() {
    const t = translations[currentLang];
    customConfirm(t.dialogTitleClear, t.dialogMsgClear, (confirmed) => {
        if (confirmed) {
            state.history = [];
            renderHistory();
            saveData();
        }
    });
}

// Dialog Functions (Bootstrap Integration)
function customAlert(title, message) {
    dialogTitle.textContent = title;
    dialogMessage.textContent = message;
    
    // Esconder botão Cancelar para Alert
    dialogCancelBtn.classList.add('d-none');
    
    // Configurar OK para apenas fechar
    dialogConfirmBtn.onclick = () => dialogModal.hide();
    
    dialogModal.show();
}

function customConfirm(title, message, callback) {
    dialogTitle.textContent = title;
    dialogMessage.textContent = message;
    
    // Mostrar botão Cancelar para Confirm
    dialogCancelBtn.classList.remove('d-none');
    
    // Configurar ações
    dialogConfirmBtn.onclick = () => {
        dialogModal.hide();
        callback(true);
    };
    
    // O botão cancelar já tem data-bs-dismiss="modal", mas precisamos garantir o callback false
    dialogCancelBtn.onclick = () => {
        // O modal fecha sozinho pelo data-bs-dismiss
        callback(false);
    };
    
    dialogModal.show();
}

// Persistência
function saveData() {
    const dataToSave = {
        cycles: state.cycles,
        settings: state.settings,
        history: state.history
    };
    localStorage.setItem('pomodoroData', JSON.stringify(dataToSave));
}

function loadData() {
    const savedData = localStorage.getItem('pomodoroData');
    if (savedData) {
        const parsed = JSON.parse(savedData);
        state.cycles = parsed.cycles || 0;
        state.settings = parsed.settings || { focusDuration: 25, breakDuration: 5 };
        state.history = parsed.history || [];
        
        // Atualiza inputs com valores salvos
        focusInput.value = state.settings.focusDuration;
        breakInput.value = state.settings.breakDuration;
        cycleCountDisplay.textContent = state.cycles;
        
        // Reseta o timer para refletir as configurações carregadas
        state.timeLeft = state.settings.focusDuration * 60;
    }
}

// Áudio (Web Audio API)
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playAlarm() {
    // Cria um oscilador
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // 440Hz (Lá)
    oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.5);
    
    // Tocar mais dois beeps
    setTimeout(() => {
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(440, audioCtx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1);
        gain2.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.start();
        osc2.stop(audioCtx.currentTime + 0.5);
    }, 600);
}
