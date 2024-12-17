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

const GuessMixedHard = () => {
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [quizType, setQuizType] = useState(""); // "country" ou "capital"
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

  // Fonction pour récupérer une nouvelle question
  const fetchQuestion = async () => {
    setLoading(true);
    setFeedback("");
    setInputBackground("transparent");
    setUserInput("");

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

      const correctData =
        availableQuestions[
          Math.floor(Math.random() * availableQuestions.length)
        ];

      const randomQuizType = Math.random() < 0.5 ? "country" : "capital";

      setCorrectAnswer(correctData);
      setQuizType(randomQuizType);
      setUsedQuestions((prev) => [...prev, correctData.name.common]);
    } catch (error) {
      console.error("Erreur lors du chargement des données", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  // Fonction pour normaliser les réponses (supprime les accents)
  const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  // Fonction pour vérifier la réponse
  const checkAnswer = () => {
    if (!correctAnswer) return;

    const userAnswer = removeAccents(userInput.trim().toLowerCase());

    let isCorrect = false;

    if (quizType === "country") {
      const countryNameInFrench = removeAccents(
        correctAnswer.translations?.fra?.common?.toLowerCase() || ""
      );
      if (userAnswer === countryNameInFrench) {
        isCorrect = true;
      }
    } else if (quizType === "capital") {
      const capitalName = removeAccents(
        correctAnswer.capital[0]?.toLowerCase() || ""
      );
      if (userAnswer === capitalName) {
        isCorrect = true;
      }
    }

    if (isCorrect) {
      setFeedback("Bonne réponse !");
      setInputBackground("green");
      setScore(score + 1);
      playSound("/assets/sounds/win.mp3");
    } else {
      const correctValue =
        quizType === "country"
          ? correctAnswer.translations?.fra?.common || correctAnswer.name.common
          : correctAnswer.capital[0];
      setFeedback(`Mauvaise réponse. La bonne réponse était ${correctValue}.`);
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
          <MuteButton />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center justify-center space-y-8 px-4">
        <div className="w-full">
          <p className="text-center text-xs">
            Question {questionCount + 1} sur 5
          </p>
          {quizType === "country" ? (
            <h2 className="text-center text-lg sm:text-xl md:text-2xl">
              À quel pays appartient ce drapeau ?
            </h2>
          ) : (
            <h2 className="text-center text-lg sm:text-xl md:text-2xl">
              Quelle est la capitale de{" "}
              <span className="text-blue-400">{correctAnswer.name.common}</span>{" "}
              ?
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

        <p className="text-center text-sm">{feedback}</p>

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

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs mt-auto">
        <Credit />
      </footer>
    </div>
  );
};

export default GuessMixedHard;
