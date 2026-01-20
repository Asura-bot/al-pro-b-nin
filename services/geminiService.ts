
import { GoogleGenAI, Type } from "@google/genai";

// Fix: Always use process.env.API_KEY directly for initialization as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSmartJobDescription = async (category: string, userPrompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Tu es un assistant pour une plateforme d'artisans au Bénin. L'utilisateur a besoin d'un service de ${category}. Voici sa demande brute: "${userPrompt}". 
      Reformule cette demande de manière professionnelle pour un artisan, en listant les détails techniques probables dont il aura besoin. 
      Réponds directement avec le texte reformulé, sans introduction.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return userPrompt;
  }
};

export const getAdminInsights = async (stats: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `En tant qu'expert en développement économique au Bénin, analyse ces statistiques de plateforme de services: ${JSON.stringify(stats)}. 
      Donne 3 recommandations courtes pour améliorer le volume de transactions et la satisfaction client.`,
    });
    return response.text;
  } catch (error) {
    return "Analyse indisponible pour le moment.";
  }
};
