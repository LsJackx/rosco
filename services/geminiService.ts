
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { LETTERS } from '../constants';
import type { Question } from '../types';

const apiKey = process.env.API_KEY;
if (!apiKey) {
    console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}
// Initialize with a placeholder if the key is missing to avoid crashing the app.
const ai = new GoogleGenAI({ apiKey: apiKey || "MISSING_API_KEY" });

interface AIQuestion {
    letter: string;
    question: string;
    answer: string;
}

export const generatePasapalabraQuestions = async (
    topic: string,
    educationalLevel: string,
    difficulty: string,
    language: string
): Promise<Question[]> => {
    if (!apiKey) {
        throw new Error("Gemini API key is not configured.");
    }

    const prompt = `Eres un asistente para crear preguntas para el juego 'Pasapalabra'. Genera ${LETTERS.length} preguntas y respuestas en ${language} para el tema '${topic}', nivel educativo '${educationalLevel}', y dificultad '${difficulty}'. Para cada letra de la lista [${LETTERS.join(', ')}], crea una pregunta. El tipo de pregunta puede ser 'Empieza por [LETRA]: [Definición]' o 'Contiene la [LETRA]: [Definición]'. La respuesta debe ser una única palabra que cumpla la condición. Devuelve un array de objetos JSON, cada objeto con 'letter' (la letra), 'question' (la pregunta/definición), y 'answer' (la respuesta). Asegúrate de que las respuestas son palabras válidas y comunes en ${language}. No incluyas saltos de línea ni markdown en la respuesta.`;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            letter: { type: Type.STRING },
                            question: { type: Type.STRING },
                            answer: { type: Type.STRING },
                        },
                        required: ["letter", "question", "answer"],
                    },
                },
            },
        });

        const textResponse = response.text.trim();
        const generatedData: AIQuestion[] = JSON.parse(textResponse);

        const formattedQuestions = LETTERS.map(l => {
            const found = generatedData.find(q => q.letter.toUpperCase() === l.toUpperCase());
            return {
                letter: l,
                question: found?.question || `Pregunta para la letra ${l}...`,
                answer: found?.answer || "N/A",
                status: 'pending' as const,
                userAnswer: ''
            };
        });

        return formattedQuestions;
    } catch (error) {
        console.error("Error generating questions from Gemini API:", error);
        throw new Error("Failed to generate questions from AI. Please check the console for details.");
    }
};
