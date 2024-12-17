import React, { useEffect, useState } from "react";
import Navigation from "../../components/Navigation";
import SpotlightButton from "../../components/SpotlightButton";
import axios from "axios";
import Loader from "../../components/Loader";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import AudioPlayer from "../../components/AudioPlayer";
import Credit from "../../components/Credit";

const GuessCountryHard = () => {
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [inputBackground, setInputBackground] = useState("transparent");
  const [loading, setLoading] = useState(true);
  const [questionCount, setQuestionCount] = useState(0);
  const [score, setScore] = useState(0);
  const [usedQuestions, setUsedQuestions] = useState([]);
  const [quizFinished, setQuizFinished] = useState(false);
  const navigate = useNavigate();

  const { playSound, MuteButton } = AudioPlayer();

  const fetchQuestion = async () => {
    setLoading(true);
    setFeedback("");
    setInputBackground("transparent");
    setUserInput("");

    try {
      const res = await axios.get("https://restcountries.com/v3.1/all");
      const countryList = res.data.filter((country) => country.flags);

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

      setCorrectAnswer(correctCountry);
      setUsedQuestions((prev) => [...prev, correctCountry.name.common]);
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

    const countryNameInFrench = removeAccents(
      correctAnswer.translations?.fra?.common?.toLowerCase() || ""
    );
    const userAnswer = removeAccents(userInput.trim().toLowerCase());

    if (userAnswer === countryNameInFrench) {
      setFeedback("Bonne réponse !");
      setInputBackground("green");
      setScore(score + 1);
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
      setQuestionCount(questionCount + 1);
      if (questionCount + 1 === 5) {
        setQuizFinished(true);
      } else {
        fetchQuestion();
      }
    }, 3000);
  };

  const handleRestart = () => {
    setQuestionCount(0);
    setScore(0);
    setUsedQuestions([]);
    setQuizFinished(false);
    fetchQuestion();
  };

  const handleChooseAnotherQuiz = () => {
    navigate("/choose-quiz");
  };

  if (loading || !correctAnswer) return <Loader setLoading={setLoading} />;

  return (
    <div className="bg-slate-900 min-h-screen text-white flex flex-col">
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

      <div className="flex-grow flex flex-col items-center justify-center space-y-8 px-4">
        <div className="w-full">
          <p className="text-center text-xs break-words">
            Question {questionCount + 1} sur 5
          </p>
          <h2 className="text-center text-lg sm:text-xl md:text-2xl break-words">
            À quel pays appartient ce drapeau ?
          </h2>
        </div>

        <div className="flex justify-center w-full">
          <img
            src={correctAnswer.flags.svg}
            alt={`Drapeau de ${correctAnswer.name.common}`}
            className="w-40 sm:w-56 md:w-64"
          />
        </div>

        <div className="flex flex-col gap-4 w-full max-w-screen-sm justify-center items-center">
          <input
            className="rounded-lg text-white px-4 py-2 w-full sm:w-auto"
            type="text"
            placeholder="Entrez votre réponse"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            style={{ backgroundColor: inputBackground }}
            disabled={feedback !== ""}
          />
          <SpotlightButton
            onClick={checkAnswer}
            disabled={feedback !== "" || !userInput.trim()}
          >
            Valider
          </SpotlightButton>
        </div>

        <p className="text-center text-sm sm:text-base">{feedback}</p>

        {quizFinished && (
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
                onClick={handleChooseAnotherQuiz}
                className="bg-green-500 px-4 py-2 rounded text-white"
              >
                Choisir un autre quiz
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

export default GuessCountryHard;
