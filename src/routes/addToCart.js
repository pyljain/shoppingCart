const cart = require('../manageCart')

module.exports = (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  console.log('Request from client is - Step 1', req.body)
  var pcode = req.body.code
  var pname = req.body.name
  var cookie = req.cookies.cartID

  if(cookie === undefined) {

    var generateCookie = Math.random().toString()
    generateCookie = generateCookie.substring(2, generateCookie.length)

    res.cookie('cartID', generateCookie, {
      maxAge: 900000,
      httpOnly: true
    })

    console.log('Cookie generated is', generateCookie)
    cart.newCart(generateCookie, pcode, pname, (resp) => {
      console.log('Cart callback', resp)
      var responseJSON = {
        "Message" : `Thank you, the item is added to your cart with ID ${cookie}`,
        "Count": resp.Count,
        "Items": resp.Items
      }

      res.send(responseJSON)
    })
  } else {
    cart.additems(cookie, pcode, pname, (response) => {
      console.log('Cart callback for existing cookie - Step 5', response)
      var responseJSON = {
        "Message" : `Thank you, the item is added to your cart with ID ${cookie}`,
        "Count": response.Count,
        "Items": response.Items
      }

      res.send(responseJSON)
      console.log('Cookie was already available - Step 6', cookie)
    })
  }
}
