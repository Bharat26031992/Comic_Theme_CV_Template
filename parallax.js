document.addEventListener('DOMContentLoaded', () => {
  console.log("MULTIVERSE STABILIZED");

  // ─── CONFIGURATION & COMIC PHYSICS ───
  const maxTilt = 5; // Snappier, higher tilt
  const transition = 'transform 0.1s cubic-bezier(0.17, 0.88, 0.32, 1.28)';
  const gridSpacing = 60;
  const glitchRadius = 400;
  const glitchIntensity = 30;

  let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let halftones = [], glitches = [], popups = [];

  // ─── 1. SELF-INJECT SPIDER-VERSE STYLES ───
  const style = document.createElement('style');
  style.textContent = `
    #bg-canvas {
      position: fixed;
      top: -5%; left: -5%;
      width: 110%; height: 110%;
      z-index: -999;
      background: #050505;
      pointer-events: none;
    }
    body { background-color: transparent !important; }
    
    .onomatopoeia {
      position: fixed;
      font-family: 'Bangers', cursive;
      font-size: 5rem;
      color: #fff200;
      text-shadow: 4px 4px 0px #ff0037, -4px -4px 0px #2e3192;
      pointer-events: none;
      z-index: 10000;
      animation: comic-pop 0.4s ease-out forwards;
    }

    @keyframes comic-pop {
      0% { transform: scale(0) rotate(-20deg); opacity: 0; }
      50% { transform: scale(1.2) rotate(10deg); opacity: 1; }
      100% { transform: scale(1) rotate(0deg); opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  // ─── 2. CANVAS INITIALIZATION ───
  let canvas = document.createElement('canvas');
  canvas.id = 'bg-canvas';
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');

  const initScene = () => {
    canvas.width = window.innerWidth * 1.1;
    canvas.height = window.innerHeight * 1.1;
    
    // Generate Halftone dots instead of stars
    halftones = Array.from({ length: 150 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 4 + 2,
      color: Math.random() > 0.5 ? 'rgba(255, 0, 55, 0.2)' : 'rgba(46, 49, 146, 0.2)'
    }));
  };

  // ─── 3. CORE MULTIVERSE DRAWING ───

  function drawGlitchGrid() {
    // We draw a grid that "breaks" near the mouse
    ctx.lineWidth = 1;
    
    for (let x = 0; x <= canvas.width; x += gridSpacing) {
      ctx.beginPath();
      ctx.strokeStyle = x % (gridSpacing * 2) === 0 ? 'rgba(0, 255, 255, 0.15)' : 'rgba(255, 0, 255, 0.1)';
      for (let y = 0; y <= canvas.height; y += 30) {
        const dx = mouse.x - x;
        const dy = mouse.y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Glitch offset
        let glitchX = 0;
        if (dist < glitchRadius) {
          glitchX = (Math.random() - 0.5) * glitchIntensity * (1 - dist / glitchRadius);
        }
        
        ctx.lineTo(x + glitchX, y);
      }
      ctx.stroke();
    }
  }

  function animate() {
    mouse.x += (mouse.targetX - mouse.x) * 0.15;
    mouse.y += (mouse.targetY - mouse.y) * 0.15;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Background Radial Halftone Vignette
    const grd = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, glitchRadius * 2);
    grd.addColorStop(0, 'rgba(46, 49, 146, 0.05)');
    grd.addColorStop(1, '#050505');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawGlitchGrid();

    // Drifting Halftones
    halftones.forEach(dot => {
      dot.y -= 0.5;
      if (dot.y < 0) dot.y = canvas.height;
      ctx.fillStyle = dot.color;
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  // ─── 4. INTERACTION: ONOMATOPOEIA POPUPS ───
  const words = ["THWIP!", "POW!", "ZAP!", "BOOM!", "GLITCH!", "616!"];
  
  window.addEventListener('mousedown', (e) => {
    const word = words[Math.floor(Math.random() * words.length)];
    const el = document.createElement('div');
    el.className = 'onomatopoeia';
    el.innerText = word;
    el.style.left = e.clientX + 'px';
    el.style.top = e.clientY + 'px';
    el.style.transform = `translate(-50%, -50%) rotate(${(Math.random() - 0.5) * 30}deg)`;
    document.body.appendChild(el);
    
    // Remove element after animation
    setTimeout(() => el.remove(), 400);
  });

  // ─── 5. PARALLAX INTERACTION ───
  window.addEventListener('mousemove', (e) => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;

    const xVal = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
    const yVal = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);

    // Target the specific "Comic Panels" (Cards)
    const cards = document.querySelectorAll('.comic-panel, .lab-card');
    const titles = document.querySelectorAll('.module-title');

    cards.forEach((el, i) => {
      const depth = 1.2 + (i * 0.1);
      const rotX = yVal * maxTilt * depth;
      const rotY = -xVal * maxTilt * depth;
      const moveX = xVal * 40 * depth;
      const moveY = yVal * 40 * depth;

      el.style.transition = transition;
      el.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translate3d(${moveX}px, ${moveY}px, 50px)`;
    });

    titles.forEach((el) => {
        el.style.transform = `skew(-10deg) translateX(${xVal * 20}px)`;
    });
  });

  window.addEventListener('resize', initScene);
  initScene();
  animate();
});