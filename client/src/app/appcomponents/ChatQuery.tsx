"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { remark } from "remark";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import html from "remark-html";

interface ChatQueryProps {
  heading: string;
  description: string;
  showSources?: boolean;
  defaultValue: string;
  fetcher: (input: string) => Promise<{ response: string; sources: string[] }>;
}

export default function ChatQuery({
  heading,
  description,
  showSources = true,
  defaultValue,
  fetcher,
}: ChatQueryProps) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [sources, setSources] = useState<string[]>([]);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const result = await fetcher(input); // Use the passed-in fetcher prop
      const processedMarkdown = await processMarkdown(result.response);
      setResponse(processedMarkdown);
      setSources(result.sources);
    } catch (error) {
      console.error("Error fetching data:", error);
      setResponse("An error occurred while generating the response.");
      setSources([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to process markdown to HTML using remark
  const processMarkdown = async (markdownText: string) => {
    const file = await remark().use(remarkGfm).use(html).process(markdownText);
    return String(file);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {heading}
        </h1>
        <p className="text-gray-500 dark:text-gray-300">{description}</p>
      </div>

      <div className="flex flex-col space-y-2">
        <Textarea
          placeholder="Enter your input"
          value={input}
          defaultValue={defaultValue}
          onChange={(e) => setInput(e.target.value)}
          className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />
        <Button onClick={handleGenerate} disabled={isLoading}>
          {isLoading ? "Loading..." : "Generate"}
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ) : response ? (
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
              Response:
            </h2>

            <ReactMarkdown remarkPlugins={[remarkGfm]} className="text-black">
              {response}
            </ReactMarkdown>
          </div>
          {showSources && sources.length > 0 && (
            <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
              <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
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