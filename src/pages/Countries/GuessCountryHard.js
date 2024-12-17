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

const GuessCountryHard = () => {
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const [inputBackground, setInputBackground] = useState("transparent");

  const { playSound, MuteButton } = AudioPlayer(); // Gestion du son

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    setLoading(true);
    setFeedback("");
    setInputBackground("transparent");
    setUserInput("");

    try {
      const res = await axios.get("https://restcountries.com/v3.1/all");
      const countryList = res.data.filter((country) => country.flags);

      const correctCountry =
        countryList[Math.floor(Math.random() * countryList.length)];

      setCorrectAnswer(correctCountry);
    } catch (error) {
      console.error("Erreur lors du chargement des données", error);
    } finally {
      setLoading(false);
    }
  };

  const checkAnswer = () => {
    const removeAccents = (str) => {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };

    const countryNameInFrench = removeAccents(
      correctAnswer.translations?.fra?.common?.toLowerCase() || ""
    );

    const userAnswer = removeAccents(userInput.trim().toLowerCase());

    if (userAnswer === countryNameInFrench) {
      setFeedback("Bonne réponse !");
      setInputBackground("green");
      playSound("/assets/sounds/win.mp3");
    } else {
      setFeedback(
        `Mauvaise réponse. La bonne réponse était ${
          correctAnswer.translations?.fra?.common || correctAnswer.name.common
        }.`
      );
      setInputBackground("red");
      playSound("/assets/sounds/loser.mp3");
    }

    setTimeout(() => {
      fetchCountries();
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
            to="/choose-difficulty?quiz=country"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
          <Navigation />
        </div>
        <div className="m-4">
          <MuteButton />
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-grow flex flex-col mt-14 space-y-10 items-center justify-center px-4">
        {/* Question */}
        <div>
          <h1 className="text-center text-lg sm:text-xl md:text-2xl">
            À quel pays appartient ce drapeau ?
          </h1>
        </div>

        {/* Drapeau */}
        <div className="flex justify-center w-full">
          <img
            src={correctAnswer.flags.svg}
            alt={`Drapeau de ${correctAnswer.name.common}`}
            className="w-48 sm:w-64 md:w-72"
          />
        </div>

        {/* Input et Bouton */}
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

export default GuessCountryHard;
