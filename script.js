const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");


let userMessage;

const API_KEY = "AIzaSyBMI84G04dosgccl59o4SXa3JsEy7MDk_I";

const createChatLi = (message, className) => {

  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);
  let chatContent = className === "outgoing" ? `<p></p>` : ` <span class="material-symbols-outlined">smart_toy</span><p></p>`;
  chatLi.innerHTML = chatContent;
  if (message === "Thinking...") {
    chatLi.querySelector("p").innerHTML = '<div class="typing-indicator">Thinking<div class="typing-dots"><span></span><span></span><span></span></div></div>';
  } else {
    chatLi.querySelector("p").textContent = message;
  }
  return chatLi;

}

const generateResponse = (incomingChatLI) => {

  const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBMI84G04dosgccl59o4SXa3JsEy7MDk_I";
  
  const messageElement = incomingChatLI.querySelector("p");


  const requestOptions = {

    method: "POST",
    headers: {

      "Content-Type": "application/json",

    },
    body: JSON.stringify({
      contents: [{
        parts: [{ "text": userMessage }]
      }]
    }),

  }
    

 
  fetch(API_URL, requestOptions)
  .then(res => res.json())
  .then(data => {
    console.log(data);  
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
      
      messageElement.textContent = data.candidates[0].content.parts[0].text || "No content available.";
    } else {
      messageElement.textContent = "Sorry, I couldn't understand the response.";
    }
  })
  .catch((error) => {
    console.error(error);
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      messageElement.textContent = "Network error: Please check your internet connection.";
    } else if (error.name === 'SyntaxError') {
      messageElement.textContent = "Response parsing error: The server returned an invalid response.";
    } else {
      messageElement.textContent = "Oops!! Something went wrong. Please try again.";
    }
  })
  .finally(() => {
    chatbox.scrollTo(0, chatbox.scrollHeight);
    // Ensure smooth scrolling to the latest message
    setTimeout(() => chatbox.scrollTo({ top: chatbox.scrollHeight, behavior: 'smooth' }), 100);
  });


}

const handleChat = () => {

  userMessage = chatInput.value.trim();
  if (!userMessage) return;
  chatInput.value = "";

  chatbox.appendChild(createChatLi(userMessage, "outgoing"));
  chatbox.scrollTo(0, chatbox.scrollHeight);

  setTimeout(() => {

    const incomingChatLI = createChatLi("Thinking...", "incoming")
    chatbox.appendChild(incomingChatLI);
    chatbox.scrollTo(0, chatbox.scrollHeight);
    generateResponse(incomingChatLI);

  }, 600);

}

chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));

sendChatBtn.addEventListener("click", handleChat);