import React, { useEffect, useState } from "react";
import Navigation from "../../components/Navigation";
import axios from "axios";
import SpotlightButton from "../../components/SpotlightButton";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import AudioPlayer from "../../components/AudioPlayer";
import Credit from "../../components/Credit";

const GuessCapitalEasy = () => {
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [loading, setLoading] = useState(true);

  const { playSound, MuteButton } = AudioPlayer(); // Gestion du son

  const fetchQuestion = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://restcountries.com/v2/all?lang=fr");
      const capitalList = res.data.filter(
        (country) => country.capital && country.capital && country.flags
      );

      const correctCapital =
        capitalList[Math.floor(Math.random() * capitalList.length)];

      const incorrectCapital = capitalList.filter(
        (country) => country.capital !== correctCapital.capital
      );

      const randomIncorrect = incorrectCapital
        .sort(() => 0.5 - Math.random())
        .slice(0, 1);

      const allOptions = [...randomIncorrect, correctCapital].sort(
        () => 0.5 - Math.random()
      );

      setCorrectAnswer(correctCapital);
      setOptions(allOptions);
      setSelectedAnswer(null); // Réinitialise l'état pour la nouvelle question
    } catch (error) {
      console.error("Erreur lors du chargement des données :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  const handleAnswer = (selectedOption) => {
    setSelectedAnswer(selectedOption);

    if (selectedOption.capital === correctAnswer.capital) {
      playSound("/assets/sounds/win.mp3");
    } else {
      playSound("/assets/sounds/loser.mp3");
    }

    setTimeout(() => {
      fetchQuestion();
    }, 3000);
  };

  if (loading) return <Loader setLoading={setLoading} />;
  return (
    <div className="bg-slate-900 min-h-screen text-white flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-2">
        <div className="flex items-center gap-2">
          <Link
            className="m-4 relative z-10 text-white"
            to="/choose-difficulty?quiz=capital"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
          <Navigation />
        </div>
        <div className="m-4">
          <MuteButton /> {/* Bouton pour activer/désactiver le son */}
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-grow flex flex-col items-center justify-center space-y-8 px-4">
        {/* Question */}
        <div className="w-full">
          <h1 className="text-center text-lg sm:text-xl md:text-2xl break-words">
            Quelle est la capitale de ce pays ?<br />
            <span className="text-blue-400">{correctAnswer.name}</span>
          </h1>
        </div>

        {/* Drapeau */}
        <div className="flex justify-center w-full">
          <img
            src={correctAnswer.flags.svg}
            alt={`Drapeau de ${correctAnswer.name}`}
            className="w-40 sm:w-56 md:w-64"
          />
        </div>

        {/* Options */}
        <div className="flex flex-wrap justify-center gap-4 w-full max-w-screen-sm">
          {options.map((option, index) => (
            <SpotlightButton
              key={index}
              onClick={() => handleAnswer(option)}
              style={{
                backgroundColor:
                  selectedAnswer === option
                    ? option.capital === correctAnswer.capital
                      ? "green"
                      : "red"
                    : "transparent",
              }}
              disabled={!!selectedAnswer}
            >
              {option.capital}
            </SpotlightButton>
          ))}
        </div>

        {/* Résultat */}
        {selectedAnswer && (
          <p className="text-center text-sm sm:text-base">
            {selectedAnswer.capital === correctAnswer.capital
              ? "Bonne réponse !"
              : `Mauvaise réponse. La bonne réponse était ${correctAnswer.capital}.`}
          </p>
        )}
      </div>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs mt-auto">
        <div className="flex justify-center">
          <Credit />
        </div>
      </footer>
    </div>
  );
};

export default GuessCapitalEasy;
