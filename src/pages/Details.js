import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navigation from "../components/Navigation";
import Loader from "../components/Loader";
import Credit from "../components/Credit";
import CountryInfo from "../components/CountryInfo";
import States from "../components/States";

const Details = () => {
  const { name } = useParams();
  const [details, setDetails] = useState(null);

  const getData = async () => {
    try {
      const res = await axios.get(
        `https://restcountries.com/v3.1/all?fields=name,capital,region,population,translations,flags${name}`
        // `https://restcountries.com/v3.1/name/${name}`
      );

      // Filtrer les résultats pour exclure les Îles mineures éloignées des États-Unis
      const filteredData = res.data.filter(
        (country) =>
          !country.translations.fra.common.includes(
            "Îles mineures éloignées des États-Unis"
          )
      );

      setDetails(filteredData.length > 0 ? filteredData[0] : null);
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    }
  };

  useEffect(() => {
    getData();
  }, [name]);

  if (!details) return <Loader setLoading={setDetails} />;

  return (
    <div className="bg-slate-900 min-h-screen flex flex-col text-white">
      {/* Navigation */}
      <Navigation />

      {/* Contenu principal */}
      <div className="flex-grow">
        <div className="flex flex-col items-center justify-center p-4">
          {/* Informations sur le pays */}
          <div className="w-full sm:max-w-lg md:max-w-2xl lg:max-w-4xl">
            <CountryInfo details={details} />
          </div>
        </div>

        {/* Section des États */}
        <div className="px-4 sm:px-8 md:px-16 pb-4">
          <States country={details.name.common} />
        </div>
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

export default Details;
