const stripe = require('stripe')('sk_test_q31ZTTblhLAa9SyZptwg7yTa')

const charge1 = (req, res) => {
  console.log('THE PAY ENDPOINT INPUT RECEIVED ID',req.body)
  stripe.charges.create({
  amount: req.body.amount,
  currency: "usd",
  //customer: "cus_ACYAi8t8lcJhle",
  source: req.body.token.id, // obtained with Stripe.js
  description: `Charge for ${req.cookies.cartID} `
}, function(err, charge) {
    if (err){
      console.log('Error is', err)
      res.end('Error Received')
    } else {
      console.log('Charge response', charge.id)
      res.end('Received')
    }
  })
}

module.exports = {
  charge1: charge1
}
