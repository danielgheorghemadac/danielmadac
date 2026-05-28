(function () {
    'use strict';

    // ============ PARTICLE SYSTEM ============
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };
    let animId;

    function resizeCanvas() {
        canvas.width = canvas.offsetWidth * devicePixelRatio;
        canvas.height = canvas.offsetHeight * devicePixelRatio;
        ctx.scale(devicePixelRatio, devicePixelRatio);
    }

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            const w = canvas.offsetWidth;
            const h = canvas.offsetHeight;
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.5 + 0.1;
        }

        update() {
            const w = canvas.offsetWidth;
            const h = canvas.offsetHeight;
            this.x += this.speedX;
            this.y += this.speedY;

            if (mouse.x !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    this.x -= dx * 0.008;
                    this.y -= dy * 0.008;
                }
            }

            if (this.x < 0 || this.x > w) this.speedX *= -1;
            if (this.y < 0 || this.y > h) this.speedY *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(68, 138, 255, ${this.opacity})`;
            ctx.fill();
        }
    }

    function initParticles() {
        const count = Math.min(Math.floor((canvas.offsetWidth * canvas.offsetHeight) / 8000), 120);
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 130) {
                    const opacity = (1 - dist / 130) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(68, 138, 255, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
        particles.forEach(p => { p.update(); p.draw(); });
        drawConnections();
        animId = requestAnimationFrame(animateParticles);
    }

    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });

    canvas.addEventListener('mousemove', e => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    canvas.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

    resizeCanvas();
    initParticles();
    animateParticles();

    // ============ NAVIGATION ============
    const nav = document.getElementById('nav');
    const navBurger = document.getElementById('navBurger');
    const navLinks = document.getElementById('navLinks');

    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    var savedScrollPos = 0;

    navBurger.addEventListener('click', () => {
        var isOpening = !navLinks.classList.contains('open');
        if (isOpening) savedScrollPos = window.scrollY;
        navBurger.classList.toggle('active');
        navLinks.classList.toggle('open');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    function closeMenu(restoreScroll) {
        navBurger.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
        if (restoreScroll) {
            requestAnimationFrame(function () { window.scrollTo(0, savedScrollPos); });
        }
    }

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function () { closeMenu(false); });
    });

    var navClose = document.getElementById('navClose');
    if (navClose) navClose.addEventListener('click', function () { closeMenu(true); });

    // ============ COUNTER ANIMATION ============
    function animateCounters() {
        document.querySelectorAll('.stat-number').forEach(el => {
            const target = parseInt(el.dataset.target, 10);
            const duration = 1800;
            const start = performance.now();

            function step(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.round(target * eased);
                if (progress < 1) requestAnimationFrame(step);
            }

            requestAnimationFrame(step);
        });
    }

    let countersAnimated = false;
    const heroObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersAnimated) {
                countersAnimated = true;
                setTimeout(animateCounters, 1600);
            }
        });
    }, { threshold: 0.3 });

    heroObserver.observe(document.getElementById('hero'));

    // ============ SCROLL REVEAL ============
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach((el, i) => {
        el.style.transitionDelay = `${(i % 6) * 0.08}s`;
        revealObserver.observe(el);
    });

    // ============ SKILL & LANGUAGE BAR ANIMATION ============
    const barObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const fill = entry.target;
                const width = fill.dataset.width;
                fill.style.setProperty('--target-width', width + '%');
                fill.classList.add('animated');
                barObserver.unobserve(fill);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.skill-fill, .lang-fill').forEach(el => {
        barObserver.observe(el);
    });

    // ============ SECRET FACTS ON DM LOGO ============
    (function initSecretFacts() {
        var facts = [
            { q: 'Biggest Dream', a: 'Build something that changes millions of lives' },
            { q: 'Biggest Fear', a: 'Standing still — not growing, not building' },
            { q: 'Favorite Country', a: "All 4 shaped me. But Italy is where my soul lives" },
            { q: 'Dream Location', a: 'Wherever the next big challenge takes me' },
            { q: 'Hidden Talent', a: 'I learn any language — human or machine — fast' },
            { q: 'Life Motto', a: 'Give me the hard challenge' },
            { q: 'Best Time to Code', a: 'After midnight. The world is quiet, the ideas are loud' },
            { q: 'Superpower', a: 'Adapting to any environment — 4 countries proved it' },
            { q: 'Favorite Tool', a: 'My hands. Everything starts with building' },
            { q: 'What Drives Me', a: 'My 2 kids. Every project is for their future' },
            { q: 'Comfort Food', a: 'Romanian mămăligă & Italian carbonara' },
            { q: 'First Code', a: 'HTML on a school PC in Rome, age 16' },
            { q: 'Dream Team', a: "Small, fast, multicultural — like every team I've led" },
            { q: 'Music While Working', a: 'Lo-fi beats or total silence. No in-between' },
            { q: 'If Not Tech', a: 'A photographer documenting human stories worldwide' }
        ];
        var factIndex = 0;
        var tapCount = 0;
        var tapTimer = null;

        var logo = document.querySelector('.nav-logo');
        if (!logo) return;

        logo.addEventListener('click', function(e) {
            e.preventDefault();
            tapCount++;

            if (tapTimer) clearTimeout(tapTimer);
            tapTimer = setTimeout(function() {
                if (tapCount < 3) {
                    // Single/double tap: flash and scroll to top
                    var flash = document.createElement('div');
                    flash.className = 'screen-flash';
                    document.body.appendChild(flash);
                    requestAnimationFrame(function() { flash.classList.add('active'); });
                    setTimeout(function() {
                        window.scrollTo({ top: 0, behavior: 'instant' });
                        flash.classList.remove('active');
                        setTimeout(function() { flash.remove(); }, 400);
                    }, 250);
                }
                tapCount = 0;
            }, 500);

            if (tapCount >= 3) {
                tapCount = 0;
                if (tapTimer) clearTimeout(tapTimer);
                var fact = facts[factIndex % facts.length];
                factIndex++;
                if (window.__unlockBadge) window.__unlockBadge('hidden-gem');

                var popup = document.createElement('div');
                popup.className = 'secret-fact';
                popup.innerHTML = '<div class="secret-fact-q">' + fact.q + '</div><div class="secret-fact-a">' + fact.a + '</div>';
                document.body.appendChild(popup);

                setTimeout(function() { popup.classList.add('visible'); }, 50);
                setTimeout(function() {
                    popup.classList.remove('visible');
                    setTimeout(function() { popup.remove(); }, 500);
                }, 3500);
            }
        });
    })();

    // ============ HARD REFRESH BUTTON ============
    var refreshBtn = document.getElementById('hardRefresh');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function () {
            if ('caches' in window) {
                caches.keys().then(function (names) {
                    names.forEach(function (name) { caches.delete(name); });
                }).then(function () {
                    window.location.reload(true);
                });
            } else {
                window.location.href = window.location.pathname + '?t=' + Date.now();
            }
        });
    }

    // ============ PARALLAX SUBTLE EFFECT ON HERO ============
    const heroContent = document.querySelector('.hero-content');
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        if (scrolled < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrolled * 0.25}px)`;
            heroContent.style.opacity = 1 - scrolled / (window.innerHeight * 0.8);
        }
    }, { passive: true });

    // ============ VIVATECH COUNTDOWN TIMER ============
    (function initCountdown() {
        const targetDate = new Date('2026-06-17T09:00:00+02:00').getTime();
        const daysEl = document.getElementById('cd-days');
        const hoursEl = document.getElementById('cd-hours');
        const minsEl = document.getElementById('cd-mins');
        const secsEl = document.getElementById('cd-secs');
        const banner = document.getElementById('countdown');

        if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

        function pad(n) { return String(n).padStart(2, '0'); }

        function tick() {
            const now = Date.now();
            const diff = targetDate - now;

            if (diff <= 0) {
                daysEl.textContent = '00';
                hoursEl.textContent = '00';
                minsEl.textContent = '00';
                secsEl.textContent = '00';
                if (banner) banner.querySelector('.countdown-label').textContent = 'VivaTech 2026 is LIVE!';
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const secs = Math.floor((diff % (1000 * 60)) / 1000);

            const newDays = pad(days);
            const newHours = pad(hours);
            const newMins = pad(mins);
            const newSecs = pad(secs);

            if (daysEl.textContent !== newDays) { daysEl.textContent = newDays; daysEl.classList.add('tick'); }
            if (hoursEl.textContent !== newHours) { hoursEl.textContent = newHours; hoursEl.classList.add('tick'); }
            if (minsEl.textContent !== newMins) { minsEl.textContent = newMins; minsEl.classList.add('tick'); }
            if (secsEl.textContent !== newSecs) { secsEl.textContent = newSecs; secsEl.classList.add('tick'); }

            setTimeout(function () {
                daysEl.classList.remove('tick');
                hoursEl.classList.remove('tick');
                minsEl.classList.remove('tick');
                secsEl.classList.remove('tick');
            }, 400);

            requestAnimationFrame(function () {
                setTimeout(tick, 1000 - (Date.now() % 1000));
            });
        }

        tick();
    })();

    // ============ 3D TILT EFFECT ON CARDS (MOUSE + TOUCH) ============
    (function initTiltCards() {
        var selectors = '.lang-card, .contact-card, .timeline-content';
        var cards = document.querySelectorAll(selectors);
        var MAX_TILT = 15;

        function applyTilt(card, clientX, clientY) {
            var rect = card.getBoundingClientRect();
            var centerX = rect.left + rect.width / 2;
            var centerY = rect.top + rect.height / 2;
            var rotateY = ((clientX - centerX) / (rect.width / 2)) * MAX_TILT;
            var rotateX = -((clientY - centerY) / (rect.height / 2)) * MAX_TILT;
            card.style.transition = 'none';
            card.style.transform = 'perspective(600px) rotateX(' + rotateX.toFixed(2) + 'deg) rotateY(' + rotateY.toFixed(2) + 'deg) scale3d(1.03, 1.03, 1.03)';
        }

        function resetTilt(card) {
            card.style.transition = 'transform 0.45s cubic-bezier(0.23, 1, 0.32, 1)';
            card.style.transform = '';
            setTimeout(function() { card._touching = false; }, 500);
        }

        cards.forEach(function (card) {
            card.style.willChange = 'transform';
            card.style.transition = 'transform 0.45s cubic-bezier(0.23, 1, 0.32, 1)';
            var isTilting = false;

            card.addEventListener('mousemove', function (e) {
                card._touching = true;
                applyTilt(card, e.clientX, e.clientY);
            });
            card.addEventListener('mouseleave', function () {
                resetTilt(card);
            });

            card.addEventListener('touchstart', function (e) {
                isTilting = true;
                card._touching = true;
                var t = e.touches[0];
                applyTilt(card, t.clientX, t.clientY);
            }, { passive: true });

            card.addEventListener('touchmove', function (e) {
                if (!isTilting) return;
                var t = e.touches[0];
                applyTilt(card, t.clientX, t.clientY);
            }, { passive: true });

            card.addEventListener('touchend', function () {
                isTilting = false;
                resetTilt(card);
            });
        });
    })();

    // ============ GYROSCOPE TILT (iOS, Android, anywhere with DeviceOrientation) ============
    (function initGyroTilt() {
        if (typeof DeviceOrientationEvent === 'undefined') return;

        var gyroCards = document.querySelectorAll('.skill-card, .project-card, .lang-card, .contact-card, .timeline-content, .vivatech-card, .journey-stop, .lang-card, .badge-content');
        if (!gyroCards.length) return;

        var enabled = false;
        var currentBeta = 0, currentGamma = 0;
        var targetBeta = 0, targetGamma = 0;
        var calibrated = false;
        var baseBeta = 30, baseGamma = 0;
        var MAX_TILT = 7;
        var SMOOTH = 0.12;
        var loopRunning = false;

        function loop() {
            currentBeta += (targetBeta - currentBeta) * SMOOTH;
            currentGamma += (targetGamma - currentGamma) * SMOOTH;

            var rx = Math.max(-MAX_TILT, Math.min(MAX_TILT, -currentBeta * 0.35));
            var ry = Math.max(-MAX_TILT, Math.min(MAX_TILT, currentGamma * 0.25));

            for (var i = 0; i < gyroCards.length; i++) {
                var card = gyroCards[i];
                if (card._touching) continue;
                if (card.classList.contains('flipped')) continue;
                card.style.setProperty('--gyro-rx', rx.toFixed(2) + 'deg');
                card.style.setProperty('--gyro-ry', ry.toFixed(2) + 'deg');
            }

            if (enabled) requestAnimationFrame(loop);
            else loopRunning = false;
        }

        function handleOrientation(e) {
            if (e.beta == null || e.gamma == null) return;
            if (!calibrated) {
                baseBeta = e.beta;
                baseGamma = e.gamma;
                calibrated = true;
            }
            targetBeta = Math.max(-25, Math.min(25, e.beta - baseBeta));
            targetGamma = Math.max(-25, Math.min(25, e.gamma - baseGamma));
        }

        function start() {
            if (enabled) return;
            enabled = true;
            document.documentElement.classList.add('gyro-active');
            window.addEventListener('deviceorientation', handleOrientation, true);
            if (!loopRunning) {
                loopRunning = true;
                requestAnimationFrame(loop);
            }
        }

        function attemptStart() {
            if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                DeviceOrientationEvent.requestPermission().then(function(state) {
                    if (state === 'granted') start();
                }).catch(function() {});
            } else {
                start();
            }
        }

        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            var triggered = false;
            function gestureStart() {
                if (triggered) return;
                triggered = true;
                attemptStart();
            }
            document.addEventListener('click', gestureStart, { once: true, capture: true });
            document.addEventListener('touchstart', gestureStart, { once: true, capture: true, passive: true });
        } else {
            start();
        }
    })();

    // ============ CURSOR GLOW ============
    (function initCursorGlow() {
        var isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (isTouchDevice) return;

        var glow = document.getElementById('cursorGlow');
        if (!glow) return;

        glow.style.cssText = 'position:fixed;top:0;left:0;width:300px;height:300px;border-radius:50%;pointer-events:none;z-index:9999;opacity:0;transition:opacity 0.3s;background:radial-gradient(circle,rgba(68,138,255,0.15) 0%,rgba(0,230,118,0.08) 40%,transparent 70%);filter:blur(2px);mix-blend-mode:screen;will-change:transform;';

        var targetX = 0, targetY = 0;
        var currentX = 0, currentY = 0;
        var visible = false;

        document.addEventListener('mousemove', function (e) {
            targetX = e.clientX;
            targetY = e.clientY;
            if (!visible) {
                visible = true;
                glow.style.opacity = '1';
            }
        });

        document.addEventListener('mouseleave', function () {
            visible = false;
            glow.style.opacity = '0';
        });

        function lerpGlow() {
            currentX += (targetX - currentX) * 0.15;
            currentY += (targetY - currentY) * 0.15;
            glow.style.transform = 'translate(' + (currentX - 150) + 'px,' + (currentY - 150) + 'px)';
            requestAnimationFrame(lerpGlow);
        }

        lerpGlow();
    })();

    // ============ INTERACTIVE SKILLS RADAR CHART ============
    (function initRadarChart() {
        var radarCanvas = document.getElementById('radarChart');
        var legendContainer = document.getElementById('radarLegend');
        if (!radarCanvas || !legendContainer) return;

        var rCtx = radarCanvas.getContext('2d');

        var skills = [
            { label: 'Fabrication', shortLabel: 'Fab', value: 92, color: '#448aff' },
            { label: 'Design & CAD', shortLabel: 'Design', value: 85, color: '#00e676' },
            { label: 'Code', shortLabel: 'Code', value: 80, color: '#66aaff' },
            { label: 'Web & Apps', shortLabel: 'Web', value: 78, color: '#33f296' },
            { label: 'Electronics', shortLabel: 'Electro', value: 86, color: '#5599ff' },
            { label: 'Photography', shortLabel: 'Photo', value: 82, color: '#00cc66' },
            { label: 'AI & Automation', shortLabel: 'AI', value: 75, color: '#7bbaff' },
            { label: 'Cross-Platform', shortLabel: 'Platform', value: 90, color: '#66ffaa' }
        ];

        var numSkills = skills.length;
        var angleStep = (Math.PI * 2) / numSkills;
        var animProgress = 0;
        var animating = false;
        var hoveredIndex = -1;
        var hasAnimated = false;

        // Handle high-DPI displays
        function setupCanvas() {
            var wrapper = radarCanvas.parentElement;
            var isMobile = window.innerWidth < 768;
            var displaySize = isMobile ? Math.min(wrapper.offsetWidth * 0.85, 350) : Math.min(wrapper.offsetWidth * 0.55, 500);
            var dpr = window.devicePixelRatio || 1;
            radarCanvas.style.width = displaySize + 'px';
            radarCanvas.style.height = displaySize + 'px';
            radarCanvas.width = displaySize * dpr;
            radarCanvas.height = displaySize * dpr;
            rCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
            return displaySize;
        }

        var displaySize = setupCanvas();

        function getCenterAndRadius() {
            var cSize = parseFloat(radarCanvas.style.width);
            var isMobile = window.innerWidth < 768;
            return { cx: cSize / 2, cy: cSize / 2, maxR: cSize * (isMobile ? 0.24 : 0.28) };
        }

        function drawRadar(progress) {
            var dims = getCenterAndRadius();
            var cx = dims.cx, cy = dims.cy, maxR = dims.maxR;
            var cSize = parseFloat(radarCanvas.style.width);

            rCtx.clearRect(0, 0, cSize, cSize);

            // Draw grid rings (5 levels)
            for (var ring = 1; ring <= 5; ring++) {
                var r = (maxR / 5) * ring;
                rCtx.beginPath();
                for (var i = 0; i <= numSkills; i++) {
                    var angle = (angleStep * i) - Math.PI / 2;
                    var x = cx + r * Math.cos(angle);
                    var y = cy + r * Math.sin(angle);
                    if (i === 0) rCtx.moveTo(x, y);
                    else rCtx.lineTo(x, y);
                }
                rCtx.closePath();
                rCtx.strokeStyle = 'rgba(68, 138, 255, ' + (0.08 + ring * 0.03) + ')';
                rCtx.lineWidth = 1;
                rCtx.stroke();
            }

            // Draw axis lines
            for (var i = 0; i < numSkills; i++) {
                var angle = (angleStep * i) - Math.PI / 2;
                rCtx.beginPath();
                rCtx.moveTo(cx, cy);
                rCtx.lineTo(cx + maxR * Math.cos(angle), cy + maxR * Math.sin(angle));
                rCtx.strokeStyle = 'rgba(68, 138, 255, 0.12)';
                rCtx.lineWidth = 1;
                rCtx.stroke();
            }

            // Draw filled data area with animation
            var currentProgress = Math.min(progress, 1);
            rCtx.beginPath();
            for (var i = 0; i <= numSkills; i++) {
                var idx = i % numSkills;
                var angle = (angleStep * idx) - Math.PI / 2;
                var value = (skills[idx].value / 100) * maxR * currentProgress;
                var x = cx + value * Math.cos(angle);
                var y = cy + value * Math.sin(angle);
                if (i === 0) rCtx.moveTo(x, y);
                else rCtx.lineTo(x, y);
            }
            rCtx.closePath();

            // Gradient fill
            var gradient = rCtx.createLinearGradient(cx - maxR, cy - maxR, cx + maxR, cy + maxR);
            gradient.addColorStop(0, 'rgba(68, 138, 255, 0.25)');
            gradient.addColorStop(0.5, 'rgba(0, 230, 118, 0.18)');
            gradient.addColorStop(1, 'rgba(68, 138, 255, 0.2)');
            rCtx.fillStyle = gradient;
            rCtx.fill();

            // Stroke around data area
            rCtx.strokeStyle = 'rgba(68, 138, 255, 0.7)';
            rCtx.lineWidth = 2;
            rCtx.stroke();

            // Draw vertex dots and labels
            for (var i = 0; i < numSkills; i++) {
                var angle = (angleStep * i) - Math.PI / 2;
                var value = (skills[i].value / 100) * maxR * currentProgress;
                var x = cx + value * Math.cos(angle);
                var y = cy + value * Math.sin(angle);

                // Vertex dot
                var dotSize = (hoveredIndex === i) ? 7 : 4;
                rCtx.beginPath();
                rCtx.arc(x, y, dotSize, 0, Math.PI * 2);
                rCtx.fillStyle = (hoveredIndex === i) ? '#fff' : skills[i].color;
                rCtx.fill();

                if (hoveredIndex === i) {
                    rCtx.beginPath();
                    rCtx.arc(x, y, 12, 0, Math.PI * 2);
                    rCtx.strokeStyle = skills[i].color;
                    rCtx.lineWidth = 2;
                    rCtx.stroke();
                }

                // Labels around the outside
                var labelR = maxR + 24;
                var lx = cx + labelR * Math.cos(angle);
                var ly = cy + labelR * Math.sin(angle);

                rCtx.save();
                rCtx.font = (hoveredIndex === i) ? '600 13px Poppins, sans-serif' : '500 11px Poppins, sans-serif';
                rCtx.fillStyle = (hoveredIndex === i) ? '#fff' : 'rgba(255,255,255,0.65)';
                rCtx.textAlign = 'center';
                rCtx.textBaseline = 'middle';

                // Adjust label position to avoid overlap with chart
                if (Math.abs(angle + Math.PI / 2) < 0.1) {
                    rCtx.textBaseline = 'bottom';
                    ly -= 6;
                } else if (Math.abs(angle - Math.PI / 2) < 0.1) {
                    rCtx.textBaseline = 'top';
                    ly += 6;
                }
                if (Math.cos(angle) > 0.3) rCtx.textAlign = 'left';
                else if (Math.cos(angle) < -0.3) rCtx.textAlign = 'right';

                var displayLabel = (window.innerWidth < 768) ? skills[i].shortLabel : skills[i].label;
                rCtx.fillText(displayLabel, lx, ly);

                // Show value on hover
                if (hoveredIndex === i) {
                    rCtx.font = '700 14px Poppins, sans-serif';
                    rCtx.fillStyle = skills[i].color;
                    rCtx.fillText(skills[i].value + '%', lx, ly + 16);
                }

                rCtx.restore();
            }
        }

        // Build legend
        skills.forEach(function (skill, idx) {
            var item = document.createElement('div');
            item.className = 'radar-legend-item';
            item.innerHTML = '<span class="radar-legend-dot" style="background:' + skill.color + '"></span>' +
                '<span class="radar-legend-name">' + skill.label + '</span>' +
                '<span class="radar-legend-val">' + skill.value + '%</span>';

            item.addEventListener('mouseenter', function () {
                hoveredIndex = idx;
                drawRadar(animProgress);
                item.classList.add('active');
            });
            item.addEventListener('mouseleave', function () {
                hoveredIndex = -1;
                drawRadar(animProgress);
                item.classList.remove('active');
            });

            legendContainer.appendChild(item);
        });

        // Detect hover on canvas vertices
        radarCanvas.addEventListener('mousemove', function (e) {
            var rect = radarCanvas.getBoundingClientRect();
            var scaleX = parseFloat(radarCanvas.style.width) / rect.width;
            var scaleY = parseFloat(radarCanvas.style.height) / rect.height;
            var mx = (e.clientX - rect.left) * scaleX;
            var my = (e.clientY - rect.top) * scaleY;

            var dims = getCenterAndRadius();
            var cx = dims.cx, cy = dims.cy, maxR = dims.maxR;
            var found = -1;

            for (var i = 0; i < numSkills; i++) {
                var angle = (angleStep * i) - Math.PI / 2;
                var value = (skills[i].value / 100) * maxR * animProgress;
                var x = cx + value * Math.cos(angle);
                var y = cy + value * Math.sin(angle);
                var dist = Math.sqrt((mx - x) * (mx - x) + (my - y) * (my - y));
                if (dist < 18) { found = i; break; }
            }

            if (found !== hoveredIndex) {
                hoveredIndex = found;
                drawRadar(animProgress);
                // Sync legend highlight
                var legendItems = legendContainer.querySelectorAll('.radar-legend-item');
                legendItems.forEach(function (li, idx) {
                    li.classList.toggle('active', idx === found);
                });
            }
        });

        radarCanvas.addEventListener('mouseleave', function () {
            hoveredIndex = -1;
            drawRadar(animProgress);
            legendContainer.querySelectorAll('.radar-legend-item').forEach(function (li) {
                li.classList.remove('active');
            });
        });

        // Animate on scroll
        function startAnimation() {
            if (animating || hasAnimated) return;
            animating = true;
            hasAnimated = true;
            var startTime = performance.now();
            var duration = 1200;

            function step(now) {
                var elapsed = now - startTime;
                animProgress = Math.min(elapsed / duration, 1);
                // Ease out cubic
                animProgress = 1 - Math.pow(1 - animProgress, 3);
                drawRadar(animProgress);
                if (elapsed < duration) {
                    requestAnimationFrame(step);
                } else {
                    animProgress = 1;
                    animating = false;
                    drawRadar(1);
                }
            }

            requestAnimationFrame(step);
        }

        // Observe the radar wrapper
        var radarWrapper = radarCanvas.closest('.radar-wrapper');
        if (radarWrapper) {
            var radarObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        startAnimation();
                        radarObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });
            radarObserver.observe(radarWrapper);
        }

        // Initial static draw
        drawRadar(0);

        // Resize handler
        window.addEventListener('resize', function () {
            displaySize = setupCanvas();
            drawRadar(animProgress);
        });
    })();

    // ============ EXPANDABLE JOURNEY STOPS ============
    document.querySelectorAll('.journey-stop[data-expandable]').forEach(function (stop) {
        stop.addEventListener('click', function () {
            var wasExpanded = stop.classList.contains('expanded');
            document.querySelectorAll('.journey-stop.expanded').forEach(function (s) {
                s.classList.remove('expanded');
            });
            if (!wasExpanded) stop.classList.add('expanded');
        });
    });

    // ============ 3D GLOBE ============
    (function initGlobe() {
        var container = document.getElementById('globeContainer');
        if (!container) return;

        var loaded = false;
        function load() {
            if (loaded) return;
            loaded = true;
            var script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
            script.onload = build;
            script.onerror = function() {
                var loading = document.getElementById('globeLoading');
                if (loading) loading.textContent = 'Globe unavailable';
            };
            document.head.appendChild(script);
        }

        // Lazy load when journey section is visible
        var io = new IntersectionObserver(function(entries) {
            entries.forEach(function(e) {
                if (e.isIntersecting) { load(); io.disconnect(); }
            });
        }, { rootMargin: '200px' });
        io.observe(container);

        function build() {
            var canvas = document.getElementById('globeCanvas');
            var loading = document.getElementById('globeLoading');
            if (!canvas || !window.THREE) return;

            var size = container.clientWidth;
            var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.setSize(size, size, false);

            var scene = new THREE.Scene();
            var camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
            camera.position.z = 3;

            // Real Earth textures (NASA / Three.js examples — public domain)
            var textureLoader = new THREE.TextureLoader();
            textureLoader.crossOrigin = 'anonymous';

            var maxAniso = renderer.capabilities.getMaxAnisotropy();
            function loadTex(url) {
                var t = textureLoader.load(url);
                t.anisotropy = maxAniso;
                t.minFilter = THREE.LinearMipmapLinearFilter;
                return t;
            }

            var earthMap = loadTex('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg');
            var earthBump = loadTex('https://threejs.org/examples/textures/planets/earth_normal_2048.jpg');
            var earthSpec = loadTex('https://threejs.org/examples/textures/planets/earth_specular_2048.jpg');

            var globe = new THREE.Mesh(
                new THREE.SphereGeometry(1, 128, 128),
                new THREE.MeshPhongMaterial({
                    map: earthMap,
                    bumpMap: earthBump,
                    bumpScale: 0.05,
                    specularMap: earthSpec,
                    specular: new THREE.Color(0x444466),
                    shininess: 32
                })
            );
            scene.add(globe);

            // Cloud layer (higher res + double-rotated for parallax)
            var cloudsTexture = loadTex('https://threejs.org/examples/textures/planets/earth_clouds_2048.png');
            var clouds = new THREE.Mesh(
                new THREE.SphereGeometry(1.018, 128, 128),
                new THREE.MeshPhongMaterial({
                    map: cloudsTexture,
                    transparent: true,
                    opacity: 0.4,
                    depthWrite: false
                })
            );
            scene.add(clouds);

            // Subtle wireframe overlay for tech aesthetic
            var wire = new THREE.Mesh(
                new THREE.SphereGeometry(1.025, 24, 18),
                new THREE.MeshBasicMaterial({ color: 0x448aff, wireframe: true, transparent: true, opacity: 0.08 })
            );
            scene.add(wire);

            // Outer atmospheric glow
            var atmosphere = new THREE.Mesh(
                new THREE.SphereGeometry(1.08, 32, 32),
                new THREE.ShaderMaterial({
                    vertexShader: 'varying vec3 vN; void main(){ vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
                    fragmentShader: 'varying vec3 vN; void main(){ float i = pow(0.6 - dot(vN, vec3(0,0,1.0)), 2.0); gl_FragColor = vec4(0.27,0.54,1.0,1.0) * i; }',
                    blending: THREE.AdditiveBlending,
                    side: THREE.BackSide,
                    transparent: true
                })
            );
            scene.add(atmosphere);

            // Lights — soft ambient + sun
            scene.add(new THREE.AmbientLight(0x4466aa, 0.35));
            var sun = new THREE.DirectionalLight(0xffffff, 1.6);
            sun.position.set(5, 2, 4);
            scene.add(sun);

            function latLonToVec3(lat, lon, radius) {
                var phi = (90 - lat) * Math.PI / 180;
                var theta = (lon + 180) * Math.PI / 180;
                return new THREE.Vector3(
                    -radius * Math.sin(phi) * Math.cos(theta),
                    radius * Math.cos(phi),
                    radius * Math.sin(phi) * Math.sin(theta)
                );
            }

            var cities = [
                { name: 'Romania', lat: 44.4, lon: 26.1, color: 0x448aff, size: 0.022 },
                { name: 'Italy', lat: 41.9, lon: 12.5, color: 0x448aff, size: 0.022 },
                { name: 'Austria', lat: 48.2, lon: 16.4, color: 0x448aff, size: 0.022 },
                { name: 'France', lat: 48.85, lon: 2.35, color: 0x00e676, size: 0.03 }
            ];

            var cityMeshes = [];
            cities.forEach(function(c) {
                var pos = latLonToVec3(c.lat, c.lon, 1.005);
                var pin = new THREE.Mesh(
                    new THREE.SphereGeometry(c.size * 1.5, 16, 16),
                    new THREE.MeshBasicMaterial({ color: c.color })
                );
                pin.position.copy(pos);
                pin.userData.cityIndex = cityMeshes.length;
                globe.add(pin);

                var glow = new THREE.Mesh(
                    new THREE.SphereGeometry(c.size * 2.5, 16, 16),
                    new THREE.MeshBasicMaterial({ color: c.color, transparent: true, opacity: 0.3 })
                );
                glow.position.copy(pos);
                globe.add(glow);
                cityMeshes.push({ pin: pin, glow: glow, base: c.size * 2.5, isFrance: c.name === 'France' });
            });

            // Travel arcs in order
            function createArc(a, b, color, lift) {
                var start = latLonToVec3(a.lat, a.lon, 1.01);
                var end = latLonToVec3(b.lat, b.lon, 1.01);
                var mid = start.clone().add(end).multiplyScalar(0.5);
                mid.normalize().multiplyScalar(1 + (lift || 0.25));
                var curve = new THREE.QuadraticBezierCurve3(start, mid, end);
                var points = curve.getPoints(60);
                var geo = new THREE.BufferGeometry().setFromPoints(points);
                var mat = new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: 0.85 });
                return new THREE.Line(geo, mat);
            }

            globe.add(createArc(cities[0], cities[1], 0x448aff, 0.2));
            globe.add(createArc(cities[1], cities[2], 0x448aff, 0.2));
            globe.add(createArc(cities[2], cities[3], 0x00e676, 0.3));

            // ----- Equator + Prime Meridian rings -----
            function ringGeometry(rotationX, rotationY) {
                var geo = new THREE.BufferGeometry();
                var pts = [];
                for (var i = 0; i <= 128; i++) {
                    var a = (i / 128) * Math.PI * 2;
                    pts.push(new THREE.Vector3(Math.cos(a) * 1.015, 0, Math.sin(a) * 1.015));
                }
                geo.setFromPoints(pts);
                return geo;
            }
            var equator = new THREE.LineLoop(ringGeometry(), new THREE.LineBasicMaterial({ color: 0x00e676, transparent: true, opacity: 0.25 }));
            globe.add(equator);
            var meridian = new THREE.LineLoop(ringGeometry(), new THREE.LineBasicMaterial({ color: 0x448aff, transparent: true, opacity: 0.25 }));
            meridian.rotation.x = Math.PI / 2;
            globe.add(meridian);

            // ----- Star field -----
            var starGeo = new THREE.BufferGeometry();
            var starCount = 600;
            var starPos = new Float32Array(starCount * 3);
            for (var s = 0; s < starCount; s++) {
                var theta = Math.random() * Math.PI * 2;
                var phi = Math.acos(2 * Math.random() - 1);
                var r = 12 + Math.random() * 8;
                starPos[s*3] = r * Math.sin(phi) * Math.cos(theta);
                starPos[s*3+1] = r * Math.cos(phi);
                starPos[s*3+2] = r * Math.sin(phi) * Math.sin(theta);
            }
            starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
            var stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.06, transparent: true, opacity: 0.7, sizeAttenuation: true }));
            scene.add(stars);

            // Initial rotation to show Europe
            globe.rotation.y = -0.3;
            globe.rotation.x = -0.45;
            wire.rotation.copy(globe.rotation);

            // Drag, zoom, click controls
            var isDragging = false;
            var dragDistance = 0;
            var lastX = 0, lastY = 0;
            var autoRotate = true;
            var lastInteraction = Date.now();
            var pinchDist = 0;

            function onStart(x, y) {
                isDragging = true;
                dragDistance = 0;
                lastX = x; lastY = y;
                autoRotate = false;
                lastInteraction = Date.now();
            }
            function onMove(x, y) {
                if (!isDragging) return;
                var dx = x - lastX;
                var dy = y - lastY;
                dragDistance += Math.abs(dx) + Math.abs(dy);
                globe.rotation.y += dx * 0.005;
                globe.rotation.x += dy * 0.005;
                wire.rotation.copy(globe.rotation);
                lastX = x; lastY = y;
                lastInteraction = Date.now();
            }
            function onEnd() { isDragging = false; }

            function zoom(delta) {
                camera.position.z = Math.max(1.4, Math.min(8, camera.position.z + delta));
                lastInteraction = Date.now();
            }

            // Raycaster for tapping city pins
            var raycaster = new THREE.Raycaster();
            var mouseVec = new THREE.Vector2();
            var pinMeshes = cityMeshes.map(function(cm) { return cm.pin; });

            function handleTap(clientX, clientY) {
                if (dragDistance > 8) return; // it was a drag, not a tap
                var rect = canvas.getBoundingClientRect();
                mouseVec.x = ((clientX - rect.left) / rect.width) * 2 - 1;
                mouseVec.y = -((clientY - rect.top) / rect.height) * 2 + 1;
                raycaster.setFromCamera(mouseVec, camera);
                var hits = raycaster.intersectObjects(pinMeshes, false);
                if (hits.length === 0) return;
                var idx = hits[0].object.userData.cityIndex;
                var stops = document.querySelectorAll('.journey-stop[data-expandable]');
                var stop = stops[idx];
                if (!stop) return;
                document.querySelectorAll('.journey-stop.expanded').forEach(function(s) { s.classList.remove('expanded'); });
                stop.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(function() { stop.classList.add('expanded'); }, 500);
            }

            canvas.addEventListener('mousedown', function(e) { onStart(e.clientX, e.clientY); });
            window.addEventListener('mousemove', function(e) { onMove(e.clientX, e.clientY); });
            window.addEventListener('mouseup', function(e) {
                if (isDragging) handleTap(e.clientX, e.clientY);
                onEnd();
            });

            canvas.addEventListener('touchstart', function(e) {
                e.preventDefault();
                if (e.touches.length === 2) {
                    var t1 = e.touches[0], t2 = e.touches[1];
                    pinchDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
                    isDragging = false;
                } else {
                    var t = e.touches[0];
                    onStart(t.clientX, t.clientY);
                }
            }, { passive: false });

            canvas.addEventListener('touchmove', function(e) {
                e.preventDefault();
                if (e.touches.length === 2) {
                    var t1 = e.touches[0], t2 = e.touches[1];
                    var d = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
                    if (pinchDist > 0) zoom((pinchDist - d) * 0.01);
                    pinchDist = d;
                } else {
                    var t = e.touches[0];
                    onMove(t.clientX, t.clientY);
                }
            }, { passive: false });

            canvas.addEventListener('touchend', function(e) {
                if (e.changedTouches.length && e.touches.length === 0 && isDragging) {
                    var t = e.changedTouches[0];
                    handleTap(t.clientX, t.clientY);
                }
                pinchDist = 0;
                onEnd();
            });

            canvas.addEventListener('wheel', function(e) {
                e.preventDefault();
                zoom(e.deltaY * 0.002);
            }, { passive: false });

            // Animation loop
            function animate(t) {
                requestAnimationFrame(animate);
                if (autoRotate || Date.now() - lastInteraction > 3000) {
                    autoRotate = true;
                    globe.rotation.y += 0.002;
                    wire.rotation.copy(globe.rotation);
                }
                // Clouds drift slightly faster than globe
                clouds.rotation.copy(globe.rotation);
                clouds.rotation.y += t * 0.000005;
                // Pulse the city glows
                var pulse = 1 + Math.sin(t * 0.003) * 0.15;
                cityMeshes.forEach(function(cm) {
                    var scale = cm.isFrance ? pulse * 1.3 : pulse;
                    cm.glow.scale.set(scale, scale, scale);
                });
                renderer.render(scene, camera);
            }
            requestAnimationFrame(animate);

            // Hide loader
            if (loading) loading.classList.add('hidden');

            // Resize handling
            window.addEventListener('resize', function() {
                var s = container.clientWidth;
                renderer.setSize(s, s, false);
            });
        }
    })();

    // ============ FLIP CARDS ============
    (function initFlipCards() {
        document.querySelectorAll('.skill-card, .project-card').forEach(function(card) {
            // Create structure
            var inner = document.createElement('div');
            inner.className = 'flip-card-inner';

            var front = document.createElement('div');
            front.className = 'flip-card-front';

            // Move all existing children to front
            while (card.firstChild) {
                front.appendChild(card.firstChild);
            }

            var back = document.createElement('div');
            back.className = 'flip-card-back';
            // Add a subtle hint on the back
            back.innerHTML = '<div class="flip-back-content"><span class="flip-back-hint">Coming soon</span></div>';

            inner.appendChild(front);
            inner.appendChild(back);
            card.appendChild(inner);

            // Toggle flip on click/tap
            card.addEventListener('click', function(e) {
                // Don't flip if clicking a link
                if (e.target.tagName === 'A') return;
                card.classList.toggle('flipped');
            });
        });
    })();

    // ============ SKILL ICON GLOW ON FIRST APPEARANCE ============
    var glowObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var icons = entry.target.querySelectorAll('.skill-icon-wrap');
                icons.forEach(function (icon, i) {
                    setTimeout(function () {
                        icon.classList.add('glow-entrance');
                    }, i * 150);
                });
                glowObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    var skillsGrid = document.querySelector('.skills-grid');
    if (skillsGrid) glowObserver.observe(skillsGrid);

    // ============ ACHIEVEMENT SYSTEM ============
    (function initAchievements() {
        var BADGES = [
            { id: 'welcome', icon: '👋', name: 'Welcome' },
            { id: 'explorer', icon: '🗺️', name: 'Explorer' },
            { id: 'polyglot', icon: '🌍', name: 'Polyglot' },
            { id: 'curious', icon: '🔍', name: 'Curious Mind' },
            { id: 'flipper', icon: '🃏', name: 'Card Flipper' },
            { id: 'connector', icon: '🤝', name: 'Connector' },
            { id: 'hidden-gem', icon: '💎', name: 'Hidden Gem' }
        ];

        var unlocked = {};
        try { unlocked = JSON.parse(localStorage.getItem('dm_badges') || '{}'); } catch(e) {}

        var listEl = document.getElementById('badgeList');
        var countEl = document.getElementById('badgeCount');
        var toggleEl = document.getElementById('achievementsToggle');
        var panelEl = document.getElementById('achievementsPanel');

        function render() {
            if (!listEl) return;
            listEl.innerHTML = '';
            var count = 0;
            BADGES.forEach(function(b) {
                var isUnlocked = !!unlocked[b.id];
                if (isUnlocked) count++;
                var div = document.createElement('div');
                div.className = 'badge-item' + (isUnlocked ? ' unlocked' : '');
                div.innerHTML = '<span class="badge-icon">' + (isUnlocked ? b.icon : '🔒') + '</span><span class="badge-name">' + b.name + '</span>';
                listEl.appendChild(div);
            });
            if (countEl) countEl.textContent = count;
        }

        function showToast(badge) {
            var toast = document.createElement('div');
            toast.className = 'badge-toast';
            toast.innerHTML = '<span class="badge-toast-icon">' + badge.icon + '</span><div class="badge-toast-text"><strong>Achievement Unlocked</strong>' + badge.name + '</div>';
            document.body.appendChild(toast);
            setTimeout(function() { toast.classList.add('visible'); }, 50);
            setTimeout(function() {
                toast.classList.remove('visible');
                setTimeout(function() { toast.remove(); }, 500);
            }, 3000);
        }

        function unlock(id) {
            if (unlocked[id]) return;
            unlocked[id] = Date.now();
            try { localStorage.setItem('dm_badges', JSON.stringify(unlocked)); } catch(e) {}
            var badge = BADGES.filter(function(b) { return b.id === id; })[0];
            if (badge) showToast(badge);
            render();
        }

        window.__unlockBadge = unlock;
        render();

        if (toggleEl && panelEl) {
            toggleEl.addEventListener('click', function() {
                panelEl.classList.toggle('open');
            });
            document.addEventListener('click', function(e) {
                if (!toggleEl.contains(e.target) && !panelEl.contains(e.target)) {
                    panelEl.classList.remove('open');
                }
            });
        }

        // Welcome on load
        setTimeout(function() { unlock('welcome'); }, 1500);

        // Explorer: visited all sections
        var visited = {};
        var sections = ['hero', 'about', 'skills', 'experience', 'projects', 'languages', 'contact'];
        sections.forEach(function(id) {
            var el = document.getElementById(id);
            if (!el) return;
            var obs = new IntersectionObserver(function(entries) {
                entries.forEach(function(e) {
                    if (e.isIntersecting) {
                        visited[id] = true;
                        if (Object.keys(visited).length >= sections.length) {
                            unlock('explorer');
                        }
                        obs.unobserve(el);
                    }
                });
            }, { threshold: 0.3 });
            obs.observe(el);
        });

        // Polyglot: clicked 3+ language switcher buttons
        var langs = {};
        document.querySelectorAll('.lang-switcher-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                langs[btn.dataset.lang] = true;
                if (Object.keys(langs).length >= 3) unlock('polyglot');
            });
        });

        // Curious: expanded a journey card
        document.querySelectorAll('.journey-stop[data-expandable]').forEach(function(stop) {
            stop.addEventListener('click', function() {
                if (stop.classList.contains('expanded')) unlock('curious');
            });
        });

        // Flipper: flipped any card
        document.addEventListener('click', function(e) {
            var card = e.target.closest('.skill-card, .project-card');
            if (card && card.classList.contains('flipped')) unlock('flipper');
        });

        // Connector: clicked a contact link
        document.querySelectorAll('.contact-card').forEach(function(card) {
            card.addEventListener('click', function() { unlock('connector'); });
        });

        // Hidden Gem: handled by DM logo triple-tap (we'll add a hook there)
        // Done via window.__unlockBadge in the secret facts code
    })();

    // ============ VCARD DOWNLOAD ============
    (function initVCard() {
        var btn = document.getElementById('saveContact');
        if (!btn) return;
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            var vcard = [
                'BEGIN:VCARD',
                'VERSION:3.0',
                'FN:Daniel Madac',
                'N:Madac;Daniel;;;',
                'TITLE:FabLab Coordinator | Maker | Developer | Photographer',
                'ORG:Institut Optique Graduate School',
                'TEL;TYPE=CELL:+33652146317',
                'EMAIL:danielgheorghemadac@icloud.com',
                'URL:https://danielgheorghemadac.github.io/danielmadac',
                'URL;TYPE=LinkedIn:https://linkedin.com/in/daniel-madac-3694091bb',
                'NOTE:Met at VivaTech 2026. Looking for deeptech, optics, and FabLab opportunities.',
                'END:VCARD'
            ].join('\r\n');
            var blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = 'Daniel_Madac.vcf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(function() { URL.revokeObjectURL(url); }, 100);
            if (window.__unlockBadge) window.__unlockBadge('connector');
        });
    })();

    // ============ SHARE MODAL ============
    (function initShare() {
        var fab = document.getElementById('shareFab');
        var modal = document.getElementById('shareModal');
        var close = document.getElementById('shareClose');
        var back = document.getElementById('shareBack');
        var copy = document.getElementById('shareCopy');
        var native = document.getElementById('shareNative');
        var qrWrap = document.querySelector('.share-qr-wrap');
        if (!fab || !modal) return;

        var shareUrl = 'https://danielgheorghemadac.github.io/danielmadac';
        var qrZoomTimer = null;

        function closeModal() {
            modal.classList.remove('open');
            document.body.style.overflow = '';
            if (qrWrap) qrWrap.classList.remove('zoomed');
            if (qrZoomTimer) clearTimeout(qrZoomTimer);
        }

        fab.addEventListener('click', function() {
            modal.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
        close.addEventListener('click', closeModal);
        if (back) back.addEventListener('click', closeModal);
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeModal();
        });

        if (qrWrap) {
            qrWrap.addEventListener('click', function(e) {
                e.stopPropagation();
                qrWrap.classList.add('zoomed');
                if (qrZoomTimer) clearTimeout(qrZoomTimer);
                qrZoomTimer = setTimeout(function() {
                    qrWrap.classList.remove('zoomed');
                }, 10000);
            });
        }

        if (copy) {
            copy.addEventListener('click', function() {
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(shareUrl).then(function() {
                        copy.textContent = 'Copied!';
                        copy.classList.add('copied');
                        setTimeout(function() {
                            copy.textContent = 'Copy Link';
                            copy.classList.remove('copied');
                        }, 2000);
                    });
                }
            });
        }

        if (native) {
            if (navigator.share) {
                native.addEventListener('click', function() {
                    navigator.share({
                        title: 'Daniel Madac - Portfolio',
                        text: 'Check out my portfolio',
                        url: shareUrl
                    }).catch(function() {});
                });
            } else {
                native.style.display = 'none';
            }
        }
    })();

})();
