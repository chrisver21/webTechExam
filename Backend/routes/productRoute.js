import express from "express";
import * as fs from "node:fs"
import { dataPath } from "../config.js";

const router = express.Router();

const loadProductsFromJSONFile = () =>{

    return JSON.parse(fs.readFileSync(dataPath)).products;
}

//GET ALL PRODUCTS
router.get("/", (req, res) => {
    console.log("GET ALL PRODUCTS")
    const products = loadProductsFromJSONFile();
    res.send(products);
})

//SEARCH PRODUCTS THAT INCLUDES PARAM IN TITLE
router.get("/:productName", (req, res) => {
    console.log(`GET PRODUCT THAT INCLUDES ${req.params.productName} IN TITLE`)
    const title = req.params.productName.toLowerCase();
    const products = loadProductsFromJSONFile();
    const filteredProducts = products.filter(data => data.title.toLowerCase().includes(title));

    if(filteredProducts.length > 0){
        res.send(filteredProducts);
    } else {
        res.status(404).send({message: "No Products Matched your search keyword."})
    }
})

export default router;