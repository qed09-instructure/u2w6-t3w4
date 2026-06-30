import { getCactusRects, setupCactus, updateCactus } from "dino-cactus"
import { getDinoRect, setDinoLose, setupDino, updateDino } from "dino-dino"
import { setupGround, updateGround } from "dino-ground"

const WORLD = { w: 100, h: 30 }
const SPEED_SCALE_INCREASE = 0.00001

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
  updateCactus(dt, speedScale)
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
  score += dt * 0.01
  scoreEl.textContent = `${Math.floor(score)}`
}

const handleStart = () => {
  prevTime = null
  speedScale = 1
  score = 0
  setupGround()
  setupDino()
  setupCactus()
  start.classList.add("hide")
  window.requestAnimationFrame(update)
}

const handleLose = () => {
  setDinoLose()
  setTimeout(() => {
    document.addEventListener("keydown", handleStart, { once: true })
    start.classList.remove("hide")
  }, 100)
}

const setPixelToWorldScale = () => {
  const { w, h } = WORLD
  const worldToPixelScale = Math.min(window.innerWidth / w, window.innerHeight / h)

  world.style.width = `${w * worldToPixelScale}px`
  world.style.height = `${h * worldToPixelScale}px`
}

setPixelToWorldScale()
window.addEventListener("resize", setPixelToWorldScale)
document.addEventListener("keydown", handleStart, { once: true })
