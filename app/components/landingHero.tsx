import React from "react";
import { Vortex } from "./ui/vortex";
import Link from "next/link";

export function VortexDemoSecond() {
  return (
    <div className="w-full mx-auto rounded-md  h-screen overflow-hidden">
      <Vortex
        backgroundColor="black"
        rangeY={800}
        particleCount={500}
        baseHue={120}
        className="flex items-center flex-col justify-center px-2 md:px-10  py-4 w-full h-full"
      >
        <h2 className="text-white text-2xl md:text-6xl font-bold text-center">
          Ahorra con Calidad
        </h2>
        <p className="text-white text-sm md:text-2xl max-w-xl mt-6 text-center">
         Bienvenido a Mundo Subastas, donde los precios&apos;no pueden seer mejores,
         Obten tu auto de la mano de Mundo Subastas.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
          <Link href={"/auth/login"} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition duration-200 rounded-lg text-white shadow-[0px_2px_0px_0px_#FFFFFF40_inset]">
            Authenticate
          </Link>
          <Link href={"/auth/register"} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition duration-200 rounded-lg text-white shadow-[0px_2px_0px_0px_#FFFFFF40_inset]">
            Registrate
          </Link>
        </div>
      </Vortex>
    </div>
  );
}
