/**
 * Pitchayut Boonporn Portfolio - Main Interactive Logic
 * Pure ES6+ JavaScript: Typewriter, Smooth Cursor Follower, Intersection Observer
 */

document.addEventListener("DOMContentLoaded", () => {
    initTypewriter();
    initCustomCursor();
    initScrollReveal();
    initNavScrollEffect();
});

/* --------------------------------------------------------------------------
   1. Dynamic Typewriter Effect
   -------------------------------------------------------------------------- */
function initTypewriter() {
    const textElement = document.getElementById("typewriter");
    if (!textElement) return;

    const phrases = [
        "Pitchayut Boonporn.",
        "the Architect of OKD Network.",
        "a Computer Engineer.",
        "a Software Developer.",
        "an AIS Hackathon Finalist.",
        "a Mahidol University Student."
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 120;
    let isVisible = true;

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
            isVisible = entries[0].isIntersecting;
        });
        observer.observe(textElement.parentElement);
    }

    function type() {
        if (!isVisible) {
            setTimeout(type, 500);
            return;
        }

        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            textElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 60;
        } else {
            textElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 120;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typeSpeed = 2200; // Pause at end of word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 400; // Pause before new word
        }

        setTimeout(type, typeSpeed);
    }

    type();
}

/* --------------------------------------------------------------------------
   2. Smooth Custom Cursor & Outline (Physics Interpolation)
   -------------------------------------------------------------------------- */
function initCustomCursor() {
    const dot = document.querySelector(".cursor-dot");
    const outline = document.querySelector(".cursor-outline");

    if (!dot || !outline || window.matchMedia("(pointer: coarse)").matches) {
        return; // Disable on touch devices
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let outlineX = mouseX;
    let outlineY = mouseY;
    let isVisible = false;

    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;

        if (!isVisible) {
            dot.style.opacity = "1";
            outline.style.opacity = "1";
            isVisible = true;
        }
    });

    document.addEventListener("mouseleave", () => {
        dot.style.opacity = "0";
        outline.style.opacity = "0";
        isVisible = false;
    });

    // Smooth Lerp loop for the outer cursor ring
    function renderCursor() {
        outlineX += (mouseX - outlineX) * 0.18;
        outlineY += (mouseY - outlineY) * 0.18;

        outline.style.transform = `translate(${outlineX}px, ${outlineY}px) translate(-50%, -50%)`;
        requestAnimationFrame(renderCursor);
    }

    renderCursor();

    // Hover interactions with clickable elements
    const interactiveElements = document.querySelectorAll(
        "a, button, .hero-pill-card, .bento-card, .project-card, .pillar-card, .timeline-card"
    );

    interactiveElements.forEach((el) => {
        el.addEventListener("mouseenter", () => document.body.classList.add("cursor-hover"));
        el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hover"));
    });
}

/* --------------------------------------------------------------------------
   3. High-Performance Scroll Reveal (IntersectionObserver)
   -------------------------------------------------------------------------- */
function initScrollReveal() {
    const reveals = document.querySelectorAll(".reveal");

    if (!("IntersectionObserver" in window)) {
        // Fallback for older browsers
        reveals.forEach((el) => el.classList.add("active"));
        return;
    }

    const observerOptions = {
        root: null,
        rootMargin: "0px 0px -60px 0px",
        threshold: 0.12
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                obs.unobserve(entry.target); // Reveal once
            }
        });
    }, observerOptions);

    reveals.forEach((el) => observer.observe(el));
}

/* --------------------------------------------------------------------------
   4. Glass Navigation Scroll Effect
   -------------------------------------------------------------------------- */
function initNavScrollEffect() {
    const nav = document.querySelector(".glass-nav");
    if (!nav) return;

    window.addEventListener("scroll", () => {
        if (window.scrollY > 40) {
            nav.style.background = "rgba(7, 7, 10, 0.88)";
            nav.style.boxShadow = "0 10px 30px -10px rgba(0, 0, 0, 0.7)";
            nav.style.borderColor = "rgba(255, 255, 255, 0.14)";
        } else {
            nav.style.background = "rgba(7, 7, 10, 0.75)";
            nav.style.boxShadow = "none";
            nav.style.borderColor = "rgba(255, 255, 255, 0.1)";
        }
    }, { passive: true });
}