const http = require('http');
const express = require('express')
const app = express()
const path = require('path')
const { v4: uuidv4 } = require('uuid')
require('dotenv').config()
const bodyParser = require('body-parser');
const fs = require('fs');


const hostname = '127.0.0.1';
const port = 4000;

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/static'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('', (req, res) => {
  if (req.query.edit) {
    const data = JSON.parse(fs.readFileSync('./tshirt.json'))
    const shirt = data.data.find(
        ({ id }) => id === req.query.edit
    )

    res.render('index', {
        shirt,
        id: req.query.edit
    })
} else {
    res.render('index', {
        shirt: undefined,
        id: uuidv4()
    })
}
})

app.get('/cart', (req, res) => {
  const data = JSON.parse(fs.readFileSync('./tshirt.json'))
  const amount = data.data.length

  res.render('results', {
      data,
      amount
  })
})

app.post('/results', (req, res) => {
	const data = JSON.parse(fs.readFileSync('./tshirt.json'))
    const shirt = data.data.find(({ id }) => id == req.body.id)
    
    if (shirt) {
        shirt.color = req.body.color
        shirt.sex = req.body.sex
        shirt.size = req.body.size
        shirt.text = req.body.text
    } else {
        data.data.push(req.body)
    }

    const stringData = JSON.stringify(data, null, 2)
    fs.writeFileSync('tshirt.json', stringData)

    res.redirect('cart')
})

app.post('/emptyShoppingBag', (req, res) => {
  const data = JSON.parse(fs.readFileSync('./tshirt.json'))
  data.data.length = 0

  const stringData = JSON.stringify(data, null, 2)
  fs.writeFileSync('tshirt.json', stringData)
  
  res.redirect('/cart')
})


app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});