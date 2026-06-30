import { spr } from '@/assets.js'
import { c3, x3 } from '@/canvas.js'
import { cfg } from '@/cfg.js'
import { st } from '@/state.js'

export class Frogger {
  constructor() {
    this.spriteWidth = 250
    this.spriteHeight = 250
    this.width = this.spriteWidth / 5
    this.height = this.spriteHeight / 5
    this.x = 0
    this.y = 0
    this.moving = false
    this.frameX = 0
    this.frameY = 0
    this.onScore = () => {}
    this.reset()
  }

  reset = () => {
    const { width, height } = c3
    this.x = width / 2 - this.width / 2
    this.y = height - this.height - cfg.bank
  }

  update = () => {
    const dir = st.keys.at(-1)
    if (!dir || this.moving) return

    if (dir === 'UP') {
      this.y -= cfg.grid
      this.frameY = 0
    } else if (dir === 'DOWN' && this.y < c3.height - this.height * 2) {
      this.y += cfg.grid
      this.frameY = 3
    } else if (dir === 'LEFT' && this.x > this.width) {
      this.x -= cfg.grid
      this.frameY = 2
    } else if (dir === 'RIGHT' && this.x < c3.width - this.width * 2) {
      this.x += cfg.grid
      this.frameY = 1
    } else {
      return
    }

    this.moving = true
    if (this.y < 0) this.onScore()
  }

  draw = () => {
    const {
      frameX,
      frameY,
      height,
      spriteHeight,
      spriteWidth,
      width,
      x,
      y
    } = this

    x3.drawImage(
      spr.frog,
      frameX * spriteWidth,
      frameY * spriteHeight,
      spriteWidth,
      spriteHeight,
      x - 25,
      y - 25,
      width * 2,
      height * 2
    )
  }

  jump = () => {
    if (this.moving === false) this.frameX = 1
    else if (this.frameX === 1) this.frameX = 0
  }
}
