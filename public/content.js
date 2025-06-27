
// EduFocus Extension - Content Script for YouTube
class EduFocusContent {
    constructor() {
        this.isNightMode = false;
        this.isDistractionWarningEnabled = true;
        this.currentSubject = '';
        this.subjectKeywords = [];
        this.isStudyMode = false;
        
        // Educational keywords for distraction detection
        this.educationalKeywords = [
            'tutorial', 'lesson', 'learn', 'education', 'study', 'course', 'lecture',
            'how to', 'explained', 'guide', 'teaching', 'academic', 'university',
            'college', 'school', 'math', 'science', 'history', 'programming',
            'coding', 'physics', 'chemistry', 'biology', 'literature', 'language'
        ];
        
        this.distractingKeywords = [
            'funny', 'meme', 'prank', 'reaction', 'tiktok', 'vine', 'comedy',
            'entertainment', 'gossip', 'drama', 'celebrity', 'music video',
            'gaming', 'gameplay', 'unboxing', 'vlog', 'haul'
        ];

        this.init();
    }

    async init() {
        console.log('EduFocus Content Script Loaded');
        
        // Load settings
        await this.loadSettings();
        
        // Set up message listener
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            this.handleMessage(message);
        });

        // Monitor page changes (YouTube is a SPA)
        this.observePageChanges();
        
        // Initial check
        this.checkCurrentPage();
    }

    async loadSettings() {
        const settings = await chrome.storage.local.get([
            'nightMode', 
            'distractionWarning', 
            'selectedSubject'
        ]);
        
        this.isNightMode = settings.nightMode || false;
        this.isDistractionWarningEnabled = settings.distractionWarning !== false;
        this.currentSubject = settings.selectedSubject || '';
        
        if (this.isNightMode) {
            this.applyNightMode();
        }
    }

    handleMessage(message) {
        switch (message.action) {
            case 'toggleNightMode':
                this.isNightMode = message.enabled;
                if (message.enabled) {
                    this.applyNightMode();
                } else {
                    this.removeNightMode();
                }
                break;
                
            case 'toggleDistractionWarning':
                this.isDistractionWarningEnabled = message.enabled;
                break;
                
            case 'updateFilter':
                this.currentSubject = message.subject;
                this.subjectKeywords = message.keywords || [];
                this.applySubjectFilter();
                break;
                
            case 'timerStarted':
                this.isStudyMode = true;
                this.showStudyModeIndicator(message.isBreak);
                break;
        }
    }

    observePageChanges() {
        // Watch for URL changes
        let currentUrl = location.href;
        
        const observer = new MutationObserver(() => {
            if (location.href !== currentUrl) {
                currentUrl = location.href;
                setTimeout(() => this.checkCurrentPage(), 1000);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Also check when new content loads
        setInterval(() => this.checkCurrentPage(), 3000);
    }

    checkCurrentPage() {
        if (location.pathname === '/watch') {
            this.handleVideoPage();
        } else if (location.pathname === '/' || location.pathname.includes('/results')) {
            this.applySubjectFilter();
        }
    }

    handleVideoPage() {
        // Check if current video is educational
        setTimeout(() => {
            const title = document.querySelector('h1.title yt-formatted-string, h1.ytd-video-primary-info-renderer yt-formatted-string')?.textContent || '';
            const description = document.querySelector('#description yt-formatted-string, .ytd-video-secondary-info-renderer #description')?.textContent || '';
            
            if (this.isDistractionWarningEnabled && !this.isEducational(title, description)) {
                this.showDistractionWarning(title);
            }
        }, 2000);
    }

    isEducational(title, description) {
        const content = (title + ' ' + description).toLowerCase();
        
        // Check for educational keywords
        const hasEducationalKeywords = this.educationalKeywords.some(keyword => 
            content.includes(keyword.toLowerCase())
        );
        
        // Check for distracting keywords
        const hasDistractingKeywords = this.distractingKeywords.some(keyword => 
            content.includes(keyword.toLowerCase())
        );
        
        // If it has educational keywords and no distracting ones, it's educational
        // If it has more educational than distracting keywords, it's educational
        return hasEducationalKeywords && !hasDistractingKeywords;
    }

    showDistractionWarning(videoTitle) {
        // Remove existing warning
        const existingWarning = document.getElementById('edufocus-warning');
        if (existingWarning) {
            existingWarning.remove();
        }

        // Create warning overlay
        const warning = document.createElement('div');
        warning.id = 'edufocus-warning';
        warning.innerHTML = `
            <div class="edufocus-warning-overlay">
                <div class="edufocus-warning-content">
                    <div class="edufocus-warning-icon">⚠️</div>
                    <h2>Stay Focused on Your Studies!</h2>
                    <p>This video might not be educational content.</p>
                    <p class="edufocus-video-title">"${videoTitle.substring(0, 50)}${videoTitle.length > 50 ? '...' : ''}"</p>
                    <div class="edufocus-warning-buttons">
                        <button id="edufocus-continue" class="edufocus-btn edufocus-btn-continue">
                            Continue Anyway
                        </button>
                        <button id="edufocus-back" class="edufocus-btn edufocus-btn-back">
                            Back to Learning
                        </button>
                    </div>
                    <div class="edufocus-motivation">
                        <p>💡 Consider searching for educational content related to your studies instead!</p>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(warning);

        // Add event listeners
        document.getElementById('edufocus-continue').addEventListener('click', () => {
            warning.remove();
        });

        document.getElementById('edufocus-back').addEventListener('click', () => {
            warning.remove();
            window.history.back();
        });

        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (document.getElementById('edufocus-warning')) {
                warning.remove();
            }
        }, 10000);
    }

    applySubjectFilter() {
        if (!this.currentSubject || this.subjectKeywords.length === 0) {
            return;
        }

        setTimeout(() => {
            // Filter homepage videos
            const videoElements = document.querySelectorAll('ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer');
            
            videoElements.forEach(element => {
                const titleElement = element.querySelector('#video-title, .ytd-video-meta-block #video-title');
                const title = titleElement?.textContent?.toLowerCase() || '';
                
                const isRelevant = this.subjectKeywords.some(keyword => 
                    title.includes(keyword.toLowerCase())
                );

                if (!isRelevant) {
                    element.style.opacity = '0.3';
                    element.style.filter = 'grayscale(100%)';
                    element.style.pointerEvents = 'none';
                } else {
                    element.style.opacity = '1';
                    element.style.filter = 'none';
                    element.style.pointerEvents = 'auto';
                }
            });
        }, 1000);
    }

    applyNightMode() {
        // Remove existing night mode styles
        const existingStyles = document.getElementById('edufocus-night-mode');
        if (existingStyles) {
            existingStyles.remove();
        }

        // Add night mode styles
        const nightModeStyles = document.createElement('style');
        nightModeStyles.id = 'edufocus-night-mode';
        nightModeStyles.textContent = `
            /* Night Mode Styles */
            html, body {
                background-color: #1a1a1a !important;
                color: #e0e0e0 !important;
            }
            
            #masthead, #masthead-container {
                background-color: #2d2d2d !important;
            }
            
            #container, #primary, #secondary {
                background-color: #1a1a1a !important;
            }
            
            ytd-watch-flexy[theater] #primary.ytd-watch-flexy {
                background-color: #1a1a1a !important;
            }
            
            .ytd-video-primary-info-renderer, .ytd-video-secondary-info-renderer {
                background-color: #2d2d2d !important;
                color: #e0e0e0 !important;
            }
            
            #meta h1, #meta #description, .ytd-channel-name a {
                color: #e0e0e0 !important;
            }
            
            #comments {
                background-color: #2d2d2d !important;
            }
            
            ytd-comment-thread-renderer, ytd-comment-renderer {
                background-color: #2d2d2d !important;
                color: #e0e0e0 !important;
            }
            
            .ytd-rich-grid-renderer, .ytd-item-section-renderer {
                background-color: #1a1a1a !important;
            }
            
            ytd-rich-item-renderer, ytd-video-renderer {
                background-color: #2d2d2d !important;
            }
            
            #video-title {
                color: #ffffff !important;
            }
            
            .style-scope ytd-video-meta-block #metadata-line span {
                color: #b0b0b0 !important;
            }
        `;
        
        document.head.appendChild(nightModeStyles);
    }

    removeNightMode() {
        const nightModeStyles = document.getElementById('edufocus-night-mode');
        if (nightModeStyles) {
            nightModeStyles.remove();
        }
    }

    showStudyModeIndicator(isBreak) {
        // Remove existing indicator
        const existingIndicator = document.getElementById('edufocus-study-indicator');
        if (existingIndicator) {
            existingIndicator.remove();
        }

        // Create study mode indicator
        const indicator = document.createElement('div');
        indicator.id = 'edufocus-study-indicator';
        indicator.innerHTML = `
            <div class="edufocus-study-badge">
                ${isBreak ? '☕ Break Time' : '📚 Study Mode Active'}
            </div>
        `;

        document.body.appendChild(indicator);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (document.getElementById('edufocus-study-indicator')) {
                indicator.remove();
            }
        }, 5000);
    }
}

// Initialize content script
new EduFocusContent();
