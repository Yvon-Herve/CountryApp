import React from "react";
import Pib from "../components/Pib";

const CountryInfo = ({ details }) => {
  const currencyKey = Object.keys(details.currencies || {})[0];
  const currency = details.currencies[currencyKey];
  const languages = details.languages
    ? Object.values(details.languages).join(", ")
    : "Aucune langue disponible";

  return (
    <div>
      <h1 className="text-2xl font-bold flex justify-center items-center">
        {details.translations.fra.common}
      </h1>
      <div className="p-4">
        <div className="flex justify-center items-center gap-3">
          <div>
            <img
              className="h-full w-full object-cover rounded-lg"
              src={details.flags.svg}
              alt={"Drapeau " + details.translations.fra.common}
              style={{ width: "200px" }}
            />
          </div>
          <div className="mt-4">
            <p>Langues : {languages}</p>
            <p className="">Capital : {details.capital}</p>
            <p className="">
              Population :{details.population.toLocaleString()}
            </p>
            <Pib pib={details.cca3} />
            {currency && (
              <p>
                <>Devise :</> {currency.name} ({currency.symbol})
              </p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <h3>Google maps</h3>
          <iframe
            title={`Carte de ${details.translations.fra.common}`}
            src={`https://www.google.com/maps/embed/v1/place?q=${encodeURIComponent(
              details.translations.fra.official
            )}&key=AIzaSyBBNMaq9Q3PooJDMjguPsdBJe1lCWV3pmM`}
            width="100%"
            height="200"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default CountryInfo;
