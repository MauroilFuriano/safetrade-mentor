import { Message, Role } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export const sendMessageToGemini = async (
  userMessage: string,
  history: Message[]
): Promise<string> => {
  try {
    // 1. CONTROLLO CHIAVE
    // @ts-ignore
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      return "⚠️ ERRORE CRITICO: La chiave API è VUOTA. Vercel non la sta leggendo. Prova a fare 'Redeploy' su Vercel.";
    }

    // 2. PREPARAZIONE DATI
    const contents = history.map(msg => ({
      role: msg.role === Role.USER ? "user" : "model",
      parts: [{ text: msg.content }]
    }));

    contents.push({
      role: "user",
      parts: [{ text: userMessage }]
    });

    // 3. CHIAMATA DIRETTA A GOOGLE
    const response = await fetch(`${API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: contents,
        systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        generationConfig: { temperature: 0.7 }
      })
    });

    // 4. GESTIONE ERRORI SPECIFICI
    if (!response.ok) {
      const errorData = await response.json();
      console.error("ERRORE GOOGLE:", errorData);
      
      const status = response.status;
      const message = errorData.error?.message || "Errore sconosciuto";

      if (status === 400) return `❌ Errore 400: Richiesta non valida. (${message})`;
      if (status === 401) return `❌ Errore 401: Chiave API non valida o scaduta.`;
      if (status === 403) return `❌ Errore 403: Accesso negato (Forse il modello non è attivo in Europa o la chiave è limitata).`;
      if (status === 404) return `❌ Errore 404: Modello non trovato o URL sbagliato.`;
      
      return `❌ Errore generico (${status}): ${message}`;
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ Risposta vuota da Gemini.";

  } catch (error) {
    return `❌ ERRORE DI RETE: ${(error as Error).message}. Controlla la tua connessione internet.`;
  }
};

export const resetChatSession = () => {};