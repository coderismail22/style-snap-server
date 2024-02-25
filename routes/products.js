const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();

router.get("/", async (req, res) => {
  const client = req.client;
  const products = client.db("style-snap").collection("products");

  try {
    const cursor = products.find();
    const allProducts = await cursor.toArray();
    console.log(allProducts);
    res.send(allProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/:id", async (req, res) => {
  const client = req.client;
  const products = await client.db("style-snap").collection("products");
  console.log("products", products.collectionName);
  const productId = req.params.id;
  console.log("router hit", productId);

  try {
    const product = await products.findOne({ _id: new ObjectId(productId) });

    if (!product) {
      res.status(404).send("Product not found");
    } else {
      res.send(product);
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
