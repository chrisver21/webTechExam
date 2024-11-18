import express from "express";
import * as fs from "node:fs"
import { dataPath, PORT } from "./config.js";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

//GET ALL PRODUCTS
app.get("/products", (req, res) => {
    console.log(`hello: ${req.params}`)
    fs.readFile(dataPath, "utf8", (err, data)=>{
        if(err){
            throw err;
        }
        res.send(JSON.parse(data));
    })
})

app.listen(PORT, ()=>{
    console.log(`app is running on PORT: ${PORT}`);
})