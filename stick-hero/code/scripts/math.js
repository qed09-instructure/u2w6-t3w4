/** @type {(deg: number) => number} */
export const sinDeg = deg => Math.sin((deg / 180) * Math.PI)

/** @type {(min: number, max: number) => number} */
export const randInt = (min, max) => {
  return min + Math.floor(Math.random() * (max - min))
}

/** @template T @param {T[]} arr @returns {T} */
export const last = arr => arr[arr.length - 1]
