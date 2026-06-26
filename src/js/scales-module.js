/**
 * Scales Explorer Module
 */

class ScalesModule {
  constructor(fretboard) {
    this.fretboard = fretboard;
    this.currentScale = 'pentatonic_minor';
    this.currentShape = 0; // 0-4, or -1 for "all"
    this.container = document.getElementById('module-scales');
  }

  render() {
    const scale = ScalesData.SCALES[this.currentScale];
    const rootNote = this.fretboard.rootNote;
    const rootName = NotesData.getNoteName(rootNote);

    this.container.innerHTML = `
      <div class="module-header">
        <h1>🎵 Scales Library</h1>
        <p>${scale.description}</p>
      </div>

      <div class="controls-bar">
        <div class="control-group">
          <label>Scale Type</label>
          <select class="control-select" id="scale-type-select">
            ${Object.entries(ScalesData.SCALES).map(([key, s]) =>
              `<option value="${key}" ${key === this.currentScale ? 'selected' : ''}>${s.name}</option>`
            ).join('')}
          </select>
        </div>
        <div class="control-group">
          <label>Display</label>
          <div class="pill-group">
            <button class="pill-btn ${this.fretboard.displayMode === 'notes' ? 'active' : ''}" data-mode="notes">Notes</button>
            <button class="pill-btn ${this.fretboard.displayMode === 'intervals' ? 'active' : ''}" data-mode="intervals">Intervals</button>
          </div>
        </div>
      </div>

      <div class="formula-display">
        ${scale.intervals.map((interval, i) => {
          const noteName = NotesData.getNoteName((rootNote + interval) % 12);
          const isRoot = i === 0;
          return `
            ${i > 0 ? '<span class="formula-arrow">→</span>' : ''}
            <div class="formula-note ${isRoot ? 'root' : ''}">
              <span class="note-name">${noteName}</span>
              <span class="interval">${scale.intervalNames[i]}</span>
            </div>
          `;
        }).join('')}
      </div>

      <div class="shape-tabs" id="shape-tabs">
        <button class="shape-tab ${this.currentShape === -1 ? 'active' : ''}" data-shape="-1">All Positions</button>
        ${scale.shapes.map((shape, i) =>
          `<button class="shape-tab ${this.currentShape === i ? 'active' : ''}" data-shape="${i}">${shape.name}</button>`
        ).join('')}
      </div>

      <div class="fretboard-container" id="scales-fretboard"></div>

      <div class="info-card mt-lg">
        <h3>${rootName} ${scale.name} — ${this.currentShape >= 0 ? scale.shapes[this.currentShape].name : 'Full Neck'}</h3>
        <p>${scale.description}</p>
        <div class="formula-display mt-md">
          <span style="color: var(--text-tertiary); font-size: 12px; font-weight: 600;">Formula:&nbsp;</span>
          ${scale.intervalNames.map((name, i) => `
            <span style="color: ${i === 0 ? 'var(--gold)' : 'var(--text-primary)'}; font-weight: 600; font-size: 14px;">${name}</span>
            ${i < scale.intervalNames.length - 1 ? '<span style="color: var(--text-tertiary);">—</span>' : ''}
          `).join('')}
        </div>
      </div>
    `;

    this._bindEvents();
    this._updateFretboard();
  }

  _bindEvents() {
    // Scale type select
    const select = document.getElementById('scale-type-select');
    if (select) {
      select.addEventListener('change', (e) => {
        this.currentScale = e.target.value;
        this.currentShape = 0;
        this.render();
      });
    }

    // Shape tabs
    document.querySelectorAll('#shape-tabs .shape-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        this.currentShape = parseInt(e.target.dataset.shape);
        document.querySelectorAll('#shape-tabs .shape-tab').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        this._updateFretboard();
      });
    });

    // Display mode pills
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
    const scale = ScalesData.SCALES[this.currentScale];
    const rootNote = this.fretboard.rootNote;

    // Find root fret on low E string
    const tuning = NotesData.TUNINGS[this.fretboard.currentTuning];
    const lowEMidi = tuning.strings[0].midi;
    let rootFret = (rootNote - (lowEMidi % 12) + 12) % 12;

    if (this.currentShape >= 0 && this.currentShape < scale.shapes.length) {
      const shape = scale.shapes[this.currentShape];
      this.fretboard.showScaleShape(scale.intervals, shape, rootFret);
    } else {
      // Show all positions
      this.fretboard.showScale(scale.intervals);
    }
  }

  update() {
    this._updateFretboard();
  }
}

window.ScalesModule = ScalesModule;
