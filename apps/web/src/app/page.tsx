import type { Metadata } from "next";
import SpeechInput from "../components/speech-input";
import React from "react";

export const metadata: Metadata = {
  title: "Web - Turborepo Example",
};

export default function Home(): JSX.Element {
  return (
    <div className="flex flex-col items-center min-h-screen py-2">
      <main className="w-auto px-4 pt-16 pb-8 mx-auto sm:pt-24 lg:px-8">
        <h1 className="mx-auto text-6xl font-extrabold tracking-tight text-center text-white sm:text-7xl lg:text-8xl xl:text-8xl">
          Coffee Shop
        </h1>
        <SpeechInput />
      </main>
    </div>
  );
}
