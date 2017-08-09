const _ul = document.querySelector('#dinolist')

fetch('/api/dinosaurs').then(resp => resp.json()).then(data => {
  data.map(data => {
    let li = document.createElement('li')
    let name = document.createElement('p')
    let image = document.createElement('img')
    image.setAttribute('src', data.pic)
    name.textContent = data.name
    li.appendChild(image)
    li.appendChild(name)
    _ul.appendChild(li)
  })
})
