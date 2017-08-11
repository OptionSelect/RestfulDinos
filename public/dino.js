const wrapper = document.querySelector('.wrapper')
const url = document.URL
const urlsplit = url.split('/')
const last = urlsplit[urlsplit.length - 1]
const id = parseInt(last)

function diedino() {
  let conf = window.confirm('Kill dino?!')
  if (conf) {
    fetch(`/api/dinosaurs/delete/${id}`, { method: 'DELETE' }).then(data => {
      window.location = `/`
    })
  } else {
    window.location = `/dino/${id}`
  }
}

fetch(`/api/dinosaurs/${id}`).then(resp => resp.json()).then(data => {
  console.log(data)
  let name = document.createElement('p')
  name.textContent = `Name: ${data.name}`

  let image = document.createElement('img')
  image.setAttribute('src', data.pic)

  let color = document.createElement('p')
  color.textContent = `Colors: ${data.color}`

  let size = document.createElement('p')
  size.textContent = `Size: ${data.size}`

  let habitats = document.createElement('p')
  habitats.textContent = `Habitats: ${data.habitats}`

  let editLink = document.createElement('a')
  editLink.textContent = 'Edit'
  editLink.href = `/editdino/${data.id}`

  let del = document.createElement('button')
  del.onclick = diedino
  del.textContent = 'Delete This Dino'
  del.type = 'button'
  del.name = 'button'

  wrapper.appendChild(name)
  wrapper.appendChild(image)
  wrapper.appendChild(color)
  wrapper.appendChild(size)
  wrapper.appendChild(habitats)
  wrapper.appendChild(editLink)
  wrapper.appendChild(del)
})
