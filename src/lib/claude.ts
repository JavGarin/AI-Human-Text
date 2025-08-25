'use server'

import Anthropic from '@anthropic-ai/sdk';
import { setHumanizedText } from "@/actions/user";
import { auth } from "@/auth";

const anthropic = new Anthropic();

export const humanizeTextClaude = async (text: string): Promise<string | null> => {

  const session = await auth();

  try {
    const msg = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `Eres un experto en comunicación y estilo literario con una habilidad única para emular la escritura humana auténtica. Tu tarea es refinar sutilmente el texto proporcionado, manteniendo su esencia y estructura original, pero haciéndolo más natural y humano. Sigue estas pautas:

          1. Ajusta el tono y ritmo para que suene más conversacional y menos formal, sin cambiar el significado.
          
          2. Introduce variaciones sutiles en la longitud y estructura de las frases para evitar patrones detectables.
          
          3. Incorpora ocasionalmente expresiones coloquiales o modismos apropiados al contexto, pero sin exagerar.
          
          4. Añade pequeñas imperfecciones ocasionales, como leves repeticiones, autocorrecciones o pausas naturales (usando puntos suspensivos o guiones).
          
          5. Utiliza conectores y transiciones más naturales entre ideas.
          
          6. Personaliza ligeramente el vocabulario, sustituyendo algunas palabras por sinónimos más coloquiales cuando sea apropiado.
          
          7. Mantén la coherencia en el estilo y tono a lo largo del texto.
          
          8. Evita cambios drásticos en el contenido o la longitud del texto original.
          
          Tu objetivo es crear una versión del texto que parezca auténticamente humana, con todas las sutilezas y variaciones naturales del lenguaje escrito por una persona real. 

          Texto a humanizar: ${text}`
        }
      ]
    });

    const humanizedText = msg.content[0].type === 'text' ? msg.content[0].text : null;

    if (session?.user?.email && humanizedText) {
      await setHumanizedText(session.user.email, text, humanizedText);
    }

    return humanizedText;
  } catch (error: unknown) {
    const err = error as { status?: number; error?: { type?: string; message?: string } };

    console.error("Error humanizing text with Claude:", err.error?.message);

    if (err.status === 401 || err.error?.type === 'authentication_error') {
      console.warn("Entering DEMO mode for Claude due to invalid API key.");
      return `💡 (Demo) Example humanized version for Claude: "${text}" with slight adjustments to make it look more natural.`;
    }
    
    if (err.status === 429) {
      console.warn("Entering DEMO mode for Claude due to quota issues.");
      return `💡 (Demo) Example humanized version for Claude: "${text}" with slight adjustments to make it look more natural.`;
    }

    return `⚠️ Error processing text with Claude: showing demo mode.\n\n${text}`;
  }
};