// pages/mom-test-query.tsx
"use client";

import ChatQuery from "../appcomponents/ChatQuery";
import { ChatProvider } from "../context/ChatContext";

// Actual API fetcher function
const momTestFetcher = async (input: string) => {
  try {
    const response = await fetch("http://localhost:8000/chat/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ query: input }), // Send the user input as the query
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data from the server.");
    }

    const data = await response.json();

    // Assuming the response has the structure:
    // { response: string, sources: string[] }
    return {
      response: data.response || "No response available",
      sources: data.sources || [],
    };
  } catch (error) {
    console.error("Error in fetcher:", error);
    throw error;
  }
};

export default function MomTestQueryPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10 px-4">
      <div className="w-full max-w-4xl mx-auto text-center mb-12">
        <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
          🤖 Send Email using Actions
        </h2>
        <p className="text-2xl text-gray-600 dark:text-gray-300">
          Enter your emails and a message to send! It’s quick and easy!
        </p>
      </div>

      <div className="w-full max-w-4xl mx-auto">
        <ChatProvider>
          <ChatQuery
            heading="Compose Your Email"
            description="Provide the necessary details below to generate and send your email."
            showSources={true}
            defaultValue=""
            fetcher={momTestFetcher} 
          />
        </ChatProvider>
      </div>
    </div>
  );
}
