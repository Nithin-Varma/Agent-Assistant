"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const teamMembers = [
  {
    name: "Nithin",
    role: "Fullstack developer",
    description: "lorem ipsum ....",
  },
  {
    name: "Another Guy",
    role: "AI ENgineer",
    description: "lorem ipsum ....",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      <main className="flex flex-col items-center justify-center py-28 bg-gray-100 dark:bg-gray-900">
        <section className="grid-col mb-16 text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl dark:text-gray-100 text-gray-900">
            About Agent Assistant
          </h2>
          <p className="mt-6 max-w-3xl text-lg text-muted-foreground leading-relaxed">
            This is an internal tool developed to help teams easily transcribe
            meetings and gain insights through AI-driven analysis. Our goal is
            to enhance productivity by simplifying meeting management with
            cutting-edge technology.
          </p>
        </section>

        <section className="text-center mt-16">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl  dark:text-gray-100 text-gray-900">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {teamMembers.map((member, index) => (
              <Card
                key={index}
                className="w-80 bg-background rounded-lg shadow-lg hover:shadow-2xl transition duration-300 ease-in-out  dark:bg-gray-200 "
              >
                <CardHeader className="text-center py-4">
                  <CardTitle className="text-lg font-bold text-gray-800">
                    {member.name}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {member.role}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 text-gray-600">
                  <p className="mt-2">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
