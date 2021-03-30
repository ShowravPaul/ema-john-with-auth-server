const express = require('express')
const cors = require('cors')
require('dotenv').config()
// console.log(process.env.DB_USER);
const MongoClient = require('mongodb').MongoClient;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tnmnk.mongodb.net/%${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
const port = 5000

app.use(express.json());
app.use(cors());

app.get('/', (req, res)=>{
  res.send("hello! it's working from DB!! project ekhon local server depended na, ekhon heroku te host hoiche!! hurra!");
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("emaJohnStore").collection("products");
  const ordersCollection = client.db("emaJohnStore").collection("orders");

  app.post('/addProduct', (req, res) => {
    const products = req.body;
    console.log(products);
    productsCollection.insertMany(products)
      .then(result => {
        console.log(result.insertedCount);
        res.send(result.insertedCount)
      })
  })

  app.get('/products', (req, res) => {
    productsCollection.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
  })

  app.get('/product/:key', (req, res) => {
    productsCollection.find({ key: req.params.key })
      .toArray((err, documents) => {
        res.send(documents[0]);
      })
  })

  app.post('/productsByKeys', (req, res) => {
    const productsKeys = req.body;
    productsCollection.find({ key: { $in: productsKeys } })
      .toArray((err, documents) => {
        res.send(documents);
      })
  })

  app.post('/addOrder', (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

});

app.listen(process.env.PORT || port)