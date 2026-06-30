import { cfg } from '@/cfg.js'

/** @param {string} id */
const byId = id => /** @type {HTMLCanvasElement} */ (document.getElementById(id))

/** @param {HTMLCanvasElement} el */
const ctx2d = el =>
  /** @type {CanvasRenderingContext2D} */ (el.getContext('2d'))

export const cnv = ['canvas1', 'canvas2', 'canvas3', 'canvas4'].map(byId)
export const ctx = cnv.map(ctx2d)

for (let i = 0; i < cnv.length; i++) {
  cnv[i].width = cfg.size
  cnv[i].height = cfg.size
}

export const [c1, c2, c3, c4] = cnv
export const [x1, x2, x3, x4] = ctx

export const clear = () => {
  for (let i = 0; i < cnv.length; i++) {
    const { width, height } = cnv[i]
    ctx[i].clearRect(0, 0, width, height)
  }
}
