import React, { useEffect, useState } from "react";
import Navigation from "../../components/Navigation";
import axios from "axios";
import SpotlightButton from "../../components/SpotlightButton";
import Loader from "../../components/Loader";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import AudioPlayer from "../../components/AudioPlayer";
import Credit from "../../components/Credit";

const GuessMixedMedium = () => {
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [usedQuestions, setUsedQuestions] = useState([]);
  const [quizFinished, setQuizFinished] = useState(false);
  const [isCapitalQuestion, setIsCapitalQuestion] = useState(false);
  const navigate = useNavigate();

  const { playSound, MuteButton } = AudioPlayer();

  const fetchQuestion = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://restcountries.com/v3.1/all");
      const countryList = res.data.filter(
        (country) => country.capital && country.flags
      );

      const availableQuestions = countryList.filter(
        (country) => !usedQuestions.includes(country.name.common)
      );

      if (availableQuestions.length === 0) {
        setQuizFinished(true);
        return;
      }

      const correctCountry =
        availableQuestions[
          Math.floor(Math.random() * availableQuestions.length)
        ];

      const incorrectCountries = countryList.filter(
        (country) =>
          country.name.common !== correctCountry.name.common &&
          country.capital[0] !== correctCountry.capital[0]
      );

      const randomIncorrect = incorrectCountries
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      const allOptions = [...randomIncorrect, correctCountry].sort(
        () => 0.5 - Math.random()
      );

      setCorrectAnswer(correctCountry);
      setOptions(allOptions);
      setIsCapitalQuestion(Math.random() > 0.5);
      setSelectedAnswer(null);
      setUsedQuestions((prev) => [...prev, correctCountry.name.common]);
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

    const isCorrect =
      (isCapitalQuestion &&
        selectedOption.capital[0] === correctAnswer.capital[0]) ||
      (!isCapitalQuestion &&
        selectedOption.name.common === correctAnswer.name.common);

    if (isCorrect) {
      setScore(score + 1);
      playSound("/assets/sounds/win.mp3");
    } else {
      playSound("/assets/sounds/loser.mp3");
    }

    setTimeout(() => {
      setQuestionCount(questionCount + 1);
      if (questionCount + 1 === 5) {
        setQuizFinished(true);
      } else {
        fetchQuestion();
      }
    }, 3000);
  };

  const handleRestart = () => {
    setScore(0);
    setQuestionCount(0);
    setUsedQuestions([]);
    setQuizFinished(false);
    fetchQuestion();
  };

  const handleNextLevel = () => {
    const nextLevel = "hard";
    navigate(`/guess-country/${nextLevel}`);
  };

  if (loading) return <Loader setLoading={setLoading} />;

  return (
    <div className="bg-slate-900 min-h-screen text-white flex flex-col">
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
          <MuteButton />
        </div>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center space-y-8 px-4">
        {!quizFinished ? (
          <>
            <div className="w-full">
              <p className="text-center text-xs break-words">
                Question {questionCount + 1} sur 5
              </p>
              {isCapitalQuestion ? (
                <h2 className="text-center text-lg sm:text-xl md:text-2xl break-words">
                  Quelle est la capitale de ce pays ?{" "}
                  <span className="text-blue-400">
                    {correctAnswer.name.common}
                  </span>
                </h2>
              ) : (
                <h2 className="text-center text-lg sm:text-xl md:text-2xl break-words">
                  À quel pays appartient ce drapeau ?
                </h2>
              )}
            </div>

            <div className="flex justify-center w-full">
              <img
                src={correctAnswer.flags.svg}
                alt={`Drapeau de ${correctAnswer.name.common}`}
                className="w-40 sm:w-56 md:w-64"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-4 w-full max-w-screen-sm">
              {options.map((option, index) => (
                <SpotlightButton
                  key={index}
                  onClick={() => handleAnswer(option)}
                  style={{
                    backgroundColor:
                      selectedAnswer === option
                        ? (isCapitalQuestion &&
                            option.capital[0] === correctAnswer.capital[0]) ||
                          (!isCapitalQuestion &&
                            option.name.common === correctAnswer.name.common)
                          ? "green"
                          : "red"
                        : "transparent",
                  }}
                  disabled={!!selectedAnswer}
                >
                  {isCapitalQuestion
                    ? option.capital[0]
                    : option.translations?.fra?.common || option.name.common}
                </SpotlightButton>
              ))}
            </div>

            {selectedAnswer && (
              <p className="text-center text-sm sm:text-base">
                {selectedAnswer === correctAnswer
                  ? "Bonne réponse !"
                  : `Mauvaise réponse. La bonne réponse était ${
                      isCapitalQuestion
                        ? correctAnswer.capital[0]
                        : correctAnswer.translations?.fra?.common ||
                          correctAnswer.name.common
                    }.`}
              </p>
            )}
          </>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-lg sm:text-xl">
              Quiz terminé ! Votre score : {score}/5
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleRestart}
                className="bg-blue-500 px-4 py-2 rounded text-white"
              >
                Recommencer
              </button>
              <button
                onClick={handleNextLevel}
                className="bg-green-500 px-4 py-2 rounded text-white"
              >
                Niveau supérieur
              </button>
            </div>
          </div>
        )}
      </div>

      <footer className="w-full py-4 text-center text-xs mt-auto">
        <div className="flex justify-center">
          <Credit />
        </div>
      </footer>
    </div>
  );
};

export default GuessMixedMedium;
