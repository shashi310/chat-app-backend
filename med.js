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

//OpenAI Generation
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});





async function main() {
  console.log(colors.bold.red("Welcome to the skin issue chatbot!"));

  const chatHistory = [];

  while (true) {
    const userInput = readlinesync.question(colors.bold.yellow(`You: `));

    try {
      const messages = chatHistory.map(([role, content]) => ({ role, content }));
      messages.push({ role: 'user', content: userInput });

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messages,
        temperature: 1.5,
        max_tokens: 279,
      });

      const botResponse = response.choices[0].message.content;

      if (userInput.toLowerCase() === 'exit') {
        console.log('Bot: ' + botResponse);
        return;
      }

      console.log('Bot: ' + botResponse);

      chatHistory.push(['user', userInput]);
      chatHistory.push(['assistant', botResponse]);

      // Check for skin-related queries and engage in a conversation
      if (botResponse.toLowerCase().includes('skin')) {
        console.log('Bot: It seems you are concerned about skin issues.');
        console.log('Bot: Can you specify the symptoms you are experiencing?');

        const symptoms = readlinesync.question('You: ');

        console.log('Bot: For how long have you been experiencing these symptoms?');

        const duration = readlinesync.question('You: ');

        // Construct a prompt based on the information collected from the user
        const prompt = `The patient is experiencing ${symptoms} for ${duration}. Provide some general self-care tips.`;

        const selfCareResponse = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            ...messages,
            { role: 'assistant', content: prompt }
          ],
          max_tokens: 512,
        });

        const selfCareTips = selfCareResponse.choices[0].message.content;

        console.log('Bot: Here are some general self-care tips:');
        console.log(selfCareTips);
        return
      }
    } catch (error) {
      console.error(error);
    }
  }
}

main();
