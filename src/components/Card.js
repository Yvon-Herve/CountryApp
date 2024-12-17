import React from "react";
import { Link } from "react-router-dom";

const Card = ({ countries }) => {
  return (
    <Link to={`/country/${countries.name.common}`}>
      <div className="relative group h-[100px] w-[160px] rounded-md overflow-hidden transition duration-300 transform hover:scale-110 hover:z-10">
        <img
          className="h-full w-full object-cover rounded-lg"
          src={countries.flags.svg}
          alt={"drapeau " + countries.translations.fra.common}
        />

        <div className="absolute inset-0 bg-black bg-opacity-70 text-white flex flex-col justify-center items-center opacity-0 transform scale-y-0 transition duration-300 group-hover:opacity-100 group-hover:scale-y-100">
          <h1 className="text-lg font-bold">
            {countries.translations.fra.common}
          </h1>
          <h4 className="text-sm">{countries.capital}</h4>
          <h5 className="text-sm">{countries.population.toLocaleString()}</h5>
        </div>
      </div>
    </Link>
  );
};

export default Card;
