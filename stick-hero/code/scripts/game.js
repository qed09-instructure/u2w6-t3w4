import { game as g, hero, phase, speed } from "stick-cfg"
import { el, sizeCanvas } from "stick-dom"
import { draw } from "stick-render"
import { makeStick, st } from "stick-state"
import { last } from "stick-math"
import { addPlatform, addTree, hit, resetWorld } from "stick-world"

export const reset = () => {
  st.phase = phase.wait
  st.last = undefined
  st.offset = 0
  st.score = 0

  el.intro.style.opacity = "1"
  el.perfect.style.opacity = "0"
  el.restart.style.display = "none"
  el.score.textContent = `${st.score}`

  sizeCanvas()
  resetWorld()
  draw()
}

/** @type {FrameRequestCallback} */
const animate = ts => {
  const prev = st.last

  if (prev == null) {
    st.last = ts
    window.requestAnimationFrame(animate)
    return
  }

  const dt = ts - prev

  switch (st.phase) {
    case phase.wait:
      return
    case phase.stretch:
      last(st.sticks).len += dt / speed.stretch
      break
    case phase.turn:
      updateTurn(dt)
      break
    case phase.walk:
      updateWalk(dt)
      break
    case phase.shift:
      updateShift(dt)
      break
    case phase.fall:
      if (updateFall(dt)) return
      break
    default:
      throw Error("Wrong phase")
  }

  draw()
  st.last = ts
  window.requestAnimationFrame(animate)
}

/** @type {(dt: number) => void} */
const updateTurn = dt => {
  const stick = last(st.sticks)
  stick.rot += dt / speed.turn

  if (stick.rot <= 90) return

  stick.rot = 90
  const [next, perfect] = hit()

  if (next) {
    st.score += perfect ? 2 : 1
    el.score.textContent = `${st.score}`

    if (perfect) {
      el.perfect.style.opacity = "1"
      setTimeout(() => {
        el.perfect.style.opacity = "0"
      }, 1000)
    }

    addPlatform()
    addTree()
    addTree()
  }

  st.phase = phase.walk
}

/** @type {(dt: number) => void} */
const updateWalk = dt => {
  st.heroX += dt / speed.walk

  const [next] = hit()

  if (next) {
    const maxX = next.x + next.w - g.edge

    if (st.heroX > maxX) {
      st.heroX = maxX
      st.phase = phase.shift
    }

    return
  }

  const stick = last(st.sticks)
  const maxX = stick.x + stick.len + hero.w

  if (st.heroX > maxX) {
    st.heroX = maxX
    st.phase = phase.fall
  }
}

/** @type {(dt: number) => void} */
const updateShift = dt => {
  st.offset += dt / speed.shift

  const [next] = hit()

  if (!next || st.offset <= next.x + next.w - g.pad) return

  st.sticks.push(makeStick(next.x + next.w))
  st.phase = phase.wait
}

/** @type {(dt: number) => boolean} */
const updateFall = dt => {
  const stick = last(st.sticks)

  if (stick.rot < 180) {
    stick.rot += dt / speed.turn
  }

  st.heroY += dt / speed.fall

  if (st.heroY <= g.ph + 100 + (window.innerHeight - g.ch) / 2) {
    return false
  }

  el.restart.style.display = "block"
  return true
}

const startStretch = () => {
  if (st.phase !== phase.wait) return

  st.last = undefined
  el.intro.style.opacity = "0"
  st.phase = phase.stretch
  window.requestAnimationFrame(animate)
}

const stopStretch = () => {
  if (st.phase === phase.stretch) {
    st.phase = phase.turn
  }
}

/** @type {(ev: MouseEvent) => void} */
const restart = ev => {
  ev.preventDefault()
  reset()
}

/** @type {(ev: KeyboardEvent) => void} */
const restartFromKey = ev => {
  if (ev.key !== " ") return

  ev.preventDefault()
  reset()
}

const resize = () => {
  sizeCanvas()
  draw()
}

export const bind = () => {
  window.addEventListener("keydown", restartFromKey)
  window.addEventListener("mousedown", startStretch)
  window.addEventListener("mouseup", stopStretch)
  window.addEventListener("resize", resize)
  el.restart.addEventListener("click", restart)
}
