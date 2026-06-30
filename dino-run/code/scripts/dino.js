import { getCss, incCss, setCss } from "dino-css"

const dino = /** @type {HTMLImageElement} */ (
  document.querySelector("[data-dino]")
)
const JUMP = { speed: 0.45, gravity: 0.0015 }
const RUN = { frames: 2, ms: 100 }

let jumping = false
let frame = 0
let frameMs = 0
let yVel = 0

export const setupDino = () => {
  jumping = false
  frame = 0
  frameMs = 0
  yVel = 0
  setCss(dino, "--bottom", 0)
  document.removeEventListener("keydown", jump)
  document.addEventListener("keydown", jump)
}

/** @type {(dt: number, spd: number) => void} */
export const updateDino = (dt, spd) => {
  run(dt, spd)
  rise(dt)
}

export const getDinoRect = () => {
  return dino.getBoundingClientRect()
}

export const setDinoLose = () => {
  dino.src = "img/dino-lose.png"
}

/** @type {(dt: number, spd: number) => void} */
const run = (dt, spd) => {
  const { frames, ms } = RUN

  if (jumping) {
    dino.src = "img/dino-stationary.png"
    return
  }

  if (frameMs >= ms) {
    frame = (frame + 1) % frames
    dino.src = `img/dino-run-${frame}.png`
    frameMs -= ms
  }

  frameMs += dt * spd
}

/** @type {(dt: number) => void} */
const rise = dt => {
  if (!jumping) return

  const { gravity } = JUMP
  incCss(dino, "--bottom", yVel * dt)

  if (getCss(dino, "--bottom") <= 0) {
    setCss(dino, "--bottom", 0)
    jumping = false
  }

  yVel -= gravity * dt
}

/** @type {(e: KeyboardEvent) => void} */
const jump = e => {
  if (e.code !== "Space" || jumping) return

  const { speed } = JUMP
  yVel = speed
  jumping = true
}
