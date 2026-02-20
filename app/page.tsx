'use client';

import { useState, useRef, useEffect } from 'react';
import { UploadCloud, Loader2 } from 'lucide-react';
import { useChatStore } from '../src/store/useChatStore';
import { motion, AnimatePresence } from 'framer-motion';
import Dashboard from '../src/components/Dashboard';

export default function Home() {
  const { messages, setMessages, isParsing, setParsing } = useChatStore();
  const workerRef = useRef<Worker | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Initialize Worker
  useEffect(() => {
    workerRef.current = new Worker(
      new URL('../src/workers/parser.worker.ts', import.meta.url)
    );

    workerRef.current.onmessage = (event) => {
      const parsedMessages = event.data;
      console.log(
        '✅ Worker Finished! Parsed:',
        parsedMessages.length,
        'messages'
      );

      setMessages(parsedMessages);
      setParsing(false);
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, [setMessages, setParsing]);

  const handleFile = (file: File) => {
    if (!file) return;
    setParsing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      workerRef.current?.postMessage(text);
    };
    reader.readAsText(file);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-background text-foreground overflow-hidden">
      {/* Header */}
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex mb-10">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-white/10 bg-black/50 pb-6 pt-8 backdrop-blur-2xl lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-zinc-800/30 lg:p-4">
          ChatVibe&nbsp;
          <code className="font-mono font-bold text-green-500">v1.0</code>
        </p>
      </div>

      {/* CONDITIONAL RENDERING */}
      {messages.length === 0 ? (
        <div className="relative flex flex-col place-items-center gap-6">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">
            Analyze your Vibe.
          </h1>

          <p className="text-muted-foreground text-center max-w-[600px]">
            Privacy-first WhatsApp analysis.
            Everything runs locally in your browser via Web Workers.
          </p>

          {/* Drag & Drop Zone */}
          <motion.div
            layout
            className={`
              relative group cursor-pointer flex flex-col items-center justify-center 
              w-full max-w-lg h-64 rounded-3xl border-2 border-dashed 
              transition-colors duration-200 ease-in-out
              ${
                dragActive
                  ? 'border-green-500 bg-green-500/10'
                  : 'border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900'
              }
            `}
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFile(e.dataTransfer.files[0]);
              }
            }}
          >
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={(e) =>
                e.target.files && handleFile(e.target.files[0])
              }
              accept=".txt"
            />

            <AnimatePresence mode="wait">
              {isParsing ? (
                <motion.div
                  key="parsing"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center gap-4"
                >
                  <Loader2 className="h-10 w-10 text-green-500 animate-spin" />
                  <p className="text-sm font-medium text-zinc-400">
                    Crunching the data...
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="p-4 rounded-full bg-zinc-900 border border-zinc-800 group-hover:scale-110 transition-transform">
                    <UploadCloud className="h-8 w-8 text-zinc-400 group-hover:text-green-500 transition-colors" />
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-medium">
                      Drop your WhatsApp .txt here
                    </p>
                    <p className="text-sm text-zinc-500 mt-1">
                      Supports iOS & Android exports
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      ) : (
        <Dashboard />
      )}
    </main>
  );
}
