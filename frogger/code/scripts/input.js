import { st } from '@/state.js'

/** @type {Partial<Record<string, string>>} */
const dirs = {
  ArrowDown: 'DOWN',
  ArrowLeft: 'LEFT',
  ArrowRight: 'RIGHT',
  ArrowUp: 'UP',
  a: 'LEFT',
  d: 'RIGHT',
  s: 'DOWN',
  w: 'UP'
}

const mover = { moving: false, frameX: 0, jump: () => {} }

/** @param {string} key */
const dirFor = key => dirs[key] ?? dirs[key.toLowerCase()]

/** @param {typeof mover} frog */
const stop = frog => {
  frog.moving = false
  frog.frameX = 0
}

/** @param {typeof mover} frog */
export const bindInput = frog => {
  window.addEventListener('keydown', e => {
    const dir = dirFor(e.key)
    if (!dir || st.keys.includes(dir)) return
    st.keys.push(dir)
    frog.jump()
  })

  window.addEventListener('keyup', e => {
    const dir = dirFor(e.key)
    const i = st.keys.indexOf(dir ?? '')
    if (i < 0) return
    st.keys.splice(i, 1)
    stop(frog)
  })
}
