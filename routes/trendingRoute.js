const express = require("express");
const router = express.Router();
//*GET: /top-trending
router.get("/", async (req, res) => {
  const client = req.client;
  const products = client.db("style-snap").collection("products");
  console.log("hit trending route");

  try {
    const topTrendingProducts = await products
      .find({ trendingScore: { $exists: true } }) // Only select products with trendingScore field
      .sort({ trendingScore: -1 }) // Sort in descending order based on trending score
      .limit(6) // Limit to the top 20 products
      .toArray();

    if (topTrendingProducts.length === 0) {
      res.status(404).send(`No trending products found`);
    } else {
      res.send(topTrendingProducts);
    }
  } catch (error) {
    console.error("Error getting top trending products:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
