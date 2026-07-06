// Pukka Gen site interactions. Extracted from index.html.


        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const currentYear = document.getElementById('currentYear');
        if (currentYear) currentYear.textContent = String(new Date().getFullYear());

        function getFocusableElements(container) {
            if (!container) return [];
            return Array.from(container.querySelectorAll(
                'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
            )).filter(element => !element.closest('[aria-hidden="true"]') && element.getClientRects().length);
        }

        function openModal(modal, focusTarget) {
            if (!modal) return;
            modal._returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('modal-open');

            requestAnimationFrame(() => {
                const target = focusTarget || getFocusableElements(modal)[0];
                target?.focus({ preventScroll: true });
            });
        }

        function closeModal(modal, restoreFocus = true) {
            if (!modal) return;
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');

            if (!document.querySelector('.service-modal.active')) {
                document.body.classList.remove('modal-open');
            }

            if (restoreFocus && modal._returnFocus instanceof HTMLElement) {
                modal._returnFocus.focus({ preventScroll: true });
            }
        }

        function closeServiceModal() {
            closeModal(document.getElementById('serviceModal'));
        }

        function downloadNoDuffChecklist() {
            const checklist = [
                'THE PUKKA GEN NO-DUFF CHECKLIST',
                '',
                '1. What single expensive problem will this software solve?',
                '2. Who is the Day One user?',
                '3. What is the smallest viable first release?',
                '4. Does the contract clearly assign code and IP ownership to you?',
                '5. Are your brand assets, copy, and product content ready?',
                '6. Have you budgeted for hosting, maintenance, and post-launch support?',
                '7. Who has final decision authority?',
                '8. Is the delivery timeline realistic?',
                '9. Do you need a native mobile app, or will a responsive web app solve the problem?',
                '10. What measurable outcome defines done?',
                '',
                'If more than three answers are unclear, start with discovery before development.',
                'Pukka Gen Solutions — Authentic Engineering. Next-Gen Solutions.',
                'https://www.pukkagennoduff.com'
            ].join('\n');

            const blob = new Blob([checklist], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'pukka-gen-no-duff-checklist.txt';
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);
            showToast('Checklist download started.');
        }

        // --- 1. Init Animations ---
        window.addEventListener('DOMContentLoaded', () => {
            // Start reveal animations
            document.querySelectorAll('.reveal-text').forEach(el => el.classList.add('visible'));
            // Trigger typewriter
            typeWriter();
            // Start Slideshow
            initHeroSlideshow();
        });

        // --- 1.5 Hero Slideshow Logic ---
        function initHeroSlideshow() {
            const slides = document.querySelectorAll('#hero-slideshow > div');
            if(slides.length === 0) return;

            let currentSlide = 0;
            const intervalTime = 8000; // 8 seconds

            setInterval(() => {
                // Fade out current
                slides[currentSlide].classList.remove('opacity-100');
                slides[currentSlide].classList.add('opacity-0');

                // Calculate next
                currentSlide = (currentSlide + 1) % slides.length;

                // Fade in next
                slides[currentSlide].classList.remove('opacity-0');
                slides[currentSlide].classList.add('opacity-100');
            }, intervalTime);
        }

        // --- 2. Interactive Particles ---
        const canvas = document.getElementById('particleCanvas');
        const ctx = canvas ? canvas.getContext('2d') : null;
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        let particlesArray;
        let mouse = { x: null, y: null, radius: 100 };
        // Track positions of CSS-animated elements
        let rocketRect = { x: -1000, y: -1000 };
        let cometRect = { x: -1000, y: -1000 };
        // Flag to track comet status correctly since opacity style is set immediately
        let cometActive = false;

        window.addEventListener('mousemove', function(e) {
            mouse.x = e.x;
            mouse.y = e.y;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.1;
                this.baseX = this.x;
                this.baseY = this.y;
                this.density = (Math.random() * 30) + 1;
            }
            draw() {
                ctx.fillStyle = 'rgba(0, 242, 255, 0.4)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
            }
            update() {
                // 1. Mouse Interaction
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                let forceDirectionX = distance > 0 ? dx / distance : 0;
                let forceDirectionY = distance > 0 ? dy / distance : 0;
                let maxDistance = mouse.radius;
                let force = (maxDistance - distance) / maxDistance;
                let directionX = forceDirectionX * force * this.density;
                let directionY = forceDirectionY * force * this.density;

                // 2. Rocket Interaction
                let rDx = rocketRect.x - this.x;
                let rDy = rocketRect.y - this.y;
                let rDist = Math.sqrt(rDx * rDx + rDy * rDy);
                let rRadius = 150; // Interaction radius for rocket

                if (rDist > 0 && rDist < rRadius) {
                    const rForce = (rRadius - rDist) / rRadius;
                    const rDirX = rDx / rDist;
                    const rDirY = rDy / rDist;
                    // Push particles away (Engine/Body blast)
                    this.x -= rDirX * rForce * this.density * 5;
                    this.y -= rDirY * rForce * this.density * 5;
                }

                // 3. Comet Interaction
                let cDx = cometRect.x - this.x;
                let cDy = cometRect.y - this.y;
                let cDist = Math.sqrt(cDx * cDx + cDy * cDy);
                let cRadius = 200; // Interaction radius for comet

                if (cDist > 0 && cDist < cRadius) {
                    const cForce = (cRadius - cDist) / cRadius;
                    const cDirX = cDx / cDist;
                    const cDirY = cDy / cDist;
                    // Stronger push for high-speed comet
                    this.x -= cDirX * cForce * this.density * 8;
                    this.y -= cDirY * cForce * this.density * 8;
                }

                // Apply Mouse Force
                if (distance < mouse.radius) {
                    this.x -= directionX;
                    this.y -= directionY;
                } else {
                    // Return to base position logic
                    // We only return if NOT affected by rocket or comet to prevent jitter
                    if (rDist >= rRadius && cDist >= cRadius) {
                        if (this.x !== this.baseX) {
                            let dx = this.x - this.baseX;
                            this.x -= dx/10;
                        }
                        if (this.y !== this.baseY) {
                            let dy = this.y - this.baseY;
                            this.y -= dy/10;
                        }
                    }
                }
            }
        }

        function initParticles() {
            if (!canvas) return;
            particlesArray = [];
            let numberOfParticles = (canvas.height * canvas.width) / 10000;
            for (let i = 0; i < numberOfParticles; i++) {
                particlesArray.push(new Particle());
            }
        }

        function animateParticles() {
            if (!ctx || !particlesArray) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // --- Update Rocket Position Tracking ---
            const rocketEl = document.getElementById('rocket');
            if(rocketEl && rocketEl.style.opacity !== '0') {
                const rect = rocketEl.getBoundingClientRect();
                rocketRect.x = rect.left + rect.width / 2;
                rocketRect.y = rect.top + rect.height / 2;
            } else {
                rocketRect.x = -1000;
                rocketRect.y = -1000;
            }

            // --- Update Comet Position Tracking ---
            // Fix: Use cometActive flag because opacity is set to '0' immediately with CSS delay
            const cometEl = document.getElementById('comet');
            if(cometEl && cometActive) {
                const rect = cometEl.getBoundingClientRect();
                cometRect.x = rect.left + rect.width / 2;
                cometRect.y = rect.top + rect.height / 2;
            } else {
                cometRect.x = -1000;
                cometRect.y = -1000;
            }

            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].draw();
                particlesArray[i].update();
            }
            requestAnimationFrame(animateParticles);
        }
        if (!prefersReducedMotion) {
            initParticles();
            animateParticles();
        }

        window.addEventListener('resize', () => {
            if (!canvas || prefersReducedMotion) return;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        });

        // --- 3. Navbar & Scroll ---
        const nav = document.querySelector('nav');
        const progressBar = document.getElementById('scrollProgress');
        const backToTopBtn = document.getElementById('backToTop');

        backToTopBtn?.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        });

        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);

            // Progress Bar
            const scrollPercent = (scrollTop / docHeight) * 100;
            if (progressBar) progressBar.style.width = scrollPercent + "%";

            // Navbar
            if (scrollTop > 50) {
                nav?.classList.add('scrolled');
                backToTopBtn?.classList.add('visible');
            } else {
                nav?.classList.remove('scrolled');
                backToTopBtn?.classList.remove('visible');
            }
            updateActiveNavFromPosition(scrollTop);
        });

        const sectionNavLinks = Array.from(document.querySelectorAll('.nav-link[href^="#"]'));
        const navSections = sectionNavLinks
            .map(link => document.querySelector(link.getAttribute('href')))
            .filter(Boolean);

        function setActiveNav(sectionId) {
            sectionNavLinks.forEach(link => {
                const isActive = link.getAttribute('href') === `#${sectionId}`;
                link.classList.toggle('active', isActive);
                if (isActive) {
                    link.setAttribute('aria-current', 'page');
                } else {
                    link.removeAttribute('aria-current');
                }
            });
        }

        function updateActiveNavFromPosition(scrollTop = window.scrollY) {
            if (!navSections.length) return;
            const offset = scrollTop + Math.min(window.innerHeight * 0.38, 280);
            const currentSection = navSections.reduce((current, section) => {
                return section.offsetTop <= offset ? section : current;
            }, navSections[0]);

            if (currentSection?.id) {
                setActiveNav(currentSection.id);
            }
        }

        if (navSections.length) {
            updateActiveNavFromPosition();
        }

        // --- 4. Scroll Reveal & Counter Animation ---
        const observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    const title = entry.target.querySelector('.section-title');
                    if(title) title.classList.add('visible');

                    // Trigger Counter Animation if it's a stat number
                    if (entry.target.classList.contains('stat-number') || entry.target.querySelector('.stat-number')) {
                        const numbers = entry.target.classList.contains('stat-number') ? [entry.target] : entry.target.querySelectorAll('.stat-number');
                        numbers.forEach(num => animateCounter(num));
                    }

                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.animate-item').forEach(el => observer.observe(el));
        // Add stats-specific observation
        document.querySelectorAll('.stat-number').forEach(el => observer.observe(el));

        function animateCounter(el) {
            // Prevent running multiple times
            if(el.dataset.animated) return;
            el.dataset.animated = "true";

            // Parse suffix
            let rawCount = el.getAttribute('data-count');
            let suffix = '';
            if (el.innerText.includes('%')) suffix = '%';
            if (el.innerText.includes('/')) suffix = el.innerText.substring(el.innerText.indexOf('/'));
            if (el.innerText.includes('+')) suffix = '+';

            const target = parseInt(rawCount);
            const duration = 2000;
            const step = Math.ceil(target / (duration / 16));
            let current = 0;

            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                el.innerText = current + suffix;
            }, 16);
        }

        // --- 5. Spotlight Card Effect ---
        document.querySelectorAll('.spotlight-card').forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        });

        // --- 6. Mobile Menu ---
        const mobileBtn = document.getElementById('mobileMenuBtn');
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileIcon = mobileBtn.querySelector('i');
        const mobileLinks = mobileMenu.querySelectorAll('a');

        function toggleMobileMenu() {
            const isHidden = mobileMenu.classList.contains('hidden');

            if (isHidden) {
                mobileMenu.classList.remove('hidden');
                mobileMenu.classList.add('mobile-menu-animate');
                mobileIcon.classList.remove('fa-bars');
                mobileIcon.classList.add('fa-times');
                mobileBtn.setAttribute('aria-expanded', 'true');
                mobileBtn.setAttribute('aria-label', 'Close navigation menu');
            } else {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('mobile-menu-animate');
                mobileIcon.classList.remove('fa-times');
                mobileIcon.classList.add('fa-bars');
                mobileBtn.setAttribute('aria-expanded', 'false');
                mobileBtn.setAttribute('aria-label', 'Open navigation menu');
            }
        }

        mobileBtn.addEventListener('click', toggleMobileMenu);

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (!mobileMenu.classList.contains('hidden')) {
                    toggleMobileMenu();
                }
            });
        });

        // --- 6.5 Command Palette ---
        const commandPalette = document.getElementById('commandPalette');
        const commandPaletteBtn = document.getElementById('commandPaletteBtn');
        const mobileCommandPaletteBtn = document.getElementById('mobileCommandPaletteBtn');
        const commandPaletteClose = document.getElementById('commandPaletteClose');
        const commandPaletteInput = document.getElementById('commandPaletteInput');
        const commandPaletteResults = document.getElementById('commandPaletteResults');
        const commandPaletteEmpty = document.getElementById('commandPaletteEmpty');
        const commandPaletteStatus = document.getElementById('commandPaletteStatus');
        let commandActiveIndex = -1;
        let filteredCommands = [];

        function scrollToSection(selector) {
            const target = document.querySelector(selector);
            if (!target) return;
            target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
        }

        function focusAfterScroll(selector, delay = 650) {
            setTimeout(() => document.querySelector(selector)?.focus({ preventScroll: true }), prefersReducedMotion ? 0 : delay);
        }

        function openServiceDetail(service) {
            const button = document.querySelector(`.service-detail-btn[data-service="${service}"]`);
            if (button) {
                button.click();
                return;
            }
            scrollToSection('#services');
        }

        function filterPortfolio(category) {
            scrollToSection('#portfolio');
            setTimeout(() => document.querySelector(`.portfolio-filter[data-filter="${category}"]`)?.click(), prefersReducedMotion ? 0 : 450);
        }

        const commandActions = [
            { label: 'Talk to Pukka AI', meta: 'Open the branded project assistant', icon: 'fa-robot', keywords: 'pukka ai bot chatbot assistant chat help ask question', shortcut: 'AI', run: () => window.openPukkaAiChat?.() },
            { label: 'Explore services', meta: 'Jump to web, AI, cloud, design, security, strategy', icon: 'fa-layer-group', keywords: 'services software ai cloud design security strategy capabilities', shortcut: 'Go', run: () => scrollToSection('#services') },
            { label: 'Start a project', meta: 'Open the brief area and focus the first field', icon: 'fa-paper-plane', keywords: 'contact project form quote brief hire consultation estimate start', shortcut: 'Brief', run: () => { scrollToSection('#contact'); focusAfterScroll('#projectName'); } },
            { label: 'Open AI service', meta: 'View AI automation and chatbot details', icon: 'fa-robot', keywords: 'ai automation machine learning llm chatbot openai service', shortcut: 'AI', run: () => openServiceDetail('ai') },
            { label: 'Open software service', meta: 'View web and mobile development details', icon: 'fa-laptop-code', keywords: 'software web mobile app development pwa website service', shortcut: 'Web', run: () => openServiceDetail('software') },
            { label: 'View portfolio', meta: 'Jump to selected builds and project cases', icon: 'fa-briefcase', keywords: 'portfolio work showcase case studies projects selected builds examples', shortcut: 'Work', run: () => scrollToSection('#portfolio') },
            { label: 'Show AI builds', meta: 'Jump to portfolio and filter AI projects', icon: 'fa-brain', keywords: 'portfolio ai artificial intelligence automation builds examples', shortcut: 'Filter', run: () => filterPortfolio('ai') },
            { label: 'Read insights', meta: 'Open strategy articles and no-duff resources', icon: 'fa-lightbulb', keywords: 'insights blog checklist mvp no duff resources articles', shortcut: 'Read', run: () => scrollToSection('#insights') },
            { label: 'Download checklist', meta: 'Save the no-duff project planning checklist', icon: 'fa-list-check', keywords: 'download checklist requirements scope mvp planning no duff', shortcut: 'TXT', run: () => downloadNoDuffChecklist() },
            { label: 'Call or WhatsApp', meta: 'Open contact options for phone and WhatsApp', icon: 'fa-comments', keywords: 'phone whatsapp call contact talk human person', shortcut: 'Chat', run: () => window.openContactModal ? window.openContactModal() : scrollToSection('#contact') },
            { label: 'View Global HQ', meta: 'Open the Mombasa map modal', icon: 'fa-map-marker-alt', keywords: 'map location mombasa hq office address where', shortcut: 'Map', run: () => window.openMapModal ? window.openMapModal() : scrollToSection('#contact') },
            { label: 'Open FAQs', meta: 'See pricing, ownership, support, and launch answers', icon: 'fa-question-circle', keywords: 'faq questions pricing support ownership maintenance source code', shortcut: 'FAQ', run: () => document.getElementById('viewAllFaqsBtn')?.click() },
            { label: 'Meet the team', meta: 'Jump to founders, roles, and delivery team', icon: 'fa-users', keywords: 'team people strategists designers engineers founders', shortcut: 'Team', run: () => scrollToSection('#team') }
        ];

        commandPaletteInput?.setAttribute('aria-controls', 'commandPaletteResults');
        commandPaletteInput?.setAttribute('aria-autocomplete', 'list');

        function setCommandStatus(message) {
            if (commandPaletteStatus) commandPaletteStatus.textContent = message;
        }

        function getCommandButtons() {
            return Array.from(commandPaletteResults?.querySelectorAll('.command-result') || []);
        }

        function setActiveCommandIndex(index, shouldScroll = true) {
            const buttons = getCommandButtons();
            commandActiveIndex = filteredCommands.length ? Math.max(0, Math.min(index, filteredCommands.length - 1)) : -1;

            buttons.forEach((button, buttonIndex) => {
                const isActive = buttonIndex === commandActiveIndex;
                button.classList.toggle('active', isActive);
                button.setAttribute('aria-selected', String(isActive));
                button.tabIndex = isActive ? 0 : -1;
            });

            const activeButton = buttons[commandActiveIndex];
            if (activeButton) {
                commandPaletteInput?.setAttribute('aria-activedescendant', activeButton.id);
                if (shouldScroll) activeButton.scrollIntoView({ block: 'nearest' });
            } else {
                commandPaletteInput?.removeAttribute('aria-activedescendant');
            }
        }

        function renderCommandResults() {
            if (!commandPaletteResults) return;
            const query = commandPaletteInput?.value.trim().toLowerCase() || '';
            const queryTokens = query.split(/\s+/).filter(Boolean);
            filteredCommands = commandActions.filter(action => {
                const haystack = `${action.label} ${action.meta} ${action.keywords}`.toLowerCase();
                return !queryTokens.length || queryTokens.every(token => haystack.includes(token));
            });

            commandActiveIndex = filteredCommands.length ? Math.max(0, Math.min(commandActiveIndex, filteredCommands.length - 1)) : -1;
            commandPaletteResults.innerHTML = '';
            commandPaletteEmpty?.classList.toggle('hidden', filteredCommands.length > 0);
            setCommandStatus(filteredCommands.length ? `${filteredCommands.length} action${filteredCommands.length === 1 ? '' : 's'} ready. Enter runs the selected action.` : 'No matching actions. Try services, AI, pricing, contact, or checklist.');

            filteredCommands.forEach((action, index) => {
                const button = document.createElement('button');
                button.type = 'button';
                button.id = `command-result-${index}`;
                button.className = 'command-result w-full text-left p-4 rounded-2xl border border-white/10 bg-white/[0.03] transition-all flex items-center gap-4';
                button.setAttribute('role', 'option');
                button.setAttribute('aria-selected', 'false');

                const iconWrap = document.createElement('span');
                iconWrap.className = 'command-result-icon w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0';
                const icon = document.createElement('i');
                icon.className = `fas ${action.icon}`;
                icon.setAttribute('aria-hidden', 'true');
                iconWrap.appendChild(icon);

                const copy = document.createElement('span');
                copy.className = 'command-result-copy min-w-0';
                const label = document.createElement('span');
                label.className = 'block text-sm font-bold text-white';
                label.textContent = action.label;
                const meta = document.createElement('span');
                meta.className = 'block text-xs text-gray-500 truncate';
                meta.textContent = action.meta;
                copy.append(label, meta);

                const shortcut = document.createElement('span');
                shortcut.className = 'command-result-kbd';
                shortcut.textContent = action.shortcut || 'Enter';

                button.append(iconWrap, copy, shortcut);
                button.addEventListener('mouseenter', () => setActiveCommandIndex(index, false));
                button.addEventListener('focus', () => setActiveCommandIndex(index, false));
                button.addEventListener('click', () => runCommand(index));
                commandPaletteResults.appendChild(button);
            });

            setActiveCommandIndex(commandActiveIndex, false);
        }

        function openCommandPalette() {
            if (!commandPalette) return;
            openModal(commandPalette, commandPaletteInput);
            commandPaletteBtn?.setAttribute('aria-expanded', 'true');
            mobileCommandPaletteBtn?.setAttribute('aria-expanded', 'true');
            commandActiveIndex = 0;
            if (commandPaletteInput) commandPaletteInput.value = '';
            renderCommandResults();
            const focusSearch = () => {
                if (!commandPalette?.classList.contains('active')) return;
                commandPaletteInput?.focus({ preventScroll: true });
                commandPaletteInput?.select();
            };
            focusSearch();
            requestAnimationFrame(focusSearch);
            setTimeout(focusSearch, 120);
        }

        function closeCommandPalette(restoreFocus = true) {
            closeModal(commandPalette, restoreFocus);
            commandPaletteBtn?.setAttribute('aria-expanded', 'false');
            mobileCommandPaletteBtn?.setAttribute('aria-expanded', 'false');
            commandPaletteInput?.removeAttribute('aria-activedescendant');
        }

        function runCommand(index = commandActiveIndex) {
            const action = filteredCommands[index >= 0 ? index : 0];
            if (!action) return;
            closeCommandPalette(false);
            setTimeout(() => {
                try {
                    action.run();
                } catch (error) {
                    console.error('Quick action failed:', error);
                    openCommandPalette();
                    setCommandStatus('That action could not run. Try another quick action.');
                }
            }, prefersReducedMotion ? 0 : 100);
        }

        commandPaletteBtn?.addEventListener('click', openCommandPalette);
        mobileCommandPaletteBtn?.addEventListener('click', () => {
            if (!mobileMenu.classList.contains('hidden')) toggleMobileMenu();
            requestAnimationFrame(openCommandPalette);
        });
        commandPaletteClose?.addEventListener('click', () => closeCommandPalette());
        commandPalette?.addEventListener('click', (e) => {
            if (e.target === commandPalette) closeCommandPalette();
        });
        commandPaletteInput?.addEventListener('input', () => {
            commandActiveIndex = 0;
            renderCommandResults();
        });
        commandPalette?.addEventListener('keydown', (e) => {
            if (!commandPalette.classList.contains('active')) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (filteredCommands.length) setActiveCommandIndex(commandActiveIndex + 1);
            }

            if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (filteredCommands.length) setActiveCommandIndex(commandActiveIndex - 1);
            }

            if (e.key === 'Home') {
                e.preventDefault();
                if (filteredCommands.length) setActiveCommandIndex(0);
            }

            if (e.key === 'End') {
                e.preventDefault();
                if (filteredCommands.length) setActiveCommandIndex(filteredCommands.length - 1);
            }

            if (e.key === 'Enter') {
                e.preventDefault();
                runCommand();
            }

            if (e.key === 'Escape') {
                e.preventDefault();
                closeCommandPalette();
            }
        });
        document.addEventListener('keydown', (e) => {
            const commandKeyPressed = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k';
            if (commandKeyPressed) {
                e.preventDefault();
                commandPalette?.classList.contains('active') ? closeCommandPalette() : openCommandPalette();
            } else if (e.key === 'Escape' && commandPalette?.classList.contains('active')) {
                closeCommandPalette();
            } else if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
                toggleMobileMenu();
            }
        });

        // --- 6.75 Pukka AI Chat Assistant ---
        function initPukkaAiChat() {
            const widget = document.getElementById('pukkaAiWidget');
            const panel = document.getElementById('pukkaAiPanel');
            const toggle = document.getElementById('pukkaAiToggle');
            const close = document.getElementById('pukkaAiClose');
            const messages = document.getElementById('pukkaAiMessages');
            const input = document.getElementById('pukkaAiInput');
            const send = document.getElementById('pukkaAiSend');
            const statusText = document.getElementById('pukkaAiStatusText');
            const quickPrompts = document.querySelectorAll('[data-ai-prompt]');
            if (!widget || !panel || !toggle || !messages || !input || !send) return;

            const aiState = {
                open: false,
                greeted: false,
                typing: false,
                messageCount: 0
            };

            const aiActions = {
                services: { label: 'Explore services', icon: 'fa-layer-group', action: 'services' },
                aiService: { label: 'AI service', icon: 'fa-robot', action: 'aiService' },
                portfolio: { label: 'View portfolio', icon: 'fa-briefcase', action: 'portfolio' },
                portfolioAi: { label: 'AI builds', icon: 'fa-brain', action: 'portfolioAi' },
                form: { label: 'Start brief', icon: 'fa-paper-plane', action: 'form' },
                contact: { label: 'Talk to team', icon: 'fa-comments', action: 'contact' },
                whatsapp: { label: 'WhatsApp', icon: 'fa-brands fa-whatsapp', action: 'whatsapp' },
                call: { label: 'Call', icon: 'fa-phone', action: 'call' },
                checklist: { label: 'Checklist', icon: 'fa-list-check', action: 'checklist' },
                map: { label: 'Open map', icon: 'fa-map-marker-alt', action: 'map' },
                faq: { label: 'FAQs', icon: 'fa-question-circle', action: 'faq' }
            };

            function setChatOpen(isOpen, focusInput = true) {
                if (isOpen && commandPalette?.classList.contains('active')) {
                    closeCommandPalette(false);
                }
                if (isOpen && mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    toggleMobileMenu();
                }

                aiState.open = isOpen;
                widget.dataset.state = isOpen ? 'open' : 'closed';
                panel.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
                toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
                toggle.setAttribute('aria-label', isOpen ? 'Close Pukka AI chat' : 'Open Pukka AI chat');

                if (isOpen) {
                    if (!aiState.greeted) {
                        aiState.greeted = true;
                        appendMessage('bot', 'Salaam - I am Pukka AI. Tell me what you want to build, or pick a quick prompt and I will route you to the cleanest next step.', [
                            aiActions.services,
                            aiActions.aiService,
                            aiActions.form,
                            aiActions.contact
                        ]);
                    }
                    requestAnimationFrame(() => {
                        scrollMessages();
                        if (focusInput) focusChatInput();
                    });
                    if (focusInput) setTimeout(focusChatInput, prefersReducedMotion ? 0 : 180);
                } else if (focusInput) {
                    toggle.focus({ preventScroll: true });
                }
            }

            function shouldAutoFocusInput() {
                return window.innerWidth >= 768 && window.innerHeight >= 600;
            }

            function focusChatInput() {
                if (!aiState.open || !shouldAutoFocusInput()) return;
                toggle.blur();
                try {
                    input.focus({ preventScroll: true });
                } catch (error) {
                    input.focus();
                }
                if (document.activeElement !== input) {
                    setTimeout(() => input.focus(), 0);
                }
            }

            function scrollMessages() {
                requestAnimationFrame(() => {
                    messages.scrollTop = messages.scrollHeight;
                });
            }

            function updateSendState() {
                send.disabled = !input.value.trim() || aiState.typing;
            }

            function setAiBusy(isBusy) {
                aiState.typing = isBusy;
                widget.dataset.busy = String(isBusy);
                panel.setAttribute('aria-busy', String(isBusy));
                if (statusText) statusText.textContent = isBusy ? 'Thinking' : 'Ready';
                quickPrompts.forEach(button => {
                    button.disabled = isBusy;
                });
                updateSendState();
            }

            function resizeInput() {
                const maxHeight = window.matchMedia('(max-height: 640px)').matches ? 86 : 128;
                input.style.height = 'auto';
                input.style.height = `${Math.min(input.scrollHeight, maxHeight)}px`;
            }

            function getMessageTime() {
                return new Intl.DateTimeFormat([], { hour: '2-digit', minute: '2-digit' }).format(new Date());
            }

            function appendMessage(author, text, actions = []) {
                const item = document.createElement('div');
                item.className = `pukka-ai-message pukka-ai-message-${author}`;
                item.dataset.messageIndex = String(++aiState.messageCount);

                const avatar = document.createElement('div');
                avatar.className = 'pukka-ai-message-avatar';
                avatar.setAttribute('aria-hidden', 'true');
                if (author === 'user') {
                    const avatarIcon = document.createElement('i');
                    avatarIcon.className = 'fas fa-user';
                    avatar.appendChild(avatarIcon);
                } else {
                    const avatarImage = document.createElement('img');
                    avatarImage.src = 'pukka-gen-favicon.png';
                    avatarImage.alt = '';
                    avatarImage.className = 'pukka-ai-mark';
                    avatarImage.loading = 'lazy';
                    avatarImage.decoding = 'async';
                    avatar.appendChild(avatarImage);
                }

                const bubble = document.createElement('div');
                bubble.className = 'pukka-ai-bubble';
                const messageText = document.createElement('div');
                messageText.textContent = text;
                bubble.appendChild(messageText);

                const timestamp = document.createElement('span');
                timestamp.className = 'pukka-ai-message-time';
                timestamp.textContent = getMessageTime();
                bubble.appendChild(timestamp);

                if (actions.length) {
                    const actionsWrap = document.createElement('div');
                    actionsWrap.className = 'pukka-ai-actions';
                    actions.forEach(action => {
                        const button = document.createElement('button');
                        button.type = 'button';
                        button.className = 'pukka-ai-action';
                        button.dataset.aiAction = action.action;
                        button.setAttribute('aria-label', action.label);

                        const icon = document.createElement('i');
                        icon.className = action.icon.startsWith('fa-brands') ? action.icon : `fas ${action.icon}`;
                        icon.setAttribute('aria-hidden', 'true');

                        const label = document.createElement('span');
                        label.textContent = action.label;

                        button.append(icon, label);
                        actionsWrap.appendChild(button);
                    });
                    bubble.appendChild(actionsWrap);
                }

                item.append(avatar, bubble);
                messages.appendChild(item);
                scrollMessages();
                return item;
            }

            function showTyping() {
                const item = document.createElement('div');
                item.className = 'pukka-ai-message pukka-ai-message-bot';
                item.dataset.typing = 'true';

                const avatar = document.createElement('div');
                avatar.className = 'pukka-ai-message-avatar';
                avatar.setAttribute('aria-hidden', 'true');
                const icon = document.createElement('img');
                icon.src = 'pukka-gen-favicon.png';
                icon.alt = '';
                icon.className = 'pukka-ai-mark';
                icon.loading = 'lazy';
                icon.decoding = 'async';
                avatar.appendChild(icon);

                const typing = document.createElement('div');
                typing.className = 'pukka-ai-typing';
                typing.setAttribute('aria-label', 'Pukka AI is typing');
                typing.innerHTML = '<span></span><span></span><span></span>';

                item.append(avatar, typing);
                messages.appendChild(item);
                scrollMessages();
                return item;
            }

            function hasAny(text, words) {
                return words.some(word => text.includes(word));
            }

            function getBotReply(rawMessage) {
                const text = rawMessage.toLowerCase();

                if (/^(hi|hello|hey|jambo|salaam|salam|yo|sup)\b/.test(text)) {
                    return {
                        text: 'Hey — good to see you. I can help you pick the right service, estimate the first step, or route you straight to the team.',
                        actions: [aiActions.services, aiActions.form, aiActions.contact]
                    };
                }

                if (hasAny(text, ['human', 'person', 'call', 'phone', 'whatsapp', 'talk', 'contact', 'reach you', 'email'])) {
                    return {
                        text: 'No duff - fastest route is WhatsApp or a direct call. If you prefer structure, the project brief form prepares an email with the right details.',
                        actions: [aiActions.contact, aiActions.whatsapp, aiActions.call, aiActions.form]
                    };
                }

                if (hasAny(text, ['start', 'brief', 'quote', 'proposal', 'hire', 'consultation', 'estimate', 'book', 'meeting'])) {
                    return {
                        text: 'To start well, share the problem, target users, must-have features, timeline, and budget range. The form on this page turns that into a clean email brief.',
                        actions: [aiActions.form, aiActions.checklist, aiActions.contact]
                    };
                }

                if (hasAny(text, ['price', 'pricing', 'cost', 'budget', 'rate', 'fee', 'fees', 'expensive', 'cheap'])) {
                    return {
                        text: 'Pricing depends on scope and risk. Clear, fixed scopes can be quoted as fixed-price work; evolving builds usually fit a time-and-materials model. The no-duff move: start with discovery if the scope is still blurry.',
                        actions: [aiActions.form, aiActions.checklist, aiActions.faq]
                    };
                }

                if (hasAny(text, ['ai', 'automation', 'chatbot', 'bot', 'openai', 'llm', 'machine learning', 'predictive', 'nlp'])) {
                    return {
                        text: 'Pukka Gen can build practical AI: chat assistants, internal copilots, workflow automation, RAG/search tools, triage systems, and analytics. Best first step is choosing one high-value workflow with measurable quality checks.',
                        actions: [aiActions.aiService, aiActions.portfolioAi, aiActions.form]
                    };
                }

                if (hasAny(text, ['service', 'services', 'offer', 'offers', 'capability', 'capabilities', 'do you do', 'what do you do'])) {
                    return {
                        text: 'Core services: web and mobile apps, AI automation, cloud/DevOps, product design, cybersecurity, and strategy. The site cards explain each path in more detail.',
                        actions: [aiActions.services, aiActions.aiService, aiActions.form]
                    };
                }

                if (hasAny(text, ['web', 'website', 'mobile', 'app', 'pwa', 'responsive', 'ios', 'android'])) {
                    return {
                        text: 'For most launches, a fast responsive web app or PWA is the lean first move. Native iOS/Android makes sense when you need device-heavy features, app-store distribution, or deep offline behavior.',
                        actions: [aiActions.services, aiActions.form, aiActions.checklist]
                    };
                }

                if (hasAny(text, ['portfolio', 'case study', 'case studies', 'projects', 'work', 'builds', 'examples', 'show me'])) {
                    return {
                        text: 'You can review selected builds in the portfolio section. I can also filter straight to the AI-heavy examples.',
                        actions: [aiActions.portfolio, aiActions.portfolioAi]
                    };
                }

                if (hasAny(text, ['cloud', 'devops', 'security', 'secure', 'cyber', 'audit', 'compliance', 'infrastructure'])) {
                    return {
                        text: 'For high-stakes systems, Pukka Gen looks at architecture, CI/CD, hosting, observability, security posture, and recovery plans — not just the pretty UI.',
                        actions: [aiActions.services, aiActions.form, aiActions.faq]
                    };
                }

                if (hasAny(text, ['timeline', 'how long', 'duration', 'deadline', 'schedule', 'launch'])) {
                    return {
                        text: 'A focused landing page can be quick; a serious app needs discovery, design, build, testing, and launch hardening. Share the must-have first release and deadline so the team can size it honestly.',
                        actions: [aiActions.form, aiActions.checklist]
                    };
                }

                if (hasAny(text, ['checklist', 'download', 'requirements', 'scope', 'mvp'])) {
                    return {
                        text: 'The no-duff checklist helps you pressure-test scope before spending serious money. If more than three answers are unclear, discovery should come before build.',
                        actions: [aiActions.checklist, aiActions.form]
                    };
                }

                if (hasAny(text, ['location', 'map', 'office', 'hq', 'mombasa', 'where'])) {
                    return {
                        text: 'Pukka Gen is listed with a Mombasa, Kenya HQ. You can open the embedded map or launch Google Maps directly.',
                        actions: [aiActions.map, aiActions.contact]
                    };
                }

                if (hasAny(text, ['faq', 'question', 'support', 'maintenance', 'ownership', 'ip', 'source code', 'after launch'])) {
                    return {
                        text: 'The FAQs cover pricing, ownership, support, and launch expectations. Short answer: clarify IP, maintenance, hosting, and acceptance criteria before build begins.',
                        actions: [aiActions.faq, aiActions.form]
                    };
                }

                if (hasAny(text, ['thanks', 'thank you', 'asante', 'nice', 'cool'])) {
                    return {
                        text: 'Anytime. I am here in the corner if another project question pops up.',
                        actions: [aiActions.form, aiActions.contact]
                    };
                }

                return {
                    text: 'I can help with services, AI automation, pricing, timelines, portfolio examples, scope checklists, and contacting the team. Give me a little context about what you want to build and I’ll point you to the cleanest next step.',
                    actions: [aiActions.services, aiActions.form, aiActions.contact]
                };
            }

            function handleOutgoingMessage(value) {
                const message = String(value || input.value || '').trim();
                if (!message || aiState.typing) return;

                appendMessage('user', message);
                input.value = '';
                resizeInput();
                setAiBusy(true);

                const typing = showTyping();
                const delay = prefersReducedMotion ? 0 : Math.min(900, 360 + message.length * 12);

                setTimeout(() => {
                    if (typing.isConnected) typing.remove();
                    const reply = getBotReply(message);
                    appendMessage('bot', reply.text, reply.actions);
                    setAiBusy(false);
                    if (aiState.open) input.focus({ preventScroll: true });
                }, delay);
            }

            function runAiAction(action, trigger) {
                if (!action) return;
                if (trigger) {
                    trigger.disabled = true;
                    trigger.setAttribute('aria-busy', 'true');
                }

                const closeAndRun = (callback) => {
                    setChatOpen(false, false);
                    setTimeout(callback, prefersReducedMotion ? 0 : 120);
                };

                switch (action) {
                    case 'services':
                        closeAndRun(() => scrollToSection('#services'));
                        break;
                    case 'aiService':
                        closeAndRun(() => document.querySelector('.service-detail-btn[data-service="ai"]')?.click());
                        break;
                    case 'portfolio':
                        closeAndRun(() => scrollToSection('#portfolio'));
                        break;
                    case 'portfolioAi':
                        closeAndRun(() => {
                            scrollToSection('#portfolio');
                            setTimeout(() => document.querySelector('.portfolio-filter[data-filter="ai"]')?.click(), prefersReducedMotion ? 0 : 450);
                        });
                        break;
                    case 'form':
                        closeAndRun(() => {
                            scrollToSection('#contact');
                            setTimeout(() => document.getElementById('projectName')?.focus({ preventScroll: true }), prefersReducedMotion ? 0 : 700);
                        });
                        break;
                    case 'contact':
                        closeAndRun(() => {
                            if (typeof window.openContactModal === 'function') {
                                window.openContactModal();
                            } else {
                                scrollToSection('#contact');
                            }
                        });
                        break;
                    case 'whatsapp':
                        window.open('https://wa.me/254757885101', '_blank', 'noopener,noreferrer');
                        break;
                    case 'call':
                        window.location.href = 'tel:+254757885101';
                        break;
                    case 'checklist':
                        downloadNoDuffChecklist();
                        appendMessage('bot', 'Checklist fired up. If your browser asks, allow the download - it is a plain text planning checklist.', [aiActions.form]);
                        break;
                    case 'map':
                        closeAndRun(() => {
                            if (typeof window.openMapModal === 'function') window.openMapModal();
                        });
                        break;
                    case 'faq':
                        closeAndRun(() => document.getElementById('viewAllFaqsBtn')?.click());
                        break;
                }

                if (trigger) {
                    setTimeout(() => {
                        trigger.disabled = false;
                        trigger.removeAttribute('aria-busy');
                    }, prefersReducedMotion ? 0 : 450);
                }
            }

            window.openPukkaAiChat = function(initialPrompt) {
                setChatOpen(true);
                if (initialPrompt) {
                    setTimeout(() => handleOutgoingMessage(initialPrompt), prefersReducedMotion ? 0 : 180);
                }
            };
            window.closePukkaAiChat = () => setChatOpen(false);

            toggle.addEventListener('click', () => setChatOpen(!aiState.open));
            close?.addEventListener('click', () => setChatOpen(false));
            send.addEventListener('click', () => handleOutgoingMessage());
            input.addEventListener('input', () => {
                resizeInput();
                updateSendState();
            });
            input.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    handleOutgoingMessage();
                }
                if (event.key === 'Escape') {
                    event.preventDefault();
                    setChatOpen(false);
                }
            });
            quickPrompts.forEach(button => {
                button.addEventListener('click', () => {
                    quickPrompts.forEach(prompt => prompt.classList.remove('is-active'));
                    button.classList.add('is-active');
                    handleOutgoingMessage(button.dataset.aiPrompt);
                    setTimeout(() => button.classList.remove('is-active'), prefersReducedMotion ? 0 : 700);
                });
            });
            messages.addEventListener('click', (event) => {
                const actionButton = event.target.closest('[data-ai-action]');
                if (actionButton) runAiAction(actionButton.dataset.aiAction, actionButton);
            });
            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape' && aiState.open && !document.querySelector('.service-modal.active')) {
                    setChatOpen(false);
                }
            });

            const handleViewportChange = () => {
                if (!aiState.open) return;
                resizeInput();
                scrollMessages();
            };
            window.addEventListener('resize', handleViewportChange);
            window.visualViewport?.addEventListener('resize', handleViewportChange);

            resizeInput();
            updateSendState();
        }

        initPukkaAiChat();

        // --- 7. Modal System ---
        const serviceDetails = {
            software: {
                title: "Web & Mobile App Development",
                icon: "fas fa-laptop-code",
                description: "Pukka Gen designs and develops high-performance web and mobile solutions powered by advanced technologies and industry-standard methods. From concept to deployment, we ensure your digital presence is high-performance, scalable, and user-centric.",
                features: [
                    "Responsive Web Design & Development",
                    "Cross-Platform Mobile Apps (iOS & Android)",
                    "Progressive Web Apps (PWA) Implementation",
                    "Single Page Applications (SPA) Architecture",
                    "Performance Optimization & Best Practices",
                    "Modern UI/UX Integration"
                ],
                technologies: [
                    { name: "React", icon: "devicon-react-original" },
                    { name: "Angular", icon: "devicon-angular-plain" },
                    { name: "Vue.js", icon: "devicon-vuejs-plain" },
                    { name: "Flutter", icon: "devicon-flutter-plain" },
                    { name: "Node.js", icon: "devicon-nodejs-plain" },
                    { name: "Python", icon: "devicon-python-plain" },
                    { name: ".NET", icon: "devicon-dot-net-plain" },
                    { name: "Java", icon: "devicon-java-plain" }
                ]
            },
            ai: {
                title: "AI & Automation Solutions",
                icon: "fas fa-robot",
                description: "Transform your business with intelligent automation and AI-powered solutions that enhance decision-making and operational efficiency.",
                features: [
                    "Generative AI integration (LLMs, GPT models)",
                    "Predictive analytics and business intelligence",
                    "Robotic Process Automation (RPA)",
                    "Custom machine learning models",
                    "Natural Language Processing (NLP)"
                ],
                technologies: [
                    { name: "TensorFlow", icon: "devicon-tensorflow-original" },
                    { name: "PyTorch", icon: "devicon-pytorch-plain" },
                    { name: "Python", icon: "devicon-python-plain" },
                    { name: "OpenAI", icon: "fas fa-brain" },
                    { name: "Azure AI", icon: "devicon-azure-plain" }
                ]
            },
            cloud: {
                title: "Cloud Strategy & DevOps",
                icon: "fas fa-cloud",
                description: "Build resilient, scalable infrastructure with comprehensive cloud strategies and DevOps practices that accelerate delivery.",
                features: [
                    "Multi-cloud strategy and migration",
                    "CI/CD pipeline design and implementation",
                    "Container orchestration with Kubernetes",
                    "Infrastructure as Code (IaC)",
                    "Site Reliability Engineering (SRE)"
                ],
                technologies: [
                    { name: "AWS", icon: "devicon-amazonwebservices-plain" },
                    { name: "Azure", icon: "devicon-azure-plain" },
                    { name: "Google Cloud", icon: "devicon-googlecloud-plain" },
                    { name: "Docker", icon: "devicon-docker-plain" },
                    { name: "Kubernetes", icon: "devicon-kubernetes-plain" }
                ]
            },
            design: {
                title: "Product Design (UI/UX)",
                icon: "fas fa-palette",
                description: "Create exceptional user experiences with human-centered design that balances aesthetics with functionality.",
                features: [
                    "User research and persona development",
                    "Wireframing and interactive prototyping",
                    "UI/UX design systems",
                    "Accessibility compliance (WCAG)",
                    "Usability testing"
                ],
                technologies: [
                    { name: "Figma", icon: "devicon-figma-plain" },
                    { name: "Adobe XD", icon: "devicon-adobexd-plain" },
                    { name: "Sketch", icon: "devicon-sketch-line" }
                ]
            },
            security: {
                title: "QA & Cybersecurity",
                icon: "fas fa-shield-alt",
                description: "Protect your digital assets with comprehensive quality assurance and security measures that build trust and ensure compliance.",
                features: [
                    "Automated testing frameworks",
                    "Security audits and penetration testing",
                    "Compliance management (GDPR, HIPAA)",
                    "Vulnerability assessment",
                    "DevSecOps integration"
                ],
                technologies: [
                    { name: "Selenium", icon: "devicon-selenium-original" },
                    { name: "Cypress", icon: "devicon-cypressio-plain" },
                    { name: "SonarQube", icon: "devicon-sonarqube-plain" },
                    { name: "JIRA", icon: "devicon-jira-plain" }
                ]
            },
            consultancy: {
                title: "Software Consultancy & Strategy",
                icon: "fas fa-compass",
                description: "Strategic advice to help you make informed technology decisions, optimize processes, and scale your business effectively.",
                features: [
                    "Digital Transformation Strategy",
                    "Tech Stack Selection & Code Audits",
                    "Scalability & Architecture Roadmaps",
                    "Legacy System Modernization Plans",
                    "Technical Team Leadership (CTOaaS)"
                ],
                technologies: [
                    { name: "Jira", icon: "devicon-jira-plain" },
                    { name: "Miro", icon: "fas fa-project-diagram" },
                    { name: "Slack", icon: "devicon-slack-plain" },
                    { name: "Confluence", icon: "fas fa-file-alt" },
                    { name: "AWS Arch", icon: "devicon-amazonwebservices-plain-wordmark" }
                ]
            }
        };

        // --- 7.5 Tech Details Data (New) ---
        const techDetails = {
            react: {
                title: "React",
                icon: "devicon-react-original colored",
                description: "A declarative, efficient, and flexible JavaScript library for building user interfaces, developed by Facebook.",
                uses: ["Single-Page Applications (SPAs)", "Complex Interactive Dashboards", "Social Media Platforms", "Cross-platform Mobile Apps (React Native)"]
            },
            angular: {
                title: "Angular",
                icon: "devicon-angular-plain colored",
                description: "A platform and framework for building single-page client applications using HTML and TypeScript, developed by Google.",
                uses: ["Enterprise Web Applications", "Dynamic Content Websites", "Progressive Web Apps (PWAs)", "Large-scale Business Logic Apps"]
            },
            vue: {
                title: "Vue.js",
                icon: "devicon-vuejs-plain colored",
                description: "A progressive JavaScript framework for building user interfaces. It is designed from the ground up to be incrementally adoptable.",
                uses: ["Interactive Web Interfaces", "Single-Page Applications", "Prototyping", "Integrating with existing projects"]
            },
            typescript: {
                title: "TypeScript",
                icon: "devicon-typescript-plain colored",
                description: "A strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.",
                uses: ["Large-scale JavaScript Applications", "Angular Development", "Type-safe Backend Development (Node.js)", "Enhancing Code Maintainability"]
            },
            node: {
                title: "Node.js",
                icon: "devicon-nodejs-plain colored",
                description: "An asynchronous event-driven JavaScript runtime designed to build scalable network applications.",
                uses: ["Real-time Chat Applications", "REST API Servers", "Streaming Services", "Server-side Rendering"]
            },
            python: {
                title: "Python",
                icon: "devicon-python-plain colored",
                description: "An interpreted, high-level, general-purpose programming language known for its readability and vast ecosystem.",
                uses: ["Data Science & Analytics", "Machine Learning & AI", "Web Development (Django/Flask)", "Automation & Scripting"]
            },
            java: {
                title: "Java",
                icon: "devicon-java-plain colored",
                description: "A high-level, class-based, object-oriented programming language that is designed to have as few implementation dependencies as possible.",
                uses: ["Enterprise Backend Systems", "Android App Development", "Large-scale Distributed Systems", "Financial Trading Platforms"]
            },
            csharp: {
                title: "C#",
                icon: "devicon-csharp-plain colored",
                description: "A modern, object-oriented, and type-safe programming language derived from C and C++, developed by Microsoft.",
                uses: ["Windows Desktop Applications", "Game Development (Unity)", "Enterprise Web Apps (.NET)", "Cloud Services"]
            },
            dotnet: {
                title: ".NET",
                icon: "devicon-dot-net-plain colored",
                description: "A free, cross-platform, open source developer platform for building many different types of applications.",
                uses: ["Cloud-native Microservices", "Web Applications", "Mobile Apps (Xamarin/MAUI)", "IoT Applications"]
            },
            r: {
                title: "R",
                icon: "devicon-r-plain colored",
                description: "A programming language and free software environment for statistical computing and graphics.",
                uses: ["Statistical Analysis", "Data Visualization", "Academic Research", "Bioinformatics"]
            },
            aws: {
                title: "AWS",
                icon: "devicon-amazonwebservices-plain-wordmark colored",
                description: "Amazon Web Services offers reliable, scalable, and inexpensive cloud computing services.",
                uses: ["Cloud Hosting & Storage", "Serverless Computing (Lambda)", "Database Management", "Content Delivery"]
            },
            azure: {
                title: "Azure",
                icon: "devicon-azure-plain colored",
                description: "Microsoft's public cloud computing platform. It provides a range of cloud services, including compute, analytics, storage and networking.",
                uses: ["Enterprise Cloud Solutions", "Hybrid Cloud Environments", "AI & Machine Learning Services", "DevOps Integration"]
            },
            gcp: {
                title: "Google Cloud Platform",
                icon: "devicon-googlecloud-plain colored",
                description: "A suite of cloud computing services that runs on the same infrastructure that Google uses internally for its end-user products.",
                uses: ["Big Data Analytics", "Machine Learning (AutoML)", "Container Management (GKE)", "App Engine"]
            },
            docker: {
                title: "Docker",
                icon: "devicon-docker-plain colored",
                description: "An open platform for developing, shipping, and running applications inside containers.",
                uses: ["Microservices Architecture", "Consistent Dev/Prod Environments", "Application Isolation", "CI/CD Pipelines"]
            },
            k8s: {
                title: "Kubernetes",
                icon: "devicon-kubernetes-plain colored",
                description: "An open-source system for automating deployment, scaling, and management of containerized applications.",
                uses: ["Container Orchestration", "Auto-scaling Applications", "Load Balancing", "Self-healing Systems"]
            },
            terraform: {
                title: "Terraform",
                icon: "devicon-terraform-plain colored",
                description: "An open-source infrastructure as code software tool that enables you to safely and predictably create, change, and improve infrastructure.",
                uses: ["Infrastructure as Code (IaC)", "Multi-cloud Management", "Automated Infrastructure Provisioning", "State Management"]
            },
            go: {
                title: "Go (Golang)",
                icon: "devicon-go-original-wordmark colored",
                description: "A statically typed, compiled programming language designed at Google for simplicity and efficiency.",
                uses: ["Cloud-native Applications", "Microservices", "System Programming", "High-performance Networking"]
            },
            flutter: {
                title: "Flutter",
                icon: "devicon-flutter-plain colored",
                description: "Google's UI toolkit for building natively compiled applications for mobile, web, and desktop from a single codebase.",
                uses: ["Cross-platform Mobile Apps", "Web Applications", "Desktop Apps", "Embedded Systems"]
            },
            swift: {
                title: "Swift",
                icon: "devicon-swift-plain colored",
                description: "A powerful and intuitive programming language for iOS, iPadOS, macOS, tvOS, and watchOS.",
                uses: ["iOS Mobile Apps", "macOS Desktop Apps", "watchOS Apps", "tvOS Apps"]
            },
            mongodb: {
                title: "MongoDB",
                icon: "devicon-mongodb-plain colored",
                description: "A source-available cross-platform document-oriented database program. Classified as a NoSQL database program.",
                uses: ["Handling Unstructured Data", "High-traffic Apps", "Content Management Systems", "Real-time Analytics"]
            },
            postgresql: {
                title: "PostgreSQL",
                icon: "devicon-postgresql-plain colored",
                description: "A powerful, open source object-relational database system with over 35 years of active development.",
                uses: ["Complex Transactional Systems", "Geospatial Data (PostGIS)", "Data Warehousing", "Reliable Backend Storage"]
            },
            redis: {
                title: "Redis",
                icon: "devicon-redis-plain colored",
                description: "An open source, in-memory data structure store, used as a database, cache, and message broker.",
                uses: ["Caching", "Session Management", "Real-time Leaderboards", "Message Queues"]
            },
            figma: {
                title: "Figma",
                icon: "devicon-figma-plain colored",
                description: "A collaborative web application for interface design.",
                uses: ["UI/UX Design", "Prototyping", "Design Systems", "Real-time Collaboration"]
            },
            xd: {
                title: "Adobe XD",
                icon: "devicon-xd-plain colored",
                description: "A vector-based user experience design tool for web apps and mobile apps.",
                uses: ["Wireframing", "Interactive Prototypes", "Screen Design", "Design Handoff"]
            },
            sketch: {
                title: "Sketch",
                icon: "devicon-sketch-line colored",
                description: "A vector graphics editor for macOS.",
                uses: ["User Interface Design", "Icon Design", "Prototyping", "Digital Art"]
            },
            git: {
                title: "Git",
                icon: "devicon-git-plain colored",
                description: "A distributed version control system for tracking changes in source code during software development.",
                uses: ["Source Code Management", "Version Control", "Team Collaboration", "History Tracking"]
            },
            gitlab: {
                title: "GitLab",
                icon: "devicon-gitlab-plain colored",
                description: "A web-based DevOps lifecycle tool that provides a Git-repository manager providing wiki, issue-tracking and CI/CD pipeline features.",
                uses: ["CI/CD Pipelines", "Source Code Hosting", "DevSecOps", "Project Management"]
            },
            jenkins: {
                title: "Jenkins",
                icon: "devicon-jenkins-line colored",
                description: "An open source automation server which enables developers around the world to reliably build, test, and deploy their software.",
                uses: ["Automated Builds", "Continuous Integration", "Continuous Deployment", "Task Scheduling"]
            },
            tensorflow: {
                title: "TensorFlow",
                icon: "devicon-tensorflow-original colored",
                description: "An end-to-end open source platform for machine learning.",
                uses: ["Neural Networks", "Deep Learning", "Image Recognition", "Natural Language Processing"]
            },
            pytorch: {
                title: "PyTorch",
                icon: "devicon-pytorch-original colored",
                description: "An open source machine learning library based on the Torch library.",
                uses: ["Computer Vision", "Natural Language Processing", "Deep Learning Research", "Production AI Models"]
            },
            selenium: {
                title: "Selenium",
                icon: "devicon-selenium-original colored",
                description: "A portable framework for testing web applications.",
                uses: ["Automated Browser Testing", "Web Scraping", "Cross-browser Verification", "Regression Testing"]
            },
            cypress: {
                title: "Cypress",
                icon: "devicon-cypressio-plain colored",
                description: "A front end testing tool built for the modern web.",
                uses: ["End-to-End Testing", "Integration Testing", "Unit Testing", "Debugging Web Apps"]
            },
            jira: {
                title: "Jira",
                icon: "devicon-jira-plain colored",
                description: "A proprietary issue tracking product developed by Atlassian that allows bug tracking and agile project management.",
                uses: ["Agile Project Management", "Bug Tracking", "Sprint Planning", "Task Management"]
            },
            openai: {
                title: "OpenAI",
                icon: "fas fa-brain text-green-400",
                description: "Advanced artificial intelligence research lab and API provider.",
                uses: ["Generative AI Features", "Natural Language Understanding", "Content Generation", "Code Assistance"]
            }
        };

        // --- 7.6 Blog Content Data (New) ---
        function buildInsightContent(intro, points) {
            return `
                <div class="space-y-6 text-left text-gray-300">
                    <p class="text-sm md:text-base leading-relaxed text-gray-300">${intro}</p>
                    <div class="grid md:grid-cols-3 gap-3">
                        ${points.map(point => `
                            <div class="p-4 rounded-xl bg-white/[0.04] border border-white/10">
                                <strong class="block text-white text-sm mb-2">${point.title}</strong>
                                <p class="text-xs text-gray-400 leading-relaxed">${point.body}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        const blogDetails = {
            checklist: {
                title: 'The "No-Duff" Checklist',
                icon: 'fas fa-clipboard-check',
                theme: 'cyan', // New Theme Property
                description: "Don't hire a developer until you can answer these 10 questions. A guide to protecting your investment.",
                content: `
                    <div class="space-y-8 md:space-y-12 text-left text-gray-300">
                        <!-- Timeline Wrapper -->
                        <div class="relative space-y-12 ml-1 md:ml-6">

                            <!-- Phase 1: Cyan -->
                            <div class="relative pl-8 md:pl-14 border-l-2 border-cyan-500/20">
                                <!-- Number Badge -->
                                <span class="absolute -left-[17px] top-0 w-9 h-9 rounded-full bg-[#050505] text-cyan-400 font-black flex items-center justify-center text-sm border-2 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.4)] z-10">01</span>

                                <h4 class="text-xl md:text-2xl font-bold text-white mb-6 -mt-1.5">The Business Logic <span class="text-cyan-400 text-base md:text-lg font-normal block md:inline md:ml-2 opacity-80">(The "Why")</span></h4>

                                <div class="space-y-6">
                                    <!-- Q1 -->
                                    <div class="bg-white/5 p-4 md:p-6 rounded-2xl border border-white/10 hover:border-cyan-500/30 transition-all hover:bg-white/[0.07]">
                                        <strong class="text-white block text-base md:text-lg mb-4">1. What is the <em class="text-cyan-400 not-italic">single</em> expensive problem this software solves?</strong>
                                        <div class="grid md:grid-cols-2 gap-4 mb-4">
                                            <div class="bg-red-500/10 p-3 md:p-4 rounded-xl border border-red-500/20">
                                                <span class="text-red-400 text-[10px] md:text-xs font-bold uppercase block mb-2"><i class="fas fa-times-circle mr-1"></i> Bad Answer</span>
                                                <span class="text-xs md:text-sm text-gray-300">"I want an app like Uber but for laundry."</span>
                                            </div>
                                            <div class="bg-green-500/10 p-3 md:p-4 rounded-xl border border-green-500/20">
                                                <span class="text-green-400 text-[10px] md:text-xs font-bold uppercase block mb-2"><i class="fas fa-check-circle mr-1"></i> Pukka Answer</span>
                                                <span class="text-xs md:text-sm text-gray-300">"Our current manual dispatch process costs us 20 hours a week. This software will automate dispatching to save that time."</span>
                                            </div>
                                        </div>
                                        <p class="text-xs text-cyan-200/60 italic pl-1"><i class="fas fa-info-circle mr-1"></i> <strong>Why it matters:</strong> If you can't quantify the problem, you can't measure the return on investment (ROI).</p>
                                    </div>

                                    <!-- Q2 -->
                                    <div class="bg-white/5 p-4 md:p-6 rounded-2xl border border-white/10 hover:border-cyan-500/30 transition-all hover:bg-white/[0.07]">
                                        <strong class="text-white block text-base md:text-lg mb-4">2. Who is the "Day One" user?</strong>
                                        <div class="space-y-3 mb-4">
                                            <div class="flex gap-3 text-sm text-gray-400 items-start">
                                                <span class="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-[10px] font-bold shrink-0 mt-0.5">BAD</span>
                                                <span class="text-xs md:text-sm">"Everyone."</span>
                                            </div>
                                            <div class="flex gap-3 text-sm text-white items-start">
                                                <span class="px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-[10px] font-bold shrink-0 mt-0.5">GOOD</span>
                                                <span class="text-xs md:text-sm">"Field agents in Nairobi who use low-end Android phones and have spotty internet."</span>
                                            </div>
                                        </div>
                                        <p class="text-xs text-cyan-200/60 italic pl-1"><i class="fas fa-info-circle mr-1"></i> <strong>Why it matters:</strong> This defines the technology we use (e.g., Offline-first capability vs. high-speed streaming).</p>
                                    </div>

                                     <!-- Q3 -->
                                    <div class="bg-white/5 p-4 md:p-6 rounded-2xl border border-white/10 hover:border-cyan-500/30 transition-all hover:bg-white/[0.07]">
                                        <strong class="text-white block text-base md:text-lg mb-4">3. What is the MVP (Minimum Viable Product)?</strong>
                                        <div class="grid grid-cols-1 gap-3 text-sm">
                                            <div class="p-3 rounded-lg bg-black/40 border border-white/5">
                                                <strong class="text-red-400 uppercase text-[10px] tracking-wide block mb-1">The Trap</strong>
                                                <span class="text-xs md:text-sm text-gray-400">Trying to build version 10.0 on day 1.</span>
                                            </div>
                                            <div class="p-3 rounded-lg bg-cyan-900/20 border border-cyan-500/20">
                                                <strong class="text-green-400 uppercase text-[10px] tracking-wide block mb-1">The Fix</strong>
                                                <span class="text-xs md:text-sm text-gray-300">List 5 features. Now cross out 4. What is the <em>one</em> feature that allows you to start selling? That is your MVP.</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Phase 2: Purple -->
                            <div class="relative pl-8 md:pl-14 border-l-2 border-purple-500/20">
                                <!-- Number Badge -->
                                <span class="absolute -left-[17px] top-0 w-9 h-9 rounded-full bg-[#050505] text-purple-400 font-black flex items-center justify-center text-sm border-2 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.4)] z-10">02</span>

                                <h4 class="text-xl md:text-2xl font-bold text-white mb-6 -mt-1.5">The Logistics <span class="text-purple-400 text-base md:text-lg font-normal block md:inline md:ml-2 opacity-80">(The "How")</span></h4>

                                <div class="grid md:grid-cols-2 gap-4 md:gap-6">
                                    <!-- Q4 -->
                                    <div class="bg-white/5 p-4 md:p-6 rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all hover:bg-white/[0.07] flex flex-col h-full">
                                        <strong class="text-white block text-base mb-3">4. Who owns the code?</strong>
                                        <p class="text-xs md:text-sm text-gray-400 mb-4 flex-1"><strong>The Check:</strong> Does your contract explicitly state that once you pay, <strong>you</strong> own the Intellectual Property (IP) and the source code?</p>
                                        <div class="mt-auto pt-3 border-t border-white/5">
                                            <p class="text-[10px] md:text-xs text-purple-300/80 italic"><i class="fas fa-exclamation-circle mr-1"></i> <strong>Why it matters:</strong> Many cheap agencies hold your code hostage. At Pukka Gen, you own what you pay for.</p>
                                        </div>
                                    </div>
                                    <!-- Q5 -->
                                    <div class="bg-white/5 p-4 md:p-6 rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all hover:bg-white/[0.07] flex flex-col h-full">
                                        <strong class="text-white block text-base mb-3">5. Is the content ready?</strong>
                                        <p class="text-xs md:text-sm text-gray-400 mb-4 flex-1"><strong>The Check:</strong> Do you have your logo, brand colors, text, and product images ready?</p>
                                        <div class="mt-auto pt-3 border-t border-white/5">
                                            <p class="text-[10px] md:text-xs text-purple-300/80 italic"><i class="fas fa-clock mr-1"></i> <strong>Why it matters:</strong> Development stops when content is missing. Hiring a developer to wait for you to write text is an expensive way to procrastinate.</p>
                                        </div>
                                    </div>
                                     <!-- Q6 -->
                                    <div class="bg-white/5 p-4 md:p-6 rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all hover:bg-white/[0.07] flex flex-col h-full">
                                        <strong class="text-white block text-base mb-3">6. What is your "Post-Launch" budget?</strong>
                                        <p class="text-xs md:text-sm text-gray-400 mb-4 flex-1"><span class="text-white font-bold block mb-1">The Reality:</span> Software is like a car; it needs fuel (hosting) and service (maintenance).</p>
                                        <div class="mt-auto pt-3 border-t border-white/5">
                                            <p class="text-[10px] md:text-xs text-purple-300/80 italic"><strong>The Check:</strong> Have you budgeted for monthly server costs, domain renewals, and bug fixes after launch?</p>
                                        </div>
                                    </div>
                                     <!-- Q7 -->
                                    <div class="bg-white/5 p-4 md:p-6 rounded-2xl border border-white/10 hover:border-purple-500/30 transition-all hover:bg-white/[0.07] flex flex-col h-full">
                                        <strong class="text-white block text-base mb-3">7. Who is the single decision-maker?</strong>
                                        <p class="text-xs md:text-sm text-gray-400 mb-4 flex-1"><strong>The Check:</strong> If you have three founders, who has the final "Yes/No" vote on design?</p>
                                        <div class="mt-auto pt-3 border-t border-white/5">
                                            <p class="text-[10px] md:text-xs text-purple-300/80 italic"><i class="fas fa-user-check mr-1"></i> <strong>Why it matters:</strong> "Design by committee" kills projects. Pick one captain for the ship.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Phase 3: Pink -->
                            <div class="relative pl-8 md:pl-14 border-l-2 border-pink-500/20">
                                <!-- Number Badge -->
                                <span class="absolute -left-[17px] top-0 w-9 h-9 rounded-full bg-[#050505] text-pink-400 font-black flex items-center justify-center text-sm border-2 border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.4)] z-10">03</span>

                                <h4 class="text-xl md:text-2xl font-bold text-white mb-6 -mt-1.5">The Technicals <span class="text-pink-400 text-base md:text-lg font-normal block md:inline md:ml-2 opacity-80">(The "What")</span></h4>

                                <div class="space-y-4">
                                     <!-- Q8 -->
                                    <div class="bg-white/5 p-4 md:p-5 rounded-2xl border border-white/10 flex flex-col sm:flex-row gap-3 md:gap-4 items-start hover:border-pink-500/30 transition-all hover:bg-white/[0.07]">
                                        <div class="mt-1 text-pink-400 bg-pink-500/10 p-2 md:p-3 rounded-xl shrink-0"><i class="fas fa-calendar-alt text-lg"></i></div>
                                        <div>
                                            <strong class="text-white block text-base mb-1">8. Is the timeline realistic?</strong>
                                            <p class="text-xs md:text-sm text-gray-400 mb-2"><strong>The Check:</strong> Are you launching next week because the software is ready, or because you promised an investor?</p>
                                            <p class="text-[10px] md:text-xs text-pink-300/80 italic"><strong>Why it matters:</strong> Rushed code is "Duff" code. It breaks. Real engineering takes calculated time.</p>
                                        </div>
                                    </div>
                                    <!-- Q9 -->
                                    <div class="bg-white/5 p-4 md:p-5 rounded-2xl border border-white/10 flex flex-col sm:flex-row gap-3 md:gap-4 items-start hover:border-pink-500/30 transition-all hover:bg-white/[0.07]">
                                        <div class="mt-1 text-pink-400 bg-pink-500/10 p-2 md:p-3 rounded-xl shrink-0"><i class="fas fa-mobile-alt text-lg"></i></div>
                                        <div>
                                            <strong class="text-white block text-base mb-1">9. Do you need a Mobile App or a Web App?</strong>
                                            <p class="text-xs md:text-sm text-gray-400 mb-2"><strong>The Check:</strong> Do you really need to be in the App Store, or do you just need a website that works well on phones?</p>
                                            <p class="text-[10px] md:text-xs text-pink-300/80 italic"><strong>Why it matters:</strong> Native Apps (iOS/Android) cost 3x more than Web Apps. Don't overspend on vanity.</p>
                                        </div>
                                    </div>
                                    <!-- Q10 -->
                                    <div class="bg-white/5 p-4 md:p-5 rounded-2xl border border-white/10 flex flex-col sm:flex-row gap-3 md:gap-4 items-start hover:border-pink-500/30 transition-all hover:bg-white/[0.07]">
                                        <div class="mt-1 text-pink-400 bg-pink-500/10 p-2 md:p-3 rounded-xl shrink-0"><i class="fas fa-flag-checkered text-lg"></i></div>
                                        <div>
                                            <strong class="text-white block text-base mb-1">10. How do we define "Done"?</strong>
                                            <p class="text-xs md:text-sm text-gray-400 mb-2"><strong>The Check:</strong> What does success look like? Is it "The site is live"? Or is it "100 users have signed up"?</p>
                                            <p class="text-[10px] md:text-xs text-pink-300/80 italic"><strong>Why it matters:</strong> Ambiguity breeds conflict. Define the finish line clearly.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Verdict -->
                        <div class="p-6 md:p-10 bg-gradient-to-r from-cyan-900/40 to-blue-900/40 rounded-3xl border border-cyan-500/30 text-center relative overflow-hidden group shadow-2xl mt-8 md:mt-12">
                            <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

                            <h3 class="text-xl md:text-3xl font-bold text-white mb-2 md:mb-4 relative z-10">The Verdict</h3>
                            <p class="text-base md:text-xl mb-3 text-cyan-200 relative z-10">Did you answer "I don't know" to more than 3 questions?</p>
                            <p class="text-xs md:text-base mb-6 md:mb-8 text-gray-300 max-w-lg mx-auto relative z-10 leading-relaxed">
                                That is okay. It just means you are in the <strong>Discovery Phase</strong>, not the Build Phase. Don't burn your budget on code yet. Book a "No Duff" Consultation with Pukka Gen. We will help you answer these questions, build a roadmap, and ensure that when we <em>do</em> start coding, it’s built to last.
                            </p>
                            <a href="#contact" onclick="closeServiceModal()" class="inline-flex items-center px-6 py-3 md:px-8 md:py-4 bg-cyan-500 text-black font-bold rounded-full hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:scale-105 relative z-10 text-xs md:text-base">
                                Book Your Consultation Now <i class="fas fa-arrow-right ml-2"></i>
                            </a>
                            <div class="mt-6 md:mt-8 border-t border-white/10 pt-4 md:pt-6">
                                <h4 class="font-bold text-white text-xs md:text-sm">Pukka Gen Solutions</h4>
                                <p class="text-[10px] md:text-xs text-gray-500 italic mb-1">Authentic Engineering. Next-Gen Solutions.</p>
                            <a href="https://www.pukkagennoduff.com" target="_blank" rel="noopener noreferrer" class="text-cyan-400 text-[10px] md:text-xs hover:underline">www.pukkagennoduff.com</a>
                            </div>
                        </div>
                    </div>
                `
            },
            mvp_trap: {
                title: "The MVP Trap",
                icon: "fas fa-exclamation-triangle",
                theme: "red",
                description: "Minimum viable should still mean stable, testable, and usable. Cutting scope is smart; cutting quality is expensive.",
                content: `
                    <div class="space-y-6 text-left text-gray-300">
                        <div class="p-5 md:p-6 rounded-2xl bg-red-500/10 border border-red-500/20">
                            <h4 class="text-lg md:text-xl font-bold text-white mb-3">The trap</h4>
                            <p class="text-sm md:text-base leading-relaxed text-gray-300">
                                Teams often treat MVP as permission to ship brittle code, missing flows, weak security, and unclear ownership. That creates rework before the product has a fair chance to prove itself.
                            </p>
                        </div>
                        <div class="grid md:grid-cols-3 gap-3">
                            <div class="p-4 rounded-xl bg-white/[0.04] border border-white/10">
                                <strong class="block text-white text-sm mb-2">Cut scope</strong>
                                <p class="text-xs text-gray-400 leading-relaxed">Keep the first release small, but make the chosen workflow complete from end to end.</p>
                            </div>
                            <div class="p-4 rounded-xl bg-white/[0.04] border border-white/10">
                                <strong class="block text-white text-sm mb-2">Keep quality</strong>
                                <p class="text-xs text-gray-400 leading-relaxed">Use basic testing, error handling, responsive layouts, and secure defaults from day one.</p>
                            </div>
                            <div class="p-4 rounded-xl bg-white/[0.04] border border-white/10">
                                <strong class="block text-white text-sm mb-2">Measure value</strong>
                                <p class="text-xs text-gray-400 leading-relaxed">Define the signal that proves the release worked before adding the next feature.</p>
                            </div>
                        </div>
                    </div>
                `
            },
            scope: {
                title: "Stop Buying Features You Don't Need",
                icon: "fas fa-scissors",
                theme: "cyan",
                description: "A disciplined scope is one of the fastest ways to protect budget, shorten delivery, and learn from real users sooner.",
                content: buildInsightContent(
                    "Every feature carries design, engineering, testing, support, and maintenance cost. Prioritize the smallest complete workflow that creates measurable value.",
                    [
                        { title: "Rank outcomes", body: "Choose features by the business result they support, not by how impressive they sound in a proposal." },
                        { title: "Separate now from later", body: "Create a launch list and a clearly parked backlog so useful ideas do not silently expand the first release." },
                        { title: "Price the lifecycle", body: "Estimate ongoing support and operational cost, not only the initial development effort." }
                    ]
                )
            },
            cheap_code: {
                title: "The Real Cost of Cheap Code",
                icon: "fas fa-code",
                theme: "red",
                description: "A low hourly rate is not a bargain when unclear architecture, weak testing, and rushed delivery create months of rework.",
                content: buildInsightContent(
                    "Judge development by total cost of ownership. Reliable code reduces incidents, onboarding time, security exposure, and the cost of every future feature.",
                    [
                        { title: "Ask for evidence", body: "Review shipped products, code quality practices, deployment discipline, and how defects are handled." },
                        { title: "Protect maintainability", body: "Require readable structure, documentation, source control, and a handover path your next engineer can follow." },
                        { title: "Budget for quality", body: "Testing and review may add time before launch, but they remove far more expensive uncertainty afterward." }
                    ]
                )
            },
            bluffing: {
                title: "5 Signs Your Developer Is Bluffing",
                icon: "fas fa-user-check",
                theme: "cyan",
                description: "Non-technical founders can still evaluate technical partners by looking for clarity, evidence, and responsible trade-offs.",
                content: buildInsightContent(
                    "Strong engineers make complexity understandable. Be cautious when a team promises everything instantly, avoids written scope, or cannot explain risk in plain language.",
                    [
                        { title: "They ask good questions", body: "A credible team investigates users, constraints, ownership, data, and success measures before prescribing technology." },
                        { title: "They explain trade-offs", body: "Real engineering includes choices between speed, cost, flexibility, security, and operational complexity." },
                        { title: "They show the work", body: "Expect regular demos, visible progress, tracked decisions, and honest reporting when assumptions change." }
                    ]
                )
            },
            ai_business: {
                title: "AI for Business: Beyond the Hype",
                icon: "fas fa-brain",
                theme: "purple",
                description: "AI creates value when it improves a specific workflow with measurable quality, cost, speed, or decision-making gains.",
                content: buildInsightContent(
                    "Start with repetitive, high-volume work where human review can remain in the loop. A useful AI feature needs quality checks, privacy controls, and a fallback path.",
                    [
                        { title: "Choose a narrow task", body: "Classification, drafting, search, forecasting, and routing are easier to measure than a vague company-wide AI initiative." },
                        { title: "Keep human control", body: "Use approvals and escalation rules for financial, legal, medical, security, or customer-sensitive decisions." },
                        { title: "Measure accuracy", body: "Track acceptance rate, correction rate, time saved, and failure patterns before scaling the system." }
                    ]
                )
            },
            pwa: {
                title: "Why Your Next App Should Be a PWA",
                icon: "fas fa-mobile-alt",
                theme: "purple",
                description: "A progressive web app can deliver installable, responsive, and offline-capable experiences without maintaining separate native codebases.",
                content: buildInsightContent(
                    "PWAs are especially effective when reach, fast iteration, and lower delivery cost matter more than deep access to device-specific native features.",
                    [
                        { title: "Reach users faster", body: "Users open one link across desktop and mobile without waiting for an app-store download." },
                        { title: "Maintain one product", body: "A shared codebase reduces duplicated feature work and keeps releases aligned across platforms." },
                        { title: "Know the limits", body: "Choose native development when the product depends heavily on advanced hardware, background services, or store-specific capabilities." }
                    ]
                )
            },
            cloud_security: {
                title: "Cloud Security: Are You Safe?",
                icon: "fas fa-shield-alt",
                theme: "red",
                description: "Cloud platforms provide strong building blocks, but your configuration, identities, data handling, and monitoring determine the real security posture.",
                content: buildInsightContent(
                    "Most cloud incidents are not caused by the cloud provider being breached. They come from exposed credentials, excessive permissions, missing updates, and weak visibility.",
                    [
                        { title: "Minimize access", body: "Use least-privilege roles, multi-factor authentication, short-lived credentials, and separate production access." },
                        { title: "Protect the data", body: "Encrypt sensitive data, manage secrets centrally, define retention, and test restoration from backups." },
                        { title: "Watch continuously", body: "Centralize logs and alerts so unusual access, configuration drift, and failed controls are visible quickly." }
                    ]
                )
            },
            serverless: {
                title: "Serverless Architecture: Scale Without the Theatre",
                icon: "fas fa-cloud",
                theme: "purple",
                description: "Serverless systems can reduce operational overhead and scale efficiently, provided the workload and cost model genuinely fit.",
                content: buildInsightContent(
                    "Serverless is a delivery model, not magic. It works best for event-driven workloads, APIs, scheduled jobs, and variable traffic with well-defined execution boundaries.",
                    [
                        { title: "Match the workload", body: "Use serverless where requests are short-lived and stateless; avoid forcing long-running or tightly coupled processes into it." },
                        { title: "Model the bill", body: "Estimate execution, storage, network, logging, and third-party costs at normal and peak traffic." },
                        { title: "Design observability", body: "Distributed functions need structured logs, tracing, retries, dead-letter handling, and clear ownership when failures occur." }
                    ]
                )
            }
        };

        const serviceModal = document.getElementById('serviceModal');
        const modalContent = document.getElementById('modalContent');
        const modalClose = document.getElementById('modalClose');
        const detailBtns = document.querySelectorAll('.service-detail-btn');
        const portfolioDetails = {
            ops: {
                title: "Operations Command Center",
                eyebrow: "AI + SaaS",
                theme: "cyan",
                image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80",
                description: "A realtime coordination dashboard that unifies task intake, team workload, AI-assisted triage, and executive reporting in one operational view.",
                metrics: [
                    { value: "42%", label: "faster handoffs" },
                    { value: "8", label: "connected systems" },
                    { value: "2.1s", label: "median dashboard load" }
                ],
                outcomes: [
                    "Role-based dashboards for managers, operators, and field teams",
                    "AI-assisted prioritization for overloaded queues",
                    "Realtime activity stream with clear escalation paths",
                    "Responsive tablet workflow for floor and field use"
                ],
                stack: ["React", "Node.js", "PostgreSQL", "WebSockets", "Azure"]
            },
            finance: {
                title: "Fintech Trust Portal",
                eyebrow: "Security + Cloud",
                theme: "green",
                image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1400&q=80",
                description: "A hardened customer portal for account onboarding, payment activity, admin controls, and compliance-friendly audit review.",
                metrics: [
                    { value: "99.98%", label: "uptime target" },
                    { value: "4", label: "risk layers" },
                    { value: "0", label: "critical launch defects" }
                ],
                outcomes: [
                    "Secure authentication and role permissions",
                    "Clean customer self-service journeys",
                    "Admin review queues with audit context",
                    "Deployment gates for security and regression checks"
                ],
                stack: ["Next.js", ".NET", "PostgreSQL", "Docker", "AWS"]
            },
            health: {
                title: "Healthcare Flow Engine",
                eyebrow: "UX + AI",
                theme: "pink",
                image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1400&q=80",
                description: "A patient-facing booking and care workflow platform that helps clinics reduce friction across intake, routing, reminders, and follow-up.",
                metrics: [
                    { value: "31%", label: "fewer no-shows" },
                    { value: "12", label: "mapped journeys" },
                    { value: "4", label: "staff roles" }
                ],
                outcomes: [
                    "Mobile-first appointment and intake flow",
                    "Automated reminders and risk-based routing",
                    "Operational reports for capacity planning",
                    "Accessible UI patterns for sensitive workflows"
                ],
                stack: ["Vue", "Python", "PostgreSQL", "Twilio", "Figma"]
            },
            learning: {
                title: "Learning Studio",
                eyebrow: "Design + SaaS",
                theme: "purple",
                image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80",
                description: "A polished learning portal with content tooling, cohort management, progress tracking, and responsive lesson experiences.",
                metrics: [
                    { value: "4.8/5", label: "learner CSAT" },
                    { value: "3x", label: "content speed" },
                    { value: "6", label: "course templates" }
                ],
                outcomes: [
                    "Design system for reusable lesson layouts",
                    "Instructor content workflow with draft states",
                    "Learner progress dashboards and certificates",
                    "Offline-friendly mobile learning patterns"
                ],
                stack: ["React", "Firebase", "Tailwind", "Figma", "Analytics"]
            },
            cloudops: {
                title: "Cloud Migration Map",
                eyebrow: "Cloud + Security",
                theme: "blue",
                image: "https://images.unsplash.com/photo-1558494949-ef526b0042a0?auto=format&fit=crop&w=1400&q=80",
                description: "A phased migration program with release gates, observability, failover planning, cost visibility, and clear cutover discipline.",
                metrics: [
                    { value: "58%", label: "lower deploy risk" },
                    { value: "0", label: "data-loss events" },
                    { value: "24/7", label: "monitor coverage" }
                ],
                outcomes: [
                    "Infrastructure mapping and dependency planning",
                    "Containerized deployment pipeline",
                    "Dashboards for cost, uptime, and incidents",
                    "Rollback playbooks for each release stage"
                ],
                stack: ["AWS", "Kubernetes", "Terraform", "Docker", "Grafana"]
            },
            support: {
                title: "AI Support Desk",
                eyebrow: "AI Operations",
                theme: "yellow",
                image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1400&q=80",
                description: "An assisted support layer that classifies tickets, drafts replies, escalates risk, and keeps the knowledge base improving over time.",
                metrics: [
                    { value: "24/7", label: "first triage" },
                    { value: "68%", label: "faster routing" },
                    { value: "320+", label: "knowledge articles" }
                ],
                outcomes: [
                    "LLM-assisted routing with human approval",
                    "Priority scoring for urgent customer issues",
                    "Knowledge gap detection from ticket trends",
                    "Admin controls for prompt and policy changes"
                ],
                stack: ["OpenAI", "Node.js", "Redis", "PostgreSQL", "Zendesk"]
            }
        };

        // Helper to get theme color based on service key
        const getServiceTheme = (key) => {
            const themes = {
                software: 'cyan',
                ai: 'purple',
                cloud: 'cyan', // Blue/Cyan share similar vibes
                design: 'pink',
                security: 'green',
                consultancy: 'orange'
            };
            return themes[key] || 'cyan';
        };

        // Existing Service Modal Logic (Refined Style)
        detailBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault(); // Stop anchor jump
                const key = btn.getAttribute('data-service');
                const data = serviceDetails[key];
                if(!data) return;

                const theme = getServiceTheme(key);

                // Color maps for dynamic styling
                const colors = {
                    cyan: { text: 'text-cyan-400', border: 'border-cyan-500/30', bg: 'bg-cyan-500/10', glow: 'shadow-[0_0_30px_rgba(6,182,212,0.2)]' },
                    purple: { text: 'text-purple-400', border: 'border-purple-500/30', bg: 'bg-purple-500/10', glow: 'shadow-[0_0_30px_rgba(168,85,247,0.2)]' },
                    pink: { text: 'text-pink-400', border: 'border-pink-500/30', bg: 'bg-pink-500/10', glow: 'shadow-[0_0_30px_rgba(236,72,153,0.2)]' },
                    green: { text: 'text-green-400', border: 'border-green-500/30', bg: 'bg-green-500/10', glow: 'shadow-[0_0_30px_rgba(34,197,94,0.2)]' },
                    orange: { text: 'text-orange-400', border: 'border-orange-500/30', bg: 'bg-orange-500/10', glow: 'shadow-[0_0_30px_rgba(249,115,22,0.2)]' }
                };
                const c = colors[theme];

                modalContent.innerHTML = `
                    <div class="relative overflow-hidden rounded-2xl border ${c.border} bg-[#0A0A0A] p-1">
                        <!-- Header Section -->
                        <div class="relative p-6 md:p-8 text-center bg-gradient-to-b from-white/5 to-transparent rounded-xl overflow-hidden">
                            <div class="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 ${c.bg} blur-[60px] rounded-full pointer-events-none"></div>

                            <div class="relative z-10">
                                <div class="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${c.bg} border ${c.border} ${c.glow}">
                                    <i class="${data.icon} text-2xl md:text-3xl ${c.text} animate-float"></i>
                                </div>
                                <h2 class="text-2xl md:text-3xl font-bold text-white mb-3">${data.title}</h2>
                                <p class="text-gray-300 text-sm md:text-base max-w-lg mx-auto leading-relaxed">${data.description}</p>
                            </div>
                        </div>

                        <div class="p-5 md:p-8 space-y-6 md:space-y-8">
                            <!-- Features Grid -->
                            <div>
                                <h3 class="text-xs md:text-sm font-bold uppercase tracking-wider text-gray-500 mb-4 text-center">What We Deliver</h3>
                                <div class="grid gap-2 md:gap-3">
                                    ${data.features.map(f => `
                                        <div class="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors group">
                                            <i class="fas fa-check-circle ${c.text} text-sm group-hover:scale-110 transition-transform duration-300"></i>
                                            <span class="text-gray-300 text-xs md:text-sm font-medium">${f}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>

                            <!-- Tech Stack -->
                            <div>
                                <h3 class="text-xs md:text-sm font-bold uppercase tracking-wider text-gray-500 mb-4 text-center">Powering Tools</h3>
                                <div class="flex flex-wrap justify-center gap-2 md:gap-3">
                                    ${data.technologies.map(t => `
                                        <div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:${c.border} transition-all group">
                                            <i class="${t.icon} text-sm md:text-base ${t.icon.includes('colored') ? '' : c.text} group-hover:scale-110 transition-transform duration-300"></i>
                                            <span class="text-[10px] md:text-xs text-gray-300">${t.name}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>

                        <!-- Footer -->
                        <div class="p-6 border-t border-white/5 text-center bg-white/[0.02]">
                            <a href="#contact" class="magnetic-btn inline-flex items-center px-6 py-3 md:px-8 md:py-3 rounded-full bg-white text-black font-bold hover:bg-${theme}-400 hover:text-white transition-all shadow-lg hover:shadow-${theme}-500/50 text-sm" onclick="closeServiceModal()">
                                Start This Project <i class="fas fa-arrow-right ml-2"></i>
                            </a>
                        </div>
                    </div>
                `;
                serviceModal.setAttribute('aria-label', data.title);
                openModal(serviceModal, modalClose);
            });
        });

        // --- 7.1 Portfolio Showcase Logic ---
        const portfolioFilters = document.querySelectorAll('.portfolio-filter');
        const portfolioCards = document.querySelectorAll('.portfolio-project-btn');
        const portfolioResultCount = document.getElementById('portfolioResultCount');
        const portfolioColors = {
            cyan: { text: 'text-cyan-400', border: 'border-cyan-500/30', bg: 'bg-cyan-500/10', button: 'bg-cyan-400 hover:bg-cyan-300 text-black' },
            green: { text: 'text-green-400', border: 'border-green-500/30', bg: 'bg-green-500/10', button: 'bg-green-400 hover:bg-green-300 text-black' },
            pink: { text: 'text-pink-400', border: 'border-pink-500/30', bg: 'bg-pink-500/10', button: 'bg-pink-400 hover:bg-pink-300 text-black' },
            purple: { text: 'text-purple-400', border: 'border-purple-500/30', bg: 'bg-purple-500/10', button: 'bg-purple-400 hover:bg-purple-300 text-black' },
            blue: { text: 'text-blue-400', border: 'border-blue-500/30', bg: 'bg-blue-500/10', button: 'bg-blue-400 hover:bg-blue-300 text-black' },
            yellow: { text: 'text-yellow-400', border: 'border-yellow-500/30', bg: 'bg-yellow-500/10', button: 'bg-yellow-300 hover:bg-yellow-200 text-black' }
        };

        function setPortfolioFilter(filter = 'all') {
            let visibleCount = 0;
            const activeFilter = Array.from(portfolioFilters).find(button => button.dataset.filter === filter);
            const activeLabel = activeFilter?.textContent.trim() || filter;

            portfolioFilters.forEach(button => {
                const isActive = button.dataset.filter === filter;
                button.setAttribute('aria-pressed', String(isActive));
            });

            portfolioCards.forEach(card => {
                const categories = (card.dataset.category || '').split(/\s+/).filter(Boolean);
                const shouldShow = filter === 'all' || categories.includes(filter);
                card.classList.toggle('is-hidden', !shouldShow);
                card.setAttribute('aria-hidden', String(!shouldShow));
                if (shouldShow) visibleCount += 1;
            });

            if (portfolioResultCount) {
                portfolioResultCount.textContent = filter === 'all'
                    ? `Showing all ${visibleCount} builds`
                    : `Showing ${visibleCount} ${activeLabel} ${visibleCount === 1 ? 'build' : 'builds'}`;
            }
        }

        function openPortfolioProject(key) {
            const data = portfolioDetails[key];
            if (!data || !serviceModal || !modalContent) return;
            const c = portfolioColors[data.theme] || portfolioColors.cyan;

            modalContent.innerHTML = `
                <div class="relative overflow-hidden rounded-lg border ${c.border} bg-[#080808]">
                    <div class="grid lg:grid-cols-[0.9fr_1.1fr]">
                        <div class="relative min-h-[16rem] lg:min-h-full overflow-hidden">
                            <img src="${data.image}" alt="${data.title} project visual" class="absolute inset-0 w-full h-full object-cover">
                            <div class="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#080808] via-[#080808]/45 to-transparent"></div>
                            <div class="relative z-10 p-6 md:p-8 h-full flex flex-col justify-end">
                                <span class="w-max px-3 py-1 rounded-full ${c.bg} border ${c.border} ${c.text} text-[10px] font-bold uppercase tracking-widest">${data.eyebrow}</span>
                                <h2 class="text-2xl md:text-4xl font-black text-white mt-4 mb-3">${data.title}</h2>
                                <p class="text-sm md:text-base text-gray-300 leading-relaxed">${data.description}</p>
                            </div>
                        </div>

                        <div class="p-5 md:p-8 space-y-6">
                            <div class="grid sm:grid-cols-3 gap-3">
                                ${data.metrics.map(metric => `
                                    <div class="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                                        <div class="text-2xl font-black text-white">${metric.value}</div>
                                        <div class="text-[10px] uppercase tracking-wider text-gray-500 mt-1">${metric.label}</div>
                                    </div>
                                `).join('')}
                            </div>

                            <div>
                                <h3 class="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Delivery Outcomes</h3>
                                <div class="grid gap-2">
                                    ${data.outcomes.map(item => `
                                        <div class="flex items-start gap-3 rounded-lg border border-white/5 bg-white/[0.025] p-3">
                                            <i class="fas fa-check-circle ${c.text} mt-0.5"></i>
                                            <span class="text-sm text-gray-300 leading-relaxed">${item}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>

                            <div>
                                <h3 class="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Stack Snapshot</h3>
                                <div class="flex flex-wrap gap-2">
                                    ${data.stack.map(tool => `
                                        <span class="px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.035] text-xs text-gray-300">${tool}</span>
                                    `).join('')}
                                </div>
                            </div>

                            <div class="pt-5 border-t border-white/10 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                                <p class="text-xs text-gray-500 leading-relaxed max-w-sm">Need a similar product system? Start with a focused brief and we will shape the delivery path.</p>
                                <a href="#contact" class="magnetic-btn inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full ${c.button} text-sm font-bold transition-colors" onclick="closeServiceModal()">
                                    Discuss a Build <i class="fas fa-arrow-right"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            serviceModal.setAttribute('aria-label', `${data.title} case study`);
            openModal(serviceModal, modalClose);
        }

        portfolioFilters.forEach(button => {
            button.addEventListener('click', () => setPortfolioFilter(button.dataset.filter || 'all'));
        });

        portfolioCards.forEach(card => {
            card.addEventListener('click', () => openPortfolioProject(card.dataset.project));
        });

        if (portfolioCards.length) {
            setPortfolioFilter('all');
        }

        // --- New Tech Modal Logic ---
        const techCards = document.querySelectorAll('.tech-marquee-item');

        techCards.forEach(card => {
            const isDecorativeClone = Boolean(card.closest('[aria-hidden="true"]'));
            const techName = card.querySelector('span')?.textContent.trim() || 'technology';
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', `Learn about ${techName}`);
            card.tabIndex = isDecorativeClone ? -1 : 0;

            card.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    card.click();
                }
            });

            card.addEventListener('click', (e) => {
                const key = card.getAttribute('data-tech');
                const data = techDetails[key];
                if(!data) return;

                // Clean icon class for background (remove 'colored' to allow CSS coloring)
                const bgIconClass = data.icon.replace('colored', '').trim();

                modalContent.innerHTML = `
                    <div class="relative overflow-hidden rounded-2xl border border-white/10 bg-[#080808] p-1">
                        <!-- Inner Grid Texture -->
                        <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] opacity-20 pointer-events-none"></div>

                        <!-- Floating Background Decor -->
                        <div class="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none transform rotate-12 scale-150 origin-top-right">
                            <i class="${bgIconClass} text-9xl text-white"></i>
                        </div>

                        <!-- Header Section -->
                        <div class="relative p-6 md:p-10 text-center bg-gradient-to-b from-white/5 to-transparent rounded-xl overflow-hidden z-10">
                            <!-- Glow Behind Icon -->
                            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-cyan-500/20 blur-[80px] rounded-full pointer-events-none"></div>

                            <div class="w-16 h-16 md:w-24 md:h-24 mx-auto mb-6 rounded-2xl bg-[#0A0A0A] border border-white/10 flex items-center justify-center shadow-2xl relative group">
                                <div class="absolute inset-0 bg-cyan-500/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                                <i class="${data.icon} text-3xl md:text-5xl relative z-10 animate-float"></i>
                            </div>

                            <h2 class="text-2xl md:text-4xl font-bold text-white mb-4 tracking-tight">${data.title}</h2>
                            <p class="text-gray-400 text-sm md:text-base max-w-lg mx-auto leading-relaxed font-light">${data.description}</p>
                        </div>

                        <!-- Use Cases Section -->
                        <div class="p-5 md:p-8 relative z-10 border-t border-white/5 bg-black/20">
                            <h3 class="text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-400 mb-6 text-center opacity-80">Core Capabilities</h3>
                            <div class="grid sm:grid-cols-2 gap-3 max-w-3xl mx-auto">
                                ${data.uses.map(use => `
                                    <div class="group flex items-start gap-3 p-3 md:p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 hover:bg-white/[0.05] transition-all duration-300">
                                        <div class="mt-0.5 w-5 h-5 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 shrink-0 group-hover:scale-110 transition-transform shadow-[0_0_10px_rgba(6,182,212,0.1)]">
                                            <i class="fas fa-check text-[9px] text-cyan-400"></i>
                                        </div>
                                        <span class="text-gray-300 text-xs md:text-sm font-light group-hover:text-white transition-colors leading-snug">${use}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <!-- Footer -->
                        <div class="p-6 border-t border-white/5 text-center bg-white/[0.02] relative z-10">
                            <button type="button" class="magnetic-btn inline-flex items-center px-6 py-3 md:px-8 md:py-3 rounded-full bg-white text-black font-bold hover:bg-cyan-400 hover:text-black transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] text-xs md:text-sm uppercase tracking-wide" onclick="closeServiceModal()">
                                Close Overview
                            </button>
                        </div>
                    </div>
                `;
                serviceModal.setAttribute('aria-label', `${data.title} technology overview`);
                openModal(serviceModal, modalClose);
            });
        });

        // --- Blog Modal Logic ---
        const blogCards = document.querySelectorAll('.blog-card');

        function activateBlogCard(e) {
            e.preventDefault();
            e.stopPropagation();
            openBlogModal(e.currentTarget);
        }

        blogCards.forEach(card => {
            if (card.tagName !== 'BUTTON') {
                card.setAttribute('role', 'button');
                card.setAttribute('tabindex', '0');
                card.classList.add('cursor-pointer');
            }

            card.addEventListener('click', activateBlogCard, true);
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    activateBlogCard(e);
                }
            });
        });

        function openBlogModal(cardElement) {
            const key = cardElement.getAttribute('data-insight');
            const data = blogDetails[key];
            if(!data) return;

            // Define Theme Colors (Default to Cyan)
            const theme = data.theme || 'cyan';
            const colors = {
                cyan: { text: 'text-cyan-400', border: 'border-cyan-500/30', bg: 'bg-cyan-500/10', glow: 'shadow-[0_0_30px_rgba(6,182,212,0.2)]' },
                red: { text: 'text-red-400', border: 'border-red-500/30', bg: 'bg-red-500/10', glow: 'shadow-[0_0_30px_rgba(239,68,68,0.2)]' },
                purple: { text: 'text-purple-400', border: 'border-purple-500/30', bg: 'bg-purple-500/10', glow: 'shadow-[0_0_30px_rgba(168,85,247,0.2)]' },
            };
            const c = colors[theme] || colors.cyan;

            // Clean icon class for background
            const bgIconClass = data.icon.replace('colored', '').trim();

            modalContent.innerHTML = `
                <div class="relative overflow-hidden rounded-2xl border ${c.border} bg-[#0A0A0A] p-1">
                    <!-- Inner Grid Texture -->
                    <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] opacity-20 pointer-events-none"></div>

                    <!-- Floating Background Decor -->
                    <div class="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none transform rotate-12 scale-150 origin-top-right">
                        <i class="${bgIconClass} text-9xl text-white"></i>
                    </div>

                    <!-- Header Section -->
                    <div class="relative p-6 md:p-10 text-center bg-gradient-to-b from-white/5 to-transparent rounded-xl overflow-hidden z-10">
                        <!-- Glow Behind Icon -->
                        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32 ${c.bg} blur-[60px] rounded-full pointer-events-none"></div>

                        <div class="relative z-10">
                            <div class="w-16 h-16 md:w-20 md:h-20 mx-auto mb-6 rounded-2xl bg-[#0A0A0A] border border-white/10 flex items-center justify-center shadow-2xl relative group">
                                <div class="absolute inset-0 ${c.bg} blur-md opacity-50 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                                <i class="${data.icon} text-3xl md:text-4xl ${c.text} relative z-10 animate-float"></i>
                            </div>

                            <h2 class="text-2xl md:text-5xl font-bold text-white mb-4 tracking-tight">${data.title}</h2>
                            <p class="text-gray-400 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed font-light">${data.description}</p>
                        </div>
                    </div>

                    <!-- Content Section -->
                    <div class="p-5 md:p-10 relative z-10 border-t border-white/5 bg-black/20">
                            ${data.content}
                    </div>

                    <!-- Footer -->
                    <div class="p-6 border-t border-white/5 bg-white/[0.02] relative z-10 flex flex-wrap justify-center gap-3">
                        ${key === 'checklist' ? `
                            <button type="button" id="downloadChecklistBtn" class="magnetic-btn inline-flex items-center px-6 py-3 md:px-8 md:py-3 rounded-full bg-cyan-500 text-black font-bold hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.25)] text-xs md:text-sm uppercase tracking-wide">
                                Download Checklist <i class="fas fa-download ml-2"></i>
                            </button>
                        ` : ''}
                        <button type="button" class="magnetic-btn inline-flex items-center px-6 py-3 md:px-8 md:py-3 rounded-full bg-white text-black font-bold hover:bg-${theme}-400 hover:text-black transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] text-xs md:text-sm uppercase tracking-wide" onclick="closeServiceModal()">
                            Close Resource
                        </button>
                    </div>
                </div>
            `;
            serviceModal.setAttribute('aria-label', data.title);
            openModal(serviceModal, modalClose);
            document.getElementById('downloadChecklistBtn')?.addEventListener('click', downloadNoDuffChecklist);
        }

        modalClose.addEventListener('click', () => {
            closeServiceModal();
        });

        serviceModal.addEventListener('click', (e) => {
            if(e.target === serviceModal) {
                closeServiceModal();
            }
        });

        // --- 8. Magnetic Buttons ---
        document.querySelectorAll('.magnetic-btn').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0px, 0px)';
            });
        });

        // --- 9. Parallax ---
        document.addEventListener('mousemove', (e) => {
            const orbs = document.querySelectorAll('.bg-gradient-orb');
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            orbs.forEach(orb => {
                const speed = orb.getAttribute('data-speed');
                const moveX = (window.innerWidth * speed) * (0.5 - x);
                const moveY = (window.innerHeight * speed) * (0.5 - y);
                orb.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
        });

        // --- 10. Typewriter ---
        const text = "No Duff. Just Quality.";
        const typeWriterElement = document.getElementById('typewriter-text');
        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                typeWriterElement.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }

        // --- 12. Toast Notification Logic ---
        function showToast(message) {
            const toast = document.getElementById('toast');
            const toastMsg = document.getElementById('toastMessage');

            if (toast && toastMsg) {
                toastMsg.innerText = message;
                // Show
                toast.classList.remove('translate-y-40', 'opacity-0');

                // Hide after 3 seconds
                setTimeout(() => {
                    toast.classList.add('translate-y-40', 'opacity-0');
                }, 3000);
            }
        }

        function initProjectBriefForm() {
            const form = document.getElementById('projectBriefForm');
            const status = document.getElementById('projectFormStatus');
            if (!form) return;

            const fields = Array.from(form.querySelectorAll('input, select, textarea'));

            function updateFieldState(field) {
                const isInvalid = !field.validity.valid && (field.dataset.touched === 'true' || field === document.activeElement);
                field.classList.toggle('field-invalid', isInvalid);
                field.setAttribute('aria-invalid', isInvalid ? 'true' : 'false');
            }

            fields.forEach(field => {
                field.addEventListener('blur', () => {
                    field.dataset.touched = 'true';
                    updateFieldState(field);
                });
                field.addEventListener('input', () => {
                    field.dataset.touched = 'true';
                    updateFieldState(field);
                    if (status) status.textContent = '';
                });
                field.addEventListener('change', () => {
                    field.dataset.touched = 'true';
                    updateFieldState(field);
                });
            });

            function handleProjectBriefSubmit(event) {
                event.preventDefault();
                fields.forEach(field => {
                    field.dataset.touched = 'true';
                    updateFieldState(field);
                });

                if (!form.checkValidity()) {
                    const firstInvalid = fields.find(field => !field.validity.valid);
                    if (status) {
                        status.textContent = 'Please complete the highlighted fields so we can qualify the brief properly.';
                        status.className = 'min-h-[1.25rem] text-xs text-red-400';
                    }
                    showToast('Please complete the highlighted fields.');
                    firstInvalid?.focus();
                    return;
                }

                const formData = new FormData(form);
                const fullName = String(formData.get('name') || '').trim();
                const firstName = fullName.split(' ')[0] || 'there';
                const service = form.querySelector('#projectService')?.selectedOptions[0]?.textContent.trim() || 'General enquiry';
                const subject = `Project brief from ${fullName} — ${service}`;
                const body = [
                    `Name: ${fullName}`,
                    `Email: ${String(formData.get('email') || '').trim()}`,
                    `Phone: ${String(formData.get('phone') || '').trim() || 'Not provided'}`,
                    `Service: ${service}`,
                    '',
                    'Project details:',
                    String(formData.get('message') || '').trim()
                ].join('\n');

                if (status) {
                    status.textContent = 'Your project brief is ready. Review and send it from the email app that opens.';
                    status.className = 'min-h-[1.25rem] text-xs text-green-400';
                }
                showToast(`Thanks, ${firstName}. Opening your email app with the brief prepared.`);
                window.location.href = `mailto:mail@pukkagennoduff.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            }

            form.addEventListener('submit', handleProjectBriefSubmit);
            form.querySelector('button[type="submit"]')?.addEventListener('click', (event) => {
                if (!form.checkValidity()) {
                    handleProjectBriefSubmit(event);
                }
            });
        }

        initProjectBriefForm();

        // --- 13. Background Rocket Animation ---
        const rocket = document.getElementById('rocket');

        function launchRocket() {
            if (!rocket) return;

            const w = window.innerWidth;
            const h = window.innerHeight;
            const buffer = 150; // Start/End distance outside screen

            // 1. Pick random start and end points on the perimeter
            const sides = ['top', 'right', 'bottom', 'left'];
            const startSide = sides[Math.floor(Math.random() * 4)];
            let endSide = sides[Math.floor(Math.random() * 4)];

            // Ensure end side is different for a decent path
            while (endSide === startSide) {
                endSide = sides[Math.floor(Math.random() * 4)];
            }

            const getCoords = (side) => {
                switch(side) {
                    case 'top': return { x: Math.random() * w, y: -buffer };
                    case 'right': return { x: w + buffer, y: Math.random() * h };
                    case 'bottom': return { x: Math.random() * w, y: h + buffer };
                    case 'left': return { x: -buffer, y: Math.random() * h };
                }
            };

            const start = getCoords(startSide);
            const end = getCoords(endSide);

            // 2. Calculate Angle to face destination
            const dx = end.x - start.x;
            const dy = end.y - start.y;
            // atan2 returns angle in radians from X-axis (Right)
            const angleRad = Math.atan2(dy, dx);
            const angleDeg = angleRad * (180 / Math.PI);

            // The icon (fa-space-shuttle) usually points UP.
            // 0 deg in rotation usually means "no change" (UP).
            // In atan2, 0 deg is RIGHT.
            // To make UP point RIGHT, we rotate +90 deg.
            const rotation = angleDeg + 90;

            // 3. Calculate Duration based on distance for consistent speed
            const distance = Math.sqrt(dx*dx + dy*dy);
            // Speed factor: pixels per second (lower = slower)
            const speedPxPerSec = 70;
            const durationMs = (distance / speedPxPerSec) * 1000;

            // 4. Reset & Position
            rocket.style.transition = 'none';
            rocket.style.transform = `translate(${start.x}px, ${start.y}px) rotate(${rotation}deg)`;
            rocket.style.opacity = '0';

            // Force reflow
            void rocket.offsetWidth;

            // 5. Animate
            setTimeout(() => {
                rocket.style.transition = `transform ${durationMs}ms linear, opacity 1.5s ease-in-out`;
                rocket.style.opacity = '0.6'; // Visible
                rocket.style.transform = `translate(${end.x}px, ${end.y}px) rotate(${rotation}deg)`;

                // Fade out before it abruptly stops at the end coordinate
                setTimeout(() => {
                    rocket.style.opacity = '0';
                }, durationMs - 1500);

                // Schedule next launch
                setTimeout(launchRocket, durationMs + 3000);
            }, 100);
        }

        // Start rocket sequence after page load
        if (!prefersReducedMotion) {
            setTimeout(launchRocket, 3000);
        }

        // --- 13.5 Background Comet Logic (New) ---
        const comet = document.getElementById('comet');

        function launchComet() {
            if (!comet) return;

            const w = window.innerWidth;
            const h = window.innerHeight;

            // Comets usually fall from top/top-right to bottom-left
            // Start: Top or Right edge
            // End: Bottom or Left edge

            const startSide = Math.random() > 0.5 ? 'top' : 'right';
            let startX, startY, endX, endY;

            if (startSide === 'top') {
                startX = Math.random() * w;
                startY = -50;
                endX = startX - (Math.random() * w * 0.5 + 200); // Move Left
                endY = h + 200;
            } else {
                startX = w + 50;
                startY = Math.random() * h * 0.5; // Top half of right side
                endX = -200;
                endY = startY + (Math.random() * h * 0.5 + 200); // Move Down
            }

            // Calculate Angle
            const dx = endX - startX;
            const dy = endY - startY;
            const angleRad = Math.atan2(dy, dx);
            const angleDeg = angleRad * (180 / Math.PI);

            // Visual Rotation
            const rotation = angleDeg + 180;

            // Adjusted Speed: Increased duration to 3-6 seconds for a slower, more majestic pass
            const duration = Math.random() * 3000 + 3000;

            // Reset
            comet.style.transition = 'none';
            comet.style.transform = `translate(${startX}px, ${startY}px) rotate(${rotation}deg)`;
            comet.style.opacity = '1';

            // Activate physics interaction
            cometActive = true;

            // Force reflow
            void comet.offsetWidth;

            // Animate: Fall (accelerate with ease-in) and Disappear Sharply (fade at end)
            const fadeDuration = 400; // Sharp disappear
            const fadeDelay = duration - fadeDuration;

            // Apply transitions: Transform handles the movement, Opacity handles the sharp exit
            comet.style.transition = `transform ${duration}ms ease-in, opacity ${fadeDuration}ms ease-out ${fadeDelay}ms`;

            // Trigger animation state
            comet.style.transform = `translate(${endX}px, ${endY}px) rotate(${rotation}deg)`;
            comet.style.opacity = '0'; // Will start fading only after fadeDelay

            // Deactivate physics when animation ends
            setTimeout(() => {
                cometActive = false;
            }, duration);

            // Schedule next comet (random interval 4s - 10s)
            setTimeout(launchComet, Math.random() * 6000 + 4000);
        }

        // Start comet loop
        if (!prefersReducedMotion) {
            setTimeout(launchComet, 2000);
        }

        // --- 14. FAQ Accordion Logic (Global & Modal) ---
        const allFaqs = [
            {
                question: 'What does "Pukka" mean?',
                answer: '"Pukka" is a word of Hindi/Urdu origin entered into British English meaning "genuine, authentic, and first-class." It represents our commitment to solid, reliable engineering without shortcuts.',
                color: 'text-cyan-400',
                border: 'border-cyan-500/50',
                icon: 'fa-info'
            },
            {
                question: 'Who owns the code after the project?',
                answer: 'You do. Once the final milestone is paid, 100% of the intellectual property and source code belongs to you. We don\'t hold your project hostage.',
                color: 'text-purple-400',
                border: 'border-purple-500/50',
                icon: 'fa-code'
            },
            {
                question: 'Do you provide post-launch support?',
                answer: 'Absolutely. Launch day is just Day 1. We offer comprehensive maintenance packages to keep your software secure, updated, and evolving with your business needs.',
                color: 'text-pink-400',
                border: 'border-pink-500/50',
                icon: 'fa-life-ring'
            },
            {
                question: 'How do you handle project pricing?',
                answer: 'We value transparency. We offer fixed-price quotes for well-defined scopes and time-and-materials models for agile projects. You\'ll always know exactly what you\'re paying for—no duff, no hidden fees.',
                color: 'text-yellow-400',
                border: 'border-yellow-500/50',
                icon: 'fa-coins'
            },
            {
                question: 'How long does a typical project take?',
                answer: 'Timelines vary by complexity. A simple MVP might take 4-8 weeks, while a complex enterprise platform could take 6+ months. We provide a detailed roadmap during the Discovery Phase.',
                color: 'text-green-400',
                border: 'border-green-500/50',
                icon: 'fa-hourglass-half'
            },
            {
                question: 'Can you work with our existing team?',
                answer: 'Yes. We often augment existing teams, bringing specific expertise (like DevOps or UI/UX) or taking ownership of specific modules. We integrate seamlessly into your workflow (Jira, Slack, Git).',
                color: 'text-blue-400',
                border: 'border-blue-500/50',
                icon: 'fa-users-cog'
            },
            {
                question: 'What happens if we want changes mid-project?',
                answer: 'We use Agile methodology. Changes are expected! We handle them through "Change Requests" where we assess the impact on timeline and budget, letting you make informed decisions.',
                color: 'text-orange-400',
                border: 'border-orange-500/50',
                icon: 'fa-exchange-alt'
            },
            {
                question: 'Do you work with non-technical founders?',
                answer: 'Specially well. We speak plain English, not just "Tech." We act as your technical co-founder, guiding you through hosting, app store submission, and tech strategy.',
                color: 'text-teal-400',
                border: 'border-teal-500/50',
                icon: 'fa-user-tie'
            }
        ];

        let faqControlId = 0;

        function initAccordion(container = document) {
            const faqItems = container.querySelectorAll('.faq-item');

            faqItems.forEach(item => {
                const button = item.querySelector('.faq-question');
                const answer = item.querySelector('.faq-answer');
                const icon = item.querySelector('.fa-plus');
                const title = item.querySelector('span');

                if (!button || !answer || !icon || !title) return;

                // Get colors from data attributes
                const activeColorClass = item.dataset.color || 'text-cyan-400';
                const activeBorderClass = item.dataset.border || 'border-cyan-500/30';

                // Remove old listener to prevent duplicates if re-initialized (naive approach, but functional for this scope)
                const newButton = button.cloneNode(true);
                button.parentNode.replaceChild(newButton, button);
                const answerId = answer.id || `faq-answer-${++faqControlId}`;
                const buttonId = newButton.id || `faq-question-${faqControlId}`;
                answer.id = answerId;
                newButton.id = buttonId;
                newButton.setAttribute('aria-controls', answerId);
                newButton.setAttribute('aria-expanded', String(item.classList.contains('active')));
                answer.setAttribute('role', 'region');
                answer.setAttribute('aria-labelledby', buttonId);

                newButton.addEventListener('click', () => {
                    const isOpen = item.classList.contains('active');

                    // Close all others in the same container
                    faqItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            const otherAnswer = otherItem.querySelector('.faq-answer');
                            const otherIcon = otherItem.querySelector('.fa-plus');
                            const otherTitle = otherItem.querySelector('span');
                            const otherButton = otherItem.querySelector('.faq-question');
                            const otherColor = otherItem.dataset.color || 'text-cyan-400';
                            const otherBorder = otherItem.dataset.border || 'border-cyan-500/30';
                            if (!otherAnswer || !otherIcon || !otherTitle) return;

                            otherItem.classList.remove('active', otherBorder);

                            otherAnswer.style.maxHeight = '0';
                            otherIcon.style.transform = 'rotate(0deg)';
                            otherIcon.classList.remove(otherColor);
                            otherIcon.classList.add('text-gray-400');

                            otherTitle.classList.remove(otherColor);
                            otherButton?.setAttribute('aria-expanded', 'false');
                        }
                    });

                    // Toggle current
                    if (!isOpen) {
                        item.classList.add('active', activeBorderClass);

                        // Select element inside item because we cloned the button
                        const currentAnswer = item.querySelector('.faq-answer');
                        const currentIcon = item.querySelector('.fa-plus');
                        const currentTitle = item.querySelector('span');

                        currentAnswer.style.maxHeight = currentAnswer.scrollHeight + 'px';
                        currentIcon.style.transform = 'rotate(45deg)'; // Rotate to X
                        currentIcon.classList.remove('text-gray-400');
                        currentIcon.classList.add(activeColorClass);

                        currentTitle.classList.add(activeColorClass);
                        newButton.setAttribute('aria-expanded', 'true');
                    } else {
                        item.classList.remove('active', activeBorderClass);

                        const currentAnswer = item.querySelector('.faq-answer');
                        const currentIcon = item.querySelector('.fa-plus');
                        const currentTitle = item.querySelector('span');

                        currentAnswer.style.maxHeight = '0';
                        currentIcon.style.transform = 'rotate(0deg)';
                        currentIcon.classList.add('text-gray-400');
                        currentIcon.classList.remove(activeColorClass);

                        currentTitle.classList.remove(activeColorClass);
                        newButton.setAttribute('aria-expanded', 'false');
                    }
                });
            });
        }

        // Init main page accordion
        initAccordion(document);

        // --- FAQ Modal Logic ---
        const faqModal = document.getElementById('faqModal');
        const viewAllFaqsBtn = document.getElementById('viewAllFaqsBtn');
        const faqModalClose = document.getElementById('faqModalClose');
        const faqModalCloseBtn = document.getElementById('faqModalCloseBtn');
        const faqModalContent = document.getElementById('faqModalContent');

        viewAllFaqsBtn.addEventListener('click', () => {
            // Render all FAQs
            faqModalContent.innerHTML = allFaqs.map(faq => `
                <div class="faq-item spotlight-card rounded-2xl overflow-hidden group hover:border-${faq.color.replace('text-', '')}/30 transition-all duration-300 border border-white/5 bg-white/5" data-color="${faq.color}" data-border="${faq.border}">
                    <button type="button" class="faq-question w-full px-5 py-4 text-left flex justify-between items-center text-gray-200 focus:outline-none">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                                <i class="fas ${faq.icon} text-xs ${faq.color} group-hover:scale-110 transition-transform duration-300"></i>
                            </div>
                            <span class="font-bold text-sm md:text-base group-hover:${faq.color} transition-colors">${faq.question}</span>
                        </div>
                        <i class="fas fa-plus text-xs text-gray-500 transition-transform duration-300 ml-2"></i>
                    </button>
                    <div class="faq-answer max-h-0 overflow-hidden transition-all duration-300 ease-in-out">
                        <div class="px-5 pb-5 pl-[3.25rem] text-gray-400 text-xs md:text-sm leading-relaxed">
                            ${faq.answer}
                        </div>
                    </div>
                </div>
            `).join('');

            // Initialize accordion logic for the new content in the modal
            initAccordion(faqModalContent);
            openModal(faqModal, faqModalClose);
        });

        function closeFaqModal() {
            closeModal(faqModal);
        }

        faqModalClose.addEventListener('click', closeFaqModal);
        faqModalCloseBtn.addEventListener('click', closeFaqModal);

        // Close on outside click
        faqModal.addEventListener('click', (e) => {
             if(e.target === faqModal) closeFaqModal();
        });

        // --- 15. New Modals Logic (Contact & Map) ---

        // Contact Modal
        const contactModal = document.getElementById('contactModal');
        const contactModalClose = document.getElementById('contactModalClose');

        window.openContactModal = function() {
            openModal(contactModal, contactModalClose);
        }

        contactModalClose.addEventListener('click', () => {
            closeModal(contactModal);
        });

        contactModal.addEventListener('click', (e) => {
            if (e.target === contactModal) {
                closeModal(contactModal);
            }
        });

        // Map Modal
        const mapModal = document.getElementById('mapModal');
        const mapModalClose = document.getElementById('mapModalClose');
        const mapThemeToggle = document.getElementById('mapThemeToggle');
        const mapIframe = document.querySelector('#mapModal iframe');

        window.openMapModal = function() {
            openModal(mapModal, mapModalClose);
        }

        mapModalClose.addEventListener('click', () => {
            closeModal(mapModal);
        });

        mapModal.addEventListener('click', (e) => {
            if (e.target === mapModal) {
                closeModal(mapModal);
            }
        });

        // Map Modal Theme Toggle
        if (mapThemeToggle && mapIframe) {
            const mapToggleText = document.getElementById('mapToggleText');

            mapThemeToggle.addEventListener('click', () => {
                // Toggle classes
                if (mapIframe.classList.contains('map-tactical')) {
                    mapIframe.classList.remove('map-tactical');
                    mapIframe.classList.add('map-standard');

                    // Update Button UI
                    mapThemeToggle.innerHTML = '<i class="fas fa-moon text-purple-400"></i> <span class="hidden sm:inline">Tactical View</span>';
                    mapThemeToggle.classList.add('border-purple-500/50', 'bg-purple-500/10');
                    mapThemeToggle.setAttribute('aria-pressed', 'true');
                    mapThemeToggle.setAttribute('aria-label', 'Switch to tactical map view');
                } else {
                    mapIframe.classList.remove('map-standard');
                    mapIframe.classList.add('map-tactical');

                    // Update Button UI
                    mapThemeToggle.innerHTML = '<i class="fas fa-layer-group"></i> <span class="hidden sm:inline">Standard View</span>';
                    mapThemeToggle.classList.remove('border-purple-500/50', 'bg-purple-500/10');
                    mapThemeToggle.setAttribute('aria-pressed', 'false');
                    mapThemeToggle.setAttribute('aria-label', 'Switch to standard map view');
                }
            });
        }

        document.addEventListener('keydown', (event) => {
            const activeModal = document.querySelector('.service-modal.active');
            if (!activeModal) return;

            if (event.key === 'Escape') {
                event.preventDefault();
                closeModal(activeModal);
                return;
            }

            if (event.key !== 'Tab') return;

            const focusable = getFocusableElements(activeModal);
            if (!focusable.length) {
                event.preventDefault();
                return;
            }

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        });

        // --- 16. Mobile Auto-Scroll for Testimonials (Refined) ---
        function initMobileAutoScroll() {
            const container = document.getElementById('testimonialMarquee');
            const dotsContainer = document.getElementById('testimonialDots');
            if (!container) return;

            if (container._testimonialAbortController) {
                container._testimonialAbortController.abort();
                delete container._testimonialAbortController;
            }
            if (container.dataset.scrollInterval) {
                clearInterval(Number(container.dataset.scrollInterval));
                delete container.dataset.scrollInterval;
            }
            if (container.dataset.scrollRestartTimeout) {
                clearTimeout(Number(container.dataset.scrollRestartTimeout));
                delete container.dataset.scrollRestartTimeout;
            }

            // Check if mobile
            const isMobile = window.matchMedia('(max-width: 768px)').matches;

            if (!isMobile) {
                if (dotsContainer) dotsContainer.innerHTML = '';
                return;
            }

            const intervalTime = 3500; // Time to read card

            // --- NEW: Dots Setup ---
            const cards = container.querySelectorAll('.spotlight-card:not([aria-hidden="true"])');
            const originalCount = cards.length;
            if (!originalCount) {
                if (dotsContainer) dotsContainer.innerHTML = '';
                return;
            }

            const controller = new AbortController();
            const { signal } = controller;
            container._testimonialAbortController = controller;

            function clearRestartTimer() {
                if (container.dataset.scrollRestartTimeout) {
                    clearTimeout(Number(container.dataset.scrollRestartTimeout));
                    delete container.dataset.scrollRestartTimeout;
                }
            }

            function getItemStride() {
                const track = container.querySelector('.marquee-track');
                if (!track || !cards[0]) return 0;
                const gap = parseFloat(window.getComputedStyle(track).gap) || 20;
                return cards[0].offsetWidth + gap;
            }

            // Clear existing dots
            if (dotsContainer) {
                dotsContainer.innerHTML = '';
                // Create dots
                for (let i = 0; i < originalCount; i++) {
                    const dot = document.createElement('div');
                    dot.className = `h-1.5 rounded-full transition-all duration-300 cursor-pointer ${i === 0 ? 'w-6 bg-cyan-400' : 'w-1.5 bg-white/20'}`;
                    // Click to scroll logic
                    dot.addEventListener('click', () => {
                        const stride = getItemStride();
                        if (!stride) return;

                        container.scrollTo({ left: stride * i, behavior: 'smooth' });
                        // Pause auto-scroll briefly after manual interaction
                        stopAutoScroll();
                        scheduleAutoScroll();
                    }, { signal });
                    dotsContainer.appendChild(dot);
                }
            }

            function updateDots() {
                if (!dotsContainer || !cards.length) return;

                const stride = getItemStride();
                if (!stride) return;

                const scrollLeft = container.scrollLeft;
                // Calculate active index (wrapping around total width logic used in infinite scroll)
                const rawIndex = Math.round(scrollLeft / stride);
                const activeIndex = ((rawIndex % originalCount) + originalCount) % originalCount;

                const dots = dotsContainer.children;
                Array.from(dots).forEach((dot, idx) => {
                    if (idx === activeIndex) {
                        dot.className = 'h-1.5 rounded-full transition-all duration-300 cursor-pointer w-6 bg-cyan-400';
                    } else {
                        dot.className = 'h-1.5 rounded-full transition-all duration-300 cursor-pointer w-1.5 bg-white/20';
                    }
                });
            }

            // Bind scroll event for real-time updates
            container.addEventListener('scroll', updateDots, { passive: true, signal });


            function startAutoScroll() {
                if (container.dataset.scrollInterval) clearInterval(Number(container.dataset.scrollInterval));
                clearRestartTimer();

                const id = setInterval(() => {
                    const track = container.querySelector('.marquee-track');
                    const allCards = container.querySelectorAll('.spotlight-card');
                    // We need allCards to measure total width properly for loop logic

                    if (!track || allCards.length === 0) return;

                    const cardWidth = allCards[0].offsetWidth;
                    const gap = parseFloat(window.getComputedStyle(track).gap) || 16;
                    const itemStride = cardWidth + gap;

                    // The point where clones begin
                    const resetPoint = itemStride * originalCount;

                    // Current position
                    let currentScroll = container.scrollLeft;

                    // Infinite Loop Logic:
                    // If current scroll is beyond the reset point (showing clones)
                    if (resetPoint > 0 && currentScroll >= resetPoint) {
                        // Jump back instantly to the equivalent original card
                        container.scrollTo({
                            left: currentScroll - resetPoint,
                            behavior: 'auto'
                        });
                        // Update currentScroll var to new position
                        currentScroll = currentScroll - resetPoint;
                    }

                    // Now scroll forward to the next item
                    // We calculate the nearest snap point to ensure alignment
                    const nextSnap = Math.round((currentScroll + itemStride) / itemStride) * itemStride;

                    container.scrollTo({
                        left: nextSnap,
                        behavior: 'smooth'
                    });

                }, intervalTime);

                container.dataset.scrollInterval = id.toString();
            }

            function stopAutoScroll() {
                if (container.dataset.scrollInterval) {
                    clearInterval(Number(container.dataset.scrollInterval));
                    delete container.dataset.scrollInterval;
                }
                clearRestartTimer();
            }

            function scheduleAutoScroll() {
                clearRestartTimer();
                const timer = setTimeout(startAutoScroll, 4000);
                container.dataset.scrollRestartTimeout = timer.toString();
            }

            // Interaction Handlers
            // Pause on touch
            container.addEventListener('touchstart', stopAutoScroll, { passive: true, signal });

            // Resume on touch end
            container.addEventListener('touchend', () => {
                // Determine restart delay based on scroll velocity (simplified to fixed delay)
                scheduleAutoScroll();
            }, { passive: true, signal });

            startAutoScroll();
        }

        // Initialize on load
        window.addEventListener('load', initMobileAutoScroll);

        // Handle Resize (Debounced)
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(initMobileAutoScroll, 200);
        });

        // --- 17. UI Refinement Micro-Interactions ---
        (() => {
            const canUseFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
            const reduceMotion = prefersReducedMotion;
            document.body.classList.add('ui-ready');

            const menuButton = document.getElementById('mobileMenuBtn');
            const menu = document.getElementById('mobile-menu');
            const closeMobileMenuIfOpen = () => {
                if (!menu || menu.classList.contains('hidden')) return;
                if (typeof toggleMobileMenu === 'function') toggleMobileMenu();
            };

            document.addEventListener('click', (event) => {
                if (!menu || !menuButton || menu.classList.contains('hidden')) return;
                if (!menu.contains(event.target) && !menuButton.contains(event.target)) {
                    closeMobileMenuIfOpen();
                }
            });

            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape') closeMobileMenuIfOpen();
            });

            const projectFields = document.querySelectorAll('#projectBriefForm input, #projectBriefForm select, #projectBriefForm textarea');
            projectFields.forEach(field => {
                const syncFilledState = () => {
                    field.classList.toggle('is-filled', String(field.value || '').trim().length > 0);
                };
                field.addEventListener('input', syncFilledState);
                field.addEventListener('change', syncFilledState);
                syncFilledState();
            });

            const rippleSelector = [
                '.magnetic-btn',
                '.portfolio-filter',
                '.portfolio-project-btn',
                '.service-detail-btn',
                '.faq-question',
                '.command-k-btn',
                '#mobileMenuBtn',
                '#backToTop',
                '.pukka-ai-chip',
                '.pukka-ai-send',
                '.pukka-ai-action'
            ].join(',');

            document.addEventListener('pointerdown', (event) => {
                const target = event.target.closest(rippleSelector);
                if (!target || reduceMotion || target.disabled || event.button > 0) return;

                const rect = target.getBoundingClientRect();
                const ripple = document.createElement('span');
                const size = Math.max(rect.width, rect.height) * 2.15;

                target.classList.add('ux-ripple-host');
                ripple.className = 'ux-ripple';
                ripple.style.setProperty('--ripple-x', `${event.clientX - rect.left}px`);
                ripple.style.setProperty('--ripple-y', `${event.clientY - rect.top}px`);
                ripple.style.setProperty('--ripple-size', `${size}px`);

                const staleRipples = target.querySelectorAll('.ux-ripple');
                if (staleRipples.length > 2) staleRipples[0].remove();

                target.appendChild(ripple);
                ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
            }, { passive: true });

            if (!canUseFinePointer || reduceMotion) return;

            const cursorSpotlight = document.createElement('div');
            cursorSpotlight.className = 'ux-cursor-spotlight';
            cursorSpotlight.setAttribute('aria-hidden', 'true');
            document.body.appendChild(cursorSpotlight);

            let cursorX = window.innerWidth / 2;
            let cursorY = window.innerHeight / 2;
            let cursorFrame = 0;

            function paintCursorSpotlight() {
                cursorSpotlight.style.setProperty('--cursor-x', `${cursorX}px`);
                cursorSpotlight.style.setProperty('--cursor-y', `${cursorY}px`);
                cursorFrame = 0;
            }

            document.addEventListener('pointermove', (event) => {
                if (event.pointerType !== 'mouse') return;
                cursorX = event.clientX;
                cursorY = event.clientY;
                document.body.classList.add('cursor-active');
                if (!cursorFrame) cursorFrame = requestAnimationFrame(paintCursorSpotlight);
            }, { passive: true });

            document.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-active');
            });

            window.addEventListener('blur', () => {
                document.body.classList.remove('cursor-active');
            });

            const tiltSelector = '.spotlight-card, .portfolio-card';
            const resetTilt = (card) => {
                card.style.setProperty('--tilt-x', '0deg');
                card.style.setProperty('--tilt-y', '0deg');
            };

            document.addEventListener('pointermove', (event) => {
                if (event.pointerType !== 'mouse') return;
                const card = event.target.closest(tiltSelector);
                if (!card || card.closest('.service-modal.active')) return;

                const rect = card.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                const tiltX = ((0.5 - y / rect.height) * 5.5).toFixed(2);
                const tiltY = ((x / rect.width - 0.5) * 5.5).toFixed(2);

                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
                card.style.setProperty('--tilt-x', `${tiltX}deg`);
                card.style.setProperty('--tilt-y', `${tiltY}deg`);
            }, { passive: true });

            document.addEventListener('pointerout', (event) => {
                const card = event.target.closest(tiltSelector);
                const relatedTarget = event.relatedTarget;
                if (!card || (relatedTarget instanceof Node && card.contains(relatedTarget))) return;
                resetTilt(card);
            });
        })();
