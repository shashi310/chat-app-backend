const express = require("express");
const OpenAI = require("openai");
const cors = require("cors");
const app = express();
const readlinesync = require("readline-sync");
const colors = require("colors");
require("dotenv").config();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.status(400).send("Welcome to Gen/Chat-App-Backend");
  });

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

app.post("/gen",async (req, res) => {
   try {
    const res= await openai.createImage({
        prompt: req.body.prompt,
        n:1,
        size:"512*512"
    });
    const imgUrl = res.data.data[0].url 
    res.status(200).json({success:true,
    data:imgUrl
    })
 } catch (error) {
    res.status(400).json({success:false})
    console.log(error.response.data);
    console.log(error.response.status);
   }
})





app.listen(8080, () => {
  console.log("Server is live at Port 8080");
});