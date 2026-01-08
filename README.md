<div align="center">
  <img width="100%" alt="SafeTrade Mentor Banner" src="https://github.com/MauroilFuriano/safetrade-mentor/blob/main/banner.png?raw=true" />

  # 🛡️ SafeTrade Mentor AI | Telegram Mini App
  
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Gemini AI](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=google-gemini&logoColor=white)](https://deepmind.google/technologies/gemini/)
  [![Telegram](https://img.shields.io/badge/Telegram_WebApp-24A1DE?style=for-the-badge&logo=telegram&logoColor=white)](https://core.telegram.org/bots/webapps)

  <p>
    <strong>Una "Telegram Mini App" educativa che utilizza l'AI per guidare i trader principianti.</strong><br>
    Simula operazioni di trading Futures e guida alla configurazione sicura delle API Key tramite un'interfaccia conversazionale intelligente.
  </p>
</div>

---

## 💡 Il Problema
Molti utenti abbandonano i Bot di Trading per due motivi:
1.  **Paura della tecnica:** Non sanno generare le chiavi API sugli exchange o temono di sbagliare permessi.
2.  **Perdite immediate:** Operano sui Futures con leve troppo alte senza capire il rischio di liquidazione.

## 🚀 La Soluzione: SafeTrade Mentor
Un'applicazione React progettata per girare nativamente dentro **Telegram**.
Agisce come un "Mentore Virtuale" che guida l'utente passo-passo, reagendo alle sue azioni grazie a un motore AI (Gemini 2.5 Flash Lite) istruito con prompt specifici.

### ✨ Funzionalità Core

#### 1. 🤖 AI Conversazionale Guidata (Prompt Engineering)
Non è una chat generica. L'AI segue uno **script rigoroso** definito nel codice (`constants.ts`) per gestire fasi specifiche:
* **Mode Detection:** Passa automaticamente da "Guida API" a "Simulatore Trading".
* **Tagging System:** L'AI emette tag nascosti (es. `[CONFIRMED: LEVERAGE]`) che il Frontend intercetta per sbloccare badge e animazioni.

#### 2. 📉 Visualizzazione del Rischio (Risk Calculator)
Ho sviluppato un componente React custom (`LiquidationVisual.tsx`) che mostra visivamente la differenza tra una Leva 5x (Safe) e una 20x (Rischio Alto), educando l'utente tramite impatto visivo immediato.

#### 3. 🔒 Guida API Sicura
Un flow interattivo che guida l'utente alla creazione delle chiavi API su Bitget, assicurandosi che **NON** vengano attivati i permessi di prelievo (Withdrawal), garantendo la sicurezza dei fondi.

#### 4. 📱 Telegram WebApp Integration
L'app rileva l'ambiente Telegram, si adatta al tema scuro/chiaro dell'utente e gestisce la chiusura e l'espansione della finestra nativa.

---

## 🛠 Tech Stack

* **Frontend:** React 18, TypeScript, Vite
* **Styling:** Tailwind CSS (Custom Animations)
* **AI Engine:** Google Gemini API (Model: `gemini-2.5-flash-lite`)
* **Integration:** Telegram WebApp SDK
* **Icons:** Lucide React

---

## 🧠 Architettura del Codice

### Gestione del Prompt (System Instructions)
Il cuore dell'app risiede in `geminiService.ts`. Invece di semplici chiamate API, il sistema inietta contesti dinamici:
```typescript
// Esempio della logica di gestione AI
const SYSTEM_INSTRUCTION_TRADING = `
  Sei "SafeTrade Mentor".
  TUO OBIETTIVO: Guidare l'utente nell'apertura di un trade Risk Free.
  REGOLE:
  - Se l'utente imposta Leva > 5x, correggilo gentilmente.
  - Usa il tag [VISUAL: LIQUIDATION_RISK] per mostrare il grafico.
`;