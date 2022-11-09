const { MongoClient, ServerApiVersion, MongoRuntimeError } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

require("dotenv").config();

// middlewares
app.use(cors());
app.use(express.json());

// user : sports
// password: 2SnCQAJjgREOUpjd

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.fbybecg.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const userCollection = client.db("").collection("");
  } finally {
  }
}

app.get("/", (req, res) => {
  res.send("hello");
});

app.listen(port, () => {
  console.log(`listen ${port}`);
});
