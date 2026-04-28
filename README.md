# ◈ FRIDAY — AI Chatbot

> A sleek, multi-engine AI chatbot built with Next.js 14, Vercel AI SDK, Grok (xAI), Ollama & LangChain.

![FRIDAY Banner](https://img.shields.io/badge/FRIDAY-AI%20Assistant-e8ff47?style=for-the-badge&labelColor=0a0a0f)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![Vercel AI SDK](https://img.shields.io/badge/Vercel%20AI%20SDK-3.x-blue?style=for-the-badge)

---

## 🚀 Features

- **3 AI Engines** — Switch between Grok, Ollama, and LangChain in the UI
- **Vercel AI SDK** — Streaming responses out of the box
- **Ollama** — Run models locally (Llama 3, Mistral, etc.)
- **LangChain** — Enterprise-grade AI orchestration
- **Edge Runtime** — Ultra-fast responses via Vercel Edge
- **Dark UI** — Industrial terminal aesthetic

---

## ⚡ Quick Start (5 minutes)

### 1. Clone & Install
```bash
git clone https://github.com/yourname/friday-chatbot.git
cd friday-chatbot
npm install
```

### 2. Set up environment variables
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
XAI_API_KEY=xai-your-key-here   # Get from https://console.x.ai/
NEXT_PUBLIC_AI_PROVIDER=grok
```

### 3. Run locally
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — FRIDAY is ready! 🎉

---

## 🔑 Getting Your Groq API Key

1. Go to https://console.groq.com/home
2. Sign in 
3. Navigate to **API Keys**
4. Create a new key and copy it
5. Paste it into `.env.local` 

---

## 🤖 Using Ollama (Local AI — Free!)

Run AI models locally without any API key:

```bash
# 1. Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# 2. Pull a model
ollama pull llama3        # Recommended
# or
ollama pull mistral
ollama pull phi3

# 3. Ollama runs automatically at http://localhost:11434
```

In the FRIDAY UI, click the **LOCAL** button to switch to Ollama.

Set which model in `.env.local`:
```env
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3
```

---

## 🔗 LangChain Mode

LangChain mode uses the same Grok API key but routes through LangChain's
`ChatOpenAI` adapter (Grok is OpenAI-compatible). Great for:
- Building chains and agents
- Adding memory, tools, RAG
- Complex prompt pipelines

Click **LANGCHAIN** in the UI to use it.

---

## ☁️ Deploy to Vercel (Free)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set your env variable in Vercel dashboard:
# Settings → Environment Variables → XAI_API_KEY
```

Or click: [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

---

## 📁 Project Structure

```
friday-chatbot/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts      ← AI route (Grok / Ollama / LangChain)
│   ├── components/
│   │   ├── FridayChat.tsx    ← Main chat UI component
│   │   └── FridayChat.module.css
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── .env.local.example        ← Copy to .env.local
├── next.config.js
├── package.json
├── tsconfig.json
└── vercel.json
```

---

## 🛠️ Tech Stack

| Layer        | Technology              |
|--------------|-------------------------|
| Framework    | Next.js 14 (App Router) |
| AI SDK       | Vercel AI SDK 3.x       |
| Primary LLM  | Grok (xAI) — `grok-beta` |
| Local LLM    | Ollama                  |
| AI Framework | LangChain + @langchain/openai |
| Styling      | CSS Modules             |
| Deployment   | Vercel Edge             |

---

## 🎨 Customization

**Change FRIDAY's personality** — Edit `FRIDAY_SYSTEM_PROMPT` in `app/api/chat/route.ts`

**Change the model** — Update `xai("grok-beta")` to any supported model

**Add more providers** — Add a new `if (provider === "your-provider")` block in the route

---

## 📄 License

MIT — build whatever you want with FRIDAY.
