/**
 * Circle of Fifths Module — Interactive SVG Visualization
 */

class CircleOfFifthsModule {
  constructor(fretboard) {
    this.fretboard = fretboard;
    this.selectedKey = 'C';
    this.container = document.getElementById('module-circle');
  }

  render() {
    const rootNote = this.fretboard.rootNote;
    const rootName = NotesData.getNoteName(rootNote);
    this.selectedKey = rootName;

    const diatonicChords = KeysData.getDiatonicChords(this.selectedKey);
    const diatonic7ths = KeysData.getDiatonicChords(this.selectedKey, true);
    const relMinor = KeysData.getRelativeMinor(this.selectedKey);
    const keySig = KeysData.KEY_SIGNATURES[this.selectedKey] || { sharps: 0, flats: 0, accidentals: [] };

    this.container.innerHTML = `
      <div class="module-header">
        <h1>⭕ Circle of Fifths</h1>
        <p>The master map of all keys. Click any key to see its chords, relative minor, and key signature.</p>
      </div>

      <div class="cof-container">
        <div class="cof-svg-container">
          ${this._renderCircleSVG()}
        </div>

        <div class="cof-info-panel">
          <div class="info-card">
            <h2 style="color: var(--gold-light); margin-bottom: var(--space-sm);">Key of ${this.selectedKey} Major</h2>
            <p style="margin-bottom: var(--space-md);">
              ${keySig.sharps > 0 ? keySig.sharps + ' sharp' + (keySig.sharps > 1 ? 's' : '') + ': ' + keySig.accidentals.join(', ') :
                keySig.flats > 0 ? keySig.flats + ' flat' + (keySig.flats > 1 ? 's' : '') + ': ' + keySig.accidentals.join(', ') :
                'No sharps or flats'}
            </p>
            <p style="font-size: 12px; color: var(--text-tertiary);">
              Relative minor: <strong style="color: var(--blue)">${relMinor}m</strong>
            </p>
          </div>

          <h3 class="mt-lg mb-md">Diatonic Chords (Triads)</h3>
          <div class="formula-display">
            ${diatonicChords.map(chord => `
              <div class="formula-note ${chord.degree === 'I' ? 'root' : ''}">
                <span class="note-name">${chord.name}</span>
                <span class="interval">${chord.degree}</span>
              </div>
            `).join('<span class="formula-arrow">—</span>')}
          </div>

          <h3 class="mt-lg mb-md">Diatonic 7th Chords</h3>
          <div class="formula-display">
            ${diatonic7ths.map(chord => `
              <div class="formula-note ${chord.degree.startsWith('I') && chord.degree.length <= 5 ? 'root' : ''}">
                <span class="note-name" style="font-size:13px">${chord.name}</span>
                <span class="interval">${chord.degree}</span>
              </div>
            `).join('<span class="formula-arrow">—</span>')}
          </div>

          <h3 class="mt-lg mb-md">Common Progressions in ${this.selectedKey}</h3>
          <div class="stagger-children">
            ${KeysData.COMMON_PROGRESSIONS.slice(0, 5).map(prog => {
              const progChords = prog.degrees.map(deg => {
                const chord = diatonicChords.find(c => c.degree === deg);
                return chord ? chord.name : deg;
              });
              return `
                <div class="progression-card mb-md">
                  <div class="prog-name">${prog.name}</div>
                  <div class="prog-genre">${prog.genre}</div>
                  <div class="prog-chords">
                    ${progChords.map(c => `<span class="prog-chord">${c}</span>`).join('')}
                  </div>
                  <div class="prog-desc">${prog.description}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;

    this._bindEvents();
  }

  _renderCircleSVG() {
    const size = 420;
    const cx = size / 2, cy = size / 2;
    const outerR = 180, innerR = 120, textR = 152;
    const minorR = 95;

    let svg = `<svg class="cof-svg" viewBox="0 0 ${size} ${size}">`;

    // Background rings
    svg += `<circle cx="${cx}" cy="${cy}" r="${outerR}" fill="none" stroke="var(--border-subtle)" stroke-width="1" class="cof-ring-pulse"/>`;
    svg += `<circle cx="${cx}" cy="${cy}" r="${innerR}" fill="none" stroke="var(--border-subtle)" stroke-width="1"/>`;

    // Key segments
    KeysData.CIRCLE_OF_FIFTHS_MAJOR.forEach((key, i) => {
      const angle = (i * 30 - 90) * Math.PI / 180;
      const nextAngle = ((i + 1) * 30 - 90) * Math.PI / 180;

      // Clean key name
      const cleanKey = key.includes('/') ? key.split('/')[0] : key;
      const isActive = cleanKey === this.selectedKey || (key.includes('/') && key.split('/')[1] === this.selectedKey);

      // Segment path (arc)
      const x1o = cx + outerR * Math.cos(angle - 0.02);
      const y1o = cy + outerR * Math.sin(angle - 0.02);
      const x2o = cx + outerR * Math.cos(nextAngle + 0.02);
      const y2o = cy + outerR * Math.sin(nextAngle + 0.02);
      const x1i = cx + innerR * Math.cos(angle - 0.02);
      const y1i = cy + innerR * Math.sin(angle - 0.02);
      const x2i = cx + innerR * Math.cos(nextAngle + 0.02);
      const y2i = cy + innerR * Math.sin(nextAngle + 0.02);

      svg += `<g class="cof-key-segment ${isActive ? 'active' : ''}" data-key="${cleanKey}">`;
      svg += `<path class="cof-segment-bg" d="M${x1i},${y1i} L${x1o},${y1o} A${outerR},${outerR} 0 0,1 ${x2o},${y2o} L${x2i},${y2i} A${innerR},${innerR} 0 0,0 ${x1i},${y1i}"
        fill="${isActive ? 'var(--gold-dim)' : 'var(--bg-card)'}"
        stroke="${isActive ? 'var(--gold)' : 'var(--border-glass)'}" stroke-width="${isActive ? 2 : 0.5}"/>`;

      // Major key text
      const midAngle = ((i * 30 + 15) - 90) * Math.PI / 180;
      const tx = cx + textR * Math.cos(midAngle);
      const ty = cy + textR * Math.sin(midAngle);
      svg += `<text class="cof-key-text" x="${tx}" y="${ty}" fill="${isActive ? 'var(--gold-light)' : 'var(--text-primary)'}">${key}</text>`;

      svg += `</g>`;

      // Minor key text (inner ring)
      const minor = KeysData.CIRCLE_OF_FIFTHS_MINOR[i];
      const minorClean = minor.includes('/') ? minor.split('/')[0] : minor;
      const mx = cx + minorR * Math.cos(midAngle);
      const my = cy + minorR * Math.sin(midAngle);
      svg += `<text class="cof-minor-text" x="${mx}" y="${my}">${minorClean}</text>`;
    });

    // Center decoration
    svg += `<circle cx="${cx}" cy="${cy}" r="55" fill="var(--bg-primary)" stroke="var(--border-subtle)" stroke-width="1"/>`;
    svg += `<text x="${cx}" y="${cy - 8}" text-anchor="middle" dominant-baseline="central" font-family="var(--font-heading)" font-size="14" font-weight="800" fill="var(--gold-light)">CIRCLE</text>`;
    svg += `<text x="${cx}" y="${cy + 10}" text-anchor="middle" dominant-baseline="central" font-family="var(--font-heading)" font-size="11" font-weight="600" fill="var(--text-tertiary)">of Fifths</text>`;

    svg += '</svg>';
    return svg;
  }

  _bindEvents() {
    this.container.querySelectorAll('.cof-key-segment').forEach(seg => {
      seg.addEventListener('click', () => {
        const key = seg.dataset.key;
        this.selectedKey = key;
        const noteIdx = NotesData.noteToIndex(key);
        if (noteIdx >= 0) {
          this.fretboard.setRootNote(noteIdx);
          // Update global selector
          const globalSelect = document.getElementById('global-root-select');
          if (globalSelect) {
            for (let i = 0; i < globalSelect.options.length; i++) {
              if (NotesData.noteToIndex(globalSelect.options[i].value) === noteIdx) {
                globalSelect.selectedIndex = i;
                break;
              }
            }
          }
        }
        this.render();
      });
    });
  }

  update() {
    this.render();
  }
}

window.CircleOfFifthsModule = CircleOfFifthsModule;
