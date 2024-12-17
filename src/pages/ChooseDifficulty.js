import React from "react";
import Sparkles from "../components/Sparkles";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Page() {
  const query = useQuery();
  const quizType = query.get("quiz");

  // Logique pour afficher le type de quiz correctement
  let quizTitle = "";
  if (quizType === "country") {
    quizTitle = "Pays";
  } else if (quizType === "capital") {
    quizTitle = "Capitale";
  } else if (quizType === "mixed") {
    quizTitle = "Mixte";
  }

  return (
    <div className="bg-slate-900">
      <div className="h-screen w-screen overflow-hidden">
        <Link className="m-4 relative z-10 text-white" to="/choose-quiz">
          <FontAwesomeIcon icon={faArrowLeft} />
        </Link>

        {/* Contenu principal */}
        <div className="mx-auto mt-20 sm:mt-32 w-screen max-w-2xl px-4">
          <div className="text-center text-3xl sm:text-4xl text-white">
            <span className="text-indigo-200">
              Choisissez le niveau pour le quiz : {quizTitle}
            </span>
          </div>

          {/* Options de quiz */}
          <div className="text-white gap-6 mt-14 flex flex-col sm:flex-row justify-center list-none text-center relative z-10">
            <li className="mb-4 sm:mb-0">
              <Link
                to={`/guess-${quizType}/easy`}
                className="text-lg sm:text-xl"
              >
                Facile
              </Link>
            </li>
            <li className="mb-4 sm:mb-0">
              <Link
                to={`/guess-${quizType}/medium`}
                className="text-lg sm:text-xl"
              >
                Moyen
              </Link>
            </li>
            <li>
              <Link
                to={`/guess-${quizType}/hard`}
                className="text-lg sm:text-xl"
              >
                Difficile
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
