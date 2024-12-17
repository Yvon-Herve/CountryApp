import React, { useEffect, useState } from "react";
import axios from "axios";

const Pib = ({ pib }) => {
  const [money, setMoney] = useState(null);

  const getMoney = async () => {
    try {
      // Envoi de la requête API avec le code du pays dynamique
      const res = await axios.get(
        `https://api.worldbank.org/v2/country/${pib}/indicator/NY.GDP.PCAP.CD?format=json`
      );

      // Récupération du PIB par habitant dans la réponse
      if (res.data && res.data[1]) {
        setMoney(res.data[1][0].value); // Accéder à la première donnée (index [1]) et au PIB (index [0])
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données PIB :", error);
    }
  };

  useEffect(() => {
    if (pib) {
      getMoney();
    }
  }, [pib]);

  return (
    <div className="text-white-700 flex gap-2">
      <p>PIB par habitant</p>
      {money ? (
        <ul>{money.toLocaleString()} USD</ul>
      ) : (
        <p>Chargement du PIB...</p>
      )}
    </div>
  );
};

export default Pib;
// **************
