/**
 * Interactive SVG Fretboard Renderer — PRS Silver Sky Style
 * Renders a complete guitar fretboard with bird inlays, notes, scales, and chords
 */

class Fretboard {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.svg = null;
    this.numFrets = 22;
    this.numStrings = 6;

    // Layout dimensions
    this.padding = { top: 30, bottom: 35, left: 55, right: 20 };
    this.stringSpacing = 22;
    this.noteRadius = 11;

    // State
    this.currentTuning = 'standard';
    this.rootNote = 0; // C = 0
    this.displayMode = 'notes'; // 'notes' | 'intervals' | 'degrees'
    this.highlightedNotes = new Set(); // Set of note indices (0-11) to highlight
    this.noteTypes = {}; // noteIndex -> 'root' | 'chord-tone' | 'scale-tone' | 'passing-tone'
    this.shapeRange = null; // { startFret, endFret } for box shape highlighting

    // Fret positions (proportional to real guitar, based on 12th root of 2)
    this.fretPositions = this._calculateFretPositions();

    // Dot inlay frets (standard Fender style)
    this.dotFrets = [3, 5, 7, 9, 15, 17, 19, 21];
    this.doubleDotFrets = [12];

    this._init();
  }

  _calculateFretPositions() {
    const positions = [0]; // nut
    const scaleLength = 1.0;
    for (let i = 1; i <= this.numFrets; i++) {
      positions.push(scaleLength - scaleLength / Math.pow(2, i / 12));
    }
    // Normalize to usable width
    const maxPos = positions[positions.length - 1];
    return positions.map(p => p / maxPos);
  }

  _getFretX(fret) {
    if (fret === 0) return this.padding.left;
    const totalWidth = this.totalWidth - this.padding.left - this.padding.right;
    return this.padding.left + this.fretPositions[fret] * totalWidth;
  }

  _getFretMidX(fret) {
    if (fret === 0) return this.padding.left - 18;
    const x1 = this._getFretX(fret - 1);
    const x2 = this._getFretX(fret);
    return (x1 + x2) / 2;
  }

  _getStringY(string) {
    // string 0 = 6th string (low E), string 5 = 1st string (high e)
    return this.padding.top + string * this.stringSpacing;
  }

  get totalWidth() {
    return Math.max(this.container.clientWidth, 900);
  }

  get totalHeight() {
    return this.padding.top + (this.numStrings - 1) * this.stringSpacing + this.padding.bottom;
  }

  _init() {
    this.render();
  }

  render() {
    this.container.innerHTML = '';

    const width = this.totalWidth;
    const height = this.totalHeight;

    const svgNS = 'http://www.w3.org/2000/svg';
    this.svg = document.createElementNS(svgNS, 'svg');
    this.svg.setAttribute('class', 'fretboard-svg');
    this.svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    this.svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

    // Defs (gradients, patterns)
    this.svg.appendChild(this._createDefs(svgNS, width, height));

    // Fretboard background
    this.svg.appendChild(this._createBoard(svgNS, width, height));

    // Shape overlay
    if (this.shapeRange) {
      this.svg.appendChild(this._createShapeOverlay(svgNS));
    }

    // Fret wires
    this._drawFrets(svgNS);

    // Dot inlays
    this._drawDotInlays(svgNS);

    // Strings
    this._drawStrings(svgNS);

    // String labels (tuning)
    this._drawStringLabels(svgNS);

    // Fret numbers
    this._drawFretNumbers(svgNS);

    // Notes
    this._drawNotes(svgNS);

    this.container.appendChild(this.svg);
  }

  _createDefs(ns, width, height) {
    const defs = document.createElementNS(ns, 'defs');

    // Rosewood gradient
    const rg = document.createElementNS(ns, 'linearGradient');
    rg.setAttribute('id', 'rosewoodGradient');
    rg.setAttribute('x1', '0'); rg.setAttribute('y1', '0');
    rg.setAttribute('x2', '0'); rg.setAttribute('y2', '1');
    [
      { offset: '0%', color: '#3a2218' },
      { offset: '30%', color: '#2a1810' },
      { offset: '70%', color: '#3a2218' },
      { offset: '100%', color: '#2a1810' },
    ].forEach(s => {
      const stop = document.createElementNS(ns, 'stop');
      stop.setAttribute('offset', s.offset);
      stop.setAttribute('stop-color', s.color);
      rg.appendChild(stop);
    });
    defs.appendChild(rg);

    // Maple wood gradient (SE Silver Sky neck)
    const mg = document.createElementNS(ns, 'linearGradient');
    mg.setAttribute('id', 'mapleGradient');
    mg.setAttribute('x1', '0'); mg.setAttribute('y1', '0');
    mg.setAttribute('x2', '0'); mg.setAttribute('y2', '1');
    [
      { offset: '0%', color: '#eedbb0' },
      { offset: '15%', color: '#f5e7cc' },
      { offset: '50%', color: '#ebd8ab' },
      { offset: '85%', color: '#e2cc9b' },
      { offset: '100%', color: '#d2b67f' },
    ].forEach(s => {
      const stop = document.createElementNS(ns, 'stop');
      stop.setAttribute('offset', s.offset);
      stop.setAttribute('stop-color', s.color);
      mg.appendChild(stop);
    });
    defs.appendChild(mg);

    // Mahogany gradient
    const mhg = document.createElementNS(ns, 'linearGradient');
    mhg.setAttribute('id', 'mahoganyGradient');
    mhg.setAttribute('x1', '0'); mhg.setAttribute('y1', '0');
    mhg.setAttribute('x2', '0'); mhg.setAttribute('y2', '1');
    [
      { offset: '0%', color: '#6b3a2a' },
      { offset: '25%', color: '#5a2e1e' },
      { offset: '50%', color: '#7a4433' },
      { offset: '75%', color: '#5a2e1e' },
      { offset: '100%', color: '#4a2518' },
    ].forEach(s => {
      const stop = document.createElementNS(ns, 'stop');
      stop.setAttribute('offset', s.offset);
      stop.setAttribute('stop-color', s.color);
      mhg.appendChild(stop);
    });
    defs.appendChild(mhg);

    // SVG Grain Pattern (Maple wood texture — light)
    const grainMaple = document.createElementNS(ns, 'pattern');
    grainMaple.setAttribute('id', 'grainPattern');
    grainMaple.setAttribute('width', '250');
    grainMaple.setAttribute('height', '60');
    grainMaple.setAttribute('patternUnits', 'userSpaceOnUse');
    const grainPathMaple = document.createElementNS(ns, 'path');
    grainPathMaple.setAttribute('d', 'M 0 8 Q 60 14, 120 7 T 250 10 M 0 28 Q 70 23, 140 32 T 250 27 M 0 48 Q 50 52, 110 45 T 250 47 M 0 18 Q 80 10, 160 22 T 250 15 M 0 38 Q 60 45, 130 36 T 250 40');
    grainPathMaple.setAttribute('stroke', '#dfc390');
    grainPathMaple.setAttribute('stroke-width', '1.2');
    grainPathMaple.setAttribute('fill', 'none');
    grainPathMaple.setAttribute('opacity', '0.22');
    grainMaple.appendChild(grainPathMaple);
    defs.appendChild(grainMaple);

    // SVG Grain Pattern (Rosewood — dark)
    const grainRose = document.createElementNS(ns, 'pattern');
    grainRose.setAttribute('id', 'grainPatternRosewood');
    grainRose.setAttribute('width', '250');
    grainRose.setAttribute('height', '60');
    grainRose.setAttribute('patternUnits', 'userSpaceOnUse');
    const grainPathRose = document.createElementNS(ns, 'path');
    grainPathRose.setAttribute('d', 'M 0 8 Q 60 14, 120 7 T 250 10 M 0 28 Q 70 23, 140 32 T 250 27 M 0 48 Q 50 52, 110 45 T 250 47 M 0 18 Q 80 10, 160 22 T 250 15 M 0 38 Q 60 45, 130 36 T 250 40');
    grainPathRose.setAttribute('stroke', '#1a0e08');
    grainPathRose.setAttribute('stroke-width', '1.5');
    grainPathRose.setAttribute('fill', 'none');
    grainPathRose.setAttribute('opacity', '0.25');
    grainRose.appendChild(grainPathRose);
    defs.appendChild(grainRose);

    // SVG Grain Pattern (Mahogany — reddish)
    const grainMah = document.createElementNS(ns, 'pattern');
    grainMah.setAttribute('id', 'grainPatternMahogany');
    grainMah.setAttribute('width', '250');
    grainMah.setAttribute('height', '60');
    grainMah.setAttribute('patternUnits', 'userSpaceOnUse');
    const grainPathMah = document.createElementNS(ns, 'path');
    grainPathMah.setAttribute('d', 'M 0 6 Q 50 12, 100 5 T 250 8 M 0 22 Q 65 18, 130 26 T 250 21 M 0 40 Q 45 44, 95 38 T 250 41 M 0 14 Q 75 8, 150 18 T 250 12 M 0 32 Q 55 38, 120 30 T 250 34');
    grainPathMah.setAttribute('stroke', '#3a1a0e');
    grainPathMah.setAttribute('stroke-width', '1.4');
    grainPathMah.setAttribute('fill', 'none');
    grainPathMah.setAttribute('opacity', '0.2');
    grainMah.appendChild(grainPathMah);
    defs.appendChild(grainMah);

    // Dot inlay gradient (pearlescent)
    const dotGrad = document.createElementNS(ns, 'radialGradient');
    dotGrad.setAttribute('id', 'dotInlayGradient');
    [
      { offset: '0%', color: '#f8f8f0' },
      { offset: '40%', color: '#e8e4d8' },
      { offset: '100%', color: '#ccc8bb' },
    ].forEach(s => {
      const stop = document.createElementNS(ns, 'stop');
      stop.setAttribute('offset', s.offset);
      stop.setAttribute('stop-color', s.color);
      dotGrad.appendChild(stop);
    });
    defs.appendChild(dotGrad);

    // Fret wire gradient (silver/nickel metallic shine)
    const fg = document.createElementNS(ns, 'linearGradient');
    fg.setAttribute('id', 'fretGradient');
    fg.setAttribute('x1', '0'); fg.setAttribute('y1', '0');
    fg.setAttribute('x2', '0'); fg.setAttribute('y2', '1');
    [
      { offset: '0%', color: '#f0f0f0' },
      { offset: '20%', color: '#cccccc' },
      { offset: '50%', color: '#adadad' },
      { offset: '70%', color: '#e0e0e0' },
      { offset: '100%', color: '#999999' },
    ].forEach(s => {
      const stop = document.createElementNS(ns, 'stop');
      stop.setAttribute('offset', s.offset);
      stop.setAttribute('stop-color', s.color);
      fg.appendChild(stop);
    });
    defs.appendChild(fg);

    return defs;
  }

  _getWoodGradient() {
    const woodType = this.woodType || 'maple';
    switch (woodType) {
      case 'rosewood': return 'url(#rosewoodGradient)';
      case 'mahogany': return 'url(#mahoganyGradient)';
      default: return 'url(#mapleGradient)';
    }
  }

  _getGrainPattern() {
    const woodType = this.woodType || 'maple';
    switch (woodType) {
      case 'rosewood': return 'url(#grainPatternRosewood)';
      case 'mahogany': return 'url(#grainPatternMahogany)';
      default: return 'url(#grainPattern)';
    }
  }

  _getDotColor() {
    const woodType = this.woodType || 'maple';
    // On dark woods, dots are white/pearl. On maple, dots are dark.
    if (woodType === 'rosewood' || woodType === 'mahogany') {
      return 'url(#dotInlayGradient)';
    }
    return '#231c15'; // Dark dots on maple
  }

  _createBoard(ns, width, height) {
    const boardY = this.padding.top - 12;
    const boardH = (this.numStrings - 1) * this.stringSpacing + 24;

    const group = document.createElementNS(ns, 'g');

    // Base wood board
    const rect = document.createElementNS(ns, 'rect');
    rect.setAttribute('class', 'fb-board');
    rect.setAttribute('x', this.padding.left - 10);
    rect.setAttribute('y', boardY);
    rect.setAttribute('width', width - this.padding.left - this.padding.right + 20);
    rect.setAttribute('height', boardH);
    rect.setAttribute('rx', '4');
    rect.setAttribute('ry', '4');
    rect.setAttribute('fill', this._getWoodGradient());
    group.appendChild(rect);

    // Wood grain pattern overlay
    const grain = document.createElementNS(ns, 'rect');
    grain.setAttribute('class', 'fb-grain');
    grain.setAttribute('x', this.padding.left - 10);
    grain.setAttribute('y', boardY);
    grain.setAttribute('width', width - this.padding.left - this.padding.right + 20);
    grain.setAttribute('height', boardH);
    grain.setAttribute('rx', '4');
    grain.setAttribute('ry', '4');
    grain.setAttribute('fill', this._getGrainPattern());
    grain.style.pointerEvents = 'none';
    group.appendChild(grain);

    return group;
  }

  _createShapeOverlay(ns) {
    if (!this.shapeRange) return document.createElementNS(ns, 'g');
    const x1 = this.shapeRange.startFret === 0
      ? this.padding.left - 20
      : this._getFretX(this.shapeRange.startFret - 1) + 2;
    const x2 = this._getFretX(this.shapeRange.endFret) - 2;
    const y = this.padding.top - 14;
    const h = (this.numStrings - 1) * this.stringSpacing + 28;

    const rect = document.createElementNS(ns, 'rect');
    rect.setAttribute('class', 'fb-shape-overlay');
    rect.setAttribute('x', x1);
    rect.setAttribute('y', y);
    rect.setAttribute('width', x2 - x1);
    rect.setAttribute('height', h);
    return rect;
  }

  _drawFrets(ns) {
    const y1 = this._getStringY(0);
    const y2 = this._getStringY(this.numStrings - 1);

    for (let f = 0; f <= this.numFrets; f++) {
      const x = this._getFretX(f);
      
      if (f === 0) {
        // Draw standard bone white nut
        const line = document.createElementNS(ns, 'line');
        line.setAttribute('class', 'fb-fret nut');
        line.setAttribute('x1', x);
        line.setAttribute('y1', y1 - 8);
        line.setAttribute('x2', x);
        line.setAttribute('y2', y2 + 8);
        this.svg.appendChild(line);
      } else {
        // Draw 3D realistic silver fret wires
        // 1. Fret shadow (offset right, semi-transparent black)
        const shadow = document.createElementNS(ns, 'line');
        shadow.setAttribute('class', 'fb-fret-shadow');
        shadow.setAttribute('x1', x + 1.2);
        shadow.setAttribute('y1', y1 - 8);
        shadow.setAttribute('x2', x + 1.2);
        shadow.setAttribute('y2', y2 + 8);
        shadow.setAttribute('stroke', '#1a1005');
        shadow.setAttribute('stroke-width', '3');
        shadow.setAttribute('stroke-linecap', 'round');
        shadow.setAttribute('opacity', '0.45');
        this.svg.appendChild(shadow);

        // 2. Fret core metallic wire (silver gradient)
        const wire = document.createElementNS(ns, 'line');
        wire.setAttribute('class', 'fb-fret');
        wire.setAttribute('x1', x);
        wire.setAttribute('y1', y1 - 8);
        wire.setAttribute('x2', x);
        wire.setAttribute('y2', y2 + 8);
        this.svg.appendChild(wire);

        // 3. Fret highlights (offset left, semi-transparent white)
        const shine = document.createElementNS(ns, 'line');
        shine.setAttribute('class', 'fb-fret-highlight');
        shine.setAttribute('x1', x - 0.6);
        shine.setAttribute('y1', y1 - 8);
        shine.setAttribute('x2', x - 0.6);
        shine.setAttribute('y2', y2 + 8);
        shine.setAttribute('stroke', '#ffffff');
        shine.setAttribute('stroke-width', '0.8');
        shine.setAttribute('stroke-linecap', 'round');
        shine.setAttribute('opacity', '0.8');
        this.svg.appendChild(shine);
      }
    }
  }

  _drawDotInlays(ns) {
    const centerY = (this._getStringY(0) + this._getStringY(this.numStrings - 1)) / 2;
    const dotColor = this._getDotColor();
    const dotRadius = 4.5;

    // Single dots
    this.dotFrets.forEach(fret => {
      if (fret > this.numFrets) return;
      const cx = this._getFretMidX(fret);

      const dot = document.createElementNS(ns, 'circle');
      dot.setAttribute('class', 'fb-dot');
      dot.setAttribute('cx', cx);
      dot.setAttribute('cy', centerY);
      dot.setAttribute('r', dotRadius);
      dot.setAttribute('fill', dotColor);
      dot.setAttribute('opacity', '0.7');
      this.svg.appendChild(dot);
    });

    // Double dots (fret 12)
    this.doubleDotFrets.forEach(fret => {
      if (fret > this.numFrets) return;
      const cx = this._getFretMidX(fret);
      const offset = 20;

      const dot1 = document.createElementNS(ns, 'circle');
      dot1.setAttribute('class', 'fb-dot');
      dot1.setAttribute('cx', cx);
      dot1.setAttribute('cy', centerY - offset);
      dot1.setAttribute('r', dotRadius);
      dot1.setAttribute('fill', dotColor);
      dot1.setAttribute('opacity', '0.7');
      this.svg.appendChild(dot1);

      const dot2 = document.createElementNS(ns, 'circle');
      dot2.setAttribute('class', 'fb-dot');
      dot2.setAttribute('cx', cx);
      dot2.setAttribute('cy', centerY + offset);
      dot2.setAttribute('r', dotRadius);
      dot2.setAttribute('fill', dotColor);
      dot2.setAttribute('opacity', '0.7');
      this.svg.appendChild(dot2);
    });
  }

  _drawStrings(ns) {
    for (let s = 0; s < this.numStrings; s++) {
      const y = this._getStringY(s);
      const line = document.createElementNS(ns, 'line');
      line.setAttribute('class', `fb-string string-${this.numStrings - s}`);
      line.setAttribute('x1', this.padding.left);
      line.setAttribute('y1', y);
      line.setAttribute('x2', this.totalWidth - this.padding.right);
      line.setAttribute('y2', y);
      this.svg.appendChild(line);
    }
  }

  _drawStringLabels(ns) {
    const tuning = NotesData.TUNINGS[this.currentTuning];

    for (let s = 0; s < this.numStrings; s++) {
      const y = this._getStringY(s);
      const label = document.createElementNS(ns, 'text');
      label.setAttribute('class', 'fb-string-label');
      label.setAttribute('x', this.padding.left - 18);
      label.setAttribute('y', y);
      label.textContent = tuning.strings[s].note;
      this.svg.appendChild(label);
    }
  }

  _drawFretNumbers(ns) {
    const y = this._getStringY(this.numStrings - 1) + 22;
    const markerFrets = [1, 3, 5, 7, 9, 12, 15, 17, 19, 21];

    markerFrets.forEach(f => {
      if (f > this.numFrets) return;
      const x = this._getFretMidX(f);
      const text = document.createElementNS(ns, 'text');
      text.setAttribute('class', 'fb-fret-number');
      text.setAttribute('x', x);
      text.setAttribute('y', y);
      text.textContent = f;
      this.svg.appendChild(text);
    });
  }

  _drawNotes(ns) {
    if (this.highlightedNotes.size === 0) return;

    const tuning = NotesData.TUNINGS[this.currentTuning];
    const useFlats = NotesData.KEY_USE_FLATS[NotesData.getNoteName(this.rootNote)] || false;

    for (let s = 0; s < this.numStrings; s++) {
      const stringMidi = tuning.strings[s].midi;
      const y = this._getStringY(s);

      for (let f = 0; f <= this.numFrets; f++) {
        const noteIndex = (stringMidi + f) % 12;

        if (!this.highlightedNotes.has(noteIndex)) continue;

        // Check shape range
        if (this.shapeRange) {
          if (f < this.shapeRange.startFret || f > this.shapeRange.endFret) continue;
        }

        const x = f === 0 ? this.padding.left - 18 : this._getFretMidX(f);
        const isRoot = noteIndex === this.rootNote;
        const noteType = this.noteTypes[noteIndex] || 'scale-tone';
        const actualType = isRoot ? 'root' : noteType;

        // Determine label
        let label;
        if (this.displayMode === 'intervals') {
          const interval = ((noteIndex - this.rootNote) + 12) % 12;
          label = NotesData.INTERVAL_NAMES[interval];
        } else if (this.displayMode === 'degrees') {
          const interval = ((noteIndex - this.rootNote) + 12) % 12;
          label = NotesData.INTERVAL_NAMES[interval];
        } else {
          label = NotesData.getNoteName(noteIndex, useFlats);
        }

        this._createNoteElement(ns, x, y, label, actualType, f === 0, stringMidi, f);
      }
    }
  }

  _createNoteElement(ns, x, y, label, type, isOpen, stringMidi, fret) {
    const g = document.createElementNS(ns, 'g');
    g.setAttribute('class', `fb-note ${type} ${isOpen ? 'open-string' : ''} animate-in`);

    const circle = document.createElementNS(ns, 'circle');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', isOpen ? this.noteRadius - 2 : this.noteRadius);
    g.appendChild(circle);

    const text = document.createElementNS(ns, 'text');
    text.setAttribute('x', x);
    text.setAttribute('y', y);
    text.textContent = label;
    g.appendChild(text);

    // Click to play sound
    g.addEventListener('click', () => {
      window.audioEngine.playStringFret(stringMidi, fret);
    });

    this.svg.appendChild(g);
  }

  // ─── Public API ─────────────────────────────────────

  setTuning(tuningKey) {
    this.currentTuning = tuningKey;
    this.render();
  }

  setRootNote(noteIndex) {
    this.rootNote = noteIndex;
    this.render();
  }

  setDisplayMode(mode) {
    this.displayMode = mode;
    this.render();
  }

  setWoodType(woodType) {
    this.woodType = woodType;
    this.render();
  }

  /**
   * Show a scale on the fretboard
   * @param {number[]} intervals - semitones from root
   * @param {object} shape - optional box shape { startFret, endFret, frets }
   */
  showScale(intervals, shape = null) {
    this.highlightedNotes.clear();
    this.noteTypes = {};

    intervals.forEach((interval, i) => {
      const noteIdx = (this.rootNote + interval) % 12;
      this.highlightedNotes.add(noteIdx);
      this.noteTypes[noteIdx] = i === 0 ? 'root' : 'chord-tone';
    });

    this.shapeRange = shape ? { startFret: shape.startFret, endFret: shape.endFret } : null;
    this.render();
  }

  /**
   * Show scale with specific fret positions for a box shape
   */
  showScaleShape(scaleIntervals, shapeData, rootFret) {
    this.highlightedNotes.clear();
    this.noteTypes = {};

    // Add all scale notes
    scaleIntervals.forEach((interval) => {
      const noteIdx = (this.rootNote + interval) % 12;
      this.highlightedNotes.add(noteIdx);
      this.noteTypes[noteIdx] = 'chord-tone';
    });
    // Root is always special
    this.noteTypes[this.rootNote] = 'root';

    // Calculate shape fret range based on shape data
    let minFret = Infinity, maxFret = -Infinity;
    shapeData.frets.forEach(stringFrets => {
      stringFrets.forEach(f => {
        const actualFret = f + rootFret;
        if (actualFret < minFret) minFret = actualFret;
        if (actualFret > maxFret) maxFret = actualFret;
      });
    });

    // Clamp to valid fret range
    minFret = Math.max(0, minFret);
    maxFret = Math.min(this.numFrets, maxFret);

    this.shapeRange = { startFret: minFret, endFret: maxFret };
    this.render();

    // After render, override notes to only show within shape
    // Re-render with restricted fret positions
    this._renderShapeNotes(shapeData, rootFret, scaleIntervals);
  }

  _renderShapeNotes(shapeData, rootFret, scaleIntervals) {
    // Remove all existing notes
    this.svg.querySelectorAll('.fb-note').forEach(n => n.remove());

    const ns = 'http://www.w3.org/2000/svg';
    const tuning = NotesData.TUNINGS[this.currentTuning];
    const useFlats = NotesData.KEY_USE_FLATS[NotesData.getNoteName(this.rootNote)] || false;

    for (let s = 0; s < this.numStrings; s++) {
      const stringMidi = tuning.strings[s].midi;
      const y = this._getStringY(s);
      const stringFrets = shapeData.frets[s];

      stringFrets.forEach(relFret => {
        let fret = relFret + rootFret;
        // Handle negative frets (wrap around or open strings)
        if (fret < 0) fret = 0;
        if (fret > this.numFrets) return;

        const noteIndex = (stringMidi + fret) % 12;
        const isRoot = noteIndex === this.rootNote;
        const noteType = isRoot ? 'root' : 'chord-tone';

        const x = fret === 0 ? this.padding.left - 18 : this._getFretMidX(fret);

        let label;
        if (this.displayMode === 'intervals') {
          const interval = ((noteIndex - this.rootNote) + 12) % 12;
          label = NotesData.INTERVAL_NAMES[interval];
        } else {
          label = NotesData.getNoteName(noteIndex, useFlats);
        }

        this._createNoteElement(ns, x, y, label, noteType, fret === 0, stringMidi, fret);
      });
    }
  }

  /**
   * Show chord voicing on the fretboard
   * @param {Array} frets - 6-element array of fret numbers (null = muted)
   * @param {number[]} chordFormula - intervals in the chord
   */
  showChord(frets, chordFormula = []) {
    this.highlightedNotes.clear();
    this.noteTypes = {};
    this.shapeRange = null;

    // Add chord formula notes
    chordFormula.forEach((interval) => {
      const noteIdx = (this.rootNote + (interval % 12)) % 12;
      this.highlightedNotes.add(noteIdx);
      this.noteTypes[noteIdx] = interval === 0 ? 'root' : 'chord-tone';
    });

    this.render();

    // Override with specific chord voicing
    this.svg.querySelectorAll('.fb-note').forEach(n => n.remove());

    const ns = 'http://www.w3.org/2000/svg';
    const tuning = NotesData.TUNINGS[this.currentTuning];
    const useFlats = NotesData.KEY_USE_FLATS[NotesData.getNoteName(this.rootNote)] || false;

    frets.forEach((fret, s) => {
      if (fret === null || fret === undefined) return;

      const stringMidi = tuning.strings[s].midi;
      const y = this._getStringY(s);
      const noteIndex = (stringMidi + fret) % 12;
      const isRoot = noteIndex === this.rootNote;

      const x = fret === 0 ? this.padding.left - 18 : this._getFretMidX(fret);

      let label;
      if (this.displayMode === 'intervals') {
        const interval = ((noteIndex - this.rootNote) + 12) % 12;
        label = NotesData.INTERVAL_NAMES[interval];
      } else {
        label = NotesData.getNoteName(noteIndex, useFlats);
      }

      this._createNoteElement(ns, x, y, label, isRoot ? 'root' : 'chord-tone', fret === 0, stringMidi, fret);
    });
  }

  /**
   * Show all notes on the fretboard (note map mode)
   */
  showAllNotes() {
    this.highlightedNotes.clear();
    this.noteTypes = {};
    this.shapeRange = null;

    // Add all 12 notes
    for (let i = 0; i < 12; i++) {
      this.highlightedNotes.add(i);
      this.noteTypes[i] = i === this.rootNote ? 'root' : 'passing-tone';
    }

    this.render();
  }

  /**
   * Show specific intervals on the fretboard
   */
  showInterval(semitones) {
    this.highlightedNotes.clear();
    this.noteTypes = {};
    this.shapeRange = null;

    // Root
    this.highlightedNotes.add(this.rootNote);
    this.noteTypes[this.rootNote] = 'root';

    // Interval note
    const intervalNote = (this.rootNote + semitones) % 12;
    this.highlightedNotes.add(intervalNote);
    this.noteTypes[intervalNote] = 'chord-tone';

    this.render();
  }

  clear() {
    this.highlightedNotes.clear();
    this.noteTypes = {};
    this.shapeRange = null;
    this.render();
  }
}

// Export
window.Fretboard = Fretboard;
