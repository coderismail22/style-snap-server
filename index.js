//Common JS Way of Importing
//What to push ?
const express = require("express"); 
require("dotenv").config();
const cors = require("cors");

const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
const port = process.env.PORT || 2500;
app.use(cors());

const productsRoutes = require("./routes/products");
const categoryRoute = require("./routes/categoryRoute");
const trendingRoute = require("./routes/trendingRoute");
const filterRoute = require("./routes/filterRoute");
// console.log("productRoutes", productsRoutes);

// Server Body Start
const uri =
  "mongodb+srv://style-snap-db:140722@cluster0.4in3v8j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Middleware to add 'client' to request object
app.use((req, res, next) => {
  req.client = client;
  next();
});

// DB Connection
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

run().catch(console.dir);

// Routes
app.use("/allProducts", productsRoutes);
app.use("/trending", trendingRoute);
app.use("/", categoryRoute);
app.use("/filteredproducts", filterRoute);

// Server Body End
app.listen(port, () => {
  console.log("Server is running on", port);
});
