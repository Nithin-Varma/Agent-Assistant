// components/ChatQuery.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useChat } from "../context/ChatContext";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatQueryProps {
  heading: string;
  description: string;
  showSources?: boolean;
  defaultValue: string;
  fetcher: (input: string) => Promise<{ response: string; sources: string[] }>;
}

interface EmailOption {
  label: string;
  value: string;
}

const emailOptions: EmailOption[] = [
  { label: "Mann", value: "mann.compi@gmail.com" },
  { label: "Nithin", value: "mnithin1422@gmail.com" },
  // Add more predefined emails or fetch dynamically
];

export default function ChatQuery({
  heading,
  description,
  showSources = true,
  defaultValue,
  fetcher,
}: ChatQueryProps) {
  const { emails, setEmails, message, setMessage, date, setDate } = useChat();
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [sources, setSources] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState("");

  const handleGenerate = async () => {
    if (emails.length === 0) {
      alert("Please add at least one email.");
      return;
    }
    if (message.trim() === "") {
      alert("Please enter a chat message.");
      return;
    }

    setIsLoading(true);
    try {
      const combinedInput = `Emails: ${emails.join(
        ", "
      )}\nMessage: ${message}\nDate: ${date ? date.toDateString() : "N/A"}`;
      const result = await fetcher(combinedInput);
      setResponse(result.response || "No response available");
      setSources(result.sources || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setResponse("An error occurred while generating the response.");
      setSources([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8 bg-white dark:bg-gray-900 shadow-lg rounded-lg">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          {heading}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {description}
        </p>
      </div>

      <div className="space-y-6">
        {/* Email Selector */}
        <div>
          <label className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
            Select Emails<span className="text-red-500">*</span>
          </label>
          <Command>
            <CommandInput
              placeholder="Search Team Members..."
              value={emailInput}
              onValueChange={setEmailInput}
              className="border border-gray-300 dark:border-gray-700 rounded-md p-2 text-lg"
            />
            <CommandList>
              <CommandEmpty>No emails found.</CommandEmpty>
              <CommandGroup>
                {emailOptions
                  .filter((email) =>
                    email.label.toLowerCase().includes(emailInput.toLowerCase())
                  )
                  .map((email) => (
                    <CommandItem
                      key={email.value}
                      onSelect={() => {
                        if (!emails.includes(email.value)) {
                          setEmails([...emails, email.value]);
                        }
                        setEmailInput("");
                      }}
                    >
                      {email.label}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
          <div className="mt-2 flex flex-wrap gap-2">
            {emails.map((email) => (
              <span
                key={email}
                className="flex items-center bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm"
              >
                {email}
                <button
                  type="button"
                  className="ml-2 text-red-500 hover:text-red-700"
                  onClick={() => setEmails(emails.filter((e) => e !== email))}
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Chat Message */}
        <div>
          <label className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
            Message<span className="text-red-500">*</span>
          </label>
          <Textarea
            placeholder="Enter your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="bg-gray-100 dark:bg-gray-800 text-lg text-gray-900 dark:text-gray-100 resize-none h-32"
          />
        </div>

        {/* Calendar Picker (Optional) */}
        <div>
          <label className="block text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
            Select Date (Optional)
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? date.toDateString() : "Choose a date..."}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(selectedDate) => setDate(selectedDate || undefined)}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full py-4 text-xl"
        >
          {isLoading ? "Loading..." : "Generate"}
        </Button>
      </div>

      {/* Response Section */}
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
        </div>
      ) : response ? (
        <div className="space-y-6">
          <div className="p-6 rounded-lg bg-gray-100 dark:bg-gray-800">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Response:
            </h2>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              className="prose dark:prose-dark"
            >
              {response}
            </ReactMarkdown>
          </div>
          {showSources && sources.length > 0 && (
            <div className="p-6 rounded-lg bg-gray-100 dark:bg-gray-800">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Sources:
              </h2>
              <ul className="list-disc pl-5 text-gray-900 dark:text-gray-100">
                {sources.map((source, index) => (
                  <li key={index}>{source}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
