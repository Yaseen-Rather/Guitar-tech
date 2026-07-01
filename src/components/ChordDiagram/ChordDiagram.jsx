import './ChordDiagram.css'

/**
 * SVG Chord Diagram Component
 * Renders a traditional chord box diagram.
 *
 * @param {Object} props
 * @param {Array<number|null>} props.frets - 6 values [E, A, D, G, B, e]. null = muted, 0 = open
 * @param {number|null} props.barreAt - Barre fret number
 * @param {number} props.startFret - Starting fret to display (default: auto-detect)
 * @param {number} props.size - Size multiplier (default: 1)
 */
export default function ChordDiagram({ frets = [], barreAt = null, startFret = null, size = 1 }) {
  if (!frets || frets.length !== 6) return null

  // Calculate the display range
  const playedFrets = frets.filter(f => f !== null && f > 0)
  const minFret = playedFrets.length > 0 ? Math.min(...playedFrets) : 1
  const maxFret = playedFrets.length > 0 ? Math.max(...playedFrets) : 1

  const displayStart = startFret || (maxFret <= 4 ? 1 : minFret)
  const displayEnd = Math.max(displayStart + 4, maxFret + 1)
  const numFrets = displayEnd - displayStart + 1
  const isOpenPosition = displayStart === 1

  // SVG dimensions
  const padding = 20 * size
  const topPadding = 30 * size
  const stringSpacing = 16 * size
  const fretSpacing = 22 * size
  const width = padding * 2 + stringSpacing * 5
  const height = topPadding + fretSpacing * numFrets + padding

  const dotRadius = 5 * size
  const stringX = (i) => padding + i * stringSpacing
  const fretY = (f) => topPadding + (f - displayStart + 0.5) * fretSpacing

  return (
    <svg
      className="chord-diagram"
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
    >
      {/* Nut or fret number indicator */}
      {isOpenPosition ? (
        <rect
          x={padding - 1}
          y={topPadding}
          width={stringSpacing * 5 + 2}
          height={3 * size}
          fill="var(--text-primary)"
          rx={1}
        />
      ) : (
        <text
          x={padding - 10 * size}
          y={topPadding + fretSpacing * 0.5 + 4}
          className="fret-indicator"
          fontSize={9 * size}
          fill="var(--text-muted)"
          textAnchor="end"
          fontFamily="'JetBrains Mono', monospace"
          fontWeight="600"
        >
          {displayStart}
        </text>
      )}

      {/* Fret lines */}
      {Array.from({ length: numFrets + 1 }, (_, i) => (
        <line
          key={`fret-${i}`}
          x1={padding}
          y1={topPadding + i * fretSpacing}
          x2={padding + stringSpacing * 5}
          y2={topPadding + i * fretSpacing}
          stroke="var(--text-muted)"
          strokeWidth={1}
          strokeOpacity={0.3}
        />
      ))}

      {/* String lines */}
      {Array.from({ length: 6 }, (_, i) => (
        <line
          key={`string-${i}`}
          x1={stringX(i)}
          y1={topPadding}
          x2={stringX(i)}
          y2={topPadding + numFrets * fretSpacing}
          stroke="var(--text-muted)"
          strokeWidth={1 + (5 - i) * 0.2}
          strokeOpacity={0.4}
        />
      ))}

      {/* Barre */}
      {barreAt && barreAt >= displayStart && (
        <rect
          x={stringX(0) - dotRadius}
          y={fretY(barreAt) - dotRadius * 0.6}
          width={stringSpacing * 5 + dotRadius * 2}
          height={dotRadius * 1.2}
          rx={dotRadius * 0.6}
          fill="var(--text-primary)"
          opacity={0.8}
        />
      )}

      {/* Finger dots and open/muted markers */}
      {frets.map((fret, i) => {
        if (fret === null) {
          // Muted string (X)
          return (
            <text
              key={`marker-${i}`}
              x={stringX(i)}
              y={topPadding - 8 * size}
              textAnchor="middle"
              fontSize={10 * size}
              fill="var(--text-muted)"
              fontWeight="600"
            >
              ×
            </text>
          )
        }
        if (fret === 0) {
          // Open string (O)
          return (
            <circle
              key={`marker-${i}`}
              cx={stringX(i)}
              cy={topPadding - 10 * size}
              r={dotRadius * 0.7}
              fill="none"
              stroke="var(--text-muted)"
              strokeWidth={1.5}
            />
          )
        }
        // Finger dot (skip if part of barre)
        if (barreAt && fret === barreAt) return null
        return (
          <circle
            key={`dot-${i}`}
            cx={stringX(i)}
            cy={fretY(fret)}
            r={dotRadius}
            fill="var(--text-primary)"
          />
        )
      })}
    </svg>
  )
}
