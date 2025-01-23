"use client";
import { LampDemo } from "./components/ui/lamp";

export default function Home() {
  return (
    <main className="flex flex-col  items-center w-full h-screen">
      <div className="w-full h-full">
        <LampDemo title="Ahorra con Calidad" slogan="Bienvenido a Mundo Subastas, donde los precios&apos;no pueden seer mejores,
         Obten tu auto de la mano de Mundo Subastas."/>
      </div>
    </main>
  );
}
