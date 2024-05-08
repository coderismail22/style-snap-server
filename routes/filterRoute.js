// routes/products.js
const express = require("express");
const router = express.Router();

//[Extremely Messy Code. I have to fix this.]

router.get("/", async (req, res) => {
  const {
    categories,
    //category:men,
    //subcategory:tshirt,
    color,
    fabrics,
    sizes,
    cutfits,
    pricerange,
    brands,
    sortby,
  } = req.query;

  console.log("filter query", req.query);
  try {
    const filter = [];
    const sortOptions = {};

    // Handle "sortby" Properly
    if (sortby) {
      if (sortby === "lowtohigh") {
        sortOptions.discountPrice = 1;
      } else if (sortby === "hightolow") {
        sortOptions.discountPrice = -1;
      }
    }

    //Handle "price-range" parameter properly
    if (pricerange) {
      const priceRangeArray = pricerange.split("-");
      const [minprice, maxprice] = priceRangeArray.map(Number);
      filter.push({ discountPrice: { $gte: minprice, $lte: maxprice } });
      console.log("after price range check filter is", filter);
    }

    // TODO: Handle "categories" parameter properly (Strict Check)
    // if (categories) {
    //   const categoriesArray = Array.isArray(categories)
    //     ? categories
    //     : [categories];
    //   const lowercaseCategories = categoriesArray.map((category) =>
    //     category.toLowerCase()
    //   );
    //   filter.push({ categories: { $in: lowercaseCategories } });
    // }

    // Handle "colors" parameter properly
    // if (colors) {
    //   const colorsArray = Array.isArray(colors) ? colors : [colors];
    //   const lowercaseColors = colorsArray.map((color) => color.toLowerCase());
    //   filter.push({ colors: { $in: lowercaseColors } });
    //   console.log("after color check filter looks like ", filter);
    // }

    // Handle "fabrics" parameter properly
    if (fabrics) {
      const fabricsArray = Array.isArray(fabrics) ? fabrics : [fabrics];
      const lowercaseFabrics = fabricsArray.map((fabric) =>
        fabric.toLowerCase()
      );
      filter.push({ fabrics: { $in: lowercaseFabrics } });
      console.log("after fabrics check filter looks like ", filter);
    }

    // Handle "sizes" parameter properly
    if (sizes) {
      const sizesArray = Array.isArray(sizes) ? sizes : [sizes];
      const lowercaseSizes = sizesArray.map((size) => size.toLowerCase());
      filter.push({ sizes: { $in: lowercaseSizes } });
      console.log("after sizes check filter looks like ", filter);
    }
    // Handle "brands" parameter properly
    if (brands) {
      const brandsArray = Array.isArray(brands) ? brands : [brands];
      const lowercaseSizes = brandsArray.map((brand) => brand.toLowerCase());
      filter.push({ brands: { $in: lowercaseSizes } });
      console.log("after brands check filter looks like ", filter);
    }

    // Handle "cut-fit" parameter properly
    if (cutfits) {
      const cutFitsArray = Array.isArray(cutfits) ? cutfits : [cutfits];
      const lowercaseCutfits = cutFitsArray.map((cutfit) =>
        cutfit.toLowerCase()
      );
      filter.push({ cutfits: { $in: lowercaseCutfits } });
    }

    //TODO: Aggregation
    const queryParams = req.query;
    //Aggregate Here
    const pipeline = [];
    //http://localhost:5000/filteredproducts?category=men

    // Category Stage
    if (queryParams.category) {
      console.log("category aggre found", queryParams.category);
      pipeline.push({
        $match: {
          category: queryParams.category,
        },
      });
    }
    // Sub Category Stage
    if (queryParams.subcategory) {
      console.log("subcategory aggre found", queryParams.subcategory);
      pipeline.push({ $match: { subcategory: queryParams.subcategory } });
    }

    // Size Stage
    // if (queryParams.size) {
    //   console.log("size aggre found", queryParams.size);
    //   pipeline.push({
    //     $match: {
    //       sizes: queryParams.size.toUpperCase(),
    //     },
    //   });
    // }

    // Color Stage
    // if (queryParams.color) {
    //   console.log("color aggre found", queryParams.color);
    //   pipeline.push({ $match: { colors: queryParams.color } });
    // }

    //TODO: Dynamic Filter Options
    // Unique Sub Categories State
    if (queryParams.uniquesubcategories) {
      console.log("unique subcategory", queryParams.uniquesubcategories);
      pipeline.push(
        {
          $match: {
            category: queryParams.uniquesubcategories,
            subcategory: { $exists: true },
          },
        },
        {
          $group: {
            _id: "$subcategory",
          },
        }
      );
    }

    console.log("pipeline: ", pipeline);
    const client = req.client;
    const products = await client.db("style-snap").collection("products");
    const aggregatedProducts = await products.aggregate(pipeline).toArray();
    /*
    category:  men/women/boys/girls
    subcategory: tshirt/polo/panjabi
    color: black
    fabric: denim
    size: xl/2xl/28
    cutfit: open/close
    pricerange: 400-1000
    brand: apex
    sortby: lth / hto

    [
      {
        $match:{
          "category":"$men"
        }
      }
    ]
    */

    // Comment Out For Testing
    // const result = await products
    //   .find({
    //     $and: filter.length > 0 ? filter : [{}],
    //   })
    //   .sort(sortOptions)
    //   .toArray();

    const result = aggregatedProducts.filter((product) => {
      // Check if the color parameter is provided
      if (color) {
        console.log("Yes, color is provided:", color);
        // Convert the color to lowercase for case-insensitive comparison
        const lowercaseColor = color.toLowerCase();

        // Check if the product has a colors array and if it includes the provided color
        if (product.colors && product.colors.includes(lowercaseColor)) {
          // Include the product if it has the provided color
          return true;
        } else {
          // Exclude the product if it doesn't have the provided color
          return false;
        }
      }

      // Check if the product matches the filter criteria for fabrics
      if (fabrics) {
        const productFabrics = product.fabrics.map((fabric) =>
          fabric.toLowerCase()
        );
        const matchingFabrics = productFabrics.filter((fabric) =>
          fabrics.includes(fabric)
        );
        if (matchingFabrics.length === 0) {
          return false; // Exclude the product if it doesn't match any of the specified fabrics
        }
      }

      // Check if the product matches the filter criteria for sizes
      if (sizes) {
        const productSizes = product.sizes.map((size) => size.toLowerCase());
        const matchingSizes = productSizes.filter((size) =>
          sizes.includes(size)
        );
        if (matchingSizes.length === 0) {
          return false; // Exclude the product if it doesn't match any of the specified sizes
        }
      }

      // Check if the product matches the filter criteria for brands
      if (brands) {
        const productBrands = product.brands.map((brand) =>
          brand.toLowerCase()
        );
        const matchingBrands = productBrands.filter((brand) =>
          brands.includes(brand)
        );
        if (matchingBrands.length === 0) {
          return false; // Exclude the product if it doesn't match any of the specified brands
        }
      }

      // Check if the product matches the filter criteria for cut-fits
      if (cutfits) {
        const productCutfits = product.cutfits.map((cutfit) =>
          cutfit.toLowerCase()
        );
        const matchingCutfits = productCutfits.filter((cutfit) =>
          cutfits.includes(cutfit)
        );
        if (matchingCutfits.length === 0) {
          return false; // Exclude the product if it doesn't match any of the specified cut-fits
        }
      }

      // Include the product if it passes all the filter criteria
      return true;
    });

    res.json(result);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
