import React from "react";
import earth from "../img/girl.png";
import Credit from "../components/Credit";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white">
      {/* Header Section */}
      <header className="w-full text-center py-8 md:py-12">
        {" "}
        {/* Réduit le padding */}
        <h1 className="text-4xl md:text-5xl font-bold">
          Bienvenue sur LudoGeo !
        </h1>
        <p className="text-lg md:text-xl mt-4">
          L'appli pour apprendre la geographie de facon ludique
        </p>
      </header>

      {/* Main Content Section */}
      <main className="flex flex-col items-center flex-grow justify-center">
        {" "}
        {/* Ajoute justify-center */}
        <img
          src={earth}
          alt="Dessin d'un enfant"
          className="w-1/4 md:w-1/4 max-w-md mb-6"
        />
        <Link
          to="/countries"
          className="px-6 md:px-8 py-3 md:py-4 bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600 transition"
        >
          Découvrir
        </Link>
      </main>

      {/* Footer  */}
      <footer className="w-full py-4 text-center text-xs mt-auto">
        <div className="flex justify-center">
          <Credit />
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
