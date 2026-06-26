/**
 * Intervals Module — Visual interval reference
 * The DNA of all music theory
 */

class IntervalsModule {
  constructor(fretboard) {
    this.fretboard = fretboard;
    this.selectedInterval = -1; // -1 = none, 0-11 = semitone
    this.container = document.getElementById('module-intervals');
  }

  render() {
    const rootNote = this.fretboard.rootNote;
    const rootName = NotesData.getNoteName(rootNote);

    this.container.innerHTML = `
      <div class="module-header">
        <h1>📏 Intervals</h1>
        <p>Intervals are the distance between two notes — they're the DNA of everything in music. Every scale is a pattern of intervals. Every chord is built from intervals. Master these and you'll understand WHY things sound the way they do.</p>
      </div>

      <h3 class="mb-md">Click an interval to see it on the fretboard</h3>

      <div class="interval-grid stagger-children">
        ${NotesData.INTERVAL_NAMES.map((name, i) => {
          const noteIdx = (rootNote + i) % 12;
          const noteName = NotesData.getNoteName(noteIdx);
          return `
            <div class="interval-cell ${this.selectedInterval === i ? 'active' : ''}" data-semitones="${i}">
              <div class="interval-short">${name}</div>
              <div class="interval-name">${NotesData.INTERVAL_FULL_NAMES[i]}</div>
              <div class="interval-semitones">${i} semitone${i !== 1 ? 's' : ''}</div>
              <div style="margin-top: 4px; font-weight: 700; color: var(--gold-light); font-size: 14px;">${noteName}</div>
            </div>
          `;
        }).join('')}
      </div>

      <div class="fretboard-container" id="intervals-fretboard"></div>

      ${this.selectedInterval >= 0 ? this._renderIntervalInfo() : ''}

      <div class="grid-2 mt-lg stagger-children">
        <div class="info-card">
          <h4 style="color: var(--gold-light)">🎯 Why Intervals Matter</h4>
          <p class="mt-sm">Instead of memorizing thousands of chord and scale shapes, learn the intervals and you can BUILD any chord or scale from scratch. A major chord is always R-3-5. A minor chord is always R-b3-5. Once you hear each interval, you'll be able to play melodies by ear.</p>
        </div>
        <div class="info-card">
          <h4 style="color: var(--blue-light)">👂 Ear Training Tip</h4>
          <p class="mt-sm">
            Associate each interval with a famous song:<br>
            <strong>m2:</strong> Jaws theme<br>
            <strong>M2:</strong> Happy Birthday<br>
            <strong>m3:</strong> Smoke on the Water<br>
            <strong>M3:</strong> When the Saints<br>
            <strong>P4:</strong> Here Comes the Bride<br>
            <strong>P5:</strong> Star Wars theme<br>
            <strong>Oct:</strong> Somewhere Over the Rainbow
          </p>
        </div>
      </div>

      <h3 class="mt-lg mb-md">Interval Reference Table</h3>
      <div class="info-card" style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <thead>
            <tr style="border-bottom: 1px solid var(--border-light);">
              <th style="text-align: left; padding: 8px; color: var(--text-tertiary); font-weight: 600;">Semitones</th>
              <th style="text-align: left; padding: 8px; color: var(--text-tertiary); font-weight: 600;">Short</th>
              <th style="text-align: left; padding: 8px; color: var(--text-tertiary); font-weight: 600;">Full Name</th>
              <th style="text-align: left; padding: 8px; color: var(--text-tertiary); font-weight: 600;">Note from ${rootName}</th>
              <th style="text-align: left; padding: 8px; color: var(--text-tertiary); font-weight: 600;">Sound Character</th>
            </tr>
          </thead>
          <tbody>
            ${this._getIntervalCharacters().map((row, i) => `
              <tr style="border-bottom: 1px solid var(--border-subtle); ${this.selectedInterval === i ? 'background: var(--gold-dim);' : ''}" >
                <td style="padding: 8px; color: var(--text-tertiary);">${i}</td>
                <td style="padding: 8px; font-weight: 700; color: ${i === 0 ? 'var(--gold)' : 'var(--text-primary)'};">${NotesData.INTERVAL_NAMES[i]}</td>
                <td style="padding: 8px; color: var(--text-secondary);">${NotesData.INTERVAL_FULL_NAMES[i]}</td>
                <td style="padding: 8px; font-weight: 600; color: var(--text-primary);">${NotesData.getNoteName((rootNote + i) % 12)}</td>
                <td style="padding: 8px; color: var(--text-secondary); font-style: italic;">${row.character}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    this._bindEvents();
    if (this.selectedInterval >= 0) {
      this.fretboard.showInterval(this.selectedInterval);
    } else {
      this.fretboard.showAllNotes();
    }
  }

  _renderIntervalInfo() {
    const rootNote = this.fretboard.rootNote;
    const rootName = NotesData.getNoteName(rootNote);
    const noteIdx = (rootNote + this.selectedInterval) % 12;
    const noteName = NotesData.getNoteName(noteIdx);

    return `
      <div class="info-card mt-lg" style="border-color: var(--gold-dim);">
        <h3 style="color: var(--gold-light)">${rootName} → ${noteName} = ${NotesData.INTERVAL_FULL_NAMES[this.selectedInterval]}</h3>
        <p class="mt-sm">${this.selectedInterval} semitone${this.selectedInterval !== 1 ? 's' : ''} apart. ${this._getIntervalCharacters()[this.selectedInterval].description}</p>
      </div>
    `;
  }

  _getIntervalCharacters() {
    return [
      { character: 'Unison — same note', description: 'The same note. Perfect consonance.' },
      { character: 'Tense, dissonant, dark', description: 'The most dissonant interval. Creates tension and unease. Think the "Jaws" theme.' },
      { character: 'Bright, stepping, whole tone', description: 'A whole step. Neutral, stepwise motion. The distance between most adjacent scale notes.' },
      { character: 'Sad, minor, emotional', description: 'The minor third. This is what makes minor chords sound sad. The core of blues and rock.' },
      { character: 'Happy, bright, major', description: 'The major third. This is what makes major chords sound happy and bright. Fundamental to Western harmony.' },
      { character: 'Strong, open, hymn-like', description: 'The perfect fourth. Strong and stable. Creates a sense of openness.' },
      { character: 'Tense, evil, unstable (tritone)', description: 'The tritone — "the devil\'s interval." Maximum tension. Divides the octave exactly in half. Key to dominant 7th chord tension.' },
      { character: 'Powerful, perfect, rock', description: 'The perfect fifth. The most consonant interval after unison/octave. Power chords are just root + fifth.' },
      { character: 'Mysterious, augmented', description: 'Can sound like a minor 6th (warm, bittersweet) or augmented 5th (mysterious, floating).' },
      { character: 'Warm, sweet, golden', description: 'The major sixth. Sweet and warm. Often associated with a hopeful, romantic quality.' },
      { character: 'Bluesy, dominant, funky', description: 'The minor seventh. Blues and funk live here. Creates the dominant 7th chord that\'s essential to blues.' },
      { character: 'Jazzy, dreamy, sophisticated', description: 'The major seventh. Lush and sophisticated. Creates those beautiful maj7 chords used in jazz and bossa nova.' },
    ];
  }

  _bindEvents() {
    this.container.querySelectorAll('.interval-cell').forEach(cell => {
      cell.addEventListener('click', () => {
        const semitones = parseInt(cell.dataset.semitones);
        if (this.selectedInterval === semitones) {
          this.selectedInterval = -1; // Deselect
        } else {
          this.selectedInterval = semitones;
        }
        this.render();
      });
    });
  }

  update() {
    this.render();
  }
}

window.IntervalsModule = IntervalsModule;
