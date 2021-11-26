const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();


const app = express()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.guhcu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        
        const database = client.db('services');
        const servicesCollenction = database.collection('package');

        const orderCollection = database.collection('orders');

        const imgCollection = database.collection('imggallery');

        // GET API
        app.get('/services', async(req, res)=>{
            const cursor = servicesCollenction.find({});
            const servicespackage = await cursor.toArray();
            res.send(servicespackage);
        });
        app.get('/img', async(req, res)=>{
            const cursor = imgCollection.find({});
            const images = await cursor.toArray();
            res.send(images);
        });

        app.post('/services', async(req, res)=>{
          const service = req.body;
          console.log("hit api",service);

          const result = await servicesCollenction.insertOne(service);
          console.log(result);
          res.json(result);
        })

        // Orders Api
        app.post('/orders', async(req, res)=>{
          const order = req.body;
          console.log("hit order api", order);
          const result = await orderCollection.insertOne(order);
          res.json(result);
        })

    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

