/* =========================================================
   HAPPY BIRTHDAY DIDI - MINIMAL & INTERACTIVE SCRIPT
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------
     1. BACKGROUND CANVAS (MINIMAL AMBIENT GLOW & PARTICLES)
     --------------------------------------------------------- */
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Soft ambient floating bokeh/stars
  const ambientParticles = [];
  const AMBIENT_COUNT = 36;
  const colors = ['#f4b4b4', '#ffd700', '#ff9ff3', '#ffeaa7', '#ffffff', '#74b9ff'];

  for (let i = 0; i < AMBIENT_COUNT; i++) {
    ambientParticles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.5 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 0.35,
      vy: -Math.random() * 0.45 - 0.15,
      alpha: Math.random() * 0.6 + 0.25,
      pulse: Math.random() * 0.04 + 0.01,
      growing: Math.random() > 0.5
    });
  }

  // Active celebratory confetti bursts (triggered on wish & gift opening)
  let confettiList = [];

  function spawnConfetti(originX, originY, count = 70) {
    const burstColors = ['#ff4757', '#ff6b81', '#ffa502', '#2ed573', '#1e90ff', '#e056fd', '#ffffff', '#ffd32a'];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 3.5;
      confettiList.push({
        x: originX || width / 2,
        y: originY || height * 0.45,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2.5,
        size: Math.random() * 7 + 4,
        color: burstColors[Math.floor(Math.random() * burstColors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
        life: 1,
        decay: Math.random() * 0.012 + 0.008,
        shape: Math.random() > 0.4 ? 'rect' : 'circle'
      });
    }
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Draw ambient floating sparkles
    for (const p of ambientParticles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < -10) p.y = height + 10;
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      if (p.growing) {
        p.alpha += p.pulse;
        if (p.alpha >= 0.8) p.growing = false;
      } else {
        p.alpha -= p.pulse;
        if (p.alpha <= 0.2) p.growing = true;
      }

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 6;
      ctx.shadowColor = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Draw active confetti
    for (let i = confettiList.length - 1; i >= 0; i--) {
      const c = confettiList[i];
      c.x += c.vx;
      c.y += c.vy;
      c.vy += 0.2; // gravity
      c.vx *= 0.98; // drag
      c.rotation += c.rotSpeed;
      c.life -= c.decay;

      if (c.life <= 0 || c.y > height + 20) {
        confettiList.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, c.life);
      ctx.translate(c.x, c.y);
      ctx.rotate((c.rotation * Math.PI) / 180);
      ctx.fillStyle = c.color;

      if (c.shape === 'rect') {
        ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size * 0.6);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, c.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    requestAnimationFrame(render);
  }
  render();

  /* ---------------------------------------------------------
     2. DYNAMIC 5-PHOTO MEMORY ALBUM (FULL PHOTO VISIBILITY)
     --------------------------------------------------------- */
  const photos = [
    { src: 'IMG_20261026_011158_033.jpg', orientation: 'portrait' },
    { src: 'IMG-20251029-WA0043.jpg', orientation: 'portrait' },
    { src: 'IMG_20251108_121100_113.jpg', orientation: 'landscape' },
    { src: 'IMG_20260114_153032_658.jpg', orientation: 'landscape' },
    { src: 'IMG_20260305_180756_899.jpg', orientation: 'portrait' }
  ];

  let currentPhotoIndex = 0;
  const polaroidCard = document.getElementById('polaroid-card');
  const activePhotoImg = document.getElementById('active-photo');
  const prevPhotoBtn = document.getElementById('prev-photo-btn');
  const nextPhotoBtn = document.getElementById('next-photo-btn');
  const thumbItems = document.querySelectorAll('.thumb-item');

  // Preload images into memory for instant seamless switching
  photos.forEach(item => {
    const imgObj = new Image();
    imgObj.src = item.src;
  });

  function applyOrientation(orientation) {
    if (!polaroidCard) return;
    if (orientation === 'landscape') {
      polaroidCard.classList.remove('portrait-mode');
      polaroidCard.classList.add('landscape-mode');
    } else {
      polaroidCard.classList.remove('landscape-mode');
      polaroidCard.classList.add('portrait-mode');
    }
  }

  function updatePhoto(newIndex) {
    if (newIndex < 0) {
      newIndex = photos.length - 1;
    } else if (newIndex >= photos.length) {
      newIndex = 0;
    }

    currentPhotoIndex = newIndex;
    const target = photos[currentPhotoIndex];

    // Smooth transition
    activePhotoImg.classList.add('fade-out');

    // Dynamically adjust wrapper size smoothly
    applyOrientation(target.orientation);

    setTimeout(() => {
      activePhotoImg.src = target.src;

      // Update thumbnail active states
      thumbItems.forEach((btn, idx) => {
        btn.classList.toggle('active', idx === currentPhotoIndex);
      });

      // Confirm orientation from image's natural aspect ratio once loaded
      activePhotoImg.onload = () => {
        if (activePhotoImg.naturalWidth && activePhotoImg.naturalHeight) {
          const ratio = activePhotoImg.naturalWidth / activePhotoImg.naturalHeight;
          applyOrientation(ratio > 1.15 ? 'landscape' : 'portrait');
        }
        activePhotoImg.classList.remove('fade-out');
      };

      // Fallback in case image is already cached
      if (activePhotoImg.complete) {
        activePhotoImg.classList.remove('fade-out');
      }
    }, 180);
  }

  // Initial call to set orientation
  applyOrientation(photos[0].orientation);

  if (prevPhotoBtn && nextPhotoBtn) {
    prevPhotoBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      updatePhoto(currentPhotoIndex - 1);
    });

    nextPhotoBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      updatePhoto(currentPhotoIndex + 1);
    });
  }

  thumbItems.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.getAttribute('data-index'), 10);
      updatePhoto(idx);
    });
  });

  // Touch swipe support for polaroid on mobile
  let touchStartX = 0;
  let touchEndX = 0;

  if (polaroidCard) {
    polaroidCard.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    polaroidCard.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 45) {
        updatePhoto(currentPhotoIndex + 1);
      } else if (touchEndX - touchStartX > 45) {
        updatePhoto(currentPhotoIndex - 1);
      }
    }, { passive: true });

    // Subtle 3D tilt on mouse hover
    polaroidCard.addEventListener('mousemove', (e) => {
      const rect = polaroidCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;
      polaroidCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    polaroidCard.addEventListener('mouseleave', () => {
      polaroidCard.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
  }

  /* ---------------------------------------------------------
     3. MUSIC BOX "HAPPY BIRTHDAY" TUNE (WEB AUDIO API)
     --------------------------------------------------------- */
  let audioCtx = null;
  let isPlayingMusic = false;
  let melodyTimeout = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  const NOTES = {
    G3: 196.00, A3: 220.00, B3: 246.94,
    C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
    C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99,
    REST: 0
  };

  const birthdayMelody = [
    ['G4', 0.35], ['G4', 0.25], ['A4', 0.6], ['G4', 0.6], ['C5', 0.6], ['B4', 1.0],
    ['G4', 0.35], ['G4', 0.25], ['A4', 0.6], ['G4', 0.6], ['D5', 0.6], ['C5', 1.0],
    ['G4', 0.35], ['G4', 0.25], ['G5', 0.6], ['E5', 0.6], ['C5', 0.6], ['B4', 0.6], ['A4', 0.8],
    ['F5', 0.35], ['F5', 0.25], ['E5', 0.6], ['C5', 0.6], ['D5', 0.6], ['C5', 1.2],
    ['REST', 0.8]
  ];

  function playNote(freq, duration) {
    if (!audioCtx || freq === 0) return;
    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.18, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration + 0.3);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.35);
    } catch (e) {
      console.warn("Audio note issue", e);
    }
  }

  function playCelebrationFanfare() {
    initAudio();
    if (!audioCtx) return;
    const fanfare = [
      ['C5', 0.15], ['E5', 0.15], ['G5', 0.2], ['C5', 0.4]
    ];
    let offset = 0;
    fanfare.forEach(([note, dur]) => {
      setTimeout(() => {
        playNote(NOTES[note], dur);
      }, offset * 1000);
      offset += dur * 0.9;
    });
  }

  function startMelodyLoop() {
    let noteIndex = 0;

    function nextNote() {
      if (!isPlayingMusic) return;
      const [noteName, duration] = birthdayMelody[noteIndex];
      if (noteName !== 'REST') {
        playNote(NOTES[noteName], duration);
      }
      noteIndex = (noteIndex + 1) % birthdayMelody.length;
      melodyTimeout = setTimeout(nextNote, duration * 750);
    }

    nextNote();
  }

  const musicBtn = document.getElementById('music-btn');
  const musicIcon = document.getElementById('music-icon');
  const musicLabel = musicBtn.querySelector('.label');

  musicBtn.addEventListener('click', () => {
    initAudio();
    if (!isPlayingMusic) {
      isPlayingMusic = true;
      musicBtn.classList.add('playing');
      musicIcon.textContent = '🔊';
      musicLabel.textContent = 'Pause Music';
      startMelodyLoop();
    } else {
      isPlayingMusic = false;
      musicBtn.classList.remove('playing');
      musicIcon.textContent = '🎵';
      musicLabel.textContent = 'Play Music';
      if (melodyTimeout) clearTimeout(melodyTimeout);
    }
  });

  /* ---------------------------------------------------------
     4. INTERACTIVE CAKE & BLOW CANDLES
     --------------------------------------------------------- */
  const blowBtn = document.getElementById('blow-candle-btn');
  const flames = [
    document.getElementById('flame-1'),
    document.getElementById('flame-2'),
    document.getElementById('flame-3')
  ];
  const cakeGlow = document.getElementById('cake-glow');
  const wishStatus = document.getElementById('wish-status');
  let candlesBlown = false;

  blowBtn.addEventListener('click', () => {
    initAudio();

    if (!candlesBlown) {
      candlesBlown = true;
      flames.forEach(f => f.classList.add('blown'));
      if (cakeGlow) cakeGlow.classList.add('blown');

      blowBtn.textContent = '✨ Relight Candles ✨';
      wishStatus.textContent = '🎉 Your wish has been sent to the stars, Didi! Happy Birthday! 🎉';
      wishStatus.classList.add('active');

      playCelebrationFanfare();
      // Celebratory confetti shower
      spawnConfetti(width / 2, height * 0.55, 110);
      setTimeout(() => spawnConfetti(width * 0.3, height * 0.4, 70), 300);
      setTimeout(() => spawnConfetti(width * 0.7, height * 0.4, 70), 600);

      // Start music if not active
      if (!isPlayingMusic) {
        isPlayingMusic = true;
        musicBtn.classList.add('playing');
        musicIcon.textContent = '🔊';
        musicLabel.textContent = 'Pause Music';
        startMelodyLoop();
      }
    } else {
      // Relight candles
      candlesBlown = false;
      flames.forEach(f => f.classList.remove('blown'));
      if (cakeGlow) cakeGlow.classList.remove('blown');

      blowBtn.textContent = '🎂 Blow Candles & Make Wish!';
      wishStatus.textContent = '✨ Ready to make another magical wish! ✨';
    }
  });

  /* ---------------------------------------------------------
     5. SURPRISE GIFT BOX & REVEAL LETTER
     --------------------------------------------------------- */
  const giftTrigger = document.getElementById('gift-box-trigger');
  const giftBox = document.getElementById('gift-box');
  const letterContainer = document.getElementById('letter-container');
  let giftOpened = false;

  giftTrigger.addEventListener('click', () => {
    initAudio();
    if (!giftOpened) {
      giftOpened = true;
      giftBox.classList.add('open');
      letterContainer.classList.add('revealed');
      playCelebrationFanfare();

      const rect = giftBox.getBoundingClientRect();
      spawnConfetti(rect.left + rect.width / 2, rect.top, 80);

      setTimeout(() => {
        letterContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 350);
    } else {
      letterContainer.classList.toggle('revealed');
      if (letterContainer.classList.contains('revealed')) {
        giftBox.classList.add('open');
      } else {
        giftBox.classList.remove('open');
      }
    }
  });

});
