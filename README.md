# 💬 ChatVibe 

**The Ultimate Privacy-First WhatsApp Analyzer** *Uncover the hidden dynamics of your chats with local-first processing and Google's Gemini AI.*

![ChatVibe UI Preview](https://via.placeholder.com/800x400?text=Insert+Screenshot+Here)

## 🚀 Overview
ChatVibe is a blazing-fast, strictly local web application that parses exported WhatsApp chat logs to visualize messaging habits, response times, and relationship dynamics. Using Web Workers to keep the main thread unblocked, it handles massive chat histories instantly. 

For the final touch, it integrates **Google's Gemini 2.5 Flash** to provide a hilarious, scarily accurate "Vibe Check" based on a random sample of the chat—all while keeping your data private.

## ✨ Key Features
- **Privacy-First Parsing:** All Regex parsing happens locally in your browser via Web Workers. No raw chat logs are ever saved to a server.
- **Deep Analytics:** Tracks message volume, double texts (the "Simp Metric"), and visualizes activity over time.
- **AI Vibe Check:** Leverages `gemini-2.5-flash` for nuanced psychological roasts and dynamic analysis.
- **"Chat Wrapped" Export:** Generates a beautiful, Instagram-ready gradient card summarizing your chat statistics.
- **Glassmorphism UI:** Built with Next.js, Tailwind CSS, and Framer Motion for a premium, buttery-smooth experience.

## 🛠️ Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Shadcn/UI
- **Animations:** Framer Motion
- **Data Vis:** Recharts
- **AI Integration:** Vercel AI SDK + Google Generative AI
- **Performance:** Native Web Workers (`parser.worker.ts`)

## 💻 Local Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Swapnil-bo/chat-vibe.git](https://github.com/Swapnil-bo/chat-vibe.git)
   cd chat-vibe