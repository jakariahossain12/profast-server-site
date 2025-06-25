const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const PORT = process.env.PORT || 3000;




const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = process.env.MONGODB_URL;
  

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

      const parcelCollection = client.db('ProFastDb').collection('parcels');
      

  

      // 🚀 Add this route inside the run() function, after parcelCollection is declared
      app.post("/parcels", async (req, res) => {
        try {
          const parcel = req.body
          const result = await parcelCollection.insertOne(parcel);

          res.status(201).send(result)
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      });
      
// parcel get by email or not email all data
      app.get("/parcels", async (req, res) => {
        try {
          const userEmail = req.query.email;

          let query = {};
          if (userEmail) {
            query.user_email = userEmail
          }

          const parcels = await parcelCollection
            .find(query)
            .sort({ creation_date: -1 }) // latest first
            .toArray();

          res.send(parcels);
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
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








app.listen(PORT, () => console.log(`Server running on port ${PORT}`));