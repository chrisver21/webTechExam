import express from "express";
import { PORT } from "./config.js";
import productRoute from "./routes/productRoute.js"
import cors from "cors";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use("/products", productRoute);


app.listen(PORT, ()=>{
    console.log(`app is running on PORT: ${PORT}`);
})