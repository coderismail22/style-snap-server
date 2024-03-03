const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();

//!GET: products/trending

router.get("/products/trending", (req, res) => {
  const client = req.client;
  const products = client.db("style-snap").collection("products");
try {
    
} catch (error) {
    console.error("Error getting products",error.message);
    res.status(500).send("Internal Server Error")
}

});

module.exports = router;
