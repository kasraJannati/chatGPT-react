import { useState } from 'react';
import './App.css'

declare const CHATGPT_API_KEY: string; // created in vite.config.ts
const systemMessage = { 
  "role": "system", "content": "Explain things like you're talking to a software professional with 2 years of experience."
}
interface Message {
  message: string;
  sender: string;
  sentTime?: string;
  direction?: string;
}

function App() {
  const [msg, setMsg] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      message: "Hello, I'm ChatGPT! Ask me anything!",
      sentTime: "just now",
      sender: "ChatGPT"
    }
  ]);
  const handleSend = async () => {
    const message = msg;
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: "user"
    };
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    await processMessageToChatGPT(newMessages);
  };

  
  async function processMessageToChatGPT(chatMessages: Message[]) { 
   
    const apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message}
    });

    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
        "messages": [
        systemMessage,  
        ...apiMessages 
      ]
    }
    // https://platform.openai.com/docs/api-reference/making-requests
    await fetch("https://api.openai.com/v1/chat/completions", 
    {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + CHATGPT_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
      }).then((data) => {
      return data.json();
    }).then((data) => {
      setMessages([...chatMessages, {
        message: data.choices[0].message.content,
        sender: "ChatGPT"
      }]);
    });
  }

  return (
    <>
      <div>
        <h1>ChatGPT - React</h1>
        {messages.map((message, i) => {
          return <h2 key={i}>{message.message}</h2>
        })}
        <input
          type="text"
          placeholder="Type message here..."
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </>
  )
}

export default App
