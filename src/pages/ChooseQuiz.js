import React from "react";
import { Link } from "react-router-dom";
import Sparkles from "../components/Sparkles";
import Navigation from "../components/Navigation";

export default function Page() {
  return (
    <div className="bg-slate-900">
      <div className="h-screen w-screen overflow-hidden">
        {/* Navigation */}
        <Navigation />

        {/* Contenu principal */}
        <div className="mx-auto mt-20 sm:mt-32 w-screen max-w-2xl px-4">
          <div className="text-center text-3xl sm:text-4xl text-white">
            <span className="text-indigo-200">Choisissez votre quiz.</span>
          </div>

          {/* Options de quiz */}
          <div className="text-white gap-6 mt-14 flex flex-col sm:flex-row justify-center list-none text-center relative z-10">
            <li className="mb-4 sm:mb-0">
              <Link
                to="/choose-difficulty?quiz=country"
                className="text-lg sm:text-xl"
              >
                Pays
              </Link>
            </li>
            <li className="mb-4 sm:mb-0">
              <Link
                to="/choose-difficulty?quiz=capital"
                className="text-lg sm:text-xl"
              >
                Capitale
              </Link>
            </li>
            <li>
              <Link
                to="/choose-difficulty?quiz=mixed"
                className="text-lg sm:text-xl"
              >
                Mixte
              </Link>
            </li>
          </div>
        </div>

        {/* Effets visuels */}
        <div className="relative -mt-32 h-96 sm:h-[30rem] w-screen overflow-hidden [mask-image:radial-gradient(50%_50%,white,transparent)] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_bottom_center,#8350e8,transparent_70%)] before:opacity-40 after:absolute after:-left-1/2 after:top-1/2 after:aspect-[1/0.7] after:w-[200%] after:rounded-[100%] after:border-t after:border-[#7876c566] after:bg-zinc-900">
          <Sparkles
            density={1200}
            className="absolute inset-x-0 bottom-0 h-full w-full [mask-image:radial-gradient(50%_50%,white,transparent_85%)]"
          />
        </div>
      </div>
    </div>
  );
}
