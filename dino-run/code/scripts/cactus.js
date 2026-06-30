import { getCss, incCss, setCss } from "dino-css"

const SPEED = 0.05
const INTERVAL = { min: 700, max: 1800 }
const PTERODACTYL_SCORE = 150
const PTERODACTYL_FRAME_MS = 180
const PTERODACTYL_FRAMES = [
  "pterodactyl-0.svg",
  "pterodactyl-1.svg"
]
const PTERODACTYL_BOTTOMS = [18, 18, 18, 23, 30]
const CACTUS_ASSETS = [
  { src: "cactus-single-small.svg", height: 19 },
  { src: "cactus-single-medium.svg", height: 22 },
  { src: "cactus-single-large.svg", height: 26 },
  { src: "cactus-pair-small.svg", height: 20 },
  { src: "cactus-pair-medium.svg", height: 23 },
  { src: "cactus-pair-large.svg", height: 26 },
  { src: "cactus-triple-medium.svg", height: 23 },
  { src: "cactus-triple-large.svg", height: 26 },
  { src: "cactus-cluster-mixed.svg", height: 27 }
]
const world = /** @type {HTMLElement} */ (document.querySelector("[data-world]"))

let nextMs = INTERVAL.min
let pterodactylFrame = 0
let pterodactylFrameMs = 0

const obstacles = () =>
  /** @type {NodeListOf<HTMLElement>} */ (
    document.querySelectorAll("[data-obstacle]")
  )

const pterodactyls = () =>
  /** @type {NodeListOf<HTMLImageElement>} */ (
    document.querySelectorAll("[data-pterodactyl]")
  )

/** @type {(...els: Element[]) => void} */
const removeEls = (...els) => {
  els.forEach(el => el.remove())
}

export const setupCactus = () => {
  nextMs = INTERVAL.min
  pterodactylFrame = 0
  pterodactylFrameMs = 0
  removeEls(...obstacles())
}

/** @type {(dt: number, spd: number, score?: number) => void} */
export const updateCactus = (dt, spd, score = 0) => {
  obstacles().forEach(obstacle => {
    incCss(obstacle, "--left", dt * spd * SPEED * -1)
    if (getCss(obstacle, "--left") <= -20) {
      obstacle.remove()
    }
  })

  animatePterodactyls(dt, spd)

  if (nextMs <= 0) {
    createObstacle(score)
    nextMs = randomInt(INTERVAL.min, INTERVAL.max) / spd
  }

  nextMs -= dt
}

export const getCactusRects = () =>
  [...obstacles()].map(obstacle => getObstacleRect(obstacle))

/** @type {(score: number) => void} */
const createObstacle = score => {
  const canFly = score >= PTERODACTYL_SCORE
  if (canFly && Math.random() < 0.35) {
    createPterodactyl()
    return
  }

  createCactus()
}

/** @type {() => void} */
const createCactus = () => {
  const asset = randomItem(CACTUS_ASSETS)
  const cactus = document.createElement("img")

  cactus.dataset.obstacle = "true"
  cactus.dataset.cactus = "true"
  cactus.src = `img/${asset.src}`
  cactus.alt = ""
  cactus.classList.add("obstacle", "cactus")
  setCss(cactus, "--left", 100)
  setCss(cactus, "--height", asset.height)

  world.append(cactus)
}

/** @type {() => void} */
const createPterodactyl = () => {
  const pterodactyl = document.createElement("img")
  pterodactyl.dataset.obstacle = "true"
  pterodactyl.dataset.pterodactyl = "true"
  pterodactyl.src = `img/${PTERODACTYL_FRAMES[pterodactylFrame]}`
  pterodactyl.classList.add("obstacle", "pterodactyl")
  pterodactyl.alt = ""
  setCss(pterodactyl, "--left", 100)
  setCss(pterodactyl, "--bottom", randomItem(PTERODACTYL_BOTTOMS))
  world.append(pterodactyl)
}

/** @type {(dt: number, spd: number) => void} */
const animatePterodactyls = (dt, spd) => {
  pterodactylFrameMs += dt * spd
  if (pterodactylFrameMs < PTERODACTYL_FRAME_MS) return

  pterodactylFrame = (pterodactylFrame + 1) % PTERODACTYL_FRAMES.length
  pterodactylFrameMs -= PTERODACTYL_FRAME_MS
  pterodactyls().forEach(pterodactyl => {
    pterodactyl.src = `img/${PTERODACTYL_FRAMES[pterodactylFrame]}`
  })
}

/** @type {(obstacle: HTMLElement) => DOMRect} */
const getObstacleRect = obstacle => {
  const rect = obstacle.getBoundingClientRect()
  if (obstacle.dataset.pterodactyl === "true") {
    return shrinkRect(rect, 0.1, 0.22, 0.12, 0.16)
  }

  return shrinkRect(rect, 0.12, 0.08, 0.08, 0.02)
}

/** @type {(rect: DOMRect, left: number, top: number, right: number, bottom: number) => DOMRect} */
const shrinkRect = (rect, left, top, right, bottom) => {
  const insetLeft = rect.width * left
  const insetTop = rect.height * top
  const insetRight = rect.width * right
  const insetBottom = rect.height * bottom

  return new DOMRect(
    rect.left + insetLeft,
    rect.top + insetTop,
    rect.width - insetLeft - insetRight,
    rect.height - insetTop - insetBottom
  )
}

/** @type {(min: number, max: number) => number} */
const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

/** @template T @param {T[]} items @returns {T} */
const randomItem = items => {
  return items[randomInt(0, items.length - 1)]
}
