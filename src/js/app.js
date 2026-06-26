/**
 * App Controller — Navigation, module management, global state
 */

class App {
  constructor() {
    this.fretboard = null;
    this.modules = {};
    this.currentModule = 'welcome';
    this.rootNote = 9; // A by default (since you know A minor pentatonic!)

    this._init();
  }

  _init() {
    // Initialize fretboard
    this.fretboard = new Fretboard('fretboard-main');
    this.fretboard.rootNote = 9; // A

    // Initialize all modules
    this.modules = {
      scales: new ScalesModule(this.fretboard),
      chords: new ChordsModule(this.fretboard),
      circle: new CircleOfFifthsModule(this.fretboard),
      caged: new CagedModule(this.fretboard),
      modes: new ModesModule(this.fretboard),
      triads: new TriadsModule(this.fretboard),
      intervals: new IntervalsModule(this.fretboard),
    };

    // Bind sidebar navigation
    this._bindNavigation();

    // Bind sidebar toggle (hamburger)
    this._bindSidebarToggle();

    // Bind global root note selector
    this._bindRootSelector();

    // Bind tuning selector
    this._bindTuningSelector();

    // Bind wood type selector
    this._bindWoodSelector();

    // Show welcome screen
    this._showModule('welcome');
  }

  _bindSidebarToggle() {
    const toggleBtn = document.getElementById('sidebar-toggle');
    const app = document.getElementById('app');
    if (!toggleBtn || !app) return;

    toggleBtn.addEventListener('click', () => {
      app.classList.toggle('sidebar-collapsed');
    });
  }

  _bindNavigation() {
    document.querySelectorAll('.sidebar-item[data-module]').forEach(item => {
      item.addEventListener('click', () => {
        const moduleName = item.dataset.module;
        this._showModule(moduleName);

        // Update sidebar active state
        document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
      });
    });

    // Welcome screen module cards
    document.addEventListener('click', (e) => {
      const card = e.target.closest('.welcome-module-card[data-module]');
      if (card) {
        const moduleName = card.dataset.module;
        this._showModule(moduleName);

        // Update sidebar
        document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
        const sidebarItem = document.querySelector(`.sidebar-item[data-module="${moduleName}"]`);
        if (sidebarItem) sidebarItem.classList.add('active');
      }
    });
  }

  _bindRootSelector() {
    const select = document.getElementById('global-root-select');
    if (!select) return;

    select.addEventListener('change', (e) => {
      const noteIdx = NotesData.noteToIndex(e.target.value);
      if (noteIdx >= 0) {
        this.rootNote = noteIdx;
        this.fretboard.setRootNote(noteIdx);

        // Update current module
        if (this.currentModule !== 'welcome' && this.modules[this.currentModule]) {
          this.modules[this.currentModule].update();
        }
      }
    });
  }

  _bindTuningSelector() {
    const select = document.getElementById('global-tuning-select');
    if (!select) return;

    select.addEventListener('change', (e) => {
      this.fretboard.setTuning(e.target.value);

      // Update current module
      if (this.currentModule !== 'welcome' && this.modules[this.currentModule]) {
        this.modules[this.currentModule].update();
      }
    });
  }

  _bindWoodSelector() {
    const select = document.getElementById('global-wood-select');
    if (!select) return;

    select.addEventListener('change', (e) => {
      this.fretboard.setWoodType(e.target.value);

      // Update current module
      if (this.currentModule !== 'welcome' && this.modules[this.currentModule]) {
        this.modules[this.currentModule].update();
      }
    });
  }

  _showModule(moduleName) {
    this.currentModule = moduleName;

    // Hide all module views
    document.querySelectorAll('.module-view').forEach(v => v.classList.remove('active'));

    // Show selected module
    const moduleEl = document.getElementById(`module-${moduleName}`);
    if (moduleEl) {
      moduleEl.classList.add('active');
    }

    // Render module content (if it's not the welcome screen)
    if (moduleName !== 'welcome' && this.modules[moduleName]) {
      this.modules[moduleName].render();
    }

    // Show fretboard for note map on welcome
    if (moduleName === 'welcome') {
      this.fretboard.showAllNotes();
    }
  }
}

// Boot the app
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
