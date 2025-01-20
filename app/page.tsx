"use client";
import { VortexDemoSecond } from "./components/landingHero";

export default function Home() {
  return (
    <main className="flex flex-col gap-8 row-start-2 items-center w-full h-screen">
      <div className="w-full h-full">
        <VortexDemoSecond />
      </div>
    </main>
  );
}
