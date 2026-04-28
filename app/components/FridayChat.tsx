"use client";

import { useChat } from "ai/react";
import { useRef, useEffect, useState } from "react";
import styles from "./FridayChat.module.css";

type Provider = "groq" | "grok" | "ollama" | "langchain";

const PROVIDER_LABELS: Record<Provider, { name: string; badge: string; color: string }> = {
  groq:      { name: "Groq (Fast)",   badge: "GROQ",      color: "#f55036" },
  grok:      { name: "Grok (xAI)",    badge: "GROK xAI",  color: "#e8ff47" },
  ollama:    { name: "Ollama Local",  badge: "LOCAL",     color: "#47ffb4" },
  langchain: { name: "LangChain",     badge: "LANGCHAIN", color: "#ff6b47" },
};

const SUGGESTIONS = [
  "What can you do, FRIDAY?",
  "Explain quantum computing simply",
  "Write a Python web scraper",
  "What's the difference between AI and ML?",
  "Give me a fun fact about space",
];

export default function FridayChat() {
  const [provider, setProvider] = useState<Provider>("groq");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput } = useChat({
    api: "/api/chat",
    body: { provider },
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSuggestion = (text: string) => {
    setInput(text);
    inputRef.current?.focus();
  };

  const pInfo = PROVIDER_LABELS[provider];

  return (
    <div className={styles.shell}>
      {/* ── Scanline overlay ── */}
      <div className={styles.scanlines} aria-hidden />

      {/* ── Header ── */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>◈</span>
          <span className={styles.logoText}>FRIDAY</span>
          <span className={styles.logoSub}>AI ASSISTANT</span>
        </div>

        <div className={styles.providerSwitcher}>
          <span className={styles.switchLabel}>ENGINE</span>
          {(Object.keys(PROVIDER_LABELS) as Provider[]).map((p) => (
            <button
              key={p}
              className={`${styles.providerBtn} ${provider === p ? styles.active : ""}`}
              onClick={() => setProvider(p)}
              style={{ "--accent-color": PROVIDER_LABELS[p].color } as React.CSSProperties}
            >
              {PROVIDER_LABELS[p].badge}
            </button>
          ))}
        </div>

        <div className={styles.statusBadge}>
          <span className={styles.statusDot} />
          <span style={{ color: pInfo.color }}>{pInfo.name}</span>
        </div>
      </header>

      {/* ── Chat area ── */}
      <main className={styles.chatArea}>
        {messages.length === 0 ? (
          <div className={styles.welcome}>
            <div className={styles.welcomeGlyph}>◈</div>
            <h1 className={styles.welcomeTitle}>FRIDAY Online</h1>
            <p className={styles.welcomeSub}>
              Your AI assistant is ready. What can I help you with?
            </p>
            <div className={styles.suggestions}>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  className={styles.suggestion}
                  onClick={() => handleSuggestion(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.messages}>
            {messages.map((m) => (
              <div
                key={m.id}
                className={`${styles.message} ${
                  m.role === "user" ? styles.userMsg : styles.aiMsg
                }`}
              >
                <div className={styles.msgRole}>
                  {m.role === "user" ? "YOU" : "FRIDAY"}
                </div>
                <div className={styles.msgContent}>{m.content}</div>
              </div>
            ))}
            {isLoading && (
              <div className={`${styles.message} ${styles.aiMsg}`}>
                <div className={styles.msgRole}>FRIDAY</div>
                <div className={styles.thinking}>
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </main>

      {/* ── Input area ── */}
      <footer className={styles.inputArea}>
        <form onSubmit={handleSubmit} className={styles.inputForm}>
          <input
            ref={inputRef}
            className={styles.input}
            value={input}
            onChange={handleInputChange}
            placeholder="Send a message to FRIDAY…"
            disabled={isLoading}
            autoComplete="off"
          />
          <button
            type="submit"
            className={styles.sendBtn}
            disabled={isLoading || !input.trim()}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </form>
        <p className={styles.hint}>
          Powered by Vercel AI SDK · Provider: <strong>{pInfo.name}</strong> · Switch engines above
        </p>
      </footer>
    </div>
  );
}
