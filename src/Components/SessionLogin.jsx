import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import moment from "moment";

const SessionLogin = () => {
  const [trades, setTrades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [tradesPerPage] = useState(10);
  const [tradesWithDuration, setTradesWithDuration] = useState([]);

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

  useEffect(() => {
    const fetchTrades = async () => {
      try {
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
        setIsLoading(false);
      }
    };

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
        <div className="form-trade-1"></div>
        <div className="form-trade-2"></div>
        <div className="form-trade-3"></div>
      </div>

      <div className="table-trade">
        {isLoading ? (
          <p>Chargement en cours...</p>
        ) : (
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
              {currentTrades.map((trade) => (
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
              ))}
            </tbody>
          </table>
        )}
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
