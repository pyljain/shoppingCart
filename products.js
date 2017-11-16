const aws = require('aws-sdk')
const dynamoDB = new aws.DynamoDB({
  'region': 'us-east-2'
})

const products_set = [
  {
    Name: 'A Thousand Years of Solitude',
    Price: 120 ,
    Category: 'Books',
    ProductCode: 'B001'
  },
  {
    Name: 'AWS Certified Architect',
    Price: 25,
    Category: 'Books',
    ProductCode: 'B002'
  },
  {
    Name: 'The tale of 2 cities',
    Price: 50,
    Category: 'Books',
    ProductCode: 'B003'
  },
  {
    Name: 'The Fountainhead',
    Price: 75,
    Category: 'Books',
    ProductCode: 'B004'
  },
  {
    Name: 'Coconut Oil',
    Price: 15,
    Category: 'Grocery',
    ProductCode: 'G001'
  },
  {
    Name: 'Saurkraut',
    Price: 20,
    Category: 'Grocery',
    ProductCode: 'G002'
  }
]

products_set.map((prd) => ({
  TableName: 'Products',
  Item: {
    'Product Code': {
      S: prd.ProductCode
    },
    Category: {
      S: prd.Category
    },
    Price: {
      N: `${prd.Price}`
    },
    Name: {
      S: prd.Name
    }
  }
})).forEach((p) => {
  dynamoDB.putItem(p, (err, res) => {
    if (err) {
      console.log(err)
    } else {
      console.log('Response', res)
    }
  })
})
