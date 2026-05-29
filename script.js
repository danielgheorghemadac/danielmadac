(function () {
    'use strict';

    // ============ PARTICLE SYSTEM ============
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };
    let animId;

    function resizeCanvas() {
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = canvas.offsetWidth * dpr;
        canvas.height = canvas.offsetHeight * dpr;
        // setTransform resets any previous scale to avoid compounding on resize
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
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
        var isMobile = window.innerWidth < 768;
        var density = isMobile ? 16000 : 8000;
        var cap = isMobile ? 50 : 120;
        const count = Math.min(Math.floor((canvas.offsetWidth * canvas.offsetHeight) / density), cap);
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

    var particleResizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(particleResizeTimer);
        particleResizeTimer = setTimeout(function () {
            resizeCanvas();
            initParticles();
        }, 150);
    }, { passive: true });

    canvas.addEventListener('mousemove', e => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    }, { passive: true });

    canvas.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; }, { passive: true });

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
            // Bust the cache by appending a unique query param so HTML + assets reload fresh
            function bustReload() {
                var base = window.location.pathname;
                window.location.replace(base + '?t=' + Date.now() + window.location.hash);
            }
            if ('caches' in window) {
                caches.keys().then(function (names) {
                    return Promise.all(names.map(function (name) { return caches.delete(name); }));
                }).then(bustReload).catch(bustReload);
            } else {
                bustReload();
            }
        });
    }

    // ============ PARALLAX SUBTLE EFFECT ON HERO ============
    const heroContent = document.querySelector('.hero-content');
    var heroParallaxQueued = false;
    var heroParallaxLastApplied = -1;
    window.addEventListener('scroll', () => {
        if (heroParallaxQueued) return;
        heroParallaxQueued = true;
        requestAnimationFrame(function () {
            heroParallaxQueued = false;
            const scrolled = window.scrollY;
            const vh = window.innerHeight;
            if (scrolled < vh) {
                heroContent.style.transform = `translate3d(0, ${(scrolled * 0.25).toFixed(1)}px, 0)`;
                heroContent.style.opacity = 1 - scrolled / (vh * 0.8);
                heroParallaxLastApplied = scrolled;
            } else if (heroParallaxLastApplied !== -2) {
                // Reset once we're past the hero so we don't keep recalculating
                heroContent.style.opacity = '';
                heroParallaxLastApplied = -2;
            }
        });
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
            }, { passive: true });
            card.addEventListener('mouseleave', function () {
                resetTilt(card);
            }, { passive: true });

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
        }, { passive: true });

        document.addEventListener('mouseleave', function () {
            visible = false;
            glow.style.opacity = '0';
        }, { passive: true });

        function lerpGlow() {
            currentX += (targetX - currentX) * 0.15;
            currentY += (targetY - currentY) * 0.15;
            glow.style.transform = 'translate(' + (currentX - 150) + 'px,' + (currentY - 150) + 'px)';
            requestAnimationFrame(lerpGlow);
        }

        lerpGlow();
    })();

    // ============ 3D SKILLS NEURAL NETWORK ============
    (function initSkillsNetwork() {
        var canvas = document.getElementById('radarChart');
        var legendContainer = document.getElementById('radarLegend');
        if (!canvas || !legendContainer) return;

        var ctx = canvas.getContext('2d');

        var skills = [
            { label: 'Code', shortLabel: 'Code', value: 50, color: '#66aaff' },
            { label: 'Vibe Coding', shortLabel: 'Vibe', value: 89, color: '#33f296' },
            { label: '3D Printers', shortLabel: '3D Print', value: 90, color: '#448aff' },
            { label: 'Wood & Alu', shortLabel: 'Wood/Alu', value: 75, color: '#00cc66' },
            { label: 'CNC Planet', shortLabel: 'CNC', value: 85, color: '#5599ff' },
            { label: 'Electronics', shortLabel: 'Electro', value: 65, color: '#66ffaa' },
            { label: 'Design & CAD', shortLabel: 'Design', value: 70, color: '#7bbaff' },
            { label: 'Web & Apps', shortLabel: 'Web', value: 77, color: '#00e676' },
            { label: 'Photography', shortLabel: 'Photo', value: 85, color: '#88ccff' },
            { label: 'Videography', shortLabel: 'Video', value: 77, color: '#33f296' },
            { label: 'Cross-Platform', shortLabel: 'Platform', value: 95, color: '#5599ff' },
            { label: 'Prototyping', shortLabel: 'Proto', value: 80, color: '#88ffcc' },
            { label: 'Wood Crafting', shortLabel: 'Craft', value: 78, color: '#7bbaff' },
            { label: 'AI & Automation', shortLabel: 'AI', value: 91, color: '#00e676' }
        ];

        var n = skills.length;
        var hoveredIndex = -1;
        var rotation = 0;
        var manualRotX = 0.3, manualRotY = 0;
        var lastX = 0, lastY = 0;
        var isDragging = false;
        var lastInteraction = 0;
        var packets = [];

        // High-DPI canvas
        function setupCanvas() {
            var wrapper = canvas.parentElement;
            var isMobile = window.innerWidth < 768;
            var displaySize = isMobile ? Math.min(wrapper.offsetWidth * 0.92, 380) : Math.min(wrapper.offsetWidth * 0.55, 480);
            var dpr = window.devicePixelRatio || 1;
            canvas.style.width = displaySize + 'px';
            canvas.style.height = displaySize + 'px';
            canvas.width = displaySize * dpr;
            canvas.height = displaySize * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            return displaySize;
        }
        var size = setupCanvas();

        // Build 3D positions of nodes around a sphere (latitudes for variety)
        var nodes = skills.map(function(s, i) {
            var phi = (i / n) * Math.PI * 2;
            // Alternate latitudes for a 3D feel (not all on equator)
            var lat = ((i % 2) ? 0.3 : -0.3);
            return {
                phi: phi,
                lat: lat,
                value: s.value,
                color: s.color,
                label: s.label,
                shortLabel: s.shortLabel,
                pulse: Math.random() * Math.PI * 2,
                index: i
            };
        });

        // Spawn data packets traveling along edges
        function spawnPacket() {
            var idx = Math.floor(Math.random() * n);
            packets.push({
                target: idx,
                t: 0,
                dir: Math.random() < 0.5 ? 1 : -1,
                speed: 0.012 + Math.random() * 0.012
            });
            if (packets.length > 20) packets.shift();
        }

        function project(x, y, z) {
            // Apply rotation
            var cosY = Math.cos(rotation + manualRotY);
            var sinY = Math.sin(rotation + manualRotY);
            var cosX = Math.cos(manualRotX);
            var sinX = Math.sin(manualRotX);
            var x1 = x * cosY - z * sinY;
            var z1 = x * sinY + z * cosY;
            var y1 = y * cosX - z1 * sinX;
            var z2 = y * sinX + z1 * cosX;
            // Perspective
            var scale = 1.6 / (1.6 - z2);
            return { x: x1 * scale, y: y1 * scale, z: z2, scale: scale };
        }

        function draw(t) {
            // Use the cached display size to avoid reading style every frame
            var w = size;
            var h = size;
            var cx = w / 2, cy = h / 2;
            var R = Math.min(w, h) * 0.32;

            ctx.clearRect(0, 0, w, h);

            // Compute 3D positions
            var positions = nodes.map(function(node) {
                var r = (node.value / 100) * 1.0;
                var x = Math.cos(node.phi) * Math.cos(node.lat) * r;
                var y = Math.sin(node.lat) * r;
                var z = Math.sin(node.phi) * Math.cos(node.lat) * r;
                var p = project(x, y, z);
                return {
                    sx: cx + p.x * R,
                    sy: cy + p.y * R,
                    z: p.z,
                    scale: p.scale,
                    node: node
                };
            });

            // Sort by depth (back to front)
            var sorted = positions.slice().sort(function(a, b) { return a.z - b.z; });

            // Draw edges from hub to each node (background)
            sorted.forEach(function(p) {
                var alpha = Math.max(0.05, 0.15 + p.z * 0.15);
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(p.sx, p.sy);
                ctx.strokeStyle = 'rgba(68,138,255,' + alpha + ')';
                ctx.lineWidth = 1;
                ctx.stroke();
            });

            // DNA-style sub-branches between related skills
            // 0=Code 1=Vibe 2=3DPrint 3=Wood/Alu 4=CNC 5=Electro 6=Design 7=Web
            // 8=Photo 9=Video 10=Platform 11=Proto 12=Craft 13=AI
            var subBranches = [
                [0,1],[0,7],[0,10],[0,13],
                [1,13],[1,7],[1,10],
                [2,11],[2,4],[2,6],[2,3],[2,5],
                [3,4],[3,12],[3,11],
                [4,6],
                [6,7],
                [8,9],[8,6],[9,6],
                [10,7],[10,13],
                [11,12],
                [13,7]
            ];
            subBranches.forEach(function(pair) {
                var a = positions[pair[0]];
                var b = positions[pair[1]];
                if (!a || !b) return;
                var depth = (a.z + b.z) / 2;
                var alpha = 0.05 + Math.max(0, (depth + 1)) * 0.04;

                var mx = (a.sx + b.sx) / 2;
                var my = (a.sy + b.sy) / 2;
                var dx = b.sx - a.sx;
                var dy = b.sy - a.sy;
                var len = Math.hypot(dx, dy) || 1;
                var bend = 18 * Math.sin(t * 0.0008 + pair[0] + pair[1]);
                var nx = -dy / len * bend;
                var ny = dx / len * bend;
                var ctrlX = mx + nx;
                var ctrlY = my + ny;

                ctx.beginPath();
                ctx.moveTo(a.sx, a.sy);
                ctx.quadraticCurveTo(ctrlX, ctrlY, b.sx, b.sy);
                ctx.strokeStyle = 'rgba(0,230,118,' + alpha + ')';
                ctx.lineWidth = 0.7;
                ctx.stroke();

                // Base-pair dots along the curve (DNA bases)
                for (var d = 0.18; d < 0.86; d += 0.18) {
                    var u = d;
                    var bx = (1 - u) * (1 - u) * a.sx + 2 * (1 - u) * u * ctrlX + u * u * b.sx;
                    var by = (1 - u) * (1 - u) * a.sy + 2 * (1 - u) * u * ctrlY + u * u * b.sy;
                    ctx.beginPath();
                    ctx.arc(bx, by, 0.9, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(255,255,255,' + (alpha * 4) + ')';
                    ctx.fill();
                }
            });

            // Adjacent web ring (kept subtle)
            for (var i = 0; i < positions.length; i++) {
                var a = positions[i];
                var b = positions[(i + 1) % positions.length];
                var alpha = Math.max(0.02, 0.06 + Math.min(a.z, b.z) * 0.06);
                ctx.beginPath();
                ctx.moveTo(a.sx, a.sy);
                ctx.lineTo(b.sx, b.sy);
                ctx.strokeStyle = 'rgba(0,230,118,' + alpha + ')';
                ctx.lineWidth = 0.6;
                ctx.stroke();
            }

            // Central hub (Daniel)
            var hubR = 14 + Math.sin(t * 0.003) * 2;
            var grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, hubR * 2.5);
            grad.addColorStop(0, '#ffffff');
            grad.addColorStop(0.3, '#00e676');
            grad.addColorStop(1, 'rgba(0,230,118,0)');
            ctx.beginPath();
            ctx.arc(cx, cy, hubR * 2.5, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();
            ctx.beginPath();
            ctx.arc(cx, cy, hubR * 0.45, 0, Math.PI * 2);
            ctx.fillStyle = '#fff';
            ctx.fill();
            ctx.font = '700 9px Poppins, sans-serif';
            ctx.fillStyle = '#07070d';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('DM', cx, cy);

            // Data packets flying along the edges
            ctx.save();
            packets.forEach(function(pkt) {
                pkt.t += pkt.speed;
                if (pkt.t >= 1) { pkt.t = 0; pkt.target = Math.floor(Math.random() * n); pkt.dir = Math.random() < 0.5 ? 1 : -1; }
                var pos = positions[pkt.target];
                var t01 = pkt.dir > 0 ? pkt.t : (1 - pkt.t);
                var px = cx + (pos.sx - cx) * t01;
                var py = cy + (pos.sy - cy) * t01;
                ctx.beginPath();
                ctx.arc(px, py, 2.2, 0, Math.PI * 2);
                ctx.fillStyle = pos.node.color;
                ctx.shadowBlur = 8;
                ctx.shadowColor = pos.node.color;
                ctx.fill();
            });
            ctx.shadowBlur = 0;
            ctx.restore();

            // Draw DNA-style cells (front to back order matters for occlusion)
            sorted.forEach(function(p) {
                var baseSize = (8 + (p.node.value / 100) * 14) * p.scale;
                var isHover = hoveredIndex === p.node.index;
                if (isHover) baseSize *= 1.25;
                // Subtle organic wobble
                var wobble = 1 + Math.sin(t * 0.002 + p.node.pulse) * 0.05;
                var size = baseSize * wobble;

                // Outer membrane glow halo
                var halo = ctx.createRadialGradient(p.sx, p.sy, size * 0.5, p.sx, p.sy, size * 2.4);
                halo.addColorStop(0, p.node.color + 'aa');
                halo.addColorStop(0.4, p.node.color + '33');
                halo.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.beginPath();
                ctx.arc(p.sx, p.sy, size * 2.4, 0, Math.PI * 2);
                ctx.fillStyle = halo;
                ctx.fill();

                // Cell membrane (outer ring)
                ctx.beginPath();
                ctx.arc(p.sx, p.sy, size * 1.55, 0, Math.PI * 2);
                ctx.strokeStyle = p.node.color + (isHover ? 'cc' : '88');
                ctx.lineWidth = 1.3;
                ctx.stroke();

                // Cytoplasm (mid-tone fill)
                var cyto = ctx.createRadialGradient(p.sx - size * 0.3, p.sy - size * 0.3, 0, p.sx, p.sy, size * 1.5);
                cyto.addColorStop(0, p.node.color + '66');
                cyto.addColorStop(0.7, p.node.color + '22');
                cyto.addColorStop(1, p.node.color + '11');
                ctx.beginPath();
                ctx.arc(p.sx, p.sy, size * 1.5, 0, Math.PI * 2);
                ctx.fillStyle = cyto;
                ctx.fill();

                // Nucleus (bright core)
                var nuc = ctx.createRadialGradient(p.sx - size * 0.2, p.sy - size * 0.2, 0, p.sx, p.sy, size * 0.7);
                nuc.addColorStop(0, '#ffffff');
                nuc.addColorStop(0.5, p.node.color);
                nuc.addColorStop(1, p.node.color);
                ctx.beginPath();
                ctx.arc(p.sx, p.sy, size * 0.7, 0, Math.PI * 2);
                ctx.fillStyle = nuc;
                ctx.fill();

                // Organelles — small algorithm dots orbiting inside the cell
                var orgCount = 3;
                for (var o = 0; o < orgCount; o++) {
                    var oAngle = t * 0.001 + p.node.pulse + (o / orgCount) * Math.PI * 2;
                    var oR = size * 1.1;
                    var ox = p.sx + Math.cos(oAngle) * oR;
                    var oy = p.sy + Math.sin(oAngle) * oR;
                    ctx.beginPath();
                    ctx.arc(ox, oy, 1.8, 0, Math.PI * 2);
                    ctx.fillStyle = '#ffffff';
                    ctx.globalAlpha = 0.85;
                    ctx.fill();
                    ctx.globalAlpha = 1;
                }

                // Hover ring
                if (isHover) {
                    ctx.beginPath();
                    ctx.arc(p.sx, p.sy, size * 1.85, 0, Math.PI * 2);
                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }

                // Label — always show name + percentage for clarity
                var labelDist = size * 1.7 + 10;
                var labelOffsetX = 0, labelOffsetY = 0;
                if (Math.abs(p.sx - cx) > Math.abs(p.sy - cy)) {
                    labelOffsetX = (p.sx > cx) ? labelDist : -labelDist;
                    ctx.textAlign = p.sx > cx ? 'left' : 'right';
                    ctx.textBaseline = 'middle';
                } else {
                    labelOffsetY = (p.sy > cy) ? labelDist : -labelDist;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = p.sy > cy ? 'top' : 'bottom';
                }
                ctx.font = '600 ' + (window.innerWidth < 768 ? '10' : '11') + 'px Poppins, sans-serif';
                ctx.fillStyle = isHover ? '#ffffff' : 'rgba(255,255,255,' + (0.55 + p.z * 0.35) + ')';
                var lbl = (window.innerWidth < 768) ? p.node.shortLabel : p.node.label;
                ctx.fillText(lbl, p.sx + labelOffsetX, p.sy + labelOffsetY);
                ctx.font = '700 ' + (window.innerWidth < 768 ? '9' : '10') + 'px Poppins, sans-serif';
                ctx.fillStyle = p.node.color;
                var pctY = labelOffsetY + (labelOffsetY !== 0 ? (labelOffsetY > 0 ? 12 : -12) : 12);
                ctx.fillText(p.node.value + '%', p.sx + labelOffsetX, p.sy + pctY);
            });
        }

        function loop(t) {
            // Auto-rotate when no manual interaction recently
            if (!isDragging && Date.now() - lastInteraction > 1500) {
                rotation += 0.005;
            }
            // Spawn packets every ~200ms
            if (Math.random() < 0.06) spawnPacket();
            draw(t);
            requestAnimationFrame(loop);
        }

        // Touch/mouse drag to rotate
        function onStart(x, y) {
            isDragging = true;
            lastX = x; lastY = y;
            lastInteraction = Date.now();
        }
        function onMove(x, y) {
            if (!isDragging) return;
            var dx = x - lastX, dy = y - lastY;
            manualRotY += dx * 0.01;
            manualRotX += dy * 0.01;
            manualRotX = Math.max(-1.2, Math.min(1.2, manualRotX));
            lastX = x; lastY = y;
            lastInteraction = Date.now();
        }
        function onEnd() { isDragging = false; lastInteraction = Date.now(); }

        canvas.addEventListener('mousedown', function(e) { onStart(e.clientX, e.clientY); });
        window.addEventListener('mousemove', function(e) { onMove(e.clientX, e.clientY); });
        window.addEventListener('mouseup', onEnd);

        // On touch: allow vertical page scroll until the user clearly drags horizontally.
        // We track touch start, then decide on first move whether to claim the gesture.
        var touchStartX = 0, touchStartY = 0, touchClaimed = false;
        canvas.addEventListener('touchstart', function(e) {
            var t = e.touches[0];
            touchStartX = t.clientX;
            touchStartY = t.clientY;
            touchClaimed = false;
            onStart(t.clientX, t.clientY);
        }, { passive: true });
        canvas.addEventListener('touchmove', function(e) {
            var t = e.touches[0];
            var dx = t.clientX - touchStartX;
            var dy = t.clientY - touchStartY;
            if (!touchClaimed) {
                // Need at least 6px movement, and horizontal must dominate to claim drag
                if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
                if (Math.abs(dy) > Math.abs(dx) * 1.5) {
                    // Vertical scroll wins; release the gesture
                    isDragging = false;
                    return;
                }
                touchClaimed = true;
            }
            if (e.cancelable) e.preventDefault();
            onMove(t.clientX, t.clientY);
        }, { passive: false });
        canvas.addEventListener('touchend', onEnd, { passive: true });

        // Hover detection (use cached size, passive since we don't preventDefault)
        canvas.addEventListener('mousemove', function(e) {
            var rect = canvas.getBoundingClientRect();
            var mx = e.clientX - rect.left;
            var my = e.clientY - rect.top;
            var w = size;
            var h = size;
            var cx = w / 2, cy = h / 2;
            var R = Math.min(w, h) * 0.32;
            var found = -1;
            for (var i = 0; i < nodes.length; i++) {
                var node = nodes[i];
                var r = (node.value / 100) * 1.0;
                var x = Math.cos(node.phi) * Math.cos(node.lat) * r;
                var y = Math.sin(node.lat) * r;
                var z = Math.sin(node.phi) * Math.cos(node.lat) * r;
                var p = project(x, y, z);
                var sx = cx + p.x * R;
                var sy = cy + p.y * R;
                if (Math.hypot(mx - sx, my - sy) < 20) { found = i; break; }
            }
            if (found !== hoveredIndex) {
                hoveredIndex = found;
                var items = legendContainer.querySelectorAll('.radar-legend-item');
                for (var k = 0; k < items.length; k++) {
                    items[k].classList.toggle('active', k === found);
                }
            }
        }, { passive: true });

        // Legend
        skills.forEach(function(skill, idx) {
            var item = document.createElement('div');
            item.className = 'radar-legend-item';
            item.innerHTML = '<span class="radar-legend-dot" style="background:' + skill.color + '"></span>' +
                '<span class="radar-legend-name">' + skill.label + '</span>' +
                '<span class="radar-legend-val">' + skill.value + '%</span>';
            item.addEventListener('mouseenter', function() {
                hoveredIndex = idx;
                item.classList.add('active');
            });
            item.addEventListener('mouseleave', function() {
                hoveredIndex = -1;
                item.classList.remove('active');
            });
            legendContainer.appendChild(item);
        });

        // Live stats panel: max, min, average — animated bar
        (function buildStats() {
            var statsEl = document.getElementById('skillStats');
            if (!statsEl) return;

            var values = skills.map(function(s) { return s.value; });
            var maxV = Math.max.apply(null, values);
            var minV = Math.min.apply(null, values);
            var avgV = Math.round(values.reduce(function(a, b) { return a + b; }, 0) / values.length);
            var maxSkill = skills[values.indexOf(maxV)];
            var minSkill = skills[values.indexOf(minV)];

            statsEl.innerHTML =
                '<div class="skill-stat top">' +
                    '<span class="skill-stat-label">&#9650; Top</span>' +
                    '<span class="skill-stat-name">' + maxSkill.label + '</span>' +
                    '<span class="skill-stat-value max">' + maxV + '%</span>' +
                '</div>' +
                '<div class="skill-stat avg">' +
                    '<span class="skill-stat-label">&middot; Average</span>' +
                    '<span class="skill-stat-name">All Skills</span>' +
                    '<span class="skill-stat-value">' + avgV + '%</span>' +
                '</div>' +
                '<div class="skill-stat low">' +
                    '<span class="skill-stat-label">&#9651; Growing</span>' +
                    '<span class="skill-stat-name">' + minSkill.label + '</span>' +
                    '<span class="skill-stat-value min">' + minV + '%</span>' +
                '</div>' +
                '<div class="skill-stats-bar">' +
                    '<div class="skill-stats-bar-track">' +
                        '<div class="skill-stats-bar-fill" style="left:' + minV + '%; right:' + (100 - maxV) + '%;"></div>' +
                        '<div class="skill-stats-bar-marker" style="left:' + avgV + '%;" title="Average ' + avgV + '%"></div>' +
                    '</div>' +
                    '<div class="skill-stats-bar-scale"><span>0</span><span>50</span><span>100</span></div>' +
                '</div>';

            // Live tickers (animate values from 0 to target)
            statsEl.querySelectorAll('.skill-stat-value').forEach(function(el) {
                var target = parseInt(el.textContent, 10);
                el.textContent = '0%';
                var start = performance.now();
                var dur = 1200;
                function step(now) {
                    var p = Math.min((now - start) / dur, 1);
                    p = 1 - Math.pow(1 - p, 3);
                    el.textContent = Math.round(target * p) + '%';
                    if (p < 1) requestAnimationFrame(step);
                }
                requestAnimationFrame(step);
            });
        })();

        // Resize (debounced to avoid layout thrash + repeated DPR scaling)
        var skillResizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(skillResizeTimer);
            skillResizeTimer = setTimeout(function() { size = setupCanvas(); }, 150);
        }, { passive: true });

        // Kick off
        for (var i = 0; i < 8; i++) spawnPacket();
        requestAnimationFrame(loop);
    })();

    // ============ VIVATECH BADGE LOGIN ============
    (function initBadgeLogin() {
        var card = document.getElementById('vivatechCard');
        if (!card) return;
        var form = document.getElementById('badgeLoginForm');
        var userInput = document.getElementById('badgeUser');
        var passInput = document.getElementById('badgePass');
        var errorEl = document.getElementById('badgeLoginError');
        var loginEl = document.getElementById('badgeLogin');
        var revealEl = document.getElementById('badgeReveal');
        var backBtn = document.getElementById('badgeLoginBack');
        var revealBack = document.getElementById('badgeRevealBack');
        var back = document.querySelector('.vivatech-back');

        function flip() { card.classList.add('flipped'); }
        function unflip() {
            card.classList.remove('flipped');
            setTimeout(function() {
                if (loginEl) loginEl.hidden = false;
                if (revealEl) revealEl.hidden = true;
                if (userInput) userInput.value = '';
                if (passInput) passInput.value = '';
                if (errorEl) errorEl.textContent = '';
            }, 700);
        }

        // Track touch movement so a scroll gesture does not flip the badge
        var badgeTouchX = 0, badgeTouchY = 0, badgeTouchMoved = false;
        card.addEventListener('touchstart', function(e) {
            var t = e.touches[0];
            badgeTouchX = t.clientX;
            badgeTouchY = t.clientY;
            badgeTouchMoved = false;
        }, { passive: true });
        card.addEventListener('touchmove', function(e) {
            var t = e.touches[0];
            if (Math.abs(t.clientX - badgeTouchX) > 10 || Math.abs(t.clientY - badgeTouchY) > 10) {
                badgeTouchMoved = true;
            }
        }, { passive: true });

        card.addEventListener('click', function(e) {
            if (card.classList.contains('flipped')) return;
            if (e.target.closest('button, input, form')) return;
            if (badgeTouchMoved) { badgeTouchMoved = false; return; }
            flip();
        });

        if (back) back.addEventListener('click', function(e) { e.stopPropagation(); });
        if (backBtn) backBtn.addEventListener('click', function(e) { e.stopPropagation(); unflip(); });
        if (revealBack) revealBack.addEventListener('click', function(e) { e.stopPropagation(); unflip(); });

        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                var user = (userInput.value || '').trim().toLowerCase().replace(/\s+/g, '');
                var pass = passInput.value || '';
                var validUser = user === 'danielmadac' || user === 'daniel' || user === 'madac';
                if (validUser && pass === 'Claudecode2026') {
                    errorEl.textContent = '';
                    loginEl.hidden = true;
                    revealEl.hidden = false;
                } else {
                    errorEl.textContent = 'Wrong name or password';
                    passInput.value = '';
                    form.classList.remove('shake');
                    void form.offsetWidth;
                    form.classList.add('shake');
                }
            });
        }
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

            // Resize handling (debounced)
            var globeResizeTimer;
            window.addEventListener('resize', function() {
                clearTimeout(globeResizeTimer);
                globeResizeTimer = setTimeout(function() {
                    var s = container.clientWidth;
                    renderer.setSize(s, s, false);
                }, 150);
            }, { passive: true });
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

            // Track touch movement so a scroll gesture does not flip the card
            var touchStartX = 0, touchStartY = 0, touchMoved = false;
            card.addEventListener('touchstart', function(e) {
                var t = e.touches[0];
                touchStartX = t.clientX;
                touchStartY = t.clientY;
                touchMoved = false;
            }, { passive: true });
            card.addEventListener('touchmove', function(e) {
                var t = e.touches[0];
                if (Math.abs(t.clientX - touchStartX) > 10 || Math.abs(t.clientY - touchStartY) > 10) {
                    touchMoved = true;
                }
            }, { passive: true });

            // Toggle flip on click/tap
            card.addEventListener('click', function(e) {
                // Don't flip if clicking a link
                if (e.target.tagName === 'A') return;
                // Don't flip if the user was scrolling
                if (touchMoved) { touchMoved = false; return; }
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

        // Polyglot: clicked 3+ language switcher buttons.
        // Use event delegation since the switcher is created later by i18n.js.
        var langs = {};
        document.addEventListener('click', function(e) {
            var btn = e.target.closest && e.target.closest('.lang-switcher-btn');
            if (!btn) return;
            langs[btn.dataset.lang] = true;
            if (Object.keys(langs).length >= 3) unlock('polyglot');
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
