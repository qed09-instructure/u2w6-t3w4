const box = { x: 0, y: 0, width: 0, height: 0 }

/** @param {typeof box} a @param {typeof box} b */
export const hit = (a, b) => !(
  a.x > b.x + b.width ||
  a.x + a.width < b.x ||
  a.y > b.y + b.height ||
  a.y + a.height < b.y
)
