"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button"; // Shadcn Button component
import Image from "next/image";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
} from "@/components/ui/sheet";
import { ModeToggle } from "@/components/ui/mode-toggle";

export default function Navbar() {
  return (
    <header className="flex justify-between items-center p-4 bg-gray-800 text-white shadow-md fixed w-full top-0 z-50">
      <div className="flex items-center gap-4">
        {/* Add the logos */}
        <Image
          src="/logo.png"
          alt="Digital Product logo"
          width={40}
          height={40}
        />
        <h1 className="text-xl font-bold">Agent Assistant</h1>
      </div>

      {/* Mobile Menu */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" className="md:hidden">
            <Menu size={28} />
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <div className="flex justify-between items-center p-4">
            <h1 className="text-xl font-bold">Agent Assistant</h1>
            <SheetClose asChild>
              <Button variant="ghost">
                <X size={28} />
              </Button>
            </SheetClose>
          </div>
          <nav className="flex flex-col gap-6 mt-4">
            <Link href="/" className="text-white hover:text-gray-400">
              Home
            </Link>
            <Link
              href="/meeting/new"
              className="text-white hover:text-gray-400"
            >
              Meetings
            </Link>
            <Link href="/actions" className="text-white hover:text-gray-400">
              Actions
            </Link>
            <Link href="/about" className="text-white hover:text-gray-400">
              About
            </Link>
            <ModeToggle />
          </nav>
        </SheetContent>
      </Sheet>

      {/* Desktop Menu */}
      <nav className="hidden md:flex gap-6 items-center">
        <Link href="/" className="text-white hover:text-gray-400">
          Home
        </Link>
        <Link href="/meeting/new" className="text-white hover:text-gray-400">
          Meetings
        </Link>
        <Link href="/actions" className="text-white hover:text-gray-400">
          Actions
        </Link>
        <Link href="/about" className="text-white hover:text-gray-400">
          About
        </Link>
        <ModeToggle />
      </nav>
    </header>
  );
}
