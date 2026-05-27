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

    navBurger.addEventListener('click', () => {
        navBurger.classList.toggle('active');
        navLinks.classList.toggle('open');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navBurger.classList.remove('active');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

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

    // ============ SMOOTH SCROLL FOR NAV LOGO ============
    document.querySelector('.nav-logo').addEventListener('click', e => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

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
        var selectors = '.skill-card, .project-card, .lang-card, .contact-card, .timeline-content';
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
            card.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        }

        cards.forEach(function (card) {
            card.style.willChange = 'transform';
            card.style.transition = 'transform 0.45s cubic-bezier(0.23, 1, 0.32, 1)';
            var isTilting = false;

            card.addEventListener('mousemove', function (e) {
                applyTilt(card, e.clientX, e.clientY);
            });
            card.addEventListener('mouseleave', function () {
                resetTilt(card);
            });

            card.addEventListener('touchstart', function (e) {
                isTilting = true;
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

})();
