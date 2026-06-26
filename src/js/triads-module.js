/**
 * Triads Module — Major & Minor triads on all string sets
 * The "John Mayer Secret Weapon"
 */

class TriadsModule {
  constructor(fretboard) {
    this.fretboard = fretboard;
    this.currentQuality = 'major'; // 'major' | 'minor'
    this.currentStringSet = '123'; // '123', '234', '345', '456'
    this.currentInversion = 0; // 0 = root, 1 = first, 2 = second
    this.container = document.getElementById('module-triads');
  }

  render() {
    const rootNote = this.fretboard.rootNote;
    const rootName = NotesData.getNoteName(rootNote);
    const triadData = this._getTriadShapes();

    this.container.innerHTML = `
      <div class="module-header">
        <h1>🔺 Triads Across the Neck</h1>
        <p>Three-note chord voicings on every string set — this is how John Mayer plays rhythm guitar. Compact, musical, and endlessly versatile. Master these and you'll see the fretboard in a completely new way.</p>
      </div>

      <div class="controls-bar">
        <div class="control-group">
          <label>Quality</label>
          <div class="pill-group">
            <button class="pill-btn ${this.currentQuality === 'major' ? 'active' : ''}" data-quality="major">Major</button>
            <button class="pill-btn ${this.currentQuality === 'minor' ? 'active' : ''}" data-quality="minor">Minor</button>
          </div>
        </div>
        <div class="control-group">
          <label>String Set</label>
          <div class="pill-group">
            <button class="pill-btn ${this.currentStringSet === '123' ? 'active' : ''}" data-strings="123">Strings 1-2-3</button>
            <button class="pill-btn ${this.currentStringSet === '234' ? 'active' : ''}" data-strings="234">Strings 2-3-4</button>
            <button class="pill-btn ${this.currentStringSet === '345' ? 'active' : ''}" data-strings="345">Strings 3-4-5</button>
            <button class="pill-btn ${this.currentStringSet === '456' ? 'active' : ''}" data-strings="456">Strings 4-5-6</button>
          </div>
        </div>
        <div class="control-group">
          <label>Inversion</label>
          <div class="pill-group">
            <button class="pill-btn ${this.currentInversion === 0 ? 'active' : ''}" data-inv="0">Root Pos.</button>
            <button class="pill-btn ${this.currentInversion === 1 ? 'active' : ''}" data-inv="1">1st Inv.</button>
            <button class="pill-btn ${this.currentInversion === 2 ? 'active' : ''}" data-inv="2">2nd Inv.</button>
          </div>
        </div>
      </div>

      <div class="fretboard-container" id="triads-fretboard"></div>

      <div class="grid-3 mt-lg stagger-children">
        <div class="info-card">
          <h4 style="color: var(--gold-light)">Root Position</h4>
          <p class="mt-sm">Root on the bottom. The most stable sound. <strong>R - 3 - 5</strong> (bottom to top).</p>
        </div>
        <div class="info-card">
          <h4 style="color: var(--blue-light)">1st Inversion</h4>
          <p class="mt-sm">3rd on the bottom. Smoother voice leading. <strong>3 - 5 - R</strong> (bottom to top).</p>
        </div>
        <div class="info-card">
          <h4 style="color: var(--chrome-mid)">2nd Inversion</h4>
          <p class="mt-sm">5th on the bottom. More open sound. <strong>5 - R - 3</strong> (bottom to top).</p>
        </div>
      </div>

      <div class="info-card mt-lg">
        <h4 style="color: var(--gold-light)">💡 The Mayer Method</h4>
        <p class="mt-sm">John Mayer uses these triad shapes constantly — sliding between inversions on the top 3 strings while his thumb handles bass notes. This creates that signature full, sophisticated sound you hear in songs like "Neon", "Gravity", and "Slow Dancing in a Burning Room". Start with strings 1-2-3 and learn all three inversions. Then move to the next string set.</p>
      </div>
    `;

    this._bindEvents();
    this._updateFretboard();
  }

  _getTriadShapes() {
    // Major triad intervals: R(0), 3(4), 5(7)
    // Minor triad intervals: R(0), b3(3), 5(7)
    const isMajor = this.currentQuality === 'major';
    const third = isMajor ? 4 : 3;
    const intervals = [0, third, 7];

    return { intervals };
  }

  _getTriadFrets() {
    const rootNote = this.fretboard.rootNote;
    const isMajor = this.currentQuality === 'major';
    const tuning = NotesData.TUNINGS[this.fretboard.currentTuning];

    // Determine which physical strings to use
    // String mapping: '123' = strings 1,2,3 (indices 5,4,3)
    const stringMap = {
      '123': [5, 4, 3], // high e, B, G
      '234': [4, 3, 2], // B, G, D
      '345': [3, 2, 1], // G, D, A
      '456': [2, 1, 0], // D, A, low E
    };

    const stringIndices = stringMap[this.currentStringSet];

    // Triad intervals
    const third = isMajor ? 4 : 3;

    // Inversions define which note goes on which string (from lowest to highest pitched string)
    // Root position: R-3-5 (low to high)
    // 1st inversion: 3-5-R (low to high)
    // 2nd inversion: 5-R-3 (low to high)
    const inversions = [
      [0, third, 7],      // Root position
      [third, 7, 12],     // 1st inversion (R goes up an octave)
      [7, 12, 12 + third],// 2nd inversion
    ];

    const noteIntervals = inversions[this.currentInversion];

    // For each string, find the fret that gives us the desired note
    const frets = new Array(6).fill(null);

    stringIndices.forEach((strIdx, i) => {
      // Note we want (semitones from the root note)
      const targetNoteIdx = (rootNote + noteIntervals[i]) % 12;
      const stringOpenMidi = tuning.strings[strIdx].midi;
      const stringOpenNote = stringOpenMidi % 12;

      // Find the fret
      let fret = (targetNoteIdx - stringOpenNote + 12) % 12;
      // Keep frets in a reasonable range (not too high)
      if (fret === 0) fret = 0;
      // Try to keep within first 12 frets
      frets[strIdx] = fret;
    });

    return frets;
  }

  _bindEvents() {
    // Quality toggle
    this.container.querySelectorAll('[data-quality]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.currentQuality = e.target.dataset.quality;
        this.container.querySelectorAll('[data-quality]').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this._updateFretboard();
      });
    });

    // String set toggle
    this.container.querySelectorAll('[data-strings]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.currentStringSet = e.target.dataset.strings;
        this.container.querySelectorAll('[data-strings]').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this._updateFretboard();
      });
    });

    // Inversion toggle
    this.container.querySelectorAll('[data-inv]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.currentInversion = parseInt(e.target.dataset.inv);
        this.container.querySelectorAll('[data-inv]').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this._updateFretboard();
      });
    });
  }

  _updateFretboard() {
    const frets = this._getTriadFrets();
    const isMajor = this.currentQuality === 'major';
    const formula = isMajor ? [0, 4, 7] : [0, 3, 7];
    this.fretboard.showChord(frets, formula);
  }

  update() {
    this.render();
  }
}

window.TriadsModule = TriadsModule;
