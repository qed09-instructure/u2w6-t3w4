import { spr } from '@/assets.js'
import { c2, c4, clear, x2, x4 } from '@/canvas.js'
import { bindInput } from '@/input.js'
import { Frogger } from '@/frogger.js'
import { drawHud } from '@/hud.js'
import { handleObstacles, initObstacles } from '@/obstacles.js'
import { handleParticles, handleRipples } from '@/particles.js'
import { st } from '@/state.js'

const frog = new Frogger()

const scored = () => {
  st.score++
  st.speed += 0.05
  frog.reset()
}

const resetGame = () => {
  frog.reset()
  st.score = 0
  st.collisions++
  st.speed = 1
}

const animate = () => {
  clear()

  handleRipples(frog)
  x2.drawImage(spr.bg, 0, 0, c2.width, c2.height)
  handleParticles(frog)
  frog.update()
  frog.draw()
  handleObstacles(frog, resetGame)
  drawHud()
  x4.drawImage(spr.grass, 0, 0, c4.width, c4.height)
  st.frame++

  requestAnimationFrame(animate)
}

frog.onScore = scored
initObstacles()
bindInput(frog)
requestAnimationFrame(animate)
