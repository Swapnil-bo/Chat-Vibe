import { create } from 'zustand';
import { ChatMessage } from '../workers/parser.worker';

interface ChatState {
  messages: ChatMessage[];
  isParsing: boolean;
  progress: number;
  setMessages: (messages: ChatMessage[]) => void;
  setParsing: (isParsing: boolean) => void;
  setProgress: (progress: number) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isParsing: false,
  progress: 0,
  setMessages: (messages) => set({ messages }),
  setParsing: (isParsing) => set({ isParsing }),
  setProgress: (progress) => set({ progress }),
}));
