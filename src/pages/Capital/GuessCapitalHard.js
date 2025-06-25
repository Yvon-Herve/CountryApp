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

const GuessCapitalHard = () => {
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

  // Fonction pour récupérer une nouvelle question
  const fetchQuestion = async () => {
    setLoading(true);
    setFeedback("");
    setInputBackground("transparent");
    setUserInput("");

    try {
      const res = await axios.get(
        "https://restcountries.com/v3.1/all?fields=name,capital,region,population,translations,flags"
      );
      // const res = await axios.get("https://restcountries.com/v2/all?lang=fr");
      const capitalList = res.data.filter(
        (country) => country.capital && country.capital && country.flags
      );

      const availableQuestions = capitalList.filter(
        (country) => !usedQuestions.includes(country.name)
      );

      if (availableQuestions.length === 0) {
        setQuizFinished(true);
        return;
      }

      const correctCapital =
        availableQuestions[
          Math.floor(Math.random() * availableQuestions.length)
        ];

      setCorrectAnswer(correctCapital);
      setUsedQuestions((prev) => [...prev, correctCapital.name]);
    } catch (error) {
      console.error("Erreur lors du chargement des données", error);
    } finally {
      setLoading(false);
    }
  };

  // Utilisation de useEffect pour charger la première question
  useEffect(() => {
    fetchQuestion();
  }, []);

  // Fonction pour enlever les accents
  const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  // Fonction de validation de la réponse
  const checkAnswer = () => {
    if (!correctAnswer) return;

    const capitalInFrench = removeAccents(correctAnswer.capital.toLowerCase());
    const userAnswer = removeAccents(userInput.trim().toLowerCase());

    if (userAnswer === capitalInFrench) {
      setFeedback("Bonne réponse !");
      setInputBackground("green");
      setScore(score + 1);
      playSound("/assets/sounds/win.mp3");
    } else {
      setFeedback(
        `Mauvaise réponse. La bonne réponse était ${correctAnswer.capital}.`
      );
      setInputBackground("red");
      playSound("/assets/sounds/loser.mp3");
    }

    // Gestion du compteur de questions et de la fin du quiz
    setTimeout(() => {
      setQuestionCount(questionCount + 1);
      if (questionCount + 1 === 5) {
        setQuizFinished(true);
      } else {
        fetchQuestion();
      }
    }, 3000);
  };

  // Fonction pour recommencer le quiz
  const handleRestart = () => {
    setQuestionCount(0);
    setScore(0);
    setUsedQuestions([]);
    setQuizFinished(false);
    fetchQuestion();
  };

  // Fonction pour choisir un autre quiz
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
            to="/choose-difficulty?quiz=capital"
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
      <div className="flex-grow flex flex-col items-center justify-center space-y-8 px-4">
        {/* Affichage de la progression */}
        <div className="w-full">
          <p className="text-center text-xs break-words">
            Question {questionCount + 1} sur 5
          </p>
          <h2 className="text-center text-lg sm:text-xl md:text-2xl break-words">
            Quelle est la capitale de ce pays ?<br />
            <span className="text-blue-400">{correctAnswer.name}</span>
          </h2>
        </div>

        {/* Affichage du drapeau */}
        <div className="flex justify-center w-full">
          <img
            src={correctAnswer.flags.svg}
            alt={`Drapeau de ${correctAnswer.name}`}
            className="w-40 sm:w-56 md:w-64"
          />
        </div>

        {/* Champ de saisie et bouton */}
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

        {/* Affichage du feedback après validation */}
        <p className="text-center text-sm sm:text-base">{feedback}</p>

        {/* Message de fin de quiz */}
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
        <div className="flex justify-center">
          <Credit />
        </div>
      </footer>
    </div>
  );
};

export default GuessCapitalHard;
