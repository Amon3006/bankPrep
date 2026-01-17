import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

const getClient = () => {
  if (!aiClient) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("API_KEY not found in environment variables");
      throw new Error("API Key missing");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
};

export const generateStudyResponse = async (
  prompt: string,
  history: { role: string; parts: { text: string }[] }[]
): Promise<string> => {
  try {
    const client = getClient();
    
    // We use a chat model to maintain context if needed, but for simple Q&A 
    // within our app structure, we might re-instantiate chat or just use generateContent.
    // Here we use chat to allow multi-turn conversation in the UI.
    
    const chat = client.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `You are an expert Banking Exam Tutor (for exams like IBPS, SBI, RBI). 
        You help students with Quantitative Aptitude, Reasoning, English, and General Awareness.
        Keep answers concise, motivating, and strictly relevant to banking exams. 
        If asked for a schedule, format it clearly.
        If asked a math problem, explain the step-by-step solution clearly.`,
      },
      history: history.map(h => ({
        role: h.role,
        parts: h.parts
      })),
    });

    const result = await chat.sendMessage({ message: prompt });
    return result.text || "I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I encountered an error connecting to the AI tutor. Please check your connection or API key.";
  }
};
