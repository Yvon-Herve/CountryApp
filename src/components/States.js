import React, { useEffect, useState } from "react";
import axios from "axios";
const translateWithLibreTranslate = async (text) => {
  try {
    const res = await axios.post("https://libretranslate.com/translate", {
      q: text,
      source: "en",
      target: "fr",
    });
    return res.data.translatedText;
  } catch (error) {
    console.error("Erreur lors de la traduction :", error);
    return text;
  }
};

const States = ({ country }) => {
  const [states, setStates] = useState([]);
  const [translatedStates, setTranslatedStates] = useState([]);
  const [error, setError] = useState(null);

  const specialTranslations = {
    Brittany: "Bretagne",
    Alo: "Wallis-et-Futuna",
    Burgundy: "Bourgogne",
    "Lower Normandy": "Basse-Normandie",
    Occitania: "Occitanie",
    Picardy: "Picardie",
    Sigave: "Wallis-et-Futuna",
    "Upper Normandy": "Haute-Normandie",
    Uvea: "Wallis-et-Futuna",
    "Wallis and Futuna": "Wallis-et-Futuna",
  };

  const getStates = async () => {
    try {
      const res = await axios.post(
        "https://countriesnow.space/api/v0.1/countries/states",
        { country }
      );

      if (res.data?.data?.states) {
        setStates(res.data.data.states);

        // Appliquer les traductions spéciales pour la France
        if (country === "France") {
          const translations = res.data.data.states.map(
            (state) => specialTranslations[state.name] || state.name
          );
          setTranslatedStates(translations);
        } else {
          // Traduction dynamique pour les autres pays
          const translations = await Promise.all(
            res.data.data.states.map((state) =>
              translateWithLibreTranslate(state.name)
            )
          );
          setTranslatedStates(translations);
        }
      } else {
        setError("Aucune région trouvée pour ce pays.");
      }
    } catch (err) {
      setError("Erreur lors de la récupération des régions.");
      console.error(err);
    }
  };

  useEffect(() => {
    if (country) {
      getStates();
    }
  }, [country]);

  if (error) return <p>{error}</p>;
  if (!states.length) return <p>Chargement des régions...</p>;

  return (
    <div>
      <h3>Régions de {country} :</h3>
      <table className="table-auto border-collapse border border-gray-400 text-left">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">#</th>
            <th className="border border-gray-300 px-4 py-2">
              Nom des régions
            </th>
          </tr>
        </thead>
        <tbody>
          {translatedStates.map((state, index) => (
            <tr key={index}>
              <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
              <td className="border border-gray-300 px-4 py-2">{state}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default States;
