"use client";

import ChatQuery from "../appcomponents/ChatQuery";

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
      <div className="w-full max-w-4xl mx-auto text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          🤖 Send Email using actions
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Enter a prompt and send email! It’s quick and easy!
        </p>
      </div>

      <div className="w-full max-w-4xl p-6 space-y-6 mx-auto">
        <ChatQuery
          heading="Enter your query"
          description="We will generate a response and also list sources from the MOM test for you to check out!"
          showSources={true}
          defaultValue="You are an expert at "
          fetcher={momTestFetcher} // Pass the actual fetcher function as a prop
        />
      </div>
    </div>
  );
}
