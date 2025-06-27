import { useEffect, useState } from "react";
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
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://restcountries.com/v3.1/name/${name}?fullText=true&fields=name,capital,region,population,translations,flags,continents`
      );

      const filteredData = res.data.filter(
        (country) =>
          !country.translations.fra.common.includes(
            "Îles mineures éloignées des États-Unis"
          )
      );

      setDetails(filteredData.length > 0 ? filteredData[0] : null);
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
      setDetails(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [name]);

  if (loading) return <Loader />;
  if (!details)
    return <p className="text-white text-center mt-10">Pays non trouvé</p>;

  return (
    <div className="bg-slate-900 min-h-screen flex flex-col text-white">
      <Navigation />

      <div className="flex-grow">
        <div className="flex flex-col items-center justify-center p-4">
          <div className="w-full sm:max-w-lg md:max-w-2xl lg:max-w-4xl">
            <CountryInfo details={details} />
          </div>
        </div>

        <div className="px-4 sm:px-8 md:px-16 pb-4">
          <States country={details.name.common} />
        </div>
      </div>

      <footer className="w-full py-4 text-center text-xs mt-auto">
        <div className="flex justify-center">
          <Credit />
        </div>
      </footer>
    </div>
  );
};

export default Details;
