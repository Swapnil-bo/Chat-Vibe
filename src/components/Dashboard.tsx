'use client';

import { useEffect, useState } from 'react';
import { useChatStore } from '../store/useChatStore';
import { analyzeChat } from '../lib/analytics';
import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';
import { generateVibeCheck } from '../app/actions';
import { motion } from 'framer-motion';
import ChatWrapped from './ChatWrapped';

export default function Dashboard() {
  const { messages } = useChatStore();
  const [data, setData] = useState<any>(null);
  const [vibe, setVibe] = useState<any>(null);
  const [loadingVibe, setLoadingVibe] = useState(false);

  useEffect(() => {
    if (messages.length > 0) {
      const result = analyzeChat(messages);
      setData(result);
    }
  }, [messages]);

  const handleVibeCheck = async () => {
    setLoadingVibe(true);

    const sampleSize = Math.min(50, messages.length);
    const start = Math.max(
      0,
      Math.floor(Math.random() * (messages.length - sampleSize))
    );

    const sample = messages
      .slice(start, start + sampleSize)
      .map((m) => `${m.author}: ${m.message}`)
      .join('\n');

    const result = await generateVibeCheck(sample);
    setVibe(result);
    setLoadingVibe(false);
  };

  if (!data) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-6xl space-y-6 p-4"
    >
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.authors.map((author: string) => (
          <Card key={author} className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">
                {author}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.stats[author].count} msgs
              </div>
              <p className="text-xs text-muted-foreground">
                {data.stats[author].doubleTexts} double texts 💀
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Timeline Chart */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle>The Interest Graph</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.timelineData}>
              <defs>
                <linearGradient
                  id="colorCount"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>

              <XAxis dataKey="date" hide />

              <Tooltip
                contentStyle={{
                  backgroundColor: '#09090b',
                  border: '1px solid #27272a',
                }}
              />

              <Area
                type="monotone"
                dataKey="count"
                stroke="#22c55e"
                fillOpacity={1}
                fill="url(#colorCount)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gemini Vibe Check Button */}
      {!vibe && (
        <div className="flex justify-center">
          <Button
            onClick={handleVibeCheck}
            disabled={loadingVibe}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold py-6 px-8 rounded-full"
          >
            {loadingVibe ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              <Sparkles className="mr-2" />
            )}
            Run Gemini Vibe Check
          </Button>
        </div>
      )}

      {/* Wrapped Section */}
      {vibe && (
        <>
          <div className="h-px w-full bg-zinc-800 my-12" />
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-8 text-center">
              Your Chat Wrapped
            </h2>
            <ChatWrapped data={data} vibe={vibe} />
          </div>
        </>
      )}
    </motion.div>
  );
}
