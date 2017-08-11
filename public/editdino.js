const wrapper = document.querySelector('.editwrapper')
const url = document.URL
const urlsplit = url.split('/')
const last = urlsplit[urlsplit.length - 1]
const id = parseInt(last)
let markup = ''

function fetchinstein() {
  fetch(`/api/dinosaurs/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: document.querySelector('input[name=name]').value,
      color: document.querySelector('input[name=color]').value,
      size: document.querySelector('input[name=size]').value,
      habitats: document.querySelector('input[name=habitats]').value
    })
  }).then(resp => {
    window.location = `/dino/${id}`
  })
}

// GET
fetch(`/api/dinosaurs/${id}`).then(res => res.json()).then(data => {
  markup = `
    <form class="editform">
      <input type="text" name="name" value="${data.name}">
      <input type="text" name="color" value="${data.color}">
      <input type="text" name="size" value="${data.size}">
      <input type="text" name="habitats" value="${data.habitats}">
      <button type="button" name="button" onclick="fetchinstein()">Save</button>
    </form>
    `

  wrapper.innerHTML += markup
})
