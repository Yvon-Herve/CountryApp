import { useEffect, useState } from "react";
import axios from "axios";
import Card from "../components/Card";
import Navigation from "../components/Navigation";
import Credit from "../components/Credit";

const Countries = () => {
  const [data, setData] = useState([]);
  const [rangeValue, setRangeValue] = useState(36);
  const radios = ["Africa", "America", "Asia", "Europe", "Oceania"];
  const [search, setSearch] = useState("");
  const [selectradio, setSelectRadio] = useState("");
  const [decroissant, setDecroissant] = useState(true);

  // Fonction async pour récupérer les données
  const fetchData = async () => {
    try {
      const res = await axios.get(
        "https://restcountries.com/v3.1/all?fields=name,capital,region,population,translations,flags,continents"
      );

      // Filtrer les pays en excluant "Îles mineures éloignées des États-Unis"
      const filteredData = res.data.filter(
        (country) =>
          !country.translations.fra.common.includes(
            "Îles mineures éloignées des États-Unis"
          )
      );

      setData(filteredData); // Mettre à jour l'état avec les données filtrées
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    }
  };

  // Utilisez useEffect pour charger les données au chargement du composant
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="bg-slate-900 min-h-screen flex flex-col text-white">
      {/* Navigation */}
      <Navigation />

      {/* Conteneur principal */}
      <div className="flex-grow">
        <ul className="flex flex-wrap justify-center gap-4 p-4">
          {/* Champ de recherche */}
          <input
            placeholder="Recherche un pays"
            className="border-solid border-2 border-indigo-600 text-slate-800 px-2 py-1 w-full sm:w-auto"
            type="search"
            onChange={(e) => setSearch(e.target.value.toLowerCase())}
          />

          {/* Bouton de tri */}
          <li>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-full sm:w-auto"
              onClick={() => setDecroissant(!decroissant)}
            >
              Trier : {decroissant ? "Croissant" : "Décroissant"}
            </button>
          </li>

          {/* Curseur pour la limite d'affichage */}
          <li className="flex flex-col gap-2 items-center w-full sm:w-auto">
            <input
              type="range"
              min="1"
              max="250"
              defaultValue={rangeValue}
              onChange={(e) => setRangeValue(e.target.value)}
              className="w-full sm:w-64"
            />
            <span className="text-sm font-semibold">{rangeValue}</span>
          </li>

          {/* Boutons radio pour les continents */}
          {radios.map((continent) => (
            <li key={continent} className="w-full sm:w-auto">
              <input
                type="radio"
                name="radiosContinent"
                id={continent}
                checked={continent === selectradio}
                onChange={(e) => setSelectRadio(e.target.id)}
              />
              <label htmlFor={continent} className="ml-2">
                {continent}
              </label>
            </li>
          ))}

          {/* Bouton pour annuler le tri par continent */}
          <li>
            {selectradio && (
              <button
                className="bg-blue-500 text-white font-bold py-2 px-2 rounded-full hover:bg-blue-700 transition duration-300 w-full sm:w-auto"
                onClick={() => setSelectRadio("")}
              >
                Annuler le tri
              </button>
            )}
          </li>
        </ul>

        {/* Affichage des pays */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6 justify-items-center items-center">
          {data
            .filter((country) =>
              country.translations.fra.common
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .startsWith(
                  search
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                )
            )
            .filter((continent) =>
              continent.continents[0].includes(selectradio)
            )
            .sort((a, b) =>
              decroissant
                ? b.population - a.population
                : a.population - b.population
            )
            .slice(0, rangeValue)
            .map((countries) => (
              <Card key={countries.cca3} countries={countries} />
            ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-center pt-4">
        <Credit />
      </div>
    </div>
  );
};

export default Countries;
