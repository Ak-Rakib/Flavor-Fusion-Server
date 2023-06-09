const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fvciqgr.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  const menuCollection = client.db("Flavor_Fusion").collection("menu");
  const reviewsCollection = client.db("Flavor_Fusion").collection("reviews");
  const cartCollection = client.db("Flavor_Fusion").collection("cart");
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    // For Menu---------------
    app.get("/menu", async (req, res) => {
      const result = await menuCollection.find().toArray();
      res.send(result);
    });


    // For reviews-------------
    app.get("/reviews", async (req, res) => {
      const result = await reviewsCollection.find().toArray();
      res.send(result);
    });


    // For cart----------------
    app.get("/cart", async(req, res) => {
      const result = await cartCollection.find().toArray();
      res.send(result);
    });


    app.get("/cart", async (req, res) => {
      const email = req.query.email;
      if (!email) {
        res.send([]);
      } else {
        const query = { email: email }
        const result = await cartCollection.find(query).toArray();
        res.send(result);
      }

    });


    app.post("/cart", async (req, res) => {
      const item = req.body;
      const result = await cartCollection.insertOne(item);
      res.send(result);
    });


    app.delete("/cart/:id", async(req, res) => {
      const id = (req.params.id);
      console.log(id);
      const query = {_id: new ObjectId(id)}
      const result = await cartCollection.deleteOne(query);
      console.log(result)
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('server site is running');
});

app.listen(port, () => {
  console.log(`is Updating ${port}`)
});