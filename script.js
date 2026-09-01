/* ==========================================================================
   SimplifiMed - AI Medical Report Digital Dashboard & Speech Engine
   ========================================================================== */

// --- INDIAN LANGUAGE SPEECH LOCALE CONFIGURATION ---
const INDIAN_VOICE_LOCALES = {
  "en-IN": { name: "English (India)", tag: "en-IN" },
  "hi-IN": { name: "Hindi (हिन्दी)", tag: "hi-IN" },
  "ta-IN": { name: "Tamil (தமிழ்)", tag: "ta-IN" },
  "te-IN": { name: "Telugu (తెలుగు)", tag: "te-IN" },
  "bn-IN": { name: "Bengali (বাংলা)", tag: "bn-IN" },
  "mr-IN": { name: "Marathi (मराठी)", tag: "mr-IN" },
  "gu-IN": { name: "Gujarati (ગુજરાતી)", tag: "gu-IN" },
  "kn-IN": { name: "Kannada (ಕನ್ನಡ)", tag: "kn-IN" },
  "ml-IN": { name: "Malayalam (മലയാളം)", tag: "ml-IN" }
};

// --- STATE MANAGEMENT ---
let selectedVoiceLangCode = "en-IN";
let speechSynth = window.speechSynthesis;
let currentUtterance = null;
let isPlayingVoice = false;

// --- DOM INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
  initLanguageSwitcher();
  initVoiceReader();
  initFileUpload();
  initAuthModal();
  initFAQAccordion();
  initExportPDF();
});

// --- LANGUAGE SWITCHER EVENT HANDLER ---
function initLanguageSwitcher() {
  const select = document.getElementById("language-select");
  if (!select) return;

  select.addEventListener("change", (e) => {
    selectedVoiceLangCode = e.target.value;
    const voiceConfig = INDIAN_VOICE_LOCALES[selectedVoiceLangCode];

    // Update Voice Reader badge tag in English dashboard UI
    const voiceTag = document.getElementById("voice-lang-tag");
    if (voiceTag && voiceConfig) {
      voiceTag.textContent = `Voice: ${voiceConfig.name}`;
    }

    // Cancel active speech if playing
    if (speechSynth && speechSynth.speaking) {
      speechSynth.cancel();
      stopVoiceAnimation();
    }

    showToast(`Voice reader accent set to ${select.options[select.selectedIndex].text}`);
  });
}

// --- VOICE SUMMARY READER SPEECH SYNTHESIS ENGINE ---
function initVoiceReader() {
  const playBtn = document.getElementById("voice-play-btn");
  const playIcon = document.getElementById("play-icon");
  const pauseIcon = document.getElementById("pause-icon");
  const equalizer = document.getElementById("equalizer");

  if (!playBtn) return;

  playBtn.addEventListener("click", () => {
    if (isPlayingVoice) {
      // Pause / Stop Speech
      if (speechSynth) speechSynth.cancel();
      stopVoiceAnimation();
    } else {
      // Start Speech with selected Indian Locale
      const transcriptText = document.getElementById("voice-transcript-text")?.textContent || "";
      const textToSpeak = transcriptText.replace(/^"|"$/g, '');

      if ('speechSynthesis' in window) {
        speechSynth.cancel(); // Clear queue

        currentUtterance = new SpeechSynthesisUtterance(textToSpeak);
        currentUtterance.lang = selectedVoiceLangCode; // e.g. hi-IN, ta-IN, en-IN
        currentUtterance.rate = 0.92; // Natural speech speed

        currentUtterance.onstart = () => {
          isPlayingVoice = true;
          if (playIcon) playIcon.style.display = "none";
          if (pauseIcon) pauseIcon.style.display = "block";
          if (equalizer) equalizer.classList.add("playing");
        };

        currentUtterance.onend = () => {
          stopVoiceAnimation();
        };

        currentUtterance.onerror = () => {
          stopVoiceAnimation();
        };

        speechSynth.speak(currentUtterance);
      } else {
        showToast("Speech synthesis is not supported in this browser.", "warning");
      }
    }
  });

  function stopVoiceAnimation() {
    isPlayingVoice = false;
    if (playIcon) playIcon.style.display = "block";
    if (pauseIcon) pauseIcon.style.display = "none";
    if (equalizer) equalizer.classList.remove("playing");
  }
}

// --- PDF EXPORT MOCK ---
function initExportPDF() {
  const btn = document.getElementById("export-pdf-btn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    showToast("Generating encrypted AI summary PDF... Download ready shortly!", "success");
  });
}

// --- FILE UPLOAD DROPZONE SIMULATOR ---
function initFileUpload() {
  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("file-input");
  const overlay = document.getElementById("processing-overlay");
  const progressFill = document.getElementById("progress-bar-fill");
  const statusText = document.getElementById("processing-status");

  if (!dropzone || !fileInput) return;

  ['dragenter', 'dragover'].forEach(evt => {
    dropzone.addEventListener(evt, (e) => { e.preventDefault(); dropzone.classList.add('drag-over'); });
  });

  ['dragleave', 'drop'].forEach(evt => {
    dropzone.addEventListener(evt, (e) => { e.preventDefault(); dropzone.classList.remove('drag-over'); });
  });

  dropzone.addEventListener('drop', (e) => {
    const files = e.dataTransfer.files;
    if (files.length > 0) handleSimulatedUpload(files[0].name);
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) handleSimulatedUpload(fileInput.files[0].name);
  });

  function handleSimulatedUpload(fileName) {
    overlay.classList.add("active");
    progressFill.style.width = "0%";
    statusText.textContent = `Uploading "${fileName}" to encrypted memory...`;

    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      progressFill.style.width = `${progress}%`;

      if (progress === 40) statusText.textContent = "Calculating Health Risk Index & Diet Protocol...";
      else if (progress === 80) statusText.textContent = "Synthesizing Indian Language Voice Speech...";
      else if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          overlay.classList.remove("active");
          showToast(`Report "${fileName}" processed! Dashboard updated below.`, "success");
          document.getElementById("dashboard-section").scrollIntoView({ behavior: 'smooth' });
        }, 400);
      }
    }, 350);
  }
}

// --- AUTHENTICATION OVERLAY MODAL ---
function initAuthModal() {
  const modal = document.getElementById("auth-modal");
  const openLoginBtn = document.getElementById("open-login-btn");
  const openSignupBtn = document.getElementById("open-signup-btn");
  const closeModalBtn = document.getElementById("close-modal-btn");

  const tabLogin = document.getElementById("tab-login-btn");
  const tabSignup = document.getElementById("tab-signup-btn");
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");

  if (!modal) return;

  function openModal(mode = "login") {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
    switchAuthTab(mode);
  }

  function closeModal() {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }

  function switchAuthTab(mode) {
    if (mode === "login") {
      tabLogin.classList.add("active");
      tabSignup.classList.remove("active");
      loginForm.classList.add("active");
      signupForm.classList.remove("active");
    } else {
      tabSignup.classList.add("active");
      tabLogin.classList.remove("active");
      signupForm.classList.add("active");
      loginForm.classList.remove("active");
    }
  }

  if (openLoginBtn) openLoginBtn.addEventListener("click", () => openModal("login"));
  if (openSignupBtn) openSignupBtn.addEventListener("click", () => openModal("signup"));
  if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
  if (tabLogin) tabLogin.addEventListener("click", () => switchAuthTab("login"));
  if (tabSignup) tabSignup.addEventListener("click", () => switchAuthTab("signup"));

  const togglePassBtns = document.querySelectorAll(".toggle-password-btn");
  togglePassBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const input = btn.previousElementSibling;
      input.type = input.type === "password" ? "text" : "password";
      btn.style.color = input.type === "text" ? "var(--primary-blue)" : "var(--text-light)";
    });
  });

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("login-email").value;
      closeModal();
      showToast(`Welcome back, ${email.split('@')[0]}! Patient dashboard active.`);
    });
  }

  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const fname = document.getElementById("signup-fname").value;
      closeModal();
      showToast(`Account created for ${fname}! Welcome to SimplifiMed.`);
    });
  }
}

// --- FAQ ACCORDION ---
function initFAQAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(item => {
    const btn = item.querySelector(".faq-question");
    if (btn) {
      btn.addEventListener("click", () => {
        const isOpen = item.classList.contains("open");
        faqItems.forEach(i => i.classList.remove("open"));
        if (!isOpen) item.classList.add("open");
      });
    }
  });
}

// --- TOAST NOTIFICATIONS ---
function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
    <span>${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
