const {
  MongoClient,
  ServerApiVersion,
  MongoRuntimeError,
  ObjectId,
} = require("mongodb");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

require("dotenv").config();

const serviceAccount = require("./sports-capturing-firebase-admin.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// middlewares

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.fbybecg.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

//  token middleware

async function verifyToken(req, res, next) {
  if (req.headers?.authorization?.startsWith("Bearer ")) {
    const idToken = req.headers.authorization.split(" ")[1];
    try {
      const decodedUser = await admin.auth().verifyIdToken(idToken);
      req.decodedEmail = decodedUser.email;
    } catch {}
  }
  next();
}

async function run() {
  try {
    const servicerCollection = client.db("nodeMongoCrud").collection("users");
    const serviceCollection = client.db("nodeMongoCrud").collection("review");
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = servicerCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await servicerCollection.findOne(query);
      res.send(service);
    });

    app.post("/services", async (req, res) => {
      const order = req.body;
      const result = await servicerCollection.insertOne(order);
      res.send(result);
    });

    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await serviceCollection.insertOne(order);
      res.send(result);
    });

    app.delete("/orders/:id", verifyToken, async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await serviceCollection.deleteOne(query);
      res.send(result);
    });

    app.put("/orders/:id", verifyToken, async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const newReview = { $set: req.body };
      const result = await serviceCollection.updateOne(query, newReview);
      res.json(result);
    });

    app.get("/orders", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);
    });
  } finally {
  }
}
run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Welcome to Server");
});

app.listen(port, () => {
  console.log(`listen ${port}`);
});
