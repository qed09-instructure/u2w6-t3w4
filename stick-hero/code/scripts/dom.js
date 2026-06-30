/** @type {(s: string) => Element | null} */
const q = s => document.querySelector(s)

export const el = {
  c: /** @type {HTMLCanvasElement} */ (q("#game")),
  intro: /** @type {HTMLDivElement} */ (q("#introduction")),
  perfect: /** @type {HTMLDivElement} */ (q("#perfect")),
  restart: /** @type {HTMLButtonElement} */ (q("#restart")),
  score: /** @type {HTMLDivElement} */ (q("#score"))
}

export const cx = /** @type {CanvasRenderingContext2D} */ (
  el.c.getContext("2d")
)

export const sizeCanvas = () => {
  const { c } = el
  const { innerWidth: w, innerHeight: h } = window

  c.width = w
  c.height = h
}
