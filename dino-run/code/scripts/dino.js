import { getCss, incCss, setCss } from "dino-css"

const dino = /** @type {HTMLImageElement} */ (
  document.querySelector("[data-dino]")
)
const JUMP = { speed: 2.8, gravity: 0.0093, fastDrop: 2.5 }
const JUMP_SOUND = { frequency: 650, duration: 0.15, volume: 0.1 }
const IDLE_FRAME = "dino-stationary.svg"
const HIT_FRAME = "dino-hit.svg"
const RUN = {
  frames: ["dino-run-0.svg", "dino-run-1.svg"],
  ms: 90
}
const DUCK = {
  frames: ["dino-duck-0.svg", "dino-duck-1.svg"],
  ms: 90
}
const JUMP_KEYS = new Set(["Space", "ArrowUp"])
const DUCK_KEYS = new Set(["ArrowDown"])

let jumping = false
let ducking = false
let activeAnimation = RUN
let frame = 0
let frameMs = 0
let yVel = 0
/** @type {AudioContext | null} */
let audioCtx = null

export const setupDino = () => {
  jumping = ducking = false
  activeAnimation = RUN
  frame = frameMs = yVel = 0
  setCss(dino, "--bottom", 0)
  dino.classList.remove("ducking")
  dino.src = `img/${IDLE_FRAME}`
  removeControls()
  document.addEventListener("keydown", handleKeyDown)
  document.addEventListener("keyup", handleKeyUp)
}

/** @type {(dt: number, spd: number) => void} */
export const updateDino = (dt, spd) => {
  run(dt, spd)
  rise(dt)
}

export const getDinoRect = () => {
  const rect = dino.getBoundingClientRect()
  const insetX = rect.width * (ducking ? 0.08 : 0.18)
  const insetTop = rect.height * (ducking ? 0.18 : 0.08)
  const insetBottom = rect.height * 0.04

  return new DOMRect(
    rect.left + insetX,
    rect.top + insetTop,
    rect.width - insetX * 2,
    rect.height - insetTop - insetBottom
  )
}

export const setDinoLose = () => {
  removeControls()
  dino.classList.remove("ducking")
  dino.src = `img/${HIT_FRAME}`
}

/** @type {(dt: number, spd: number) => void} */
const run = (dt, spd) => {
  const isDucking = ducking && !jumping
  const animation = isDucking ? DUCK : RUN
  const { frames, ms } = animation
  dino.classList.toggle("ducking", isDucking)

  if (jumping) {
    dino.src = `img/${IDLE_FRAME}`
    return
  }

  if (activeAnimation !== animation) {
    activeAnimation = animation
    frame = 0
    frameMs = 0
    dino.src = `img/${frames[frame]}`
  }

  if (frameMs >= ms) {
    frame = (frame + 1) % frames.length
    dino.src = `img/${frames[frame]}`
    frameMs -= ms
  }

  frameMs += dt * spd
}

/** @type {(dt: number) => void} */
const rise = dt => {
  if (!jumping) return

  const gravity = ducking ? JUMP.gravity * JUMP.fastDrop : JUMP.gravity
  incCss(dino, "--bottom", yVel * dt)

  if (getCss(dino, "--bottom") <= 0) {
    setCss(dino, "--bottom", 0)
    jumping = false
    yVel = 0
  }

  yVel -= gravity * dt
}

/** @type {(e: KeyboardEvent) => void} */
const handleKeyDown = e => {
  if (JUMP_KEYS.has(e.code)) {
    e.preventDefault()
    jump()
    return
  }

  if (DUCK_KEYS.has(e.code)) {
    e.preventDefault()
    ducking = true
  }
}

/** @type {(e: KeyboardEvent) => void} */
const handleKeyUp = e => {
  if (!DUCK_KEYS.has(e.code)) return
  e.preventDefault()
  ducking = false
}

const jump = () => {
  if (jumping || ducking) return

  yVel = JUMP.speed
  jumping = true
  frame = 0
  frameMs = 0
  playJumpSound()
}

const playJumpSound = () => {
  const ctx = getAudioContext()

  if (ctx.state === "suspended") {
    void ctx.resume()
  }

  const now = ctx.currentTime
  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()
  const { frequency, duration, volume } = JUMP_SOUND
  const end = now + duration

  oscillator.type = "square"
  oscillator.frequency.setValueAtTime(frequency, now)
  oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.75, end)
  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.exponentialRampToValueAtTime(volume, now + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.0001, end)

  oscillator.connect(gain)
  gain.connect(ctx.destination)
  oscillator.start(now)
  oscillator.stop(end)
}

const getAudioContext = () => {
  return audioCtx ??= new AudioContext()
}

const removeControls = () => {
  document.removeEventListener("keydown", handleKeyDown)
  document.removeEventListener("keyup", handleKeyUp)
}