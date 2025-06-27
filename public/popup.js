// EduFocus Extension - Popup Script
class EduFocusPopup {
    constructor() {
        this.timer = {
            minutes: 25,
            seconds: 0,
            isRunning: false,
            isBreak: false,
            interval: null
        };
        
        this.motivationalTips = [
            "💡 Tip: Take deep breaths and focus on one topic at a time",
            "🎯 Remember: Small consistent steps lead to big achievements",
            "🧠 Focus Tip: Eliminate distractions for better concentration",
            "⭐ You're doing great! Stay consistent with your learning",
            "🔥 Every minute of focused study brings you closer to your goals",
            "🌟 Break complex topics into smaller, manageable chunks",
            "💪 Your future self will thank you for studying today",
            "🎓 Learning is a journey, not a destination. Enjoy the process!"
        ];
        
        this.subjectKeywords = {
            'math': ['mathematics', 'algebra', 'calculus', 'geometry', 'statistics', 'trigonometry', 'equation', 'math'],
            'science': ['science', 'scientific', 'experiment', 'research', 'discovery', 'theory'],
            'coding': ['programming', 'coding', 'javascript', 'python', 'java', 'html', 'css', 'react', 'tutorial', 'development'],
            'history': ['history', 'historical', 'ancient', 'war', 'civilization', 'timeline', 'documentary'],
            'language': ['language', 'grammar', 'vocabulary', 'speaking', 'pronunciation', 'lesson'],
            'physics': ['physics', 'quantum', 'mechanics', 'energy', 'force', 'motion', 'relativity'],
            'chemistry': ['chemistry', 'chemical', 'reaction', 'molecule', 'atom', 'periodic', 'compound'],
            'biology': ['biology', 'cell', 'genetics', 'evolution', 'organism', 'anatomy', 'ecosystem'],
            'literature': ['literature', 'poetry', 'novel', 'author', 'writing', 'literary', 'book'],
            'economics': ['economics', 'economic', 'market', 'finance', 'business', 'trade', 'money']
        };

        this.init();
    }

    async init() {
        await this.loadSettings();
        this.setupEventListeners();
        this.updateTimerDisplay();
        this.loadNotes();
        this.updateMotivationTip();
    }

    setupEventListeners() {
        // Timer controls
        document.getElementById('start-timer').addEventListener('click', () => this.startTimer());
        document.getElementById('pause-timer').addEventListener('click', () => this.pauseTimer());
        document.getElementById('reset-timer').addEventListener('click', () => this.resetTimer());

        // Subject filter
        document.getElementById('subject-filter').addEventListener('change', (e) => this.updateSubjectFilter(e.target.value));

        // Settings toggles
        document.getElementById('night-mode-toggle').addEventListener('change', (e) => this.toggleNightMode(e.target.checked));
        document.getElementById('distraction-warning').addEventListener('change', (e) => this.toggleDistractionWarning(e.target.checked));

        // Notes functionality
        document.getElementById('save-note').addEventListener('click', () => this.saveNote());
        document.getElementById('note-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                this.saveNote();
            }
        });
    }

    async loadSettings() {
        const settings = await chrome.storage.local.get(['nightMode', 'distractionWarning', 'selectedSubject']);
        
        if (settings.nightMode) {
            document.getElementById('night-mode-toggle').checked = true;
        }
        
        if (settings.distractionWarning !== false) {
            document.getElementById('distraction-warning').checked = true;
        }
        
        if (settings.selectedSubject) {
            document.getElementById('subject-filter').value = settings.selectedSubject;
            this.updateFilterStatus(settings.selectedSubject);
        }
    }

    // Timer Functions
    startTimer() {
        this.timer.isRunning = true;
        document.getElementById('start-timer').disabled = true;
        document.getElementById('pause-timer').disabled = false;
        
        this.timer.interval = setInterval(() => {
            if (this.timer.seconds === 0) {
                if (this.timer.minutes === 0) {
                    this.timerComplete();
                    return;
                }
                this.timer.minutes--;
                this.timer.seconds = 59;
            } else {
                this.timer.seconds--;
            }
            this.updateTimerDisplay();
        }, 1000);

        this.sendMessageToContent({
            action: 'timerStarted',
            isBreak: this.timer.isBreak
        });
    }

    pauseTimer() {
        this.timer.isRunning = false;
        document.getElementById('start-timer').disabled = false;
        document.getElementById('pause-timer').disabled = true;
        
        if (this.timer.interval) {
            clearInterval(this.timer.interval);
            this.timer.interval = null;
        }
    }

    resetTimer() {
        this.pauseTimer();
        this.timer.minutes = this.timer.isBreak ? 5 : 25;
        this.timer.seconds = 0;
        this.updateTimerDisplay();
    }

    timerComplete() {
        this.pauseTimer();
        
        if (this.timer.isBreak) {
            // Break complete, back to study
            this.timer.isBreak = false;
            this.timer.minutes = 25;
            this.timer.seconds = 0;
            document.getElementById('timer-label').textContent = 'Focus Time';
            this.showNotification('Break time over! Ready to focus again? 📚');
        } else {
            // Study session complete, time for break
            this.timer.isBreak = true;
            this.timer.minutes = 5;
            this.timer.seconds = 0;
            document.getElementById('timer-label').textContent = 'Break Time';
            this.showNotification('Great work! Time for a 5-minute break! ☕');
        }
        
        this.updateTimerDisplay();
        this.updateMotivationTip();
    }

    updateTimerDisplay() {
        const minutesEl = document.getElementById('timer-minutes');
        const secondsEl = document.getElementById('timer-seconds');
        
        minutesEl.textContent = this.timer.minutes.toString().padStart(2, '0');
        secondsEl.textContent = this.timer.seconds.toString().padStart(2, '0');
        
        // Update circle color based on break/focus
        const circle = document.querySelector('.timer-circle');
        if (this.timer.isBreak) {
            circle.style.background = 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)';
        } else {
            circle.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        }
    }

    updateMotivationTip() {
        const tipEl = document.getElementById('motivation-tip');
        const randomTip = this.motivationalTips[Math.floor(Math.random() * this.motivationalTips.length)];
        tipEl.textContent = randomTip;
    }

    // Subject Filter Functions
    async updateSubjectFilter(subject) {
        await chrome.storage.local.set({ selectedSubject: subject });
        this.updateFilterStatus(subject);
        
        this.sendMessageToContent({
            action: 'updateFilter',
            subject: subject,
            keywords: subject ? this.subjectKeywords[subject] : []
        });
    }

    updateFilterStatus(subject) {
        const statusEl = document.getElementById('filter-status');
        if (subject) {
            statusEl.textContent = `Filter: ${subject.charAt(0).toUpperCase() + subject.slice(1)}`;
            statusEl.style.color = '#48bb78';
        } else {
            statusEl.textContent = 'Filter: Disabled';
            statusEl.style.color = '#718096';
        }
    }

    // Settings Functions
    async toggleNightMode(enabled) {
        await chrome.storage.local.set({ nightMode: enabled });
        this.sendMessageToContent({
            action: 'toggleNightMode',
            enabled: enabled
        });
    }

    async toggleDistractionWarning(enabled) {
        await chrome.storage.local.set({ distractionWarning: enabled });
        this.sendMessageToContent({
            action: 'toggleDistractionWarning',
            enabled: enabled
        });
    }

    // Notes Functions
    async saveNote() {
        const noteInput = document.getElementById('note-input');
        const noteText = noteInput.value.trim();
        
        if (!noteText) return;

        const note = {
            id: Date.now(),
            content: noteText,
            timestamp: new Date().toLocaleString()
        };

        const { notes = [] } = await chrome.storage.local.get(['notes']);
        notes.unshift(note); // Add to beginning
        
        // Keep only last 10 notes
        if (notes.length > 10) {
            notes.splice(10);
        }

        await chrome.storage.local.set({ notes });
        noteInput.value = '';
        this.loadNotes();
        
        this.showNotification('Note saved! 📝');
    }

    async loadNotes() {
        const { notes = [] } = await chrome.storage.local.get(['notes']);
        const notesContainer = document.getElementById('notes-list');
        
        if (notes.length === 0) {
            notesContainer.innerHTML = '<div style="text-align: center; color: #718096; font-size: 13px; padding: 20px;">No notes yet. Start taking notes to keep track of your learning!</div>';
            return;
        }

        notesContainer.innerHTML = notes.map(note => `
            <div class="note-item">
                <button class="note-delete" onclick="eduFocus.deleteNote(${note.id})" title="Delete note">×</button>
                <div class="note-content">${this.escapeHtml(note.content)}</div>
                <div class="note-timestamp">${note.timestamp}</div>
            </div>
        `).join('');
    }

    async deleteNote(noteId) {
        const { notes = [] } = await chrome.storage.local.get(['notes']);
        const updatedNotes = notes.filter(note => note.id !== noteId);
        await chrome.storage.local.set({ notes: updatedNotes });
        this.loadNotes();
    }

    // Utility Functions
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showNotification(message) {
        // Create a temporary notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            color: white;
            padding: 10px 15px;
            border-radius: 6px;
            font-size: 13px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    async sendMessageToContent(message) {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (tab && tab.url && tab.url.includes('youtube.com')) {
                await chrome.tabs.sendMessage(tab.id, message);
            }
        } catch (error) {
            console.log('Content script not available:', error);
        }
    }
}

// Initialize the popup
const eduFocus = new EduFocusPopup();

// Make deleteNote available globally for onclick handlers
window.eduFocus = eduFocus;
