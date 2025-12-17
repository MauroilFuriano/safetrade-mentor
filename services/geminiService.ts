import { GoogleGenAI, Chat } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { Message } from "../types";

let chatSession: Chat | null = null;
let aiInstance: GoogleGenAI | null = null;

const getAIInstance = (): GoogleGenAI => {
  if (!aiInstance) {
    // @ts-ignore
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      console.error("❌ ERRORE CRITICO: API Key non trovata su Vercel!");
    }
    
    // Inizializza l'istanza
    aiInstance = new GoogleGenAI({ apiKey: apiKey || '' });
  }
  return aiInstance;
};

const initializeChat = async (): Promise<Chat> => {
  const ai = getAIInstance();
  
  // Creazione della chat
  chatSession = ai.chats.create({
    // ⚠️ USIAMO 1.5 FLASH PERCHE' E' L'UNICO SUPPORTATO STABILE DALLA LIBRERIA JS
    // Se metti 2.5 qui, il sito si spacca. Fidati.
    model: 'gemini-1.5-flash', 
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7, 
    },
  });
  return chatSession;
};

export const sendMessageToGemini = async (
  userMessage: string,
  history: Message[]
): Promise<string> => {
  try {
    if (!chatSession) {
      await initializeChat();
    }

    if (!chatSession) {
        throw new Error("Impossibile inizializzare la chat.");
    }

    const result = await chatSession.sendMessage({
      message: userMessage,
    });

    return result.text || "Mi dispiace, non ho ricevuto una risposta valida.";
  } catch (error) {
    console.error("Errore comunicazione Gemini:", error);
    throw error;
  }
};

export const resetChatSession = () => {
  chatSession = null;
};