import { getCss, incCss, setCss } from "dino-css"

const SPEED = 1.15
const OVERLAP = 8
const groundEls = /** @type {NodeListOf<HTMLElement>} */ (
  document.querySelectorAll("[data-ground]")
)
const [groundA] = groundEls

export const setupGround = () => {
  const spacing = getSpacing()
  groundEls.forEach((ground, index) => {
    setCss(ground, "--left", spacing * index)
  })
}

/** @type {(dt: number, spd: number) => void} */
export const updateGround = (dt, spd) => {
  const spacing = getSpacing()

  groundEls.forEach(ground => {
    incCss(ground, "--left", dt * spd * SPEED * -1)

    if (getCss(ground, "--left") <= -spacing) {
      incCss(ground, "--left", spacing * groundEls.length)
    }
  })
}

const getSpacing = () => groundA.getBoundingClientRect().width - OVERLAP