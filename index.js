const express = require('express')
const app = express()
const aws = require('aws-sdk')
const bodyParser = require('body-parser')
app.use(bodyParser.json())

const dynamoDB = new aws.DynamoDB({
  'region': 'us-east-2'
})

app.listen(process.env.PORT || 8090, () => console.log('Server Started'))

app.post('/person', (req, res) => {
  const params = {
    TableName: 'Person',
    Item: {
      SSN: {
        S: req.body.ssn
      },
      Name: {
        S: req.body.name
      },
      Gender: {
        S: req.body.gender
      }
    }
  }
  dynamoDB.putItem(params, (err, result) => {
    if (err) {
      res.status(500).json({
        state: 'Error',
        result: err
      })
    } else {
      res.json({
        state: 'Success'
      })
    }
  })
})

app.get('/person/:ssn', (req, res) => {
  const params = {
    'TableName': 'Person',
    Key: {
      SSN: {
        S: req.params.ssn
      }
    }
  }

  dynamoDB.getItem(params, (err, result) => {
    if (err) {
      res.status(500).json({
        state: 'Error',
        result: err
      })
    } else {
      res.json(result)
    }
  })
})

app.put('/person/:ssn', (req, res) => {
  const params = {
    TableName: 'Person',
    Item: {
      SSN: {
        S: req.params.ssn
      },
      Name: {
        S: req.body.name
      },
      Gender: {
        S: req.body.gender
      }
    }
  }
  dynamoDB.putItem(params, (err, result) => {
    if (err) {
      res.status(500).json({
        state: 'Error',
        result: err
      })
    } else {
      res.json({
        state: 'Success'
      })
    }
  })
})
