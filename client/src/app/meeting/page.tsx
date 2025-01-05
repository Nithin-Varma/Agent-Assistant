import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const recordings = [
  { id: 1, title: "Meeting with Product Team" },
  { id: 2, title: "Design Review Discussion" },
  { id: 3, title: "AI Model Architecture" },
];

export default function Recordings() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <main className="flex flex-col items-center justify-center flex-grow p-4 pt-20">
        <h1 className="text-2xl font-bold dark:text-gray-100 text-gray-900">Your Recordings</h1>
        <p className="text-lg dark:text-gray-400 text-gray-900 mb-4">
          View and manage all your recordings.
        </p>

        <Link className="flex pt-5" href="/recording/new">
          <Button className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Start New Recording</span>
          </Button>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl  pt-10">
          {recordings.map((rec) => (
            <Card key={rec.id} className="w-full">
              <CardHeader>
                <CardTitle>{rec.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Link
                  href={`/recording/${rec.id}`}
                  className="text-blue-500 hover:underline"
                >
                  View Recording
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>


      </main>
    </div>
  );
}
