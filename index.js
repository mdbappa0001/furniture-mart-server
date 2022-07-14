const express = require('express')
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xdcuw.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
try{
  await client.connect();
  const serviceCollection = client.db('furniture_mart').collection('services');

app.get('/service', async(req,res)=>{
  const query = {};
  const cursor = serviceCollection.find(query);
  const services = await cursor.toArray();
  res.send(services);
})

 //get one data by Id------------ 
 app.get('/service/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: ObjectId(id) }
  const service = await serviceCollection.findOne(query)
  res.send(service)
})


 // update ---------------------
 app.put('/update/:id', async (req, res) => {
  const id = req.params;
  const updatedQuantity = req.body;
  const filter = { _id: ObjectId(id) }
  const options = { upsert: true }
  const updatedDoc = {
      $set: {
          quantity: updatedQuantity.newQuantityTotal
      }
  }
  const result = await serviceCollection.updateOne(filter, updatedDoc, options)
  res.send(result)
});


   // post & update data **********************
        // post data ----------------------
        app.post('/books', async (req, res) => {
          const book = req.body;
          const result = await bookCollection.insertOne(book)
          res.send(result)
      })


 // delete a data by id ------------------------
 app.delete('/service/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: ObjectId(id) }
  const result = await serviceCollection.deleteOne(query)
  res.send(result)
})


}
finally{

}
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello From Furniture Mart')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})