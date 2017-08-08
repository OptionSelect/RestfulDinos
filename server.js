const express = require('express')
const app = express()
const pgp = require('pg-promise')()
const db = pgp({ database: 'dinobase' })
const bodyParser = require('body-parser')
//DATABASE NAME: DINOBASE

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.set('views', './views')
app.set('view engine', 'mst')

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.send('Peep them dinos')
})

app.get('/api/dinosaurs', (req, res) => {
  db.any('SELECT * FROM "dinos"').then(data => {
    res.json(data)
  })
})

app.get('/api/dinosaurs/:id', (req, res) => {
  const dinoId = parseInt(req.params.id)
  db.one('SELECT * FROM "dinos" WHERE id = $(id)', { id: dinoId }).then(data => {
    const myDino = data
    res.json(myDino)
  })
})

app.get('/api/dinosaurs/:id/habitats', (req, res) => {
  const dinoId = parseInt(req.params.id)
  db.one('SELECT * FROM "dinos" WHERE id = $(id)', { id: dinoId }).then(data => {
    const myDino = data.habitats
    res.json(myDino)
  })
})

app.post('/api/dinosaurs/', (req, res) => {
  const newdino = {
    name: req.body.name,
    color: req.body.color,
    size: req.body.size,
    habitats: req.body.habitats
  }

  db
    .one(
      `INSERT INTO "dinos" ("name", "color", "size", "habitats") VALUES($(name), $(color), $(size), $(habitats))
        RETURNING id`,
      newdino
    )
    .then(newdino => {
      res.redirect('/api/dinosaurs')
    })
})

app.put('/api/dinosaurs/:id', (req, res) => {
  const dinoId = parseInt(req.params.id)
  db.result(`UPDATE "dinos" SET "size" = 'BIG' WHERE "id"=$1`, dinoId).then(data => {
    res.send('Successfully updated.')
  })
})

app.delete('/api/dinosaurs/:id', (req, res) => {
  const dinoId = parseInt(req.params.id)
  db.result('DELETE FROM "dinos" WHERE id = $(id)', { id: dinoId }).then(data => {
    res.send('Mission complete.')
  })
})

app.listen(3000, (req, res) => {
  console.log('Now this is podracing!')
})
