const { GoogleGenerativeAI } = require("@google/generative-ai");

const api_key = process.env.GEMINI_API_KEY;

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const safety_settings = [
  {
    category: "HARM_CATEGORY_HATE_SPEECH",
    threshold: "OFF",
  },
  {
    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
    threshold: "OFF",
  },
  {
    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    threshold: "OFF",
  },
  {
    category: "HARM_CATEGORY_HARASSMENT",
    threshold: "OFF",
  },
];

const AskAiStudio = async (message) => {
  try {
    const genAI = new GoogleGenerativeAI(api_key);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      safety_settings,
    });

    const prompt = `As a professional assistant, respond to the following question in Markdown format Begin directly with structured content, avoiding any introductory phrases or commentary:
    ${message}`;

    const chatSession = model.startChat({ generationConfig });
    return chatSession.sendMessageStream(prompt);
  } catch (error) {
    throw {
      error: "MODEL_ERROR",
      message: "To Many Request, Please try again later",
    };
  }
};

module.exports = { AskAiStudio };
