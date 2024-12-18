import React from "react";
import { useNavigate } from "react-router-dom";
import Credit from "../components/Credit";

const Info = () => {
  const navigate = useNavigate();
  const handleHome = () => {
    navigate("/countries");
  };
  return (
    <div className="bg-slate-900 min-h-screen text-white flex flex-col items-center">
      <header className="w-full py-8 text-center">
        <h1 className="text-4xl font-bold mb-4">LudoGeo</h1>
        <p className="text-lg mb-4">
          L'appli pour apprendre la geographie de facon ludique
        </p>
      </header>

      <main className="flex flex-col md:flex-row justify-center gap-8 w-full px-8 mb-8">
        <section className="flex-1 bg-slate-800 p-6 rounded-md shadow-xl">
          <h2 className="text-3xl font-semibold text-center mb-6">
            Explorez les pays
          </h2>
          <p className="text-center mb-4">
            Cliquez sur un drapeau pour en savoir plus sur le pays (PIB,
            localisation, régions...).
          </p>
        </section>

        <section className="flex-1 bg-slate-800 p-6 rounded-md shadow-xl">
          <h2 className="text-3xl font-semibold text-center text-white mb-4">
            Testez vos connaissances
          </h2>
          <p className="text-center mb-4">
            Mettez vos connaissances à l'épreuve avec nos quiz sur les pays et
            leurs capitales.
          </p>
        </section>
      </main>

      <div className="text-center mb-12">
        <button
          onClick={handleHome}
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Let's start
        </button>
      </div>

      <footer className="w-full py-4 text-center text-xs mt-auto bg-slate-800">
        <div className="flex justify-center">
          <Credit />
        </div>
      </footer>
    </div>
  );
};

export default Info;
