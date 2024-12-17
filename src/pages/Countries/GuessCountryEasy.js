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

const GuessCountryEasy = () => {
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const { playSound, MuteButton } = AudioPlayer();

  const fetchCountries = async () => {
    setLoading(true);
    setSelectedAnswer(null);

    try {
      const res = await axios.get("https://restcountries.com/v3.1/all");
      const countryList = res.data.filter((country) => country.flags);

      const correctCountry =
        countryList[Math.floor(Math.random() * countryList.length)];

      const incorrectCountries = countryList.filter(
        (country) => country.name.common !== correctCountry.name.common
      );

      const randomIncorrect = incorrectCountries
        .sort(() => 0.5 - Math.random())
        .slice(0, 1);

      const allOptions = [...randomIncorrect, correctCountry].sort(
        () => 0.5 - Math.random()
      );

      setCorrectAnswer(correctCountry);
      setOptions(allOptions);
    } catch (error) {
      console.error("Erreur lors du chargement des données", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const handleAnswerClick = (option) => {
    setSelectedAnswer(option);

    if (option.name.common === correctAnswer.name.common) {
      playSound("/assets/sounds/win.mp3");
    } else {
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
          <MuteButton /> {/* Bouton pour activer/désactiver le son */}
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-grow flex flex-col mt-14 space-y-10 items-center justify-center px-4">
        {/* Question */}
        <div className="w-full">
          <h1 className="text-center text-lg sm:text-xl md:text-2xl break-words">
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

        {/* Options */}
        <div className="flex flex-wrap gap-4 justify-center items-center w-full sm:w-auto px-4">
          {options.map((option, index) => (
            <SpotlightButton
              key={index}
              onClick={() => handleAnswerClick(option)}
              style={{
                backgroundColor:
                  selectedAnswer === option
                    ? option.name.common === correctAnswer.name.common
                      ? "green"
                      : "red"
                    : "transparent",
                pointerEvents: selectedAnswer ? "none" : "auto",
              }}
            >
              {option.translations?.fra?.common || option.name.common}
            </SpotlightButton>
          ))}
        </div>

        {/* Feedback */}
        {selectedAnswer && (
          <p className="text-center text-sm sm:text-base">
            {selectedAnswer.name.common === correctAnswer.name.common
              ? "Bonne réponse !"
              : `Mauvaise réponse. La bonne réponse était ${
                  correctAnswer.translations?.fra?.common ||
                  correctAnswer.name.common
                }.`}
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

export default GuessCountryEasy;
