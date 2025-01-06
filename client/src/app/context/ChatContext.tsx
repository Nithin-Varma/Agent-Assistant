// context/ChatContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface ChatContextType {
  emails: string[];
  setEmails: (emails: string[]) => void;
  message: string;
  setMessage: (message: string) => void;
  date?: Date;
  setDate: (date?: Date) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [emails, setEmails] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  const [date, setDate] = useState<Date | undefined>(undefined);

  return (
    <ChatContext.Provider
      value={{ emails, setEmails, message, setMessage, date, setDate }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
