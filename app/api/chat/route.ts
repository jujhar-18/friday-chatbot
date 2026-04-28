import { createOpenAI } from "@ai-sdk/openai";
import { createGroq } from "@ai-sdk/groq";
import { streamText } from "ai";

// ──────────────────────────────────────────────────────────────────────────────
// FRIDAY — AI Route Handler
// Supports: Groq, Grok (xAI), Ollama (local), LangChain
// ──────────────────────────────────────────────────────────────────────────────

export const runtime = "edge";

const FRIDAY_SYSTEM_PROMPT = `You are FRIDAY — a witty, sharp, and highly capable AI assistant.
Your personality:
- Confident, clever, and occasionally sarcastic (in a friendly way)
- You speak concisely and never ramble
- You have a dry sense of humor and love a good quip
- When asked who you are, say you are FRIDAY, an advanced AI assistant
- You are knowledgeable about technology, science, code, and general topics
- You never refuse reasonable requests and always try to help

Keep responses focused and punchy. Think Tony Stark's AI — helpful but with personality.`;

export async function POST(req: Request) {
  const { messages, provider = "groq" } = await req.json();

  // ── Groq (blazing fast inference) ────────────────────────────────────────
  if (provider === "groq") {
    const groq = createGroq({
      apiKey: process.env.GROQ_API_KEY!,
    });

    const result = await streamText({
      model: groq(process.env.GROQ_MODEL || "llama-3.3-70b-versatile"),
      system: FRIDAY_SYSTEM_PROMPT,
      messages,
    });

    return result.toAIStreamResponse();
  }

  // ── Grok via Vercel AI SDK ────────────────────────────────────────────────
  if (provider === "grok" || provider === "vercel") {
    const xai = createOpenAI({
      baseURL: "https://api.x.ai/v1",
      apiKey: process.env.XAI_API_KEY!,
    });

    const result = await streamText({
      model: xai("grok-beta"),
      system: FRIDAY_SYSTEM_PROMPT,
      messages,
    });

    return result.toAIStreamResponse();
  }

  // ── Ollama (local models) ─────────────────────────────────────────────────
  if (provider === "ollama") {
    const ollamaUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
    const model = process.env.OLLAMA_MODEL || "llama3";

    const ollamaClient = createOpenAI({
      baseURL: `${ollamaUrl}/v1`,
      apiKey: "ollama", // Ollama doesn't need a real key
    });

    const result = await streamText({
      model: ollamaClient(model),
      system: FRIDAY_SYSTEM_PROMPT,
      messages,
    });

    return result.toAIStreamResponse();
  }

  // ── LangChain (via OpenAI-compatible Grok endpoint) ───────────────────────
  if (provider === "langchain") {
    const { ChatOpenAI } = await import("@langchain/openai");
    const { HumanMessage, SystemMessage, AIMessage } = await import(
      "@langchain/core/messages"
    );

    const chat = new ChatOpenAI({
      openAIApiKey: process.env.XAI_API_KEY,
      configuration: {
        baseURL: "https://api.x.ai/v1",
      },
      modelName: "grok-beta",
      streaming: true,
      temperature: 0.7,
    });

    // Convert messages to LangChain format
    const lcMessages = [
      new SystemMessage(FRIDAY_SYSTEM_PROMPT),
      ...messages.map((m: { role: string; content: string }) =>
        m.role === "user"
          ? new HumanMessage(m.content)
          : new AIMessage(m.content)
      ),
    ];

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const lcStream = await chat.stream(lcMessages);
        for await (const chunk of lcStream) {
          const text = chunk.content as string;
          if (text) {
            // Vercel AI SDK stream format
            const formatted = `0:${JSON.stringify(text)}\n`;
            controller.enqueue(encoder.encode(formatted));
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Vercel-AI-Data-Stream": "v1",
      },
    });
  }

  return new Response(JSON.stringify({ error: "Unknown provider" }), {
    status: 400,
    headers: { "Content-Type": "application/json" },
  });
}
