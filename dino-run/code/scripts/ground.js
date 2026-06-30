import { getCss, incCss, setCss } from "dino-css"

const SPEED = 0.05
const groundEls = /** @type {NodeListOf<HTMLElement>} */ (
  document.querySelectorAll("[data-ground]")
)
const [groundA, groundB] = groundEls

export const setupGround = () => {
  setCss(groundA, "--left", 0)
  setCss(groundB, "--left", 300)
}

/** @type {(dt: number, spd: number) => void} */
export const updateGround = (dt, spd) => {
  groundEls.forEach(ground => {
    incCss(ground, "--left", dt * spd * SPEED * -1)

    if (getCss(ground, "--left") <= -300) {
      incCss(ground, "--left", 600)
    }
  })
}
