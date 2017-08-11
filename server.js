const express = require('express')
const app = express()
const mustacheExpress = require('mustache-express')
const pgp = require('pg-promise')()
const db = pgp({ database: 'dinobase' })
const bodyParser = require('body-parser')
//DATABASE NAME: DINOBASE

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.engine('mst', mustacheExpress())

app.set('views', './views')
app.set('view engine', 'mst')

app.use(express.static('public'))

app.get('/', (req, res) => {
  db.any('SELECT * FROM "dinos"').then(data => {
    res.render('index')
  })
})

app.get('/dinos/:id', (req, res) => {
  db.any('SELECT * FROM "dinos"').then(data => {
    res.render('index', { dinos: data })
  })
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

app.get('/dino/:id', (req, res) => {
  res.render('dino')
})

app.get('/api/dinosaurs/:id/habitats', (req, res) => {
  const dinoId = parseInt(req.params.id)
  db.one('SELECT * FROM "dinos" WHERE id = $(id)', { id: dinoId }).then(data => {
    const myDino = data.habitats
    res.json(myDino)
  })
})

app.get('/adddino', (req, res) => {
  res.render('newdino')
})

app.post('/adddino/', (req, res) => {
  const newdino = {
    name: req.body.dinoname,
    color: req.body.color,
    size: req.body.size,
    habitats: req.body.habitats,
    pic: 'https://www.ucl.ac.uk/prospective-students/graduate/images/test/placeholder-200x200'
  }

  db
    .one(
      `INSERT INTO "dinos" ("name", "color", "size", "habitats", "pic") VALUES($(name), $(color), $(size), $(habitats), $(pic))
      RETURNING id`,
      newdino
    )
    .then(newdino => {
      res.redirect('/')
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

app.get('/editdino/:id', (req, res) => {
  res.render('editdino')
})

app.put('/api/dinosaurs/:id', (req, res) => {
  const dinoid = parseInt(req.params.id)
  console.log(req.body)
  const updatedino = {
    id: dinoid,
    name: req.body.name,
    color: req.body.color,
    size: req.body.size,
    habitats: req.body.habitats
  }
  console.log(updatedino)
  db
    .result(
      `update dinos set (name, color, size, habitats) = ($(name), $(color), $(size), $(habitats)) where id = $(id)`,
      updatedino
    )
    .then(data => {
      res.json(updatedino)
    })
})

app.delete('/api/dinosaurs/delete/:id', (req, res) => {
  const dinoId = parseInt(req.params.id)
  db
    .result('DELETE FROM "dinos" WHERE id = $(id)', {
      id: dinoId
    })
    .then(data => {
      res.json({ status: 'ok' })
    })
})

app.listen(3000, (req, res) => {
  console.log('Now this is podracing!')
})
