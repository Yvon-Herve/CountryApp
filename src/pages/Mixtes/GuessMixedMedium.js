import React, { useEffect, useState } from "react";
import axios from "axios";
import Navigation from "../../components/Navigation";
import SpotlightButton from "../../components/SpotlightButton";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import AudioPlayer from "../../components/AudioPlayer";
import Credit from "../../components/Credit";

const GuessMixedMedium = () => {
  const [question, setQuestion] = useState(null); // Contient la question (pays ou capitale)
  const [options, setOptions] = useState([]); // Contient les options de réponse
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState(null); // Réponse sélectionnée
  const [feedback, setFeedback] = useState(""); // Retour de la bonne ou mauvaise réponse

  const { playSound, MuteButton } = AudioPlayer(); // Gestion du son

  // Fonction pour récupérer les données
  const fetchData = async () => {
    try {
      const res = await axios.get("https://restcountries.com/v3.1/all");
      const countryList = res.data.filter(
        (country) => country.capital && country.flags
      );

      const isCapitalQuestion = Math.random() > 0.5;
      const correctItem =
        countryList[Math.floor(Math.random() * countryList.length)];

      const incorrectItems = countryList.filter((country) =>
        isCapitalQuestion
          ? country.capital[0] !== correctItem.capital[0]
          : country.name.common !== correctItem.name.common
      );

      const randomIncorrect = incorrectItems
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      const allOptions = [...randomIncorrect, correctItem].sort(
        () => 0.5 - Math.random()
      );

      setQuestion(isCapitalQuestion ? "capital" : "country");
      setCorrectAnswer(correctItem);
      setOptions(allOptions);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement des données :", error);
    }
  };

  // Fonction pour gérer le clic sur une réponse
  const handleAnswer = (option) => {
    setSelectedAnswer(option);

    // Vérification de la réponse
    if (
      (question === "capital" &&
        option.capital[0] === correctAnswer.capital[0]) ||
      (question === "country" &&
        option.name.common === correctAnswer.name.common)
    ) {
      setFeedback("Bonne réponse !");
      playSound("/assets/sounds/win.mp3");
    } else {
      setFeedback(
        `Mauvaise réponse. La bonne réponse était ${
          question === "capital"
            ? correctAnswer.capital[0]
            : correctAnswer.translations.fra?.common ||
              correctAnswer.name.common
        }.`
      );
      playSound("/assets/sounds/loser.mp3");
    }

    setTimeout(() => {
      resetGame();
    }, 3000);
  };

  // Fonction pour réinitialiser le jeu
  const resetGame = () => {
    setSelectedAnswer(null);
    setFeedback(""); // Réinitialiser le feedback
    setLoading(true);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <Loader setLoading={setLoading} />;

  return (
    <div className="bg-slate-900 min-h-screen text-white flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-2">
        <div className="flex items-center gap-2">
          <Link
            className="m-4 relative z-10 text-white"
            to="/choose-difficulty?quiz=mixed"
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
      <div className="flex-grow flex flex-col mt-14 space-y-10 items-center justify-center px-4">
        {/* Question */}
        <div className="w-full text-center">
          {question === "capital" ? (
            <h1 className="text-center text-lg sm:text-xl md:text-2xl break-words">
              Quelle est la capitale de ce pays ?<br />
              <span className="text-blue-400">{correctAnswer.name.common}</span>
            </h1>
          ) : (
            <h1 className="text-lg sm:text-xl md:text-2xl">
              À quel pays appartient ce drapeau ?
            </h1>
          )}
        </div>

        {/* Drapeau */}
        <div className="flex justify-center w-full">
          <img
            src={correctAnswer.flags.svg}
            alt={`Drapeau de ${correctAnswer.name.common}`}
            className="w-48 sm:w-64 md:w-72"
          />
        </div>

        {/* Options de réponses */}
        <div className="flex flex-wrap gap-4 justify-center items-center w-full sm:w-auto px-4">
          {options.map((option, index) => (
            <SpotlightButton
              key={index}
              onClick={() => handleAnswer(option)}
              style={{
                backgroundColor:
                  selectedAnswer === option
                    ? (question === "capital" &&
                        option.capital[0] === correctAnswer.capital[0]) ||
                      (question === "country" &&
                        option.name.common === correctAnswer.name.common)
                      ? "green"
                      : "red"
                    : "transparent",
                width: "auto", // Ajuste la largeur des boutons
                minWidth: "100px", // Largeur minimale pour les petits écrans
                padding: "10px 20px", // Ajouter du padding pour les petits écrans
              }}
            >
              {question === "capital"
                ? option.capital[0]
                : option.translations.fra?.common || option.name.common}
            </SpotlightButton>
          ))}
        </div>

        {/* Feedback */}
        {feedback && (
          <p className="text-center text-sm sm:text-base">{feedback}</p>
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

export default GuessMixedMedium;
