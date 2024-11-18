import express from "express";
import { PORT } from "./config.js";

export const app = express();

//Test route
app.get("/", (req, res) => {
    console.log(req);
    return res.status(200).send("Hello World!");
})


app.listen(PORT, ()=>{
    console.log(`app is running on PORT: ${PORT}`);
})