export function debounce (callback: any, timeout: number) {
  let lastTimeout: number | null = null

  return function () {
    if (lastTimeout) { clearTimeout(lastTimeout) }

    lastTimeout = window.setTimeout(() => {
      callback.apply(null, arguments)
    }, timeout)
  }
}

export function getHorizontalScrollPosition (scrollTarget: any) {
  if (scrollTarget === window) {
    return window.pageXOffset || window.scrollX || document.body.scrollLeft || 0
  }
  return scrollTarget.scrollLeft
}

export function getVerticalScrollPosition (scrollTarget: any) {
  if (scrollTarget === window) {
    return window.pageYOffset || window.scrollY || document.body.scrollTop || 0
  }
  return scrollTarget.scrollTop
}

export function preventScroll (action: string, scrollTarget: any) {
  if (action === 'add') {
    const scrollPositionX = getHorizontalScrollPosition(scrollTarget)
    const scrollPositionY = getVerticalScrollPosition(scrollTarget)

    document.body.style.width = '100%'
    document.body.style.position = 'fixed'

    document.body.style.left = `-${scrollPositionX}px`
    document.body.style.top = `-${scrollPositionY}px`
  } else {
    const bodyLeft = document.body.style.left
    const bodyTop = document.body.style.top

    document.body.style.position = 'static'

    document.body.style.left = `0px`
    document.body.style.top = `0px`

    if (bodyLeft !== null && bodyTop !== null) {
      window.scrollTo(Math.abs(parseInt(bodyLeft)), Math.abs(parseInt(bodyTop)))
    }
  }
}
