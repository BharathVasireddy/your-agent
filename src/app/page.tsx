import LoginButton from "@/components/LoginButton";
import { FileText, Globe, Code } from "lucide-react";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="flex flex-col items-center justify-center text-center space-y-8">
          <h1 
            className="text-4xl font-semibold heading-primary"
            style={{ color: "var(--primary-red)" }}
          >
            YourAgent.in
          </h1>
          <p 
            className="text-lg max-w-md text-body"
            style={{ color: "var(--text-secondary)" }}
          >
            Transform your real estate business with AI-powered agent profiles, property management, and client automation tools.
          </p>
          <LoginButton />
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/about"
        >
          <FileText size={16} />
          About
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/features"
        >
          <Code size={16} />
          Features
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/contact"
        >
          <Globe size={16} />
          Contact
        </a>
      </footer>
    </div>
  );
}
