import { Message, Role } from "../types";
// NOTA: Abbiamo rimosso l'import di SYSTEM_INSTRUCTION perché ora viene passato dinamicamente

// ⚠️ CONFIGURAZIONE IDENTICA AL BOT PYTHON
// Usiamo esattamente il nome del modello che hai nel bot
const MODEL_NAME = "gemini-2.5-flash-lite"; 

// Costruiamo l'URL esattamente come fa lo script Python
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent`;

export const sendMessageToGemini = async (
  userMessage: string,
  history: Message[],
  systemInstructionText: string // <--- NUOVO PARAMETRO AGGIUNTO
): Promise<string> => {
  try {
    // 1. Prendi la chiave (senza librerie)
    // @ts-ignore
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      return "❌ ERRORE: Chiave API mancante. Controlla Vercel.";
    }

    // 2. Prepara i dati (Formato Google Raw)
    const contents = history.map(msg => ({
      role: msg.role === Role.USER ? "user" : "model",
      parts: [{ text: msg.content }]
    }));

    contents.push({
      role: "user",
      parts: [{ text: userMessage }]
    });

    // 3. FAI LA CHIAMATA (Fetch diretto come Python)
    const response = await fetch(`${API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: contents,
        systemInstruction: {
          parts: [{ text: systemInstructionText }] // <--- ORA USIAMO IL PARAMETRO DINAMICO
        },
        generationConfig: {
          temperature: 0.7
        }
      })
    });

    // 4. CONTROLLA ERRORI
    if (!response.ok) {
      const errorData = await response.json();
      console.error("ERRORE GOOGLE:", errorData);
      
      // Se qui da 404, vuol dire che il nome "gemini-2.5-flash-lite" è sbagliato o non attivo sulla chiave
      if (response.status === 404) {
        return `❌ Errore Modello (404): Il modello '${MODEL_NAME}' non è stato trovato. Sei sicuro che il bot usi esattamente questo nome?`;
      }
      
      return `❌ Errore Google (${response.status}): ${errorData.error?.message || response.statusText}`;
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ Risposta vuota.";

  } catch (error) {
    console.error("Errore Fetch:", error);
    return "❌ Errore di connessione internet.";
  }
};

export const resetChatSession = () => {};