import { getCss, incCss, setCss } from "dino-css"

const SPEED = 1.15
const REMOVE_LEFT = -520
const INTERVAL = { min: 700, max: 1800 }
const PTERODACTYL_SCORE = 150
const PTERODACTYL_FRAME_MS = 180
const PTERODACTYL_FRAMES = [
  "pterodactyl-0.svg",
  "pterodactyl-1.svg"
]
const PTERODACTYL_BOTTOMS = [100, 120, 140, 160]
const CACTUS_ASSETS = [
  { src: "cactus-single-small.svg", height: 119 },
  { src: "cactus-single-large.svg", height: 170 },
  { src: "cactus-pair-small.svg", height: 119 },
  { src: "cactus-pair-large.svg", height: 170 },
  { src: "cactus-triple-small.svg", height: 119 },
  { src: "cactus-four-large.svg", height: 170 }
]
const world = /** @type {HTMLElement} */ (document.querySelector("[data-world]"))

let nextMs = INTERVAL.min
let pterodactylFrame = 0
let pterodactylFrameMs = 0

const obstacles = () =>
  /** @type {NodeListOf<HTMLElement>} */(
  document.querySelectorAll("[data-obstacle]")
)

const pterodactyls = () =>
  /** @type {NodeListOf<HTMLImageElement>} */(
  document.querySelectorAll("[data-pterodactyl]")
)

export const setupCactus = () => {
  nextMs = INTERVAL.min
  pterodactylFrame = 0
  pterodactylFrameMs = 0
  obstacles().forEach(obstacle => obstacle.remove())
}

/** @type {(dt: number, spd: number, score?: number) => void} */
export const updateCactus = (dt, spd, score = 0) => {
  obstacles().forEach(obstacle => {
    incCss(obstacle, "--left", dt * spd * SPEED * -1)
    if (getCss(obstacle, "--left") <= REMOVE_LEFT) {
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
  if (score >= PTERODACTYL_SCORE && Math.random() < 0.35) {
    createPterodactyl()
    return
  }

  createCactus()
}

/** @type {() => void} */
const createCactus = () => {
  const asset = randomItem(CACTUS_ASSETS)
  const cactus = createObstacleImage("cactus", asset.src)
  setCss(cactus, "--height", asset.height)
  world.append(cactus)
}

/** @type {() => void} */
const createPterodactyl = () => {
  const pterodactyl = createObstacleImage(
    "pterodactyl",
    PTERODACTYL_FRAMES[pterodactylFrame]
  )
  setCss(pterodactyl, "--bottom", randomItem(PTERODACTYL_BOTTOMS))
  world.append(pterodactyl)
}

/** @type {(type: string, src: string) => HTMLImageElement} */
const createObstacleImage = (type, src) => {
  const img = document.createElement("img")
  img.dataset.obstacle = "true"
  img.dataset[type] = "true"
  img.src = `img/${src}`
  img.alt = ""
  img.classList.add("obstacle", type)
  setCss(img, "--left", getSpawnLeft())
  return img
}

const getSpawnLeft = () => Math.ceil(world.getBoundingClientRect().width)

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
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min)

/** @template T @param {T[]} items @returns {T} */
const randomItem = items => items[randomInt(0, items.length - 1)]