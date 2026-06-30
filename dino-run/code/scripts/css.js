/** @type {(el: HTMLElement, prop: string) => number} */
export const getCss = (el, prop) => {
  const val = getComputedStyle(el).getPropertyValue(prop)
  return Number.parseFloat(val) || 0
}

/** @type {(el: HTMLElement, prop: string, val: string | number) => void} */
export const setCss = (el, prop, val) => {
  el.style.setProperty(prop, `${val}`)
}

/** @type {(el: HTMLElement, prop: string, inc: number) => void} */
export const incCss = (el, prop, inc) => {
  setCss(el, prop, getCss(el, prop) + inc)
}
