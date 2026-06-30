import { game as g, hill1, hill2, hero } from "stick-cfg"
import { cx } from "stick-dom"
import { last, sinDeg } from "stick-math"
import { st } from "stick-state"

export const draw = () => {
  const { innerWidth: w, innerHeight: h } = window
  const playW = Math.max(g.cw, st.worldW)
  const playX = Math.max(0, (w - playW) / 2)

  cx.save()
  cx.clearRect(0, 0, w, h)

  drawBackground()

  cx.translate(playX - st.offset, (h - g.ch) / 2)
  drawPlatforms()
  drawHero()
  drawSticks()

  cx.restore()
}

const drawPlatforms = () => {
  for (const { x, w } of st.platforms) {
    cx.fillStyle = "black"
    cx.fillRect(x, g.ch - g.ph, w, g.ph + (window.innerHeight - g.ch) / 2)

    if (last(st.sticks).x >= x) continue

    cx.fillStyle = "red"
    cx.fillRect(
      x + w / 2 - g.perfect / 2,
      g.ch - g.ph,
      g.perfect,
      g.perfect
    )
  }
}

const drawHero = () => {
  cx.save()
  cx.fillStyle = "black"
  cx.translate(
    st.heroX - hero.w / 2,
    st.heroY + g.ch - g.ph - hero.h / 2
  )

  drawRoundRect(-hero.w / 2, -hero.h / 2, hero.w, hero.h - 4, 5)

  const legGap = 5
  cx.beginPath()
  cx.arc(legGap, 11.5, 3, 0, Math.PI * 2, false)
  cx.fill()
  cx.beginPath()
  cx.arc(-legGap, 11.5, 3, 0, Math.PI * 2, false)
  cx.fill()

  cx.beginPath()
  cx.fillStyle = "white"
  cx.arc(5, -7, 3, 0, Math.PI * 2, false)
  cx.fill()

  cx.fillStyle = "red"
  cx.fillRect(-hero.w / 2 - 1, -12, hero.w + 2, 4.5)
  cx.beginPath()
  cx.moveTo(-9, -14.5)
  cx.lineTo(-17, -18.5)
  cx.lineTo(-14, -8.5)
  cx.fill()
  cx.beginPath()
  cx.moveTo(-10, -10.5)
  cx.lineTo(-15, -3.5)
  cx.lineTo(-5, -7)
  cx.fill()

  cx.restore()
}

/** @type {(x: number, y: number, w: number, h: number, r: number) => void} */
const drawRoundRect = (x, y, w, h, r) => {
  cx.beginPath()
  cx.moveTo(x, y + r)
  cx.lineTo(x, y + h - r)
  cx.arcTo(x, y + h, x + r, y + h, r)
  cx.lineTo(x + w - r, y + h)
  cx.arcTo(x + w, y + h, x + w, y + h - r, r)
  cx.lineTo(x + w, y + r)
  cx.arcTo(x + w, y, x + w - r, y, r)
  cx.lineTo(x + r, y)
  cx.arcTo(x, y, x, y + r, r)
  cx.fill()
}

const drawSticks = () => {
  for (const { x, len, rot } of st.sticks) {
    cx.save()
    cx.translate(x, g.ch - g.ph)
    cx.rotate((Math.PI / 180) * rot)
    cx.beginPath()
    cx.lineWidth = 2
    cx.moveTo(0, 0)
    cx.lineTo(0, -len)
    cx.stroke()
    cx.restore()
  }
}

const drawBackground = () => {
  const { innerWidth: w, innerHeight: h } = window
  const gradient = cx.createLinearGradient(0, 0, 0, h)

  gradient.addColorStop(0, "#BBD691")
  gradient.addColorStop(1, "#FEF1E1")
  cx.fillStyle = gradient
  cx.fillRect(0, 0, w, h)

  drawHill(hill1)
  drawHill(hill2)

  for (const { x, color } of st.trees) {
    drawTree(x, color)
  }
}

/** @type {(hill: typeof hill1) => void} */
const drawHill = ({ base, amp, stretch, color }) => {
  cx.beginPath()
  cx.moveTo(0, window.innerHeight)
  cx.lineTo(0, getHillY(0, base, amp, stretch))

  for (let i = 0; i < window.innerWidth; i++) {
    cx.lineTo(i, getHillY(i, base, amp, stretch))
  }

  cx.lineTo(window.innerWidth, window.innerHeight)
  cx.fillStyle = color
  cx.fill()
}

/** @type {(x: number, color: string) => void} */
const drawTree = (x, color) => {
  cx.save()
  cx.translate(
    (-st.offset * g.bg + x) * hill1.stretch,
    getTreeY(x, hill1.base, hill1.amp)
  )

  const trunkH = 5
  const trunkW = 2
  const crownH = 25
  const crownW = 10

  cx.fillStyle = "#7D833C"
  cx.fillRect(-trunkW / 2, -trunkH, trunkW, trunkH)

  cx.beginPath()
  cx.moveTo(-crownW / 2, -trunkH)
  cx.lineTo(0, -(trunkH + crownH))
  cx.lineTo(crownW / 2, -trunkH)
  cx.fillStyle = color
  cx.fill()

  cx.restore()
}

/** @type {(x: number, base: number, amp: number, stretch: number) => number} */
const getHillY = (x, base, amp, stretch) => {
  const baseY = window.innerHeight - base
  return sinDeg((st.offset * g.bg + x) * stretch) * amp + baseY
}

/** @type {(x: number, base: number, amp: number) => number} */
const getTreeY = (x, base, amp) => {
  const baseY = window.innerHeight - base
  return sinDeg(x) * amp + baseY
}
