const express = require("express");
require("dotenv").config();
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jbprl6s.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    //   database collection

    const foodCollection = client.db("foodsDB").collection("foods");
    const userCollection = client.db("foodsDB").collection("foodUser");
    const cartCollection = client.db("foodsDB").collection("foodCart");
    const checkoutsCollection = client
      .db("foodsDB")
      .collection("foodCheckouts");

    //   all foods find
    app.get("/foods", async (req, res) => {
      const cursor = foodCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //   update product get
    app.get("/foods/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: id };
      const result = await foodCollection.findOne(query);
      res.send(result);
    });

    //   user info gulo find korbo database theka
    app.get("/users", async (req, res) => {
      const userData = userCollection.find();
      const result = await userData.toArray();
      res.send(result);
    });

    //   food user pathabo database client site theja user info niye

    app.post("/users", async (req, res) => {
      const user = req.body;

      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    //   new food item add kor
    app.post("/foods", async (req, res) => {
      const newItem = req.body;

      const result = await foodCollection.insertOne(newItem);
      res.send(result);
    });
    app.put("/foods/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const filter = { _id: id };
      const updateFood = req.body;
      console.log(updateFood);
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: updateFood.name,
          image: updateFood.image,
          price: updateFood.price,
          madeby: updateFood.madeby,
          madebyemail: updateFood.madebyemail,
          quantity: updateFood.quantity,
          category: updateFood.category,
          origin: updateFood.origin,
          description: updateFood.description,
        },
      };
      const result = await foodCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    //   checkouts Collection
    app.post("/checkouts", async (req, res) => {
      const checkoutitem = req.body;
      console.log(checkoutitem);
      const result = await checkoutsCollection.insertOne(checkoutitem);
      res.send(result);
    });

    // database a theka add kora  cart product gulo serverr a show korte hobe
    app.get("/cart", async (req, res) => {
      const cartdata = cartCollection.find();
      const result = await cartdata.toArray();
      res.send(result);
    });
    // client site theke asa product cart add korte hobe
    app.post("/cart", async (req, res) => {
      const cartItem = req.body;
      const result = await cartCollection.insertOne(cartItem);
      res.send(result);
    });
    //   cart food delete
    app.delete("/cart/:id", async (req, res) => {
      const id = req.params.id;
      const deleteId = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(deleteId);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("resturant manager server is running");
});

app.listen(port, () => {
  console.log(`returant server runnig port is:${port}`);
});
