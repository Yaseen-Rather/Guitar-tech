/**
 * Chord Library Module
 */

class ChordsModule {
  constructor(fretboard) {
    this.fretboard = fretboard;
    this.currentType = 'major';
    this.currentVoicing = null;
    this.container = document.getElementById('module-chords');
  }

  render() {
    const rootNote = this.fretboard.rootNote;
    const rootName = NotesData.getNoteName(rootNote);
    const chordType = ChordsData.CHORD_TYPES[this.currentType];

    this.container.innerHTML = `
      <div class="module-header">
        <h1>🎶 Chord Library</h1>
        <p>Every chord shape you need — from basic open chords to jazz voicings.</p>
      </div>

      <div class="controls-bar">
        <div class="control-group">
          <label>Chord Type</label>
          <select class="control-select" id="chord-type-select">
            ${ChordsData.CHORD_CATEGORIES.map(cat =>
              `<optgroup label="${cat.name}">
                ${cat.types.map(t => {
                  const ct = ChordsData.CHORD_TYPES[t];
                  return `<option value="${t}" ${t === this.currentType ? 'selected' : ''}>${ct.name}</option>`;
                }).join('')}
              </optgroup>`
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

      <div class="info-card">
        <div class="flex items-center gap-md mb-md">
          <h2 style="color: var(--gold-light)">${rootName}${chordType.symbol}</h2>
          <span class="badge gold">${chordType.name}</span>
        </div>
        <p>${chordType.description}</p>
        <div class="formula-display mt-md">
          ${chordType.formula.map((interval, i) => {
            const noteIdx = (rootNote + (interval % 12)) % 12;
            const noteName = NotesData.getNoteName(noteIdx);
            return `
              ${i > 0 ? '<span class="formula-arrow">→</span>' : ''}
              <div class="formula-note ${i === 0 ? 'root' : ''}">
                <span class="note-name">${noteName}</span>
                <span class="interval">${chordType.formulaNames[i]}</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <h3 class="mt-lg mb-md">Voicings</h3>
      <div class="grid-4 stagger-children" id="voicings-grid">
        ${Object.entries(chordType.voicings).map(([key, voicing]) => `
          <div class="chord-diagram ${this.currentVoicing === key ? 'selected' : ''}" data-voicing="${key}">
            <span class="chord-name">${rootName}${chordType.symbol}</span>
            <span class="chord-type">${voicing.name}</span>
            ${this._renderMiniChordGrid(voicing, rootNote)}
          </div>
        `).join('')}
        ${Object.entries(chordType.openChords || {}).map(([name, chord]) => `
          <div class="chord-diagram ${this.currentVoicing === 'open-' + name ? 'selected' : ''}" data-voicing="open-${name}" data-frets="${JSON.stringify(chord.frets)}">
            <span class="chord-name">${name}</span>
            <span class="chord-type">Open</span>
            ${this._renderMiniChordGridFromFrets(chord.frets)}
          </div>
        `).join('')}
      </div>

      <div class="fretboard-container" id="chords-fretboard"></div>
    `;

    this._bindEvents();
    this._showDefaultVoicing();
  }

  _renderMiniChordGrid(voicing, rootNote) {
    return this._renderMiniChordGridFromFrets(voicing.frets);
  }

  _renderMiniChordGridFromFrets(frets) {
    const w = 100, h = 120;
    const sx = 15, sy = 15; // start x/y
    const sw = 12; // string spacing
    const fh = 22; // fret height
    const numFrets = 4;

    let svg = `<svg class="chord-grid-svg" viewBox="0 0 ${w} ${h}" style="width:100px;height:${h}px">`;

    // Find min fret to determine position
    const playedFrets = frets.filter(f => f !== null && f > 0);
    const minFret = playedFrets.length > 0 ? Math.min(...playedFrets) : 0;
    const baseFret = minFret > 3 ? minFret : 0;

    // Nut or fret position indicator
    if (baseFret === 0) {
      svg += `<line class="cg-nut" x1="${sx}" y1="${sy}" x2="${sx + sw * 5}" y2="${sy}"/>`;
    } else {
      svg += `<text class="cg-fret-label" x="${sx - 4}" y="${sy + fh / 2}">${baseFret}</text>`;
    }

    // Fret lines
    for (let f = 0; f <= numFrets; f++) {
      const y = sy + f * fh;
      svg += `<line class="cg-fret" x1="${sx}" y1="${y}" x2="${sx + sw * 5}" y2="${y}"/>`;
    }

    // Strings
    for (let s = 0; s < 6; s++) {
      const x = sx + s * sw;
      svg += `<line class="cg-string" x1="${x}" y1="${sy}" x2="${x}" y2="${sy + numFrets * fh}"/>`;
    }

    // Notes
    frets.forEach((fret, s) => {
      const x = sx + s * sw;
      if (fret === null) {
        svg += `<text class="cg-muted" x="${x}" y="${sy - 5}">×</text>`;
      } else if (fret === 0) {
        svg += `<circle class="cg-open" cx="${x}" cy="${sy - 5}" r="4"/>`;
      } else {
        const relFret = fret - baseFret;
        if (relFret >= 1 && relFret <= numFrets) {
          const y = sy + (relFret - 0.5) * fh;
          svg += `<circle class="cg-dot" cx="${x}" cy="${y}" r="6"/>`;
        }
      }
    });

    svg += '</svg>';
    return svg;
  }

  _bindEvents() {
    // Chord type select
    const select = document.getElementById('chord-type-select');
    if (select) {
      select.addEventListener('change', (e) => {
        this.currentType = e.target.value;
        this.currentVoicing = null;
        this.render();
      });
    }

    // Voicing cards
    this.container.querySelectorAll('.chord-diagram').forEach(card => {
      card.addEventListener('click', (e) => {
        const voicingKey = card.dataset.voicing;
        this.currentVoicing = voicingKey;

        // Update selection visual
        this.container.querySelectorAll('.chord-diagram').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');

        // Show on fretboard
        this._showVoicing(voicingKey, card);
      });
    });

    // Display mode pills
    this.container.querySelectorAll('.pill-btn[data-mode]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.fretboard.setDisplayMode(e.target.dataset.mode);
        this.container.querySelectorAll('.pill-btn[data-mode]').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this._showDefaultVoicing();
      });
    });
  }

  _showDefaultVoicing() {
    const chordType = ChordsData.CHORD_TYPES[this.currentType];
    const voicings = Object.entries(chordType.voicings);
    if (voicings.length > 0) {
      this.currentVoicing = voicings[0][0];
      this._showVoicing(this.currentVoicing);
    }
  }

  _showVoicing(voicingKey, cardElement = null) {
    const chordType = ChordsData.CHORD_TYPES[this.currentType];
    const rootNote = this.fretboard.rootNote;

    let frets;
    if (voicingKey.startsWith('open-')) {
      // Open chord - use exact frets
      const chordName = voicingKey.replace('open-', '');
      const openChord = chordType.openChords[chordName];
      if (openChord) {
        frets = openChord.frets;
      } else {
        return;
      }
    } else {
      const voicing = chordType.voicings[voicingKey];
      if (!voicing) return;
      // Transpose voicing to current root
      const rootFretE = rootNote >= 4 ? rootNote - 4 : rootNote + 8; // E=0 in MIDI terms
      frets = voicing.frets.map(f => {
        if (f === null) return null;
        return f + rootFretE;
      });
    }

    // Play chord sound
    const tuning = NotesData.TUNINGS[this.fretboard.currentTuning];
    const midiNotes = frets.map((f, s) => {
      if (f === null) return null;
      return tuning.strings[s].midi + f;
    }).filter(n => n !== null);
    window.audioEngine.playChord(midiNotes);

    this.fretboard.showChord(frets, chordType.formula);
  }

  update() {
    this.render();
  }
}

window.ChordsModule = ChordsModule;
