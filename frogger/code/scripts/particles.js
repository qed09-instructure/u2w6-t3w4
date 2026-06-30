import { x1, x3 } from '@/canvas.js'
import { cfg } from '@/cfg.js'
import { st } from '@/state.js'

const tau = Math.PI * 2
const pos = { x: 0, y: 0 }

export class Particle {
  constructor(x = 0, y = 0) {
    this.x = x + 25
    this.y = y + 25
    this.radius = Math.random() * 20 + 1
    this.opacity = 1
    this.directionX = Math.random() - 0.5
    this.directionY = Math.random() - 0.5
  }

  update = () => {
    this.x += this.directionX
    this.y += this.directionY
    if (this.opacity > 0.1) {
      this.opacity -= 0.9
    }
    if (this.radius > 0.15) {
      this.radius -= 0.14
    }
  }

  draw = () => {
    x3.fillStyle = `rgb(150 150 150 / ${this.opacity})`
    x3.beginPath()
    x3.arc(this.x, this.y, this.radius, 0, tau)
    x3.fill()
    x3.closePath()
  }

  ripple = () => {
    if (this.radius < 50) {
      this.radius += 0.7
      this.x -= 0.03
      this.y -= 0.03
    }
    if (this.opacity > 0) {
      this.opacity -= 0.02
    }
  }

  drawRipple = () => {
    x1.strokeStyle = `rgb(255 255 255 / ${this.opacity})`
    x1.beginPath()
    x1.arc(this.x, this.y, this.radius, 0, tau)
    x1.stroke()
    x1.closePath()
  }
}

const dust = /** @type {Particle[]} */ ([])
export const ripples = /** @type {Particle[]} */ ([])

/** @param {Particle[]} arr @param {number} count @param {typeof pos} frog */
const add = (arr, count, frog) => {
  const { x, y } = frog
  for (let i = 0; i < count; i++) {
    arr.push(new Particle(x, y))
  }
}

/** @param {typeof pos} frog */
export const splash = (frog, count = 30) => add(ripples, count, frog)

/** @param {typeof pos} frog */
export const handleParticles = frog => {
  for (let i = 0; i < dust.length; i++) {
    dust[i].update()
    dust[i].draw()
  }

  if (dust.length > cfg.maxDust) dust.splice(0, 30)

  if (
    st.keys.length > 0 &&
    frog.y > cfg.waterBottom &&
    dust.length < cfg.maxDust + 10
  ) {
    add(dust, 10, frog)
  }
}

/** @param {typeof pos} frog */
export const handleRipples = frog => {
  for (let i = 0; i < ripples.length; i++) {
    ripples[i].ripple()
    ripples[i].drawRipple()
  }

  if (ripples.length > 20) ripples.splice(0, 5)

  if (
    st.keys.length > 0 &&
    frog.y < cfg.waterBottom &&
    frog.y > cfg.waterTop
  ) {
    add(ripples, 20, frog)
  }
}
