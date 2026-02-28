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

    /* ─── Contact form (demo handler) ────────── */
    var form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var btn = form.querySelector('button[type="submit"]');
            var originalText = btn.innerHTML;

            btn.innerHTML = '<span>Enviando...</span>';
            btn.disabled = true;

            // Simulate send (replace with real endpoint)
            setTimeout(function () {
                btn.innerHTML = '<span>✓ Mensagem enviada!</span>';
                btn.style.background = 'var(--accent)';
                form.reset();

                setTimeout(function () {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                    btn.style.background = '';
                }, 2500);
            }, 1200);
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

    /* ─── Performance: reduce motion if preferred */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.setProperty('--duration-slow', '0ms');
        document.documentElement.style.setProperty('--duration-normal', '0ms');
        reveals.forEach(function (el) {
            el.classList.add('visible');
        });
    }

})();
