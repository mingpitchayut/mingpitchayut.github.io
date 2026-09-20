/**
 * Pitchayut Boonporn Portfolio - Main Interactive Logic
 * Pure ES6+ JavaScript: Typewriter, Physics Cursor, Terminal CLI, Modals, GitHub Stats, Contact Form
 */

document.addEventListener("DOMContentLoaded", () => {
    initTypewriter();
    initCustomCursor();
    initScrollReveal();
    initNavScrollEffect();
    initTimelineAccordion();
    initPillarAccordion();
    initDeveloperTerminal();
    initProjectModals();
    initResumeModal();
    initContactForm();
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
        "a, button, input, textarea, .hero-pill-card, .bento-card, .project-card, .pillar-card, .timeline-card, .term-chip, .modal-close-btn, .open-modal-btn"
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

    // Animate all elements in sequentially on page load instead of scroll triggering
    reveals.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add("active");
        }, 120 * index); // 120ms stagger between each element
    });
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

/* --------------------------------------------------------------------------
   5. Mobile Journey Card Accordion (Click to Drop Description)
   -------------------------------------------------------------------------- */
function initTimelineAccordion() {
    const cards = document.querySelectorAll(".timeline-card");
    cards.forEach((card) => {
        card.addEventListener("click", (e) => {
            // Only toggle on mobile devices/screens (<= 680px)
            if (window.innerWidth > 680) return;

            // If clicking directly on an external link or image link, let the link open normally
            if (e.target.closest(".timeline-image-zone")) return;

            card.classList.toggle("is-expanded");
        });
    });
}

/* --------------------------------------------------------------------------
   5b. OKD Pillar Cards Accordion (Click Card to Drop Description)
   -------------------------------------------------------------------------- */
function initPillarAccordion() {
    const cards = document.querySelectorAll(".pillar-card");
    cards.forEach((card) => {
        card.addEventListener("click", () => {
            const isExpanded = card.classList.toggle("is-expanded");
            card.setAttribute("aria-expanded", isExpanded);
        });

        card.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                const isExpanded = card.classList.toggle("is-expanded");
                card.setAttribute("aria-expanded", isExpanded);
            }
        });
    });
}

/* --------------------------------------------------------------------------
   6. Interactive Developer Terminal (CLI)
   -------------------------------------------------------------------------- */
function initDeveloperTerminal() {
    const terminalBody = document.getElementById("terminal-body");
    const terminalForm = document.getElementById("terminal-form");
    const terminalInput = document.getElementById("terminal-input");
    const chips = document.querySelectorAll(".term-chip");

    if (!terminalBody || !terminalForm || !terminalInput) return;

    const commandHistory = [];
    let historyIndex = -1;

    const commands = {
        help: () => `
            <strong>Available Commands:</strong><br>
            • <span class="term-highlight">about</span>    - Executive engineer profile & background<br>
            • <span class="term-highlight">skills</span>   - Core technologies, databases & systems<br>
            • <span class="term-highlight">projects</span> - Production platforms & architecture highlights<br>
            • <span class="term-highlight">journey</span>  - Career timeline & engineering milestones<br>
            • <span class="term-highlight">contact</span>  - Email, LinkedIn & direct communication<br>
            • <span class="term-highlight">resume</span>   - Open full curriculum vitae viewer<br>
            • <span class="term-highlight">github</span>   - View live GitHub metrics & repository links<br>
            • <span class="term-highlight">whoami</span>   - Print current authenticated session info<br>
            • <span class="term-highlight">clear</span>    - Clear terminal buffer
        `,
        about: () => `
            <strong>Pitchayut Boonporn (Ming)</strong><br>
            Software Engineer & Full-Stack Architect | Mahidol University Computer Engineering '26.<br>
            Specialized in headless enterprise commerce (Next.js 15, Payload CMS 3.0, PostgreSQL),<br>
            scalable data ETL automation pipelines (Python, Pandas), and object-oriented systems (Java).
        `,
        skills: () => `
            <strong>Architecture & Systems:</strong><br>
            • Languages: Java (OOP), Python (Automation/ETL), C/C++, TypeScript, JavaScript, SQL<br>
            • Web & Cloud: Next.js 15, Payload CMS 3.0, Neon PostgreSQL, Cloudflare R2, Node.js<br>
            • Integrations: Thai QR PromptPay, LINE Messaging API, RESTful Webhooks, Schema.org<br>
            • Systems: Git/GitHub, Linux CLI, Docker concepts, CI/CD Actions
        `,
        projects: () => `
            <strong>Featured Production Systems:</strong><br>
            1. <strong style="color: #60a5fa;">OKD Network:</strong> Headless B2B Platform (Next.js 15, Payload 3, Neon DB, Thai QR, LINE API)<br>
            2. <strong style="color: #60a5fa;">BitBeats:</strong> 2D Audio-Visual Rhythm Game Engine (Java OOP, custom chart engine)<br>
            3. <strong style="color: #60a5fa;">Automation Suite:</strong> Enterprise Inventory ETL Pipelines @ Toyota Tsusho<br>
            4. <strong style="color: #60a5fa;">Inventory Engine:</strong> High-Throughput Sorting & Cataloging System (Java/SQL)<br>
            <em>Tip: Scroll to the Projects section or tap any project card for deep-dive architecture specs.</em>
        `,
        journey: () => `
            <strong>Engineering Track Record:</strong><br>
            • <strong>2025:</strong> System Architect @ OKD Network (Production B2B platform launch)<br>
            • <strong>2025:</strong> Semi-Finalist @ AIS Hackathon (Top nationwide competition)<br>
            • <strong>2024:</strong> Software Developer (Part-time) @ Toyota Tsusho Corporation (Enterprise Python automation)<br>
            • <strong>2022 - 2026:</strong> B.Eng. Computer Engineering @ Mahidol University
        `,
        contact: () => `
            <strong>Direct Communication Channels:</strong><br>
            • Email: <a href="mailto:pitchayutbp@gmail.com" class="accent-text">pitchayutbp@gmail.com</a><br>
            • LinkedIn: <a href="https://www.linkedin.com/in/pitchayut-boonporn/" target="_blank" rel="noopener noreferrer" class="accent-text">linkedin.com/in/pitchayut-boonporn</a><br>
            • GitHub: <a href="https://github.com/mingpitchayut" target="_blank" rel="noopener noreferrer" class="accent-text">github.com/mingpitchayut</a><br>
            • Location: Bangkok, Thailand (Open to remote & on-site software engineering roles)
        `,
        resume: () => {
            setTimeout(() => {
                openResumeModal();
            }, 300);
            return `Opening interactive resume viewer in-page... (Press ESC or Close to return)`;
        },
        github: () => `
            <strong>GitHub Profile:</strong> @mingpitchayut<br>
            • Profile: <a href="https://github.com/mingpitchayut" target="_blank" rel="noopener noreferrer" class="accent-text">https://github.com/mingpitchayut</a><br>
            • Highlight Repositories: OKD Network, BitBeats, InventorySortingProject<br>
            • Real-time stats available in the Bento Core Expertise section below!
        `,
        whoami: () => `
            guest@portfolio.pitchayut.io<br>
            Role: Engineering Recruiter / Technical Reviewer / Fellow Developer<br>
            Permissions: read, execute, inspect_architecture, get_in_touch
        `,
        clear: () => {
            terminalBody.innerHTML = "";
            return null;
        }
    };

    function executeCommand(rawCmd) {
        const cmd = rawCmd.trim().toLowerCase();
        if (!cmd) return;

        commandHistory.push(rawCmd);
        historyIndex = commandHistory.length;

        // If clear was triggered
        if (cmd === "clear") {
            commands.clear();
            return;
        }

        // Create user prompt line
        const line = document.createElement("div");
        line.className = "terminal-line";
        line.innerHTML = `
            <span class="prompt-user">pitchayut@portfolio</span>:<span class="prompt-path">~</span>$ <span class="cmd-run">${escapeHtml(rawCmd)}</span>
        `;

        const output = document.createElement("div");
        output.className = "terminal-output";

        if (commands[cmd]) {
            const result = commands[cmd]();
            if (result !== null) {
                output.innerHTML = result;
                line.appendChild(output);
            }
        } else {
            output.innerHTML = `
                <span style="color: #f87171;">command not found: ${escapeHtml(rawCmd)}</span><br>
                Type <span class="term-highlight">help</span> to view all supported commands.
            `;
            line.appendChild(output);
        }

        terminalBody.appendChild(line);
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    terminalForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const value = terminalInput.value;
        executeCommand(value);
        terminalInput.value = "";
    });

    // Arrow keys for history
    terminalInput.addEventListener("keydown", (e) => {
        if (e.key === "ArrowUp") {
            if (historyIndex > 0) {
                historyIndex--;
                terminalInput.value = commandHistory[historyIndex] || "";
            }
            e.preventDefault();
        } else if (e.key === "ArrowDown") {
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                terminalInput.value = commandHistory[historyIndex] || "";
            } else {
                historyIndex = commandHistory.length;
                terminalInput.value = "";
            }
            e.preventDefault();
        }
    });

    // Quick chips click
    chips.forEach((chip) => {
        chip.addEventListener("click", () => {
            const cmd = chip.getAttribute("data-cmd");
            if (cmd) {
                terminalInput.value = cmd;
                executeCommand(cmd);
                terminalInput.value = "";
            }
        });
    });
}

function escapeHtml(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

/* --------------------------------------------------------------------------
   7. Project Detail Architecture Modals
   -------------------------------------------------------------------------- */
const PROJECT_DATA = {
    okd: {
        title: "OKD Network — Enterprise Hardware E-Commerce",
        category: "Headless B2B Platform · Next.js 15 & Payload CMS 3.0",
        image: "assets/images/journey-okd.jpg",
        highlights: [
            "Sub-second First Contentful Paint with Next.js 15 App Router and React Server Components (RSC).",
            "Serverless PostgreSQL on Neon coupled with an automated ETL pipeline distributing hardware assets to Cloudflare R2 object storage.",
            "Dynamic Thai QR PromptPay integration verifying payments with automatic Tax Invoice routing.",
            "Asynchronous LINE Messaging API webhooks dispatching instant order tracking and buyer confirmations.",
            "Rich Schema.org JSON-LD structured data engineered for Google Merchant & Enterprise Hardware search visibility."
        ],
        tech: ["Next.js 15", "Payload CMS 3.0", "Neon PostgreSQL", "Cloudflare R2", "PromptPay Thai QR", "LINE Messaging API", "TypeScript", "Tailwind CSS"],
        primaryLink: { text: "Visit Live Site", url: "https://www.okdnetwork.com/", icon: "fa-arrow-up-right-from-square" },
        githubLink: null
    },
    bitbeats: {
        title: "BitBeats — Interactive 2D Rhythm Action Game",
        category: "Game Development · Java & OOP",
        image: "assets/images/journey-bitbeats.jpg",
        highlights: [
            "Engineered millisecond-accurate audio synchronization matching key inputs to custom musical note charts.",
            "Designed clean Object-Oriented Architecture (OOP) with modular scene managers and polymorphic note entities.",
            "Implemented dynamic combo multipliers, score tracking systems, and visual hit feedback animations.",
            "Optimized 2D canvas rendering loops ensuring consistent 60+ FPS performance without frame drops."
        ],
        tech: ["Java", "Java Swing / AWT", "Audio Synthesizer", "OOP Architecture", "Git"],
        primaryLink: { text: "View GitHub Repository", url: "https://github.com/mingpitchayut/bitbeats", icon: "fab fa-github" },
        githubLink: { text: "GitHub Repo", url: "https://github.com/mingpitchayut/bitbeats" }
    },
    automation: {
        title: "Enterprise Workflow Automation Suite",
        category: "Corporate Systems · Toyota Tsusho",
        image: "assets/images/journey-toyota.jpg",
        highlights: [
            "Architected Python automation tools eliminating over 70% of repetitive cross-departmental manual data entries.",
            "Engineered robust spreadsheet parsing and validation pipelines handling large-scale commercial datasets with zero data loss.",
            "Automated scheduled report generation and executive-ready summary files directly from operational logs.",
            "Documented modular, maintainable Python code for seamless long-term adoption across enterprise teams."
        ],
        tech: ["Python", "Pandas", "OpenPyXL", "Enterprise ETL", "Process Automation"],
        primaryLink: null,
        githubLink: null
    },
    inventory: {
        title: "High-Throughput Inventory Sorting Engine",
        category: "Backend & Systems · Java & SQL",
        image: "assets/images/journey-inventory.jpg",
        highlights: [
            "Built high-efficiency sorting algorithms supporting multi-attribute categorization across large inventory datasets.",
            "Integrated relational SQL database queries optimized for low-latency product lookup and filtered retrieval.",
            "Engineered an interactive desktop control interface with defensive input validation and real-time state updates.",
            "Validated data consistency across concurrent inventory operations through comprehensive edge-case testing."
        ],
        tech: ["Java", "Relational Database (SQL)", "Sorting Algorithms", "Data Structures", "OOP"],
        primaryLink: { text: "View GitHub Repository", url: "https://github.com/mingpitchayut/InventorySortingProject", icon: "fab fa-github" },
        githubLink: { text: "GitHub Repo", url: "https://github.com/mingpitchayut/InventorySortingProject" }
    }
};

function initProjectModals() {
    const modal = document.getElementById("project-modal");
    const closeBtn = document.getElementById("modal-close-btn");
    const titleEl = document.getElementById("modal-title");
    const categoryEl = document.getElementById("modal-category");
    const imgEl = document.getElementById("modal-img");
    const highlightsEl = document.getElementById("modal-highlights");
    const techEl = document.getElementById("modal-tech");
    const actionsEl = document.getElementById("modal-actions");

    if (!modal) return;

    function openModal(projectKey) {
        const data = PROJECT_DATA[projectKey];
        if (!data) return;

        titleEl.textContent = data.title;
        categoryEl.textContent = data.category;
        imgEl.src = data.image;
        imgEl.alt = data.title;

        // Highlights
        highlightsEl.innerHTML = data.highlights
            .map(h => `<li><i class="fas fa-check-circle" style="color: var(--accent-emerald); margin-right: 0.5rem; font-size: 0.85rem;"></i>${escapeHtml(h)}</li>`)
            .join("");

        // Tech pills
        techEl.innerHTML = data.tech
            .map(t => `<span class="skill-chip">${escapeHtml(t)}</span>`)
            .join("");

        // Actions
        actionsEl.innerHTML = "";
        if (data.primaryLink) {
            const btn = document.createElement("a");
            btn.href = data.primaryLink.url;
            btn.target = "_blank";
            btn.rel = "noopener noreferrer";
            btn.className = "pill-btn pill-btn-primary";
            btn.innerHTML = `<i class="${data.primaryLink.icon || 'fas fa-arrow-up-right-from-square'}"></i> ${escapeHtml(data.primaryLink.text)}`;
            actionsEl.appendChild(btn);
        }
        if (data.githubLink && data.githubLink.url !== (data.primaryLink && data.primaryLink.url)) {
            const ghBtn = document.createElement("a");
            ghBtn.href = data.githubLink.url;
            ghBtn.target = "_blank";
            ghBtn.rel = "noopener noreferrer";
            ghBtn.className = "pill-btn pill-btn-outline";
            ghBtn.innerHTML = `<i class="fab fa-github"></i> ${escapeHtml(data.githubLink.text)}`;
            actionsEl.appendChild(ghBtn);
        }

        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    }

    function closeModal() {
        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }

    // Attach click triggers
    document.querySelectorAll(".open-modal-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const projectKey = btn.getAttribute("data-project");
            openModal(projectKey);
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener("click", closeModal);
    }

    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("is-open")) {
            closeModal();
        }
    });
}

/* --------------------------------------------------------------------------
   8. In-Page Interactive Resume Modal
   -------------------------------------------------------------------------- */
function openResumeModal() {
    const modal = document.getElementById("resume-modal");
    if (!modal) return;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
}

function closeResumeModal() {
    const modal = document.getElementById("resume-modal");
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
}

function initResumeModal() {
    const modal = document.getElementById("resume-modal");
    const triggerBtn = document.getElementById("open-resume-btn");
    const closeBtn = document.getElementById("resume-modal-close-btn");

    if (!modal) return;

    if (triggerBtn) {
        triggerBtn.addEventListener("click", (e) => {
            e.preventDefault();
            openResumeModal();
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", closeResumeModal);
    }

    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeResumeModal();
        }
    });

    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("is-open")) {
            closeResumeModal();
        }
    });
}

/* --------------------------------------------------------------------------
   10. Glassmorphic In-Page Contact Form Handler
   -------------------------------------------------------------------------- */
function initContactForm() {
    const form = document.getElementById("contact-form");
    const submitBtn = document.getElementById("contact-submit-btn");
    const feedback = document.getElementById("form-feedback");

    if (!form || !submitBtn || !feedback) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const nameInput = document.getElementById("contact-name");
        const emailInput = document.getElementById("contact-email");
        const subjectInput = document.getElementById("contact-subject");
        const messageInput = document.getElementById("contact-message");

        const name = nameInput ? nameInput.value.trim() : "";
        const email = emailInput ? emailInput.value.trim() : "";
        const subject = subjectInput ? subjectInput.value.trim() : "Engineering Inquiry";
        const message = messageInput ? messageInput.value.trim() : "";

        // Simple validation
        if (!name || !email || !message) {
            showFeedback("Please fill in all required fields.", "error");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showFeedback("Please provide a valid email address.", "error");
            return;
        }

        // Set button loading state
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = `<i class="fas fa-circle-notch fa-spin"></i> Sending...`;
        submitBtn.disabled = true;

        // Simulate seamless submission & offer mailto fallback
        setTimeout(() => {
            submitBtn.innerHTML = `<i class="fas fa-check"></i> Message Prepared!`;
            submitBtn.style.background = "linear-gradient(135deg, #10b981, #059669)";

            showFeedback(
                `Thank you, <strong>${escapeHtml(name)}</strong>! Opening your email client to send directly to <strong>pitchayutbp@gmail.com</strong>...`,
                "success"
            );

            // Construct mailto link
            const mailtoUrl = `mailto:pitchayutbp@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Hi Pitchayut,\n\n${message}\n\nFrom: ${name} (${email})`)}`;
            
            setTimeout(() => {
                window.location.href = mailtoUrl;
            }, 800);

            setTimeout(() => {
                form.reset();
                submitBtn.innerHTML = originalBtnText;
                submitBtn.style.background = "";
                submitBtn.disabled = false;
            }, 4000);

        }, 600);
    });

    function showFeedback(msg, type) {
        feedback.innerHTML = msg;
        feedback.className = `form-feedback is-visible feedback-${type}`;
    }
}