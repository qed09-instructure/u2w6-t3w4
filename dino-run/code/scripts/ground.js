import { getCss, incCss, setCss } from "dino-css"

const SPEED = 0.05
const WIDTH = 300
const OVERLAP = 0.5
const SPACING = WIDTH - OVERLAP
const groundEls = /** @type {NodeListOf<HTMLElement>} */ (
  document.querySelectorAll("[data-ground]")
)
const [groundA, groundB] = groundEls

export const setupGround = () => {
  setCss(groundA, "--left", 0)
  setCss(groundB, "--left", SPACING)
}

/** @type {(dt: number, spd: number) => void} */
export const updateGround = (dt, spd) => {
  groundEls.forEach(ground => {
    incCss(ground, "--left", dt * spd * SPEED * -1)

    if (getCss(ground, "--left") <= -SPACING) {
      incCss(ground, "--left", SPACING * 2)
    }
  })
}
