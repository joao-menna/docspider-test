const MOBILE_THRESHOLD = 550
let on = false
let lastIsMobile = window.innerWidth < MOBILE_THRESHOLD
let isMobile = window.innerWidth < MOBILE_THRESHOLD

window.addEventListener('resize', (ev) => {
  lastIsMobile = isMobile
  isMobile = window.innerWidth < MOBILE_THRESHOLD

  if (isMobile !== lastIsMobile) {
    on = true
    document.querySelector('.menu').click()
  }
})

document.querySelector('.menu').addEventListener('click', (event) => {
  on = !on

  if (!isMobile) {
    if (!on) {
      document.querySelector('.sidebar').style.left = '-217px'
      document.querySelector('.content').style.left = '63px'
      document.querySelector('.content').style.width = '95%'
    } else {
      document.querySelector('.sidebar').style.left = '0'
      document.querySelector('.content').style.left = '280px'
      document.querySelector('.content').style.width = '79vw'
    }
  }

  if (isMobile) {
    if (!on) {
      document.querySelector('.sidebar').style.left = '-280px'
      document.querySelector('.content').style.left = '0'
      document.querySelector('.content').style.width = '100%'
    } else {
      document.querySelector('.sidebar').style.left = '0'
      document.querySelector('.content').style.left = '0'
      document.querySelector('.content').style.width = '100%'
    }
  }
})

document.querySelector('.menu').click()