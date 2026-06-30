import { getCactusRects, setupCactus, updateCactus } from "dino-cactus"
import { getDinoRect, setDinoLose, setupDino, updateDino } from "dino-dino"
import { setupGround, updateGround } from "dino-ground"

const WORLD = { w: 100, h: 30 }
const SPEED_SCALE_INCREASE = 0.000012
const SCORE_SPEED = 0.01
const HIGH_SCORE_KEY = "dino-run-high-score"
const START_KEYS = new Set(["ArrowUp", "Space"])

const world = /** @type {HTMLElement} */ (document.querySelector("[data-world]"))
const scoreEl = /** @type {HTMLElement} */ (
  document.querySelector("[data-score]")
)
const start = /** @type {HTMLElement} */ (
  document.querySelector("[data-start-screen]")
)

/** @type {number | null} */
let prevTime = null
let speedScale = 1
let score = 0
let highScore = 0
let nextScoreFlash = 100

/** @type {FrameRequestCallback} */
const update = time => {
  const dt = time - (prevTime ?? time)
  prevTime = time

  if (dt === 0) {
    window.requestAnimationFrame(update)
    return
  }

  updateGround(dt, speedScale)
  updateDino(dt, speedScale)
  updateCactus(dt, speedScale, score)
  updateSpeedScale(dt)
  updateScore(dt)

  if (checkLose()) {
    handleLose()
    return
  }

  window.requestAnimationFrame(update)
}

const checkLose = () => {
  const dinoRect = getDinoRect()
  return getCactusRects().some(rect => isCollision(rect, dinoRect))
}

/** @type {(a: DOMRect, b: DOMRect) => boolean} */
const isCollision = (
  { left: leftA, top: topA, right: rightA, bottom: bottomA },
  { left: leftB, top: topB, right: rightB, bottom: bottomB }
) => {
  return (
    leftA < rightB &&
    topA < bottomB &&
    rightA > leftB &&
    bottomA > topB
  )
}

/** @type {(dt: number) => void} */
const updateSpeedScale = dt => {
  speedScale += dt * SPEED_SCALE_INCREASE
}

/** @type {(dt: number) => void} */
const updateScore = dt => {
  score += dt * SCORE_SPEED

  if (score >= nextScoreFlash) {
    scoreEl.classList.remove("flash")
    void scoreEl.offsetWidth
    scoreEl.classList.add("flash")
    while (score >= nextScoreFlash) {
      nextScoreFlash += 100
    }
  }

  renderScore()
}

const handleStart = () => {
  removeStartListeners()
  prevTime = null
  speedScale = 1
  score = 0
  nextScoreFlash = 100
  setupGround()
  setupDino()
  setupCactus()
  renderScore()
  start.classList.add("hide")
  window.requestAnimationFrame(update)
}

const handleLose = () => {
  setDinoLose()
  if (score > highScore) {
    highScore = score
    saveHighScore(highScore)
  }
  renderScore()
  start.textContent = "GAME OVER\nUp/Space To Restart - Down To Duck"
  setTimeout(() => {
    addStartListeners()
    start.classList.remove("hide")
  }, 250)
}

const setPixelToWorldScale = () => {
  const { w, h } = WORLD
  const worldToPixelScale = Math.min(window.innerWidth / w, window.innerHeight / h)

  world.style.width = `${w * worldToPixelScale}px`
  world.style.height = `${h * worldToPixelScale}px`
}

/** @type {(e: KeyboardEvent | TouchEvent) => void} */
const handleStartInput = e => {
  if (e instanceof KeyboardEvent && !START_KEYS.has(e.code)) return
  e.preventDefault()
  handleStart()
}

const addStartListeners = () => {
  document.addEventListener("keydown", handleStartInput)
  document.addEventListener("touchstart", handleStartInput)
}

const removeStartListeners = () => {
  document.removeEventListener("keydown", handleStartInput)
  document.removeEventListener("touchstart", handleStartInput)
}

/** @type {(value: number) => string} */
const formatScore = value => {
  return `${Math.floor(value)}`.padStart(5, "0")
}

const renderScore = () => {
  scoreEl.textContent =
    highScore > 0
      ? `HI ${formatScore(highScore)} ${formatScore(score)}`
      : formatScore(score)
}

const loadHighScore = () => {
  try {
    const stored = window.localStorage.getItem(HIGH_SCORE_KEY)
    return Number.parseInt(stored ?? "0", 10) || 0
  } catch {
    return 0
  }
}

/** @type {(value: number) => void} */
const saveHighScore = value => {
  try {
    window.localStorage.setItem(HIGH_SCORE_KEY, `${Math.floor(value)}`)
  } catch {
    // The game still works if local storage is blocked.
  }
}

setPixelToWorldScale()
window.addEventListener("resize", setPixelToWorldScale)
start.textContent = "Up/Space To Start - Down To Duck"
highScore = loadHighScore()
renderScore()
addStartListeners()
