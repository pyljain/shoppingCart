const IMAGE_BUCKET_URL = 'https://s3.eu-west-2.amazonaws.com/alpha-bucket-p'

var products = []

const aws = require('aws-sdk')

var docClient = new aws.DynamoDB.DocumentClient({
  'region': 'us-east-2'
})

var params = {
    TableName: "Products",
    ProjectionExpression: "#pc, Category, Price, #N",
    ExpressionAttributeNames: {
        "#pc": "Product Code",
        "#N" : "Name"
    }
}

docClient.scan(params, (err, response) => {
  if (err) {
    console.log(err)
  } else {
    //console.log('Products are', response)
    products = response.Items.map((item) => Object.assign(item, {
      URL: `${IMAGE_BUCKET_URL}/${item['Product Code']}.jpeg`
    }))
  }
})

module.exports = (req, res) => {
  res.render('productcatalog', {
    catalog : products
  })
}
