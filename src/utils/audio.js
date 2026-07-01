/**
 * Audio engine using Karplus-Strong algorithm for realistic plucked string synthesis.
 * This creates a surprisingly realistic clean/acoustic guitar tone.
 */

let audioContext = null

/**
 * Get or create the Web Audio API context
 */
function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
  }
  // Resume if suspended (browsers require user interaction first)
  if (audioContext.state === 'suspended') {
    audioContext.resume()
  }
  return audioContext
}

/**
 * Karplus-Strong plucked string synthesis.
 * Creates a buffer of noise, then feeds it through a delay line with filtering
 * to produce a string-like decay.
 *
 * @param {number} frequency - Note frequency in Hz
 * @param {number} duration - Duration in seconds (default 1.5)
 * @param {number} volume - Volume 0-1 (default 0.5)
 * @param {number} brightness - String brightness 0-1 (default 0.5)
 */
export function playNote(frequency, duration = 1.5, volume = 0.5, brightness = 0.5) {
  const ctx = getAudioContext()
  const sampleRate = ctx.sampleRate

  // Calculate buffer size for one period of the wave
  const periodSamples = Math.round(sampleRate / frequency)
  const totalSamples = Math.round(sampleRate * duration)

  // Create the audio buffer
  const buffer = ctx.createBuffer(1, totalSamples, sampleRate)
  const data = buffer.getChannelData(0)

  // Initialize with noise burst (the "pluck")
  for (let i = 0; i < periodSamples; i++) {
    data[i] = Math.random() * 2 - 1
  }

  // Apply Karplus-Strong: each sample is the average of the sample
  // one period ago and the one before that, with a decay factor
  const decay = 0.996 // Controls how long the note rings
  const blend = 0.5 + brightness * 0.3 // Higher = brighter

  for (let i = periodSamples; i < totalSamples; i++) {
    const prev1 = data[i - periodSamples]
    const prev2 = data[i - periodSamples + 1] || data[i - periodSamples]
    data[i] = decay * (blend * prev1 + (1 - blend) * prev2)
  }

  // Create source node and connect
  const source = ctx.createBufferSource()
  source.buffer = buffer

  // Gain node for volume control and envelope
  const gainNode = ctx.createGain()
  gainNode.gain.setValueAtTime(volume, ctx.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)

  // Simple low-pass filter for warmth
  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(2000 + brightness * 6000, ctx.currentTime)
  filter.Q.setValueAtTime(0.5, ctx.currentTime)

  source.connect(filter)
  filter.connect(gainNode)
  gainNode.connect(ctx.destination)

  source.start(ctx.currentTime)
  source.stop(ctx.currentTime + duration)

  return source
}

/**
 * Play multiple notes simultaneously or with strum delay
 *
 * @param {Array<number>} frequencies - Array of frequencies to play
 * @param {number} strumDelay - Delay between each note in ms (0 = simultaneous)
 * @param {number} volume - Volume 0-1
 */
export function playChord(frequencies, strumDelay = 30, volume = 0.4) {
  frequencies.forEach((freq, i) => {
    if (freq) {
      setTimeout(() => {
        playNote(freq, 2.0, volume)
      }, i * strumDelay)
    }
  })
}

/**
 * Play a click/muted string sound
 */
export function playMutedString(volume = 0.2) {
  const ctx = getAudioContext()
  const duration = 0.05

  const buffer = ctx.createBuffer(1, Math.round(ctx.sampleRate * duration), ctx.sampleRate)
  const data = buffer.getChannelData(0)

  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.01))
  }

  const source = ctx.createBufferSource()
  source.buffer = buffer

  const gainNode = ctx.createGain()
  gainNode.gain.setValueAtTime(volume, ctx.currentTime)

  source.connect(gainNode)
  gainNode.connect(ctx.destination)
  source.start()

  return source
}
