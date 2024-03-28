const MOBILE_THRESHOLD = 550
let on = false
let lastIsMobile = window.innerWidth < MOBILE_THRESHOLD
let isMobile = window.innerWidth < MOBILE_THRESHOLD

window.addEventListener('resize', (ev) => {
  lastIsMobile = isMobile
  isMobile = window.innerWidth < MOBILE_THRESHOLD

  if (isMobile !== lastIsMobile) {
    on = !on
    document.querySelector('.menu').click()
  }
})

document.querySelector('.menu').addEventListener('click', (event) => {
  on = !on
  const sidebar = document.querySelector('.sidebar')
  const content = document.querySelector('.content')

  if (!isMobile) {
    if (!on) {
      sidebar.style.left = '-217px'
      content.style.left = '63px'
      content.style.width = 'calc(100% - 63px)'
    } else {
      sidebar.style.left = '0'
      content.style.left = '280px'
      content.style.width = 'calc(100% - 280px)'
    }
  }

  if (isMobile) {
    if (!on) {
      sidebar.style.left = '-280px'
      content.style.left = '0'
      content.style.width = '100%'
    } else {
      sidebar.style.left = '0'
      content.style.left = '0'
      content.style.width = '100%'
    }
  }
})

document.querySelector('.menu').click()