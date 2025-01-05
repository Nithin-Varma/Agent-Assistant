"use client";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button"; // Shadcn Button
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Shadcn Card

export default function Recording({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex flex-col items-center justify-center flex-grow p-4 pt-20">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Recording Details - {params.id}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">
              [Recording content for ID {params.id} will go here]
            </p>
          </CardContent>
        </Card>

        <div className="mt-8">
          <Button variant="primary" onClick={() => router.push("/recording")}>
            Back to Recordings
          </Button>
        </div>
      </main>
    </div>
  );
}
