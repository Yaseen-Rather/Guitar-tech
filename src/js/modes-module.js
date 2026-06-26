/**
 * Modes Explorer Module
 */

class ModesModule {
  constructor(fretboard) {
    this.fretboard = fretboard;
    this.currentMode = 0; // Index into KeysData.MODES
    this.container = document.getElementById('module-modes');
  }

  render() {
    const rootNote = this.fretboard.rootNote;
    const rootName = NotesData.getNoteName(rootNote);
    const mode = KeysData.MODES[this.currentMode];

    this.container.innerHTML = `
      <div class="module-header">
        <h1>🎼 Modes</h1>
        <p>The 7 modes of the major scale — each one shifts the starting note, creating a completely different mood and color while using the same notes.</p>
      </div>

      <div class="controls-bar">
        <div class="control-group">
          <label>Display</label>
          <div class="pill-group">
            <button class="pill-btn ${this.fretboard.displayMode === 'notes' ? 'active' : ''}" data-mode="notes">Notes</button>
            <button class="pill-btn ${this.fretboard.displayMode === 'intervals' ? 'active' : ''}" data-mode="intervals">Intervals</button>
          </div>
        </div>
      </div>

      <div class="grid-4 mb-lg stagger-children" id="mode-cards">
        ${KeysData.MODES.map((m, i) => `
          <div class="mode-card ${i === this.currentMode ? 'active' : ''}" data-mode-index="${i}" style="--mode-color: ${m.color}">
            <div class="mode-name" style="color: ${i === this.currentMode ? m.color : 'var(--text-primary)'}">${m.name}</div>
            <div class="mode-degree">Mode ${m.degree} • ${m.intervalNames.join(' ')}</div>
            <div class="mode-mood">${m.mood}</div>
          </div>
        `).join('')}
      </div>

      <div class="fretboard-container" id="modes-fretboard"></div>

      <div class="info-card">
        <div class="flex items-center gap-md mb-md">
          <h2 style="color: ${mode.color}">${rootName} ${mode.name}</h2>
          <span class="badge" style="background: ${mode.color}22; color: ${mode.color}">Mode ${mode.degree}</span>
        </div>
        <p>${mode.description}</p>

        <div class="formula-display mt-md">
          ${mode.intervals.map((interval, i) => {
            const noteIdx = (rootNote + interval) % 12;
            const noteName = NotesData.getNoteName(noteIdx);
            return `
              ${i > 0 ? '<span class="formula-arrow">→</span>' : ''}
              <div class="formula-note ${i === 0 ? 'root' : ''}">
                <span class="note-name">${noteName}</span>
                <span class="interval">${mode.intervalNames[i]}</span>
              </div>
            `;
          }).join('')}
        </div>

        <h4 class="mt-lg" style="color: var(--text-secondary)">🎵 Mood: <span style="color: ${mode.color}">${mode.mood}</span></h4>

        ${mode.examples.length > 0 ? `
          <h4 class="mt-md" style="color: var(--text-secondary)">🎧 Examples</h4>
          <ul style="list-style: none; padding: 0; margin-top: var(--space-sm);">
            ${mode.examples.map(ex => `
              <li style="padding: 4px 0; color: var(--text-secondary); font-size: 13px;">• ${ex}</li>
            `).join('')}
          </ul>
        ` : ''}
      </div>

      <div class="info-card mt-md">
        <h4 style="color: var(--gold-light)">💡 Parent Scale Relationship</h4>
        <p class="mt-sm">
          ${rootName} ${mode.name} contains the same notes as
          <strong style="color: var(--text-primary)">${NotesData.getNoteName((rootNote - mode.intervals[0] + 12) % 12)} Major</strong>.
          The difference is which note you treat as "home" (the root). This is what gives each mode its unique flavor.
        </p>
      </div>
    `;

    this._bindEvents();
    this._updateFretboard();
  }

  _bindEvents() {
    // Mode cards
    this.container.querySelectorAll('.mode-card').forEach(card => {
      card.addEventListener('click', () => {
        this.currentMode = parseInt(card.dataset.modeIndex);
        this.render();
      });
    });

    // Display mode
    this.container.querySelectorAll('.pill-btn[data-mode]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.fretboard.setDisplayMode(e.target.dataset.mode);
        this.container.querySelectorAll('.pill-btn[data-mode]').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this._updateFretboard();
      });
    });
  }

  _updateFretboard() {
    const mode = KeysData.MODES[this.currentMode];
    this.fretboard.showScale(mode.intervals);
  }

  update() {
    this.render();
  }
}

window.ModesModule = ModesModule;
