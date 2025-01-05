"use client";
import React from "react";
import { AudioRecorder } from "react-audio-voice-recorder";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, FileText, Copy } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton"; // Assuming Skeleton component is available
import { useCustomAudioRecorder } from "./useAudioRecorder";

const AudioRecorderComponent = () => {
  const {
    audioUrl,
    transcript,
    isLoading,
    error,
    recorderControls,
    addAudioElement,
    handleDiscard,
    handleSubmit,
  } = useCustomAudioRecorder();

  // Function to copy transcript to clipboard
  const handleCopyTranscript = () => {
    if (transcript) {
      navigator.clipboard.writeText(transcript);
      alert("Transcript copied to clipboard!");
    }
  };

  return (
    <div className="flex flex-col items-center text-center justify-center p-6 space-y-8 min-h-screen">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Start Recording</CardTitle>
          <CardDescription>Save Recording to generate transcript</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              <AudioRecorder
                onRecordingComplete={addAudioElement}
                audioTrackConstraints={{
                  noiseSuppression: true,
                  echoCancellation: true,
                }}
                downloadOnSavePress={false}
                downloadFileExtension="mp3"
                recorderControls={recorderControls}
              />
            </div>

            {audioUrl && (
              <div className="flex justify-center w-full max-w-md mt-4 space-x-4">
                <Button variant="destructive" onClick={handleDiscard}>
                  <Trash2 className="mr-2 h-5 w-5" />
                  Discard
                </Button>
                <Button onClick={handleSubmit}>
                  <FileText className="mr-2 h-5 w-5" />
                  Generate Transcript
                </Button>
              </div>
            )}

            {isLoading && (
              <Skeleton className="w-full max-w-md h-12" />
            )}

            {error && <p>Error: {error.message}</p>}

            {transcript && (
              <div className="w-full max-w-md">
                <h3 className="font-bold text-lg">Transcript:</h3>
                <Textarea
                  placeholder="Transcript will appear here..."
                  value={transcript}
                  className="min-h-[200px] resize-none w-full"
                  readOnly
                />
                <Button
                  onClick={handleCopyTranscript}
                  className="mt-2 flex items-center"
                >
                  <Copy className="mr-2 h-5 w-5" />
                  Copy Transcript
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Separate Audio Player Section */}
      {audioUrl && (
        <div className="mt-8">
          <audio src={audioUrl} controls className="w-full max-w-md" />
        </div>
      )}
    </div>
  );
};

export default AudioRecorderComponent;
