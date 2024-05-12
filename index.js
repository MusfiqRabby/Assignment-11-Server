const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000


const corsOptions = {
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
    ],
    credentials: true,
    optionSuccessStatus: 200,
  }

app.use(cors(corsOptions));
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uyt0da0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    
    const createCollection = client.db('createDB').collection('create');


    app.get('/create', async(req, res) => {
      const cursor = createCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })


    app.get('/create/:id', async(req, res) => {
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await createCollection.findOne(query)
      res.send(result)
    })

    app.get('/create/:id', async(req, res) => {
      console.log(req.params.id)
      const result = await createCollection.findOne({_id: new ObjectId (req.params.id)})
      res.send(result)
    })


    app.post('/create', async(req, res) => {
      const newCreate = req.body;
      console.log(newCreate)
      const result = await createCollection.insertOne(newCreate);
      res.send(result);
    })
  
    app.put('/create/:id', async(req, res) => {
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)}
        const options = {upsert: true};
        const updatedAssignmet = req.body;
        const updated = {
          $set: {
            title: updatedAssignmet.title, 
            image: updatedAssignmet.image, 
            category: updatedAssignmet.category,
            marks: updatedAssignmet.marks,
            description: updatedAssignmet.description,
            date: updatedAssignmet.date
          }
        }
        const result = await createCollection.updateOne(filter,updated, options);
        res.send(result)
    })

    app.delete('/create/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await createCollection.deleteOne(query);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    
  }
}
run().catch(console.log);



app.get('/', (req, res) => {
    res.send('Assignment server is Running...')
})

app.listen(port, ()=> {
    console.log(`Assignment server is Running on port ${port}`)
})




