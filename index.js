const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@cluster0.83ramik.mongodb.net/?retryWrites=true&w=majority`;

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
    //     await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    //     await client.close();
  }
}
// run().catch(console.dir);

// console.log(object);

const notesCollection = client.db("SkillStreet").collection("notes");

app.post("/createNote", async (req, res) => {
  const note = req.body;
  console.log(note);

  const result = await notesCollection.insertOne(note);
  res.send(result);
});

app.get("/notes", async (req, res) => {
  const notes = await notesCollection.find().toArray();
  res.send(notes);
});

app.get("/notes/:id", async (req, res) => {
  const id = req.params.id;
  //   console.log(id);
  const note = await notesCollection.findOne({ _id: new ObjectId(id) });
  if (!note) {
    return res.status(404);
  }
  res.json(note);
});

app.put("/update/:id", async (req, res) => {
  const id = req.params.id;
  //   console.log(id);

  const body = req.body;
  //   console.log(body);

  const find = { _id: new ObjectId(id) };
  const option = { upsert: true };

  const note = {
    $set: {
      note: body.note,
    },
  };

  app.delete("/delete/:id", async (req, res) => {
    const id = req.params.id;
        console.log(id);

//     const query = { _id: new ObjectId(id) };
//     const result = await notesCollection.deleteOne(query);
//     res.send(result);
  });

  const result = await notesCollection.updateOne(find, note, option);
  res.send(result);
});

app.get("/", (req, res) => {
  res.send("SkillStreet Backend Development Internship Server is running");
});

app.listen(port, () => {
  console.log(
    `SkillStreet Backend Development Internship Server is running at ${port}`
  );
});
