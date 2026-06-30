/** @param {string} src */
const img = src => {
  const el = new Image()
  el.src = new URL(`../img/${src}`, import.meta.url).href
  return el
}

export const spr = {
  bg: img('background-lvl2.png'),
  car: img('cars.png'),
  frog: img('frog-spritesheet.png'),
  grass: img('grass-2.png'),
  hit: img('collisions.png'),
  log: img('log.png'),
  turtle: img('turtles.png')
}
