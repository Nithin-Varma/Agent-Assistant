"use client";

import ChatQuery from "../appcomponents/ChatQuery";

const weatherFetcher = async (input: string) => {
  try {
    const response = await fetch("http://localhost:8000/chat/query_weather", {
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

export default function WeatherQueryPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10 px-4">
      <div className="w-full max-w-4xl mx-auto text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          🌦️ Talk about Weather using AI!
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Know the temperature and what to expect and pack!
        </p>
      </div>

      <div className="w-full max-w-4xl p-6 space-y-6 mx-auto">
        <ChatQuery
          heading="Enter your query"
          description="Mention your city and travel date to get relevant insights"
          showSources={true}
          defaultValue="I'll be traveling to Munich tomorrow, What should I expect?"
          fetcher={weatherFetcher}
        />
      </div>
    </div>
  );
}
