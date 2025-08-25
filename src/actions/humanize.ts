'use server'

import OpenAI from "openai";
import { setHumanizedText } from "./user";
import { auth } from "@/auth";

const openai = new OpenAI();

export const humanizeText = async (text: string): Promise<string | null> => {
  const session = await auth();

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Eres un experto en comunicación y estilo literario...` // acortado por espacio
        },
        {
          role: "user",
          content: text,
        },
      ],
    });

    if (session?.user?.email && completion.choices[0].message.content) {
      await setHumanizedText(
        session.user.email,
        text,
        completion.choices[0].message.content
      );
    }

    return completion.choices[0].message.content;

  } catch (error: unknown) {
    // Convertimos a tipo que tenga las propiedades que queremos
    const err = error as { code?: string; status?: number; message?: string };

    console.error("Error humanizing text (posible falta de saldo):", err.message);

    // Si el error es por cuota insuficiente, usar modo demo
    if (err.code === "insufficient_quota" || err.status === 429) {
      console.warn("Entrando en modo DEMO: usando texto ficticio.");
      return `💡 (Demo) Versión humanizada de ejemplo: "${text}" con ligeros ajustes para parecer más natural.`;
    }

    // Otros errores genéricos → modo demo también
    return `⚠️ Error al procesar texto: mostrando modo demo.\n\n${text}`;
  }
}
