# 💬 ChatVibe 

**The Ultimate Privacy-First WhatsApp Analyzer**
[🚀 Live Demo](https://chat-vibe-psi.vercel.app) 

---

## 🚀 Overview
**ChatVibe** is a high-performance web application designed to uncover the hidden dynamics of your WhatsApp conversations. Built with a "Privacy-First" philosophy, it parses exported chat logs locally in your browser to visualize messaging habits, response times, and relationship shifts over time.

As an **AI Product Manager** portfolio piece, this project demonstrates a seamless integration of complex data processing with cutting-edge Generative AI. It leverages **Google Gemini 2.5 Flash** to provide witty, nuanced psychological roasts based on your chat history—without ever compromising your data privacy.

## ✨ Key Features
- **Privacy-First Parsing:** All Regex parsing happens locally via **Web Workers**. No raw chat logs are ever uploaded, saved, or stored on a server.
- **Deep Analytics:** Track message volume, activity timelines, and "Simp Metrics" (double-text counts and response lag).
- **AI Vibe Check:** Uses `gemini-2.5-flash` for high-speed, nuanced analysis of relationship tension and interest skew.
- **"Chat Wrapped" Export:** Generate a premium, Instagram-ready gradient card summarizing your statistics to share on social media.
- **Glassmorphism UI:** A buttery-smooth, OLED-black aesthetic built with **Next.js 14**, **Tailwind CSS**, and **Framer Motion**.

## 🛠️ Tech Stack
- **Framework:** Next.js 14 (App Router)
- **AI Model:** Google Gemini 2.5 Flash (via Vercel AI SDK)
- **Performance:** Native Web Workers (`parser.worker.ts`) for off-thread processing.
- **Data Vis:** Recharts (Customized with deep-green gradients)
- **Styling:** Tailwind CSS + Shadcn/UI
- **Animations:** Framer Motion

## 🧠 Technical Deep Dive: Why Web Workers?
Parsing a `.txt` file with 50,000+ lines using complex Regex can freeze the browser's main thread, leading to a "janky" user experience. 
- **The Solution:** ChatVibe offloads the entire parsing engine to a background **Web Worker**.
- **The Result:** The UI remains responsive at 60fps even while the engine is crunching through years of chat history.

## 💻 Local Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Swapnil-bo/Chat-Vibe.git](https://github.com/Swapnil-bo/Chat-Vibe.git)
   cd Chat-Vibe

---

*Created by [Swapnil](https://github.com/Swapnil-bo)*
