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

const GuessCapitalEasy = () => {
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [usedQuestions, setUsedQuestions] = useState([]);
  const [quizFinished, setQuizFinished] = useState(false);
  const navigate = useNavigate();

  const { playSound, MuteButton } = AudioPlayer();

  // Fonction pour récupérer une nouvelle question
  const fetchQuestion = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://restcountries.com/v2/all?lang=fr");
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

      // Sélection aléatoire d'une nouvelle question
      const correctCapital =
        availableQuestions[
          Math.floor(Math.random() * availableQuestions.length)
        ];

      const incorrectCapital = capitalList.filter(
        (country) => country.capital !== correctCapital.capital
      );

      const randomIncorrect = incorrectCapital
        .sort(() => 0.5 - Math.random())
        .slice(0, 1);

      const allOptions = [...randomIncorrect, correctCapital].sort(
        () => 0.5 - Math.random()
      );

      // Mise à jour des états avec la nouvelle question
      setCorrectAnswer(correctCapital);
      setOptions(allOptions);
      setSelectedAnswer(null);
      setUsedQuestions((prev) => [...prev, correctCapital.name]);
    } catch (error) {
      console.error("Erreur lors du chargement des données :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  // Gestion de la sélection d'une réponse
  const handleAnswer = (selectedOption) => {
    setSelectedAnswer(selectedOption);

    if (selectedOption.capital === correctAnswer.capital) {
      setScore(score + 1);
      playSound("/assets/sounds/win.mp3");
    } else {
      playSound("/assets/sounds/loser.mp3");
    }

    // Attendre que la question suivante apparaisse avant de mettre à jour le compteur
    setTimeout(() => {
      setQuestionCount(questionCount + 1); // Incrémenter le compteur de question
      if (questionCount + 1 === 5) {
        setQuizFinished(true); // Si on atteint la 5e question, le quiz est terminé
      } else {
        fetchQuestion(); // Charger la nouvelle question
      }
    }, 3000);
  };

  // Fonction pour recommencer le quiz
  const handleRestart = () => {
    setScore(0);
    setQuestionCount(0);
    setUsedQuestions([]);
    setQuizFinished(false);
    fetchQuestion(); // Recharger la première question
  };

  // Fonction pour passer au niveau supérieur
  const handleNextLevel = () => {
    const nextLevel = "medium";
    navigate(`/guess-capital/${nextLevel}`);
  };

  if (loading) return <Loader setLoading={setLoading} />;

  return (
    <div className="bg-slate-900 min-h-screen text-white flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-2">
        <div className="flex items-center gap-2">
          {/* Lien retour vers la sélection de difficulté */}
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
        {!quizFinished ? (
          <>
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

            {/* Affichage des options */}
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
                  disabled={!!selectedAnswer} // Désactiver le bouton après une sélection
                >
                  {option.capital}
                </SpotlightButton>
              ))}
            </div>

            {/* Résultat de la question */}
            {selectedAnswer && (
              <p className="text-center text-sm sm:text-base">
                {selectedAnswer.capital === correctAnswer.capital
                  ? "Bonne réponse !"
                  : `Mauvaise réponse. La bonne réponse était ${correctAnswer.capital}.`}
              </p>
            )}
          </>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-lg sm:text-xl">
              Quiz terminé ! Votre score : {score}/5
            </p>
            <div className="flex justify-center space-x-4">
              {/* Bouton pour recommencer le quiz */}
              <button
                onClick={handleRestart}
                className="bg-blue-500 px-4 py-2 rounded text-white"
              >
                Recommencer
              </button>
              {/* Bouton pour passer au niveau supérieur */}
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
// ************
