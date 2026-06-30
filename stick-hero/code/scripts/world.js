import { game as g, platform as pf, tree as tr } from "stick-cfg"
import { last, randInt } from "stick-math"
import { makePlatform, makeStick, makeTree, st } from "stick-state"

export const addTree = () => {
  const prev = last(st.trees)
  const x = (prev?.x ?? 0) + randInt(tr.minGap, tr.maxGap)
  const color = tr.colors[randInt(0, tr.colors.length)] ?? tr.colors[0]

  st.trees.push(makeTree(x, color))
}

export const addPlatform = () => {
  const prev = last(st.platforms)
  const farX = prev.x + prev.w
  const x = farX + randInt(pf.minGap, pf.maxGap)
  const w = randInt(pf.minW, pf.maxW)

  st.platforms.push(makePlatform(x, w))
}

export const resetWorld = () => {
  st.platforms.length = 0
  st.sticks.length = 0
  st.trees.length = 0

  st.platforms.push(makePlatform(0, g.pad))

  for (let i = 0; i < 4; i++) {
    addPlatform()
  }

  st.worldW = last(st.platforms).x + last(st.platforms).w
  st.sticks.push(makeStick(st.platforms[0].x + st.platforms[0].w))

  for (let i = 0; i < 10; i++) {
    addTree()
  }

  st.heroX = st.platforms[0].x + st.platforms[0].w - g.edge
  st.heroY = 0
}

export const hit = () => {
  const stick = last(st.sticks)

  if (stick.rot !== 90) {
    throw Error(`Stick is ${stick.rot}deg`)
  }

  const farX = stick.x + stick.len
  const target = st.platforms.find(({ x, w }) => x < farX && farX < x + w)
  const perfect = Boolean(
    target &&
      target.x + target.w / 2 - g.perfect / 2 < farX &&
      farX < target.x + target.w / 2 + g.perfect / 2
  )

  return /** @type {[ReturnType<typeof makePlatform> | undefined, boolean]} */ (
    [target, perfect]
  )
}
