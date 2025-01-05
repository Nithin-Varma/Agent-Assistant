// app/page.tsx
"use client";

import AudioRecorderComponent from "./AudioRecorderComponent";

export default function NewRecordingComponent() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10 px-4">
      {/* Heading section at the top */}
      <div className="w-full max-w-4xl mx-auto text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Record, Transcribe, Analyze
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Use AI to generate a transcript from your audio recordings.
        </p>
      </div>

      {/* ChatQuery component below */}
      <div className="w-full max-w-4xl p-6 space-y-6 mx-auto">
        <AudioRecorderComponent />
      </div>
    </div>
  );
}
