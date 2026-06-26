/**
 * CAGED System Module
 */

class CagedModule {
  constructor(fretboard) {
    this.fretboard = fretboard;
    this.currentShape = 'C';
    this.showScale = false;
    this.container = document.getElementById('module-caged');
  }

  render() {
    const rootNote = this.fretboard.rootNote;
    const rootName = NotesData.getNoteName(rootNote);

    const cagedShapes = this._getCagedData();

    this.container.innerHTML = `
      <div class="module-header">
        <h1>🔓 CAGED System</h1>
        <p>The CAGED system unlocks the entire fretboard by showing you how 5 open chord shapes (C, A, G, E, D) connect across the neck. Each shape contains a major chord, a major scale pattern, and a pentatonic pattern.</p>
      </div>

      <div class="controls-bar">
        <div class="control-group">
          <label>CAGED Shape</label>
          <div class="caged-shapes">
            ${['C', 'A', 'G', 'E', 'D'].map(letter => `
              <button class="caged-shape-btn ${this.currentShape === letter ? 'active' : ''}" data-shape="${letter}">${letter}</button>
            `).join('')}
          </div>
        </div>
        <div class="control-group">
          <label>Overlay</label>
          <div class="pill-group">
            <button class="pill-btn ${!this.showScale ? 'active' : ''}" data-overlay="chord">Chord Only</button>
            <button class="pill-btn ${this.showScale ? 'active' : ''}" data-overlay="scale">+ Major Scale</button>
          </div>
        </div>
        <div class="control-group">
          <label>Display</label>
          <div class="pill-group">
            <button class="pill-btn ${this.fretboard.displayMode === 'notes' ? 'active' : ''}" data-mode="notes">Notes</button>
            <button class="pill-btn ${this.fretboard.displayMode === 'intervals' ? 'active' : ''}" data-mode="intervals">Intervals</button>
          </div>
        </div>
      </div>

      <div class="fretboard-container" id="caged-fretboard"></div>

      <div class="info-card">
        <h3>${this.currentShape} Shape — ${rootName} Major</h3>
        <p>${cagedShapes[this.currentShape].description}</p>
      </div>

      <div class="grid-2 mt-lg stagger-children">
        <div class="info-card">
          <h4 style="color: var(--gold-light);">💡 How CAGED Works</h4>
          <p class="mt-sm">Take any open chord shape (C, A, G, E, or D major). Now imagine sliding that shape up the neck with a barre. The root note positions in that shape show you where the chord tones are EVERYWHERE on the fretboard.</p>
        </div>
        <div class="info-card">
          <h4 style="color: var(--blue-light);">🎯 Why It Matters</h4>
          <p class="mt-sm">Once you see all 5 shapes connecting, you'll never be "stuck in a box" again. Each shape flows into the next, giving you complete freedom to play chords and solos in any position.</p>
        </div>
      </div>

      <h3 class="mt-lg mb-md">Shape Connection Order</h3>
      <div class="formula-display">
        ${['C', 'A', 'G', 'E', 'D'].map((letter, i) => `
          ${i > 0 ? '<span class="formula-arrow">→</span>' : ''}
          <div class="formula-note ${letter === this.currentShape ? 'root' : ''}" style="cursor:pointer" data-shape-link="${letter}">
            <span class="note-name" style="font-size: 22px">${letter}</span>
            <span class="interval">Shape</span>
          </div>
        `).join('')}
        <span class="formula-arrow">→</span>
        <div class="formula-note" style="opacity: 0.5">
          <span class="note-name" style="font-size: 22px">C</span>
          <span class="interval">Repeats</span>
        </div>
      </div>
    `;

    this._bindEvents();
    this._updateFretboard();
  }

  _getCagedData() {
    return {
      C: {
        chord: [null, 3, 2, 0, 1, 0], // Relative to root
        description: 'The C shape — recognized by the open C chord form. When moved up the neck, the root is on the 5th string. This shape has a distinctive "triangle" of notes on the treble strings.',
        fretRange: { startFretOffset: 0, span: 4 },
      },
      A: {
        chord: [null, 0, 2, 2, 2, 0],
        description: 'The A shape — the classic A major barre chord. Root on the 5th string. The most common barre chord shape, and probably the one you\'ll use most.',
        fretRange: { startFretOffset: 2, span: 4 },
      },
      G: {
        chord: [3, 2, 0, 0, 0, 3],
        description: 'The G shape — based on open G major. Root on the 6th string. A bit of a stretch but gives you big, full voicings. Less commonly barred but essential for navigation.',
        fretRange: { startFretOffset: 4, span: 5 },
      },
      E: {
        chord: [0, 2, 2, 1, 0, 0],
        description: 'The E shape — THE barre chord shape. Root on the 6th string. The most important movable shape — every guitarist learns this first. F barre chord is this shape at fret 1.',
        fretRange: { startFretOffset: 7, span: 4 },
      },
      D: {
        chord: [null, null, 0, 2, 3, 2],
        description: 'The D shape — based on open D major. Root on the 4th string. Gives you access to bright, treble-focused voicings. Great for adding variety to chord progressions.',
        fretRange: { startFretOffset: 9, span: 4 },
      },
    };
  }

  _bindEvents() {
    // CAGED shape buttons
    this.container.querySelectorAll('.caged-shape-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.currentShape = e.target.dataset.shape;
        this.container.querySelectorAll('.caged-shape-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this._updateFretboard();
        // Update description
        const cagedShapes = this._getCagedData();
        const infoCard = this.container.querySelector('.info-card h3');
        const infoDesc = this.container.querySelector('.info-card p');
        if (infoCard) infoCard.textContent = `${this.currentShape} Shape — ${NotesData.getNoteName(this.fretboard.rootNote)} Major`;
        if (infoDesc) infoDesc.textContent = cagedShapes[this.currentShape].description;
      });
    });

    // Shape links in the formula
    this.container.querySelectorAll('[data-shape-link]').forEach(link => {
      link.addEventListener('click', (e) => {
        this.currentShape = link.dataset.shapeLink;
        this.render();
      });
    });

    // Overlay toggle
    this.container.querySelectorAll('[data-overlay]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.showScale = e.target.dataset.overlay === 'scale';
        this.container.querySelectorAll('[data-overlay]').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this._updateFretboard();
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
    const rootNote = this.fretboard.rootNote;
    const cagedShapes = this._getCagedData();
    const shape = cagedShapes[this.currentShape];

    if (this.showScale) {
      // Show major scale in this CAGED position
      const majorScale = ScalesData.SCALES.major;
      const scaleShapeIndex = ['C', 'A', 'G', 'E', 'D'].indexOf(this.currentShape);
      if (majorScale.shapes[scaleShapeIndex]) {
        const tuning = NotesData.TUNINGS[this.fretboard.currentTuning];
        const lowEMidi = tuning.strings[0].midi;
        const rootFret = (rootNote - (lowEMidi % 12) + 12) % 12;
        this.fretboard.showScaleShape(majorScale.intervals, majorScale.shapes[scaleShapeIndex], rootFret);
      }
    } else {
      // Show chord shape only
      this.fretboard.showChord(shape.chord, [0, 4, 7]); // Major triad
    }
  }

  update() {
    this.render();
  }
}

window.CagedModule = CagedModule;
