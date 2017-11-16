const express = require('express')
const cookieParser = require('cookie-parser')
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')

const app = express()
const catalogRoute = require('./routes/catalog')
const addToCartRoute = require('./routes/addToCart')
const makePaymentRoute = require('./routes/makePayment')

app.use(cookieParser())
app.use(bodyParser.json())
app.use(express.static('libraries'))

app.engine('mustache', mustacheExpress())
app.set('view engine', 'mustache')
app.set('views', __dirname + '/../views')

// products.map((item) => Object.assign(item, {
//   URL: `${IMAGE_BUCKET_URL}/${item['Product Code']}.jpeg`
// }))

app.get('/catalog', catalogRoute)
app.post('/addtocart', addToCartRoute)
app.post('/pay', makePaymentRoute.charge1)

const start = () => {
  app.listen(process.env.PORT || 8090, () => console.log('Server started'))
}

module.exports = {
  start
}
