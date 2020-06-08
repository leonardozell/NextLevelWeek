const express = require("express")
const server = express()

const db = require("./database/db")

server.use(express.static("public"))

server.use(express.urlencoded({ extended: true }))

const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
  express: server,
  noCache: true
})


server.get("/", (req, res) => {
  return res.render("index.html", {title: "Um título"})
})

server.get("/create-point", (req, res) => {

  return res.render("create-point.html")
})

server.post("/savepoint", (req, res) => {

    const query = `
    INSERT INTO places (
      image,
      name,
      address,
      number,
      state,
      city,
      items
    ) VALUES (?,?,?,?,?,?,?);
  `

  const values = [
    req.body.image,
    req.body.name,
    req.body.address,
    req.body.number,
    req.body.state,
    req.body.city,
    req.body.items

  ]

  function afterInsertData(err) {
      if(err) {
        return console.log(err)
      }
      return res.render("create-point.html", { saved: true})
  }

  db.run(query, values, afterInsertData)

})

server.get("/search", (req, res) => {

  const search = req.query.search 
  if(search == "") {
    return res.render("search-results.html", {total: 0})
  }

  db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err,rows){
    if(err) {
      return console.log(err)
    }

    const total = rows.length

    console.log("Aqui estão seus registros: ")
    console.log(rows)
    return res.render("search-results.html", {places: rows, total})
  })
})

server.listen(3000)