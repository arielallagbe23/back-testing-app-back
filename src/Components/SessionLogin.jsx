import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import moment from "moment";
import AddTrade from "./AddTrade";
import "../App.css";
import "./AddTrade.css";
import { BarLoader } from "react-spinners";
import { css } from "@emotion/react"; // Ajoutez cette ligne pour résoudre l'erreur

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const calculateDuration = (date_entree, date_sortie) => {
  const entryDate = moment(date_entree);
  const exitDate = moment(date_sortie);
  const duration = moment.duration(exitDate.diff(entryDate));

  const years = duration.years();
  const months = duration.months();
  const days = duration.days();
  const hours = duration.hours();
  const minutes = duration.minutes();
  const formattedDuration = [];

  if (years > 0) {
    formattedDuration.push(`${years} ${years === 1 ? "year" : "years"}`);
  }
  if (months > 0) {
    formattedDuration.push(`${months} ${months === 1 ? "month" : "months"}`);
  }
  if (days > 0) {
    formattedDuration.push(`${days} ${days === 1 ? "day" : "days"}`);
  }
  if (hours > 0) {
    formattedDuration.push(`${hours} ${hours === 1 ? "hour" : "hours"}`);
  }
  if (minutes > 0) {
    formattedDuration.push(
      `${minutes} ${minutes === 1 ? "minute" : "minutes"}`
    );
  }

  return formattedDuration.join(", ");
};

const SessionLogin = () => {
  const [trades, setTrades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [tradesPerPage] = useState(10);
  const [selectedActif, setSelectedActif] = useState("");
  const [selectedStrategie, setSelectedStrategie] = useState("");
  const [selectedTimeframe, setSelectedTimeframe] = useState("");
  const [selectedTypeOrdre, setSelectedTypeOrdre] = useState("");
  const [selectedSituation, setSelectedSituation] = useState("");
  const [loading, setLoading] = useState(false); // Assurez-vous également de définir setLoading ici

  const { css } = require("react-spinners");

  const fetchTrades = async () => {
    try {
      setIsLoading(true); // Assurez-vous que setIsLoading est correctement déclaré et initialisé

      const response = await fetch("http://localhost:8000/api/all-Trades", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();

        const tradesWithDuration = data.map((trade) => ({
          ...trade,
          duration: calculateDuration(trade.date_entree, trade.date_sortie),
        }));

        setTrades(tradesWithDuration);
      } else {
        console.error(`Erreur HTTP! Statut: ${response.status}`);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des trades", error);
    } finally {
      setIsLoading(false); // Assurez-vous que setIsLoading est correctement déclaré et initialisé
    }
  };

  const handleActifChange = (e) => {
    setSelectedActif(e.target.value);
  };

  const handleStrategieChange = (e) => {
    setSelectedStrategie(e.target.value);
  };

  const handleTimeframeChange = (e) => {
    setSelectedTimeframe(e.target.value);
  };

  const handleTypeOrdreChange = (e) => {
    setSelectedTypeOrdre(e.target.value);
  };

  const handleSituationChange = (e) => {
    setSelectedSituation(e.target.value);
  };

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    // Ajoutez ici la logique pour traiter les données du formulaire
    console.log("Actif sélectionné :", selectedActif);
    console.log("Stratégie sélectionnée :", selectedStrategie);
    console.log("Timeframe sélectionné :", selectedTimeframe);
    console.log("Type d'Ordre sélectionné :", selectedTypeOrdre);
    console.log("Situation sélectionnée :", selectedSituation);
  };

  const handleTradeAdded = async (newTrade) => {
    // Calcul de la durée pour le nouveau trade
    const newTradeWithDuration = {
      ...newTrade,
      duration: calculateDuration(newTrade.date_entree, newTrade.date_sortie),
    };

    // Mise à jour de l'état local avec le nouveau trade
    setTrades((prevTrades) => [...prevTrades, newTradeWithDuration]);

    // Rafraîchissement des trades depuis le serveur
    await fetchTrades();
  };

  const refreshTrades = async () => {
    try {
      setIsLoading(true);
      await fetchTrades();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, []);

  const pageCount = Math.ceil(trades.length / tradesPerPage);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const currentTrades = trades.slice(
    (currentPage - 1) * tradesPerPage,
    currentPage * tradesPerPage
  );

  const getRowClassName = (resultat) => {
    switch (resultat) {
      case "SL":
        return "sl-row";
      case "TP":
        return "tp-row";
      case "BE":
        return "be-row";
      default:
        return "";
    }
  };

  return (
    <div className="grand-div">
      <div className="sub-navbar">
        <div className="button-demarrer-session">Demarrer une session</div>
      </div>

      <div className="grand-div-form">
        <AddTrade onTradeAdded={handleTradeAdded} setLoading={setLoading}/>
        <AddTrade onTradeAdded={handleTradeAdded} setLoading={setLoading}/>
        <AddTrade onTradeAdded={handleTradeAdded} setLoading={setLoading}/>
      </div>

      <div className="table-trade">
        <table>
          <thead>
            <tr>
              <th>Nom Actif</th>
              <th>Timeframe</th>
              <th>Point d'entrée</th>
              <th>TP</th>
              <th>SL</th>
              <th>Type Ordre</th>
              <th>Date Entrée</th>
              <th>Date Sortie</th>
              <th>Sens</th>
              <th>Type Situation</th>
              <th>Durée</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="11" style={{ textAlign: "center" }}>
                  <BarLoader
                    color={"#36D7B7"}
                    loading={isLoading}
                    css={override}
                  />
                </td>
              </tr>
            ) : (
              currentTrades.map((trade) => (
                <tr key={trade.id} className={getRowClassName(trade.resultats)}>
                  <td>{trade.nom_actif}</td>
                  <td>{trade.timeframe}</td>
                  <td>{trade.PE}</td>
                  <td>{trade.TP}</td>
                  <td>{trade.SL}</td>
                  <td>{trade.type_ordre}</td>
                  <td>{trade.date_entree}</td>
                  <td>{trade.date_sortie}</td>
                  <td>{trade.sens}</td>
                  <td>{trade.type_situation}</td>
                  <td>{trade.duration}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="centered-container">
        <ReactPaginate
          previousLabel={"<"}
          nextLabel={">"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageChange}
          containerClassName={"pagination"}
        />
      </div>
    </div>
  );
};

export default SessionLogin;
