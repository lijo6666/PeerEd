class AppController {
  constructor() {
    this.themeToggle = document.getElementById('theme-toggle');
    this.navToggle = document.getElementById('nav-toggle');
    this.navLinks = document.getElementById('nav-links');
    this.navbar = document.getElementById('navbar');
    this.sections = document.querySelectorAll('section');
    this.navItems = document.querySelectorAll('.nav-links li');
    
    this.init();
  }
  
  init() {
    // Theme setup
    this.setupTheme();
    
    // Mobile navigation setup
    if (this.navToggle) {
      this.navToggle.addEventListener('click', () => this.toggleMobileMenu());
    }
    
    // Smooth scroll navigation highlight
    window.addEventListener('scroll', () => {
      this.handleNavbarScroll();
      this.highlightNavLinks();
    });
    
    // Mouse Glow Orb Follower
    this.setupCursorGlow();
    
    // Glass card lighting interaction & 3D Tilt
    this.setupGlassInteractions();
    
    // Scroll entry animations (Intersection Observer)
    this.setupScrollReveal();
    
    // Statistics Count-Up
    this.setupCountUp();
    
    // Process flow step interactive highlighting
    this.setupProcessFlow();
    
    // Magnetic Button Interactions
    this.setupMagneticButtons();

    
    // Digital Stall Experience
    this.setupDigitalStall();
    
    // Anonymous Note Wall
    this.setupAnonymousNotes();
    
    // Happiness Hub virtual experiences
    this.setupHappinessHubExperiences();
    
    // Load lucide icons
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }
  
  setupTheme() {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'light') {
      document.documentElement.classList.add('light-mode');
      this.updateThemeButton(true);
    } else {
      document.documentElement.classList.remove('light-mode');
      this.updateThemeButton(false);
    }
    
    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', () => {
        const isLight = document.documentElement.classList.toggle('light-mode');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        this.updateThemeButton(isLight);
        
        // Re-render magazine cover gradients on theme change
        if (window.magazineInstance) {
          window.magazineInstance.switchIssue(window.magazineInstance.activeYear);
        }
      });
    }
  }
  
  updateThemeButton(isLight) {
    if (!this.themeToggle) return;
    if (isLight) {
      this.themeToggle.innerHTML = '<i class="lucide-moon" style="width:20px; height:20px;"></i>';
    } else {
      this.themeToggle.innerHTML = '<i class="lucide-sun" style="width:20px; height:20px;"></i>';
    }
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }
  
  toggleMobileMenu() {
    if (this.navLinks) {
      this.navLinks.classList.toggle('open');
      const isOpen = this.navLinks.classList.contains('open');
      this.navToggle.innerHTML = isOpen ? '<i class="lucide-x"></i>' : '<i class="lucide-menu"></i>';
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }
  }
  
  handleNavbarScroll() {
    if (!this.navbar) return;
    if (window.scrollY > 50) {
      this.navbar.classList.add('scrolled');
    } else {
      this.navbar.classList.remove('scrolled');
    }
  }
  
  highlightNavLinks() {
    let scrollPosition = window.scrollY + 140;
    
    const targetIds = Array.from(this.navItems)
      .map(item => item.querySelector('a')?.getAttribute('href')?.substring(1))
      .filter(Boolean);
      
    let activeId = null;
    
    for (const id of targetIds) {
      const el = document.getElementById(id);
      if (!el) continue;
      
      const top = el.offsetTop;
      const height = el.offsetHeight;
      
      if (scrollPosition >= top && scrollPosition < top + height) {
        activeId = id;
      }
    }
    
    if (activeId) {
      this.navItems.forEach(item => {
        const link = item.querySelector('a');
        if (link && link.getAttribute('href') === `#${activeId}`) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    }
  }

  setupCursorGlow() {
    // Create cursor glow element
    const glow = document.createElement('div');
    glow.className = 'interactive-cursor-glow';
    document.body.appendChild(glow);
    
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    
    document.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    });
    
    // Smooth interpolation (Lerp) for elastic tracking
    const updateGlowPosition = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      
      glow.style.transform = `translate3d(${currentX - 150}px, ${currentY - 150}px, 0)`;
      requestAnimationFrame(updateGlowPosition);
    };
    
    updateGlowPosition();
  }
  
  setupGlassInteractions() {
    // 3D Parallax Card-Tilt Engine
    const isMobile = window.innerWidth <= 767;
    if (isMobile) return; // Disable tilt on mobile for performance

    const tiltCards = document.querySelectorAll('.glass-card-hoverable, .metric-card, .process-step');
    
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        
        // Calculate coordinates relative to card center
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Calculate tilt rotation angles (max 10 degrees)
        const rotateX = ((centerY - y) / centerY) * 10;
        const rotateY = ((x - centerX) / centerX) * 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        
        // Set dynamic highlight angle properties
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    });
  }
  
  setupScrollReveal() {
    const options = {
      threshold: 0.1,
      rootMargin: "0px 0px -40px 0px"
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
          observer.unobserve(entry.target);
        }
      });
    }, options);
    
    const revealEls = document.querySelectorAll('.reveal, .reveal-fade-up, .reveal-scale-in');
    revealEls.forEach(el => observer.observe(el));
  }
  
  setupCountUp() {
    const counterElements = document.querySelectorAll('.counter-num');
    
    const countUp = (el) => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      let count = 0;
      const duration = 2000; // 2 seconds
      const stepTime = Math.max(Math.floor(duration / target), 15);
      
      const timer = setInterval(() => {
        count += Math.ceil(target / (duration / stepTime));
        if (count >= target) {
          el.textContent = target + (el.getAttribute('data-suffix') || '');
          clearInterval(timer);
        } else {
          el.textContent = count;
        }
      }, stepTime);
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          countUp(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    counterElements.forEach(el => observer.observe(el));
  }
  
  setupProcessFlow() {
    const stepRows = document.querySelectorAll('.process-step-row');
    const visualStates = document.querySelectorAll('.visual-state');
    const progressFill = document.querySelector('.process-line-progress');
    const stepsListContainer = document.querySelector('.process-steps-list');
    
    if (!stepRows.length || !visualStates.length) return;
    
    // Set active step helper
    const activateStep = (stepNum) => {
      stepRows.forEach(row => {
        if (row.getAttribute('data-step') === stepNum) {
          row.classList.add('active');
        } else {
          row.classList.remove('active');
        }
      });
      
      visualStates.forEach(state => {
        if (state.getAttribute('data-step') === stepNum) {
          state.classList.add('active');
        } else {
          state.classList.remove('active');
        }
      });
      
      // Update line progress
      if (progressFill && stepsListContainer) {
        const totalSteps = stepRows.length;
        const currentActiveIndex = Array.from(stepRows).findIndex(r => r.classList.contains('active'));
        const percentage = ((currentActiveIndex + 1) / totalSteps) * 100;
        progressFill.style.height = `${percentage}%`;
      }
    };
    
    // Click behavior
    stepRows.forEach(row => {
      const card = row.querySelector('.step-detail-card');
      const stepNum = row.getAttribute('data-step');
      
      if (card) {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
          activateStep(stepNum);
        });
      }
    });
    
    // Scroll intersection observer to auto-active steps
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -40% 0px',
      threshold: 0.1
    };
    
    const stepObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const stepNum = entry.target.getAttribute('data-step');
          activateStep(stepNum);
        }
      });
    }, observerOptions);
    
    stepRows.forEach(row => stepObserver.observe(row));
  }

  setupMagneticButtons() {
    const isMobile = window.innerWidth <= 767;
    if (isMobile) return;
    
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    buttons.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transform = `translate3d(${x * 0.3}px, ${y * 0.3}px, 0) scale(1.02)`;
        btn.style.boxShadow = `0 15px 30px rgba(30, 79, 255, 0.45), 0 0 20px var(--accent-gold-glow)`;
      });
      
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate3d(0, 0, 0) scale(1)';
        btn.style.boxShadow = '';
      });
    });
  }


  setupDigitalStall() {
    const panels = document.querySelectorAll('.stall-panel');
    if (!panels.length) return;
    
    panels.forEach(panel => {
      // 3D Parallax Tilt coordinates for Stall panels
      panel.addEventListener('mousemove', (e) => {
        const rect = panel.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        panel.style.setProperty('--mouse-x', `${x}px`);
        panel.style.setProperty('--mouse-y', `${y}px`);
      });
      
      // Toggle active status on click
      panel.addEventListener('click', () => {
        const isActive = panel.classList.contains('active');
        
        // Remove active class from all panels
        panels.forEach(p => p.classList.remove('active'));
        
        // Toggle this panel
        if (!isActive) {
          panel.classList.add('active');
        }
      });
    });
  }

  setupAnonymousNotes() {
    const board = document.querySelector('.note-board-grid');
    const textarea = document.getElementById('new-note-text');
    const postBtn = document.getElementById('post-note-btn');
    const dots = document.querySelectorAll('.color-select .color-dot');
    
    if (!board || !postBtn || !textarea) return;
    
    let selectedColorIndex = 1; // default to color 1
    
    // Color selector handler
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        dots.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        selectedColorIndex = parseInt(dot.getAttribute('data-color'), 10);
      });
    });
    
    // Post Note click handler
    postBtn.addEventListener('click', () => {
      const text = textarea.value.trim();
      if (!text) {
        alert('Please enter some text for your note.');
        return;
      }
      
      // Create new note HTML element
      const note = document.createElement('div');
      note.className = `anonymous-note note-color-${selectedColorIndex} reveal-scale-in`;
      
      // Calculate random rotation between -3 and +3 degrees
      const rotation = (Math.random() * 6 - 3).toFixed(1);
      const translateVal = (Math.random() * 6 - 3).toFixed(0);
      note.style.transform = `rotate(${rotation}deg) translateY(${translateVal}px)`;
      
      // Select pin color based on note count or randomly
      const pinColors = ['#ff6b6b', '#5c7cfa', '#fcc419', '#12b886', '#e03131', '#1971c2'];
      const randomPinColor = pinColors[Math.floor(Math.random() * pinColors.length)];
      
      note.innerHTML = `
        <div class="note-pin" style="background: radial-gradient(circle at 30% 30%, ${randomPinColor}, rgba(0,0,0,0.5))"></div>
        <p class="note-content">"${text}"</p>
        <div class="note-footer">
          <span class="note-tag">#Support</span>
          <span class="note-author">Anonymous</span>
        </div>
      `;
      
      // Prepend to board
      board.insertBefore(note, board.firstChild);
      
      // Add animate class after insertion
      setTimeout(() => {
        note.classList.add('reveal-active');
      }, 50);
      
      // Clear textarea
      textarea.value = '';
      
      // Re-trigger lucide icons if applicable
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    });
  }
  
  setupHappinessHubExperiences() {
    this.modal = document.getElementById('hub-experience-modal');
    this.modalClose = document.getElementById('hub-modal-close-btn');
    this.modalTitle = document.getElementById('hub-modal-title');
    this.modalIcon = document.getElementById('hub-modal-icon');
    this.modalBody = document.getElementById('hub-modal-body');
    this.modalTip = document.getElementById('hub-modal-tip');
    
    if (!this.modal || !this.modalClose) return;
    
    // Web Audio Context for synthesized wellness frequencies
    this.audioCtx = null;
    this.activeOscillators = [];
    
    // Active intervals/timers tracking
    this.hubIntervals = [];
    this.mediaStream = null;
    
    // Register click handlers on hub cards
    const hubCards = document.querySelectorAll('.hub-card');
    hubCards.forEach(card => {
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => {
        const expId = card.getAttribute('data-experience');
        if (expId) {
          this.openExperienceModal(expId);
        }
      });
    });
    
    // Close modal handlers
    this.modalClose.addEventListener('click', () => this.closeExperienceModal());
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.closeExperienceModal();
      }
    });
  }
  
  openExperienceModal(id) {
    // Stop any active experiences and clean timers
    this.cleanupActiveExperience();
    
    const exp = this.getExperienceData(id);
    if (!exp) return;
    
    // Populate header, icon & tip
    this.modalTitle.textContent = exp.title;
    this.modalIcon.innerHTML = `<i data-lucide="${exp.icon}"></i>`;
    this.modalTip.textContent = exp.tip;
    this.modalBody.innerHTML = exp.html;
    
    // Render lucide icons
    if (typeof lucide !== 'undefined') {
      lucide.createIcons({
        attrs: {
          style: 'width: 20px; height: 20px;'
        },
        nameAttr: 'data-lucide'
      });
    }
    
    // Open modal
    this.modal.classList.add('active');
    document.body.classList.add('modal-open');
    
    // Initialize specific interactive scripts
    if (exp.initCallback) {
      exp.initCallback(this);
    }
  }
  
  closeExperienceModal() {
    this.modal.classList.remove('active');
    document.body.classList.remove('modal-open');
    this.cleanupActiveExperience();
  }
  
  cleanupActiveExperience() {
    // Clear all intervals/timers
    this.hubIntervals.forEach(clearInterval);
    this.hubIntervals = [];
    
    // Stop Web Audio synthesizer
    this.stopSynthesizer();
    
    // Stop camera video stream
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
  }
  
  stopSynthesizer() {
    try {
      this.activeOscillators.forEach(osc => {
        osc.stop();
      });
    } catch(e) {}
    this.activeOscillators = [];
    if (this.audioCtx && this.audioCtx.state !== 'closed') {
      this.audioCtx.close();
      this.audioCtx = null;
    }
  }
  
  getExperienceData(id) {
    const data = {
      breathing: {
        title: "Mindful Breathing",
        icon: "wind",
        tip: "Mindful deep breathing stimulates the vagus nerve, immediately slowing down your heart rate and reducing stress.",
        html: `
          <div class="breathing-app">
            <div class="breathing-circle-outer">
              <div class="breathing-circle-inner" id="breathing-circle"></div>
              <div class="breathing-text" id="breathing-text">Ready</div>
            </div>
            <div class="breathing-timer" id="breathing-timer-display">4s</div>
            <div class="breathing-controls">
              <button class="btn btn-primary" id="breathing-start-btn">Start Breathing</button>
            </div>
          </div>
        `,
        initCallback: (ctrl) => {
          const circle = document.getElementById('breathing-circle');
          const txt = document.getElementById('breathing-text');
          const timerDisplay = document.getElementById('breathing-timer-display');
          const btn = document.getElementById('breathing-start-btn');
          
          if (!circle || !txt || !btn) return;
          
          let cycle = 0; // 0=Inhale, 1=Hold, 2=Exhale
          let seconds = 4;
          let isRunning = false;
          
          const stepCycle = () => {
            if (!isRunning) return;
            
            if (cycle === 0) {
              txt.textContent = "Breathe In";
              circle.style.transform = "scale(1.4)";
              circle.style.background = "rgba(30, 79, 255, 0.4)";
            } else if (cycle === 1) {
              txt.textContent = "Hold Breath";
              circle.style.transform = "scale(1.4)";
              circle.style.background = "rgba(212, 163, 89, 0.4)";
            } else {
              txt.textContent = "Breathe Out";
              circle.style.transform = "scale(1)";
              circle.style.background = "rgba(13, 148, 136, 0.4)";
            }
            
            seconds = 4;
            timerDisplay.textContent = seconds + "s";
            
            const countTimer = setInterval(() => {
              if (!isRunning) {
                clearInterval(countTimer);
                return;
              }
              seconds--;
              if (seconds > 0) {
                timerDisplay.textContent = seconds + "s";
              } else {
                clearInterval(countTimer);
                cycle = (cycle + 1) % 3;
                stepCycle();
              }
            }, 1000);
            
            ctrl.hubIntervals.push(countTimer);
          };
          
          btn.addEventListener('click', () => {
            if (isRunning) {
              isRunning = false;
              btn.textContent = "Start Breathing";
              txt.textContent = "Ready";
              circle.style.transform = "scale(1)";
              circle.style.background = "rgba(30, 79, 255, 0.1)";
              timerDisplay.textContent = "4s";
              ctrl.cleanupActiveExperience();
            } else {
              isRunning = true;
              btn.textContent = "Stop Session";
              cycle = 0;
              stepCycle();
            }
          });
        }
      },
      cocoon: {
        title: "The Cocoon",
        icon: "shield",
        tip: "Safe spaces in guided imagery give the amygdala a break, helping your nervous system recover from flight-or-fight.",
        html: `
          <div class="cocoon-app">
            <div class="cocoon-canvas" id="cocoon-canvas">
              <div class="cocoon-glow"></div>
              <p class="cocoon-prompt" id="cocoon-prompt-text">Welcome to your sanctuary of safety. Breathe in the silence.</p>
            </div>
            <button class="btn btn-primary" id="cocoon-next-btn">Next Reflection</button>
          </div>
        `,
        initCallback: (ctrl) => {
          const txt = document.getElementById('cocoon-prompt-text');
          const btn = document.getElementById('cocoon-next-btn');
          if (!txt || !btn) return;
          
          const prompts = [
            "Welcome to your sanctuary of safety. Breathe in the silence.",
            "You are safe. You are warm. The world can wait for a few moments.",
            "Let go of your shoulders. Let go of your jaw. Focus on the gentle space around you.",
            "You don't have to perform. You don't have to achieve. Just exist here.",
            "Picture a cocoon of soft golden light protecting you from external pressures."
          ];
          
          let idx = 0;
          btn.addEventListener('click', () => {
            idx = (idx + 1) % prompts.length;
            txt.style.opacity = 0;
            setTimeout(() => {
              txt.textContent = prompts[idx];
              txt.style.opacity = 1;
            }, 300);
          });
        }
      },
      walking: {
        title: "Walking Club metronome",
        icon: "navigation",
        tip: "Walking rhythmically coordinates left-right brain activity, facilitating emotional processing and memory integration.",
        html: `
          <div class="walking-app">
            <div class="walking-metronome">
              <div class="metronome-pendulum" id="metronome-pendulum"></div>
            </div>
            <div class="walking-controls" style="display:flex; flex-direction:column; gap:12px; margin-top:20px; width:100%;">
              <div style="display:flex; gap:8px;">
                <button class="btn btn-secondary active-speed" id="speed-100" style="flex:1; padding:8px 12px; font-size:12px;">Relaxed (100 BPM)</button>
                <button class="btn btn-secondary" id="speed-120" style="flex:1; padding:8px 12px; font-size:12px;">Brisk (120 BPM)</button>
                <button class="btn btn-secondary" id="speed-140" style="flex:1; padding:8px 12px; font-size:12px;">Power (140 BPM)</button>
              </div>
              <button class="btn btn-primary" id="walking-toggle-btn">Start metronome rhythm</button>
            </div>
          </div>
        `,
        initCallback: (ctrl) => {
          const pendulum = document.getElementById('metronome-pendulum');
          const btn = document.getElementById('walking-toggle-btn');
          const s100 = document.getElementById('speed-100');
          const s120 = document.getElementById('speed-120');
          const s140 = document.getElementById('speed-140');
          
          if (!pendulum || !btn) return;
          
          let bpm = 100;
          let isRunning = false;
          let timer = null;
          let direction = 1;
          
          const startMetronome = () => {
            const intervalMs = (60 / bpm) * 1000;
            timer = setInterval(() => {
              direction *= -1;
              pendulum.style.transform = `rotate(${direction * 30}deg)`;
              
              // Play a synthesized visual tick click
              if (ctrl.audioCtx) {
                try {
                  const osc = ctrl.audioCtx.createOscillator();
                  const gain = ctrl.audioCtx.createGain();
                  osc.connect(gain);
                  gain.connect(ctrl.audioCtx.destination);
                  osc.frequency.setValueAtTime(800, ctrl.audioCtx.currentTime);
                  gain.gain.setValueAtTime(0.05, ctrl.audioCtx.currentTime);
                  gain.gain.exponentialRampToValueAtTime(0.0001, ctrl.audioCtx.currentTime + 0.05);
                  osc.start();
                  osc.stop(ctrl.audioCtx.currentTime + 0.05);
                } catch(e) {}
              }
            }, intervalMs);
            ctrl.hubIntervals.push(timer);
          };
          
          btn.addEventListener('click', () => {
            if (!ctrl.audioCtx) {
              ctrl.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            
            if (isRunning) {
              isRunning = false;
              btn.textContent = "Start metronome rhythm";
              pendulum.style.transform = "rotate(0deg)";
              clearInterval(timer);
            } else {
              isRunning = true;
              btn.textContent = "Stop metronome";
              startMetronome();
            }
          });
          
          const changeSpeed = (el, newBpm) => {
            [s100, s120, s140].forEach(b => b.classList.remove('active-speed'));
            el.classList.add('active-speed');
            bpm = newBpm;
            if (isRunning) {
              clearInterval(timer);
              startMetronome();
            }
          };
          
          s100.addEventListener('click', () => changeSpeed(s100, 100));
          s120.addEventListener('click', () => changeSpeed(s120, 120));
          s140.addEventListener('click', () => changeSpeed(s140, 140));
        }
      },
      grounding: {
        title: "Grounding Therapy: Five Elements",
        icon: "globe",
        tip: "By focusing on the physical elements around you, Grounding draws your mind away from loops of anxious anticipation.",
        html: `
          <div class="grounding-app">
            <div class="grounding-tabs" style="display:flex; gap:6px; margin-bottom:16px; width:100%; overflow-x:auto; padding-bottom:6px;">
              <button class="ground-tab-btn active" data-el="earth">Earth</button>
              <button class="ground-tab-btn" data-el="water">Water</button>
              <button class="ground-tab-btn" data-el="fire">Fire</button>
              <button class="ground-tab-btn" data-el="air">Air</button>
              <button class="ground-tab-btn" data-el="space">Space</button>
            </div>
            <div class="grounding-card-content" id="grounding-prompt-box">
              <strong>Earth stability:</strong> Focus on your feet touching the floor. Feel the support of the ground. Name 5 solid things around you.
            </div>
            <textarea class="note-input" id="grounding-note" placeholder="Reflect or record what you sense..." style="width:100%; height:90px; margin:16px 0; padding:12px; border-radius:12px; background:rgba(255,255,255,0.05); color:white; border:1px solid var(--border-color); font-size:13px; resize:none;"></textarea>
            <button class="btn btn-primary" id="grounding-save-btn" style="width:100%;">Record in Reflection Book</button>
          </div>
        `,
        initCallback: (ctrl) => {
          const tabBtns = document.querySelectorAll('.ground-tab-btn');
          const promptBox = document.getElementById('grounding-prompt-box');
          const noteArea = document.getElementById('grounding-note');
          const saveBtn = document.getElementById('grounding-save-btn');
          
          const elements = {
            earth: "<strong>Earth stability:</strong> Focus on your feet touching the floor. Feel the support of the ground. Name 5 solid things around you.",
            water: "<strong>Water flow:</strong> Reflect on things that flow or change. Drink a sip of water mindfully. Name 4 liquid or flowing states around you.",
            fire: "<strong>Fire heat:</strong> Tune in to warmth. Feel the temperature of your hands or face. Identify 3 warm objects or colors.",
            air: "<strong>Air breath:</strong> Listen to the sound of ventilation, wind, or your breathing. Identify 2 things you can feel on your skin.",
            space: "<strong>Space expansion:</strong> Notice the empty space in the room. Focus on the vastness. Name 1 thing you are grateful for existing in this space."
          };
          
          tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
              tabBtns.forEach(b => b.classList.remove('active'));
              btn.classList.add('active');
              const el = btn.getAttribute('data-el');
              promptBox.innerHTML = elements[el];
            });
          });
          
          saveBtn.addEventListener('click', () => {
            const val = noteArea.value.trim();
            if (val) {
              alert("Reflection saved in your local well-being log!");
              noteArea.value = '';
            } else {
              alert("Please type a quick reflection before recording.");
            }
          });
        }
      },
      greet: {
        title: "Greet Therapy: Greeting Jar",
        icon: "smile",
        tip: "Positive affirmations of community belonging shut down loneliness signals in the cerebral cortex, elevating oxytocin.",
        html: `
          <div class="greet-app">
            <div class="greet-jar-container" style="display:flex; justify-content:center; margin-bottom:20px;">
              <div class="greet-jar" id="greet-jar-btn">
                <div class="greet-paper-inside"></div>
              </div>
            </div>
            <p class="small-text text-center" style="margin-bottom:16px;">Tap the Greeting Jar to draw a warm greeting of belonging.</p>
            <div class="greet-card hidden" id="greet-card">
              <p class="greet-message" id="greet-message">"You make this campus a brighter place. Glad you are here!"</p>
              <span class="greet-author">— Peer Educator Team</span>
            </div>
          </div>
        `,
        initCallback: (ctrl) => {
          const jar = document.getElementById('greet-jar-btn');
          const card = document.getElementById('greet-card');
          const msg = document.getElementById('greet-message');
          
          if (!jar || !card || !msg) return;
          
          const greetings = [
            ""You make this campus community a brighter, warmer place. We are truly glad you are here!"",
            ""Take a breath. You are doing much better than you realize. Keep shining!"",
            ""Your effort and resilience are inspiring. Remember to take a break and care for yourself today."",
            ""You are valued, you belong, and there is a supportive community surrounding you at CCHS."",
            ""Every small step you take is progress. We believe in your potential!""
          ];
          
          jar.addEventListener('click', () => {
            jar.style.transform = 'scale(0.9) rotate(-10deg)';
            setTimeout(() => { jar.style.transform = 'scale(1.05) rotate(10deg)'; }, 100);
            setTimeout(() => { jar.style.transform = 'scale(0.95) rotate(-5deg)'; }, 200);
            setTimeout(() => { 
              jar.style.transform = 'scale(1) rotate(0)'; 
              const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
              msg.textContent = randomGreeting;
              card.classList.remove('hidden');
            }, 350);
          });
        }
      },
      mirror: {
        title: "Mirror Therapy: Affirmation Camera",
        icon: "sparkles",
        tip: "Speaking self-acceptance affirmations while looking at your reflection stimulates self-mirroring neural loops, reducing self-criticism.",
        html: `
          <div class="mirror-app">
            <div class="mirror-frame-wrapper" style="display:flex; justify-content:center; margin-bottom:20px;">
              <div class="mirror-camera-feed" id="mirror-view">
                <video id="mirror-video" autoplay playsinline class="hidden"></video>
                <div class="mirror-fallback-gradient" id="mirror-fallback"></div>
                <div class="mirror-overlay-glow"></div>
              </div>
            </div>
            <div class="mirror-controls" style="display:flex; gap:8px; margin-bottom:16px;">
              <button class="btn btn-secondary" id="mirror-cam-btn" style="flex:1;">Toggle Video Mirror</button>
              <button class="btn btn-primary" id="mirror-affirm-btn" style="flex:1;">New Affirmation</button>
            </div>
            <div class="mirror-quote" id="mirror-quote-text">
              "I accept myself exactly as I am in this moment. I am worthy of love, care, and inner peace."
            </div>
          </div>
        `,
        initCallback: (ctrl) => {
          const video = document.getElementById('mirror-video');
          const fallback = document.getElementById('mirror-fallback');
          const camBtn = document.getElementById('mirror-cam-btn');
          const affirmBtn = document.getElementById('mirror-affirm-btn');
          const quoteTxt = document.getElementById('mirror-quote-text');
          
          const affirmations = [
            ""I accept myself exactly as I am in this moment. I am worthy of love, care, and inner peace."",
            ""I give myself permission to learn, make mistakes, and grow at my own speed."",
            ""My mental wellbeing is a priority. I choose to let go of expectations I cannot meet today."",
            ""I am capable of handling whatever challenges college life brings my way."",
            ""I choose to be kind to myself. My value is not determined by grades or external expectations.""
          ];
          
          affirmBtn.addEventListener('click', () => {
            const randomAffirm = affirmations[Math.floor(Math.random() * affirmations.length)];
            quoteTxt.textContent = randomAffirm;
          });
          
          camBtn.addEventListener('click', async () => {
            if (ctrl.mediaStream) {
              // Stop camera
              ctrl.mediaStream.getTracks().forEach(track => track.stop());
              ctrl.mediaStream = null;
              video.classList.add('hidden');
              fallback.classList.remove('hidden');
              camBtn.textContent = "Start Video Mirror";
            } else {
              try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 300, height: 300 } });
                ctrl.mediaStream = stream;
                video.srcObject = stream;
                video.classList.remove('hidden');
                fallback.classList.add('hidden');
                camBtn.textContent = "Stop Video Mirror";
              } catch (err) {
                alert("Camera access denied or unavailable. Graceful reflective gradient fallback loaded.");
              }
            }
          });
        }
      },
      smile: {
        title: "Smile Therapy: Endorphin Shift",
        icon: "smile",
        tip: "The physical act of smiling triggers facial feedback loops that command your brain to release dopamine and serotonin, shifting mood.",
        html: `
          <div class="smile-app">
            <div class="smile-timer-container" style="display:flex; justify-content:center; margin-bottom:20px;">
              <div class="smile-progress-ring-wrapper" style="position:relative; width:120px; height:120px; display:flex; justify-content:center; align-items:center;">
                <svg class="progress-ring" width="120" height="120" style="transform: rotate(-90deg); position:absolute; top:0; left:0;">
                  <circle class="progress-ring-bg" stroke="rgba(255,255,255,0.08)" stroke-width="6" fill="transparent" r="50" cx="60" cy="60"/>
                  <circle class="progress-ring-fill" id="smile-progress-bar" stroke="var(--accent-gold)" stroke-width="6" fill="transparent" r="50" cx="60" cy="60" stroke-dasharray="314.16" stroke-dashoffset="314.16" style="transition: stroke-dashoffset 0.1s linear;"/>
                </svg>
                <div class="smile-timer-val" id="smile-timer-text" style="font-family:'Outfit',sans-serif; font-size:24px; font-weight:700; color:var(--text-primary);">5s</div>
              </div>
            </div>
            <div class="smile-instructions text-center" id="smile-instructions">
              <p style="font-size:13px; line-height:1.6; margin-bottom:16px;">Smile at the screen and hold it for 5 seconds to complete the feedback loop!</p>
              <button class="btn btn-primary" id="smile-start-btn" style="width:100%;">Start Smile Timer</button>
            </div>
            <div class="smile-success hidden text-center" id="smile-success-msg" style="padding:10px;">
              <i data-lucide="sparkles" style="color:var(--accent-gold); width:32px; height:32px; margin-bottom:8px; display:inline-block;"></i>
              <h4 style="font-family:'Outfit',sans-serif; color:var(--text-primary); margin-bottom:6px;">Endorphin Shift Complete!</h4>
              <p class="small-text">You held a beautiful smile. Notice how your mind and body feel slightly lighter now.</p>
            </div>
          </div>
        `,
        initCallback: (ctrl) => {
          const btn = document.getElementById('smile-start-btn');
          const timerText = document.getElementById('smile-timer-text');
          const progressBar = document.getElementById('smile-progress-bar');
          const instBox = document.getElementById('smile-instructions');
          const successMsg = document.getElementById('smile-success-msg');
          
          if (!btn || !timerText || !progressBar) return;
          
          let count = 5.0;
          let timer = null;
          const totalDash = 314.16;
          
          btn.addEventListener('click', () => {
            btn.disabled = true;
            count = 5.0;
            timerText.textContent = "5s";
            
            timer = setInterval(() => {
              count -= 0.1;
              if (count <= 0) {
                clearInterval(timer);
                timerText.textContent = "😊";
                progressBar.style.strokeDashoffset = "0";
                instBox.classList.add('hidden');
                successMsg.classList.remove('hidden');
              } else {
                timerText.textContent = count.toFixed(1) + "s";
                const offset = totalDash - (count / 5.0) * totalDash;
                progressBar.style.strokeDashoffset = offset;
              }
            }, 100);
            ctrl.hubIntervals.push(timer);
          });
        }
      },
      water: {
        title: "Water Therapy: Hydration Tracker",
        icon: "droplets",
        tip: "Mild dehydration reduces cognitive concentration and elevates feelings of fatigue and stress. Replenish your body.",
        html: `
          <div class="water-app">
            <div class="water-glass-container" style="display:flex; justify-content:center; margin-bottom:20px;">
              <div class="water-glass">
                <div class="water-fill" id="water-fill-level"></div>
              </div>
            </div>
            <div class="water-stats text-center" style="margin-bottom:16px;">
              <p style="font-size:13px;">Daily Hydration target: <strong>8 Glasses</strong></p>
              <p style="font-size:15px; margin-top:4px;">Glasses consumed: <strong id="water-glass-count" style="color:var(--secondary-blue);">0</strong> / 8</p>
            </div>
            <div class="water-controls" style="display:flex; gap:8px;">
              <button class="btn btn-primary" id="water-drink-btn" style="flex:2;">Drink a Glass</button>
              <button class="btn btn-secondary" id="water-reset-btn" style="flex:1;">Reset</button>
            </div>
          </div>
        `,
        initCallback: (ctrl) => {
          const fill = document.getElementById('water-fill-level');
          const countText = document.getElementById('water-glass-count');
          const drinkBtn = document.getElementById('water-drink-btn');
          const resetBtn = document.getElementById('water-reset-btn');
          
          if (!fill || !countText || !drinkBtn) return;
          
          let count = parseInt(localStorage.getItem('water_glass_count') || '0', 10);
          const updateUI = () => {
            countText.textContent = count;
            const percentage = Math.min(100, (count / 8) * 100);
            fill.style.height = `${percentage}%`;
          };
          
          updateUI();
          
          drinkBtn.addEventListener('click', () => {
            if (count < 8) {
              count++;
              localStorage.setItem('water_glass_count', count);
              updateUI();
            }
          });
          
          resetBtn.addEventListener('click', () => {
            count = 0;
            localStorage.setItem('water_glass_count', count);
            updateUI();
          });
        }
      },
      aroma: {
        title: "Aroma Therapy Scent Grounding",
        icon: "flower",
        tip: "Olfactory stimulation bypasses cognitive logic and maps directly to the limbic system, immediately regulating emotional tone.",
        html: `
          <div class="aroma-app">
            <div class="aroma-scents" style="display:flex; flex-direction:column; gap:8px; margin-bottom:16px;">
              <button class="btn btn-secondary active-scent" id="aroma-lav" style="border:1px solid #BD10E0; color:#BD10E0; text-align:left; padding:10px 16px;">Calming Lavender</button>
              <button class="btn btn-secondary" id="aroma-cit" style="border:1px solid #F5A623; color:#F5A623; text-align:left; padding:10px 16px;">Energizing Citrus</button>
              <button class="btn btn-secondary" id="aroma-min" style="border:1px solid #7ED321; color:#7ED321; text-align:left; padding:10px 16px;">Focus Peppermint</button>
            </div>
            <div class="aroma-visualizer" id="aroma-canvas">
              <div class="aroma-mist" id="aroma-mist"></div>
              <p class="aroma-text" id="aroma-desc">Lavender essence: Promotes deep relaxation, helps soothe anxious nerves, and prepares the mind for restful sleep.</p>
            </div>
          </div>
        `,
        initCallback: (ctrl) => {
          const lav = document.getElementById('aroma-lav');
          const cit = document.getElementById('aroma-cit');
          const min = document.getElementById('aroma-min');
          const mist = document.getElementById('aroma-mist');
          const desc = document.getElementById('aroma-desc');
          
          const scents = {
            lavender: {
              color: "rgba(189, 16, 224, 0.4)",
              gradient: "radial-gradient(circle, rgba(189,16,224,0.3) 0%, rgba(0,0,0,0) 70%)",
              text: "Lavender essence: Promotes deep relaxation, helps soothe anxious nerves, and prepares the mind for restful sleep."
            },
            citrus: {
              color: "rgba(245, 166, 35, 0.4)",
              gradient: "radial-gradient(circle, rgba(245,166,35,0.3) 0%, rgba(0,0,0,0) 70%)",
              text: "Citrus essence: Boosts alert focus, reduces morning fatigue, and stimulates cognitive clarity."
            },
            mint: {
              color: "rgba(126, 211, 33, 0.4)",
              gradient: "radial-gradient(circle, rgba(126,211,33,0.3) 0%, rgba(0,0,0,0) 70%)",
              text: "Peppermint essence: Cools the nervous system, relieves tension headache symptoms, and clears mental fog."
            }
          };
          
          const selectScent = (btn, scentKey) => {
            [lav, cit, min].forEach(b => b.classList.remove('active-scent'));
            btn.classList.add('active-scent');
            
            const s = scents[scentKey];
            desc.textContent = s.text;
            mist.style.background = s.gradient;
          };
          
          lav.addEventListener('click', () => selectScent(lav, 'lavender'));
          cit.addEventListener('click', () => selectScent(cit, 'citrus'));
          min.addEventListener('click', () => selectScent(min, 'mint'));
        }
      },
      art: {
        title: "Art Therapy: Glass Canvas",
        icon: "palette",
        tip: "Drawing is a form of active meditation. The motor action of drawing focuses your attention, calming cognitive static.",
        html: `
          <div class="art-app">
            <div class="art-canvas-container" style="border: 1px solid var(--border-color); border-radius: 16px; overflow: hidden; background: rgba(0,0,0,0.2); margin-bottom:16px;">
              <canvas id="art-canvas" width="400" height="250" style="display:block; width:100%; height:250px; cursor:crosshair;"></canvas>
            </div>
            <div class="art-controls" style="display:flex; justify-content:space-between; align-items:center;">
              <div class="art-colors" style="display:flex; gap:8px;">
                <button class="art-color-btn active" data-color="#1E4FFF" style="width:28px; height:28px; border-radius:50%; border:2px solid white; background:#1E4FFF; cursor:pointer;"></button>
                <button class="art-color-btn" data-color="#D4A359" style="width:28px; height:28px; border-radius:50%; border:2px solid transparent; background:#D4A359; cursor:pointer;"></button>
                <button class="art-color-btn" data-color="#0D9488" style="width:28px; height:28px; border-radius:50%; border:2px solid transparent; background:#0D9488; cursor:pointer;"></button>
                <button class="art-color-btn" data-color="#ffffff" style="width:28px; height:28px; border-radius:50%; border:2px solid transparent; background:#ffffff; cursor:pointer;"></button>
              </div>
              <button class="btn btn-secondary" id="art-clear-btn" style="padding:6px 14px; font-size:12px;">Clear Canvas</button>
            </div>
          </div>
        `,
        initCallback: (ctrl) => {
          const canvas = document.getElementById('art-canvas');
          const clearBtn = document.getElementById('art-clear-btn');
          const colorBtns = document.querySelectorAll('.art-color-btn');
          
          if (!canvas) return;
          const ctx = canvas.getContext('2d');
          
          // Fix canvas pixel resolution
          const rect = canvas.getBoundingClientRect();
          canvas.width = rect.width;
          canvas.height = 250;
          
          let drawing = false;
          let currentColor = "#1E4FFF";
          
          ctx.strokeStyle = currentColor;
          ctx.lineWidth = 3;
          ctx.lineCap = "round";
          
          const startDrawing = (e) => {
            drawing = true;
            draw(e);
          };
          
          const stopDrawing = () => {
            drawing = false;
            ctx.beginPath();
          };
          
          const draw = (e) => {
            if (!drawing) return;
            const clientX = e.clientX || (e.touches && e.touches[0].clientX);
            const clientY = e.clientY || (e.touches && e.touches[0].clientY);
            
            const r = canvas.getBoundingClientRect();
            const x = clientX - r.left;
            const y = clientY - r.top;
            
            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y);
          };
          
          canvas.addEventListener('mousedown', startDrawing);
          canvas.addEventListener('mouseup', stopDrawing);
          canvas.addEventListener('mousemove', draw);
          
          canvas.addEventListener('touchstart', (e) => { e.preventDefault(); startDrawing(e); });
          canvas.addEventListener('touchend', stopDrawing);
          canvas.addEventListener('touchmove', (e) => { e.preventDefault(); draw(e); });
          
          clearBtn.addEventListener('click', () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          });
          
          colorBtns.forEach(btn => {
            btn.addEventListener('click', () => {
              colorBtns.forEach(b => b.style.borderColor = "transparent");
              btn.style.borderColor = "white";
              currentColor = btn.getAttribute('data-color');
              ctx.strokeStyle = currentColor;
            });
          });
        }
      },
      sound: {
        title: "Sound Therapy Ambient Wave",
        icon: "music",
        tip: "Binaural sound frequencies and calming ambient noise mask sensory static, allowing the default mode network to relax.",
        html: `
          <div class="sound-app">
            <div class="sound-grid" style="display:grid; grid-template-columns:repeat(2,1fr); gap:12px; margin-bottom:16px;">
              <div class="sound-item" id="sound-rain" style="border:1px solid var(--border-color); border-radius:16px; padding:12px; display:flex; align-items:center; gap:10px; cursor:pointer; background:rgba(255,255,255,0.02); transition:all 0.3s;">
                <div class="sound-icon-box" style="color:var(--secondary-blue);"><i data-lucide="cloud-rain" style="width:20px; height:20px;"></i></div>
                <span style="font-size:12px; font-weight:600; color:var(--text-primary);">Rain Waves</span>
              </div>
              <div class="sound-item" id="sound-bowl" style="border:1px solid var(--border-color); border-radius:16px; padding:12px; display:flex; align-items:center; gap:10px; cursor:pointer; background:rgba(255,255,255,0.02); transition:all 0.3s;">
                <div class="sound-icon-box" style="color:var(--accent-gold);"><i data-lucide="bell" style="width:20px; height:20px;"></i></div>
                <span style="font-size:12px; font-weight:600; color:var(--text-primary);">Singing Bowl</span>
              </div>
              <div class="sound-item" id="sound-wind" style="border:1px solid var(--border-color); border-radius:16px; padding:12px; display:flex; align-items:center; gap:10px; cursor:pointer; background:rgba(255,255,255,0.02); transition:all 0.3s;">
                <div class="sound-icon-box" style="color:var(--secondary-blue);"><i data-lucide="wind" style="width:20px; height:20px;"></i></div>
                <span style="font-size:12px; font-weight:600; color:var(--text-primary);">Forest Wind</span>
              </div>
              <div class="sound-item" id="sound-theta" style="border:1px solid var(--border-color); border-radius:16px; padding:12px; display:flex; align-items:center; gap:10px; cursor:pointer; background:rgba(255,255,255,0.02); transition:all 0.3s;">
                <div class="sound-icon-box" style="color:var(--accent-gold);"><i data-lucide="activity" style="width:20px; height:20px;"></i></div>
                <span style="font-size:12px; font-weight:600; color:var(--text-primary);">Theta Waves</span>
              </div>
            </div>
            <div class="sound-now-playing text-center" style="border:1px solid var(--border-color); border-radius:16px; padding:16px; background:rgba(0,0,0,0.15);">
              <p id="sound-status-text" style="font-size:13px; color:var(--text-secondary);">Select a frequency to play</p>
              <div class="sound-waves hidden" id="sound-waves" style="display:flex; justify-content:center; gap:4px; height:30px; align-items:flex-end; margin-top:12px;">
                <div class="wave-bar bar-1"></div>
                <div class="wave-bar bar-2"></div>
                <div class="wave-bar bar-3"></div>
                <div class="wave-bar bar-4"></div>
              </div>
            </div>
          </div>
        `,
        initCallback: (ctrl) => {
          const rain = document.getElementById('sound-rain');
          const bowl = document.getElementById('sound-bowl');
          const wind = document.getElementById('sound-wind');
          const theta = document.getElementById('sound-theta');
          const status = document.getElementById('sound-status-text');
          const waves = document.getElementById('sound-waves');
          
          let currentPlaying = null;
          
          const startSynth = (type) => {
            ctrl.stopSynthesizer();
            
            if (!ctrl.audioCtx) {
              ctrl.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            
            waves.classList.remove('hidden');
            
            if (type === 'bowl') {
              status.textContent = "Playing Tibetan Singing Bowl (Sine 288Hz + 432Hz)";
              
              // Harmonic bowl tones
              const osc1 = ctrl.audioCtx.createOscillator();
              const osc2 = ctrl.audioCtx.createOscillator();
              const gainNode = ctrl.audioCtx.createGain();
              
              osc1.type = 'sine';
              osc1.frequency.value = 288; // fundamental F note
              
              osc2.type = 'sine';
              osc2.frequency.value = 432; // harmonic tuning
              
              gainNode.gain.setValueAtTime(0.0, ctrl.audioCtx.currentTime);
              gainNode.gain.linearRampToValueAtTime(0.12, ctrl.audioCtx.currentTime + 1.5);
              
              osc1.connect(gainNode);
              osc2.connect(gainNode);
              gainNode.connect(ctrl.audioCtx.destination);
              
              osc1.start(0);
              osc2.start(0);
              
              ctrl.activeOscillators.push(osc1, osc2);
            }
            else if (type === 'theta') {
              status.textContent = "Playing Theta Binaural Beats (100Hz Left / 106Hz Right)";
              
              // Binaural Beat: Left = 100Hz, Right = 106Hz (6Hz Theta difference)
              const oscL = ctrl.audioCtx.createOscillator();
              const oscR = ctrl.audioCtx.createOscillator();
              const pannerL = ctrl.audioCtx.createStereoPanner ? ctrl.audioCtx.createStereoPanner() : null;
              const pannerR = ctrl.audioCtx.createStereoPanner ? ctrl.audioCtx.createStereoPanner() : null;
              const gainNode = ctrl.audioCtx.createGain();
              
              oscL.frequency.value = 100;
              oscR.frequency.value = 106;
              
              gainNode.gain.setValueAtTime(0.0, ctrl.audioCtx.currentTime);
              gainNode.gain.linearRampToValueAtTime(0.15, ctrl.audioCtx.currentTime + 1.0);
              
              if (pannerL && pannerR) {
                pannerL.pan.value = -1;
                pannerR.pan.value = 1;
                oscL.connect(pannerL).connect(gainNode);
                oscR.connect(pannerR).connect(gainNode);
              } else {
                oscL.connect(gainNode);
                oscR.connect(gainNode);
              }
              
              gainNode.connect(ctrl.audioCtx.destination);
              oscL.start(0);
              oscR.start(0);
              
              ctrl.activeOscillators.push(oscL, oscR);
            }
            else if (type === 'rain' || type === 'wind') {
              const str = type === 'rain' ? "Rain Sound" : "Forest Wind Sound";
              status.textContent = `Playing Programmatic ${str} (Noise Generator)`;
              
              // Synthesize pink noise for rain/wind
              const bufferSize = 2 * ctrl.audioCtx.sampleRate;
              const noiseBuffer = ctrl.audioCtx.createBuffer(1, bufferSize, ctrl.audioCtx.sampleRate);
              const output = noiseBuffer.getChannelData(0);
              
              let b0, b1, b2, b3, b4, b5, b6;
              b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
              
              for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                b0 = 0.99886 * b0 + white * 0.0555179;
                b1 = 0.99332 * b1 + white * 0.0750759;
                b2 = 0.96900 * b2 + white * 0.1538520;
                b3 = 0.86650 * b3 + white * 0.3104856;
                b4 = 0.55000 * b4 + white * 0.5329522;
                b5 = -0.7616 * b5 - white * 0.0168980;
                output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
                output[i] *= 0.11; // volume limit
                b6 = white * 0.115926;
              }
              
              const whiteNoiseNode = ctrl.audioCtx.createBufferSource();
              whiteNoiseNode.buffer = noiseBuffer;
              whiteNoiseNode.loop = true;
              
              // Bandpass filter to sculpt rain vs wind
              const filter = ctrl.audioCtx.createBiquadFilter();
              filter.type = 'lowpass';
              filter.frequency.value = type === 'rain' ? 1200 : 400;
              
              whiteNoiseNode.connect(filter);
              filter.connect(ctrl.audioCtx.destination);
              whiteNoiseNode.start(0);
              
              // Custom hook to stop it
              ctrl.activeOscillators.push(whiteNoiseNode);
            }
          };
          
          const togglePlay = (el, type) => {
            if (currentPlaying === type) {
              // Clicked active -> Stop
              ctrl.stopSynthesizer();
              el.style.background = "rgba(255,255,255,0.02)";
              el.style.borderColor = "var(--border-color)";
              status.textContent = "Select a soothing frequency to play";
              waves.classList.add('hidden');
              currentPlaying = null;
            } else {
              // Click other -> Play new
              [rain, bowl, wind, theta].forEach(b => {
                b.style.background = "rgba(255,255,255,0.02)";
                b.style.borderColor = "var(--border-color)";
              });
              
              el.style.background = "rgba(30, 79, 255, 0.08)";
              el.style.borderColor = "rgba(30, 79, 255, 0.4)";
              
              startSynth(type);
              currentPlaying = type;
            }
          };
          
          rain.addEventListener('click', () => togglePlay(rain, 'rain'));
          bowl.addEventListener('click', () => togglePlay(bowl, 'bowl'));
          wind.addEventListener('click', () => togglePlay(wind, 'wind'));
          theta.addEventListener('click', () => togglePlay(theta, 'theta'));
        }
      },
      writing: {
        title: "Writing Therapy Release Pad",
        icon: "pen-tool",
        tip: "Externalizing worries by writing them down relieves working memory load, signaling to the brain that the concern has been logged.",
        html: `
          <div class="writing-app">
            <p class="small-text text-center" style="margin-bottom:12px;">Write down a worry or heavy thought. When you are ready, release it.</p>
            <textarea class="writing-pad" id="writing-worry-text" placeholder="Type what is weighing on your mind..." style="width:100%; height:110px; padding:12px; border-radius:12px; background:rgba(255,255,255,0.05); color:white; border:1px solid var(--border-color); font-size:13px; resize:none; transition: all 0.8s ease;"></textarea>
            <button class="btn btn-primary" id="writing-release-btn" style="width:100%; margin-top:12px;">Release to the Universe</button>
            <p class="small-text hidden text-center" id="writing-release-msg" style="margin-top:16px; color:var(--accent-gold); font-style:italic;">Your worry has dissolved. You are lighter.</p>
          </div>
        `,
        initCallback: (ctrl) => {
          const pad = document.getElementById('writing-worry-text');
          const btn = document.getElementById('writing-release-btn');
          const msg = document.getElementById('writing-release-msg');
          
          if (!pad || !btn) return;
          
          btn.addEventListener('click', () => {
            const val = pad.value.trim();
            if (!val) {
              alert("Please write something to release.");
              return;
            }
            
            btn.disabled = true;
            pad.style.transform = "scale(0.8) translateY(-50px)";
            pad.style.opacity = "0";
            pad.style.filter = "blur(10px)";
            
            setTimeout(() => {
              pad.value = '';
              pad.style.transform = "scale(1) translateY(0)";
              pad.style.filter = "none";
              pad.disabled = true;
              msg.classList.remove('hidden');
              setTimeout(() => {
                pad.style.opacity = "1";
                pad.disabled = false;
                btn.disabled = false;
                msg.classList.add('hidden');
              }, 3000);
            }, 1000);
          });
        }
      },
      circle: {
        title: "Circle of Emotions Mood Guide",
        icon: "smile",
        tip: "Labelling an emotion in precise words decreases activation in the emotional amygdala and shifts control back to your thinking cortex.",
        html: `
          <div class="circle-app">
            <p class="small-text text-center" style="margin-bottom:16px;">What emotion are you feeling right now?</p>
            <div class="circle-mood-selector" style="display:grid; grid-template-columns:repeat(2,1fr); gap:10px; margin-bottom:20px;">
              <button class="btn btn-secondary" id="mood-stress" style="padding:12px;">Stressed</button>
              <button class="btn btn-secondary" id="mood-anxious" style="padding:12px;">Anxious</button>
              <button class="btn btn-secondary" id="mood-lonely" style="padding:12px;">Lonely</button>
              <button class="btn btn-secondary" id="mood-confused" style="padding:12px;">Confused</button>
            </div>
            <div class="circle-mood-response hidden" id="circle-response-card" style="border:1px solid var(--border-color); border-radius:16px; padding:16px; background:rgba(30,79,255,0.03); display:flex; gap:12px; align-items:flex-start;">
              <div style="font-size:24px; line-height:1; user-select:none;">💬</div>
              <div>
                <span style="font-size:11px; font-weight:700; text-transform:uppercase; color:var(--accent-gold); tracking-wider:0.5px;">Counsellor Voice:</span>
                <p id="circle-counsellor-tip" style="font-size:12.5px; line-height:1.6; margin-top:4px; color:var(--text-primary); font-style:italic;"></p>
              </div>
            </div>
          </div>
        `,
        initCallback: (ctrl) => {
          const str = document.getElementById('mood-stress');
          const anx = document.getElementById('mood-anxious');
          const lon = document.getElementById('mood-lonely');
          const con = document.getElementById('mood-confused');
          const card = document.getElementById('circle-response-card');
          const tip = document.getElementById('circle-counsellor-tip');
          
          const tips = {
            stress: "Workload and fatigue can distort your perspective. Take a slow deep breath, step away from studies for 10 minutes, and visit the CCHS Happiness Hub sanctuary.",
            anxious: "Anxiety triggers a physical response. Focus on stability: feel your feet on the ground, wash your face with cool water, and break down tasks into 15-minute segments.",
            lonely: "MASSIVE campuses can feel isolating. Please know you are welcome. Reach out to a CCHS Peer Mentor or visit the Happiness Hub activity areas to strike up a friendly chat.",
            confused: "It's okay to not have everything figured out. Motivation rises and falls. Speak to our academic counsellors in Block 3, Room 348 to clarify your roadmap."
          };
          
          const showMood = (btn, key) => {
            [str, anx, lon, con].forEach(b => b.classList.remove('active-speed'));
            btn.classList.add('active-speed');
            tip.textContent = tips[key];
            card.classList.remove('hidden');
          };
          
          str.addEventListener('click', () => showMood(str, 'stress'));
          anx.addEventListener('click', () => showMood(anx, 'anxious'));
          lon.addEventListener('click', () => showMood(lon, 'lonely'));
          con.addEventListener('click', () => showMood(con, 'confused'));
        }
      },
      group: {
        title: "Group Therapy Listening Circle",
        icon: "users",
        tip: "Listening Circles are safe spaces. Knowing that peers share similar fears validates your experience and dissolves the stigma of vulnerability.",
        html: `
          <div class="group-app">
            <div class="listening-card" style="border:1px solid var(--border-color); border-radius:18px; padding:20px; background:rgba(255,255,255,0.03); min-height:110px; display:flex; flex-direction:column; justify-content:center; margin-bottom:16px;">
              <p class="share-quote" id="listening-shares" style="font-size:13.5px; line-height:1.6; font-style:italic; color:var(--text-primary); font-weight:500;">"I used to feel like I was the only one struggling with deadlines. Hearing other students share their coping strategies changed everything."</p>
              <span class="share-author" id="listening-author" style="font-size:11px; font-weight:700; color:var(--accent-gold); margin-top:10px; display:block;">— Dev, 3rd Year B.Tech</span>
            </div>
            <button class="btn btn-primary" id="group-next-share" style="width:100%;">Next Peer Sharing</button>
          </div>
        `,
        initCallback: (ctrl) => {
          const quote = document.getElementById('listening-shares');
          const author = document.getElementById('listening-author');
          const btn = document.getElementById('group-next-share');
          
          if (!quote || !author || !btn) return;
          
          const shares = [
            { q: ""I used to feel like I was the only one struggling with deadlines. Hearing other students share their coping strategies changed everything."", a: "— Dev, 3rd Year B.Tech" },
            { q: ""In the Listening Circle, no one interrupts you or tries to 'fix' your problems. They just listen with respect. It's incredibly freeing."", a: "— Shreya, 2nd Year MBA" },
            { q: ""I realized that showing vulnerability is actually a form of strength. We are all dealing with transition stress in college."", a: "— Rohan, 1st Year B.Tech" },
            { q: ""Hearing peers share their stories gave me the courage to book a professional CCHS clinical counselling session when I needed it."", a: "— Nithya, 4th Year B.Arch" }
          ];
          
          let idx = 0;
          btn.addEventListener('click', () => {
            idx = (idx + 1) % shares.length;
            quote.style.opacity = 0;
            author.style.opacity = 0;
            setTimeout(() => {
              quote.textContent = shares[idx].q;
              author.textContent = shares[idx].a;
              quote.style.opacity = 1;
              author.style.opacity = 1;
            }, 250);
          });
        }
      },
      movement: {
        title: "Movement Therapy Stretches",
        icon: "activity",
        tip: "Physical movement and stretches release muscular tension held in the neck and shoulders, breaking somatic stress loops.",
        html: `
          <div class="movement-app">
            <div class="movement-tabs" style="display:flex; gap:6px; margin-bottom:16px; overflow-x:auto; padding-bottom:6px;">
              <button class="move-tab-btn active" data-str="shoulder">Shoulder Release</button>
              <button class="move-tab-btn" data-str="eye">Eye Relaxer</button>
              <button class="move-tab-btn" data-str="wrist">Wrist stretch</button>
            </div>
            <div class="movement-content" id="movement-instructions" style="font-size:13px; line-height:1.6; min-height:60px;">
              <strong>Shoulder Roll stretch:</strong> Slowly roll your shoulders back in a circular motion 5 times, then forward 5 times. Exhale as you drop them.
            </div>
            <div class="movement-timer" style="margin-top:20px; display:flex; justify-content:space-between; align-items:center; border:1px solid var(--border-color); padding:12px; border-radius:12px; background:rgba(0,0,0,0.15);">
              <div class="movement-timer-display" id="move-timer-display" style="font-family:'Outfit',sans-serif; font-size:20px; font-weight:700; color:var(--text-primary);">30s</div>
              <button class="btn btn-primary" id="move-timer-btn" style="padding:6px 14px; font-size:12px;">Start Stretch Timer</button>
            </div>
          </div>
        `,
        initCallback: (ctrl) => {
          const tabBtns = document.querySelectorAll('.move-tab-btn');
          const inst = document.getElementById('movement-instructions');
          const display = document.getElementById('move-timer-display');
          const btn = document.getElementById('move-timer-btn');
          
          const stretches = {
            shoulder: "<strong>Shoulder Roll stretch:</strong> Slowly roll your shoulders back in a circular motion 5 times, then forward 5 times. Exhale as you drop them.",
            eye: "<strong>20-20-20 Eye break:</strong> Look away from screen to an object 20 feet away for 20 seconds. Blink slowly 5 times to rest focal muscles.",
            wrist: "<strong>Wrist Flexor:</strong> Extend your right arm out, fingers pointing down, gently pull back on fingers with your left hand for 15s. Repeat on left side."
          };
          
          tabBtns.forEach(b => {
            b.addEventListener('click', () => {
              tabBtns.forEach(x => x.classList.remove('active'));
              b.classList.add('active');
              const key = b.getAttribute('data-str');
              inst.innerHTML = stretches[key];
            });
          });
          
          let seconds = 30;
          let isRunning = false;
          let timer = null;
          
          btn.addEventListener('click', () => {
            if (isRunning) {
              isRunning = false;
              clearInterval(timer);
              btn.textContent = "Start Timer";
              display.textContent = "30s";
            } else {
              isRunning = true;
              btn.textContent = "Stop";
              seconds = 30;
              display.textContent = "30s";
              
              timer = setInterval(() => {
                seconds--;
                if (seconds <= 0) {
                  clearInterval(timer);
                  isRunning = false;
                  btn.textContent = "Start Timer";
                  display.textContent = "Done!";
                } else {
                  display.textContent = seconds + "s";
                }
              }, 1000);
              ctrl.hubIntervals.push(timer);
            }
          });
        }
      },
      talk: {
        title: "Talk Therapy Conversational Prompts",
        icon: "message-circle",
        tip: "Verbalizing your thoughts or answering reflective prompts helps organize chaotic emotions into linear, structured stories.",
        html: `
          <div class="talk-app">
            <p class="small-text text-center" style="margin-bottom:12px;">Reflective question to check-in with yourself:</p>
            <div class="talk-prompt-card" id="talk-prompt-box" style="border:1px solid var(--border-color); border-radius:18px; padding:24px; background:rgba(30,79,255,0.03); min-height:100px; display:flex; align-items:center; justify-content:center; text-align:center; font-size:14.5px; font-weight:500; font-family:'Outfit',sans-serif; color:var(--text-primary); margin-bottom:16px; line-height:1.6;">
              "What is one thing that brought you peace today, no matter how small?"
            </div>
            <button class="btn btn-primary" id="talk-next-btn" style="width:100%;">Next Conversational Prompt</button>
          </div>
        `,
        initCallback: (ctrl) => {
          const promptBox = document.getElementById('talk-prompt-box');
          const btn = document.getElementById('talk-next-btn');
          
          if (!promptBox || !btn) return;
          
          const prompts = [
            ""What is one thing that brought you peace today, no matter how small?"",
            ""If you could write a letter to your stress, what is the first sentence you would say?"",
            ""Who is someone in your life you appreciate having around? What makes them supportive?"",
            ""What is a core strength you discovered about yourself during a challenging transition?"",
            ""If you could give one piece of gentle advice to your freshman self, what would it be?""
          ];
          
          let idx = 0;
          btn.addEventListener('click', () => {
            idx = (idx + 1) % prompts.length;
            promptBox.style.opacity = 0;
            setTimeout(() => {
              promptBox.textContent = prompts[idx];
              promptBox.style.opacity = 1;
            }, 250);
          });
        }
      }
    };
    
    return data[id];
  }

}

document.addEventListener('DOMContentLoaded', () => {
  window.appController = new AppController();
  
  // Smooth scroll links inside page
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        const navLinks = document.getElementById('nav-links');
        const navToggle = document.getElementById('nav-toggle');
        if (navLinks && navLinks.classList.contains('open')) {
          navLinks.classList.remove('open');
          if (navToggle) {
            navToggle.innerHTML = '<i class="lucide-menu"></i>';
            if (typeof lucide !== 'undefined') lucide.createIcons();
          }
        }
        
        const offset = 90;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = targetEl.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});
