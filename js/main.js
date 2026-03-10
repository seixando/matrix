/* ═══════════════════════════════════════════════
   MATRIX TECNOLOGIA — main.js
   Vanilla JS. Zero dependencies. Clean code.
   ═══════════════════════════════════════════════ */

(function () {
    'use strict';

    /* ─── DOM refs ────────────────────────────── */
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');
    const reveals = document.querySelectorAll('.reveal');
    const stats = document.querySelectorAll('.stat-number');

    /* ─── Navbar scroll effect ───────────────── */
    let lastScroll = 0;

    function handleScroll() {
        const y = window.scrollY;
        navbar.classList.toggle('scrolled', y > 50);
        lastScroll = y;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // init on load

    /* ─── Mobile menu toggle ─────────────────── */
    navToggle.addEventListener('click', function () {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    navLinks.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    /* ─── Scroll reveal (IntersectionObserver) ─ */
    if ('IntersectionObserver' in window) {
        var revealObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        revealObserver.unobserve(entry.target); // one-shot
                    }
                });
            },
            { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
        );

        reveals.forEach(function (el) {
            revealObserver.observe(el);
        });
    } else {
        // Fallback: show everything
        reveals.forEach(function (el) {
            el.classList.add('visible');
        });
    }

    /* ─── Counter animation ──────────────────── */
    function animateCounter(el) {
        var target = parseInt(el.getAttribute('data-count'), 10);
        var duration = 1500;
        var start = 0;
        var startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            // Ease out cubic
            var ease = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(ease * target);
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target;
            }
        }

        requestAnimationFrame(step);
    }

    if ('IntersectionObserver' in window) {
        var statsObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        statsObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        stats.forEach(function (el) {
            statsObserver.observe(el);
        });
    }

    /* ─── Smooth scroll for anchor links ─────── */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var hash = this.getAttribute('href');
            if (hash === '#') return;
            e.preventDefault();
            var target = document.querySelector(hash);
            if (target) {
                var offset = navbar.offsetHeight + 20;
                var top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

    /* ─── Contact form → Formspree ──────────── */
    var form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var btn = form.querySelector('button[type="submit"]');
            var originalHTML = btn.innerHTML;

            btn.innerHTML = '<span>Enviando...</span>';
            btn.disabled = true;

            fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            })
            .then(function (res) {
                if (res.ok) {
                    btn.innerHTML = '<span>✓ Mensagem enviada!</span>';
                    btn.style.background = 'var(--accent)';
                    form.reset();
                    setTimeout(function () {
                        btn.innerHTML = originalHTML;
                        btn.disabled = false;
                        btn.style.background = '';
                    }, 3000);
                } else {
                    btn.innerHTML = '<span>Erro ao enviar. Tente novamente.</span>';
                    btn.disabled = false;
                    setTimeout(function () { btn.innerHTML = originalHTML; }, 3000);
                }
            })
            .catch(function () {
                btn.innerHTML = '<span>Sem conexão. Tente novamente.</span>';
                btn.disabled = false;
                setTimeout(function () { btn.innerHTML = originalHTML; }, 3000);
            });
        });
    }

    /* ─── Typing effect for hero cursor ──────── */
    var cursorEl = document.querySelector('.cursor');
    if (cursorEl) {
        // Already animated via CSS blink keyframe — nothing extra needed
    }

    /* ─── FAQ accordion ──────────────────────── */
    var faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function (item) {
        var btn = item.querySelector('.faq-question');
        var answer = item.querySelector('.faq-answer');

        if (!btn || !answer) return;

        btn.addEventListener('click', function () {
            var isActive = item.classList.contains('active');

            // Close all open items
            faqItems.forEach(function (i) {
                i.classList.remove('active');
                var q = i.querySelector('.faq-question');
                if (q) q.setAttribute('aria-expanded', 'false');
            });

            // Open clicked item if it was closed
            if (!isActive) {
                item.classList.add('active');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    /* ─── Matrix Code Rain ───────────────────── */
    (function () {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        var canvas = document.getElementById('matrix-rain');
        if (!canvas) return;

        var ctx = canvas.getContext('2d');
        var FONT_SIZE = 15;
        var CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0101<>/\\|{}[]';
        var drops = [];

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            ctx.fillStyle = 'rgb(5,5,5)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            var cols = Math.floor(canvas.width / FONT_SIZE);
            drops = [];
            for (var i = 0; i < cols; i++) {
                // Mix of active columns and delayed ones for organic start
                drops.push(
                    Math.random() > 0.5
                        ? Math.floor(Math.random() * (canvas.height / FONT_SIZE))
                        : -Math.floor(Math.random() * 40)
                );
            }
        }

        function tick() {
            // Partial clear creates the trailing fade effect
            ctx.fillStyle = 'rgba(5,5,5,0.07)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.font = FONT_SIZE + 'px "JetBrains Mono",monospace';

            for (var i = 0; i < drops.length; i++) {
                if (drops[i] < 0) { drops[i]++; continue; }

                // Occasional brighter character for depth
                ctx.fillStyle = Math.random() > 0.94 ? '#aaffcc' : '#00ff88';
                ctx.fillText(
                    CHARS[Math.floor(Math.random() * CHARS.length)],
                    i * FONT_SIZE,
                    drops[i] * FONT_SIZE
                );

                // Reset column when it falls off screen
                if (drops[i] * FONT_SIZE > canvas.height && Math.random() > 0.975) {
                    drops[i] = -Math.floor(Math.random() * 20);
                }
                drops[i]++;
            }
        }

        resize();

        var resizeTimer;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(resize, 250);
        }, { passive: true });

        var lastFrame = 0;
        var FRAME_INTERVAL = 60; // ~16fps — slow and ambient

        function loop(ts) {
            requestAnimationFrame(loop);
            if (ts - lastFrame < FRAME_INTERVAL) return;
            lastFrame = ts;
            tick();
        }

        requestAnimationFrame(loop);
    }());

    /* ─── Terminal Live (about section) ─────── */
    (function () {
        var body = document.getElementById('terminalLive');
        if (!body) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            body.innerHTML = '<div class="terminal-line"><span class="t-prompt">$</span> <span class="t-cmd-typing">npm run test &amp;&amp; git push</span></div><div class="terminal-line t-output t-success">✓ 147 testes passaram · Coverage: 94%</div><div class="terminal-line t-output t-success">remote: ✓ Deploy iniciado</div><div class="terminal-line"><span class="t-prompt">$</span> <span class="t-cursor">█</span></div>';
            return;
        }

        var SCRIPT = [
            {
                cmd: 'cat filosofia.md',
                output: [
                    { text: '',                                  cls: 't-output' },
                    { text: '# Nossa Filosofia',                 cls: 't-output' },
                    { text: '',                                  cls: 't-output' },
                    { text: '→ Código limpo > código esperto',  cls: 't-output' },
                    { text: '→ Testes não são opcionais',       cls: 't-output' },
                    { text: '→ Documentação é respeito',        cls: 't-output' },
                    { text: '→ Performance é não-negociável',   cls: 't-output' },
                    { text: '',                                  cls: 't-output' }
                ]
            },
            {
                cmd: 'npm run test',
                output: [
                    { text: '',                                   cls: 't-output' },
                    { text: '> matrix@2.0.0 test',               cls: 't-output' },
                    { text: '',                                   cls: 't-output' },
                    { text: '✓ 147 testes passaram',             cls: 't-output t-success' },
                    { text: '✓ Coverage: 94% statements',        cls: 't-output t-success' },
                    { text: '✓ 0 vulnerabilidades críticas',     cls: 't-output t-success' },
                    { text: '',                                   cls: 't-output' }
                ]
            },
            {
                cmd: 'git push origin main',
                output: [
                    { text: '',                                   cls: 't-output' },
                    { text: 'remote: ✓ CI passed',              cls: 't-output t-success' },
                    { text: 'remote: ✓ Deploy iniciado',        cls: 't-output t-success' },
                    { text: 'remote: ↗  app.matrixtec.dev',     cls: 't-output t-link' },
                    { text: '',                                   cls: 't-output' }
                ]
            }
        ];

        var currentCmd = 0;

        function scroll() { body.scrollTop = body.scrollHeight; }

        function addLine(text, cls) {
            var div = document.createElement('div');
            div.className = 'terminal-line' + (cls ? ' ' + cls : '');
            div.textContent = text;
            body.appendChild(div);
            scroll();
        }

        function addPrompt(done) {
            var line = document.createElement('div');
            line.className = 'terminal-line';
            var ps = document.createElement('span');
            ps.className = 't-prompt';
            ps.textContent = '$';
            var cmdSpan = document.createElement('span');
            cmdSpan.className = 't-cmd-typing';
            cmdSpan.textContent = ' ';
            var cur = document.createElement('span');
            cur.className = 't-cursor';
            cur.textContent = '█';
            line.appendChild(ps);
            line.appendChild(cmdSpan);
            line.appendChild(cur);
            body.appendChild(line);
            scroll();
            done(cmdSpan, cur);
        }

        function typeCmd(cmdSpan, cur, text, done) {
            var i = 0;
            function step() {
                if (i >= text.length) { cur.remove(); done(); return; }
                cmdSpan.textContent += text[i];
                i++;
                scroll();
                setTimeout(step, 50 + Math.random() * 30);
            }
            setTimeout(step, 250);
        }

        function printOutput(lines, done) {
            var i = 0;
            function next() {
                if (i >= lines.length) { done(); return; }
                addLine(lines[i].text, lines[i].cls);
                i++;
                setTimeout(next, 70);
            }
            setTimeout(next, 300);
        }

        function runStep() {
            if (currentCmd >= SCRIPT.length) {
                addPrompt(function (cmdSpan, cur) {
                    cmdSpan.textContent = '';
                    setTimeout(function () {
                        body.innerHTML = '';
                        currentCmd = 0;
                        runStep();
                    }, 4000);
                });
                return;
            }
            var entry = SCRIPT[currentCmd];
            addPrompt(function (cmdSpan, cur) {
                typeCmd(cmdSpan, cur, ' ' + entry.cmd, function () {
                    printOutput(entry.output, function () {
                        currentCmd++;
                        runStep();
                    });
                });
            });
        }

        setTimeout(runStep, 600);
    }());

    /* ─── Typewriter — hero title ────────────── */
    (function () {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        var titleEl = document.querySelector('.hero-title');
        if (!titleEl) return;

        // Script: text segments with optional CSS class
        var SEGMENTS = [
            { text: 'O mundo roda em ' },
            { text: 'código',           cls: 'accent-text' },
            { br: true },
            { text: 'nós escrevemos as regras' }
        ];

        // Flatten to a character queue
        var queue = [];
        SEGMENTS.forEach(function (seg) {
            if (seg.br) { queue.push({ br: true }); return; }
            seg.text.split('').forEach(function (c) {
                queue.push({ char: c, cls: seg.cls || null });
            });
        });

        var typedCount = 0;

        function buildHTML() {
            var html = '';
            var i = 0;
            while (i < typedCount) {
                var item = queue[i];
                if (item.br) { html += '<br>'; i++; continue; }
                // Group consecutive chars with the same cls
                var cls = item.cls;
                var chunk = '';
                while (i < typedCount && queue[i].char !== undefined && queue[i].cls === cls) {
                    chunk += queue[i].char;
                    i++;
                }
                html += cls
                    ? '<span class="' + cls + '">' + chunk + '</span>'
                    : chunk;
            }
            return html + '<span class="cursor">_</span>';
        }

        // Clear immediately (synchronous) so there's no content flash
        titleEl.innerHTML = '<span class="cursor">_</span>';

        function typeNext() {
            if (typedCount >= queue.length) return;
            typedCount++;
            titleEl.innerHTML = buildHTML();

            var item = queue[typedCount - 1];
            var delay = item.br
                ? 200                          // pause at line break
                : 30 + Math.random() * 20;     // natural variation per char
            setTimeout(typeNext, delay);
        }

        // Short pause before starting — lets the page settle
        setTimeout(typeNext, 600);
    }());

    /* ─── Cookie notice (LGPD) ──────────────── */
    (function () {
        var STORAGE_KEY = 'matrix_cookie_consent';
        var notice = document.getElementById('cookieNotice');
        var btnAccept = document.getElementById('cookieAccept');
        var btnDecline = document.getElementById('cookieDecline');

        if (!notice) return;

        if (!localStorage.getItem(STORAGE_KEY)) {
            // Show after a small delay so page loads first
            setTimeout(function () { notice.hidden = false; }, 1200);
        }

        function dismiss(value) {
            notice.hidden = true;
            localStorage.setItem(STORAGE_KEY, value);
        }

        if (btnAccept) btnAccept.addEventListener('click', function () { dismiss('accepted'); });
        if (btnDecline) btnDecline.addEventListener('click', function () { dismiss('declined'); });
    }());

    /* ─── Copyright year (dynamic) ─────────── */
    var yearEl = document.getElementById('copyright-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ─── Performance: reduce motion if preferred */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.setProperty('--duration-slow', '0ms');
        document.documentElement.style.setProperty('--duration-normal', '0ms');
        reveals.forEach(function (el) {
            el.classList.add('visible');
        });
    }

})();
