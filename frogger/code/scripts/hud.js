import { x4 } from '@/canvas.js'
import { st } from '@/state.js'

export const drawHud = () => {
  x4.font = '15px Verdana'
  x4.strokeText('Score', 265, 15)

  x4.font = '60px Verdana'
  x4.fillText(`${st.score}`, 270, 65)

  x4.font = '15px Verdana'
  x4.strokeText(`Collisions: ${st.collisions}`, 10, 175)
  x4.strokeText(`Game Speed: ${st.speed.toFixed(1)}`, 10, 195)
}
