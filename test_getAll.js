const aws = require('aws-sdk')
const dynamoDB = new aws.DynamoDB({
  'region': 'us-east-2'
})

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

docClient.scan(params, (err, res) => {
  if (err) {
    console.log(err)
  } else {
    console.log('Products Returned', res)
  }
})
