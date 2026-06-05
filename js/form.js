class FormSystem {
  constructor() {
    this.modal = document.getElementById('apply-modal');
    this.triggerBtns = document.querySelectorAll('.apply-trigger-btn');
    this.closeBtn = document.getElementById('modal-close');
    this.form = document.getElementById('apply-form');
    
    this.steps = document.querySelectorAll('.form-step');
    this.progressBar = document.querySelector('.form-progress-indicator');
    this.prevBtn = document.getElementById('form-prev-btn');
    this.nextBtn = document.getElementById('form-next-btn');
    this.submitBtn = document.getElementById('form-submit-btn');
    
    this.currentStep = 0;
    this.totalSteps = this.steps.length;
    
    this.init();
  }
  
  init() {
    // Open modal triggers
    this.triggerBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openModal();
      });
    });
    
    // Close modal triggers
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.closeModal());
    }
    
    // Backdrop click close
    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.closeModal();
      });
    }
    
    // Navigation buttons
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.navigateStep(1));
    }
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.navigateStep(-1));
    }
    
    // Form submit
    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
  }
  
  openModal() {
    if (this.modal) {
      this.modal.classList.add('open');
      this.resetForm();
      document.body.style.overflow = 'hidden'; // Lock background scroll
    }
  }
  
  closeModal() {
    if (this.modal) {
      this.modal.classList.remove('open');
      document.body.style.overflow = 'auto'; // Release background scroll
    }
  }
  
  navigateStep(direction) {
    if (direction === 1 && !this.validateCurrentStep()) {
      return; // Stop navigation if step validation fails
    }
    
    this.currentStep += direction;
    this.updateFormDisplay();
  }
  
  validateCurrentStep() {
    const activeStepEl = this.steps[this.currentStep];
    const inputs = activeStepEl.querySelectorAll('input, select, textarea');
    let isValid = true;
    
    inputs.forEach(input => {
      // Remove any existing error style
      input.style.borderColor = 'var(--border-color)';
      
      if (input.hasAttribute('required')) {
        if (!input.value.trim()) {
          isValid = false;
          input.style.borderColor = '#ff4757';
          this.shakeElement(input);
        }
      }
      
      // Email verification
      if (input.type === 'email' && input.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value.trim())) {
          isValid = false;
          input.style.borderColor = '#ff4757';
          this.shakeElement(input);
        }
      }
    });
    
    return isValid;
  }
  
  shakeElement(el) {
    el.classList.add('shake-anim');
    setTimeout(() => el.classList.remove('shake-anim'), 500);
  }
  
  updateFormDisplay() {
    // Show/hide correct step panel
    this.steps.forEach((step, idx) => {
      if (idx === this.currentStep) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });
    
    // Update progress bar
    const progressPercent = ((this.currentStep + 1) / this.totalSteps) * 100;
    if (this.progressBar) {
      this.progressBar.style.width = `${progressPercent}%`;
    }
    
    // Update buttons visibility
    if (this.prevBtn) {
      this.prevBtn.style.display = this.currentStep === 0 ? 'none' : 'block';
    }
    if (this.nextBtn) {
      this.nextBtn.style.display = this.currentStep === this.totalSteps - 1 ? 'none' : 'block';
    }
    if (this.submitBtn) {
      this.submitBtn.style.display = this.currentStep === this.totalSteps - 1 ? 'block' : 'none';
    }
  }
  
  handleSubmit(e) {
    e.preventDefault();
    if (!this.validateCurrentStep()) return;
    
    // Animate Submit State
    const submitArea = this.form.querySelector('.form-navigation');
    const formFields = this.form.querySelector('#form-steps-container');
    const headerTitle = this.modal.querySelector('.modal-header-title');
    
    if (formFields) formFields.style.opacity = '0.3';
    if (submitArea) submitArea.style.display = 'none';
    
    // Inject glass loader layout
    const loader = document.createElement('div');
    loader.className = 'glass-loader-overlay';
    loader.innerHTML = `
      <div class="loader-content" style="display:flex; flex-direction:column; align-items:center; gap:16px;">
        <i data-lucide="loader-2" class="spin-anim" style="width: 40px; height: 40px; color: var(--accent-gold);"></i>
        <p style="color: var(--text-primary); font-size:16px;">Processing Application...</p>
      </div>
    `;
    this.form.appendChild(loader);
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
    
    setTimeout(() => {
      // Transition to Success Card Screen
      loader.remove();
      if (formFields) formFields.remove();
      if (headerTitle) headerTitle.textContent = "Application Submitted!";
      
      const successCard = document.createElement('div');
      successCard.className = 'form-success-card';
      successCard.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; text-align:center; gap:20px; padding: 20px 0;">
          <div class="success-icon-wrapper" style="width: 80px; height: 80px; border-radius:50%; background:rgba(46, 213, 115, 0.15); border: 2px solid #2ed573; display:flex; align-items:center; justify-content:center; color:#2ed573; font-size: 32px; animation: popIn 0.5s cubic-bezier(0.22, 1, 0.36, 1);">
            <i data-lucide="check" style="width: 32px; height: 32px;"></i>
          </div>
          <h3 style="font-size:24px; color:var(--text-primary);">You're on the list!</h3>
          <p style="color:var(--text-secondary); font-size: 16px; max-width:400px;">
            Thank you for applying to become a Peer Educator for the academic year 2026-27. 
            Your registration ticket is <strong style="color:var(--accent-gold);">#PES-${Math.floor(1000 + Math.random() * 9000)}</strong>.
          </p>
          <div class="glass-card" style="padding: 16px; border-radius: 16px; width: 100%; text-align: left; font-size: 14px;">
            <strong style="color:var(--text-primary); display:block; margin-bottom:8px;">What's next?</strong>
            <ol style="padding-left:20px; color:var(--text-secondary); display:flex; flex-direction:column; gap:6px;">
              <li>Application screening by the CCHS Counselling Team.</li>
              <li>Invitation for the selection interview (via registered email).</li>
              <li>Participation in the Peer Leadership Training Programme.</li>
            </ol>
          </div>
          <button type="button" class="btn btn-primary" onclick="window.formInstance.closeModal()" style="margin-top: 10px;">Close Window</button>
        </div>
      `;
      this.form.appendChild(successCard);
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    }, 1500);
  }
  
  resetForm() {
    this.currentStep = 0;
    this.form.reset();
    
    // Clear elements
    const successCard = this.form.querySelector('.form-success-card');
    if (successCard) successCard.remove();
    
    // Restore elements
    const formFields = this.form.querySelector('#form-steps-container');
    if (!formFields) {
      // Re-inject form container if it was deleted
      window.location.reload(); // Quick reset
      return;
    }
    formFields.style.opacity = '1';
    
    const submitArea = this.form.querySelector('.form-navigation');
    if (submitArea) submitArea.style.display = 'flex';
    
    const headerTitle = this.modal.querySelector('.modal-header-title');
    if (headerTitle) headerTitle.textContent = "Become a Peer Educator";
    
    this.updateFormDisplay();
  }
}

// Inject shake and spin styling
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%, 60% { transform: translateX(-6px); }
    40%, 80% { transform: translateX(6px); }
  }
  .shake-anim {
    animation: shake 0.3s ease;
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .spin-anim {
    animation: spin 1s linear infinite;
  }
  @keyframes popIn {
    from { transform: scale(0.6); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  .glass-loader-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(7, 17, 29, 0.4);
    backdrop-filter: blur(10px);
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: var(--radius-lg);
  }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
  window.formInstance = new FormSystem();
});
