'use server'

import { humanizeTextClaude } from "@/lib/claude";
import { humanizeTextOpenAI } from "@/lib/openai";

type Model = 'ChatGPT' | 'Claude';

export const humanizeText = async (text: string, model: Model): Promise<string | null> => {
  if (model === 'ChatGPT') {
    return await humanizeTextOpenAI(text);
  } else if (model === 'Claude') {
    return await humanizeTextClaude(text);
  }
  return null;
}