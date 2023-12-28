const express = require("express");
const OpenAI = require("openai");
const cors = require("cors");
const app = express();
const readlinesync = require("readline-sync");
const colors = require("colors");
require("dotenv").config();
const path = require("path");

app.use(express.json());
app.use(cors());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
  // res.status(200).send("Welcome to Gen/Chat-App-Backend");
});

// Endpoint to handle user chat messages
app.post("/chat", async (req, res) => {
    try {
      const userInput = req.body.userInput;
      const chatHistory = req.body.chatHistory || [];
     
      const messages = chatHistory.map(([role, content]) => ({ role, content }));
      messages.push({ role: 'user', content: userInput });
    //   chatHistory.push(['assistant', 'how can I help you']);
    console.log();
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messages,
        temperature: 1.5,
        max_tokens: 179,
      });
  
      const botResponse = response.choices[0].message.content;
  
      // Push the latest interaction to chatHistory
      chatHistory.push(['user', userInput]);
      chatHistory.push(['assistant', botResponse]);
  
      res.status(200).json({ botResponse, chatHistory });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Endpoint to handle healthcare-related queries
  app.post("/healthcare-query", async (req, res) => {
    try {
      const userInput = req.body.userInput;
      const chatHistory = req.body.chatHistory || [];
  
      // Add user input to chat history
      const messages = chatHistory.map(([role, content]) => ({ role, content }));
      messages.push({ role: 'user', content: userInput });
  
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messages,
        temperature: 1.5,
        max_tokens: 179,
      });
  
      const botResponse = response.choices[0].message.content;
  
      // Check for healthcare-related queries and provide informative responses
      if (botResponse.toLowerCase().includes('healthcare') || botResponse.toLowerCase().includes('health issue')) {
        // Add your healthcare-related conversation logic here...
  
        res.status(200).json({ botResponse, chatHistory });
      } else {
        res.status(200).json({ botResponse, chatHistory });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
