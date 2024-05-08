const express = require("express");
const router = express.Router();


// Route handler for /men/:category
app.get('/men/:category', (req, res) => {
    const { category } = req.params;
    // Filter products based on category
    const menProducts = products.filter(product => product.category === category);
    res.json({ products: menProducts });
});

app.get('/women/:category', (req, res) => {
    const { category } = req.params;
    // Filter products based on category
    const womenProducts = products.filter(product => product.category === category);
    res.json({ products: womenProducts });
});

// Route handler for /boys/:category
app.get('/boys/:category', (req, res) => {
    const { category } = req.params;
    // Filter products based on category
    const boysProducts = products.filter(product => product.category === category);
    res.json({ products: boysProducts });
});

// Route handler for /girls/:category
app.get('/girls/:category', (req, res) => {
    const { category } = req.params;
    // Filter products based on category
    const girlsProducts = products.filter(product => product.category === category);
    res.json({ products: girlsProducts });
});


module.exports = router;
