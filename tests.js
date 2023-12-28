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

// //Chat
// app.post("/chat", async (req, res) => {
//   const userMsg = req.body.message;
//   try {
//     const response = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [
//         {
//           role: "assistant",
//           content: userMsg,
//         },
//       ],
//       temperature: 1.5,
//       max_tokens: 279,
//       top_p: 1,
//       frequency_penalty: 1.01,
//       presence_penalty: 1.03,
//     });
//     console.log(response.choices[0].message.content);

//     res.status(200).send({ msg: response.choices[0].message.content });
//   } catch (error) {
//     res.status(400).send({ error: error });
//   }
// });


async function main(){
console.log(colors.bold.red("Welcome to the party!"));

const chatHistory= []

while (true) {
    const userInput= readlinesync.question(colors.bold.yellow(`You: `));
    try {
        //construct message by iterating through the history
      const messages=chatHistory.map(([role,content])=>({role,content}))

      //add the latest user input
      messages.push({role:"user",content:userInput})

      const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      
    });

    const res=response.choices[0].message.content;

        if(userInput.toLowerCase()==="exit"){
        console.log(colors.green("Bot: " + res));
            return
        }
        console.log(colors.green("Bot: " + res));

        //update history with user input and assistant response
        chatHistory.push(['user',userInput]);
        chatHistory.push(['assistant',res])
    } catch (error) {
        console.error(error);
    }
}



}
// main();


// async function main() {
//     console.log("Welcome to the skin issue chatbot!");
  
//     const chatHistory = [];
  
//     while (true) {
//       const userInput = readlinesync.question('You: ');
  
//       try {
//         const messages = chatHistory.map(([role, content]) => ({ role, content }));
//         messages.push({ role: 'user', content: userInput });
  
//         const response = await openai.chat.completions.create({
//           model: 'gpt-3.5-turbo',
//           messages: messages,
//         });
  
//         const botResponse = response.choices[0].message.content;
  
//         if (userInput.toLowerCase() === 'exit') {
//           console.log('Bot: ' + botResponse);
//           return;
//         }
  
//         console.log('Bot: ' + botResponse);
  
//         chatHistory.push(['user', userInput]);
//         chatHistory.push(['assistant', botResponse]);
  
//         // Check for skin-related queries and provide general self-care advice
//         if (botResponse.toLowerCase().includes('skin')) {
//           console.log('Bot: It seems you are concerned about skin issues.');
//           console.log('Bot: Can you specify the symptoms you are experiencing?');
  
//           const symptoms = readlinesync.question('You: ');
  
//           console.log('Bot: For how long have you been experiencing these symptoms?');
  
//           const duration = readlinesync.question('You: ');
  
//           console.log('Bot: Thank you for sharing. Here are some general self-care tips:');
//           console.log('- Keep your skin clean and moisturized.');
//           console.log('- Avoid using harsh chemicals on your skin.');
//           console.log('- Drink plenty of water to stay hydrated.');
  
//           // You can add more self-care tips based on specific skin issues if needed
//         }
//       } catch (error) {
//         console.error(error);
//       }
//     }
//   }
  
//   main();







app.post("/gen",async (req, res) => {
    try {
    const prompt=req.body.prompt
    const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: "a white siamese cat",
        n: 1,
        size: "1024x1024",
      });
      const imgUrl = response.data.data[0].url;
     res.status(200).json({success:true,
     data:imgUrl
     })
  } catch (error) {
    if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }

      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
 })
 

app.listen(8080, () => {
  console.log("Server is live at Port 8080");
});



  
  