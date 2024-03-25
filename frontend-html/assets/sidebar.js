let on = false

document.querySelector('.menu').addEventListener('click', (event) => {
  on = !on

  if (!on) {
    document.querySelector('.sidebar').style.left = '-217px'
    document.querySelector('.content').style.left = '-217px'
  } else {
    document.querySelector('.sidebar').style.left = '0'
    document.querySelector('.content').style.left = '0'
  }
})

document.querySelector('.menu').click()