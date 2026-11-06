/** Pukka Gen studio content — rebuilt presentation, original editorial substance preserved. */
export type Card = { title: string; body: string };
function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char] ?? char));
}
function buildInsightContent(intro: string, points: Card[]): string {
  return '<p>' + escapeHtml(intro) + '</p><div class="article-points">' +
    points.map(point => '<section><h4>' + escapeHtml(point.title) + '</h4><p>' + escapeHtml(point.body) + '</p></section>').join('') + '</div>';
}

export const serviceDetails = {
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

export const portfolioDetails = {
            ops: {
                index: "01",
                title: "Operations Command Center",
                eyebrow: "AI + SaaS",
                theme: "cyan",
                image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80",
                description: "A realtime coordination dashboard that unifies task intake, team workload, AI-assisted triage, and executive reporting in one operational view.",
                context: "Disconnected tools and handoffs made it difficult for teams to see priority, ownership, and operational risk in real time.",
                role: "Product strategy · UX/UI · Full-stack engineering · Cloud delivery",
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
                index: "02",
                title: "Fintech Trust Portal",
                eyebrow: "Security + Cloud",
                theme: "green",
                image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1400&q=80",
                description: "A hardened customer portal for account onboarding, payment activity, admin controls, and compliance-friendly audit review.",
                context: "The platform needed to make high-trust financial actions feel simple while maintaining strict access, audit, and release controls.",
                role: "Experience design · Application security · Platform engineering · QA",
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
                index: "03",
                title: "Healthcare Flow Engine",
                eyebrow: "UX + AI",
                theme: "pink",
                image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1400&q=80",
                description: "A patient-facing booking and care workflow platform that helps clinics reduce friction across intake, routing, reminders, and follow-up.",
                context: "Patients and staff were navigating fragmented steps across booking, intake, reminders, and follow-up, creating avoidable delay and drop-off.",
                role: "Service design · UX research · Automation · Front-end engineering",
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
                index: "04",
                title: "Learning Studio",
                eyebrow: "Design + SaaS",
                theme: "purple",
                image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80",
                description: "A polished learning portal with content tooling, cohort management, progress tracking, and responsive lesson experiences.",
                context: "Content teams needed a faster publishing workflow while learners needed a calmer, mobile-first path through lessons and progress.",
                role: "Product design · Design system · Front-end engineering · Analytics",
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
                index: "05",
                title: "Cloud Migration Map",
                eyebrow: "Cloud + Security",
                theme: "blue",
                image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=84",
                fallbackImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=84",
                description: "A phased migration program with release gates, observability, failover planning, cost visibility, and clear cutover discipline.",
                context: "A high-risk legacy estate required a migration path that protected continuity, made cost visible, and gave every cutover a safe rollback.",
                role: "Cloud architecture · DevSecOps · Observability · Migration planning",
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
                index: "06",
                title: "AI Support Desk",
                eyebrow: "AI Operations",
                theme: "yellow",
                image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1400&q=80",
                description: "An assisted support layer that classifies tickets, drafts replies, escalates risk, and keeps the knowledge base improving over time.",
                context: "Support volume was outpacing manual triage, but sensitive customer decisions still needed clear human ownership and control.",
                role: "AI workflow design · Integration engineering · Admin UX · Evaluation",
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
            },
            field: {
                index: "07",
                title: "Field Service Mobile Suite",
                eyebrow: "Mobile + Cloud",
                theme: "teal",
                image: "https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&w=1400&q=80",
                description: "An offline-ready field service workflow for scheduling, site records, proof of work, inventory notes, and faster job closeout.",
                context: "Field teams were relying on paper records and scattered messages, leaving dispatchers without reliable status and creating avoidable return visits.",
                role: "Mobile product design · Offline architecture · Cloud integration · QA",
                metrics: [
                    { value: "36%", label: "fewer repeat visits" },
                    { value: "2.4×", label: "faster closeout" },
                    { value: "4", label: "field roles" }
                ],
                outcomes: [
                    "Offline-first job records and site checklists",
                    "Photo, signature, and proof-of-work capture",
                    "Live scheduling and technician status for dispatch",
                    "Automatic sync with conflict-safe recovery"
                ],
                stack: ["Flutter", "Node.js", "PostgreSQL", "Azure", "Maps"]
            },
            commerce: {
                index: "08",
                title: "Commerce Growth Platform",
                eyebrow: "Commerce + AI",
                theme: "orange",
                image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1400&q=80",
                description: "A responsive commerce experience and merchandising system shaped around faster product discovery, checkout, and campaign iteration.",
                context: "A slow storefront and rigid content workflow were limiting conversion while making every merchandising change depend on engineering support.",
                role: "Commerce strategy · UX/UI · Full-stack engineering · Experimentation",
                metrics: [
                    { value: "27%", label: "checkout lift" },
                    { value: "41%", label: "faster campaigns" },
                    { value: "1.7s", label: "median page load" }
                ],
                outcomes: [
                    "Faster search, filtering, and product discovery",
                    "Streamlined mobile checkout and payment flows",
                    "Flexible campaign tooling for merchandising teams",
                    "AI-assisted product tagging with human review"
                ],
                stack: ["Next.js", "Shopify", "Node.js", "OpenAI", "Analytics"]
            }
        };

export const techDetails = {
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

export const blogDetails = {
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
                            <a href="#contact" data-close-service-modal="true" class="inline-flex items-center px-6 py-3 md:px-8 md:py-4 bg-cyan-500 text-black font-bold rounded-full hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:scale-105 relative z-10 text-xs md:text-base">
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

export const allFaqs = [
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

export const studio = {
  name: "Pukka Gen",
  motto: "No Duff.",
  tagline: "Authentic Engineering. Next-Gen Solutions.",
  intro: "We exist to build software that is solid enough to rely on today, yet advanced enough to lead you into tomorrow.",
  about: "At Pukka Gen, we blend decades of enterprise experience with cutting-edge innovation. In an industry crowded with buzzwords, we stand for something permanent: Quality.",
  mission: "To empower businesses with software solutions that are authentically robust, intuitively designed, and generationally advanced.",
  vision: "To be the global benchmark for digital integrity, bridging the gap between current reliability and future possibility.",
  quote: "Code should be clean. Systems should be scalable. Technology should be human-centric.",
  promise: "We believe in code that is genuine, solid, and reliable. No fluff. No shortcuts. Just Pukka software.",
  email: "mail@pukkagennoduff.com",
  phone: "+254 757 885 101",
  tel: "+254757885101",
  whatsapp: "https://wa.me/254757885101",
  location: "Mombasa, Kenya",
  map: "https://maps.google.com/?q=Abuhureira+Academy,+Mombasa",
  hours: ["Monday – Friday: 09:00 – 18:00", "Saturday: 10:00 – 16:00", "Sunday: Closed"],
  socials: [
    {label:"LinkedIn",url:"https://www.linkedin.com/company/pukkagennoduff/"},
    {label:"Instagram",url:"https://www.instagram.com/pukkagennoduff"},
    {label:"Facebook",url:"https://www.facebook.com/share/1LfH2hrHnj/"},
    {label:"X",url:"https://x.com/pukkagennoduff"}
  ]
} as const;

export const values = [
  {number:"01",title:"Radical Authenticity",body:"Transparency over transaction. We don't sell features you don't need."},
  {number:"02",title:"Future-Proof Engineering",body:"Flexible architectures that evolve as technology shifts."},
  {number:"03",title:"User-Obsessed Design",body:"We build for humans, not just machines. Complex code, simple experiences."},
  {number:"04",title:"Collaborative Intelligence",body:"Clients are partners. Your vision + our expertise = extraordinary results."}
] as const;

export const serviceSummaries: {key:keyof typeof serviceDetails; title:string; category:string; body:string; symbol:string}[] = [
  {key:"software",title:"Web & Mobile Development",category:"Digital products",body:"High-performance websites, progressive web apps and native or cross-platform mobile experiences.",symbol:"⌘"},
  {key:"ai",title:"AI & Intelligent Automation",category:"Intelligent systems",body:"Generative AI, predictive analytics and workflow automation designed around measurable outcomes.",symbol:"✳"},
  {key:"cloud",title:"Cloud Strategy & DevOps",category:"Infrastructure",body:"Cloud migration, CI/CD pipelines, container operations and dependable platform engineering.",symbol:"☁"},
  {key:"design",title:"Product Design (UI/UX)",category:"Human experience",body:"Research-led interfaces, accessible design systems and prototypes that make complex work feel simple.",symbol:"◈"},
  {key:"security",title:"QA & Cybersecurity",category:"Trust & quality",body:"Automated testing, security audits, penetration testing and resilient DevSecOps practices.",symbol:"⬡"},
  {key:"consultancy",title:"Consultancy & Strategy",category:"Decision support",body:"Technology roadmaps, architectural reviews and practical guidance aligned to your business goals.",symbol:"↗"}
];

export const delivery = [
 {number:"01",title:"No-Duff Discovery",subtitle:"Consultation",quote:"We don’t start coding until we understand the why.",body:"Clarify the business problem, target audience, constraints and real objectives.",output:"A precise project scope, costs and responsibilities."},
 {number:"02",title:"The Blueprint",subtitle:"UI/UX design",quote:"Measure twice, cut once.",body:"Wireframes, user journeys and high-fidelity interactive prototypes before engineering begins.",output:"Interactive prototypes and a design system."},
 {number:"03",title:"The Build",subtitle:"Agile development",quote:"Solid engineering, delivered in sprints.",body:"Deliver working software in two-week cycles with demos and transparent progress.",output:"A staging environment for active review."},
 {number:"04",title:"Fortification",subtitle:"QA & security",quote:"If it’s not Pukka, it doesn’t ship.",body:"Test performance, security vulnerabilities, usability and device responsiveness.",output:"A verified release candidate with documented checks."},
 {number:"05",title:"Deployment",subtitle:"DevOps & support",quote:"Launch day is just Day One.",body:"Configure hosting, domains, releases and ongoing maintenance.",output:"A live product with documented operational support."}
];

export const audiences = [
  {tag:"For founders",title:"Non-Technical Founders",body:"You have the vision; we provide the engine. From a napkin sketch to app-store launch, without the jargon.",tags:["MVP development","Tech strategy","Investor-ready code"]},
  {tag:"For growing businesses",title:"Growing SMEs",body:"Modernize legacy systems, automate operations and prepare technology for sustainable revenue growth.",tags:["Digital transformation","Process automation","Cloud migration"]},
  {tag:"For established teams",title:"Enterprise Leaders",body:"Specialist DevOps, AI and security capabilities for robust, compliant, high-stakes digital platforms.",tags:["Team augmentation","Security audits","Microservices"]}
];

export const sectors = ["Corporate", "Finance", "Government", "Education", "Health", "Other sectors"];

export const testimonials = [
  {metric:"40% efficiency boost",quote:"Pukka Gen delivered exactly what they promised — no duff, no shortcuts. Their team transformed our legacy system into a modern, scalable platform that has drastically improved our operations.",name:"Sarah Johnson",role:"CTO, TechForward"},
  {metric:"99.99% uptime",quote:"We were drowning in technical debt. Pukka Gen didn't just patch it; they re-engineered our core. Our uptime went from spotty to a solid 99.99% in just three months.",name:"David Chen",role:"Founder, StreamLine"},
  {metric:"2.5× revenue growth",quote:"Finally, a dev team that speaks business. They stopped us from building useless features and focused on what actually drives revenue. The clarity was refreshing.",name:"Emily Davis",role:"Product, EnterpriseX"},
  {metric:"Zero breaches",quote:"In FinTech, trust is everything. Pukka Gen's security-first architecture gave us the confidence to scale safely. They don't just write code; they fortify it.",name:"Michael Ochieng",role:"CISO, FinSecure"},
  {metric:"Market ready in 8 weeks",quote:"We needed to beat competitors to market. Their agile process was intense but effective. We went from concept to live users in record time without breaking things.",name:"Lisa Ray",role:"Founder, QuickCart"},
  {metric:"5M+ daily users",quote:"Scaling was our nightmare until Pukka Gen stepped in. They re-architected our backend to handle massive traffic spikes effortlessly. True heavy-lifting engineering.",name:"James Wu",role:"VP Engineering, EduGlobal"}
];
export const team = [
  {name:"Karim Nyambok Omar",role:"Founder, Pukka Gen Solutions",focus:"Full-Stack · DevSecOps · AI/ML",bio:"A multidisciplinary engineer blending full-stack development, DevSecOps, AI/ML and cloud engineering into scalable, secure digital products. His work connects complex technical decisions to long-term business value.",email:"karim@pukkagennoduff.com",tags:["System architecture","Cloud native"]},
  {name:"Mufasa Khan (KuduKhan)",role:"Cybersecurity Specialist",focus:"Pentester · Researcher · Engineer",bio:"A cybersecurity specialist focused on discovering and remediating weaknesses before they become real threats. His approach combines penetration testing, security research and methodical cyber defence.",email:"mufasa@pukkagennoduff.com",tags:["Offensive security","Threat intelligence"]}
];
export const disciplines = [
 {title:"Architects",subtitle:"Core infrastructure",body:"Senior engineers building secure, scalable, highly available systems."},
 {title:"Creatives",subtitle:"UI/UX & design",body:"Designers bridging human needs with elegant, intuitive digital experiences."},
 {title:"Strategists",subtitle:"Product & growth",body:"Consultants turning business objectives into clear technical roadmaps."}
];
export const techGroups = [
 {title:"Product & frontend",items:["React","Angular","Vue.js","TypeScript","Flutter","Swift","Figma","Adobe XD","Sketch"]},
 {title:"Platforms & intelligence",items:["Node.js","Python","Java","C#",".NET","Go","MongoDB","PostgreSQL","Redis","TensorFlow","PyTorch","OpenAI"]},
 {title:"Cloud, DevOps & quality",items:["AWS","Azure","Google Cloud","Docker","Kubernetes","Terraform","Jenkins","Git","GitLab","Selenium","Cypress","Jira"]}
];
export const checklist = [
  "What single expensive problem will this software solve?",
  "Who is the Day One user?",
  "What is the smallest viable first release?",
  "Does the contract clearly assign code and IP ownership to you?",
  "Are your brand assets, copy and product content ready?",
  "Have you budgeted for hosting, maintenance and post-launch support?",
  "Who has final decision authority?",
  "Is the delivery timeline realistic?",
  "Do you need a native mobile app or will a responsive web app solve it?",
  "What measurable outcome defines done?"
] as const;
