import { spr } from '@/assets.js'
import { c1, x1, x2, x4 } from '@/canvas.js'
import { cfg } from '@/cfg.js'
import { hit } from '@/math.js'
import { splash } from '@/particles.js'
import { st } from '@/state.js'

const cars = /** @type {Obstacle[]} */ ([])
const logs = /** @type {Obstacle[]} */ ([])
const types = { cars: 3, turtles: 4 }
const body = { x: 0, y: 0, width: 0, height: 0 }

/** @param {number} max */
const rnd = max => Math.floor(Math.random() * max)

class Obstacle {
  constructor(x = 0, y = 0, width = 0, height = 0, speed = 0, type = 'car') {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.speed = speed
    this.type = type
    this.frameX = 0
    this.frameY = 0
    this.randomise = Math.floor(Math.random() * 30 + 30)
    this.carType = rnd(types.cars)
    this.turtleType = rnd(types.turtles)
  }

  resetType = () => {
    this.carType = rnd(types.cars)
    this.turtleType = rnd(types.turtles)
  }

  draw = () => {
    if (this.type === 'turtle') {
      if (st.frame % this.randomise === 0) {
        if (this.frameX >= 1) this.frameX = 0
        else this.frameX++
      }
      x1.drawImage(
        spr.turtle,
        this.frameX * 70,
        this.turtleType * 70,
        70,
        70,
        this.x,
        this.y,
        this.width,
        this.height
      )
    } else if (this.type === 'log') {
      x1.drawImage(spr.log, this.x, this.y, this.width, this.height)
    } else {
      x2.drawImage(
        spr.car,
        this.frameX * this.width,
        this.carType * this.height,
        cfg.grid * 2,
        cfg.grid,
        this.x,
        this.y,
        this.width,
        this.height
      )
    }
  }

  update = () => {
    this.x += this.speed * st.speed
    if (this.speed > 0) {
      if (this.x > c1.width + this.width) {
        this.x = -this.width
        this.resetType()
      }
    } else {
      this.frameX = 1
      if (this.x < -this.width) {
        this.x = c1.width + this.width
        this.resetType()
      }
    }
  }
}

const lanes = [
  { count: 2, gap: 350, row: 2, speed: 1, type: 'car', width: cfg.grid * 2 },
  { count: 2, gap: 300, row: 3, speed: -2, type: 'car', width: cfg.grid * 2 },
  { count: 2, gap: 400, row: 4, speed: 2, type: 'car', width: cfg.grid * 2 },
  { count: 2, gap: 400, row: 5, speed: -2, type: 'log', width: cfg.grid * 2 },
  { count: 3, gap: 200, row: 6, speed: 1, type: 'turtle', width: cfg.grid }
]

export const initObstacles = () => {
  cars.splice(0)
  logs.splice(0)

  for (let i = 0; i < lanes.length; i++) {
    const { count, gap, row, speed, type, width } = lanes[i]
    const list = type === 'car' ? cars : logs

    for (let j = 0; j < count; j++) {
      list.push(new Obstacle(
        j * gap,
        c1.height - cfg.grid * row - 20,
        width,
        cfg.grid,
        speed,
        type
      ))
    }
  }
}

/** @param {typeof body} frog @param {() => void} reset */
export const handleObstacles = (frog, reset) => {
  for (let i = 0; i < cars.length; i++) {
    cars[i].update()
    cars[i].draw()
  }
  for (let i = 0; i < logs.length; i++) {
    logs[i].update()
    logs[i].draw()
  }

  for (let i = 0; i < cars.length; i++) {
    if (hit(frog, cars[i])) {
      x4.drawImage(
        spr.hit,
        0,
        100,
        100,
        100,
        frog.x,
        frog.y,
        50,
        50
      )
      reset()
    }
  }

  if (frog.y < cfg.waterBottom && frog.y > cfg.waterTop) {
    let safe = false

    for (let i = 0; i < logs.length; i++) {
      if (hit(frog, logs[i])) {
        frog.x += logs[i].speed * st.speed
        safe = true
      }
    }
    if (!safe) {
      splash(frog)
      reset()
    }
  }
}
