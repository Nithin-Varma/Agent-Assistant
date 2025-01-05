import Link from "next/link";
import { Button } from "@/components/ui/button"; // Shadcn Button
import Image from "next/image";
import { InboxIcon, NotepadTextIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex flex-col items-center justify-center flex-grow p-4  bg-gray-100 dark:bg-gray-900">
        {/* Add Logo */}
        <div className="flex gap-8 p-4">

          <Image
            src="/logo.png"
            alt="logo"
            width={300}
            height={300}
            className="mb-4 dark:bg-white"
          />
        </div>
        <h1 className="text-6xl font-bold dark:text-gray-100 text-gray-900">
          Agent Assistant
        </h1>
        <p className="text-2xl dark:text-gray-100 text-gray-700 mb-6">
          Automate your work
        </p>

        <div className="flex gap-4 mt-8">
          <Link href="/meeting/new">
            <Button className="flex items-center space-x-2">
              <InboxIcon className="w-4 h-4" />
              <span>Schedule Meetings</span>
            </Button>
          </Link>

          <Link href="/actions">
            <Button className="flex items-center space-x-2">
              <NotepadTextIcon className="w-4 h-4" />
              <span>Generate Action Items</span>
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
