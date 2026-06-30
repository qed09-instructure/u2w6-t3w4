export const makePlatform = (x = 0, w = 0) => ({ x, w })
export const makeStick = (x = 0, len = 0, rot = 0) => ({ x, len, rot })
export const makeTree = (x = 0, color = "") => ({ x, color })

export const st = {
  phase: "waiting",
  last: /** @type {number | undefined} */ (undefined),
  heroX: 0,
  heroY: 0,
  offset: 0,
  worldW: 0,
  score: 0,
  platforms: /** @type {ReturnType<typeof makePlatform>[]} */ ([]),
  sticks: /** @type {ReturnType<typeof makeStick>[]} */ ([]),
  trees: /** @type {ReturnType<typeof makeTree>[]} */ ([])
}
