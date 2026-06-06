class ParticleSystem {
  constructor() {
    this.canvas = document.getElementById('particle-canvas');
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null, targetX: 0, targetY: 0, radius: 150 };
    this.particleCount = 60;
    
    // Cache background orbs to prevent selector query thrashing in animation loop
    this.orb1 = document.querySelector('.bg-orb-1');
    this.orb2 = document.querySelector('.bg-orb-2');
    this.orb3 = document.querySelector('.bg-orb-3');
    
    this.init();
    this.animate();
    this.addEventListeners();
  }
  
  init() {
    this.resizeCanvas();
    this.createParticles();
  }
  
  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  
  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      const size = Math.random() * 3 + 1;
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height;
      const speedX = (Math.random() - 0.5) * 0.4;
      const speedY = (Math.random() - 0.5) * 0.4;
      const opacity = Math.random() * 0.4 + 0.1;
      
      this.particles.push({
        x,
        y,
        size,
        speedX,
        speedY,
        opacity,
        baseOpacity: opacity
      });
    }
  }
  
  addEventListeners() {
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.createParticles();
    });
    
    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = e.clientX;
      this.mouse.targetY = e.clientY;
    });
    
    window.addEventListener('mouseout', () => {
      this.mouse.targetX = null;
      this.mouse.targetY = null;
    });
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Smooth mouse position tracking
    if (this.mouse.targetX !== null) {
      if (this.mouse.x === null) {
        this.mouse.x = this.mouse.targetX;
        this.mouse.y = this.mouse.targetY;
      } else {
        this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.08;
        this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.08;
      }
    } else {
      this.mouse.x = null;
      this.mouse.y = null;
    }
    
    // Update and draw particles
    this.particles.forEach((particle) => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      // Boundary check
      if (particle.x < 0) particle.x = this.canvas.width;
      if (particle.x > this.canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = this.canvas.height;
      if (particle.y > this.canvas.height) particle.y = 0;
      
      // Mouse interaction (repulsion/glow)
      if (this.mouse.x !== null) {
        const dx = particle.x - this.mouse.x;
        const dy = particle.y - this.mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.mouse.radius) {
          const force = (this.mouse.radius - distance) / this.mouse.radius;
          particle.opacity = particle.baseOpacity + force * 0.4;
          
          // Move slightly away
          const angle = Math.atan2(dy, dx);
          particle.x += Math.cos(angle) * force * 0.5;
          particle.y += Math.sin(angle) * force * 0.5;
        } else {
          if (particle.opacity > particle.baseOpacity) {
            particle.opacity -= 0.01;
          }
        }
      } else {
        if (particle.opacity > particle.baseOpacity) {
          particle.opacity -= 0.01;
        }
      }
      
      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      
      const isLightMode = document.documentElement.classList.contains('light-mode');
      if (isLightMode) {
        this.ctx.fillStyle = `rgba(30, 79, 255, ${particle.opacity})`;
      } else {
        this.ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
      }
      
      this.ctx.fill();
    });
    
    // Update floating background orbs with mouse parallax offset
    if (this.mouse.x !== null) {
      const pxX = (this.mouse.x - window.innerWidth / 2) * -0.02;
      const pxY = (this.mouse.y - window.innerHeight / 2) * -0.02;
      
      if (this.orb1) this.orb1.style.transform = `translate(${pxX}px, ${pxY}px)`;
      if (this.orb2) this.orb2.style.transform = `translate(${pxX * -1.5}px, ${pxY * -1.5}px) scale(1.2)`;
      if (this.orb3) this.orb3.style.transform = `translate(-50%, -50%) translate(${pxX * 0.8}px, ${pxY * 0.8}px) scale(1.1)`;
    }
    
    requestAnimationFrame(() => this.animate());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ParticleSystem();
});
