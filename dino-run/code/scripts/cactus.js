import { getCss, incCss, setCss } from "dino-css"

const SPEED = 0.05
const INTERVAL = { min: 500, max: 2000 }
const { min, max } = INTERVAL
const world = /** @type {HTMLElement} */ (document.querySelector("[data-world]"))

let nextMs = min

const cacti = () =>
  /** @type {NodeListOf<HTMLImageElement>} */ (
    document.querySelectorAll("[data-cactus]")
  )

/** @type {(...els: Element[]) => void} */
const removeEls = (...els) => {
  els.forEach(el => el.remove())
}

export const setupCactus = () => {
  nextMs = min
  removeEls(...cacti())
}

/** @type {(dt: number, spd: number) => void} */
export const updateCactus = (dt, spd) => {
  cacti().forEach(cactus => {
    incCss(cactus, "--left", dt * spd * SPEED * -1)
    if (getCss(cactus, "--left") <= -100) {
      cactus.remove()
    }
  })

  if (nextMs <= 0) {
    createCactus()
    nextMs = randomInt(min, max) / spd
  }

  nextMs -= dt
}

export const getCactusRects = () =>
  [...cacti()].map(cactus => cactus.getBoundingClientRect())

const createCactus = () => {
  const cactus = document.createElement("img")
  cactus.dataset.cactus = "true"
  cactus.src = "img/cactus.png"
  cactus.classList.add("cactus")
  setCss(cactus, "--left", 100)
  world.append(cactus)
}

/** @type {(min: number, max: number) => number} */
const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
