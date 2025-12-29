// @ts-ignore
const TG = (window as any).Telegram?.WebApp;

export const initTelegram = () => {
  if (TG) {
    try {
      console.log("🚀 Inizializzazione Telegram...");
      TG.ready();
      TG.expand(); // Forza l'apertura a tutto schermo
      
      // @ts-ignore - Ignora errore TS per setHeaderColor
      if (TG.setHeaderColor) TG.setHeaderColor('#0f172a'); 
      
      // @ts-ignore - Ignora errore TS per setBackgroundColor
      if (TG.setBackgroundColor) TG.setBackgroundColor('#0f172a');
      
      // Abilita la conferma di chiusura per non perdere la chat per sbaglio
      // @ts-ignore
      if (TG.enableClosingConfirmation) {
        TG.enableClosingConfirmation();
      }
      
      // Disabilita lo swipe verticale su iOS che chiude l'app (fastidioso)
      // @ts-ignore
      if (TG.isVerticalSwipesEnabled) {
        TG.disableVerticalSwipes();
      }
      
    } catch (e) {
      console.error("❌ Errore Init Telegram:", e);
    }
  } else {
    console.log("⚠️ Telegram WebApp non rilevata (Browser mode)");
  }
};

export const getUserName = (): string => {
  if (TG && TG.initDataUnsafe && TG.initDataUnsafe.user) {
    return TG.initDataUnsafe.user.first_name;
  }
  return "Trader";
};

export const closeApp = () => {
  if (TG) {
    TG.close();
  } else {
    console.log("Simulazione chiusura app");
    // window.close() spesso non funziona per sicurezza nei browser, ma va bene per test
  }
};