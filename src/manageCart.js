const aws = require('aws-sdk')
const dynamoDB = new aws.DynamoDB({
  region: 'us-east-2'
})
var docClient = new aws.DynamoDB.DocumentClient({
  'region': 'us-east-2'
})

const createCart = (cartid, productcode, productname, callback) => {
  const params = {
    TableName: 'ShoppingCart',
    Item: {
      'Cart ID' : {
        S: cartid
      }
    }
  }

  dynamoDB.putItem(params, (err, res) => {
    if(err) {
      console.log(err)
    } else {
      console.log('Cart Created', res)
      addCartItem(cartid, productcode, productname, (response) => {
        console.log('Item created', response)
        callback(response)
      })
      // callback(res)
    }
  })
}


const addCartItem = (cartID, prodcode, prodname, callback) => {
  const product_params = {
    TableName: 'CartItem',
    Item: {
      'Item ID': {
        S: `${cartID}-${prodcode}`
      },
      'ProductCode': {
        S: prodcode
      },
      'CartID': {
        S: cartID
      },
      'Name': {
        S: prodname
      }
    }
  }

  dynamoDB.putItem(product_params, (err, response) => {
    if (err) {
      console.log(err)
    } else {
      console.log('Inserted cart item - Step 2', response)
      //callback(response)
    }
  })

  // Scan to get current contents of the cart
  var getItemsParams = {
    TableName: 'CartItem',
    ProjectionExpression: "#itemc, #pc, #cid, #Nm",
    FilterExpression: "#cid = :input",
    ExpressionAttributeNames: {
      "#itemc": "Item Code",
      "#pc": "Product Code",
      "#cid": "CartID",
      "#Nm": "Name"
    },
    ExpressionAttributeValues: {
      ":input": cartID
    }
  }

  //console.log('PARAMS BEING USED ARE', getItemsParams)

  docClient.scan(getItemsParams, (err, resp) => {
    console.log('Getting existing cart count - Step 3')
    if (err) {
      console.log(err)
    } else {
      console.log('Cart Items for the Cart ID are - Step 4', resp)
      callback(resp)
    }
  })
}

module.exports = {
  newCart: createCart,
  additems: addCartItem

}
