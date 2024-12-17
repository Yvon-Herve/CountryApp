import React, { useEffect, useState } from "react";
import Navigation from "../../components/Navigation";
import SpotlightButton from "../../components/SpotlightButton";
import axios from "axios";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import AudioPlayer from "../../components/AudioPlayer";
import Credit from "../../components/Credit";

const GuessCapitalHard = () => {
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [inputBackground, setInputBackground] = useState("transparent");
  const [loading, setLoading] = useState(true);

  const { playSound, MuteButton } = AudioPlayer();

  const fetchQuestion = async () => {
    setLoading(true);
    setFeedback("");
    setInputBackground("transparent");
    setUserInput("");

    try {
      const res = await axios.get("https://restcountries.com/v2/all?lang=fr");
      const capitalList = res.data.filter(
        (country) => country.capital && country.capital && country.flags
      );

      const correctCapital =
        capitalList[Math.floor(Math.random() * capitalList.length)];
      setCorrectAnswer(correctCapital);
    } catch (error) {
      console.error("Erreur lors du chargement des données", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const checkAnswer = () => {
    if (!correctAnswer) return;

    const capitalInFrench = removeAccents(correctAnswer.capital.toLowerCase());
    const userAnswer = removeAccents(userInput.trim().toLowerCase());

    if (userAnswer === capitalInFrench) {
      setFeedback("Bonne réponse !");
      setInputBackground("green");
      playSound("/assets/sounds/win.mp3");
    } else {
      setFeedback(
        `Mauvaise réponse. La bonne réponse était ${correctAnswer.capital}.`
      );
      setInputBackground("red");
      playSound("/assets/sounds/loser.mp3");
    }

    setTimeout(() => {
      fetchQuestion();
    }, 3000);
  };

  if (loading || !correctAnswer) return <Loader setLoading={setLoading} />;

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

        {/* Input et bouton */}
        <div className="flex flex-col gap-4 w-full max-w-screen-sm justify-center items-center">
          <input
            className="rounded-lg text-white px-4 py-2 w-full sm:w-auto"
            type="text"
            placeholder="Entrez votre réponse"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)} // Mise à jour de la réponse
            style={{ backgroundColor: inputBackground }}
            disabled={feedback !== ""} // Désactive seulement après validation
          />
          <SpotlightButton
            onClick={checkAnswer} // Validation directe
            disabled={feedback !== "" || !userInput.trim()} // Désactive si l'input est vide
          >
            Valider
          </SpotlightButton>
        </div>

        {/* Feedback après validation */}
        <p className="text-center text-sm sm:text-base">{feedback}</p>
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

export default GuessCapitalHard;
