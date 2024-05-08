// dynamicRoutes.js
const express = require("express");
const router = express.Router();

// GET /products/:category
router.get("/products/:category", async (req, res) => {
  const client = req.client;
  const products = client.db("style-snap").collection("products");
  const productCategory = req.params.category;

  try {
    const cursor = products.find({ category: productCategory });
    const filteredProducts = await cursor.toArray();

    if (filteredProducts.length === 0) {
      res
        .status(404)
        .send(`No products found for category: ${productCategory}`);
    } else {
      res.send(filteredProducts);
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
